import { PoolData } from './common';
import { events } from '../../typegenTypes';
import { sts } from '../../typegenTypes/support';
import * as v115 from '../../typegenTypes/v115';
import * as v201 from '../../typegenTypes/v201';

export const EventNameConst = {
  [events.lbp.poolCreated.name]: events.lbp.poolCreated.name,
};

export enum EventName {
  'Balances_Transfer' = 'Balances.Transfer',
  'Tokens_Transfer' = 'Tokens.Transfer',

  'LBP_PoolCreated' = 'LBP.PoolCreated',
  'LBP_PoolUpdated' = 'LBP.PoolUpdated',
  'LBP_BuyExecuted' = 'LBP.BuyExecuted',
  'LBP_SellExecuted' = 'LBP.SellExecuted',

  'XYK_PoolCreated' = 'XYK.PoolCreated',
  'XYK_PoolDestroyed' = 'XYK.Destroyed',
  'XYK_BuyExecuted' = 'XYK.BuyExecuted',
  'XYK_SellExecuted' = 'XYK.SellExecuted',

  'Omnipool_TokenAdded' = 'Omnipool.TokenAdded',
  'Omnipool_TokenRemoved' = 'Omnipool.TokenRemoved',
  'Omnipool_BuyExecuted' = 'Omnipool.BuyExecuted',
  'Omnipool_SellExecuted' = 'Omnipool.SellExecuted',
}

export type RelayChainInfo = {
  parachainBlockNumber: number;
  relaychainBlockNumber: number;
};

export type LbpPoolCreatedEventParams = {
  pool: string;
  data: PoolData;
};

export type LbpPoolUpdatedEventParams = {
  pool: string;
  data: PoolData;
};

export type TokensTransferEventParams = {
  currencyId: number;
  from: string;
  to: string;
  amount: bigint;
};

export type BalancesTransferEventParams = {
  from: string;
  to: string;
  amount: bigint;
};

export type LbpBuyExecutedEventParams = {
  who: string;
  assetOut: number;
  assetIn: number;
  amount: bigint;
  buyPrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type LbpSellExecutedEventParams = {
  who: string;
  assetOut: number;
  assetIn: number;
  amount: bigint;
  salePrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type XykPoolCreatedEventParams = {
  pool: string;
  who: string;
  assetA: number;
  assetB: number;
  initialSharesAmount: bigint;
  shareToken: number;
};

export type XykPoolDestroyedEventParams = {
  pool: string;
  who: string;
  assetA: number;
  assetB: number;
  shareToken: number;
};

export type XykBuyExecutedEventParams = {
  pool: string;
  who: string;
  assetOut: number;
  assetIn: number;
  amount: bigint;
  buyPrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type XykSellExecutedEventParams = {
  pool: string;
  who: string;
  assetIn: number;
  assetOut: number;
  amount: bigint;
  salePrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type OmnipoolTokenAddedEventParams = {
  assetId: number;
  initialAmount: bigint;
  initialPrice: bigint;
};

export type OmnipoolTokenRemovedEventParams = {
  assetId: number;
  amount: bigint;
  hubWithdrawn: bigint;
};

export type OmnipoolBuyExecutedEventParams = {
  who: string;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  hubAmountIn: bigint;
  hubAmountOut: bigint;
  assetFeeAmount: bigint;
  protocolFeeAmount: bigint;
};

export type OmnipoolSellExecutedEventParams = {
  who: string;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  hubAmountIn: bigint;
  hubAmountOut: bigint;
  assetFeeAmount: bigint;
  protocolFeeAmount: bigint;
};
