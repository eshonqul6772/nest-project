import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class RoleUpdateDto {
  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions?: string[];
}
