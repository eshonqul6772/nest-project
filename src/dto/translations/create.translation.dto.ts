import { IsNotEmpty, IsString, IsEnum, IsObject, IsArray, ArrayNotEmpty } from 'class-validator';
import { LANG, LANG_TYPE, STATUS } from '@utils/enum';

export class CreateTranslationDto {
  @IsObject()
  @IsNotEmpty()
  name: LANG;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(LANG_TYPE, { each: true })
  types: LANG_TYPE[];

  @IsString()
  @IsEnum(STATUS, { each: true })
  status?: string;
}
