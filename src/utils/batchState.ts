import {
  Account,
  HistoricalAssetVolume,
  LbpPool,
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  Transfer,
  XykPool,
  XykPoolHistoricalVolume,
  XykPoolOperation,
} from '../model';
import { RelayChainInfo } from '../parsers/types/events';

export type BatchStatePayload = {
  relayChainInfo: Map<number, RelayChainInfo>;
  accounts: Map<string, Account>;
  transfers: Map<string, Transfer>;
  assetVolumes: Map<string, HistoricalAssetVolume>;

  lbpNewPools: LbpPool[];
  lbpExistingPools: Map<string, LbpPool>;
  lbpAllBatchPools: Map<string, LbpPool>;
  lbpPoolOperations: LbpPoolOperation[];
  lbpPoolVolumes: Map<string, LbpPoolHistoricalVolume>;

  xykNewPools: XykPool[];
  xykExistingPools: Map<string, XykPool>;
  xykAllBatchPools: Map<string, XykPool>;
  xykPoolOperations: XykPoolOperation[];
  xykPoolVolumes: Map<string, XykPoolHistoricalVolume>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    relayChainInfo: new Map(),
    accounts: new Map(),
    transfers: new Map(),
    assetVolumes: new Map(),

    lbpNewPools: [],
    lbpExistingPools: new Map(),
    lbpAllBatchPools: new Map(),
    lbpPoolOperations: [],
    lbpPoolVolumes: new Map(),

    xykNewPools: [],
    xykExistingPools: new Map(),
    xykAllBatchPools: new Map(),
    xykPoolOperations: [],
    xykPoolVolumes: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}
