import { HistoricalAssetVolume, LbpPoolHistoricalVolume, LbpPoolOperation } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getNewAssetVolume } from '../assets';
import { calculateAveragePrice } from './price';

export function updateVolume(
  swap: LbpPoolOperation,
  currentVolume: LbpPoolHistoricalVolume | undefined,
  oldVolume: LbpPoolHistoricalVolume | undefined
) {
  const newVolume = new LbpPoolHistoricalVolume({
    id: swap.pool.id + '-' + swap.paraChainBlockHeight,
    pool: swap.pool,
    assetAId: swap.pool.assetAId,
    assetBId: swap.pool.assetBId,
    averagePrice: 0,
    assetAVolumeIn: currentVolume?.assetAVolumeIn || BigInt(0),
    assetAVolumeOut: currentVolume?.assetAVolumeOut || BigInt(0),
    assetAFee: currentVolume?.assetAFee || BigInt(0),
    assetATotalFees:
      currentVolume?.assetATotalFees || oldVolume?.assetATotalFees || BigInt(0),
    assetATotalVolumeIn:
      currentVolume?.assetATotalVolumeIn ||
      oldVolume?.assetATotalVolumeIn ||
      BigInt(0),
    assetATotalVolumeOut:
      currentVolume?.assetATotalVolumeOut ||
      oldVolume?.assetATotalVolumeOut ||
      BigInt(0),
    assetBVolumeIn: currentVolume?.assetBVolumeIn || BigInt(0),
    assetBVolumeOut: currentVolume?.assetBVolumeOut || BigInt(0),
    assetBFee: currentVolume?.assetBFee || BigInt(0),
    assetBTotalFees:
      currentVolume?.assetBTotalFees || oldVolume?.assetBTotalFees || BigInt(0),
    assetBTotalVolumeIn:
      currentVolume?.assetBTotalVolumeIn ||
      oldVolume?.assetBTotalVolumeIn ||
      BigInt(0),
    assetBTotalVolumeOut:
      currentVolume?.assetBTotalVolumeOut ||
      oldVolume?.assetBTotalVolumeOut ||
      BigInt(0),
    relayChainBlockHeight: swap.relayChainBlockHeight,
    paraChainBlockHeight: swap.paraChainBlockHeight,
  });

  const assetAVolumeIn =
    swap.assetInId === newVolume.assetAId ? swap.assetInAmount : BigInt(0);
  const assetBVolumeIn =
    swap.assetInId === newVolume.assetBId ? swap.assetInAmount : BigInt(0);
  const assetAVolumeOut =
    swap.assetOutId === newVolume.assetAId ? swap.assetOutAmount : BigInt(0);
  const assetBVolumeOut =
    swap.assetOutId === newVolume.assetBId ? swap.assetOutAmount : BigInt(0);
  const assetAFee =
    swap.assetInId === newVolume.assetAId ? swap.assetInFee : swap.assetOutFee;
  const assetBFee =
    swap.assetInId === newVolume.assetBId ? swap.assetInFee : swap.assetOutFee;

  newVolume.assetAVolumeIn += assetAVolumeIn;
  newVolume.assetAVolumeOut += assetAVolumeOut;
  newVolume.assetAFee += assetAFee;
  newVolume.assetATotalVolumeIn += assetAVolumeIn;
  newVolume.assetATotalVolumeOut += assetAVolumeOut;
  newVolume.assetATotalFees += assetAFee;

  newVolume.assetBVolumeIn += assetBVolumeIn;
  newVolume.assetBVolumeOut += assetBVolumeOut;
  newVolume.assetBFee += assetBFee;
  newVolume.assetBTotalVolumeIn += assetBVolumeIn;
  newVolume.assetBTotalVolumeOut += assetBVolumeOut;
  newVolume.assetBTotalFees += assetBFee;

  newVolume.averagePrice = calculateAveragePrice(
    swap,
    newVolume,
    currentVolume,
    oldVolume
  );

  return newVolume;
}

export async function handleVolumeUpdates(
  ctx: ProcessorContext<Store>,
  volume: Map<string, LbpPoolHistoricalVolume>,
  assetVolume: Map<string, HistoricalAssetVolume>,
  swap: LbpPoolOperation
) {
  const currentVolume = volume.get(
    swap.pool.id + '-' + swap.paraChainBlockHeight
  );

  const oldVolume =
    currentVolume ||
    getLastVolumeFromCache(volume, swap) ||
    (await getOldVolume(ctx, swap));

  const newVolume = updateVolume(swap, currentVolume, oldVolume);

  volume.set(swap.pool.id + '-' + swap.paraChainBlockHeight, newVolume);

  const [assetInVolume, assetOutVolume] = await getNewAssetVolume(
    ctx,
    assetVolume,
    swap
  );

  assetVolume.set(
    assetInVolume.assetId + '-' + swap.paraChainBlockHeight,
    assetInVolume
  );
  assetVolume.set(
    assetOutVolume.assetId + '-' + swap.paraChainBlockHeight,
    assetOutVolume
  );
}

export async function getOldVolume(
  ctx: ProcessorContext<Store>,
  swap: LbpPoolOperation
) {
  return await ctx.store.findOne(LbpPoolHistoricalVolume, {
    where: {
      pool: { id: swap.pool.id },
    },
    order: {
      paraChainBlockHeight: 'DESC',
    },
  });
}

export function getLastVolumeFromCache(
  volume: Map<string, LbpPoolHistoricalVolume>,
  swap: LbpPoolOperation
) {
  return volume.get(
    Array.from(volume.keys())
      .filter((k) => {
        return k.startsWith(swap.pool.id + '-');
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}