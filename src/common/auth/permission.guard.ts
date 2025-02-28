import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { Permissions } from '@utils/enum';

@Injectable()
export class PermissionGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permissions[]>(Permissions, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredPermissions) {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      return false;
    }

    return requiredPermissions.every(permission => user.permissions.includes(permission));
  }
}
