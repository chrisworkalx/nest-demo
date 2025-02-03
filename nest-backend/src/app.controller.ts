import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getUser() {
    return { message: 'Welcome, authenticated user!' };
  }

  // 仅 ADMIN 角色可以访问 /admin：

  // 非admin角色
  //   {
  //     "message": "Insufficient permissions",
  //     "error": "Forbidden",
  //     "statusCode": 403
  // }
  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAdmin() {
    return { message: 'Welcome, admin!' };
  }
}
