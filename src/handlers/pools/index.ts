import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  LBPPoolDataUpdate,
  PoolCreatedEvent,
  ProcessorBlockData,
} from '../../utils/types';
import parsers from '../../parsers';
import {
  HistoricalAssetVolume,
  LbpPoolHistoricalPrice,
  LbpPoolHistoricalVolume,
  LbpPool,
  PoolOperationType,
} from '../../model';
import { getAssetBalance } from '../assets';
import { getAccount } from '../accounts';
import { isNotNullOrUndefined } from '../../helpers';
import { initSwap } from '../poolOperations';
import { calls, events } from '../../types';
import { handleVolumeUpdates } from './volume';

export async function handlePools(ctx: ProcessorContext<Store>) {
  console.time('getPools');
  const newPoolsData = await getPools(ctx);
  console.log('Found ' + newPoolsData.length + ' pools');
  console.timeEnd('getPools');

  console.time('getLBPPoolUpdates');
  const lbpPoolsUpdates = await getLBPPoolUpdates(ctx);
  console.log('Found ' + Object.keys(lbpPoolsUpdates).length + ' pool updates');
  console.timeEnd('getLBPPoolUpdates');

  const existingPools = await ctx.store.find(LbpPool);
  console.log('Got ' + existingPools.length + ' pools from database');

  const newPools: LbpPool[] = [];

  for (let p of newPoolsData) {
    let {
      id,
      assetAId,
      assetBId,
      assetABalance,
      assetBBalance,
      createdAt,
      createdAtParaBlock,
      lbpPoolData,
    } = p;

    // @ts-ignore
    lbpPoolData = {
      ...(lbpPoolData || {}),
      ...(lbpPoolsUpdates.get(id) || {}),
    };

    if (lbpPoolData) {
      newPools.push(
        new LbpPool({
          id: id,
          account: await getAccount(ctx, id),
          assetAId,
          assetBId,
          assetABalance,
          assetBBalance,
          createdAt,
          createdAtParaBlock,
          owner: await getAccount(ctx, lbpPoolData.owner),
          startBlockNumber: lbpPoolData.startBlockNumber,
          endBlockNumber: lbpPoolData.endBlockNumber,
          feeCollector: await getAccount(ctx, lbpPoolData.feeCollector),
          fee: lbpPoolData.fee,
          initialWeight: lbpPoolData.initialWeight,
          finalWeight: lbpPoolData.finalWeight,
        })
      );
    }
  }

  for (let [poolId, newData] of [...lbpPoolsUpdates.entries()]) {
    const poolData = existingPools.find((pool) => pool.id == poolId);

    console.log(`Found pool data for pool ${poolId}... mapping new data`);

    if (!poolData) continue;

    poolData.owner = await getAccount(ctx, newData.owner);
    poolData.feeCollector = await getAccount(ctx, newData.feeCollector);
    poolData.initialWeight = newData.initialWeight;
    poolData.finalWeight = newData.finalWeight;
    poolData.repayTarget = newData.repayTarget;
    poolData.startBlockNumber = newData.startBlockNumber;
    poolData.endBlockNumber = newData.endBlockNumber;
  }

  console.time('getPoolPriceData');
  const poolPriceData = await getPoolPriceData(ctx, [
    ...existingPools,
    ...newPools,
  ]);
  console.timeEnd('getPoolPriceData');

  console.log(
    `Got ${poolPriceData.poolPrices.length} pool price data, 
    ${poolPriceData.swaps.length} swaps, 
    ${poolPriceData.assetVolume.length} asset volume data, 
    ${poolPriceData.volume.length} volume data`
  );

  const poolPrices: LbpPoolHistoricalPrice[] = [];
  for (let p of poolPriceData.poolPrices) {
    poolPrices.push(new LbpPoolHistoricalPrice(p));
  }

  await ctx.store.save([...existingPools, ...newPools]);
  await ctx.store.insert(poolPrices);
  await ctx.store.insert(poolPriceData.swaps);
  await ctx.store.insert(poolPriceData.volume);
  await ctx.store.insert(poolPriceData.assetVolume);

  ctx.batchState.state = {
    newPools: newPoolsData,
    existingPools: existingPools,
    updatedPools: lbpPoolsUpdates,
  };
}

