import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { UsersEntity } from '@entities/users.entity';
import { FileEntity } from '@entities/file.entity'

import { UserController } from '@controller/admin/user.controller';

import { UserService } from '@services/user.service';
import { GlobalFilterService } from '@services/global-filter.service';
import { FileService } from '@services/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, FileEntity]),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  providers: [UserService, GlobalFilterService, FileService],
  controllers: [UserController],
  exports: [UserService, GlobalFilterService, FileService],
})
export class UserModule {}
