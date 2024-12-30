import Redis from 'ioredis';
import { logger } from '@/lib/logger';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

class RedisClient {
  private static instance: Redis;
  private static isConnected: boolean = false;

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(redisConfig);
      
      RedisClient.instance.on('connect', () => {
        RedisClient.isConnected = true;
        logger.info('Redis connected successfully');
      });

      RedisClient.instance.on('error', (error) => {
        RedisClient.isConnected = false;
        logger.error('Redis connection error:', error);
      });
    }

    return RedisClient.instance;
  }

  public static isReady(): boolean {
    return RedisClient.isConnected;
  }
}

export const redis = RedisClient.getInstance();