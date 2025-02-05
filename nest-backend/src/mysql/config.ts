/* eslint-disable @typescript-eslint/require-await */
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'admin_db',
      entities: [__dirname + '/../**/*.entity.{ts,js}'], // 自动加载实体
      timezone: '+08:00', // 设置时区
      synchronize: true, // 生产环境建议设为 false
      autoLoadEntities: true, // 自动加载实体
    };
  },
};
