import { PoolOperationType } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  LbpBuyExecutedData,
  LbpSellExecutedData,
} from '../../parsers/batchBlocksParser/types';
import { getAccount } from '../accounts';
import { handleLbpPoolVolumeUpdates } from '../pools/volume';
import { handleAssetVolumeUpdates } from '../assets/volume';
import { initLbpPoolOperation } from './common';

export async function lpbBuyExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.lbpAllBatchPools.values()].find(
    (p) =>
      (p.assetAId == eventParams.assetIn &&
        p.assetBId == eventParams.assetOut) ||
      (p.assetBId == eventParams.assetIn && p.assetAId == eventParams.assetOut)
  );

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const operationInstance = initLbpPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.blockHeader.hash || '',
    account: await getAccount(ctx, eventParams.who),
    assetIn: eventParams.assetIn,
    assetOut: eventParams.assetOut,
    amountIn: eventParams.amount,
    amountOut: eventParams.buyPrice,
    feeAsset: eventParams.feeAsset,
    feeAmount: eventParams.feeAmount,
    operationType: PoolOperationType.BUY,
    pool,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  await ctx.store.save(operationInstance);

  ctx.batchState.state = {
    lbpPoolOperations: [
      ...ctx.batchState.state.lbpPoolOperations,
      operationInstance,
    ],
  };

  await handleLbpPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}

export async function lpbSellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.lbpAllBatchPools.values()].find(
    (p) =>
      (p.assetAId == eventParams.assetIn &&
        p.assetBId == eventParams.assetOut) ||
      (p.assetBId == eventParams.assetIn && p.assetAId == eventParams.assetOut)
  );

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const operationInstance = initLbpPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.blockHeader.hash || '',
    account: await getAccount(ctx, eventParams.who),
    assetIn: eventParams.assetIn,
    assetOut: eventParams.assetOut,
    amountIn: eventParams.amount,
    amountOut: eventParams.salePrice,
    feeAsset: eventParams.feeAsset,
    feeAmount: eventParams.feeAmount,
    operationType: PoolOperationType.SELL,
    pool,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  await ctx.store.save(operationInstance);

  ctx.batchState.state = {
    lbpPoolOperations: [
      ...ctx.batchState.state.lbpPoolOperations,
      operationInstance,
    ],
  };

  await handleLbpPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}
