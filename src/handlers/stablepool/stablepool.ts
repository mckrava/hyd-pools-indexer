import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Stablepool, StablepoolAsset } from '../../model';
import { getAccount } from '../accounts';
import { StableswapPoolCreatedData } from '../../parsers/batchBlocksParser/types';
import { getAssetBalance } from '../assets';

import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex, encodeAddress } from '@polkadot/util-crypto';
import { isNotNullOrUndefined } from '../../utils/helpers';

export async function stablepoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: StableswapPoolCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const poolsToSave = ctx.batchState.state.stablepoolIdsToSave;
  const allBatchPools = ctx.batchState.state.stablepoolAllBatchPools;
  const allBatchAssets = ctx.batchState.state.stablepoolAssetsAllBatch;

  const newPool = new Stablepool({
    id: `${eventParams.poolId}`,
    account: await getAccount(
      ctx,
      blake2AsHex(StableMath.getPoolAddress(eventParams.poolId))
    ),
    createdAt: new Date(eventMetadata.blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    isDestroyed: false,
  });

  const assetsListPromise = eventParams.assets.map(
    async (assetId) =>
      new StablepoolAsset({
        id: `${newPool.id}-${assetId}`,
        pool: newPool,
        amount: await getAssetBalance(
          eventMetadata.blockHeader,
          assetId,
          newPool.account.id
        ),
        assetId,
      })
  );
  for (const asset of (await Promise.all(assetsListPromise)).filter(
    isNotNullOrUndefined
  )) {
    allBatchAssets.set(asset.assetId, asset);
  }

  poolsToSave.add(newPool.id);
  ctx.batchState.state = { stablepoolIdsToSave: poolsToSave };

  allBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    stablepoolAllBatchPools: allBatchPools,
  };

  ctx.batchState.state = {
    stablepoolAssetsAllBatch: allBatchAssets,
  };
}
