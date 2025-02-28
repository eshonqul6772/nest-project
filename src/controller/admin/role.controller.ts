import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Get, Delete, Param, Body, Put, Res, UseGuards } from '@nestjs/common';

import { CreateRoleDto } from '@dto/roles/create-role.dto';
import { PaginatedFilterDto } from '@dto/paginated-filter.dto';

import { RoleService } from '@services/role.service';
import { RolesEntity } from '@entities/role.entity';

import { Response } from 'express';
import { JwtGuard } from '@common/auth/auth.guard';

@ApiTags('roles')
@Controller('/admin/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RolesEntity> {
    return this.roleService.createRole(createRoleDto);
  }

  @Post('pageable')
  @UseGuards(JwtGuard)
  async findAll(@Body() paginatedFilterDto: PaginatedFilterDto) {
    return await this.roleService.getPaginatedWithFilter(paginatedFilterDto);
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  async updateCustomer(@Param() param: any, @Body() dto: any, @Res() res: Response) {
    const response = await this.roleService.updateRole(param, dto);
    res.status(response.status).send(response);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getRoleById(@Param('id') id: number): Promise<RolesEntity> {
    return this.roleService.getRoleById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteRole(@Param('id') id: number): Promise<void> {
    return this.roleService.deleteRole(id);
  }
}
