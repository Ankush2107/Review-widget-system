'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Review, WidgetSettings } from '@/lib/types';

interface SliderWidgetProps {
  reviews: Review[];
  settings: WidgetSettings;
}

export default function SliderWidget({ reviews, settings }: SliderWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (settings.autoplay && reviews.length > 1) {
      const interval = setInterval(() => {
        handleNextSlide();
      }, settings.interval || 5000);

      return () => clearInterval(interval);
    }
  }, [settings.autoplay, settings.interval, reviews.length]);

  const handleNextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const handlePrevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 text-gray-500">
        No reviews to display
      </div>
    );
  }

  return (
    <div className={`w-full ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative overflow-hidden">
        <div
          className={`transition-transform duration-500 ease-in-out ${
            isTransitioning ? 'opacity-50' : 'opacity-100'
          }`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {/* Current Review */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              {settings.showSource && (
                <div className="flex-shrink-0 relative w-6 h-6 mr-3">
                  <Image
                    src={reviews[currentIndex].source === 'google' ? '/google-icon.png' : '/facebook-icon.png'}
                    alt={reviews[currentIndex].source}
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{reviews[currentIndex].author}</p>
                {settings.showRating && (
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < reviews[currentIndex].rating
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

            <blockquote className="mb-4 text-base leading-relaxed">
              {reviews[currentIndex].content}
            </blockquote>

            <p className="text-sm text-gray-500">
              {new Date(reviews[currentIndex].date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {reviews.length > 1 && (
        <div className="flex justify-center space-x-2 p-4">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index
                  ? 'bg-indigo-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}