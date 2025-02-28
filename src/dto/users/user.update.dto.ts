import { IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  username: string;

  @IsString()
  status: string;

  @IsString()
  roleId: string;

  @IsString()
  password: string;
}
