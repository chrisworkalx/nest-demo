/* eslint-disable @typescript-eslint/require-await */
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global() // 让此模块在整个应用程序中可用
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // 加载 .env 配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 引入 ConfigModule
      inject: [ConfigService], // 注入 ConfigService
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASS', '12345678'),
        database: configService.get<string>('DB_NAME', 'admin_db'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'], // 自动加载实体
        timezone: '+08:00', // 设置时区
        synchronize: configService.get<boolean>('DB_SYNC', false), // 生产环境建议设为 false
        autoLoadEntities: true, // 自动加载实体
      }),
    }),
  ],
  exports: [TypeOrmModule], // 导出 TypeOrmModule，使其可以在其他模块使用
})
export class GlobalTypeOrmModule {}
