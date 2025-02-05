import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/logs.module';
import { GlobalJwtModule } from './jwt/jwt.module'; // 导入全局的 JwtModule
import { GlobalRedisModule } from './redis/redis.module';
import { GlobalTypeOrmModule } from './mysql/mysql.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
// import { Log } from './log/log.entity';

async function createAppModule(): Promise<DynamicModule> {
  const { AdminModule } = await import('@adminjs/nestjs');
  const { Database, Resource } = await import('@adminjs/typeorm');
  const AdminJs = await import('adminjs');
  AdminJs.default.registerAdapter({ Database, Resource });

  return {
    module: AppModule,
    imports: [
      GlobalTypeOrmModule,
      GlobalJwtModule,
      AuthModule,
      LogModule,
      GlobalRedisModule,
      TypeOrmModule.forFeature([User]),
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin-sql',
            resources: [],
          },
        }),
      }),
    ],
  };
}

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // 异步创建模块
  static async register(): Promise<DynamicModule> {
    return createAppModule();
  }
}
