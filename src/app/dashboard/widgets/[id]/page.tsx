'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Widget, WidgetType, Review } from '@/lib/types';
import WidgetPreview from '@/components/widgets/WidgetPreview';

export default function EditWidgetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [previewReviews] = useState<Review[]>([
    {
      id: '1',
      source: 'google',
      rating: 5,
      content: 'Excellent service! Would highly recommend.',
      author: 'John Doe',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      source: 'facebook',
      rating: 4,
      content: 'Great experience overall. Very professional.',
      author: 'Jane Smith',
      date: new Date().toISOString(),
    }
  ]);

  useEffect(() => {
    loadWidget();
  }, [params.id]);

  const loadWidget = async () => {
    try {
      const response = await fetch(`/api/widgets/${params.id}`);
      if (!response.ok) {
        throw new Error('Widget not found');
      }
      const data = await response.json();
      setWidget(data);
    } catch (error) {
      console.error('Error loading widget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!widget) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/widgets/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(widget),
      });

      if (!response.ok) {
        throw new Error('Failed to update widget');
      }

      alert('Widget updated successfully!');
      router.push('/dashboard/widgets');
    } catch (error) {
      console.error('Error updating widget:', error);
      alert('Failed to update widget');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this widget?')) return;

    try {
      const response = await fetch(`/api/widgets/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete widget');
      }

      router.push('/dashboard/widgets');
    } catch (error) {
      console.error('Error deleting widget:', error);
      alert('Failed to delete widget');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!widget) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Widget not found</h3>
        <button
          onClick={() => router.push('/dashboard/widgets')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Return to Widgets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Widget</h1>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
        >
          Delete Widget
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Widget Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget Name
          </label>
          <input
            type="text"
            value={widget.name}
            onChange={(e) => setWidget({ ...widget, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Widget Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget Type
          </label>
          <select
            value={widget.settings.type}
            onChange={(e) => setWidget({
              ...widget,
              settings: { ...widget.settings, type: e.target.value as WidgetType }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="slider">Slider</option>
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="masonry">Masonry</option>
            <option value="badge">Badge</option>
          </select>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={widget.settings.showRating}
              onChange={(e) => setWidget({
                ...widget,
                settings: { ...widget.settings, showRating: e.target.checked }
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-700">Show Rating</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={widget.settings.showSource}
              onChange={(e) => setWidget({
                ...widget,
                settings: { ...widget.settings, showSource: e.target.checked }
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-700">Show Source</label>
          </div>
        </div>

        {/* Review Sources */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Review Sources
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={widget.sources.includes('google')}
                onChange={(e) => {
                  const sources = e.target.checked
                    ? [...widget.sources, 'google']
                    : widget.sources.filter(s => s !== 'google');
                  setWidget({ ...widget, sources });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">Google Reviews</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={widget.sources.includes('facebook')}
                onChange={(e) => {
                  const sources = e.target.checked
                    ? [...widget.sources, 'facebook']
                    : widget.sources.filter(s => s !== 'facebook');
                  setWidget({ ...widget, sources });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">Facebook Reviews</label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => router.push('/dashboard/widgets')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Widget Preview</h2>
        <div className="border rounded-lg p-4 bg-gray-50">
          <WidgetPreview
            widget={widget}
            reviews={previewReviews}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This is a preview with sample reviews. The actual widget will display real reviews from selected sources.
        </p>
      </div>
    </div>
  );
}