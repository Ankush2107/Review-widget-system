'use client';

import { useState } from 'react';
import { WidgetCustomization } from '@/lib/types';

interface CustomizationPanelProps {
  value: WidgetCustomization;
  onChange: (customization: WidgetCustomization) => void;
}

export default function CustomizationPanel({ value, onChange }: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout'>('colors');

  const updateColors = (key: keyof WidgetCustomization['colors'], color: string) => {
    onChange({
      ...value,
      colors: {
        ...value.colors,
        [key]: color
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'colors' ? 'bg-indigo-600 text-white' : 'text-gray-600'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'typography' ? 'bg-indigo-600 text-white' : 'text-gray-600'
          }`}
        >
          Typography
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'layout' ? 'bg-indigo-600 text-white' : 'text-gray-600'
          }`}
        >
          Layout
        </button>
      </div>

      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Color</label>
            <input
              type="color"
              value={value.colors.primary}
              onChange={(e) => updateColors('primary', e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <input
              type="color"
              value={value.colors.background}
              onChange={(e) => updateColors('background', e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Text Color</label>
            <input
              type="color"
              value={value.colors.text}
              onChange={(e) => updateColors('text', e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
        </div>
      )}

      {activeTab === 'typography' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Family</label>
            <select
              value={value.font}
              onChange={(e) => onChange({ ...value, font: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="system">System Default</option>
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="poppins">Poppins</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Border Radius</label>
            <select
              value={value.borderRadius}
              onChange={(e) => onChange({ ...value, borderRadius: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="full">Full</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shadow</label>
            <select
              value={value.shadow}
              onChange={(e) => onChange({ ...value, shadow: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Spacing</label>
            <select
              value={value.spacing}
              onChange={(e) => onChange({ ...value, spacing: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}