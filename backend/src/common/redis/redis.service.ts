import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    super({
      url: process.env.REDIS_URL,
      keyPrefix: process.env.REDIS_PREFIX,
    });
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
