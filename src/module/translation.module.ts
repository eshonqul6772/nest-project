import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TranslationsEntity } from '@entities/translations.entity';

import { TranslationController } from '@controller/admin/translation.controller';

import { TranslationService } from '@services/translation.service';
import { GlobalFilterService } from '@services/global-filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationsEntity])],
  controllers: [TranslationController],
  providers: [TranslationService, GlobalFilterService],
  exports: [TranslationService, GlobalFilterService],
})
export class TranslateModule {}
