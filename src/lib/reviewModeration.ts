import { Review } from '@/lib/types';

export class ReviewModeration {
  private profanityList: Set<string>;
  private spamPatterns: RegExp[];

  constructor() {
    this.profanityList = new Set(['inappropriate', 'offensive']); // Add more words
    this.spamPatterns = [
      /\b(http|www)\S+/i,
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
      /\+?\d[\d\s-]{8,}/
    ];
  }

  filterReviews(reviews: Review[]): Review[] {
    return reviews.filter(review => 
      this.isAppropriate(review) && 
      !this.isSpam(review) && 
      this.isValidContent(review)
    );
  }

  private isAppropriate(review: Review): boolean {
    const words = review.content.toLowerCase().split(/\s+/);
    return !words.some(word => this.profanityList.has(word));
  }

  private isSpam(review: Review): boolean {
    return this.spamPatterns.some(pattern => pattern.test(review.content));
  }

  private isValidContent(review: Review): boolean {
    return (
      review.content.length >= 5 &&
      review.content.length <= 1000 &&
      review.rating >= 1 &&
      review.rating <= 5 &&
      review.author.length > 0
    );
  }
}

export const reviewModeration = new ReviewModeration();