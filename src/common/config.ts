import * as process from 'process';
import { config as dotenvConfig } from 'dotenv';
import 'dotenv/config';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

const envFilePath = process.env['APP_STATUS'] === 'prod' ? '.env.production' : '.env.development';
dotenvConfig({ path: envFilePath });

export const configuration = {
  isProd: process.env['APP_STATUS'] === 'prod',
  port: process.env['PORT'] || 4445,
  envFilePath,
  getDataSourceConfig(): DataSourceOptions {
    return {
      type: 'postgres' as any,
      host:
        process.env['DB_HOST'] || 'cd27da2sn4hj7h.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env['DB_PORT']) || 5432,
      username: process.env['DB_USERNAME'] || 'u4gudisuseso0i',
      password:
        `${process.env['DB_PASSWORD']}` ||
        'p06ab451753fc047f475c8dcbda4f654f5d8dc85231f5582a15f887329a320c92',
      database: process.env['DB_DATABASE'] || 'd5olqocfprquot',
      entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
      synchronize: true,
    };
  },

  getTypeOrmConfig(): TypeOrmModuleOptions {
    const ormConfig = {
      type: (process.env['DB_TYPE'] as any) || 'postgres',
      host:
        process.env['DB_HOST'] || 'cd27da2sn4hj7h.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env['DB_PORT']) || 5432,
      username: process.env['DB_USERNAME'] || 'u4gudisuseso0i',
      password:
        `${process.env['DB_PASSWORD']}` ||
        'p06ab451753fc047f475c8dcbda4f654f5d8dc85231f5582a15f887329a320c92',
      database: process.env['DB_DATABASE'] || 'd5olqocfprquot',
      entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
      synchronize: false,
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
