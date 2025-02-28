import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { UsersEntity } from '@entities/users.entity';

import { UserController } from '@controller/admin/user.controller';

import { UserService } from '@services/user.service';
import { GlobalFilterService } from '@services/global-filter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [UserService, GlobalFilterService],
  controllers: [UserController],
  exports: [UserService, GlobalFilterService],
})
export class UserModule {}
