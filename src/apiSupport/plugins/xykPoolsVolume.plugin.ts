import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import type * as pg from 'pg';
import { aggregateXykPoolVolumesByBlocksRange } from './sql/xykPoolsVolume.sql';
import { QueryResolverContext, XykPoolHistoricalVolumeRaw } from '../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';

type XykPoolVolumesByPeriodFilter = {
  poolIds: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
};

type XykPoolVolumeAggregated = {
  poolId: string;
  totalVolume: bigint;
  assetAVolume: bigint;
  assetBVolume: bigint;
};

type XykPoolVolumesByPeriodResponse = {
  nodes: XykPoolVolumeAggregated[];
  totalCount: number;
};

export async function handleQueryXykPoolHistoricalVolumesByPeriod(
  parentObject: any,
  args: { filter: XykPoolVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<XykPoolVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { poolIds, startBlockNumber, endBlockNumber },
  } = args;
  const squidStatus = (
    await pgClient.query(`SELECT height FROM squid_processor.status`)
  ).rows[0];

  const groupedResult = await pgClient.query(
    aggregateXykPoolVolumesByBlocksRange,
    [poolIds, startBlockNumber, endBlockNumber ?? squidStatus.height]
  );

  const decoratedNodes = new Map<string, XykPoolVolumeAggregated>(
    groupedResult.rows
      .map((item) => item.grouped_result.flat())
      .map((group: Array<XykPoolHistoricalVolumeRaw>) => {
        const resp: XykPoolVolumeAggregated = {
          poolId: group[0].pool_id,
          totalVolume: BigInt(0),
          assetAVolume: BigInt(0),
          assetBVolume: BigInt(0),
        };

        if (group.length === 1) return resp;

        if (
          group[0].para_chain_block_height === group[1].para_chain_block_height
        ) {
          resp.assetAVolume =
            BigInt(group[0].asset_a_volume_in) +
            BigInt(group[0].asset_a_volume_out);
          resp.assetBVolume =
            BigInt(group[0].asset_b_volume_in) +
            BigInt(group[0].asset_b_volume_out);

          resp.totalVolume = resp.assetAVolume + resp.assetBVolume;
          return resp;
        }

        resp.assetAVolume =
          BigInt(group[1].asset_a_total_volume_in) +
          BigInt(group[1].asset_a_total_volume_out) -
          BigInt(group[0].asset_a_total_volume_in) -
          BigInt(group[0].asset_a_total_volume_out);

        resp.assetBVolume =
          BigInt(group[1].asset_b_total_volume_in) +
          BigInt(group[1].asset_b_total_volume_out) -
          BigInt(group[0].asset_b_total_volume_in) -
          BigInt(group[0].asset_b_total_volume_out);
        resp.totalVolume = resp.assetAVolume + resp.assetBVolume;
        return resp;
      })
      .map((r: XykPoolVolumeAggregated) => [r.poolId, r])
  );

  for (const requestedPoolId of poolIds) {
    if (decoratedNodes.has(requestedPoolId)) continue;
    decoratedNodes.set(requestedPoolId, {
      poolId: requestedPoolId,
      totalVolume: BigInt(0),
      assetAVolume: BigInt(0),
      assetBVolume: BigInt(0),
    });
  }

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}

export const XykPoolsVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input XykPoolVolumesByPeriodFilter {
          poolIds: [String!]!
          startBlockNumber: Int!
          endBlockNumber: Int
        }

        type XykPoolVolumeAggregated {
          poolId: String!
          totalVolume: BigFloat!
          assetAVolume: BigFloat!
          assetBVolume: BigFloat!
        }

        type XykPoolVolumesByPeriodResponse {
          nodes: [XykPoolVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          xykPoolHistoricalVolumesByPeriod(
            filter: XykPoolVolumesByPeriodFilter!
          ): XykPoolVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          xykPoolHistoricalVolumesByPeriod:
            handleQueryXykPoolHistoricalVolumesByPeriod,
        },
      },
    };
  }
);
