import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { handlePools } from './handlers/isolatedPool';
import { handleTransfers } from './handlers/transfers';
import { getParsedEventsData } from './parsers/batchBlocksParser';
import { AppConfig } from './appConfig';
import { handlePoolPrices } from './handlers/prices';
import { handleOmnipoolAssets } from './handlers/omnipool';
import { ensureOmnipool } from './handlers/omnipool/omnipool';
import { handleOperations } from './handlers/operations';
import { handleStablepools } from './handlers/stablepool';
import { handleAssetRegistry } from './handlers/assets';
import { StorageDictionaryManager } from './utils/storageResolver/dictionaryUtils/storageDictionaryManager';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const ctxWithBatchState: Omit<
    ProcessorContext<Store>,
    'batchState' | 'appConfig'
  > = ctx;
  (ctxWithBatchState as ProcessorContext<Store>).batchState = new BatchState();
  (ctxWithBatchState as ProcessorContext<Store>).appConfig =
    AppConfig.getInstance();

  const storageDictionaryManager = new StorageDictionaryManager({
    batchCtx: ctxWithBatchState as ProcessorContext<Store>,
  });

  await storageDictionaryManager.fetchBatchStorageStateAllPallets({
    blockNumberFrom: ctx.blocks[0].header.height,
    blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  throw Error('STOP');

  const parsedData = await getParsedEventsData(
    ctxWithBatchState as ProcessorContext<Store>
  );

  await handleAssetRegistry(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handlePools(ctxWithBatchState as ProcessorContext<Store>, parsedData);

  await ensureOmnipool(ctxWithBatchState as ProcessorContext<Store>);
  await handleOmnipoolAssets(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleStablepools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleOperations(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  if (ctx.isHead)
    await handlePoolPrices(ctxWithBatchState as ProcessorContext<Store>);

  await handleTransfers(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  console.log('Batch complete');
});
