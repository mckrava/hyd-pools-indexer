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
import { ProcessorStatusPlugin } from './apiSupport/plugins/query/processorStatus.plugin';
import { AppConfig } from './utils/appConfig';
import { XykPoolsVolumePlugin } from './apiSupport/plugins/query/xykPoolsVolume.plugin';
import PgPubsub from '@graphile/pg-pubsub';
import TypeOverrides from 'pg/lib/type-overrides';
import { Client } from 'pg';
import { runMigrations } from './apiSupport/apiMigrations/runMigrations';
import { XykPoolsVolumeSubscriptionsPlugin } from './apiSupport/plugins/subscription/xykPoolsVolumeSubscriptions.plugin';
import { getEnvPath } from './utils/helpers';
import { OmnipoolAssetVolumePlugin } from './apiSupport/plugins/query/omnipoolVolume.plugin';
import { OmnipoolAssetVolumeSubscriptionsPlugin } from './apiSupport/plugins/subscription/omnipoolAssetVolumeSubscriptions.plugin';
import { StablepoolVolumePlugin } from './apiSupport/plugins/query/stablepoolVolume.plugin';
import { StablepoolVolumeSubscriptionsPlugin } from './apiSupport/plugins/subscription/stablepoolVolumeSubscriptions.plugin';

const pgTypes = new TypeOverrides();
pgTypes.setTypeParser(1700, function (val) {
  return val;
});

const app = express();
const appConfig = AppConfig.getInstance();

runMigrations()
  .then()
  .catch((e) => {
    console.log(e);
  });

const postgraphileInstance = postgraphile(
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
    watchPg: true,
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
      XykPoolsVolumeSubscriptionsPlugin,
      OmnipoolAssetVolumePlugin,
      OmnipoolAssetVolumeSubscriptionsPlugin,
      StablepoolVolumePlugin,
      StablepoolVolumeSubscriptionsPlugin,
    ],
    externalUrlBase: process.env.BASE_PATH
      ? process.env.BASE_PATH + '/api'
      : undefined,
    graphileBuildOptions: {
      stateSchemas: ['squid_processor'],
    },
    allowExplain: true,
    exportGqlSchemaPath: getEnvPath('apiSupport/schema.graphql'),
  }
);

console.log(postgraphileInstance.options);

app.use(postgraphileInstance);

app.listen(appConfig.GQL_PORT, () => {
  console.log(`Squid API listening on port ${appConfig.GQL_PORT}`);
});
