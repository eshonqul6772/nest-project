import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsEnum } from 'class-validator';

import { Permissions } from '@utils/enum';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(Permissions, { each: true })
  permissions: Permissions[];
}
