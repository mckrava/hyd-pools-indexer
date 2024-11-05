import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { AssetDetails } from '../../../types/storage';
import { hexToStrWithNullCharCheck } from '../../../../utils/helpers';
import { AssetType } from '../../../../model';
import { UnknownVersionError } from '../../../../utils/errors';

async function getAsset(
  assetId: string | number,
  block: BlockHeader
): Promise<AssetDetails | null> {
  if (block.specVersion < 257) return null;

  if (storage.assetRegistry.assets.v257.is(block)) {
    const resp = await storage.assetRegistry.assets.v257.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          symbol: hexToStrWithNullCharCheck(resp.symbol),
          decimals: resp.decimals,
          isSufficient: resp.isSufficient,
        };
  }
  if (storage.assetRegistry.assets.v264.is(block)) {
    const resp = await storage.assetRegistry.assets.v264.get(block, +assetId);

    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          symbol: hexToStrWithNullCharCheck(resp.symbol),
          decimals: resp.decimals,
          isSufficient: resp.isSufficient,
        };
  }

  throw new UnknownVersionError('storage.assetRegistry.assets');
}

export default { getAsset };
