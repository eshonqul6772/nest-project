import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

import { TypeSearch, OperationType } from '@utils/enum';

export class SortDto {
  @IsOptional()
  name: string;

  @IsOptional()
  direction: 'asc' | 'desc';
}

export class SearchCriteria {
  @IsNotEmpty({ message: 'Key is required' })
  key: string;

  @IsNotEmpty()
  @IsEnum(OperationType)
  operation: OperationType;

  @IsOptional()
  value: any;

  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(TypeSearch, { message: 'Invalid type. Use STRING, NUMBER, or DATE' })
  type: TypeSearch;
}
