import { PoolData } from './common';
import { events } from '../../types';
import { sts } from '../../types/support';
import * as v108 from '../../types/v108';
import * as v176 from '../../types/v176';

export const EventNameConst = {
  [events.lbp.poolCreated.name]: events.lbp.poolCreated.name,
};

export enum EventName {
  'LBP_PoolCreated' = 'LBP.PoolCreated',
  'LBP_PoolUpdated' = 'LBP.PoolUpdated',
  'Balances_Transfer' = 'Balances.Transfer',
  'Tokens_Transfer' = 'Tokens.Transfer',
  'LBP_BuyExecuted' = 'LBP.BuyExecuted',
  'LBP_SellExecuted' = 'LBP.SellExecuted',
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
