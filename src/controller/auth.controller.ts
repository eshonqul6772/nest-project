import { Response } from 'express';
import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@common/auth/auth.guard';

import { LoginDto } from '@dto/auth.dto';
import { User } from '@dec/user.decorator';

import { AuthService } from '@services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(dto);
    res.status(response.status).json(response);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getUserMe(@User() user: any) {
    return this.authService.getUserMe(user);
  }
}
