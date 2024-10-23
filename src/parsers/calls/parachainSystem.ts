import { calls } from '../../typegenTypes/';
import { Call } from '../../processor';
import {
  LbpCreatePoolCallArgs,
  RelaySystemSetValidationDataCallArgs,
} from '../types/calls';
import { UnknownVersionError } from '../../utils/errors';

function parseSetValidationDataArgs(
  call: Call
): RelaySystemSetValidationDataCallArgs {
  if (calls.parachainSystem.setValidationData.v100.is(call)) {
    const decodedData =
      calls.parachainSystem.setValidationData.v100.decode(call);

    return {
      relayParentNumber: decodedData.data.validationData.relayParentNumber,
    };
  }

  throw new UnknownVersionError(call.name);
}

export default { parseSetValidationDataArgs };
