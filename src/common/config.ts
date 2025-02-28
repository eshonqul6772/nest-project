import * as process from 'process';
import 'dotenv/config';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const configuration = {
  isProd: process.env['APP_STATUS'] == 'prod',
  port: process.env['PORT'] || 3000,
  getDataSourceConfig(): DataSourceOptions {
    return {
      type: 'postgres' as any,
      host: 'localhost',
      port: 5432,
      username: 'makeup',
      password: '6772',
      database: 'makeup',
      entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
      synchronize: true,
    };
  },
  getTypeOrmConfig(): TypeOrmModuleOptions {
    const ormConfig = {
      type: 'postgres' as any,
      host: 'localhost',
      port: 5432,
      username: 'makeup',
      password: '6772',
      database: 'makeup',
      entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
      synchronize: true,
      logging: false,
    };

    // WARNING!!! Don't change to TRUE in PRODUCTION
    // if TRUE auto changed DB by Entity model
    if (configuration.isProd) {
      ormConfig.synchronize = false;
    }
    return ormConfig;
  },
};
