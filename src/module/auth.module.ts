import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '@common/auth/auth.strategy';

import { UsersEntity } from '@entities/users.entity';
import { RolesEntity } from '@entities/role.entity';
import { RolePermissionEntity } from '@entities/role-permissions.entity';

import { AuthController } from '@controller/auth.controller';

import { AuthService } from '@services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, RolePermissionEntity, RolesEntity]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
