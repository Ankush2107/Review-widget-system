import { createClient } from 'redis';
import { Review } from '@/lib/types';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', err => console.error('Redis Client Error', err));

// Connect to Redis
redis.connect().catch(console.error);

const CACHE_TTL = 60 * 60; // 1 hour in seconds

export const reviewCache = {
  async get(key: string): Promise<Review[] | null> {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  },

  async set(key: string, reviews: Review[]): Promise<void> {
    await redis.set(key, JSON.stringify(reviews), {
      EX: CACHE_TTL
    });
  },

  getKey(source: 'google' | 'facebook', id: string): string {
    return `reviews:${source}:${id}`;
  }
};