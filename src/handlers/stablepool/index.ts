import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { stablepoolCreated } from './stablepool';

export async function handleStablepools(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_STABLEPOOLS) return;

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Stableswap_PoolCreated)
      .values(),
  ])) {
    await stablepoolCreated(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.stablepoolAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.stablepoolIdsToSave.has(pool.id)
    )
  );
  ctx.batchState.state = { stablepoolIdsToSave: new Set() };

  await ctx.store.save([
    ...ctx.batchState.state.stablepoolAssetsAllBatch.values(),
  ]);
}
//
// export async function handleStablepoolOperations(
//   ctx: ProcessorContext<Store>,
//   parsedEvents: BatchBlocksParsedDataManager
// ) {
//   if (!ctx.appConfig.PROCESS_OMNIPOOLS) return;
//
//   for (const eventData of getOrderedListByBlockNumber([
//     ...parsedEvents
//       .getSectionByEventName(EventName.Omnipool_TokenAdded)
//       .values(),
//   ])) {
//     await omnipoolTokenAdded(ctx, eventData);
//   }
//
//   for (const eventData of getOrderedListByBlockNumber([
//     ...parsedEvents
//       .getSectionByEventName(EventName.Omnipool_TokenRemoved)
//       .values(),
//   ])) {
//     await omnipoolTokenRemoved(ctx, eventData);
//   }
//
//   await ctx.store.save(
//     [...ctx.batchState.state.omnipoolAssets.values()].filter((asset) =>
//       ctx.batchState.state.omnipoolAssetIdsToSave.has(asset.id)
//     )
//   );
//   ctx.batchState.state = { omnipoolAssetIdsToSave: new Set() };
// }
