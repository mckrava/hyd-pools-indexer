import {
  Account,
  HistoricalAssetVolume,
  LbpPool,
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  Transfer,
} from '../model';
import { RelayChainInfo } from '../parsers/types/events';

export type BatchStatePayload = {
  relayChainInfo: Map<number, RelayChainInfo>;
  accounts: Map<string, Account>;
  transfers: Map<string, Transfer>;
  assetVolumes: Map<string, HistoricalAssetVolume>;
  lbpNewPools: LbpPool[];
  lbpExistingPools: Map<string, LbpPool>;
  lbpPoolOperations: LbpPoolOperation[];
  lbpPoolVolumes: Map<string, LbpPoolHistoricalVolume>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    relayChainInfo: new Map(),
    accounts: new Map(),
    transfers: new Map(),
    assetVolumes: new Map(),
    lbpNewPools: [],
    lbpExistingPools: new Map(),
    lbpPoolOperations: [],
    lbpPoolVolumes: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}
