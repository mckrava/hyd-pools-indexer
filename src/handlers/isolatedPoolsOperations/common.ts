import {
  Account,
  LbpPool,
  LbpPoolOperation,
  PoolOperationType,
  XykPool,
  XykPoolOperation,
} from '../../model';
import { BigNumber } from 'bignumber.js';

export function initLbpPoolOperation({
  eventId,
  hash,
  indexInBlock,
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
  indexInBlock: number;
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
    indexInBlock,
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

export function initXykPoolOperation({
  eventId,
  hash,
  indexInBlock,
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
  indexInBlock: number;
  account: Account;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  feeAsset: number;
  feeAmount: bigint;
  operationType: PoolOperationType;
  pool: XykPool;
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
}) {
  return new XykPoolOperation({
    id: eventId,
    account: account,
    extrinsicHash: hash,
    indexInBlock,
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
