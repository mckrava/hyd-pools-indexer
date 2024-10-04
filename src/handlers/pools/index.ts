import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { lpbPoolCreated, lpbPoolUpdated } from './lbpPool';
import { LbpPool } from '../../model';

export async function handlePools(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const lbpPoolCreatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.LBP_PoolCreated).values(),
  ];
  const lbpPoolUpdatedEvents = [
    ...parsedEvents.getSectionByEventName(EventName.LBP_PoolUpdated).values(),
  ];

  ctx.batchState.state = {
    lbpExistingPools: new Map(
      (await ctx.store.find(LbpPool)).map((p) => [p.id, p])
    ),
  };

  for (const eventData of getOrderedListByBlockNumber(lbpPoolCreatedEvents)) {
    await lpbPoolCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(lbpPoolUpdatedEvents)) {
    await lpbPoolUpdated(ctx, eventData);
  }
}
