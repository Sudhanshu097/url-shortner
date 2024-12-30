import { redis } from './client';
import { logger } from '@/lib/logger';

const DEFAULT_TTL = 60 * 60 * 24; // 24 hours in seconds
const URL_PREFIX = 'url:';

export class UrlCache {
  static async get(shortCode: string): Promise<string | null> {
    try {
      const cacheKey = `${URL_PREFIX}${shortCode}`;
      const cachedUrl = await redis.get(cacheKey);
      
      if (cachedUrl) {
        logger.info({ shortCode }, 'Cache hit');
        return cachedUrl;
      }
      
      logger.info({ shortCode }, 'Cache miss');
      return null;
    } catch (error) {
      logger.error({ error, shortCode }, 'Error retrieving from cache');
      return null;
    }
  }

  static async set(shortCode: string, url: string, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      const cacheKey = `${URL_PREFIX}${shortCode}`;
      await redis.set(cacheKey, url, 'EX', ttl);
      logger.info({ shortCode }, 'URL cached successfully');
    } catch (error) {
      logger.error({ error, shortCode }, 'Error setting cache');
    }
  }

  static async invalidate(shortCode: string): Promise<void> {
    try {
      const cacheKey = `${URL_PREFIX}${shortCode}`;
      await redis.del(cacheKey);
      logger.info({ shortCode }, 'Cache invalidated');
    } catch (error) {
      logger.error({ error, shortCode }, 'Error invalidating cache');
    }
  }

  static async bulkInvalidate(shortCodes: string[]): Promise<void> {
    try {
      const pipeline = redis.pipeline();
      shortCodes.forEach(shortCode => {
        const cacheKey = `${URL_PREFIX}${shortCode}`;
        pipeline.del(cacheKey);
      });
      await pipeline.exec();
      logger.info({ count: shortCodes.length }, 'Bulk cache invalidation complete');
    } catch (error) {
      logger.error({ error }, 'Error during bulk cache invalidation');
    }
  }
}