import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    const options: RedisOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      keyPrefix: process.env.REDIS_PREFIX || 'weilshop:',
    };

    // Если указан REDIS_URL, используем его
    if (process.env.REDIS_URL) {
      super(process.env.REDIS_URL, {
        keyPrefix: options.keyPrefix,
      });
    } else {
      super(options);
    }
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
