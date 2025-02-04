import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global() // 将此模块设置为全局模块
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'admin_db',
      entities: ['dist/**/*.entity{.ts,.js}'],
      timezone: '+08:00', //服务器上配置的时区
      synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      autoLoadEntities: true,
    }),
  ],
  exports: [TypeOrmModule], // 导出 JwtModule 使得它可以在其他模块中使用
})
export class GlobalTypeOrmModule {}
