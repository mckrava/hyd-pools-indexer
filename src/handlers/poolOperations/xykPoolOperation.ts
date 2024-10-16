import {
  Account,
  LbpPool,
  LbpPoolOperation,
  PoolOperationType,
} from '../../model';
import { BigNumber } from 'bignumber.js';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  XykBuyExecutedData,
  XykSellExecutedData,
} from '../../parsers/batchBlocksParser/types';
import { getAccount } from '../accounts';
import { handleXykPoolVolumeUpdates } from '../pools/volume';
import { handleAssetVolumeUpdates } from '../assets/volume';
import { initXykPoolOperation } from './common';

export async function xykBuyExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: XykBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.xykAllBatchPools.values()].find(
    (p) => p.id === eventParams.pool
  );

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const operationInstance = initXykPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.blockHeader.hash || '',
    account: await getAccount(ctx, eventParams.who),
    assetIn: eventParams.assetIn,
    assetOut: eventParams.assetOut,
    amountIn: eventParams.buyPrice,
    amountOut: eventParams.amount,
    feeAsset: eventParams.feeAsset,
    feeAmount: eventParams.feeAmount,
    operationType: PoolOperationType.BUY,
    pool,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state = {
    xykPoolOperations: [
      ...ctx.batchState.state.xykPoolOperations,
      operationInstance,
    ],
  };

  await handleXykPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}

export async function xykSellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: XykSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.xykAllBatchPools.values()].find(
    (p) => p.id === eventParams.pool
  );

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const operationInstance = initXykPoolOperation({
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

  ctx.batchState.state = {
    xykPoolOperations: [
      ...ctx.batchState.state.xykPoolOperations,
      operationInstance,
    ],
  };

  await handleXykPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}
