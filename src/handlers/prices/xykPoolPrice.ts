import {
  LbpPoolHistoricalPrice,
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  XykPoolHistoricalPrice,
  XykPoolHistoricalVolume,
  XykPoolOperation,
} from '../../model';
import { BigNumber } from 'bignumber.js';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getAssetBalance } from '../assets';
import { isNotNullOrUndefined } from '../../utils/helpers';

export async function handleXykPoolPrices(ctx: ProcessorContext<Store>) {
  const poolPricesRaw = [];
  const xykAllBatchPools = ctx.batchState.state.xykAllBatchPools;

  for (let block of ctx.blocks) {
    const currentBlockRelayChainInfo = ctx.batchState.state.relayChainInfo.get(
      block.header.height
    );

    if (!currentBlockRelayChainInfo) continue;

    poolPricesRaw.push(
      [...xykAllBatchPools.values()].map(
        async (p) =>
          new Promise<XykPoolHistoricalPrice | null>((resolve) => {
            if (p.createdAtParaBlock > block.header.height) {
              resolve(null);
              return;
            }

            Promise.all([
              getAssetBalance(block.header, p.assetAId, p.id), // TODO must be optimized
              getAssetBalance(block.header, p.assetBId, p.id), // TODO must be optimized
            ]).then(([assetABalance, assetBBalance]) => {
              resolve(
                new XykPoolHistoricalPrice({
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
  const poolPrices: XykPoolHistoricalPrice[] = (
    await Promise.all(poolPricesRaw.flat())
  ).filter(isNotNullOrUndefined);

  const xykPoolHistoricalPrices = ctx.batchState.state.xykPoolHistoricalPrices;
  const xykPoolsToSave = ctx.batchState.state.xykPoolsToSave;

  for (const priceItem of poolPrices) {
    xykPoolHistoricalPrices.set(priceItem.id, priceItem);
    const pool = xykAllBatchPools.get(priceItem.pool.id);
    if (!pool) continue;
    pool.assetABalance = priceItem.assetABalance;
    pool.assetBBalance = priceItem.assetBBalance;
    xykAllBatchPools.set(priceItem.pool.id, pool);
    xykPoolsToSave.add(priceItem.pool.id);
  }

  ctx.batchState.state = {
    xykPoolHistoricalPrices,
    xykAllBatchPools,
    xykPoolsToSave,
  };
}
