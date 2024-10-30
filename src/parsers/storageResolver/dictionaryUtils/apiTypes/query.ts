import gql from 'graphql-tag';
import {
  OmnipoolAssetDataOrderBy,
  OmnipoolAssetDatumFilter,
  StablepoolFilter,
  StablepoolsOrderBy,
  XykPoolFilter,
  XykPoolsOrderBy,
} from './types';

export const GET_OMNIPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetOmnipoolBlocksStorageState(
    $filter: OmnipoolAssetDatumFilter
    $first: Int!
    $offset: Int!
    $orderBy: [OmnipoolAssetDataOrderBy!]
  ) {
    omnipoolAssetData(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        assetId
        assetState
        balances
        id
        paraChainBlockHeight
        poolAddress
      }
      totalCount
    }
  }
`;

export const GET_XYKPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetXykPoolBlocksStorageState(
    $filter: XykPoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [XykPoolsOrderBy!]
  ) {
    xykPools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        assetAId
        assetBId
        id
        paraChainBlockHeight
        poolAddress
        xykPoolAssetsDataByPoolId {
          nodes {
            assetId
            balances
            id
            paraChainBlockHeight
            poolId
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_STABLEPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetStablepoolBlocksStorageState(
    $filter: StablepoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [StablepoolsOrderBy!]
  ) {
    stablepools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        fee
        finalAmplification
        finalBlock
        id
        initialAmplification
        initialBlock
        paraChainBlockHeight
        poolAddress
        poolId
        stablepoolAssetDataByPoolId {
          nodes {
            assetId
            balances
            id
            paraChainBlockHeight
            poolId
          }
        }
      }
      totalCount
    }
  }
`;
