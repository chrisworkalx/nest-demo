import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Global() // 将此模块设置为全局模块
@Module({
  providers: [RedisService],
  exports: [RedisService],
  controllers: [RedisController],
})
export class GlobalRedisModule {}
