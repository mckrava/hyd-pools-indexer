import { LbpPoolHistoricalPrice } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getAssetBalance } from '../assets';
import { isNotNullOrUndefined } from '../../utils/helpers';

export async function handleLbpPoolPrices(ctx: ProcessorContext<Store>) {
  const poolPricesRaw = [];
  const lbpAllBatchPools = ctx.batchState.state.lbpAllBatchPools;

  for (let block of ctx.blocks) {
    const currentBlockRelayChainInfo = ctx.batchState.state.relayChainInfo.get(
      block.header.height
    );

    if (!currentBlockRelayChainInfo) continue;

    poolPricesRaw.push(
      [...lbpAllBatchPools.values()].map(
        async (p) =>
          new Promise<LbpPoolHistoricalPrice | null>((resolve) => {
            if (p.createdAtParaBlock > block.header.height) {
              resolve(null);
              return;
            }

            Promise.all([
              getAssetBalance(block.header, p.assetAId, p.id), // TODO must be optimized
              getAssetBalance(block.header, p.assetBId, p.id), // TODO must be optimized
            ]).then(([assetABalance, assetBBalance]) => {
              resolve(
                new LbpPoolHistoricalPrice({
                  id: p.id + '-' + block.header.height,
                  assetAId: p.assetAId,
                  assetBId: p.assetBId,
                  assetABalance: assetABalance,
                  assetBBalance: assetBBalance,
                  pool: p,
                  paraChainBlockHeight: block.header.height,
                  relayChainBlockHeight:
                    currentBlockRelayChainInfo.relaychainBlockNumber || 0,
                })
              );
            });
          })
      )
    );
  }
  const poolPrices: LbpPoolHistoricalPrice[] = (
    await Promise.all(poolPricesRaw.flat())
  ).filter(isNotNullOrUndefined);

  const lbpPoolHistoricalPrices = ctx.batchState.state.lbpPoolHistoricalPrices;
  const lbpPoolIdsToSave = ctx.batchState.state.lbpPoolIdsToSave;

  for (const priceItem of poolPrices) {
    lbpPoolHistoricalPrices.set(priceItem.id, priceItem);

    const pool = lbpAllBatchPools.get(priceItem.pool.id);
    if (!pool) continue;
    pool.assetABalance = priceItem.assetABalance;
    pool.assetBBalance = priceItem.assetBBalance;
    lbpAllBatchPools.set(priceItem.pool.id, pool);
    lbpPoolIdsToSave.add(priceItem.pool.id);
  }

  ctx.batchState.state = {
    lbpPoolHistoricalPrices,
    lbpAllBatchPools,
    lbpPoolIdsToSave,
  };
}
