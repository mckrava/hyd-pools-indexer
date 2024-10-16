import { Event } from '@subsquid/substrate-processor';
import { Account, Pool, Swap, SwapType } from '../model';
import { ProcessorBlockData } from '../types';
import { BigNumber } from 'bignumber.js';

export function initSwap(
  event: Event,
  hash: string,
  account: Account,
  assetIn: number,
  assetOut: number,
  amountIn: bigint,
  amountOut: bigint,
  feeAsset: number,
  feeAmount: bigint,
  swapType: SwapType,
  pool: Pool,
  blockData: ProcessorBlockData
) {
  return new Swap({
    id: event.id,
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
    relayChainBlockHeight: blockData.relayChainBlockHeight || 0,
    paraChainBlockHeight: blockData.paraChainBlockHeight,
    type: swapType,
  });
}
