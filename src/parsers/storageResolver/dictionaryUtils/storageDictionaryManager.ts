import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountBalances as AccountBalancesGql,
  GetOmnipoolBlocksStorageState,
  GetOmnipoolBlocksStorageStateQuery,
  GetOmnipoolBlocksStorageStateQueryVariables,
  GetStablepoolBlocksStorageState,
  GetStablepoolBlocksStorageStateQuery,
  GetStablepoolBlocksStorageStateQueryVariables,
  GetXykPoolBlocksStorageState,
  GetXykPoolBlocksStorageStateQuery,
  GetXykPoolBlocksStorageStateQueryVariables,
  InputMaybe,
  OmnipoolAssetDataOrderBy,
  OmnipoolAssetDatum,
  OmnipoolAssetDatumFilter,
  Stablepool as StablepoolGql,
  StablepoolFilter,
  StablepoolsOrderBy,
  XykPool as XykPoolGlq,
  XykPoolFilter,
  XykPoolsOrderBy,
} from './apiTypes/types';
import { QueriesHelper } from './queriesHelper';
import {
  PaginationConfig,
  PalletDictionaryCollectedData,
  ProcessingPallets,
} from './types';
import {
  AccountData,
  GetPoolAssetInfoInput,
  OmnipoolAssetData,
  OmnipoolAssetTradability,
  OmnipoolGetAssetDataInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
} from '../../types/storage';
import {
  BalancesTransferData,
  EventDataType,
  EventId,
  TokensTransferData,
} from '../../batchBlocksParser/types';
import { EventName } from '../../types/events';

// type PalletBatchStorageState<T = any> = T extends ProcessingPallets.XYK
//   ? Map<string, XykPoolGlq>
//   : T extends ProcessingPallets.OMNIPOOL
//     ? Map<string, OmnipoolAssetDatum>
//     : T extends ProcessingPallets.STABLESWAP
//       ? Map<string, StablepoolGql>
//       : never;

export type BatchStorageStateSectionNode<T> = T extends ProcessingPallets.XYK
  ? XykPoolGlq
  : T extends ProcessingPallets.OMNIPOOL
    ? OmnipoolAssetDatum
    : T extends ProcessingPallets.STABLESWAP
      ? StablepoolGql
      : never;

export class StorageDictionaryManager extends QueriesHelper {
  protected batchCtx: ProcessorContext<Store>;

  batchStorageState: Map<
    ProcessingPallets,
    Map<string, XykPoolGlq | OmnipoolAssetDatum | StablepoolGql>
  > = new Map([
    [ProcessingPallets.XYK, new Map()],
    [ProcessingPallets.OMNIPOOL, new Map()],
    [ProcessingPallets.STABLESWAP, new Map()],
  ]);

  constructor({ batchCtx }: { batchCtx: ProcessorContext<Store> }) {
    super({ batchCtx });
    this.batchCtx = batchCtx;
  }

  setBatchContext(batchCtx: ProcessorContext<Store>) {
    this.batchCtx = batchCtx;
  }

  getBatchStorageStatePart<T extends ProcessingPallets>(
    section: T
  ): Map<string, BatchStorageStateSectionNode<T>> {
    return (
      (this.batchStorageState.get(section) as Map<
        string,
        BatchStorageStateSectionNode<T>
      >) || new Map<string, BatchStorageStateSectionNode<T>>()
    );
  }

  wipeBatchStorageState() {
    this.batchStorageState = new Map([
      [ProcessingPallets.XYK, new Map()],
      [ProcessingPallets.OMNIPOOL, new Map()],
      [ProcessingPallets.STABLESWAP, new Map()],
    ]);
  }

