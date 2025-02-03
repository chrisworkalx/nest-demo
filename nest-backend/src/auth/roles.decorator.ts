// 创建角色装饰器
// 这个装饰器用于标记哪些 API 需要特定角色权限。
import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
