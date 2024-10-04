import { storage } from '../../types/';
import { UnknownVersionError } from '../../utils/errors';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  SystemAccountInfo,
  TokensAccountsAssetBalances,
} from '../types/storage';

async function getSystemAccount(
  account: string,
  block: BlockHeader
): Promise<SystemAccountInfo> {
  if (storage.system.account.v100.is(block)) {
    const resp = await storage.system.account.v100.get(block, account);
    if (!resp)
      throw new Error(`storage.system.account request has been failed.`); // TODO improve error handling
    return resp;
  }

  throw new UnknownVersionError('storage.system.account');
}

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances> {
  if (storage.tokens.accounts.v108.is(block)) {
    const resp = await storage.tokens.accounts.v108.get(
      block,
      account,
      assetId
    );
    if (!resp)
      throw new Error(`storage.tokens.accounts request has been failed.`); // TODO improve error handling
    return resp;
  }

  throw new UnknownVersionError('storage.tokens.accounts');
}

export default { getSystemAccount, getTokensAccountsAssetBalances };
