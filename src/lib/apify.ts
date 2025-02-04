import { cacheService } from './cache';
import { Review } from './types';

export const fetchGoogleReviews = async (placeId: string): Promise<Review[]> => {
  try {
    // Try to get from cache first
    const cached = await cacheService.getReviews('google', placeId);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from Apify
    const run = await fetch('https://api.apify.com/v2/acts/compass~google-maps-reviews-scraper/runs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.APIFY_API_TOKEN_GOOGLE}`,
      },
      body: JSON.stringify({
        startUrls: [{
          url: `https://www.google.com/maps/place/?q=place_id:${placeId}`
        }],
        maxReviews: 100,
        language: "en"
      }),
    });

    if (!run.ok) {
      throw new Error(`HTTP error! status: ${run.status}`);
    }

    const runData = await run.json();
    const datasetId = runData.data.defaultDatasetId;

    // Wait for the task to complete (implement proper polling)
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Fetch the results
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?clean=true`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.APIFY_API_TOKEN_GOOGLE}`,
        },
      }
    );

    const reviews: Review[] = (await datasetResponse.json()).map(review => ({
      id: review.reviewId || review._id,
      source: 'google',
      rating: review.rating,
      content: review.text,
      author: review.name,
      date: review.publishedAtDate,
      avatar: review.reviewerPhotoUrl
    }));

    // Store in cache
    await cacheService.setReviews('google', placeId, reviews);

    return reviews;
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    throw error;
  }
};

export const fetchFacebookReviews = async (pageUrl: string): Promise<Review[]> => {
  try {
    // Try to get from cache first
    const cached = await cacheService.getReviews('facebook', pageUrl);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from Apify
    const run = await fetch('https://api.apify.com/v2/acts/compass~facebook-reviews-scraper/runs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.APIFY_API_TOKEN_FACEBOOK}`,
      },
      body: JSON.stringify({
        startUrls: [{ url: pageUrl }],
        maxReviews: 100,
        language: "en"
      }),
    });

    if (!run.ok) {
      throw new Error(`HTTP error! status: ${run.status}`);
    }

    const runData = await run.json();
    const datasetId = runData.data.defaultDatasetId;

    // Wait for the task to complete (implement proper polling)
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Fetch the results
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?clean=true`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.APIFY_API_TOKEN_FACEBOOK}`,
        },
      }
    );

    const reviews: Review[] = (await datasetResponse.json()).map(review => ({
      id: review.id || review._id,
      source: 'facebook',
      rating: review.isRecommended ? 5 : 1,
      content: review.text,
      author: review.user.name,
      date: review.date,
      avatar: review.user.profilePic
    }));

    // Store in cache
    await cacheService.setReviews('facebook', pageUrl, reviews);

    return reviews;
  } catch (error) {
    console.error('Error fetching Facebook reviews:', error);
    throw error;
  }
};