async function getPools(
  ctx: ProcessorContext<Store>
): Promise<PoolCreatedEvent[]> {
  let pools: PoolCreatedEvent[] = [];
  for (let block of ctx.blocks) {
    const newPoolsCallData: Map<
      string,
      { assetABalance: bigint; assetBBalance: bigint }
    > = new Map();

    for (let call of block.calls) {
      switch (call.name) {
        case calls.lbp.createPool.name: {
          let { assetA, assetB, assetAAmount, assetBAmount } =
            parsers.calls.lbp.parseCreatePoolArgs(call);
          newPoolsCallData.set(`${assetA}-${assetB}`, {
            assetABalance: assetAAmount,
            assetBBalance: assetBAmount,
          });
          break;
        }
        default:
      }
    }

    for (let event of block.events) {
      if (event.name == events.lbp.poolCreated.name) {
        // const { pool, data } = events.lbp.poolCreated.v176.decode(event);
        const { pool, data } = parsers.events.lbp.parsePoolCreatedParams(event);
        let newPoolCallArgs = newPoolsCallData.get(
          `${data.assets[0]}-${data.assets[1]}`
        );
        console.log('Event ', events.lbp.poolCreated.name);
        if (!newPoolCallArgs) {
          console.log('===== fallback storage call ====');
          newPoolCallArgs = { assetABalance: 0n, assetBBalance: 0n };
          newPoolCallArgs.assetABalance = await getAssetBalance(
            block.header,
            data.assets[0],
            pool
          );
          newPoolCallArgs.assetBBalance = await getAssetBalance(
            block.header,
            data.assets[1],
            pool
          );
        }

        pools.push({
          id: pool,
          assetAId: data.assets[0],
          assetBId: data.assets[1],
          assetABalance: newPoolCallArgs.assetABalance,
          assetBBalance: newPoolCallArgs.assetBBalance,
          createdAt: new Date(block.header.timestamp || 0),
          createdAtParaBlock: block.header.height,
          lbpPoolData: {
            owner: data.owner,
            feeCollector: data.feeCollector,
            fee: data.fee,
            initialWeight: data.initialWeight,
            finalWeight: data.finalWeight,
          },
        });
      }
    }
  }
  return pools;
}

async function getLBPPoolUpdates(ctx: ProcessorContext<Store>) {
  const updates: Map<string, LBPPoolDataUpdate> = new Map();
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name == events.lbp.poolUpdated.name) {
        const { pool, data } = events.lbp.poolUpdated.v176.decode(event);

        updates.set(pool, {
          startBlockNumber: data.start,
          endBlockNumber: data.end,
          repayTarget: data.repayTarget,
          fee: data.fee,
          initialWeight: data.initialWeight,
          finalWeight: data.finalWeight,
          feeCollector: data.feeCollector,
          owner: data.owner,
        });
      }
    }
  }
  return updates;
}

