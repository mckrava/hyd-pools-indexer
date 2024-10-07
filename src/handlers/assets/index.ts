import { BlockHeader } from '@subsquid/substrate-processor';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { HistoricalAssetVolume, LbpPoolOperation } from '../../model';
import parsers from '../../parsers';

export async function getAssetBalance(
  block: BlockHeader,
  assetId: number,
  account: string
): Promise<bigint> {
  if (assetId === 0) {
    return parsers.storage.system
      .getSystemAccount(account, block)
      .then((accountInfo) => {
        return accountInfo?.data.free || BigInt(0);
      });
  } else {
    return parsers.storage.tokens
      .getTokensAccountsAssetBalances(account, assetId, block)
      .then((accountInfo) => {
        return accountInfo?.free || BigInt(0);
      });
  }
}

export async function getNewAssetVolume(
  ctx: ProcessorContext<Store>,
  operation: LbpPoolOperation
) {
  // const assetVolumesState = ctx.batchState.state.assetVolumes;
  //
  // // Find current block volume
  // const currentAssetInVolume = assetVolumesState.get(
  //   operation.assetInId + '-' + operation.paraChainBlockHeight
  // );
  // const currentAssetOutVolume = assetVolumesState.get(
  //   operation.assetOutId + '-' + operation.paraChainBlockHeight
  // );
  //
  // // If not found find last volume in cache
  // const cachedVolumeIn = getLastAssetVolumeFromCache(
  //   assetVolumesState,
  //   operation.assetInId
  // );
  // const cachedVolumeOut = getLastAssetVolumeFromCache(
  //   assetVolumesState,
  //   operation.assetOutId
  // );
  //
  // // Last known volume for total volume
  // const oldAssetInVolume =
  //   currentAssetInVolume ||
  //   cachedVolumeIn ||
  //   (await ctx.store.findOne(HistoricalAssetVolume, {
  //     where: {
  //       assetId: operation.assetInId,
  //     },
  //     order: {
  //       paraChainBlockHeight: 'DESC',
  //     },
  //   }));
  //
  // // Last known volume for total volume
  // const oldAssetOutVolume =
  //   currentAssetOutVolume ||
  //   cachedVolumeOut ||
  //   (await ctx.store.findOne(HistoricalAssetVolume, {
  //     where: {
  //       assetId: operation.assetOutId,
  //     },
  //     order: {
  //       paraChainBlockHeight: 'DESC',
  //     },
  //   }));
  //
  // // Create new entry
  // const assetInVolume = initAssetVolume(
  //   operation.assetInId,
  //   operation.paraChainBlockHeight,
  //   operation.relayChainBlockHeight,
  //   currentAssetInVolume?.volumeIn || BigInt(0),
  //   BigInt(0),
  //   oldAssetInVolume?.totalVolumeIn || BigInt(0),
  //   BigInt(0)
  // );
  //
  // const assetOutVolume = initAssetVolume(
  //   operation.assetOutId,
  //   operation.paraChainBlockHeight,
  //   operation.relayChainBlockHeight,
  //   BigInt(0),
  //   currentAssetOutVolume?.volumeOut || BigInt(0),
  //   BigInt(0),
  //   oldAssetOutVolume?.totalVolumeOut || BigInt(0)
  // );
  //
  // // Update new entry
  // assetInVolume.volumeIn += operation.assetInAmount;
  // assetInVolume.totalVolumeIn += operation.assetInAmount;
  // assetOutVolume.volumeOut += operation.assetOutAmount;
  // assetOutVolume.totalVolumeOut += operation.assetOutAmount;
  //
  // assetVolumesState.set(assetInVolume.id, assetInVolume);
  // assetVolumesState.set(assetOutVolume.id, assetOutVolume);
  //
  // ctx.batchState.state.assetVolumes = assetVolumesState;
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
