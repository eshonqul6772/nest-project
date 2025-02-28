import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RolesEntity } from '@entities/role.entity';
import { TranslationsEntity } from '@entities/translations.entity';
import { RolePermissionEntity } from '@entities/role-permissions.entity';

import { Permissions } from '@utils/enum';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(TranslationsEntity)
    private translationRepository: Repository<TranslationsEntity>,
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepository: Repository<RolePermissionEntity>,
    @InjectRepository(RolesEntity)
    private roleRepository: Repository<RolesEntity>,
  ) {}

  async getAllRoles(): Promise<RolesEntity[]> {
    return this.roleRepository.find();
  }

  async getTranslations(type: string, lang: 'uz' | 'oz') {
    const translations = await this.translationRepository
      .createQueryBuilder('translation')
      .where(':type = ANY(translation.types)', { type })
      .getMany();

    return translations.reduce((acc, item) => {
      acc[item.tag] = item.name[lang] || item.name['uz'];
      return acc;
    }, {});
  }

  async getAllPermission(): Promise<{ name: Permissions; title: Permissions }[]> {
    const permissions = await this.rolePermissionRepository.find();
    return permissions.map(item => ({
      name: item.permission,
      title: item.permission,
    }));
  }
}