async function getPoolPriceData(
  ctx: ProcessorContext<Store>,
  pools: LbpPool[]
  // accounts: Map<string, Account>
) {
  let poolPrices: Promise<LbpPoolHistoricalPrice | null>[][] = [];
  let blocksData: ProcessorBlockData[] = [];
  let volume = new Map<string, LbpPoolHistoricalVolume>();
  let assetVolume = new Map<string, HistoricalAssetVolume>();

  for (let block of ctx.blocks) {
    const blockData: ProcessorBlockData = {
      relayChainBlockHeight: null,
      paraChainBlockHeight: block.header.height,
      timestamp: new Date(block.header.timestamp || 0),
      swaps: [],
    };

    for (let call of block.calls) {
      switch (call.name) {
        case calls.parachainSystem.setValidationData.name: {
          let validationData =
            calls.parachainSystem.setValidationData.v100.decode(call);
          blockData.relayChainBlockHeight =
            validationData.data.validationData.relayParentNumber;
          break;
        }
        default:
      }
    }

    for (let event of block.events) {
      if (event.name == events.lbp.buyExecuted.name) {
        const buyEvent = events.lbp.buyExecuted.v176.decode(event);
        const swapPool = pools.find(
          (p) =>
            (p.assetAId == buyEvent.assetIn &&
              p.assetBId == buyEvent.assetOut) ||
            (p.assetBId == buyEvent.assetIn && p.assetAId == buyEvent.assetOut)
        );

        if (!swapPool) {
          console.log(`No pool found for event: ${event.name} ${event.id}`);
          continue;
        }

        const swap = initSwap(
          event,
          event.extrinsic?.hash || '',
          await getAccount(ctx, buyEvent.who),
          buyEvent.assetIn,
          buyEvent.assetOut,
          buyEvent.amount,
          buyEvent.buyPrice,
          buyEvent.feeAsset,
          buyEvent.feeAmount,
          PoolOperationType.BUY,
          swapPool,
          blockData
        );

        blockData.swaps.push(swap);

        await handleVolumeUpdates(ctx, volume, assetVolume, swap);
      }

      if (event.name == events.lbp.sellExecuted.name) {
        const sellEvent = events.lbp.sellExecuted.v176.decode(event);
        const swapPool = pools.find(
          (p) =>
            (p.assetAId == sellEvent.assetIn &&
              p.assetBId == sellEvent.assetOut) ||
            (p.assetBId == sellEvent.assetIn &&
              p.assetAId == sellEvent.assetOut)
        );

        if (!swapPool) {
          console.log(`No pool found for event: ${event.name} ${event.id}`);
          continue;
        }

        const swap = initSwap(
          event,
          event.extrinsic?.hash || '',
          await getAccount(ctx, sellEvent.who),
          sellEvent.assetIn,
          sellEvent.assetOut,
          sellEvent.assetIn === sellEvent.feeAsset
            ? sellEvent.amount + sellEvent.feeAmount
            : sellEvent.amount,
          sellEvent.salePrice,
          sellEvent.feeAsset,
          sellEvent.feeAmount,
          PoolOperationType.SELL,
          swapPool,
          blockData
        );

        blockData.swaps.push(swap);

        await handleVolumeUpdates(ctx, volume, assetVolume, swap);
      }
    }

    poolPrices.push(
      pools.map(
        async (p) =>
          new Promise<LbpPoolHistoricalPrice | null>((resolve) => {
            if (p.createdAtParaBlock > blockData.paraChainBlockHeight) {
              resolve(null);
              return;
            }

            Promise.all([
              getAssetBalance(block.header, p.assetAId, p.id), // TODO must be optimized
              getAssetBalance(block.header, p.assetBId, p.id), // TODO must be optimized
            ]).then(([assetABalance, assetBBalance]) => {
              resolve({
                id: p.id + '-' + blockData.paraChainBlockHeight,
                assetAId: p.assetAId,
                assetBId: p.assetBId,
                assetABalance: assetABalance,
                assetBBalance: assetBBalance,
                pool: p,
                paraChainBlockHeight: blockData.paraChainBlockHeight,
                relayChainBlockHeight: blockData.relayChainBlockHeight || 0,
              });
            });
          })
      )
    );

    blocksData.push(blockData);
  }

  return {
    poolPrices: (await Promise.all(poolPrices.flat())).filter(
      isNotNullOrUndefined
    ),
    swaps: blocksData.flatMap((b) => b.swaps),
    assetVolume: Array.from(assetVolume.values()),
    volume: Array.from(volume.values()),
  };
}
