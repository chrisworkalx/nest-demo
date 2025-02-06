/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/logs.module';
import { GlobalJwtModule } from './jwt/jwt.module'; // 导入全局的 JwtModule
import { GlobalRedisModule } from './redis/redis.module';
import { GlobalTypeOrmModule } from './mysql/mysql.module';
// import { AdminModule } from './docs/admin/admin.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';

// import { typeOrmAsyncConfig } from './mysql/config';

// 邮件服务
import { join } from 'path';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailService } from './email.service';
// import * as nodemailer from 'nodemailer';
// import { AppDataSource } from './mysql/data-source'; // 确保路径正确

import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { HttpModule } from '@nestjs/axios';
import { ChatSession, ChatSessionSchema } from './schemas/chat-session.schema';
import { ChatLog, ChatLogSchema } from './schemas/chat-log.schema';

@Module({
  imports: [
    import('@adminjs/nestjs').then(({ AdminModule }) => {
      // await AppDataSource.initialize();
      return AdminModule.createAdminAsync({
        useFactory: async () => {
          const { AdminJS } = await import('adminjs');
          const AdminJSTypeORM = await import('@adminjs/typeorm');

          AdminJS.registerAdapter({
            Database: AdminJSTypeORM.Database,
            Resource: AdminJSTypeORM.Resource,
          });
          return {
            adminJsOptions: {
              rootPath: '/admin-sql',
              resources: [],
            },
          };
        },
      });
    }),
    // TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    GlobalTypeOrmModule,
    GlobalJwtModule,
    AuthModule,
    LogModule,
    GlobalRedisModule,
    // AdminModule,
    TypeOrmModule.forFeature([User]), //就想要在当前模块中使用数据库    否则service中无法导入相关数据库实例

    //邮件服务
    MailerModule.forRootAsync({
      imports: [ConfigModule], // 引入 ConfigModule
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService): MailerOptions => {
        return {
          transport: {
            host: 'smtp.163.com', // 网易邮箱的 SMTP 服务器地址
            port: 25, // 网易邮箱的 SMTP 端口
            secure: false, // 使用不安全的连接方式
            auth: {
              user: 'chrisyao0208@163.com', // 你的网易邮箱地址
              pass: configService.get<string>('NETMAIL_KEY', ''), // 网易邮箱的密码或应用专用密码
            },
          },
          defaults: {
            from: '"No Reply" <chrisyao0208@163.com>', // 设置默认发件人地址
          },
          template: {
            dir: join(__dirname, '../templates'), //这里有坑注意
            adapter: new PugAdapter(), // 可选：使用 Pug 作为模板引擎
            options: {
              strict: true,
            },
          },
        };
      },
    }),

    HttpModule,
    MongooseModule.forRoot('mongodb://localhost:27017/chat-app'), // 连接 MongoDB chat-app为数据库
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: ChatSessionSchema },
    ]),
    MongooseModule.forFeature([{ name: ChatLog.name, schema: ChatLogSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, ChatGateway, ChatService],
})
export class AppModule {}
