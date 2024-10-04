import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { lpbBuyExecuted, lpbSellExecuted } from './common';

export async function handlePoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const lbpPoolBuyExecutedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.LBP_BuyExecuted).values(),
  ];
  const lbpPoolSellExecutedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.LBP_SellExecuted).values(),
  ];

  for (const eventData of getOrderedListByBlockNumber(
    lbpPoolBuyExecutedEvents
  )) {
    await lpbBuyExecuted(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(
    lbpPoolSellExecutedEvents
  )) {
    await lpbSellExecuted(ctx, eventData);
  }

  await ctx.store.save([...ctx.batchState.state.assetVolumes.values()]);
  await ctx.store.save([...ctx.batchState.state.lbpPoolVolumes.values()]);
}
