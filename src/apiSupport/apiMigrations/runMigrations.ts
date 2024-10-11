import { join } from 'path';
const migrations = require('node-pg-migrate');
const { exec } = require('child_process');

import { AppConfig } from '../../utils/appConfig';
import { Client } from 'pg';
import { getEnvPath } from '../../utils/helpers';

export async function runMigrations() {
  const appConfig = AppConfig.getInstance();
  const pgClient = new Client({
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    database: appConfig.DB_NAME,
    user: appConfig.DB_USER,
    password: appConfig.DB_PASS,
  });

  await pgClient.connect();

  try {
    await migrations.runner({
      migrationsSchema: 'squid_processor',
      migrationsTable: 'node_pg_migrations',
      schema: 'public',
      dbClient: pgClient,
      dir: getEnvPath('apiSupport/apiMigrations/migrations'),
      direction: 'up',
      count: 10000,
    });

    console.log('Migrations successfully executed');
  } catch (err) {
    console.error('Error executing migrations:', err);
  }
}
