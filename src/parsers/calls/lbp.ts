import { events, storage, calls } from '../../types/';
import { Call, Fields, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { DataHandlerContext } from '@subsquid/substrate-processor';
import { LbpCreatePoolCallArgs } from '../types/calls';
import { UnknownVersionError } from '../../utils/errors';

function parseCreatePoolArgs(call: Call): LbpCreatePoolCallArgs {
  if (calls.lbp.createPool.v176.is(call)) {
    const {
      assetA,
      assetB,
      assetAAmount,
      assetBAmount,
      fee,
      feeCollector,
      initialWeight,
      finalWeight,
      repayTarget,
      poolOwner,
    } = calls.lbp.createPool.v176.decode(call);

    return {
      assetA,
      assetB,
      assetAAmount,
      assetBAmount,
      fee,
      feeCollector,
      initialWeight,
      finalWeight,
      repayTarget,
      poolOwner,
    };
  }

  throw new UnknownVersionError(call.name);
}

export default { parseCreatePoolArgs };
