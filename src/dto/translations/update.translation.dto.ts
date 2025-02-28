import { IsString } from 'class-validator';

import { LANG } from '@utils/enum';

export class UpdateTranslationDto {
  @IsString()
  name?: LANG;

  @IsString()
  tag?: string;

  @IsString()
  types?: string;

  @IsString()
  status?: string;
}
