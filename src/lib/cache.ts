import { createClient } from 'redis';
import { Review } from '@/lib/types';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
redis.connect().catch(console.error);

const CACHE_TTL = 60 * 60; // 1 hour in seconds

export const cacheService = {
  async getReviews(source: string, id: string): Promise<Review[] | null> {
    const key = `reviews:${source}:${id}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  },

  async setReviews(source: string, id: string, reviews: Review[]): Promise<void> {
    const key = `reviews:${source}:${id}`;
    await redis.set(key, JSON.stringify(reviews), {
      EX: CACHE_TTL
    });
  },

  async invalidateReviews(source: string, id: string): Promise<void> {
    const key = `reviews:${source}:${id}`;
    await redis.del(key);
  }
};