import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OmnipoolAsset } from '../../model';
import {
  OmnipoolTokenAddedData,
  OmnipoolTokenRemovedData,
} from '../../parsers/batchBlocksParser/types';

export async function getOmnipoolAsset(
  ctx: ProcessorContext<Store>,
  assetId: number
) {
  return (
    ctx.batchState.state.omnipoolAssets.get(
      `${ctx.appConfig.OMNIPOOL_ADDRESS}-${assetId}`
    ) ||
    (await ctx.store.findOne(OmnipoolAsset, {
      where: { assetId },
    }))
  );
}

export async function omnipoolTokenAdded(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolTokenAddedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let assetEntity =
    ctx.batchState.state.omnipoolAssets.get(
      `${ctx.appConfig.OMNIPOOL_ADDRESS}-${eventParams.assetId}`
    ) ||
    (await ctx.store.findOne(OmnipoolAsset, {
      where: { assetId: eventParams.assetId },
    }));

  if (assetEntity) return;

  assetEntity = new OmnipoolAsset({
    id: `${ctx.batchState.state.omnipoolEntity!.id}-${eventParams.assetId}`,
    assetId: eventParams.assetId,
    initialAmount: eventParams.initialAmount,
    initialPrice: eventParams.initialPrice,
    pool: ctx.batchState.state.omnipoolEntity!,
    createdAt: new Date(),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    isRemoved: false,
  });

  const assetIdsToSave = ctx.batchState.state.omnipoolAssetIdsToSave;
  const allAssets = ctx.batchState.state.omnipoolAssets;
  assetIdsToSave.add(assetEntity.id);
  allAssets.set(assetEntity.id, assetEntity);

  ctx.batchState.state = { omnipoolAssetIdsToSave: assetIdsToSave };
  ctx.batchState.state = { omnipoolAssets: allAssets };
}

export async function omnipoolTokenRemoved(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolTokenRemovedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let assetEntity =
    [...ctx.batchState.state.omnipoolAssets.values()].find(
      (asset) => asset.assetId === eventParams.assetId
    ) ||
    (await ctx.store.findOne(OmnipoolAsset, {
      where: { assetId: eventParams.assetId },
    }));

  if (!assetEntity) return;

  assetEntity.isRemoved = true;
  assetEntity.removedAtParaBlock = eventMetadata.blockHeader.height;
  assetEntity.removedAmount = eventParams.amount;
  assetEntity.hubWithdrawn = eventParams.hubWithdrawn;

  const assetIdsToSave = ctx.batchState.state.omnipoolAssetIdsToSave;
  const allAssets = ctx.batchState.state.omnipoolAssets;

  assetIdsToSave.add(assetEntity.id);
  allAssets.set(assetEntity.id, assetEntity);

  ctx.batchState.state = { omnipoolAssetIdsToSave: assetIdsToSave };
  ctx.batchState.state = { omnipoolAssets: allAssets };
}
