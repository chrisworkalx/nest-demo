import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../auth/user.entity';
import { Log } from '../log/log.entity';

export const AppDataSource = new DataSource({
  type: 'mysql', // 数据库类型
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345678',
  database: 'admin_db',
  entities: [User, Log],
  synchronize: true, // 生产环境建议关闭
});
