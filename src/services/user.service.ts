import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { UsersEntity } from '@entities/users.entity';
import { RolesEntity } from '@entities/role.entity';
import { FileEntity } from '@entities/file.entity';

import { PaginatedFilterDto } from '@dto/paginated-filter.dto';
import { UserUpdateDto } from '@dto/users/user.update.dto';

import { STATUS } from '@utils/enum';
import { bcryptHelper } from '@utils/helper';
import { DbExceptions } from '@common/exceptions/db.exception';
import { BaseResponse, BaseResponseGet } from '@common/base.response';

import { GlobalFilterService } from '@services/global-filter.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(RolesEntity)
    private readonly roleRepository: Repository<RolesEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private globalFilterService: GlobalFilterService,
  ) {}

  async getPaginatedWithFilter(
    paginatedFilterDto: PaginatedFilterDto,
  ): Promise<BaseResponseGet<UsersEntity[]>> {
    try {
      const result = await this.globalFilterService.applyFilter(
        this.userRepository,
        paginatedFilterDto,
      );

      result.data = await Promise.all(
        result.data.map(async (user: any) => {
          const role = await this.roleRepository.findOne({ where: { id: user.roleId } });
          const photo = await this.fileRepository.findOne({ where: { id: user.photoId } });
          return {
            ...user,
            photo: photo ? { id: photo.id, name: photo.name, uuid: photo.uuid } : user.photoId,
            role: role ? { id: role.id, name: role.name } : null,
          };
        }),
      );

      return {
        status: HttpStatus.OK,
        data: result.data,
        message: 'Data fetched successfully',
        page: result.page,
        size: result.size,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
      };
    } catch (error) {
      return DbExceptions.handleget(error);
    }
  }

  async getById(id: any): Promise<BaseResponse<any>> {
    try {
      const data = await this.userRepository.findOne({
        where: { id: id },
      });

      if (!data) {
        return {
          status: HttpStatus.OK,
          data: [],
          message: 'No user found!',
        };
      }
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async create(dto: any): Promise<BaseResponse<UsersEntity>> {
    try {
      const { username, password, firstName, lastName, status, photoId, roleId } = dto;

      const hashedPassword = await bcryptHelper.hash(password);

      const user = await this.userRepository.findOneBy({ username });
      if (user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'User already exists!',
        };
      }

      const newUser = await this.userRepository
        .createQueryBuilder('users')
        .insert()
        .into(UsersEntity)
        .values({
          username,
          password: hashedPassword,
          firstName,
          lastName,
          photoId,
          status,
          role: roleId,
        })
        .returning(['username', 'password', 'firstName', 'lastName', 'status'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newUser.raw,
        message: 'user created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async update(params: any, dto: UserUpdateDto, image: any): Promise<BaseResponse<any>> {
    try {
      const { username, password, firstName, lastName, status, roleId } = dto;
      const { id } = params;
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Admin not found!',
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { raw } = await this.userRepository
        .createQueryBuilder('users')
        .update(UsersEntity)
        .set({
          firstName: firstName ?? user.firstName,
          lastName: lastName ?? user.lastName,
          password: hashedPassword ?? user.password,
          username: username ?? user.username,
          role: roleId ?? (user.role as any),
          photoId: image ?? user.photoId,
          status: status ?? (user.status as any),
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

  async delete({ id }: { id: number }): Promise<BaseResponse<UsersEntity>> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: id },
      });

      user.status = STATUS.DELETED;
      const updatedUser = await this.userRepository.save(user);

      return {
        status: 200,
        data: updatedUser,
        message: 'User soft deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
