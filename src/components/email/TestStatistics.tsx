'use client';

import { useEffect, useState } from 'react';
import { testAnalyzer } from '@/lib/statistics';

interface TestStats {
  winner: 'A' | 'B' | null;
  confidenceLevel: number;
  improvement: number;
  recommendedAction: string;
}

export default function TestStatistics({ testId }: { testId: string }) {
  const [stats, setStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, [testId]);

  const loadStatistics = async () => {
    try {
      const response = await fetch(`/api/email/tests/${testId}/results`);
      const data = await response.json();
      
      const analysis = testAnalyzer.determineWinner({
        templateA: data.templateA,
        templateB: data.templateB
      });

      setStats({
        ...analysis,
        recommendedAction: getRecommendation(analysis)
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendation = (analysis: { winner: string | null, confidenceLevel: number }) => {
    if (!analysis.winner) {
      return "Continue testing to reach statistical significance";
    }
    return `Switch to Template ${analysis.winner} for a ${analysis.confidenceLevel * 100}% confidence in improvement`;
  };

  if (loading || !stats) return <div>Loading statistics...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-6">Test Results Analysis</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500">Winner</p>
          {stats.winner ? (
            <p className="text-2xl font-semibold text-green-600">
              Template {stats.winner}
            </p>
          ) : (
            <p className="text-2xl font-semibold text-gray-600">
              No clear winner yet
            </p>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Confidence Level</p>
          <p className="text-2xl font-semibold">
            {(stats.confidenceLevel * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {stats.winner && (
        <div className="mb-6">
          <p className="text-sm text-gray-500">Improvement</p>
          <p className="text-2xl font-semibold text-blue-600">
            +{stats.improvement.toFixed(1)}%
          </p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium">Recommended Action</p>
        <p className="mt-1 text-gray-600">{stats.recommendedAction}</p>
      </div>
    </div>
  );
}