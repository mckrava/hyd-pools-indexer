import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import {
  OmnipoolBuyExecutedData,
  OmnipoolSellExecutedData,
} from '../../parsers/batchBlocksParser/types';
import { getAccount } from '../accounts';
import {
  OmnipoolAsset,
  OmnipoolAssetOperation,
  PoolOperationType,
} from '../../model';
import { handleOmnipoolAssetVolumeUpdates } from '../volumes';

export async function handleOmnioolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_BuyExecuted)
      .values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_SellExecuted)
      .values(),
  ])) {
    await omnipoolBuySellExecuted(ctx, eventData);
  }
}

export async function omnipoolBuySellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolBuyExecutedData | OmnipoolSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let assetInEntity =
    ctx.batchState.state.omnipoolAssets.get(
      `${ctx.appConfig.OMNIPOOL_ADDRESS}-${eventParams.assetIn}`
    ) ||
    (await ctx.store.findOne(OmnipoolAsset, {
      where: { assetId: eventParams.assetIn },
    }));

  let assetOutEntity =
    ctx.batchState.state.omnipoolAssets.get(
      `${ctx.appConfig.OMNIPOOL_ADDRESS}-${eventParams.assetOut}`
    ) ||
    (await ctx.store.findOne(OmnipoolAsset, {
      where: { assetId: eventParams.assetOut },
    }));

  if (!assetInEntity && !assetOutEntity) return;

  const operationInstance = new OmnipoolAssetOperation({
    id: eventMetadata.id,
    account: await getAccount(ctx, eventParams.who),
    assetIn: assetInEntity,
    assetOut: assetOutEntity,
    assetInAmount: eventParams.amountIn,
    assetOutAmount: eventParams.amountOut,
    assetFeeAmount: eventParams.assetFeeAmount,
    protocolFeeAmount: eventParams.protocolFeeAmount,
    hubAmountIn: eventParams.hubAmountIn,
    hubAmountOut: eventParams.hubAmountOut,
    type: PoolOperationType.BUY,
    extrinsicHash: eventMetadata.extrinsic?.hash,
    indexInBlock: eventMetadata.indexInBlock,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state = {
    omnipoolAssetOperations: [
      ...ctx.batchState.state.omnipoolAssetOperations,
      operationInstance,
    ],
  };

  await handleOmnipoolAssetVolumeUpdates({ ctx, assetOperation: operationInstance });
  //
  // await handleAssetVolumeUpdates(ctx, operationInstance);
}
