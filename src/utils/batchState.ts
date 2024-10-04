import { Account, LbpPool, Transfer } from '../model';
import { LBPPoolDataUpdate, PoolCreatedEvent } from './types';

export type BatchStatePayload = {
  accounts: Map<string, Account>;
  transfers: Map<string, Transfer>;
  newPools: PoolCreatedEvent[];
  existingPools: LbpPool[];
  updatedPools: Map<string, LBPPoolDataUpdate>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    accounts: new Map(),
    transfers: new Map(),
    newPools: [],
    existingPools: [],
    updatedPools: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}
