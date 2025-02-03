import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { Log } from './log/log.entity';
import { GlobalJwtModule } from './jwt/jwt.module'; // 导入全局的 JwtModule
import { GlobalRedisModule } from './redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'admin_db',
      entities: [User, Log],
      synchronize: true, // 仅开发环境使用
    }),
    GlobalJwtModule,
    AuthModule,
    LogModule,
    GlobalRedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
