import { IsNumber } from 'class-validator';

export class DeleteTranslationDto {
  @IsNumber()
  id: number | string;
}
