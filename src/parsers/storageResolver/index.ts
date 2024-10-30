import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { StorageDictionaryManager } from './dictionaryUtils/storageDictionaryManager';
import { ProcessingPallets } from './dictionaryUtils/types';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AccountData,
  GetPoolAssetInfoInput,
  OmnipoolGetAssetDataInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
} from '../types/storage';

export class StorageResolver {
  private static instance: StorageResolver;
  storageDictionaryManager: StorageDictionaryManager | null = null;

  static getInstance(): StorageResolver {
    if (!StorageResolver.instance) {
      StorageResolver.instance = new StorageResolver();
    }
    return StorageResolver.instance;
  }

  async init({
    ctx,
    blockNumberFrom,
    blockNumberTo,
  }: {
    ctx: ProcessorContext<Store>;
    blockNumberFrom: number;
    blockNumberTo: number;
  }) {
    if (!this.storageDictionaryManager)
      this.storageDictionaryManager = new StorageDictionaryManager({
        batchCtx: ctx,
      });

    this.storageDictionaryManager.setBatchContext(ctx);

    this.storageDictionaryManager.wipeBatchStorageState();

    // await this.storageDictionaryManager.fetchBatchStorageStateAllPallets({
    //   blockNumberFrom,
    //   blockNumberTo,
    // });
  }

  async resolveStorageData<Args extends { block: BlockHeader }, R>({
    pallet,
    method,
    args,
    fallbackFn,
  }: {
    pallet: ProcessingPallets;
    method: 'getPoolData' | 'getPoolAssetInfo' | 'getAssetData';
    args: Args;
    fallbackFn?: (args: Args) => Promise<R>;
  }): Promise<R | null> {
    if (!this.storageDictionaryManager)
      throw Error(`Storage Dictionary Manager is not initialised.`);

    try {
      switch (pallet) {
        case ProcessingPallets.STABLESWAP: {
          if (method === 'getPoolData')
            return (
              (this.storageDictionaryManager.getStableswapPoolData(
                args as unknown as StablepoolGetPoolDataInput // TOD fix types
              ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            );
          if (method === 'getPoolAssetInfo')
            return (
              (this.storageDictionaryManager.getStableswapPoolAssetInfo(
                args as unknown as GetPoolAssetInfoInput // TOD fix types
              ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            );
          break;
        }
        case ProcessingPallets.OMNIPOOL: {
          if (method === 'getAssetData')
          return (
            (this.storageDictionaryManager.getOmnipoolAssetState(
              args as unknown as OmnipoolGetAssetDataInput // TOD fix types
            ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
          );
          if (method === 'getPoolAssetInfo')
            return (
              (this.storageDictionaryManager.getOmnipoolAssetInfo(
                args as unknown as GetPoolAssetInfoInput // TOD fix types
              ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            );
          break;
        }
        default:
          return null;
      }
    } catch (e) {
      console.log(e);
      return fallbackFn ? fallbackFn(args) : null;
    }
    return null;
  }
}
