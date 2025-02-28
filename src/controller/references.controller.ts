import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { RolesEntity } from '@entities/role.entity';

import { JwtGuard } from '@common/auth/auth.guard';
import { Permissions } from '@utils/enum';

import { ReferenceService } from '@services/refernces.service';

@ApiTags('admin/references')
@Controller('admin/references')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('permissions')
  @UseGuards(JwtGuard)
  async getAllPermission(): Promise<{ name: Permissions; title: Permissions }[]> {
    return this.referenceService.getAllPermission();
  }

  @Get('roles')
  @UseGuards(JwtGuard)
  async getAllRoles(): Promise<RolesEntity[]> {
    return this.referenceService.getAllRoles();
  }

  @Get('translations/:type/:lang')
  async getTranslations(@Param('type') type: string, @Param('lang') lang: 'uz' | 'oz') {
    return this.referenceService.getTranslations(type, lang);
  }
}
