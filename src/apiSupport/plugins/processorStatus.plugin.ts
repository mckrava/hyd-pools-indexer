import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import type * as pg from 'pg';
import { getTypeormConnection } from '../utils/typeorm';
import { XykPool } from '../../model';

export const ProcessorStatusPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        type _ProcessorStatus {
          name: String!
          height: Int!
          hash: String!
        }

        extend type Query {
          _squidStatus: [_ProcessorStatus!]!
        }
      `,
      resolvers: {
        Query: {
          _squidStatus: async (parentObject, args, context, info) => {
            const pgClient: pg.Client = context.pgClient;

            const { rows } = await pgClient.query(
              schemas
                .map(
                  (s) => `SELECT '${s}' as name , height, hash FROM ${s}.status`
                )
                .join(' UNION ALL ')
            );

            return rows || [];
          },
        },
      },
    };
  }
);
