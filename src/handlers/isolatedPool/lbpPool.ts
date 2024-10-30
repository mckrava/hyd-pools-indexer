import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { LbpPool } from '../../model';
import { getAccount } from '../accounts';
import {
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import { getAssetBalance } from '../assets/balances';

export async function lpbPoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const newPoolsAssetBalances: {
    assetABalance: bigint | undefined;
    assetBBalance: bigint | undefined;
  } = {
    assetABalance: eventCallData.callData?.args?.assetAAmount,
    assetBBalance: eventCallData.callData?.args?.assetBAmount,
  };

  if (
    !newPoolsAssetBalances.assetABalance &&
    !newPoolsAssetBalances.assetBBalance
  ) {
    newPoolsAssetBalances.assetABalance = await getAssetBalance(
      eventMetadata.blockHeader,
      eventParams.data.assets[0],
      eventParams.pool
    );
    newPoolsAssetBalances.assetBBalance = await getAssetBalance(
      eventMetadata.blockHeader,
      eventParams.data.assets[1],
      eventParams.pool
    );
  }

  const newPool = new LbpPool({
    id: eventParams.pool,
    account: await getAccount(ctx, eventParams.pool),
    assetAId: eventParams.data.assets[0],
    assetBId: eventParams.data.assets[1],
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    createdAt: new Date(eventMetadata.blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    owner: await getAccount(ctx, eventParams.data.owner),
    startBlockNumber: eventParams.data.start,
    endBlockNumber: eventParams.data.end,
    feeCollector: await getAccount(ctx, eventParams.data.feeCollector),
    fee: eventParams.data.fee,
    initialWeight: eventParams.data.initialWeight,
    finalWeight: eventParams.data.finalWeight,
    isDestroyed: false,
  });

  // await ctx.store.save(newPool);

  const poolsToSave = ctx.batchState.state.lbpPoolIdsToSave;
  poolsToSave.add(newPool.id);
  ctx.batchState.state = { lbpPoolIdsToSave: poolsToSave };

  const lbpAllBatchPools = ctx.batchState.state.lbpAllBatchPools;
  lbpAllBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    lbpAllBatchPools,
  };
}

export async function lpbPoolUpdated(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpPoolUpdatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const allPools = ctx.batchState.state.lbpAllBatchPools;

  const existingPoolData = allPools.get(eventParams.pool);

  if (!existingPoolData) return;

  existingPoolData.owner = await getAccount(ctx, eventParams.data.owner);
  existingPoolData.feeCollector = await getAccount(
    ctx,
    eventParams.data.feeCollector
  );
  existingPoolData.initialWeight = eventParams.data.initialWeight;
  existingPoolData.finalWeight = eventParams.data.finalWeight;
  existingPoolData.repayTarget = eventParams.data.repayTarget;
  existingPoolData.startBlockNumber = eventParams.data.start;
  existingPoolData.endBlockNumber = eventParams.data.end;

  // await ctx.store.save(existingPoolData);

  const poolsToSave = ctx.batchState.state.lbpPoolIdsToSave;
  poolsToSave.add(existingPoolData.id);
  ctx.batchState.state = { lbpPoolIdsToSave: poolsToSave };

  allPools.set(eventParams.pool, existingPoolData);
  ctx.batchState.state = { lbpAllBatchPools: allPools };
}
