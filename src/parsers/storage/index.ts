import system from './system';
import tokens from './tokens';
import omnipool from './omnipool';
import assetRegistry from './assetRegistry';
import parachainSystem from './parachainSystem';
import stableswap from './stableswap';
import { StorageResolver } from '../storageResolver';
import { ProcessingPallets } from '../storageResolver/dictionaryUtils/types';
import {
  AccountData,
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
  GetPoolAssetInfoInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
} from '../types/storage';
import { getAccountBalances } from '../../handlers/assets/balances';

export default {
  system,
  tokens,
  assetRegistry,
  parachainSystem,
  stableswap: {
    getPoolData: (
      args: StablepoolGetPoolDataInput
    ): Promise<StablepoolInfo | null> =>
      StorageResolver.getInstance().resolveStorageData<
        StablepoolGetPoolDataInput,
        StablepoolInfo | null
      >({
        args,
        pallet: ProcessingPallets.STABLESWAP,
        method: 'getPoolData',
        fallbackFn: stableswap.getPoolData,
      }),
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ): Promise<AccountData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetPoolAssetInfoInput,
        AccountData | null
      >({
        args,
        pallet: ProcessingPallets.STABLESWAP,
        method: 'getPoolAssetInfo',
        fallbackFn: getAccountBalances,
      }),
  },
  omnipool: {
    getOmnipoolAssetData: (
      args: StablepoolGetPoolDataInput
    ): Promise<OmnipoolAssetData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        OmnipoolGetAssetDataInput,
        OmnipoolAssetData | null
      >({
        args,
        pallet: ProcessingPallets.OMNIPOOL,
        method: 'getAssetData',
        fallbackFn: omnipool.getOmnipoolAssetData,
      }),
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ): Promise<AccountData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetPoolAssetInfoInput,
        AccountData | null
      >({
        args,
        pallet: ProcessingPallets.OMNIPOOL,
        method: 'getPoolAssetInfo',
        fallbackFn: getAccountBalances,
      }),
  },
};
