import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

const envFilePath = process.env.APP_STATUS === 'prod' ? '.env.production' : '.env.development';
dotenvConfig({ path: envFilePath });

const getBaseDatabaseConfig = (): DataSourceOptions => ({
  type: (process.env.DB_TYPE as 'postgres') || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'default_db',
  entities: [join(__dirname, '../**/entities/**.entity.{ts,js}')],
  synchronize: false,
  logging: false,
});

export const configuration = {
  isProd: process.env.APP_STATUS === 'prod',
  port: parseInt(process.env.PORT || '4445', 10),
  envFilePath: process.env.APP_STATUS,

  getDataSourceConfig(): DataSourceOptions {
    return getBaseDatabaseConfig();
  },

  getTypeOrmConfig(): TypeOrmModuleOptions {
    const baseConfig = getBaseDatabaseConfig();

    return {
      ...baseConfig,
      synchronize: !this.isProd,
      logging: false,
    };
  },
};
