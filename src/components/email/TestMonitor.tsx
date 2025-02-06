'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LiveMetrics {
  timestamp: string;
  templateA: {
    sends: number;
    opens: number;
    clicks: number;
  };
  templateB: {
    sends: number;
    opens: number;
    clicks: number;
  };
}

export default function TestMonitor({ testId }: { testId: string }) {
  const [liveData, setLiveData] = useState<LiveMetrics[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const eventSource = new EventSource(`/api/email/tests/${testId}/monitor`);
    
    eventSource.onmessage = (event) => {
      const newMetrics = JSON.parse(event.data);
      setLiveData(current => [...current, newMetrics].slice(-30)); // Keep last 30 data points
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsActive(false);
    };

    return () => {
      eventSource.close();
    };
  }, [testId, isActive]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Live Test Monitoring</h3>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-lg ${
            isActive 
              ? 'bg-red-100 text-red-600' 
              : 'bg-green-100 text-green-600'
          }`}
        >
          {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="h-[300px]">
          <h4 className="text-sm font-medium mb-4">Open Rates</h4>
          <ResponsiveContainer>
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Line 
                type="monotone" 
                dataKey="templateA.opens" 
                name="Template A" 
                stroke="#6366F1" 
              />
              <Line 
                type="monotone" 
                dataKey="templateB.opens" 
                name="Template B" 
                stroke="#818CF8" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px]">
          <h4 className="text-sm font-medium mb-4">Click Rates</h4>
          <ResponsiveContainer>
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Line 
                type="monotone" 
                dataKey="templateA.clicks" 
                name="Template A" 
                stroke="#6366F1" 
              />
              <Line 
                type="monotone" 
                dataKey="templateB.clicks" 
                name="Template B" 
                stroke="#818CF8" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Template A</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Sends</p>
              <p className="text-lg font-semibold">
                {liveData[liveData.length - 1]?.templateA.sends || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Opens</p>
              <p className="text-lg font-semibold">
                {liveData[liveData.length - 1]?.templateA.opens || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Clicks</p>
              <p className="text-lg font-semibold">
                {liveData[liveData.length - 1]?.templateA.clicks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Template B</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Sends</p>
              <p className="text-lg font-semibold">
                {liveData[liveData.length - 1]?.templateB.sends || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Opens</p>
              <p className="text-lg font-semibold">
                {liveData[liveData.length - 1]?.templateB.opens || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Clicks</p>
              <p className="text-lg font-semibold">
                {liveData[liveData.length - 1]?.templateB.clicks || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}