// src/components/email/ABTestingManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ABTest {
  id: string;
  name: string;
  templateA: any;
  templateB: any;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
  results: {
    templateA: TestResults;
    templateB: TestResults;
  };
}

interface TestResults {
  sent: number;
  opened: number;
  clicked: number;
}

export default function ABTestingManager() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const response = await fetch('/api/email/tests');
      const data = await response.json();
      setTests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tests:', error);
    }
  };

  const startTest = async (testId: string) => {
    await fetch(`/api/email/tests/${testId}/start`, { method: 'POST' });
    loadTests();
  };

  const stopTest = async (testId: string) => {
    await fetch(`/api/email/tests/${testId}/stop`, { method: 'POST' });
    loadTests();
  };

  const renderTestResults = (test: ABTest) => {
    const data = [
      {
        name: 'Open Rate',
        A: (test.results.templateA.opened / test.results.templateA.sent) * 100 || 0,
        B: (test.results.templateB.opened / test.results.templateB.sent) * 100 || 0,
      },
      {
        name: 'Click Rate',
        A: (test.results.templateA.clicked / test.results.templateA.sent) * 100 || 0,
        B: (test.results.templateB.clicked / test.results.templateB.sent) * 100 || 0,
      },
    ];

    return (
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="A" fill="#6366F1" name="Template A" />
            <Bar dataKey="B" fill="#818CF8" name="Template B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">A/B Tests</h2>
        <button
          onClick={() => setSelectedTest(null)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          New Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(test => (
          <div key={test.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{test.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(test.startDate).toLocaleDateString()} - 
                  {new Date(test.endDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                test.status === 'active' ? 'bg-green-100 text-green-800' :
                test.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {test.status}
              </span>
            </div>

            {renderTestResults(test)}

            <div className="mt-4 flex justify-end space-x-2">
              {test.status === 'draft' && (
                <button
                  onClick={() => startTest(test.id)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                >
                  Start Test
                </button>
              )}
              {test.status === 'active' && (
                <button
                  onClick={() => stopTest(test.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md"
                >
                  Stop Test
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}