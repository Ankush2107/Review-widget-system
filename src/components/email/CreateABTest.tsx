'use client';

import { useState, useEffect } from 'react';
import { EmailTemplate } from '@/lib/types';

interface CreateABTestProps {
  onComplete: () => void;
}

export default function CreateABTest({ onComplete }: CreateABTestProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    templateA: '',
    templateB: '',
    startDate: '',
    endDate: '',
    splitPercentage: 50
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const response = await fetch('/api/email/templates');
    const data = await response.json();
    setTemplates(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/email/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create test');
      onComplete();
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Test Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Template A</label>
          <select
            value={formData.templateA}
            onChange={(e) => setFormData({ ...formData, templateA: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
            required
          >
            <option value="">Select template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Template B</label>
          <select
            value={formData.templateB}
            onChange={(e) => setFormData({ ...formData, templateB: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
            required
          >
            <option value="">Select template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Split Percentage (Template A)
        </label>
        <input
          type="range"
          min="10"
          max="90"
          value={formData.splitPercentage}
          onChange={(e) => setFormData({ ...formData, splitPercentage: parseInt(e.target.value) })}
          className="mt-1 block w-full"
        />
        <div className="mt-1 text-sm text-gray-500 flex justify-between">
          <span>{formData.splitPercentage}%</span>
          <span>{100 - formData.splitPercentage}%</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Create Test
        </button>
      </div>
    </form>
  );
}