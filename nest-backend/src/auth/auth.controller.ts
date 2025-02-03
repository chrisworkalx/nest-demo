import {
  Controller,
  Request,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogService } from '../log/logs.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { Request as ExpRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logService: LogService,
  ) {}

  @Post('register')
  register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post('update-role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateRole(
    @Body() body: { userId: number; newRole: Role },
    @Request() req,
  ) {
    const user = await this.authService.updateUserRole(
      body.userId,
      body.newRole,
    );

    // 记录角色变更日志
    await this.logService.createLog(
      'ROLE_CHANGE',
      req?.user?.userId as number,
      `Changed user ${body.userId} to ${body.newRole}`,
    );

    return user;
  }

  @Post('logout')
  logout(@Req() request: ExpRequest) {
    const authHeader = request.headers['authorization']; // 获取 Authorization 头部
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // 获取 Bearer token 部分
    if (!token) {
      throw new Error('Token is missing');
    }
    return this.authService.logout(token);
  }
}
