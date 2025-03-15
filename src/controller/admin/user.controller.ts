import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Res,
  Get,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { extname } from 'path';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage, Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersEntity } from '@entities/users.entity';

import { UserCreateDto } from '@dto/users/user.create.dto';
import { PaginatedFilterDto } from '@dto/paginated-filter.dto';

import { UserService } from '@services/user.service';

import { JwtGuard } from '@common/auth/auth.guard';

@ApiTags('users')
@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UsersEntity | any> {
    const user = await this.userService.getById(id);
    if (!user) {
      console.log('user not found');
    }
    return user;
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createUser(
    @Body() dto: UserCreateDto,
    @UploadedFile() file?: Express.Multer.File,
    @Res() res: Response,
  ) {
    const response = await this.userService.create(dto);
    res.status(response.status).send(response);
  }

  @Post('pageable')
  @UseGuards(JwtGuard)
  async findAll(@Body() paginatedFilterDto: PaginatedFilterDto) {
    return await this.userService.getPaginatedWithFilter(paginatedFilterDto);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Put('/:id')
  @UseGuards(JwtGuard)
  async updateCustomer(
    @UploadedFile() image: Multer,
    @Param() param: any,
    @Body() dto: any,
    @Res() res: Response,
  ) {
    const response = await this.userService.update(param, dto, image);
    res.status(response.status).send(response);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async delete(@Param() id: { id: number }) {
    return await this.userService.delete(id);
  }
}
