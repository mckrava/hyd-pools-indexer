import { AssetType } from '../../model';

export interface AccountData {
  free: bigint;
  reserved: bigint;
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

export interface AssetDetails {
  assetType: AssetType;
  existentialDeposit: bigint;
  isSufficient: boolean;
  name?: string;
  symbol?: string;
  decimals?: number;
  xcmRateLimit?: bigint;
}
