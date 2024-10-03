import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { Pool, Transfer } from '../model';
import { TransferEvent } from '../types';
import { events, storage, calls } from '../types/';
import { getAccount } from './accounts';

export async function handleTransfers(ctx: ProcessorContext<Store>) {
  console.time('getTransfers');
  const transfersData = getTransfers(ctx);
  console.log('Found ' + transfersData.length + ' transfers');
  console.timeEnd('getTransfers');

  let transfers: Transfer[] = [];

  for (let t of transfersData) {
    let { id, assetId, extrinsicHash, amount, fee, blockNumber } = t;

    let from = await getAccount(ctx, t.from);
    let to = await getAccount(ctx, t.to);

    transfers.push(
      new Transfer({
        id,
        paraChainBlockHeight: blockNumber,
        assetId,
        extrinsicHash,
        from,
        to,
        amount,
        txFee: fee,
      })
    );
  }

  await ctx.store.save(transfers);

}

function getTransfers(ctx: ProcessorContext<Store>): TransferEvent[] {
  let transfers: TransferEvent[] = [];

  const batchState = ctx.batchState.state;

  const pools = [
    ...batchState.newPools.map((p) => p.id),
    ...batchState.existingPools.map((p) => p.id),
  ];

  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name == events.balances.transfer.name) {
        const { from, to, amount } =
          events.balances.transfer.v104.decode(event);
        if (isPoolTransfer(pools, from, to)) {
          transfers.push({
            id: event.id,
            assetId: 0,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp || 0),
            extrinsicHash: event.extrinsic?.hash,
            from: from,
            to: to,
            amount: amount,
            fee: event.extrinsic?.fee || BigInt(0),
          });
        }
      } else if (event.name == events.tokens.transfer.name) {
        const { from, to, currencyId, amount } =
          events.tokens.transfer.v108.decode(event);
        if (isPoolTransfer(pools, from, to)) {
          transfers.push({
            id: event.id,
            assetId: currencyId,
            blockNumber: block.header.height,
            timestamp: new Date(block.header.timestamp || 0),
            extrinsicHash: event.extrinsic?.hash,
            from: from,
            to: to,
            amount: amount,
            fee: event.extrinsic?.fee || BigInt(0),
          });
        }
      }
    }
  }
  return transfers;
}

function isPoolTransfer(pools: string[], from: string, to: string): boolean {
  for (let p of pools) {
    if (p == from || p == to) return true;
  }
  return false;
}
