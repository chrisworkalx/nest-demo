import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/logs.module';
import { GlobalJwtModule } from './jwt/jwt.module'; // 导入全局的 JwtModule
import { GlobalRedisModule } from './redis/redis.module';
import { GlobalTypeOrmModule } from './mysql/mysql.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
@Module({
  imports: [
    GlobalTypeOrmModule,
    GlobalJwtModule,
    AuthModule,
    LogModule,
    GlobalRedisModule,
    TypeOrmModule.forFeature([User]), //就想要在当前模块中使用数据库    否则service中无法导入相关数据库实例
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
