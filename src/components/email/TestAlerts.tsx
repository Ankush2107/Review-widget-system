'use client';

import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  timestamp: string;
}

interface AlertThreshold {
  metricType: 'openRate' | 'clickRate' | 'bounceRate';
  threshold: number;
  condition: 'above' | 'below';
}

export default function TestAlerts({ testId }: { testId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [thresholds, setThresholds] = useState<AlertThreshold[]>([]);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`/api/email/tests/${testId}/alerts`);
    
    eventSource.onmessage = (event) => {
      const newAlert = JSON.parse(event.data);
      setAlerts(current => [newAlert, ...current].slice(0, 50));
    };

    return () => eventSource.close();
  }, [testId]);

  const addThreshold = (threshold: AlertThreshold) => {
    setThresholds([...thresholds, threshold]);
  };

  const removeThreshold = (index: number) => {
    setThresholds(thresholds.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Test Alerts</h3>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
        >
          Configure Alerts
        </button>
      </div>

      {showConfig && (
        <div className="mb-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Alert Configuration</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            addThreshold({
              metricType: formData.get('metricType') as any,
              threshold: Number(formData.get('threshold')),
              condition: formData.get('condition') as any
            });
          }}>
            <div className="grid grid-cols-3 gap-4">
              <select
                name="metricType"
                className="rounded-md border-gray-300"
                required
              >
                <option value="openRate">Open Rate</option>
                <option value="clickRate">Click Rate</option>
                <option value="bounceRate">Bounce Rate</option>
              </select>
              <select
                name="condition"
                className="rounded-md border-gray-300"
                required
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              <input
                type="number"
                name="threshold"
                placeholder="Threshold %"
                className="rounded-md border-gray-300"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Add Alert
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {thresholds.map((threshold, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span>
                  Alert when {threshold.metricType} is {threshold.condition} {threshold.threshold}%
                </span>
                <button
                  onClick={() => removeThreshold(index)}
                  className="text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg ${
              alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
              alert.type === 'error' ? 'bg-red-50 text-red-800' :
              alert.type === 'success' ? 'bg-green-50 text-green-800' :
              'bg-blue-50 text-blue-800'
            }`}
          >
            <div className="flex justify-between">
              <p>{alert.message}</p>
              <span className="text-sm opacity-75">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No alerts to display
          </div>
        )}
      </div>
    </div>
  );
}