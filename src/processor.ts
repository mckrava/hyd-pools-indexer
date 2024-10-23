import { assertNotNull } from '@subsquid/util-internal';
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from '@subsquid/substrate-processor';

import { BatchState } from './utils/batchState';
import { AppConfig } from './utils/appConfig';
const appConfig = AppConfig.getInstance();

export const processor = new SubstrateBatchProcessor()
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  .setGateway(
    assertNotNull(
      appConfig.GATEWAY_HYDRATION_HTTPS,
      'No gateway endpoint supplied'
    )
  )
  .setRpcEndpoint({
    // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    // See https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
    url: assertNotNull(appConfig.RPC_HYDRATION_URL, 'No RPC endpoint supplied'),
    capacity: 1000,
    rateLimit: 1000,
    maxBatchCallSize: 1000,

    // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
  })
  .addEvent({
    name: appConfig.getEventsToListen(),
    call: true,
    extrinsic: true,
  })
  .addCall({
    name: appConfig.getCallsToListen(),
  })
  .setFields({
    event: {
      args: true,
      name: true,
    },
    extrinsic: {
      hash: true,
      fee: true,
    },
    block: {
      timestamp: true,
    },
    call: {
      name: true,
      args: true,
      origin: true,
      success: true,
      error: true,
    },
  });
// .setBlockRange({ from: 3934551 }); // XYK.create_pool
// .setBlockRange({ from: 3934590 }); // XYK.buy
// .setBlockRange({ from: 1708100 }); // Omnipool.TokenAdded
// .setBlockRange({ from: 3640100 }); // Stableswap.PoolCreated
// .setBlockRange({ from: 1439857 }); // AssetRegistry.Registered
// .setBlockRange({ from: 4959696 });

// 3640700 - 0xc8589b7ae9c1e6e65cc810a83548e541872bcc5e52a26967fa3999e51262232a -> 17,779,260
// 3640800 - 0x9b1b6cd9708ee52b804a80bf650ddc6ca72e7e9471e3545512035e7d8c1bbd62 -> 17,779,462

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields> & {
  batchState: BatchState;
  appConfig: AppConfig;
};
