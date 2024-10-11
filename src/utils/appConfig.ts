import { transformAndValidateSync } from 'class-transformer-validator';
import 'reflect-metadata';
import { Transform } from 'class-transformer';
import { IsNotEmpty, ValidationError } from 'class-validator';
import dotenv from 'dotenv';

import { events, calls } from '../types/';
import { NodeEnv } from './types';

dotenv.config();

export class AppConfig {
  private static instance: AppConfig;

  @IsNotEmpty()
  readonly NODE_ENV!: NodeEnv;

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly GQL_PORT: number = 8080;

  readonly BASE_PATH?: string;

  @IsNotEmpty()
  readonly DB_HOST: string = 'localhost';

  @IsNotEmpty()
  readonly DB_NAME: string = 'postgres';

  @IsNotEmpty()
  readonly DB_USER: string = 'postgres';

  @IsNotEmpty()
  readonly DB_PASS: string = 'postgres';

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly DB_PORT: number = 5432;

  @IsNotEmpty()
  readonly RPC_HYDRATION_URL!: string;

  @IsNotEmpty()
  readonly GATEWAY_HYDRATION_HTTPS!: string;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly PROCESS_LBP_POOLS!: boolean;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly PROCESS_XYK_POOLS!: boolean;

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    try {
      return transformAndValidateSync(AppConfig, process.env, {
        validator: { stopAtFirstError: true },
      });
    } catch (errors) {
      if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
        errors.forEach((error: ValidationError) => {
          // @ts-ignore
          Object.values(error.constraints).forEach((msg) => console.error(msg));
        });
      } else {
        console.error('Unexpected error during the environment validation');
      }
      throw new Error('Failed to validate environment variables');
    }
  }

  getEventsToListen() {
    const eventsToListen = [
      events.balances.transfer.name,
      events.tokens.transfer.name,
    ];

    if (this.PROCESS_LBP_POOLS) {
      eventsToListen.push(
        ...[
          events.lbp.poolCreated.name,
          events.lbp.poolUpdated.name,
          events.lbp.buyExecuted.name,
          events.lbp.sellExecuted.name,
        ]
      );
    }
    if (this.PROCESS_XYK_POOLS) {
      eventsToListen.push(
        ...[
          events.xyk.poolCreated.name,
          events.xyk.poolDestroyed.name,
          events.xyk.buyExecuted.name,
          events.xyk.sellExecuted.name,
        ]
      );
    }
    return eventsToListen;
  }

  getCallsToListen() {
    const callsToListen = [calls.parachainSystem.setValidationData.name];

    if (this.PROCESS_LBP_POOLS) {
      callsToListen.push(...[calls.lbp.createPool.name]);
    }
    if (this.PROCESS_XYK_POOLS) {
      callsToListen.push(...[calls.xyk.createPool.name]);
    }

    return callsToListen;
  }
}
