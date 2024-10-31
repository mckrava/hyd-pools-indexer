import { BlockHeader } from '@subsquid/substrate-processor';
import {
  ParachainSystemLastRelayChainBlockNumber,
  SystemAccountInfo,
} from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../typegenTypes/';

async function getLastRelayChainBlockNumber(
  block: BlockHeader
): Promise<ParachainSystemLastRelayChainBlockNumber | null> {
  if (storage.parachainSystem.lastRelayChainBlockNumber.v115.is(block)) {
    return (
      (await storage.parachainSystem.lastRelayChainBlockNumber.v115.get(
        block
      )) ?? null
    );
  }

  throw new UnknownVersionError('storage.parachainSystem.lastRelayChainBlockNumber');
}

export default { getLastRelayChainBlockNumber };
