'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmailStats {
  sent: number;
  opened: number;
  openRate: number;
  byDay: { date: string; sent: number; opened: number }[];
  byHour: { hour: number; opened: number }[];
}

export default function EmailAnalytics() {
  const [stats, setStats] = useState<EmailStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response = await fetch('/api/analytics/email');
    const data = await response.json();
    setStats(data);
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Email Performance</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Sent</p>
            <p className="text-2xl font-semibold">{stats.sent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Opened</p>
            <p className="text-2xl font-semibold">{stats.opened}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Open Rate</p>
            <p className="text-2xl font-semibold">{stats.openRate}%</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={stats.byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="opened" stroke="#6366F1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Opens by Hour</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={stats.byHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="opened" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}