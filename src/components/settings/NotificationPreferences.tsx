'use client';

interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  minRating: number;
  sources: {
    google: boolean;
    facebook: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    browser: true,
    minRating: 1,
    sources: { google: true, facebook: true },
    frequency: 'instant'
  });

  const handleSave = async () => {
    await fetch('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="font-medium">Email Notifications</label>
          <input
            type="checkbox"
            checked={preferences.email}
            onChange={e => setPreferences({...preferences, email: e.target.checked})}
            className="toggle"
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Minimum Rating</label>
          <select 
            value={preferences.minRating}
            onChange={e => setPreferences({...preferences, minRating: Number(e.target.value)})}
            className="w-full rounded-md"
          >
            {[1,2,3,4,5].map(rating => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Sources</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.sources.google}
                onChange={e => setPreferences({
                  ...preferences,
                  sources: {...preferences.sources, google: e.target.checked}
                })}
              />
              <span className="ml-2">Google Reviews</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.sources.facebook}
                onChange={e => setPreferences({
                  ...preferences,
                  sources: {...preferences.sources, facebook: e.target.checked}
                })}
              />
              <span className="ml-2">Facebook Reviews</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Frequency</label>
          <select
            value={preferences.frequency}
            onChange={e => setPreferences({...preferences, frequency: e.target.value as any})}
            className="w-full rounded-md"
          >
            <option value="instant">Instant</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}