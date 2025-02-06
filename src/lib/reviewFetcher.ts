import { Review } from '@/lib/types';
import { RetryManager } from './retry';
import { RateLimit } from './rateLimit';
import { reviewCache } from './cache';
import { reviewModeration } from './reviewModeration';
import { sentimentAnalyzer } from './sentimentAnalysis';
interface ApifyGoogleReview {
  reviewId: string;
  reviewerName: string;
  rating: number;
  text: string;
  publishedAtDate: string;
  reviewerPhotoUrl?: string;
}

interface ApifyFacebookReview {
  id: string;
  user: {
    name: string;
    profilePic?: string;
  };
  rating: number;
  text: string;
  date: string;
}

export class ReviewFetcher {
    private googleActorId: string;
    private facebookActorId: string;
    private googleToken: string;
    private facebookToken: string;
    private retryManager: RetryManager;          
    private googleRateLimit: RateLimit;          
    private facebookRateLimit: RateLimit; 

  constructor() {
    if (!process.env.APIFY_GOOGLE_ACTOR_ID || !process.env.APIFY_FACEBOOK_ACTOR_ID) {
        throw new Error('Apify actor IDs are required');
      }
      if (!process.env.APIFY_API_TOKEN_GOOGLE || !process.env.APIFY_API_TOKEN_FACEBOOK) {
        throw new Error('Apify API tokens are required');
      }
    this.googleActorId = process.env.APIFY_GOOGLE_ACTOR_ID!;
    this.facebookActorId = process.env.APIFY_FACEBOOK_ACTOR_ID!;
    this.googleToken = process.env.APIFY_API_TOKEN_GOOGLE!;
    this.facebookToken = process.env.APIFY_API_TOKEN_FACEBOOK!;
    this.retryManager = new RetryManager();
    this.googleRateLimit = new RateLimit({
      maxRequests: 10,
      intervalMs: 60000 // 10 requests per minute
    });
    this.facebookRateLimit = new RateLimit({
      maxRequests: 10,
      intervalMs: 60000
    });
  }

  async fetchGoogleReviews(placeId: string): Promise<Review[]> {
    if (!placeId) {
        throw new Error('Google Place ID is required');
      }
    const cacheKey = reviewCache.getKey('google', placeId);
    
    try {
      // Check cache first
      const cached = await reviewCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Rate limit and retry logic
      await this.googleRateLimit.acquire();
      
      const reviews = await this.retryManager.execute(async () => {
        const response = await fetch(
          `https://api.apify.com/v2/acts/${this.googleActorId}/run-sync-get-dataset-items`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.googleToken}`,
            },
            body: JSON.stringify({
              startUrls: [{
                url: `https://www.google.com/maps/place/?q=place_id:${placeId}`
              }],
              maxReviews: 100,
              language: "en"
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const transformedReviews = this.transformGoogleReviews(data);
        return reviewModeration.filterReviews(transformedReviews);
      });

      // Cache the results
      await reviewCache.set(cacheKey, reviews);
      
      return reviews;
    } catch (error: any) {  // Change error to error: any
        console.error('Error fetching Google reviews:', error);
        throw new Error(`Failed to fetch Google reviews: ${error.message}`);
    }
  }


  async fetchFacebookReviews(pageUrl: string): Promise<Review[]> {
    if (!pageUrl) {
        throw new Error('Facebook Page URL is required');
      }
    const cacheKey = reviewCache.getKey('facebook', pageUrl);
    
    try {
      // Check cache first
      const cached = await reviewCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Rate limit and retry logic
      await this.facebookRateLimit.acquire();
      
      const reviews = await this.retryManager.execute(async () => {
        const response = await fetch(
          `https://api.apify.com/v2/acts/${this.facebookActorId}/run-sync-get-dataset-items`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.facebookToken}`,
            },
            body: JSON.stringify({
              startUrls: [{ url: pageUrl }],
              maxReviews: 100,
              language: "en"
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return this.transformFacebookReviews(data);
      });

      // Cache the results
      await reviewCache.set(cacheKey, reviews);
      
      return reviews;
    } catch (error) {
      console.error('Error fetching Facebook reviews:', error);
      throw new Error(`Failed to fetch Facebook reviews: ${error.message}`);
    }
  }

  private transformGoogleReviews(data: any[]): Review[] {
    if (!Array.isArray(data)) {
      return [];
    }
    
    return data.map(review => ({
      id: review.reviewId || '',
      source: 'google' as const,
      author: review.reviewerName || 'Anonymous',
      rating: Number(review.rating) || 0,
      content: review.text || '',
      date: review.publishedAtDate || new Date().toISOString(),
      avatar: review.reviewerPhotoUrl || undefined
    }));
  }

  private transformFacebookReviews(data: any[]): Review[] {
    if (!Array.isArray(data)) {
      return [];
    }
    
    return data.map(review => ({
      id: review.id || '',
      source: 'facebook' as const,
      author: review.user?.name || 'Anonymous',
      rating: Number(review.rating) || 0,
      content: review.text || '',
      date: review.date || new Date().toISOString(),
      avatar: review.user?.profilePic || undefined
    }));
  }


  async fetchAllReviews(placeId: string, pageUrl: string): Promise<Review[]> {
    try {
      const [googleReviews, facebookReviews] = await Promise.all([
        this.fetchGoogleReviews(placeId),
        this.fetchFacebookReviews(pageUrl)
      ]);

      return [...googleReviews, ...facebookReviews].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      throw error;
    }
  }
  private async processReviews(reviews: Review[], widgetId: string) {
    const sentimentScores = sentimentAnalyzer.batchAnalyze(reviews);
    
    const stats = {
      averageScore: sentimentAnalyzer.getAverageSentiment(reviews),
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0
    };
  
    sentimentScores.forEach(score => {
      if (score.score > 0) stats.positiveCount++;
      else if (score.score < 0) stats.negativeCount++;
      else stats.neutralCount++;
    });
  
    await Widget.findByIdAndUpdate(widgetId, { 
      $set: { sentimentStats: stats }
    });
  
    return reviews;
  }
}

export const reviewFetcher = new ReviewFetcher();