import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { handlePools } from './handlers/pools';
import { handleTransfers } from './handlers/transfers';
import { getParsedEventsData } from './parsers/batchBlocksParser';
import { handlePoolOperations } from './handlers/poolOperations';
import { handleLbpPoolPrices } from './handlers/pools/price';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const ctxWithBatchState: Omit<ProcessorContext<Store>, 'batchState'> = ctx;
  (ctxWithBatchState as ProcessorContext<Store>).batchState = new BatchState();

  const parsedData = getParsedEventsData(
    ctxWithBatchState as ProcessorContext<Store>
  );

  await handlePools(ctxWithBatchState as ProcessorContext<Store>, parsedData);

  await handlePoolOperations(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleLbpPoolPrices(ctxWithBatchState as ProcessorContext<Store>);

  await handleTransfers(ctxWithBatchState as ProcessorContext<Store>);

  console.log('Batch complete');
});
