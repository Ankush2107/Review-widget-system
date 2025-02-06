'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Review } from '@/lib/types';

interface ReviewAnalyticsProps {
  reviews: Review[];
  period: 'day' | 'week' | 'month';
}

export default function ReviewAnalytics({ reviews, period }: ReviewAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'rating' | 'sentiment'>('rating');

  const aggregateData = () => {
    const data = new Map();
    reviews.forEach(review => {
      const date = new Date(review.date);
      const key = date.toLocaleDateString();
      const existing = data.get(key) || { 
        date: key,
        avgRating: 0,
        count: 0,
        sentiment: 0
      };
      
      existing.avgRating = (existing.avgRating * existing.count + review.rating) / (existing.count + 1);
      existing.count++;
      data.set(key, existing);
    });
    
    return Array.from(data.values());
  };

  const chartData = aggregateData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as any)}
          className="rounded-md border-gray-300"
        >
          <option value="rating">Average Rating</option>
          <option value="sentiment">Sentiment Score</option>
        </select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedMetric === 'rating' ? 'avgRating' : 'sentiment'}
              stroke="#6366F1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Source Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Review Sources</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { source: 'Google', count: reviews.filter(r => r.source === 'google').length },
                { source: 'Facebook', count: reviews.filter(r => r.source === 'facebook').length }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Rating Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[1,2,3,4,5].map(rating => ({
                rating,
                count: reviews.filter(r => Math.round(r.rating) === rating).length
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p className="text-2xl font-semibold">{reviews.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}