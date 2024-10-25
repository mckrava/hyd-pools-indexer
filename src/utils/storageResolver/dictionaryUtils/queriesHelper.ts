import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
// import { GraphQLClient, RequestOptions, Variables } from 'graphql-request';
import {
  Client as GqlClient,
  cacheExchange,
  fetchExchange,
  AnyVariables,
  DocumentInput,
} from '@urql/core';
import { retryExchange } from '@urql/exchange-retry';
import {
  GetOmnipoolBlocksStorageState,
  GetOmnipoolBlocksStorageStateQuery,
  GetOmnipoolBlocksStorageStateQueryVariables,
  GetStablepoolBlocksStorageState,
  GetStablepoolBlocksStorageStateQuery,
  GetStablepoolBlocksStorageStateQueryVariables,
  GetXykPoolBlocksStorageState,
  GetXykPoolBlocksStorageStateQuery,
  GetXykPoolBlocksStorageStateQueryVariables,
} from './apiTypes/types';

type PaginationConfig = {
  pageSize: number;
  offset: number;
};

enum ProcessingPallets {
  OMNIPOOL = 'OMNIPOOL',
  XYK = 'XYK',
  STABLESWAP = 'STABLESWAP',
}

export class QueriesHelper {
  protected gqlRequest<
    Data = any,
    Variables extends AnyVariables = AnyVariables,
  >({
    query,
    variables,
    queryUrl,
  }: {
    query: DocumentInput<Data, Variables>;
    variables: Variables;
    queryUrl: string;
  }) {
    if (!queryUrl) throw new Error('queryUrl is not provided');

    const retryOptions = {
      initialDelayMs: 1000,
      maxDelayMs: 15000,
      randomDelay: true,
      maxNumberAttempts: 2,
      retryIf: (err: any) => err && err.networkError,
    };

    const client = new GqlClient({
      url: queryUrl,
      exchanges: [fetchExchange, retryExchange(retryOptions)],
    });
    return client.query(query, variables);
  }

  async *fetchAllPages<R = []>({
    requestPromise,
    limit,
  }: {
    requestPromise: (args: {
      pageSize: number;
      offset: number;
    }) => Promise<{ totalCount: number; data: R }>;
    limit: number;
  }) {
    const pageSize = limit;
    let offset = 0;
    let totalCount = Infinity; // Set to a high number initially to enter the loop

    while (offset < totalCount) {
      const responseWithTotal = await requestPromise({ pageSize, offset });

      yield responseWithTotal.data;

      totalCount = responseWithTotal.totalCount;
      offset += pageSize;
    }
  }
}
