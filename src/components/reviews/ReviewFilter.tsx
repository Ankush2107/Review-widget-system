'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';

interface ReviewFilterProps {
  reviews: Review[];
  onFilter: (filtered: Review[]) => void;
}

export default function ReviewFilter({ reviews, onFilter }: ReviewFilterProps) {
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<'all' | 'google' | 'facebook'>('all');
  const [rating, setRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  const applyFilters = () => {
    let filtered = [...reviews];

    if (search) {
      filtered = filtered.filter(review =>
        review.content.toLowerCase().includes(search.toLowerCase()) ||
        review.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (source !== 'all') {
      filtered = filtered.filter(review => review.source === source);
    }

    if (rating !== 'all') {
      filtered = filtered.filter(review => Math.round(review.rating) === rating);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.rating - a.rating;
    });

    onFilter(filtered);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              applyFilters();
            }}
            className="w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value as any);
              applyFilters();
            }}
            className="w-full rounded-md border-gray-300"
          >
            <option value="all">All Sources</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div>
          <select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value === 'all' ? 'all' : Number(e.target.value));
              applyFilters();
            }}
            className="w-full rounded-md border-gray-300"
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              applyFilters();
            }}
            className="w-full rounded-md border-gray-300"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
}