import { events } from '../../typegenTypes/';
import { Event } from '../../processor';
import { UnknownVersionError } from '../../utils/errors';
import { BalancesTransferEventParams } from '../types/events';

function parseTransferParams(event: Event): BalancesTransferEventParams {
  if (events.balances.transfer.v100.is(event)) {
    const [from, to, amount] = events.balances.transfer.v100.decode(event);
    return {
      to,
      from,
      amount,
    };
  }

  if (events.balances.transfer.v104.is(event)) {
    const { to, from, amount } = events.balances.transfer.v104.decode(event);
    return {
      to,
      from,
      amount,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseTransferParams };
