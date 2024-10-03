import { BlockHeader } from '@subsquid/substrate-processor';
import { events, storage, calls } from '../types/';
import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { HistoricalAssetVolume, Swap } from '../model';
import { getLastAssetVolumeFromCache } from '../main';

export async function getAssetBalance(
  block: BlockHeader,
  assetId: number,
  account: string
): Promise<bigint> {
  if (assetId === 0) {
    return storage.system.account.v100
      .get(block, account)
      .then((accountInfo) => {
        return accountInfo?.data.free || BigInt(0);
      });
  } else {
    return storage.tokens.accounts.v108
      .get(block, account, assetId)
      .then((accountInfo) => {
        return accountInfo?.free || BigInt(0);
      });
  }
}

export async function getNewAssetVolume(
  ctx: ProcessorContext<Store>,
  volume: Map<string, HistoricalAssetVolume>,
  swap: Swap
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
