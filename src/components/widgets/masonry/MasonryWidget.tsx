'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Review, WidgetSettings } from '@/lib/types';

interface MasonryWidgetProps {
  reviews: Review[];
  settings: WidgetSettings;
}

export default function MasonryWidget({ reviews, settings }: MasonryWidgetProps) {
  const [columns, setColumns] = useState<Review[][]>([[], [], []]);
  const columnCount = settings.itemsPerPage || 3;

  useEffect(() => {
    // Distribute reviews across columns
    const newColumns: Review[][] = Array.from({ length: columnCount }, () => []);
    
    reviews.forEach((review, index) => {
      const columnIndex = index % columnCount;
      newColumns[columnIndex].push(review);
    });

    setColumns(newColumns);
  }, [reviews, columnCount]);

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 text-gray-500">
        No reviews to display
      </div>
    );
  }

  return (
    <div className={`w-full p-4 ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((review) => (
              <div 
                key={review.id}
                className={`p-4 rounded-lg break-inside-avoid transition-shadow hover:shadow-lg ${
                  settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                {/* Review Header */}
                <div className="flex items-center mb-4">
                  {settings.showSource && (
                    <div className="flex-shrink-0 relative w-6 h-6 mr-3">
                      <Image
                        src={review.source === 'google' ? '/google-icon.png' : '/facebook-icon.png'}
                        alt={review.source}
                        fill
                        sizes="24px"
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{review.author}</p>
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
                  </div>
                </div>

                {/* Review Content */}
                <blockquote className={`mb-4 text-sm leading-relaxed ${
                  settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {review.content}
                </blockquote>

                {/* Review Footer */}
                <p className={`text-xs ${
                  settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}