import {
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  XykPoolHistoricalVolume,
  XykPoolOperation,
} from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calculateAveragePrice } from '../prices/utils';

export function initLbpPoolVolume(
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

export function initXykPoolVolume(
  swap: XykPoolOperation,
  currentVolume: XykPoolHistoricalVolume | undefined,
  oldVolume: XykPoolHistoricalVolume | undefined
) {
  const newVolume = new XykPoolHistoricalVolume({
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

  // Block volumes
  newVolume.assetAVolumeIn += assetAVolumeIn;
  newVolume.assetAVolumeOut += assetAVolumeOut;
  newVolume.assetAFee += assetAFee;

  newVolume.assetBVolumeIn += assetBVolumeIn;
  newVolume.assetBVolumeOut += assetBVolumeOut;
  newVolume.assetBFee += assetBFee;

  // Total volumes
  newVolume.assetATotalVolumeIn += assetAVolumeIn;
  newVolume.assetATotalVolumeOut += assetAVolumeOut;
  newVolume.assetATotalFees += assetAFee;

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

export async function handleLbpPoolVolumeUpdates({
  ctx,
  poolOperation,
}: {
  ctx: ProcessorContext<Store>;
  poolOperation: LbpPoolOperation;
}) {
  const lbpPoolVolumes = ctx.batchState.state.lbpPoolVolumes;
  const currentVolume = lbpPoolVolumes.get(
    poolOperation.pool.id + '-' + poolOperation.paraChainBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.lbpPoolVolumes,
      poolOperation.pool.id
    ) as LbpPoolHistoricalVolume | undefined) ||
    (await getOldLbpVolume(ctx, poolOperation.pool.id));

  const newVolume = initLbpPoolVolume(poolOperation, currentVolume, oldVolume);

  lbpPoolVolumes.set(newVolume.id, newVolume);
  ctx.batchState.state = { lbpPoolVolumes };
}

export async function handleXykPoolVolumeUpdates({
  ctx,
  poolOperation,
}: {
  ctx: ProcessorContext<Store>;
  poolOperation: XykPoolOperation;
}) {
  const xykPoolVolumes = ctx.batchState.state.xykPoolVolumes;
  const currentVolume = xykPoolVolumes.get(
    poolOperation.pool.id + '-' + poolOperation.paraChainBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.xykPoolVolumes,
      poolOperation.pool.id
    ) as XykPoolHistoricalVolume | undefined) ||
    (await getOldXykVolume(ctx, poolOperation.pool.id));

  const newVolume = initXykPoolVolume(poolOperation, currentVolume, oldVolume);

  xykPoolVolumes.set(newVolume.id, newVolume);
  ctx.batchState.state = { xykPoolVolumes };
}

export async function getOldLbpVolume(
  ctx: ProcessorContext<Store>,
  poolId: string
) {
  return await ctx.store.findOne(LbpPoolHistoricalVolume, {
    where: {
      pool: { id: poolId },
    },
    order: {
      paraChainBlockHeight: 'DESC',
    },
  });
}

export async function getOldXykVolume(
  ctx: ProcessorContext<Store>,
  poolId: string
) {
  return await ctx.store.findOne(XykPoolHistoricalVolume, {
    where: {
      pool: { id: poolId },
    },
    order: {
      paraChainBlockHeight: 'DESC',
    },
  });
}

export function getLastVolumeFromCache(
  volume: Map<string, LbpPoolHistoricalVolume | XykPoolHistoricalVolume>,
  poolId: string
) {
  return volume.get(
    Array.from(volume.keys())
      .filter((k) => {
        return k.startsWith(poolId + '-');
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}
