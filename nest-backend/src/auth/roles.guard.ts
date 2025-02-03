// 创建角色守卫

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    console.log('requiredRoles', requiredRoles);
    if (!requiredRoles) {
      return true; // 没有指定角色要求，则允许访问
    }

    const request = context.switchToHttp().getRequest();

    const user: any = request.user;

    // 在auth.service.ts中添加jwt验证 role 所以可以解析role的信息
    // this.jwtService.sign({ userId: user.id, role: user.role }),
    console.log('user', user);

    if (!user || !requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
