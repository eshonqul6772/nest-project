import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { UsersEntity } from '@entities/users.entity';
import { FileEntity } from '@entities/file.entity';
import { RolesEntity } from '@entities/role.entity';

import { multerOptions } from '@utils/multer';

import { UserController } from '@controller/admin/user.controller';

import { UserService } from '@services/user.service';
import { FileService } from '@services/file.service';
import { GlobalFilterService } from '@services/global-filter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, FileEntity, RolesEntity]),
    MulterModule.register(multerOptions),
  ],
  providers: [UserService, GlobalFilterService, FileService],
  controllers: [UserController],
  exports: [UserService, GlobalFilterService, FileService],
})
export class UserModule {}
