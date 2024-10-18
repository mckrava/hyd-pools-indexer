import { BlockHeader } from '@subsquid/substrate-processor';
import { AssetDetails, TokensAccountsAssetBalances } from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../typegenTypes/';
import { AssetType } from '../../model';
import { sts } from '../../typegenTypes/support';
import { hexToString } from '@polkadot/util';

async function getAsset(
  assetId: string | number,
  block: BlockHeader
): Promise<AssetDetails | null> {
  if (storage.assetRegistry.assets.v108.is(block)) {
    const resp = await storage.assetRegistry.assets.v108.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToString(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          isSufficient: true,
        };
  }

  if (storage.assetRegistry.assets.v160.is(block)) {
    const resp = await storage.assetRegistry.assets.v160.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToString(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          isSufficient: true,
        };
  }

  if (storage.assetRegistry.assets.v176.is(block)) {
    const resp = await storage.assetRegistry.assets.v176.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToString(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          isSufficient: true,
        };
  }

  if (storage.assetRegistry.assets.v222.is(block)) {
    const resp = await storage.assetRegistry.assets.v222.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToString(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          symbol: hexToString(resp.symbol),
          decimals: resp.decimals,
          isSufficient: resp.isSufficient,
        };
  }

  throw new UnknownVersionError('storage.tokens.accounts');
}

export default { getAsset };
