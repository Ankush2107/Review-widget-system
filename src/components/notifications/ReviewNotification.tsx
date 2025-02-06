'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';

interface NotificationProps {
  widgetId: string;
}

export default function ReviewNotification({ widgetId }: NotificationProps) {
  const [notifications, setNotifications] = useState<Review[]>([]);

  useEffect(() => {
    const checkNewReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${widgetId}/notifications`);
        const newReviews = await response.json();
        if (newReviews.length > 0) {
          setNotifications(prev => [...newReviews, ...prev]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const interval = setInterval(checkNewReviews, 60000);
    return () => clearInterval(interval);
  }, [widgetId]);

  const dismissNotification = (reviewId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== reviewId));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(review => (
        <div
          key={review.id}
          className="bg-white rounded-lg shadow-lg p-4 max-w-sm animate-slide-in"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{review.author}</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => dismissNotification(review.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">{review.content}</p>
        </div>
      ))}
    </div>
  );
}