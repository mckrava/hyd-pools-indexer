import {
  Account,
  HistoricalAssetVolume,
  LbpPool,
  LbpPoolHistoricalPrice,
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  Transfer,
  XykPool,
  XykPoolHistoricalPrice,
  XykPoolHistoricalVolume,
  XykPoolOperation,
} from '../model';
import { RelayChainInfo } from '../parsers/types/events';

export type BatchStatePayload = {
  relayChainInfo: Map<number, RelayChainInfo>;
  accounts: Map<string, Account>;
  transfers: Map<string, Transfer>;
  assetVolumes: Map<string, HistoricalAssetVolume>;

  lbpPoolsToSave: Set<string>;
  lbpNewPools: LbpPool[];
  lbpExistingPools: Map<string, LbpPool>;
  lbpAllBatchPools: Map<string, LbpPool>;
  lbpPoolOperations: LbpPoolOperation[];
  lbpPoolVolumes: Map<string, LbpPoolHistoricalVolume>;
  lbpPoolHistoricalPrices: Map<string, LbpPoolHistoricalPrice>;

  xykPoolsToSave: Set<string>;
  xykNewPools: XykPool[];
  xykExistingPools: Map<string, XykPool>;
  xykAllBatchPools: Map<string, XykPool>;
  xykPoolOperations: XykPoolOperation[];
  xykPoolVolumes: Map<string, XykPoolHistoricalVolume>;
  xykPoolHistoricalPrices: Map<string, XykPoolHistoricalPrice>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    relayChainInfo: new Map(),
    accounts: new Map(),
    transfers: new Map(),
    assetVolumes: new Map(),

    lbpPoolsToSave: new Set(),
    lbpNewPools: [],
    lbpExistingPools: new Map(),
    lbpAllBatchPools: new Map(),
    lbpPoolOperations: [],
    lbpPoolVolumes: new Map(),
    lbpPoolHistoricalPrices: new Map(),

    xykPoolsToSave: new Set(),
    xykNewPools: [],
    xykExistingPools: new Map(),
    xykAllBatchPools: new Map(),
    xykPoolOperations: [],
    xykPoolVolumes: new Map(),
    xykPoolHistoricalPrices: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}
