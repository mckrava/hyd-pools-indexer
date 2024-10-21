import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../utils/helpers';
import {
  StableswapBuyExecutedData,
  StableswapSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { getAccount } from '../../accounts';
import { PoolOperationType, StablepoolOperation } from '../../../model';
import { getAsset } from '../../assets/assetRegistry';
import { handleStablepoolVolumeUpdates } from '../../volumes/stablepoolVolume';
import { getStablepool } from '../../stablepool/stablepool';

export async function handleStablepoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Stableswap_BuyExecuted)
      .values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Stableswap_SellExecuted)
      .values(),
  ])) {
    await stablepoolBuySellExecuted(ctx, eventData);
  }
}

export async function stablepoolBuySellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: StableswapBuyExecutedData | StableswapSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let assetInEntity = await getAsset({ ctx, id: eventParams.assetIn });
  let assetOutEntity = await getAsset({ ctx, id: eventParams.assetOut });
  const pool = await getStablepool(ctx, eventParams.poolId);

  if (!assetInEntity || !assetOutEntity || !pool) return;

  const operationInstance = new StablepoolOperation({
    id: eventMetadata.id,
    account: await getAccount(ctx, eventParams.who),
    pool,
    assetIn: assetInEntity,
    assetOut: assetOutEntity,
    assetInAmount: eventParams.amountIn,
    assetOutAmount: eventParams.amountOut,
    assetFeeAmount: eventParams.fee,
    type:
      eventMetadata.name === EventName.Omnipool_BuyExecuted
        ? PoolOperationType.BUY
        : PoolOperationType.SELL,
    extrinsicHash: eventMetadata.extrinsic?.hash,
    indexInBlock: eventMetadata.indexInBlock,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state = {
    stablepoolOperations: [
      ...ctx.batchState.state.stablepoolOperations,
      operationInstance,
    ],
  };

  await handleStablepoolVolumeUpdates({
    ctx,
    poolOperation: operationInstance,
  });
  //
  // await handleAssetVolumeUpdates(ctx, operationInstance);
}
