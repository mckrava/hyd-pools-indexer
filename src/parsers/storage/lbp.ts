import { BlockHeader } from '@subsquid/substrate-processor';
import { LbpGetPoolDataInput, LbpPoolData } from '../types/storage';
import { storage } from '../../typegenTypes/';
import { UnknownVersionError } from '../../utils/errors';

async function getPoolData({
  poolAddress,
  block,
}: LbpGetPoolDataInput): Promise<LbpPoolData | null> {
  if (block.specVersion < 176) return null;

  if (storage.lbp.poolData.v176.is(block)) {
    const resp = await storage.lbp.poolData.v176.get(block, poolAddress);

    if (!resp) return null;

    return {
      poolAddress,
      assetAId: resp.assets[0],
      assetBId: resp.assets[1],
      owner: resp.owner,
      start: resp.start,
      end: resp.end,
      initialWeight: resp.initialWeight,
      finalWeight: resp.finalWeight,
      weightCurve: resp.weightCurve,
      fee: resp.fee,
      feeCollector: resp.feeCollector,
      repayTarget: BigInt(resp.repayTarget),
    };
  }

  throw new UnknownVersionError('storage.lbp.poolData');
}

export default { getPoolData };