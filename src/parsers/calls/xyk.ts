import { calls } from '../../types/';
import { Call } from '../../processor';
import { XykCreatePoolCallArgs } from '../types/calls';
import { UnknownVersionError } from '../../utils/errors';

function parseCreatePoolArgs(call: Call): XykCreatePoolCallArgs {
  if (calls.xyk.createPool.v183.is(call)) {
    return calls.xyk.createPool.v183.decode(call);
  }

  throw new UnknownVersionError(call.name);
}

export default { parseCreatePoolArgs };
