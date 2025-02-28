import { DataSource } from 'typeorm';
import { configuration } from '@common/config';

const dataSourceConfig = configuration.getDataSourceConfig();
export const dataSource = new DataSource(dataSourceConfig);
