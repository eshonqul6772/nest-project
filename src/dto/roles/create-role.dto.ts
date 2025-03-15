import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsEnum } from 'class-validator';

import { Permissions, STATUS } from '@utils/enum';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(STATUS, { each: true })
  status: STATUS;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(Permissions, { each: true })
  permissions: Permissions[];
}
