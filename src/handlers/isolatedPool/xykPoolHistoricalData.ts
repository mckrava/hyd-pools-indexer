import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import parsers from '../../parsers';
import { XykPoolHistoricalData } from '../../model';
import { getAsset } from '../assets/assetRegistry';
import { getXykPool } from './xykPool';

export async function handleXykPoolHistoricalData(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_XYK_POOLS) return;

  const predefinedEntities = await Promise.all(
    [...ctx.batchState.state.xykPoolIdsForStoragePrefetch.entries()]
      .map(([blockNumber, { blockHeader, ids }]) =>
        [...ids.values()].map((poolId) => ({
          blockHeader: blockHeader,
          poolId,
        }))
      )

      .flat()
      .map(async ({ poolId, blockHeader }) => {
        const pool = await getXykPool({ ctx, id: poolId });
        let assetAId = pool?.assetAId ?? null;
        let assetBId = pool?.assetBId ?? null;

        if (!pool) {
          const poolStorageData = await parsers.storage.xyk.getPoolAssets({
            block: blockHeader,
            poolAddress: poolId,
          });
          if (
            !poolStorageData ||
            !poolStorageData.assetAId ||
            !poolStorageData.assetBId
          )
            return null;
          assetAId = poolStorageData.assetAId;
          assetBId = poolStorageData.assetBId;
        }

        const assetsData = new Map(
          (
            await Promise.all(
              [assetAId, assetBId].map(async (assetId) => ({
                assetId,
                data: await parsers.storage.xyk.getPoolAssetInfo({
                  assetId: assetId!,
                  block: blockHeader,
                  poolAddress: poolId,
                }),
              }))
            )
          )
            .filter((assetData) => !!assetData)
            .map((assetData) => [assetData.assetId, assetData.data])
        );

        if (!pool) return null; // TODO must be fixed by ensuring XykPool entity inside getXykPool function

        const assetAEntity = await getAsset({
          ctx,
          id: assetAId!,
          ensure: true,
          blockHeader,
        });
        const assetBEntity = await getAsset({
          ctx,
          id: assetBId!,
          ensure: true,
          blockHeader,
        });

        if (!assetAEntity || !assetBEntity) return null;

        const poolHistoricalDataEntity = new XykPoolHistoricalData({
          id: `${poolId}-${blockHeader.height}`,
          pool: pool,
          assetA: assetAEntity,
          assetB: assetBEntity,
          assetABalance: assetsData.get(assetAId!)?.free ?? BigInt(0),
          assetBBalance: assetsData.get(assetBId!)?.free ?? BigInt(0),
          relayChainBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraChainBlockHeight: blockHeader.height,
        });

        return poolHistoricalDataEntity;
      })
  );

  const xykPoolAllHistoricalData =
    ctx.batchState.state.xykPoolAllHistoricalData;

  xykPoolAllHistoricalData.push(...predefinedEntities.filter((item) => !!item));

  ctx.batchState.state = {
    xykPoolAllHistoricalData,
  };

  await ctx.store.save(xykPoolAllHistoricalData);
}
