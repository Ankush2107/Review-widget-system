'use client';

import { useEffect, useState } from 'react';
import { Widget } from '@/lib/types';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar
  } from 'recharts';

interface AnalyticsData {
  views: number;
  impressions: number;
  domains: {
    domain: string;
    views: number;
    lastAccessed: string;
  }[];
  dailyStats: {
    date: string;
    views: number;
    impressions: number;
  }[];
}

interface WidgetAnalytics extends Widget {
  analytics: AnalyticsData;
}

export default function AnalyticsPage() {
  const [widgets, setWidgets] = useState<WidgetAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadAnalytics();
  }, [selectedWidget, dateRange]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?widget=${selectedWidget}&range=${dateRange}`);
      const data = await response.json();
      setWidgets(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
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

  const prepareChartData = () => {
    if (selectedWidget === 'all') {
      return widgets.flatMap(w => w.analytics.dailyStats).reduce((acc, stat) => {
        const date = new Date(stat.date).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.views += stat.views;
          existing.impressions += stat.impressions;
        } else {
          acc.push({
            date,
            views: stat.views,
            impressions: stat.impressions
          });
        }
        return acc;
      }, [] as any[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    const widget = widgets.find(w => w.id === selectedWidget);
    return widget ? widget.analytics.dailyStats.map(stat => ({
      date: new Date(stat.date).toLocaleDateString(),
      views: stat.views,
      impressions: stat.impressions
    })) : [];
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedWidget}
            onChange={(e) => setSelectedWidget(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Widgets</option>
            {widgets.map(widget => (
              <option key={widget.id} value={widget.id}>{widget.name}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {widgets.reduce((sum, w) => sum + w.analytics.views, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Impressions</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {widgets.reduce((sum, w) => sum + w.analytics.impressions, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Domains</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {new Set(widgets.flatMap(w => w.analytics.domains.map(d => d.domain))).size}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Views & Impressions Over Time</h2>
        </div>
        <div className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domains Chart */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Domains</h2>
        </div>
        <div className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={widgets
                  .flatMap(w => w.analytics.domains)
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 10)
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Domains</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Accessed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {widgets.flatMap(w => w.analytics.domains)
                .sort((a, b) => b.views - a.views)
                .slice(0, 10)
                .map((domain, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain.domain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {domain.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(domain.lastAccessed).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}