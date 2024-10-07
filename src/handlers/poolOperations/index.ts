import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { lpbBuyExecuted, lpbSellExecuted } from './lbpPoolOperation';
import { xykBuyExecuted, xykSellExecuted } from './xykPoolOperation';

export async function handlePoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (ctx.appConfig.PROCESS_LBP_POOLS)
    await handleLbpPoolOperations(ctx, parsedEvents);

  if (ctx.appConfig.PROCESS_XYK_POOLS)
    await handleXykPoolOperations(ctx, parsedEvents);

  await ctx.store.save([...ctx.batchState.state.assetVolumes.values()]);
  await ctx.store.save([...ctx.batchState.state.lbpPoolVolumes.values()]);
  await ctx.store.save([...ctx.batchState.state.xykPoolVolumes.values()]);
}

export async function handleXykPoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.XYK_BuyExecuted).values(),
  ])) {
    await xykBuyExecuted(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.XYK_SellExecuted).values(),
  ])) {
    await xykSellExecuted(ctx, eventData);
  }
}

export async function handleLbpPoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.LBP_BuyExecuted).values(),
  ])) {
    await lpbBuyExecuted(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.LBP_SellExecuted).values(),
  ])) {
    await lpbSellExecuted(ctx, eventData);
  }
}
