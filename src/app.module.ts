import { join } from 'path';
import { DataSource } from 'typeorm';
import { configuration } from '@common/config';
import { ConfigModule } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiBearerAuth } from '@nestjs/swagger';

import { dataSource } from '@utils/dataSource';

import { UserModule } from '@module/user.module';
import { AuthModule } from '@module/auth.module';
import { RoleModule } from '@module/role.module';
import { TranslateModule } from '@module/translation.module';
import { ReferenceModule } from '@module/reference.module';

@ApiBearerAuth()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(configuration.getTypeOrmConfig()),
    UserModule,
    TranslateModule,
    RoleModule,
    AuthModule,
    ReferenceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        const logger = new Logger('DataSource');
        try {
          await dataSource.initialize();
          logger.log('Data source has been initialized');
          return dataSource;
        } catch (e) {
          logger.error('Error during Data Source initialization', e);
        }
      },
    },
  ],
})
export class AppModule {}
