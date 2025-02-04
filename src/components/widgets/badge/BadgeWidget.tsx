'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Review, WidgetSettings } from '@/lib/types';

interface BadgeWidgetProps {
  reviews: Review[];
  settings: WidgetSettings;
}

export default function BadgeWidget({ reviews, settings }: BadgeWidgetProps) {
  const stats = useMemo(() => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    return {
      averageRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
      googleCount: reviews.filter(r => r.source === 'google').length,
      facebookCount: reviews.filter(r => r.source === 'facebook').length
    };
  }, [reviews]);

  return (
    <div className={`inline-flex items-center rounded-lg p-4 shadow-sm ${
      settings.theme === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Rating Section */}
      <div className="text-center">
        <div className="text-3xl font-bold">{stats.averageRating}</div>
        <div className="flex items-center justify-center mt-1">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-4 h-4 ${
                index < Math.round(parseFloat(stats.averageRating))
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div className={`text-sm mt-1 ${
          settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {stats.totalReviews} reviews
        </div>
      </div>

      {/* Source Breakdown */}
      {settings.showSource && (
        <div className={`border-l ml-4 pl-4 ${
          settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {stats.googleCount > 0 && (
            <div className="flex items-center space-x-2 mb-1">
              <div className="relative w-4 h-4">
                <Image
                  src="/google-icon.png"
                  alt="Google Reviews"
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </div>
              <span className="text-sm">{stats.googleCount}</span>
            </div>
          )}
          {stats.facebookCount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="relative w-4 h-4">
                <Image
                  src="/facebook-icon.png"
                  alt="Facebook Reviews"
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </div>
              <span className="text-sm">{stats.facebookCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}