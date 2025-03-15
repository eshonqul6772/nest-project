import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesEntity } from '@entities/role.entity';
import { RolePermissionEntity } from '@entities/role-permissions.entity';

import { RoleController } from '@controller/admin/role.controller';

import { RoleService } from '@services/role.service';
import { GlobalFilterService } from '@services/global-filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity, RolePermissionEntity])],
  controllers: [RoleController],
  providers: [RoleService, GlobalFilterService],
  exports: [RoleService, GlobalFilterService],
})
export class RoleModule {}
