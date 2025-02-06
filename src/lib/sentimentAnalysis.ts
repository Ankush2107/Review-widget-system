import Sentiment from 'sentiment';
import { Review } from '@/lib/types';

export interface SentimentScore {
  score: number;      // Overall sentiment score
  comparative: number; // Score per word
  positive: string[]; // Positive words found
  negative: string[]; // Negative words found
}

export class ReviewSentimentAnalyzer {
  private analyzer: Sentiment;

  constructor() {
    this.analyzer = new Sentiment();
  }

  analyzeSentiment(review: Review): SentimentScore {
    return this.analyzer.analyze(review.content);
  }

  batchAnalyze(reviews: Review[]): Map<string, SentimentScore> {
    const results = new Map();
    reviews.forEach(review => {
      results.set(review.id, this.analyzeSentiment(review));
    });
    return results;
  }

  getAverageSentiment(reviews: Review[]): number {
    const scores = reviews.map(review => this.analyzeSentiment(review).score);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
}

export const sentimentAnalyzer = new ReviewSentimentAnalyzer();