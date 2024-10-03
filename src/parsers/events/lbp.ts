import { events, calls } from '../../types/';
import { Event } from '../../processor';
import { UnknownVersionError } from '../../utils/errors';
import { LbpPoolCreatedEventParams } from '../types/events';

function parsePoolCreatedParams(event: Event): LbpPoolCreatedEventParams {
  if (events.lbp.poolCreated.v176.is(event)) {
    const { pool, data } = events.lbp.poolCreated.v176.decode(event);
    return {
      pool,
      data,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parsePoolCreatedParams };
