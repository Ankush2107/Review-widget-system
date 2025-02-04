// Base Review Types (keeping existing ones)
export interface Review {
    id: string;
    source: 'google' | 'facebook';
    rating: number;
    content: string;
    author: string;
    date: string;
    avatar?: string;
  }
  
  // Widget Types (keeping existing ones)
  export type WidgetType = 'slider' | 'grid' | 'list' | 'masonry' | 'badge';
  
  export interface WidgetSettings {
    type: WidgetType;
    theme: 'light' | 'dark';
    showRating: boolean;
    showSource: boolean;
    autoplay?: boolean;
    interval?: number;
    itemsPerPage?: number;
  }
  
  export interface Widget {
    id: string;
    name: string;
    settings: WidgetSettings;
    sources: ('google' | 'facebook')[];
    createdAt: string;
    updatedAt: string;
    businessName?: string;        // Added for tracking business name
    googlePlaceId?: string;       // Added for Google Maps integration
    facebookPageUrl?: string;     // Added for Facebook Page integration
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    apiKey?: string;
  }
  
  // Extended Review Types for API Integration
  export interface GoogleReviewData {
    reviewId: string;
    placeId: string;
    businessName: string;
    rating: number;
    text: string;
    reviewer: {
      name: string;
      photoUrl: string;
      url: string;
      reviewCount: number;
      isLocalGuide: boolean;
    };
    publishDate: string;
    likesCount: number;
    responseFromOwner?: {
      text: string;
      date: string;
    };
    images?: string[];
  }
  
  export interface FacebookReviewData {
    id: string;
    pageUrl: string;
    pageName: string;
    isRecommended: boolean;
    text: string;
    user: {
      name: string;
      profileUrl: string;
      profilePic: string;
    };
    date: string;
    likesCount: number;
    comments?: {
      count: number;
      items: Array<{
        text: string;
        date: string;
        author: {
          name: string;
          profileUrl: string;
        };
      }>;
    };
  }
  
  // Review transformer functions
  export const transformGoogleReview = (review: GoogleReviewData): Review => ({
    id: review.reviewId,
    source: 'google',
    rating: review.rating,
    content: review.text,
    author: review.reviewer.name,
    date: review.publishDate,
    avatar: review.reviewer.photoUrl
  });
  
  export const transformFacebookReview = (review: FacebookReviewData): Review => ({
    id: review.id,
    source: 'facebook',
    rating: review.isRecommended ? 5 : 1, // Facebook uses recommendation system
    content: review.text,
    author: review.user.name,
    date: review.date,
    avatar: review.user.profilePic
  });

  // Existing types...

export interface WidgetCustomization {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
  font: 'system' | 'inter' | 'roboto' | 'poppins';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow: 'none' | 'sm' | 'md' | 'lg';
  spacing: 'compact' | 'normal' | 'relaxed';
}

// Update WidgetSettings to include customization
export interface WidgetSettings {
  type: WidgetType;
  theme: 'light' | 'dark';
  showRating: boolean;
  showSource: boolean;
  autoplay?: boolean;
  interval?: number;
  itemsPerPage?: number;
  customization: WidgetCustomization;
}