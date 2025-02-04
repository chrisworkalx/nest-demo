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

import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('认证') // Swagger 分类
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

  // 说明
  @ApiOperation({
    summary: '用户登录',
    description: '使用用户名和密码进行登录',
  })

  // 示例
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  // 接口成功返回示例
  @ApiResponse({ status: 200, description: '返回 token' })
  // 接口失败 返回示例
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
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
