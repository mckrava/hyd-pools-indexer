import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { handleLbpPoolPrices } from './lbpPoolPrice';
import { handleXykPoolPrices } from './xykPoolPrice';

export async function handlePoolPrices(ctx: ProcessorContext<Store>) {
  if (ctx.appConfig.PROCESS_LBP_POOLS) await handleLbpPoolPrices(ctx);
  if (ctx.appConfig.PROCESS_XYK_POOLS) await handleXykPoolPrices(ctx);
}
