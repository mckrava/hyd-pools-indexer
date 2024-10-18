import {
  Account, Asset,
  HistoricalAssetVolume,
  LbpPool,
  LbpPoolHistoricalPrice,
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetHistoricalVolume,
  OmnipoolAssetOperation,
  Stablepool,
  StablepoolAsset,
  StablepoolAssetHistoricalVolume,
  StablepoolAssetLiquidityAmount,
  StablepoolHistoricalVolume,
  StablepoolLiquidityAction,
  StablepoolOperation,
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

  assetIdsToSave: Set<string>;
  assetsAllBatch: Map<string, Asset>;

  lbpPoolIdsToSave: Set<string>;
  lbpAllBatchPools: Map<string, LbpPool>;
  lbpPoolOperations: LbpPoolOperation[];
  lbpPoolVolumes: Map<string, LbpPoolHistoricalVolume>;
  lbpPoolHistoricalPrices: Map<string, LbpPoolHistoricalPrice>;

  xykPoolIdsToSave: Set<string>;
  xykAllBatchPools: Map<string, XykPool>;
  xykPoolOperations: XykPoolOperation[];
  xykPoolVolumes: Map<string, XykPoolHistoricalVolume>;
  xykPoolHistoricalPrices: Map<string, XykPoolHistoricalPrice>;

  omnipoolEntity: Omnipool | null;
  omnipoolAssets: Map<string, OmnipoolAsset>;
  omnipoolAssetIdsToSave: Set<string>;
  omnipoolAssetOperations: OmnipoolAssetOperation[];
  omnipoolAssetVolumes: Map<string, OmnipoolAssetHistoricalVolume>;

  stablepoolIdsToSave: Set<string>;
  stablepoolAssetsAllBatch: Map<number, StablepoolAsset>;
  stablepoolAllBatchPools: Map<string, Stablepool>;
  stablepoolOperations: StablepoolOperation[];
  stablepoolAssetVolumes: Map<string, StablepoolAssetHistoricalVolume>;
  stablepoolVolumes: Map<string, StablepoolHistoricalVolume>;
  stablepoolAssetLiquidityAmount: Map<string, StablepoolAssetLiquidityAmount>;
  stablepoolLiquidityActions: Map<string, StablepoolLiquidityAction>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    relayChainInfo: new Map(),
    accounts: new Map(),
    transfers: new Map(),
    assetVolumes: new Map(),

    assetIdsToSave: new Set(),
    assetsAllBatch: new Map(),

    lbpPoolIdsToSave: new Set(),
    lbpAllBatchPools: new Map(),
    lbpPoolOperations: [],
    lbpPoolVolumes: new Map(),
    lbpPoolHistoricalPrices: new Map(),

    xykPoolIdsToSave: new Set(),
    xykAllBatchPools: new Map(),
    xykPoolOperations: [],
    xykPoolVolumes: new Map(),
    xykPoolHistoricalPrices: new Map(),

    omnipoolEntity: null,
    omnipoolAssets: new Map(),
    omnipoolAssetIdsToSave: new Set(),
    omnipoolAssetOperations: [],
    omnipoolAssetVolumes: new Map(),

    stablepoolIdsToSave: new Set(),
    stablepoolAllBatchPools: new Map(),
    stablepoolAssetsAllBatch: new Map(),
    stablepoolOperations: [],
    stablepoolAssetVolumes: new Map(),
    stablepoolVolumes: new Map(),
    stablepoolAssetLiquidityAmount: new Map(),
    stablepoolLiquidityActions: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}
