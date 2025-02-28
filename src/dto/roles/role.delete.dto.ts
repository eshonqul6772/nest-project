import { IsNumber } from 'class-validator';

export class RoleDeleteDto {
  @IsNumber()
  id: number;
}
