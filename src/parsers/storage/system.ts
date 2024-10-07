import { BlockHeader } from '@subsquid/substrate-processor';
import { SystemAccountInfo } from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../types/';

async function getSystemAccount(
  account: string,
  block: BlockHeader
): Promise<SystemAccountInfo | null> {
  if (storage.system.account.v100.is(block)) {
    const resp = await storage.system.account.v100.get(block, account);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.system.account');
}

export default { getSystemAccount };
