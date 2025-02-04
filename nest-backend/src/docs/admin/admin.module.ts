/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 导入你的实体
import { User } from '../../auth/user.entity';
import { Log } from '../../log/log.entity';

export const dynamicImport = async (packageName: string) =>
  await new Function(`return import('${packageName}')`)();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Log]), // 确保 TypeORM 连接了你的实体
  ],
  providers: [],
})
export class AdminModule {
  static async setup(app) {
    const { Database, Resource } = await dynamicImport('@adminjs/typeorm');
    const AdminJs = await dynamicImport('adminjs');
    AdminJs.default.registerAdapter({ Database, Resource });

    const AdminJSExpress = await dynamicImport('@adminjs/express');
    const admin = new AdminJs.default({
      resources: [],
      rootPath: '/admin-sql',
    });

    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);
  }
}
