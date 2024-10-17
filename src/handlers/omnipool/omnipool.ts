import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Omnipool, OmnipoolAsset } from '../../model';
import { getAccount } from '../accounts';

export async function ensureOmnipool(ctx: ProcessorContext<Store>) {
  if (ctx.batchState.state.omnipoolEntity) return;

  let omnipoolEntity =
    (await ctx.store.findOne(Omnipool, {
      where: { id: ctx.appConfig.OMNIPOOL_ADDRESS },
    })) ?? null;

  if (!!omnipoolEntity) {
    ctx.batchState.state = {
      omnipoolEntity,
    };
    return;
  }

  omnipoolEntity = new Omnipool();
  omnipoolEntity.id = ctx.appConfig.OMNIPOOL_ADDRESS;
  omnipoolEntity.account = await getAccount(
    ctx,
    ctx.appConfig.OMNIPOOL_ADDRESS
  );
  omnipoolEntity.createdAt = new Date();
  omnipoolEntity.createdAtParaBlock = ctx.blocks[0].header.height;
  omnipoolEntity.isDestroyed = false;

  const internalOmnipoolToken = new OmnipoolAsset({
    id: `${omnipoolEntity.id}-1`,
    assetId: 1,
    initialAmount: BigInt(0),
    initialPrice: BigInt(0),
    pool: omnipoolEntity,
    createdAt: new Date(),
    createdAtParaBlock: ctx.blocks[0].header.height,
    isRemoved: false,
  });

  await ctx.store.save(omnipoolEntity);
  await ctx.store.save(internalOmnipoolToken);

  ctx.batchState.state = {
    omnipoolEntity,
  };
}