import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

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
      const result = await this.globalFilterService.applyFilter(
        this.translationRepository,
        paginatedFilterDto,
      );

      console.log('data', result.data.length);

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

  async createTranslation(dto: any): Promise<BaseResponse<TranslationsEntity>> {
    try {
      const { name, types, status, tag } = dto;

      const translation = await this.translationRepository.findOneBy({ tag });
      if (translation) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'this key already exists!',
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
        message: 'Tag not found',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteTranslation(id: number | string): Promise<void> {
    const result = await this.translationRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('tag not found');
  }
}
