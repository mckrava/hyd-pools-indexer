import {
  LbpPoolHistoricalPrice,
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
} from '../../model';
import { BigNumber } from 'bignumber.js';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { LbpPoolCreatedData } from '../../parsers/batchBlocksParser/types';
import { getAssetBalance } from '../assets';
import { isNotNullOrUndefined } from '../../utils/helpers';

export async function handleLbpPoolPrices(ctx: ProcessorContext<Store>) {
  const poolPrices: LbpPoolHistoricalPrice[] = [];

  for (let block of ctx.blocks) {
    const currentBlockRelayChainInfo = ctx.batchState.state.relayChainInfo.get(
      block.header.height
    );

    if (!currentBlockRelayChainInfo) continue;

    const poolPricesRaw = [
      ...ctx.batchState.state.lbpExistingPools.values(),
      ...ctx.batchState.state.lbpNewPools,
    ].map(
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
    );

    poolPrices.push(
      ...(await Promise.all(poolPricesRaw.flat())).filter(isNotNullOrUndefined)
    );
  }

  await ctx.store.save(poolPrices);
}

export function calculateAveragePrice(
  swap: LbpPoolOperation,
  newVolume: LbpPoolHistoricalVolume,
  currentVolume?: LbpPoolHistoricalVolume,
  oldVolume?: LbpPoolHistoricalVolume
) {
  const totalVolume = oldVolume
    ? oldVolume.assetATotalVolumeIn + oldVolume.assetATotalVolumeOut
    : currentVolume
      ? currentVolume.assetATotalVolumeIn + currentVolume.assetATotalVolumeOut
      : BigInt(0);

  const volume = newVolume.assetAVolumeIn + newVolume.assetAVolumeOut;

  const price =
    swap.assetInId === swap.pool.assetAId ? swap.swapPrice : 1 / swap.swapPrice;

  const oldPrice = currentVolume?.averagePrice || oldVolume?.averagePrice || 0;

  return oldPrice
    ? new BigNumber(totalVolume.toString())
        .multipliedBy(oldPrice)
        .plus(new BigNumber(volume.toString()).multipliedBy(price))
        .dividedBy(
          new BigNumber(totalVolume.toString()).plus(volume.toString())
        )
        .toNumber()
    : price;
}