  async fetchBatchStorageStateAllPallets({
    blockNumberFrom,
    blockNumberTo,
  }: {
    blockNumberFrom: number;
    blockNumberTo: number;
  }) {
    const fetchAllXykPoolsPaginated = async ({
      pageSize,
      offset,
    }: PaginationConfig) => {
      let filter: InputMaybe<XykPoolFilter> = { or: [] };
      const xykPoolIdsForStoragePrefetch =
        this.batchCtx.batchState.state.xykPoolIdsForStoragePrefetch;

      if (xykPoolIdsForStoragePrefetch.size > 30) {
        const filterParams = this.getGenericFilterParams<string>(
          xykPoolIdsForStoragePrefetch
        );
        filter = {
          poolAddress: {
            in: [...new Set(filterParams.ids).values()],
          },
          paraChainBlockHeight: {
            greaterThanOrEqualTo: filterParams.fromBlockNumber,
          },
          and: [
            {
              poolAddress: {
                in: [...new Set(filterParams.ids).values()],
              },
              paraChainBlockHeight: {
                lessThanOrEqualTo: filterParams.toBlockNumber,
              },
            },
          ],
        };
      } else {
        xykPoolIdsForStoragePrefetch.forEach((poolIds, blockNumber) => {
          filter!.or!.push({
            paraChainBlockHeight: { equalTo: blockNumber },
            poolAddress: { in: [...poolIds.ids.values()] },
          });
        });
      }

      const resp = await this.dictionaryGqlRequest<
        GetXykPoolBlocksStorageStateQuery,
        GetXykPoolBlocksStorageStateQueryVariables
      >({
        query: GetXykPoolBlocksStorageState,
        variables: {
          filter,
          orderBy: XykPoolsOrderBy.ParaChainBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: ProcessingPallets.XYK,
      });
      return {
        data: resp.data && resp.data.xykPools ? resp.data.xykPools.nodes : [],
        totalCount:
          resp.data && resp.data.xykPools ? resp.data.xykPools.totalCount : 0,
      };
    };

    const fetchAllOmnipoolAssetsPaginated = async ({
      pageSize,
      offset,
    }: PaginationConfig) => {
      let filter: InputMaybe<OmnipoolAssetDatumFilter> = { or: [] };
      const omnipoolAssetIdsForStoragePrefetch =
        this.batchCtx.batchState.state.omnipoolAssetIdsForStoragePrefetch;

      /**
       * We need adjust filter based on number of blocks which must be filtered.
       * Dictionary API will go through Time out error with big amount of
       * filtering conditions. So we must fetch redundant data with more generic
       * filter.
       */
      if (omnipoolAssetIdsForStoragePrefetch.size > 30) {
        const filterParams = this.getGenericFilterParams<number>(
          omnipoolAssetIdsForStoragePrefetch
        );

        filter = {
          assetId: {
            in: [...new Set(filterParams.ids).values()],
          },
          paraChainBlockHeight: {
            greaterThanOrEqualTo: filterParams.fromBlockNumber,
          },
          and: [
            {
              assetId: {
                in: [...new Set(filterParams.ids).values()],
              },
              paraChainBlockHeight: {
                lessThanOrEqualTo: filterParams.toBlockNumber,
              },
            },
          ],
        };
      } else {
        omnipoolAssetIdsForStoragePrefetch.forEach((poolIds, blockNumber) => {
          filter!.or!.push({
            paraChainBlockHeight: { equalTo: blockNumber },
            assetId: { in: [...poolIds.ids.values()] },
          });
        });
      }
      const resp = await this.dictionaryGqlRequest<
        GetOmnipoolBlocksStorageStateQuery,
        GetOmnipoolBlocksStorageStateQueryVariables
      >({
        query: GetOmnipoolBlocksStorageState,
        variables: {
          filter,
          orderBy: OmnipoolAssetDataOrderBy.ParaChainBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: ProcessingPallets.OMNIPOOL,
      });
      return {
        data:
          resp.data && resp.data.omnipoolAssetData
            ? resp.data.omnipoolAssetData.nodes
            : [],
        totalCount:
          resp.data && resp.data.omnipoolAssetData
            ? resp.data.omnipoolAssetData.totalCount
            : 0,
      };
    };

    const fetchAllStablepoolAssetsPaginated = async ({
      pageSize,
      offset,
    }: PaginationConfig) => {
      let filter: InputMaybe<StablepoolFilter> = { or: [] };
      const stablepoolIdsForStoragePrefetch =
        this.batchCtx.batchState.state.stablepoolIdsForStoragePrefetch;

      if (stablepoolIdsForStoragePrefetch.size > 30) {
        const filterParams = this.getGenericFilterParams<number>(
          stablepoolIdsForStoragePrefetch
        );
        filter = {
          poolId: {
            in: [...new Set(filterParams.ids).values()],
          },
          paraChainBlockHeight: {
            greaterThanOrEqualTo: filterParams.fromBlockNumber,
          },
          and: [
            {
              poolId: {
                in: [...new Set(filterParams.ids).values()],
              },
              paraChainBlockHeight: {
                lessThanOrEqualTo: filterParams.toBlockNumber,
              },
            },
          ],
        };
      } else {
        stablepoolIdsForStoragePrefetch.forEach((poolIds, blockNumber) => {
          filter!.or!.push({
            paraChainBlockHeight: { equalTo: blockNumber },
            poolId: { in: [...poolIds.ids.values()] },
          });
        });
      }

      const resp = await this.dictionaryGqlRequest<
        GetStablepoolBlocksStorageStateQuery,
        GetStablepoolBlocksStorageStateQueryVariables
      >({
        query: GetStablepoolBlocksStorageState,
        variables: {
          filter,
          orderBy: StablepoolsOrderBy.ParaChainBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: ProcessingPallets.STABLESWAP,
      });

      // console.dir(resp.data, { depth: null });
      return {
        data:
          resp.data && resp.data.stablepools ? resp.data.stablepools.nodes : [],
        totalCount:
          resp.data && resp.data.stablepools
            ? resp.data.stablepools.totalCount
            : 0,
      };
    };

    const allXykPoolStorageFetchPromise = async () => {
      if (!this.batchCtx.appConfig.PROCESS_XYK_POOLS) return [];
      const data: XykPoolGlq[] = [];
      for await (const page of this.fetchAllPages({
        limit: 1000,
        requestPromise: fetchAllXykPoolsPaginated,
      })) {
        if (!page) continue;
        data.push(...(page as XykPoolGlq[]));
      }
      return { pallet: ProcessingPallets.XYK, data: data.flat() };
    };

    const allOmnipoolStorageFetchPromise = async () => {
      if (
        !this.batchCtx.appConfig.PROCESS_OMNIPOOLS ||
        this.batchCtx.batchState.state.omnipoolAssetIdsForStoragePrefetch
          .size === 0
      )
        return [];
      const data = [];
      for await (const page of this.fetchAllPages({
        limit: 1000,
        requestPromise: fetchAllOmnipoolAssetsPaginated,
      })) {
        data.push(page);
      }
      return { pallet: ProcessingPallets.OMNIPOOL, data: data.flat() };
    };
    const allStablepoolStorageFetchPromise = async () => {
      if (
        !this.batchCtx.appConfig.PROCESS_STABLEPOOLS ||
        this.batchCtx.batchState.state.stablepoolIdsForStoragePrefetch.size ===
          0
      )
        return [];
      const data = [];
      for await (const page of this.fetchAllPages({
        limit: 1000,
        requestPromise: fetchAllStablepoolAssetsPaginated,
      })) {
        data.push(page);
      }
      return { pallet: ProcessingPallets.STABLESWAP, data: data.flat() };
    };

    console.time('Dictionary API call executed in');
    const fullResponse = await Promise.all([
      allXykPoolStorageFetchPromise(),
      allOmnipoolStorageFetchPromise(),
      allStablepoolStorageFetchPromise(),
    ]);

    console.timeEnd('Dictionary API call executed in');
    // @ts-ignore
    this.decorateDictionaryData(fullResponse);
  }

  decorateDictionaryData(rawData: Array<PalletDictionaryCollectedData>) {
    for (const palletData of rawData) {
      switch (palletData.pallet) {
        case ProcessingPallets.XYK:
          this.batchStorageState.set(
            ProcessingPallets.XYK,
            new Map(
              (palletData.data as XykPoolGlq[]).map((item) => [item.id, item])
            )
          );
          break;
        case ProcessingPallets.OMNIPOOL:
          this.batchStorageState.set(
            ProcessingPallets.OMNIPOOL,
            new Map(
              (palletData.data as OmnipoolAssetDatum[]).map((item) => [
                item.id,
                item,
              ])
            )
          );
          break;
        case ProcessingPallets.STABLESWAP:
          this.batchStorageState.set(
            ProcessingPallets.STABLESWAP,
            new Map(
              (palletData.data as StablepoolGql[]).map((item) => [
                item.id,
                item,
              ])
            )
          );
          break;
        default:
      }
    }
  }

  getStableswapPoolData({
    assetId,
    block,
  }: StablepoolGetPoolDataInput): StablepoolInfo | null {
    const node = this.getBatchStorageStatePart(
      ProcessingPallets.STABLESWAP
    ).get(`${assetId}-${block.height}`);

    if (!node) return null;

    if (
      !node.stablepoolAssetDataByPoolId.nodes ||
      node.stablepoolAssetDataByPoolId.nodes.length === 0
    )
      return null;

    return {
      assets: node.stablepoolAssetDataByPoolId.nodes.map(
        (asset) => asset!.assetId
      ),
      initialAmplification: node.initialAmplification,
      finalAmplification: node.finalAmplification,
      initialBlock: node.initialBlock,
      finalBlock: node.finalBlock,
      fee: node.fee,
    };
  }

  getStableswapPoolAssetInfo({
    poolId,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    const node = this.getBatchStorageStatePart(
      ProcessingPallets.STABLESWAP
    ).get(`${poolId}-${block.height}`);

    if (!node) return null;

    if (
      !node.stablepoolAssetDataByPoolId.nodes ||
      node.stablepoolAssetDataByPoolId.nodes.length === 0
    )
      return null;

    const assetInfo = node.stablepoolAssetDataByPoolId.nodes.find(
      (asset) => asset?.assetId === assetId
    );
    if (!assetInfo || !assetInfo.balances) return null;
    const balances = assetInfo.balances as AccountBalancesGql;
    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }

  getOmnipoolAssetInfo({
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    const node = this.getBatchStorageStatePart(ProcessingPallets.OMNIPOOL).get(
      `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${assetId}-${block.height}`
    );

    if (!node) return null;
    const { balances } = node;

    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }

  getOmnipoolAssetState({
    assetId,
    block,
  }: OmnipoolGetAssetDataInput): OmnipoolAssetData | null {
    const node = this.getBatchStorageStatePart(ProcessingPallets.OMNIPOOL).get(
      `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${assetId}-${block.height}`
    );

    if (!node) return null;
    const { assetState } = node;

    return {
      hubReserve: BigInt(assetState.hubReserve ?? 0),
      shares: BigInt(assetState.shares ?? 0),
      protocolShares: BigInt(assetState.protocolShares ?? 0),
      cap: BigInt(assetState.cap ?? 0),
      tradable: { bits: assetState.tradable.tradable ?? 0 },
    };
  }
}
