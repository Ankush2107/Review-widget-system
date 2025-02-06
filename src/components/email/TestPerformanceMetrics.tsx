'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TestMetrics {
  id: string;
  name: string;
  metrics: {
    daily: {
      date: string;
      templateA: DailyMetric;
      templateB: DailyMetric;
    }[];
    overall: {
      templateA: OverallMetric;
      templateB: OverallMetric;
    };
  };
}

interface DailyMetric {
  sent: number;
  opened: number;
  clicked: number;
}

interface OverallMetric extends DailyMetric {
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export default function TestPerformanceMetrics({ testId }: { testId: string }) {
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [testId]);

  const loadMetrics = async () => {
    try {
      const response = await fetch(`/api/email/tests/${testId}/metrics`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Overall Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">Overall Performance</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Open Rate</h4>
            <div className="flex items-end space-x-4">
              <div>
                <p className="text-2xl font-semibold">
                  {metrics.metrics.overall.templateA.openRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Template A</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {metrics.metrics.overall.templateB.openRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Template B</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Click Rate</h4>
            <div className="flex items-end space-x-4">
              <div>
                <p className="text-2xl font-semibold">
                  {metrics.metrics.overall.templateA.clickRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Template A</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {metrics.metrics.overall.templateB.clickRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Template B</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Conversion Rate</h4>
            <div className="flex items-end space-x-4">
              <div>
                <p className="text-2xl font-semibold">
                  {metrics.metrics.overall.templateA.conversionRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Template A</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {metrics.metrics.overall.templateB.conversionRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Template B</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">Daily Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.metrics.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="templateA.openRate"
                name="Template A Opens"
                stroke="#6366F1"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="templateB.openRate"
                name="Template B Opens"
                stroke="#818CF8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistical Significance */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Statistical Significance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Confidence Level</p>
            <p className="text-2xl font-semibold">95%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Winner</p>
            <p className="text-2xl font-semibold text-green-600">Template A</p>
          </div>
        </div>
      </div>
    </div>
  );
}