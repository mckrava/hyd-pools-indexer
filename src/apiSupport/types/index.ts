import { Client } from 'pg';

export type XykPoolHistoricalVolumeRaw = {
  id: string;
  pool_id: string;
  asset_a_id: string;
  asset_b_id: string;
  asset_a_volume_in: number;
  asset_a_total_volume_in: number;
  asset_a_volume_out: number;
  asset_a_total_volume_out: number;
  asset_b_volume_in: number;
  asset_b_total_volume_in: number;
  asset_b_volume_out: number;
  asset_b_total_volume_out: number;
  asset_a_fee: number;
  asset_b_fee: number;
  asset_a_total_fees: number;
  asset_b_total_fees: number;
  average_price: number;
  relay_chain_block_height: number;
  para_chain_block_height: number;
};
export type XykPoolHistoricalVolumeGqlResponse = {
  id: string;
  poolId: string;
  assetAId: string;
  assetBId: string;
  assetAVolumeIn: bigint;
  assetATotalVolumeIn: bigint;
  assetAVolumeOut: bigint;
  assetATotalVolumeOut: bigint;
  assetBVolumeIn: bigint;
  assetBTotalVolumeIn: bigint;
  assetBVolumeOut: bigint;
  assetBTotalVolumeOut: bigint;
  assetAFee: bigint;
  assetBFee: bigint;
  assetATotalFees: bigint;
  assetBTotalFees: bigint;
  averagePrice: bigint;
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
};

export interface QueryResolverContext {
  pgClient: Client;
  pgRole: string;
  jwtClaims: {
    user_id: number;
    role: string;
    exp: number;
    iat: number;
    aud: string;
    iss: string;
  } | null;
}
