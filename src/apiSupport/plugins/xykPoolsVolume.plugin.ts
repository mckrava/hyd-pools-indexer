import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import type * as pg from 'pg';
import { BigNumber } from 'bignumber.js';
import { aggregateXykPoolVolumesByBlocksRange } from './sql/xykPoolsVolume.sql';

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
          xykPoolHistoricalVolumesByPeriod: async (
            parentObject,
            args: { filter: XykPoolVolumesByPeriodFilter },
            context,
            info
          ): Promise<XykPoolVolumesByPeriodResponse> => {
            const pgClient: pg.Client = context.pgClient;
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
                .map(
                  (
                    group: Array<{
                      pool_id: string;
                      asset_a_total_volume_in: number;
                      asset_a_total_volume_out: number;
                      asset_b_total_volume_in: number;
                      asset_b_total_volume_out: number;
                    }>
                  ) => {
                    const resp: XykPoolVolumeAggregated = {
                      poolId: group[0].pool_id,
                      totalVolume: BigInt(0),
                      assetAVolume: BigInt(0),
                      assetBVolume: BigInt(0),
                    };
                    if (group.length === 1) return resp;
                    resp.assetAVolume = BigInt(
                      BigNumber(group[1].asset_a_total_volume_in)
                        .plus(group[1].asset_a_total_volume_out)
                        .minus(group[0].asset_a_total_volume_in)
                        .minus(group[0].asset_a_total_volume_out)
                        .toFixed()
                    );
                    resp.assetBVolume = BigInt(
                      BigNumber(group[1].asset_b_total_volume_in)
                        .plus(group[1].asset_b_total_volume_out)
                        .minus(group[0].asset_b_total_volume_in)
                        .minus(group[0].asset_b_total_volume_out)
                        .toFixed()
                    );
                    resp.totalVolume = resp.assetAVolume + resp.assetBVolume;
                    return resp;
                  }
                )
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
          },
        },
      },
    };
  }
);
