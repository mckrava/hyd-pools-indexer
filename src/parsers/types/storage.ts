import { AssetType } from '../../model';
import { BlockHeader } from '@subsquid/substrate-processor';

export interface AccountData {
  free: bigint;
  reserved: bigint;
  frozen?: bigint;
  miscFrozen: bigint;
  feeFrozen: bigint;
  flags: bigint;
}

export interface SystemAccountInfo {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: AccountData;
}
export type ParachainSystemLastRelayChainBlockNumber = number;

export interface TokensAccountsAssetBalances {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
}

export type OmnipoolAssetTradability = {
  bits: number;
};

export interface OmnipoolAssetData {
  hubReserve: bigint;
  shares: bigint;
  protocolShares: bigint;
  cap: bigint;
  tradable: OmnipoolAssetTradability;
}

export interface StablepoolInfo {
  assets: number[];
  initialAmplification: number;
  finalAmplification: number;
  initialBlock: number;
  finalBlock: number;
  fee: number;
}

export interface AssetDetails {
  assetType: AssetType;
  existentialDeposit: bigint;
  isSufficient: boolean;
  name?: string;
  symbol?: string;
  decimals?: number;
  xcmRateLimit?: bigint;
}

/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S===========================
 * =============================================================================
 */

export type StablepoolGetPoolDataInput = {
  assetId: number;
  block: BlockHeader;
};

export type GetPoolAssetInfoInput = {
  poolId?: number;
  poolAddress?: string;
  assetId: number;
  block: BlockHeader;
};

export type OmnipoolGetAssetDataInput = {
  assetId: number;
  block: BlockHeader;
};

