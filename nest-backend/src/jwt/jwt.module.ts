import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global() // 将此模块设置为全局模块
@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // 设置 JWT 密钥 生产环境存储在.env 中
      signOptions: { expiresIn: '24h' }, // 设置签名选项，例如过期时间
    }),
  ],
  exports: [JwtModule], // 导出 JwtModule 使得它可以在其他模块中使用
})
export class GlobalJwtModule {}
