import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { handlePools } from './handlers/pools';
import { handleTransfers } from './handlers/transfers';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const ctxWithBatchState: Omit<ProcessorContext<Store>, 'batchState'> = ctx;
  (ctxWithBatchState as ProcessorContext<Store>).batchState = new BatchState();

  await handlePools(ctxWithBatchState as ProcessorContext<Store>);

  await handleTransfers(ctxWithBatchState as ProcessorContext<Store>);

  console.log('Batch complete');
});
