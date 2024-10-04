import { BlockHeader } from '@subsquid/substrate-processor';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { HistoricalAssetVolume, LbpPoolOperation } from '../../model';
import parsers from '../../parsers';
import { getLastAssetVolumeFromCache } from './volume';

export async function getAssetBalance(
  block: BlockHeader,
  assetId: number,
  account: string
): Promise<bigint> {
  if (assetId === 0) {
    return parsers.storage.lbp
      .getSystemAccount(account, block)
      .then((accountInfo) => {
        return accountInfo?.data.free || BigInt(0);
      });
  } else {
    return parsers.storage.lbp
      .getTokensAccountsAssetBalances(account, assetId, block)
      .then((accountInfo) => {
        return accountInfo?.free || BigInt(0);
      });
  }
}

export async function getNewAssetVolume(
  ctx: ProcessorContext<Store>,
  volume: Map<string, HistoricalAssetVolume>,
  swap: LbpPoolOperation
) {
  // Find current block volume
  const currentAssetInVolume = volume.get(
    swap.assetInId + '-' + swap.paraChainBlockHeight
  );

  const currentAssetOutVolume = volume.get(
    swap.assetOutId + '-' + swap.paraChainBlockHeight
  );

  // If not found find last volume in cache
  const cachedVolumeIn = getLastAssetVolumeFromCache(volume, swap.assetInId);
  const cachedVolumeOut = getLastAssetVolumeFromCache(volume, swap.assetOutId);

  // Last known volume for total volume
  const oldAssetInVolume =
    currentAssetInVolume ||
    cachedVolumeIn ||
    (await ctx.store.findOne(HistoricalAssetVolume, {
      where: {
        assetId: swap.assetInId,
      },
      order: {
        paraChainBlockHeight: 'DESC',
      },
    }));

  // Last known volume for total volume
  const oldAssetOutVolume =
    currentAssetOutVolume ||
    cachedVolumeOut ||
    (await ctx.store.findOne(HistoricalAssetVolume, {
      where: {
        assetId: swap.assetOutId,
      },
      order: {
        paraChainBlockHeight: 'DESC',
      },
    }));

  // Create new entry
  const assetInVolume = initAssetVolume(
    swap.assetInId,
    swap.paraChainBlockHeight,
    swap.relayChainBlockHeight,
    currentAssetInVolume?.volumeIn || BigInt(0),
    BigInt(0),
    oldAssetInVolume?.totalVolumeIn || BigInt(0),
    BigInt(0)
  );

  const assetOutVolume = initAssetVolume(
    swap.assetOutId,
    swap.paraChainBlockHeight,
    swap.relayChainBlockHeight,
    BigInt(0),
    currentAssetOutVolume?.volumeOut || BigInt(0),
    BigInt(0),
    oldAssetOutVolume?.totalVolumeOut || BigInt(0)
  );

  // Update new entry
  assetInVolume.volumeIn += swap.assetInAmount;
  assetInVolume.totalVolumeIn += swap.assetInAmount;
  assetOutVolume.volumeOut += swap.assetOutAmount;
  assetOutVolume.totalVolumeOut += swap.assetOutAmount;

  return [assetInVolume, assetOutVolume];
}

export function initAssetVolume(
  assetId: number,
  paraChainBlockHeight: number,
  relayChainBlockHeight: number,
  volumeIn: bigint,
  volumeOut: bigint,
  totalVolumeIn: bigint,
  totalVolumeOut: bigint
) {
  return new HistoricalAssetVolume({
    id: assetId + '-' + paraChainBlockHeight,
    assetId,
    volumeIn,
    volumeOut,
    totalVolumeIn,
    totalVolumeOut,
    relayChainBlockHeight,
    paraChainBlockHeight,
  });
}
