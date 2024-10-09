import AggregatesPluggin from '@graphile/pg-aggregates';
import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import express from 'express';
import { NodePlugin } from 'graphile-build';
import type * as pg from 'pg';
import {
  gql,
  makeExtendSchemaPlugin,
  postgraphile,
  Plugin,
} from 'postgraphile';
import FilterPlugin from 'postgraphile-plugin-connection-filter';
import { ProcessorStatusPlugin } from './apiSupport/plugins/processorStatus.plugin';
import { AppConfig } from './utils/appConfig';
import { XykPoolsVolumePlugin } from './apiSupport/plugins/xykPoolsVolume.plugin';

const app = express();
const appConfig = AppConfig.getInstance();

app.use(
  postgraphile(
    {
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      database: appConfig.DB_NAME,
      user: appConfig.DB_USER,
      password: appConfig.DB_PASS,
    },
    'public',
    {
      graphiql: true,
      enhanceGraphiql: true,
      dynamicJson: true,
      disableDefaultMutations: true,
      skipPlugins: [NodePlugin],
      appendPlugins: [
        AggregatesPluggin,
        FilterPlugin,
        SimplifyInflectorPlugin,
        ProcessorStatusPlugin,
        XykPoolsVolumePlugin,
      ],
      externalUrlBase: appConfig.BASE_API_PATH,
      graphileBuildOptions: {
        stateSchemas: ['squid_processor'],
      },
    }
  )
);

app.listen(appConfig.GQL_PORT, () => {
  console.log(`Squid API listening on port ${appConfig.GQL_PORT}`);
});
