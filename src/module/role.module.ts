import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesEntity } from '@entities/role.entity';

import { RoleController } from '@controller/admin/role.controller';

import { RoleService } from '@services/role.service';
import { GlobalFilterService } from '@services/global-filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  controllers: [RoleController],
  providers: [RoleService, GlobalFilterService],
  exports: [RoleService, GlobalFilterService],
})
export class RoleModule {}
