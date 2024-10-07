import { PoolData } from './common';
import { events } from '../../types';

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
