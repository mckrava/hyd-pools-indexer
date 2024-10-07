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
  LbpBuyExecutedData,
  LbpSellExecutedData,
} from '../../parsers/batchBlocksParser/types';
import { getAccount } from '../accounts';
import { handleLbpPoolVolumeUpdates } from '../pools/volume';
import { handleAssetVolumeUpdates } from '../assets/volume';

export async function lpbBuyExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.lbpExistingPools.values()].find(
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

  const operationInstance = initPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.block.hash || '',
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
    paraChainBlockHeight: eventMetadata.block.height,
  });

  await ctx.store.save(operationInstance);

  ctx.batchState.state = {
    lbpPoolOperations: [
      ...ctx.batchState.state.lbpPoolOperations,
      operationInstance,
    ],
  };

  await handleLbpPoolVolumeUpdates(ctx, operationInstance);

  await handleAssetVolumeUpdates(ctx, operationInstance);
}

export async function lpbSellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.lbpExistingPools.values()].find(
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

  const operationInstance = initPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.block.hash || '',
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
    paraChainBlockHeight: eventMetadata.block.height,
  });

  await ctx.store.save(operationInstance);

  ctx.batchState.state = {
    lbpPoolOperations: [
      ...ctx.batchState.state.lbpPoolOperations,
      operationInstance,
    ],
  };

  await handleLbpPoolVolumeUpdates(ctx, operationInstance);

  await handleAssetVolumeUpdates(ctx, operationInstance);
}

export function initPoolOperation({
  eventId,
  hash,
  account,
  assetIn,
  assetOut,
  amountIn,
  amountOut,
  feeAsset,
  feeAmount,
  operationType,
  pool,
  relayChainBlockHeight,
  paraChainBlockHeight,
}: {
  eventId: string;
  hash: string;
  account: Account;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  feeAsset: number;
  feeAmount: bigint;
  operationType: PoolOperationType;
  pool: LbpPool;
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
}) {
  return new LbpPoolOperation({
    id: eventId,
    account: account,
    extrinsicHash: hash,
    assetInId: assetIn,
    assetInAmount: amountIn,
    assetInFee: feeAsset === assetIn ? feeAmount : BigInt(0),
    assetOutId: assetOut,
    assetOutAmount: amountOut,
    assetOutFee: feeAsset === assetOut ? feeAmount : BigInt(0),
    swapPrice: new BigNumber(amountIn.toString())
      .div(amountOut.toString())
      .toNumber(),
    pool: pool,
    relayChainBlockHeight,
    paraChainBlockHeight,
    type: operationType,
  });
}
