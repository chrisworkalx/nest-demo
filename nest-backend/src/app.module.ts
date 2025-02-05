import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/logs.module';
import { GlobalJwtModule } from './jwt/jwt.module'; // 导入全局的 JwtModule
import { GlobalRedisModule } from './redis/redis.module';
// import { GlobalTypeOrmModule } from './mysql/mysql.module';
// import { AdminModule } from './docs/admin/admin.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';

import { typeOrmAsyncConfig } from './mysql/config';

// import { AppDataSource } from './mysql/data-source'; // 确保路径正确

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
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    // GlobalTypeOrmModule,
    GlobalJwtModule,
    AuthModule,
    LogModule,
    GlobalRedisModule,
    // AdminModule,
    TypeOrmModule.forFeature([User]), //就想要在当前模块中使用数据库    否则service中无法导入相关数据库实例
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
