import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { handlePools } from './handlers/pools';
import { handleTransfers } from './handlers/transfers';
import { getParsedEventsData } from './parsers/batchBlocksParser';
import { handlePoolOperations } from './handlers/poolOperations';
import { AppConfig } from './utils/appConfigsManager';
import { handlePoolPrices } from './handlers/prices';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const ctxWithBatchState: Omit<
    ProcessorContext<Store>,
    'batchState' | 'appConfig'
  > = ctx;
  (ctxWithBatchState as ProcessorContext<Store>).batchState = new BatchState();
  (ctxWithBatchState as ProcessorContext<Store>).appConfig =
    AppConfig.getInstance();

  const parsedData = getParsedEventsData(
    ctxWithBatchState as ProcessorContext<Store>
  );

  await handlePools(ctxWithBatchState as ProcessorContext<Store>, parsedData);

  await handlePoolOperations(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handlePoolPrices(ctxWithBatchState as ProcessorContext<Store>);

  await handleTransfers(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  console.log('Batch complete');
});
