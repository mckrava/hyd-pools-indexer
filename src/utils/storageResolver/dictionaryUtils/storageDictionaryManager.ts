import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  GetOmnipoolBlocksStorageState,
  GetOmnipoolBlocksStorageStateQuery,
  GetOmnipoolBlocksStorageStateQueryVariables,
  GetStablepoolBlocksStorageState,
  GetStablepoolBlocksStorageStateQuery,
  GetStablepoolBlocksStorageStateQueryVariables,
  GetXykPoolBlocksStorageState,
  GetXykPoolBlocksStorageStateQuery,
  GetXykPoolBlocksStorageStateQueryVariables,
  OmnipoolAssetDatum,
  Stablepool as StablepoolGql,
  XykPool as XykPoolGlq,
} from './apiTypes/types';
import { QueriesHelper } from './queriesHelper';

type PaginationConfig = {
  pageSize: number;
  offset: number;
};

type PalletDictionaryCollectedData = {
  pallet: ProcessingPallets;
  data: StablepoolGql[] | XykPoolGlq[] | OmnipoolAssetDatum[];
};

enum ProcessingPallets {
  OMNIPOOL = 'OMNIPOOL',
  XYK = 'XYK',
  STABLESWAP = 'STABLESWAP',
}

// type PalletBatchStorageState<T = any> = T extends ProcessingPallets.XYK
//   ? Map<string, XykPoolGlq>
//   : T extends ProcessingPallets.OMNIPOOL
//     ? Map<string, OmnipoolAssetDatum>
//     : T extends ProcessingPallets.STABLESWAP
//       ? Map<string, StablepoolGql>
//       : never;

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
    super();
    this.batchCtx = batchCtx;
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
      const resp = await this.gqlRequest<
        GetXykPoolBlocksStorageStateQuery,
        GetXykPoolBlocksStorageStateQueryVariables
      >({
        query: GetXykPoolBlocksStorageState,
        variables: {
          filter: {
            paraChainBlockHeight: { greaterThanOrEqualTo: blockNumberFrom },
            and: [
              { paraChainBlockHeight: { lessThanOrEqualTo: blockNumberTo } },
            ],
          },
          first: pageSize,
          offset,
        },
        queryUrl:
          this.batchCtx.appConfig.HYDRATION_STORAGE_DICTIONARY_XYKPOOL_URL,
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
      const resp = await this.gqlRequest<
        GetOmnipoolBlocksStorageStateQuery,
        GetOmnipoolBlocksStorageStateQueryVariables
      >({
        query: GetOmnipoolBlocksStorageState,
        variables: {
          filter: {
            paraChainBlockHeight: { greaterThanOrEqualTo: blockNumberFrom },
            and: [
              { paraChainBlockHeight: { lessThanOrEqualTo: blockNumberTo } },
            ],
          },
          first: pageSize,
          offset,
        },
        queryUrl:
          this.batchCtx.appConfig.HYDRATION_STORAGE_DICTIONARY_OMNIPOOL_URL,
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
      const resp = await this.gqlRequest<
        GetStablepoolBlocksStorageStateQuery,
        GetStablepoolBlocksStorageStateQueryVariables
      >({
        query: GetStablepoolBlocksStorageState,
        variables: {
          filter: {
            paraChainBlockHeight: { greaterThanOrEqualTo: blockNumberFrom },
            and: [
              { paraChainBlockHeight: { lessThanOrEqualTo: blockNumberTo } },
            ],
          },
          first: pageSize,
          offset,
        },
        queryUrl:
          this.batchCtx.appConfig.HYDRATION_STORAGE_DICTIONARY_STABLEPOOL_URL,
      });
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
      const data: XykPoolGlq[] = [];
      for await (const page of this.fetchAllPages({
        limit: 100,
        requestPromise: fetchAllXykPoolsPaginated,
      })) {
        if (!page) continue;
        data.push(...(page as XykPoolGlq[]));
      }
      return { pallet: ProcessingPallets.XYK, data: data.flat() };
    };

    const allOmnipoolStorageFetchPromise = async () => {
      const data = [];
      for await (const page of this.fetchAllPages({
        limit: 100,
        requestPromise: fetchAllOmnipoolAssetsPaginated,
      })) {
        data.push(page);
      }
      return { pallet: ProcessingPallets.OMNIPOOL, data: data.flat() };
    };
    const allStablepoolStorageFetchPromise = async () => {
      const data = [];
      for await (const page of this.fetchAllPages({
        limit: 100,
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

    console.dir(this.batchStorageState, { depth: null });
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
}
