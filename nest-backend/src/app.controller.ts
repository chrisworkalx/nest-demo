import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';

import { EmailService } from './email.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('系统')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags('用户')
  @ApiBearerAuth() // 需要 Token 认证
  @Get('user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 200, description: '成功获取用户信息' })
  getUser(@Request() req) {
    const userId = req.user.userId;
    return this.appService.getUserInfo(userId as number);
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

  @Get('send-email')
  @ApiOperation({ summary: '发送邮件' })
  async sendEmail(
    @Query('email') email: string,
    @Query('name') name: string,
    @Query('link') link?: string,
  ) {
    await this.emailService.sendWelcomeEmail(
      email,
      name,
      link || 'https://www.baidu.com',
    );
    return 'Email sent!';
  }
}
