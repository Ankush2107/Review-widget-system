'use client';

import Image from 'next/image';
import { Review, WidgetSettings } from '@/lib/types';

interface ListWidgetProps {
  reviews: Review[];
  settings: WidgetSettings;
}

export default function ListWidget({ reviews, settings }: ListWidgetProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 text-gray-500">
        No reviews to display
      </div>
    );
  }

  return (
    <div className={`w-full ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <div 
            key={review.id}
            className={`p-6 transition-colors ${
              settings.theme === 'dark'
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start">
              {/* Review Source Icon */}
              {settings.showSource && (
                <div className="flex-shrink-0 relative w-6 h-6 mr-4">
                  <Image
                    src={review.source === 'google' ? '/google-icon.png' : '/facebook-icon.png'}
                    alt={review.source}
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
              )}

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{review.author}</h3>
                  <span className={`text-xs ${
                    settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>

                {settings.showRating && (
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < review.rating
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
                )}

                <p className={`mt-3 text-sm leading-relaxed ${
                  settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {review.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}