import AggregatesPluggin from '@graphile/pg-aggregates';
import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import express from 'express';
import { NodePlugin } from 'graphile-build';
import {
  gql,
  makeExtendSchemaPlugin,
  postgraphile,
  Plugin,
  makePluginHook,
} from 'postgraphile';
import FilterPlugin from 'postgraphile-plugin-connection-filter';
import { ProcessorStatusPlugin } from './apiSupport/plugins/processorStatus.plugin';
import { AppConfig } from './utils/appConfig';
import { XykPoolsVolumePlugin } from './apiSupport/plugins/xykPoolsVolume.plugin';
import PgPubsub from '@graphile/pg-pubsub';
import TypeOverrides from 'pg/lib/type-overrides';
import { createClass } from '@polkadot/api/submittable/createClass';

const pgTypes = new TypeOverrides();
pgTypes.setTypeParser(1700, function (val) {
  return val;
});

const app = express();
const appConfig = AppConfig.getInstance();

console.log('appConfig.BASE_PATH - ', appConfig.BASE_PATH);

app.use(
  postgraphile(
    {
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      database: appConfig.DB_NAME,
      user: appConfig.DB_USER,
      password: appConfig.DB_PASS,
      types: pgTypes,
    },
    'public',
    {
      graphiql: true,
      showErrorStack: false,
      enhanceGraphiql: true,
      dynamicJson: true,
      disableDefaultMutations: true,
      skipPlugins: [NodePlugin],
      subscriptions: true,
      pluginHook: makePluginHook([PgPubsub]),
      appendPlugins: [
        AggregatesPluggin,
        FilterPlugin,
        SimplifyInflectorPlugin,
        ProcessorStatusPlugin,
        XykPoolsVolumePlugin,
      ],
      externalUrlBase: appConfig.BASE_PATH,
      graphileBuildOptions: {
        stateSchemas: ['squid_processor'],
      },
      allowExplain: true,
      // exportGqlSchemaPath: `${__dirname}/../schema.graphql`,
    }
  )
);

app.listen(appConfig.GQL_PORT, () => {
  console.log(`Squid API listening on port ${appConfig.GQL_PORT}`);
});