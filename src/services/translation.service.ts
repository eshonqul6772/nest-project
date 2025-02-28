import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { UsersEntity } from '@entities/users.entity';
import { TranslationsEntity } from '@entities/translations.entity';

import { PaginatedFilterDto } from '@dto/paginated-filter.dto';
import { UpdateTranslationDto } from '@dto/translations/update.translation.dto';

import { DbExceptions } from '@common/exceptions/db.exception';
import { BaseResponse, BaseResponseGet } from '@common/base.response';

import { GlobalFilterService } from './global-filter.service';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(TranslationsEntity)
    private translationRepository: Repository<TranslationsEntity>,
    private globalFilterService: GlobalFilterService,
  ) {}

  async getPaginatedWithFilter(
    paginatedFilterDto: PaginatedFilterDto,
  ): Promise<BaseResponseGet<TranslationsEntity[]>> {
    try {
      return await this.globalFilterService.applyFilter(
        this.translationRepository,
        paginatedFilterDto,
      );
    } catch (error) {
      return DbExceptions.handleget(error);
    }
  }

  async findOne(params: any): Promise<BaseResponse<any>> {
    try {
      const { tag } = params;
      const data = await this.translationRepository.findOne({
        where: { tag: tag },
      });

      if (!data) {
        return {
          status: HttpStatus.OK,
          data: [],
          message: 'No admin found!',
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

  async createTranslation(dto: any): Promise<BaseResponse<UsersEntity>> {
    try {
      const { name, types, status, tag } = dto;

      const translation = await this.translationRepository.findOneBy({ tag });
      if (translation) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Admin already exists!',
        };
      }
      const newTranslation = await this.translationRepository
        .createQueryBuilder('translation')
        .insert()
        .into(TranslationsEntity)
        .values({
          name,
          types,
          tag,
          status,
        })
        .returning(['name', 'types', 'tag', 'status'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newTranslation.raw,
        message: 'created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateTranslation(params: any, dto: UpdateTranslationDto): Promise<BaseResponse<any>> {
    try {
      const { name, tag, types, status } = dto;
      const { id } = params;
      const translation = await this.translationRepository.findOneBy({ id });
      if (!translation) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Admin not found!',
        };
      }

      const { raw } = await this.translationRepository
        .createQueryBuilder('translation')
        .update(TranslationsEntity)
        .set({
          name: name ?? translation.name,
          tag: tag ?? translation.tag,
          types: types ?? (translation.types as any),
          status: status ?? (translation.status as any),
        })
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Tage topilmadi',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteTranslation(param: any): Promise<BaseResponse<UsersEntity>> {
    try {
      const { id } = param;

      const { raw } = await this.translationRepository
        .createQueryBuilder()
        .softDelete()
        .from(TranslationsEntity)
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: 200,
        data: raw,
        message: 'Admin deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
