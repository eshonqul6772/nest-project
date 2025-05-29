import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { RolesEntity } from '@entities/role.entity';

import { CreateRoleDto } from '@dto/roles/create-role.dto';
import { RoleUpdateDto } from '@dto/roles/role.update.dto';
import { PaginatedFilterDto } from '@dto/paginated-filter.dto';

import { DbExceptions } from '@common/exceptions/db.exception';
import { BaseResponse, BaseResponseGet } from '@common/base.response';
import { GlobalFilterService } from '@services/global-filter.service';
import { RolePermissionEntity } from '@entities/role-permissions.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RolesEntity)
    private roleRepository: Repository<RolesEntity>,
    private globalFilterService: GlobalFilterService,
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepository: Repository<RolePermissionEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<RolesEntity> {
    const { permissions, description, status, name } = createRoleDto;

    const newPermission = Object.values(permissions);

    const role = this.roleRepository.create({
      name,
      description,
      status,
      permissions: newPermission,
    });

    const savedRole = await this.roleRepository.save(role);

    const rolePermissions = newPermission.map(perm =>
      this.rolePermissionRepository.create({
        role: savedRole,
        permission: perm,
      }),
    );

    await this.rolePermissionRepository.save(rolePermissions);

    return this.roleRepository.save(savedRole);
  }

  async getPaginatedWithFilter(
    paginatedFilterDto: PaginatedFilterDto,
  ): Promise<BaseResponseGet<RolesEntity[]>> {
    try {
      return await this.globalFilterService.applyFilter(this.roleRepository, paginatedFilterDto);
    } catch (error) {
      return DbExceptions.handleget(error);
    }
  }

  async getRoleById(id: number): Promise<RolesEntity> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updateRole(params: any, dto: RoleUpdateDto): Promise<BaseResponse<any>> {
    try {
      const { name, permissions, description } = dto;
      const { id } = params;

      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions'],
      });
      if (!role) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Role not found!',
        };
      }

      const updatedRole = await this.roleRepository
        .createQueryBuilder()
        .update(RolesEntity)
        .set({
          name: name ?? role.name,
          description: description ?? role.description,
          permissions: permissions ?? (role.permissions as any),
        })
        .where({ id })
        .returning('*')
        .execute();

      if (permissions) {
        const newPermissions = Object.values(permissions);

        await this.rolePermissionRepository
          .createQueryBuilder()
          .delete()
          .from(RolePermissionEntity)
          .where('roleId = :id', { id })
          .execute();

        const rolePermissions = newPermissions.map((perm: any) =>
          this.rolePermissionRepository.create({
            role,
            permission: perm,
          }),
        );
        await this.rolePermissionRepository.save(rolePermissions);
      }

      return {
        status: HttpStatus.OK,
        data: updatedRole.raw[0],
        message: 'Role updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteRole(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Role not found');
  }
}
