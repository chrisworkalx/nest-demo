import { Controller, Get, Post, Body } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('set')
  async setRedisValue(@Body() body: { key: string; value: string }) {
    await this.redisService.set(body.key, body.value);
    return { message: 'Value set successfully' };
  }

  @Get('get')
  async getRedisValue(@Body() body: { key: string }) {
    const value = await this.redisService.get(body.key);
    return { key: body.key, value };
  }
}
