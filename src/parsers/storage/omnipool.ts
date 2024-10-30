import { BlockHeader } from '@subsquid/substrate-processor';
import {
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
  TokensAccountsAssetBalances,
} from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../typegenTypes/';

async function getOmnipoolAssetData({
  assetId,
  block,
}: OmnipoolGetAssetDataInput): Promise<OmnipoolAssetData | null> {
  if (storage.omnipool.assets.v115.is(block)) {
    const resp = await storage.omnipool.assets.v115.get(block, assetId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.omnipool.assets');
}

export default { getOmnipoolAssetData };
