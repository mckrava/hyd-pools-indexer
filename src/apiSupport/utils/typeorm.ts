import { Client } from 'pg';
import { DataSource } from 'typeorm';
import path from 'node:path';
import { XykPool } from '../../model';

export function getTypeormConnection(pgClient: Client) {
  const datasource = new DataSource({
    type: 'postgres',
    synchronize: false,
    // entities: [path.join(process.cwd(), 'src/model/generated/*.model.ts')],
    entities: [XykPool],
    // entities: [path.join(process.cwd(), 'lib/model/generated/**/*.model.js')],
    extra: {
      client: pgClient,
    },
  });

  return datasource;
}
