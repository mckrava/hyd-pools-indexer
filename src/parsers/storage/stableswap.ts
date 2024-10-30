import {
  AccountData,
  GetPoolAssetInfoInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
} from '../types/storage';
import { storage } from '../../typegenTypes/';
import { UnknownVersionError } from '../../utils/errors';

async function getPoolData({
  assetId,
  block,
}: StablepoolGetPoolDataInput): Promise<StablepoolInfo | null> {
  if (storage.stableswap.pools.v183.is(block)) {
    const resp = await storage.stableswap.pools.v183.get(block, assetId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

export default { getPoolData };
