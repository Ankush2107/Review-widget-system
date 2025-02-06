'use client';

import { Review } from '@/lib/types';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ReviewStatsProps {
  reviews: Review[];
}

export default function ReviewStats({ reviews }: ReviewStatsProps) {
  const stats = {
    total: reviews.length,
    avgRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    bySource: {
      google: reviews.filter(r => r.source === 'google').length,
      facebook: reviews.filter(r => r.source === 'facebook').length
    },
    ratingDistribution: Array.from({ length: 5 }, (_, i) => ({
      rating: i + 1,
      count: reviews.filter(r => Math.round(r.rating) === i + 1).length
    })),
    byMonth: Object.entries(
      reviews.reduce((acc, review) => {
        const month = new Date(review.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([month, count]) => ({ month, count }))
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">Rating Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={stats.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">Reviews Over Time</h3>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <LineChart data={stats.byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366F1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-2xl font-semibold">{stats.avgRating.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Google Reviews</p>
            <p className="text-2xl font-semibold">{stats.bySource.google}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Facebook Reviews</p>
            <p className="text-2xl font-semibold">{stats.bySource.facebook}</p>
          </div>
        </div>
      </div>
    </div>
  );
}