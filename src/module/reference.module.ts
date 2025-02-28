import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesEntity } from '@entities/role.entity';
import { RolePermissionEntity } from '@entities/role-permissions.entity';
import { TranslationsEntity } from '@entities/translations.entity';

import { ReferenceController } from '@controller/references.controller';
import { TranslationController } from '@controller/admin/translation.controller';

import { ReferenceService } from '@services/refernces.service';
import { TranslationService } from '@services/translation.service';
import { RoleService } from '@services/role.service';
import { GlobalFilterService } from '@services/global-filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermissionEntity, RolesEntity, TranslationsEntity])],
  controllers: [ReferenceController, TranslationController],
  providers: [ReferenceService, TranslationService, RoleService, GlobalFilterService],
  exports: [ReferenceService, TranslationService, RoleService, GlobalFilterService],
})
export class ReferenceModule {}
