'use client';

import Image from 'next/image';
import { Review } from '@/lib/types';

interface ReviewListProps {
  reviews: Review[];
  showSource?: boolean;
}

export default function ReviewList({ reviews, showSource = true }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start gap-4">
            {review.avatar && (
              <div className="flex-shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            )}
            
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{review.author}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {showSource && (
                      <span className="text-sm text-gray-500">
                        via {review.source}
                      </span>
                    )}
                  </div>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </time>
              </div>
              
              <p className="mt-2 text-gray-600">{review.content}</p>
            </div>
          </div>
        </div>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No reviews found</p>
        </div>
      )}
    </div>
  );
}