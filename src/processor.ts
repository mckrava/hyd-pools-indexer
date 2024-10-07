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

import { events, calls } from './types/';
import { BatchState } from './utils/batchState';

export const processor = new SubstrateBatchProcessor()
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  .setGateway(
    assertNotNull(
      process.env.GATEWAY_HYDRATION_HTTPS,
      'No gateway endpoint supplied'
    )
  )
  .setRpcEndpoint({
    // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/

    // See https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
    url: assertNotNull(
      process.env.RPC_HYDRATION_HTTPS,
      'No RPC endpoint supplied'
    ),
    capacity: 1000,
    rateLimit: 1000,
    maxBatchCallSize: 1000,

    // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
  })
  .addEvent({
    name: [
      events.balances.transfer.name,
      events.tokens.transfer.name,
      events.lbp.poolCreated.name,
      events.lbp.poolUpdated.name,
      events.lbp.buyExecuted.name,
      events.lbp.sellExecuted.name,
    ],
    call: true,
    extrinsic: true,
  })
  .addCall({
    name: [
      calls.parachainSystem.setValidationData.name,
      calls.lbp.createPool.name,
    ],
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
  })
  .setBlockRange({ from: 3681000 });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields> & {
  batchState: BatchState;
};
