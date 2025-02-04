'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Widget } from '@/lib/types';

interface DashboardStats {
  totalWidgets: number;
  totalReviews: number;
  averageRating: number;
  activeWidgets: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalWidgets: 0,
    totalReviews: 0,
    averageRating: 0,
    activeWidgets: 0
  });
  const [recentWidgets, setRecentWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();

      // Fetch recent widgets
      const widgetsResponse = await fetch('/api/widgets?limit=5');
      const widgetsData = await widgetsResponse.json();

      setStats(statsData);
      setRecentWidgets(widgetsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <Link
          href="/dashboard/widgets/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Widget
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 bg-opacity-75">
              <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Widgets</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalWidgets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 bg-opacity-75">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Widgets</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeWidgets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 bg-opacity-75">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 bg-opacity-75">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Widgets */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Widgets</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentWidgets.map((widget) => (
            <div key={widget.id} className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{widget.name}</h3>
                <p className="text-sm text-gray-500">Type: {widget.settings.type}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href={`/dashboard/widgets/${widget.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {/* Handle get code */}}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Get Code
                </button>
              </div>
            </div>
          ))}
          {recentWidgets.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No widgets created yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}