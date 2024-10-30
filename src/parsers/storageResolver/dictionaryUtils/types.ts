import {
  OmnipoolAssetDatum,
  Stablepool as StablepoolGql,
  XykPool as XykPoolGlq,
} from './apiTypes/types';

export type PaginationConfig = {
  pageSize: number;
  offset: number;
};

export type PalletDictionaryCollectedData = {
  pallet: ProcessingPallets;
  data: StablepoolGql[] | XykPoolGlq[] | OmnipoolAssetDatum[];
};

export enum ProcessingPallets {
  OMNIPOOL = 'OMNIPOOL',
  XYK = 'XYK',
  STABLESWAP = 'STABLESWAP',
}
