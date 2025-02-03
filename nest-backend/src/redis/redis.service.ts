/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  public client;
  constructor() {
    this.getClient();
  }

  getClient() {
    const client = new Redis({
      host: 'localhost',
      port: 6379,
      password: '12345678',
      db: 0,
    });
    // 连接成功提示
    client.on('connect', () => {
      console.log('Redis Client Connected');
    });
    client.on('error', (err) => console.log('Redis Client Error', err));

    this.client = client;
  }

  public async set(key: string, val: string, second?: number) {
    const res = await this.client.set(key, val, 'EX', second || 12 * 60 * 60);
    return res === 'OK';
  }

  public async get(key: string) {
    const res = await this.client.get(key);
    return res;
  }
}
