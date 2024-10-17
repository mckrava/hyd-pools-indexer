import {
  Account,
  HistoricalAssetVolume,
  LbpPool,
  LbpPoolHistoricalPrice,
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetHistoricalVolume,
  OmnipoolAssetOperation,
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

  lbpPoolIdsToSave: Set<string>;
  lbpNewPools: LbpPool[];
  lbpExistingPools: Map<string, LbpPool>;
  lbpAllBatchPools: Map<string, LbpPool>;
  lbpPoolOperations: LbpPoolOperation[];
  lbpPoolVolumes: Map<string, LbpPoolHistoricalVolume>;
  lbpPoolHistoricalPrices: Map<string, LbpPoolHistoricalPrice>;

  xykPoolIdsToSave: Set<string>;
  xykNewPools: XykPool[];
  xykExistingPools: Map<string, XykPool>;
  xykAllBatchPools: Map<string, XykPool>;
  xykPoolOperations: XykPoolOperation[];
  xykPoolVolumes: Map<string, XykPoolHistoricalVolume>;
  xykPoolHistoricalPrices: Map<string, XykPoolHistoricalPrice>;

  omnipoolEntity: Omnipool | null;
  omnipoolAssets: Map<string, OmnipoolAsset>;
  omnipoolAssetIdsToSave: Set<string>;
  omnipoolAssetOperations: OmnipoolAssetOperation[];
  omnipoolAssetVolumes: Map<string, OmnipoolAssetHistoricalVolume>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    relayChainInfo: new Map(),
    accounts: new Map(),
    transfers: new Map(),
    assetVolumes: new Map(),

    lbpPoolIdsToSave: new Set(),
    lbpNewPools: [],
    lbpExistingPools: new Map(),
    lbpAllBatchPools: new Map(),
    lbpPoolOperations: [],
    lbpPoolVolumes: new Map(),
    lbpPoolHistoricalPrices: new Map(),

    xykPoolIdsToSave: new Set(),
    xykNewPools: [],
    xykExistingPools: new Map(),
    xykAllBatchPools: new Map(),
    xykPoolOperations: [],
    xykPoolVolumes: new Map(),
    xykPoolHistoricalPrices: new Map(),

    omnipoolEntity: null,
    omnipoolAssets: new Map(),
    omnipoolAssetIdsToSave: new Set(),
    omnipoolAssetOperations: [],
    omnipoolAssetVolumes: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}
