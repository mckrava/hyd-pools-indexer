import {
  Asset,
  OmnipoolAsset,
  OmnipoolAssetHistoricalVolume,
  OmnipoolAssetOperation,
  StablepoolAssetHistoricalVolume,
  StablepoolAssetLiquidityAmount,
  StablepoolHistoricalVolume,
  StablepoolLiquidityAction,
  StablepoolOperation,
  XykPoolHistoricalVolume,
  XykPoolOperation,
} from '../../model';
import { calculateAveragePrice } from '../prices/utils';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  getLastVolumeFromCache,
  getOldOmnipoolAssetVolume,
  getOldStablepoolAssetVolume,
  getOldXykVolume,
  getPoolAssetLastVolumeFromCache,
  initOmnipoolAssetVolume,
} from './index';

export async function handleStablepoolVolumeUpdates({
  ctx,
  poolOperation,
}: {
  ctx: ProcessorContext<Store>;
  poolOperation: StablepoolOperation;
}) {
  const stablepoolVolumeCollections =
    ctx.batchState.state.stablepoolVolumeCollections;
  const stablepoolAssetVolumes = ctx.batchState.state.stablepoolAssetVolumes;
  const assetsToProcess = [poolOperation.assetIn, poolOperation.assetOut];

  let volumesCollection = stablepoolVolumeCollections.get(
    poolOperation.pool.id + '-' + poolOperation.paraChainBlockHeight
  );

  if (!volumesCollection) {
    volumesCollection = new StablepoolHistoricalVolume({
      id: `${poolOperation.pool.id}-${poolOperation.paraChainBlockHeight}`,
      pool: poolOperation.pool,
      relayChainBlockHeight: poolOperation.relayChainBlockHeight,
      paraChainBlockHeight: poolOperation.paraChainBlockHeight,
    });
    stablepoolVolumeCollections.set(volumesCollection.id, volumesCollection);
  }

  for (const asset of assetsToProcess) {
    const currentAssetVolume = stablepoolAssetVolumes.get(
      `${poolOperation.pool.id}-${asset.id}-${poolOperation.paraChainBlockHeight}`
    );

    const oldVolume =
      currentAssetVolume ||
      (getPoolAssetLastVolumeFromCache(stablepoolAssetVolumes, asset.id) as
        | StablepoolAssetHistoricalVolume
        | undefined) ||
      (await getOldStablepoolAssetVolume(ctx, asset.id, poolOperation.pool.id));

    const newVolume = initStablepoolAssetVolume({
      swap: poolOperation,
      currentVolume: currentAssetVolume,
      oldVolume,
      asset,
      volumesCollection,
    });

    stablepoolAssetVolumes.set(newVolume.id, newVolume);
  }

  ctx.batchState.state = { stablepoolAssetVolumes };
}

export function initStablepoolAssetVolume({
  swap,
  liquidityActionData,
  currentVolume,
  oldVolume,
  asset,
  volumesCollection,
}: {
  swap: StablepoolOperation;
  liquidityActionData?: {
    actionData: StablepoolLiquidityAction;
    assetData: StablepoolAssetLiquidityAmount;
  };
  asset: Asset;
  volumesCollection: StablepoolHistoricalVolume;
  currentVolume?: StablepoolAssetHistoricalVolume | undefined;
  oldVolume?: StablepoolAssetHistoricalVolume | undefined;
}) {
  // const poolId = swap ? swap.pool.id : liquidityActionData.actionData.pool.id

  const newVolume = new StablepoolAssetHistoricalVolume({
    id: `${swap.pool.id}-${asset.id}-${swap.paraChainBlockHeight}`,
    asset,
    volumesCollection,
    assetFee: currentVolume?.assetFee || BigInt(0),
    assetTotalFees:
      currentVolume?.assetTotalFees || oldVolume?.assetTotalFees || BigInt(0),

    swapVolumeIn: currentVolume?.swapVolumeIn || BigInt(0),
    swapVolumeOut: currentVolume?.swapVolumeOut || BigInt(0),
    swapTotalVolumeIn:
      currentVolume?.swapTotalVolumeIn ||
      oldVolume?.swapTotalVolumeIn ||
      BigInt(0),
    swapTotalVolumeOut:
      currentVolume?.swapTotalVolumeOut ||
      oldVolume?.swapTotalVolumeOut ||
      BigInt(0),

    liqAddedAmount: currentVolume?.liqAddedAmount || BigInt(0),
    liqRemovedAmount: currentVolume?.liqRemovedAmount || BigInt(0),
    liqAddedTotalAmount:
      currentVolume?.liqAddedTotalAmount ||
      oldVolume?.liqAddedTotalAmount ||
      BigInt(0),
    liqRemovedTotalAmount:
      currentVolume?.liqRemovedTotalAmount ||
      oldVolume?.liqRemovedTotalAmount ||
      BigInt(0),

    routedLiqAddedAmount: currentVolume?.routedLiqAddedAmount || BigInt(0),
    routedLiqRemovedAmount: currentVolume?.routedLiqRemovedAmount || BigInt(0),
    routedLiqAddedTotalAmount:
      currentVolume?.routedLiqAddedTotalAmount ||
      oldVolume?.routedLiqAddedTotalAmount ||
      BigInt(0),
    routedLiqRemovedTotalAmount:
      currentVolume?.routedLiqRemovedTotalAmount ||
      oldVolume?.routedLiqRemovedTotalAmount ||
      BigInt(0),

    paraChainBlockHeight: swap.paraChainBlockHeight,
  });

  let swapVolumeIn = BigInt(0);
  let swapVolumeOut = BigInt(0);
  let liqAddedAmount = BigInt(0);
  let liqRemovedAmount = BigInt(0);
  let routedLiqAddedAmount = BigInt(0);
  let routedLiqRemovedAmount = BigInt(0);
  let assetFee = BigInt(0);

  if (swap) {
    swapVolumeIn =
      swap.assetIn.id === newVolume.asset.id ? swap.assetInAmount : BigInt(0);
    swapVolumeOut =
      swap.assetOut.id === newVolume.asset.id ? swap.assetOutAmount : BigInt(0);
    assetFee =
      swap.assetOut.id === newVolume.asset.id ? swap.assetFeeAmount : BigInt(0);
  }

  // Block volumes
  newVolume.swapVolumeIn += swapVolumeIn;
  newVolume.swapVolumeOut += swapVolumeOut;
  newVolume.liqAddedAmount += liqAddedAmount;
  newVolume.liqRemovedAmount += liqRemovedAmount;
  newVolume.routedLiqAddedAmount += routedLiqAddedAmount;
  newVolume.routedLiqRemovedAmount += routedLiqRemovedAmount;
  newVolume.assetFee += assetFee;

  // Total volumes
  newVolume.swapTotalVolumeIn += swapVolumeIn;
  newVolume.swapTotalVolumeOut += swapVolumeOut;
  newVolume.liqAddedTotalAmount += liqAddedAmount;
  newVolume.liqRemovedTotalAmount += liqRemovedAmount;
  newVolume.routedLiqAddedTotalAmount += routedLiqAddedAmount;
  newVolume.routedLiqRemovedTotalAmount += routedLiqRemovedAmount;
  newVolume.assetTotalFees += assetFee;

  return newVolume;
}
