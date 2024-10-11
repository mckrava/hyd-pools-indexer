// import { AppConfig } from '../../utils/appConfig';
// import { Client } from 'pg';
// import { join } from 'path';
// import { readFileSync } from 'fs';
//
// export async function predefineSubscriptions() {
//   const appConfig = AppConfig.getInstance();
//   const pgClient = new Client({
//     host: appConfig.DB_HOST,
//     port: appConfig.DB_PORT,
//     database: appConfig.DB_NAME,
//     user: appConfig.DB_USER,
//     password: appConfig.DB_PASS,
//   });
//
//   await pgClient.connect()
//
//   try {
//     const client = build.pgClient
//     const subscriptionsInitSqlFilePath = join(
//       __dirname,
//       '/../apiMigrations/1728573013112-subscriptions.sql'
//     );
//     const poolsSqlFilePath = join(
//       __dirname,
//       '/../apiMigrations/1728573024829-pools.sql'
//     );
//
//     const subscriptionsInitSql = readFileSync(
//       subscriptionsInitSqlFilePath,
//       'utf8'
//     );
//     const poolsInitSql = readFileSync(poolsSqlFilePath, 'utf8');
//
//     await client.query(subscriptionsInitSql);
//     await client.query(poolsInitSql);
//
//     console.log('SQL files executed successfully.');
//   } catch (error) {
//     console.error('Error executing SQL file:', error);
//     throw error;
//   }
//
//
// }
