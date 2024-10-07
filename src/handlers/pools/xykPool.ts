import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { LbpPool, XykPool } from '../../model';
import { getAssetBalance } from '../assets';
import { getAccount } from '../accounts';
import { XykPoolCreatedData } from '../../parsers/batchBlocksParser/types';

export async function xykPoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: XykPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const newPoolsAssetBalances: {
    assetABalance: bigint | undefined;
    assetBBalance: bigint | undefined;
  } = {
    assetABalance: eventCallData.callData?.args?.amountA,
    assetBBalance: eventCallData.callData?.args?.amountB,
  };

  if (
    !newPoolsAssetBalances.assetABalance &&
    !newPoolsAssetBalances.assetBBalance
  ) {
    newPoolsAssetBalances.assetABalance = await getAssetBalance(
      eventMetadata.blockHeader,
      eventParams.assetA,
      eventParams.pool
    );
    newPoolsAssetBalances.assetBBalance = await getAssetBalance(
      eventMetadata.blockHeader,
      eventParams.assetB,
      eventParams.pool
    );
  }

  const newPool = new XykPool({
    id: eventParams.pool,
    account: await getAccount(ctx, eventParams.pool),
    assetAId: eventParams.assetA,
    assetBId: eventParams.assetB,
    shareTokenId: eventParams.shareToken,
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    initialSharesAmount: eventParams.initialSharesAmount ?? BigInt(0),
    createdAt: new Date(eventMetadata.blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    isDestroyed: false,
  });

  await ctx.store.save(newPool);

  const xykAllBatchPools = ctx.batchState.state.xykAllBatchPools;
  xykAllBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    xykAllBatchPools,
  };
}
