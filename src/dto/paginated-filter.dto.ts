import { IsNumber, IsOptional } from 'class-validator';

import { SearchCriteria, SortDto } from './search-criteria.dto';

export class PaginatedFilterDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  perPage?: number = 10;

  @IsOptional()
  sort?: SortDto;

  @IsOptional()
  search?: SearchCriteria[];
}
