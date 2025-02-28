import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { RolesEntity } from '@entities/role.entity';
import { UsersEntity } from '@entities/users.entity';
import { RolePermissionEntity } from '@entities/role-permissions.entity';

import { LoginDto } from '@dto/auth.dto';

import { BaseResponse } from '@common/base.response';
import { DbExceptions } from '@common/exceptions/db.exception';

import { jwtHelper } from '@utils/helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
  ) {}

  async login(dto: LoginDto): Promise<BaseResponse<any | Error>> {
    try {
      const { username, password } = dto;
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Admin is not found',
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Password is not valid',
        };
      }

      const TOKEN = jwtHelper.sign({
        id: user.id,
      });

      return {
        status: HttpStatus.OK,
        data: {
          accessToken: TOKEN,
        },
        message: 'Successfully logged in',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async getUserMe(user: any): Promise<any> {
    try {
      const userId = user.id;

      const userData = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!userData) {
        throw new Error('User not found');
      }

      const rolePermissions = await this.rolePermissionRepository.find({
        where: { role: { id: Number(userData.role.id) } },
      });

      const permissions = rolePermissions.map(rp => rp.permission);

      const role = await this.rolesRepository.findOne({
        where: { id: Number(userData.role.id) },
      });

      return {
        status: 0,
        message: null,
        data: {
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          status: userData.status,
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          username: userData.username,
          role: {
            id: role.id,
            name: role.name,
          },
          permissions: permissions,
        },
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
