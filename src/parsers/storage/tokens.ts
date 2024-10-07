import { BlockHeader } from '@subsquid/substrate-processor';
import { TokensAccountsAssetBalances } from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../types/';

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances | null> {
  if (storage.tokens.accounts.v108.is(block)) {
    const resp = await storage.tokens.accounts.v108.get(
      block,
      account,
      assetId
    );
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.tokens.accounts');
}

export default { getTokensAccountsAssetBalances };
