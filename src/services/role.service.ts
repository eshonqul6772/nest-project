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

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RolesEntity)
    private roleRepository: Repository<RolesEntity>,
    private globalFilterService: GlobalFilterService,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<RolesEntity> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
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
      const role = await this.roleRepository.findOneBy({ id });
      if (!role) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Admin not found!',
        };
      }

      const { raw } = await this.roleRepository
        .createQueryBuilder('admins')
        .update(RolesEntity)
        .set({
          name: name ?? role.name,
          description: description ?? role.description,
          permissions: permissions ?? (role.permissions as any),
        })
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Admin updated successfully!',
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
