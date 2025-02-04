"use client";

import { useState } from "react";
import { WidgetType, WidgetSettings, Review } from "@/lib/types";
import { widgetApi } from "@/lib/api";
import WidgetPreview from "@/components/widgets/WidgetPreview";

export default function CreateWidgetPage() {
  const [name, setName] = useState("");
  const [settings, setSettings] = useState<WidgetSettings>({
    type: "slider",
    theme: "light",
    showRating: true,
    showSource: true,
    autoplay: true,
    interval: 5000,
    itemsPerPage: 1,
  });

  const [sources, setSources] = useState<("google" | "facebook")[]>(["google"]);

  const [previewReviews] = useState<Review[]>([
    {
      id: "1",
      source: "google",
      rating: 5,
      content: "Excellent service! Would highly recommend.",
      author: "John Doe",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      source: "facebook",
      rating: 4,
      content: "Great experience overall. Very professional.",
      author: "Jane Smith",
      date: new Date().toISOString(),
    },
  ]);

  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    googlePlaceId: "",
    facebookPageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add widget creation logic
    try {
      if (sources.length === 0) {
        alert("Please select at least one review source");
        return;
      }

      // Create widget data object
      const widgetData = {
        name,
        settings,
        sources,
        businessName: businessDetails.name,
        googlePlaceId: businessDetails.googlePlaceId,
        facebookPageUrl: businessDetails.facebookPageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Send to API
      const response = await widgetApi.create(widgetData);

      if (response.data) {
        // Show success message
        alert("Widget created successfully!");
        // Redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error creating widget:", error);
      alert("Failed to create widget. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Create New Widget
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget Type
          </label>
          <select
            value={settings.type}
            onChange={(e) =>
              setSettings({ ...settings, type: e.target.value as WidgetType })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="slider">Slider</option>
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="masonry">Masonry</option>
            <option value="badge">Badge</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) =>
              setSettings({
                ...settings,
                theme: e.target.value as "light" | "dark",
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showRating}
              onChange={(e) =>
                setSettings({ ...settings, showRating: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Show Rating</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showSource}
              onChange={(e) =>
                setSettings({ ...settings, showSource: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Show Source</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoplay}
              onChange={(e) =>
                setSettings({ ...settings, autoplay: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Autoplay</label>
          </div>
        </div>

        {settings.autoplay && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interval (ms)
            </label>
            <input
              type="number"
              value={settings.interval}
              onChange={(e) =>
                setSettings({ ...settings, interval: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1000"
              step="500"
            />
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">
            Business Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={businessDetails.name}
              onChange={(e) =>
                setBusinessDetails({
                  ...businessDetails,
                  name: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {sources.includes("google") && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Place ID
                <span className="ml-1 text-xs text-gray-500">
                  (e.g., ChIJxxxxxxxxxxxx)
                </span>
              </label>
              <input
                type="text"
                value={businessDetails.googlePlaceId}
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    googlePlaceId: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={sources.includes("google")}
                placeholder="Enter Google Place ID"
              />
            </div>
          )}

          {sources.includes("facebook") && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={businessDetails.facebookPageUrl}
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    facebookPageUrl: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://www.facebook.com/your-business"
                required={sources.includes("facebook")}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Review Sources
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={sources.includes("google")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSources([...sources, "google"]);
                  } else {
                    setSources(sources.filter((s) => s !== "google"));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Google Reviews
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={sources.includes("facebook")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSources([...sources, "facebook"]);
                  } else {
                    setSources(sources.filter((s) => s !== "facebook"));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Facebook Reviews
              </label>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard")}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Widget
            </button>
          </div>
        </div>
      </form>
      <div className="mt-8 border-t pt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Widget Preview
        </h2>
        <div className="border rounded-lg p-4 bg-gray-50">
          <WidgetPreview
            widget={{
              id: "preview",
              name,
              settings,
              sources,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }}
            reviews={previewReviews}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This is a preview with sample reviews. Actual widget will display real
          reviews from selected sources.
        </p>
      </div>
    </div>
  );
}
