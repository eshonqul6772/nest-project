import { IsNumber } from 'class-validator';

export class UserDeleteDto {
  @IsNumber()
  id: number;
}
