import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@common/auth/auth.guard';

import { TranslationsEntity } from '@entities/translations.entity';

import { PaginatedFilterDto } from '@dto/paginated-filter.dto';
import { CreateTranslationDto } from '@dto/translations/create.translation.dto';

import { TranslationService } from '@services/translation.service';
import { DeleteTranslationDto } from "@dto/translations/delete.translation.dto";

@ApiTags('translations')
@Controller('/admin/translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserById(@Param('id') id: string): Promise<TranslationsEntity | any> {
    const user = await this.translationService.findOne(id);
    if (!user) {
      console.log('user not found');
    }
    return user;
  }

  @Post()
  @UseGuards(JwtGuard)
  async addOne(@Body() dto: CreateTranslationDto, @Res() res: Response) {
    const response = await this.translationService.createTranslation(dto);
    res.status(response.status).send(response);
  }

  @Post('pageable')
  async findAll(@Body() paginatedFilterDto: PaginatedFilterDto) {
    return await this.translationService.getPaginatedWithFilter(paginatedFilterDto);
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  async updateTranslate(@Param() param: any, @Body() dto: any, @Res() res: Response) {
    const response = await this.translationService.updateTranslation(param, dto);
    res.status(response.status).send(response);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteCustomer(@Param() param: string) {
    return await this.translationService.deleteTranslation(param);
  }
}
