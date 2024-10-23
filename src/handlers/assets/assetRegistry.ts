import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import { Asset } from '../../model';
import parsers from '../../parsers';

export async function getAsset({
  ctx,
  id,
  ensure = false,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  id: string | number;
  ensure?: boolean;
  blockHeader?: Block;
}): Promise<Asset | null> {
  const batchState = ctx.batchState.state;

  let asset = batchState.assetsAllBatch.get(`${id}`);
  if (asset) return asset;

  asset = await ctx.store.findOne(Asset, { where: { id: `${id}` } });

  if (!ensure) return asset ?? null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;
  const storageData = await parsers.storage.assetRegistry.getAsset(
    +id,
    blockHeader
  );

  if (!storageData) return null;

  const newAsset = new Asset({
    id: `${id}`,
    name: storageData.name,
    assetType: storageData.assetType,
    existentialDeposit: storageData.existentialDeposit,
    symbol: storageData.symbol ?? null,
    decimals: storageData.decimals ?? null,
    xcmRateLimit: storageData.xcmRateLimit ?? null,
    isSufficient: storageData.isSufficient ?? true,
  });

  await ctx.store.save(newAsset);

  return newAsset;
}

export async function assetRegistered(
  ctx: ProcessorContext<Store>,
  eventCallData: AssetRegistryRegisteredData
) {
  const {
    eventData: {
      params: {
        assetId,
        assetType,
        assetName,
        existentialDeposit,
        symbol,
        decimals,
        xcmRateLimit,
        isSufficient,
      },
      metadata: eventMetadata,
    },
  } = eventCallData;

  const newAsset = new Asset({
    id: `${assetId}`,
    name: assetName,
    assetType,
    existentialDeposit,
    symbol,
    decimals,
    xcmRateLimit,
    isSufficient,
  });

  const state = ctx.batchState.state;
  state.assetsAllBatch.set(newAsset.id, newAsset);
  state.assetIdsToSave.add(newAsset.id);
  ctx.batchState.state = {
    assetsAllBatch: state.assetsAllBatch,
    assetIdsToSave: state.assetIdsToSave,
  };
}

export async function assetUpdated(
  ctx: ProcessorContext<Store>,
  eventCallData: AssetRegistryUpdatedData
) {
  const {
    eventData: {
      params: {
        assetId,
        assetType,
        assetName,
        existentialDeposit,
        symbol,
        decimals,
        xcmRateLimit,
        isSufficient,
      },
      metadata: eventMetadata,
    },
  } = eventCallData;

  const asset = await getAsset({
    ctx,
    id: assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!asset) return;

  if (assetName) asset.name = assetName;
  if (assetType) asset.assetType = assetType;
  if (existentialDeposit) asset.existentialDeposit = existentialDeposit;
  if (symbol) asset.symbol = symbol;
  if (decimals) asset.decimals = decimals;
  if (xcmRateLimit) asset.xcmRateLimit = xcmRateLimit;
  if (isSufficient) asset.isSufficient = isSufficient;

  const state = ctx.batchState.state;
  state.assetsAllBatch.set(asset.id, asset);
  state.assetIdsToSave.add(asset.id);
  ctx.batchState.state = {
    assetsAllBatch: state.assetsAllBatch,
    assetIdsToSave: state.assetIdsToSave,
  };
}
