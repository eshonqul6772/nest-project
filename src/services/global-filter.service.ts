import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { OperationType } from '@utils/enum';
import { PaginatedFilterDto } from '@dto/paginated-filter.dto';
import { HttpStatus } from '@nestjs/common';

import { TypeSearch } from '@utils/enum';
import { PUBLIC_FIELDS } from '@utils/public-fields.decorator';
import { BaseResponseGet } from '@common/base.response';

@Injectable()
export class GlobalFilterService {
  constructor(private reflector: Reflector) {}

  async applyFilter<T>(
    repository: Repository<T>,
    paginatedFilter: PaginatedFilterDto,
  ): Promise<BaseResponseGet<any>> {
    const query = repository.createQueryBuilder('entity');

    const { page, perPage, sort, search } = paginatedFilter;

    const publicFields =
      this.reflector.get<string[]>(PUBLIC_FIELDS, repository.target as any) || [];

    if (publicFields.length > 0) {
      const columns = publicFields.map((field: any) => {
        return `entity.${field}`;
      });
      query.select(columns);
    } else {
      query.select('*');
    }

    if (sort) {
      query.orderBy(`entity.${sort.name}`, sort.direction.toUpperCase() as 'ASC' | 'DESC');
    }

    if (search && search.length > 0) {
      search.forEach((criteria, item) => {
        const { key, operation, value, type } = criteria;

        let formattedValue = value;
        if (type === TypeSearch.NUMBER) {
          formattedValue = Number(value);
        } else if (type === TypeSearch.BOOLEAN) {
          formattedValue = Boolean(value);
        } else if (type === TypeSearch.STRING) {
          if (operation === OperationType.WILDCARD) {
            formattedValue = formattedValue.toString();
          }
        }

        if (!Object.values(OperationType).includes(operation as OperationType)) {
          throw new Error(`Unsupported operation: ${operation}`);
        }

        switch (operation) {
          case OperationType.EQUAL:
            query.andWhere(`entity.${key} = :value${item}`, { [`value${item}`]: formattedValue });
            break;
          case OperationType.NOT_EQUAL:
            query.andWhere(`entity.${key} != :value${item}`, {
              [`value${item}`]: formattedValue,
            });
            break;
          case OperationType.GREATER_THAN:
            query.andWhere(`entity.${key} > :value${item}`, { [`value${item}`]: formattedValue });
            break;
          case OperationType.LESS_THAN:
            query.andWhere(`entity.${key} < :value${item}`, { [`value${item}`]: formattedValue });
            break;
          case OperationType.GREATER_THAN_OR_EQUAL:
            query.andWhere(`entity.${key} >= :value${item}`, {
              [`value${item}`]: formattedValue,
            });
            break;
          case OperationType.LESS_THAN_OR_EQUAL:
            query.andWhere(`entity.${key} <= :value${item}`, {
              [`value${item}`]: formattedValue,
            });
            break;
          case OperationType.IN:
            query.andWhere(`entity.${key} IN (:...value${item})`, {
              [`value${item}`]: formattedValue,
            });
            break;
          case OperationType.LIKE:
            query.andWhere(`entity.${key} LIKE :value${item}`, {
              [`value${item}`]: `%${formattedValue}%`,
            });
            break;
          case OperationType.WILDCARD:
            query.andWhere(`entity.${key} LIKE :value${item}`, {
              [`value${item}`]: `%${formattedValue}%`,
            });
            break;
          default:
            throw new Error(`Unsupported operation: ${operation}`);
        }
      });
    }

    const [data, totalCount] = await query.skip(page).take(perPage).getManyAndCount();

    const totalPages = Math.ceil(totalCount / perPage);

    let formattedData = data;
    if (publicFields.length > 0) {
      formattedData = (data as any[]).map(item => {
        const formattedItem: any = {};
        publicFields.forEach((field: any) => {
          const parts = field.split('.');
          let value = item;
          for (const part of parts) {
            value = value?.[part];
          }
          if (value !== undefined) {
            formattedItem[parts[0]] = value;
          }
        });
        return formattedItem;
      });
    }

    return {
      status: HttpStatus.OK,
      message: 'Data fetched successfully',
      data: formattedData,
      page: page,
      size: perPage,
      totalCount: totalCount,
      totalPages: totalPages,
    };
  }
}
