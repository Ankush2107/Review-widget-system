export interface WidgetAnalytics {
    widgetId: string;
    views: number;
    loads: number;
    errors: number;
    lastAccessed: string;
    referrers: { [domain: string]: number };
  }
  
  // In-memory storage for development (replace with database in production)
  const analyticsStore = new Map<string, WidgetAnalytics>();
  
  export const trackWidgetEvent = async (widgetId: string, eventType: 'view' | 'load' | 'error', referrer?: string) => {
    let analytics = analyticsStore.get(widgetId) || {
      widgetId,
      views: 0,
      loads: 0,
      errors: 0,
      lastAccessed: new Date().toISOString(),
      referrers: {}
    };
  
    // Update analytics based on event type
    switch (eventType) {
      case 'view':
        analytics.views++;
        break;
      case 'load':
        analytics.loads++;
        break;
      case 'error':
        analytics.errors++;
        break;
    }
  
    // Track referrer
    if (referrer) {
      const domain = new URL(referrer).hostname;
      analytics.referrers[domain] = (analytics.referrers[domain] || 0) + 1;
    }
  
    analytics.lastAccessed = new Date().toISOString();
    analyticsStore.set(widgetId, analytics);
  
    return analytics;
  };
  
  export const getWidgetAnalytics = (widgetId: string): WidgetAnalytics | null => {
    return analyticsStore.get(widgetId) || null;
  };