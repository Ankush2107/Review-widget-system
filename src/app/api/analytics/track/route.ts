import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Analytics } from '@/models/Analytics';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { widgetId, type, domain } = await request.json();

    // Get or create analytics record
    let analytics = await Analytics.findOne({ widgetId });
    if (!analytics) {
      analytics = new Analytics({
        widgetId,
        views: 0,
        impressions: 0,
        domains: [],
        dailyStats: []
      });
    }

    // Update counts
    if (type === 'view') {
      analytics.views += 1;
    } else if (type === 'impression') {
      analytics.impressions += 1;
    }

    // Update domain stats
    const domainRecord = analytics.domains.find(d => d.domain === domain);
    if (domainRecord) {
      domainRecord.views += 1;
      domainRecord.lastAccessed = new Date();
    } else {
      analytics.domains.push({
        domain,
        views: 1,
        lastAccessed: new Date()
      });
    }

    // Update daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyStat = analytics.dailyStats.find(
      stat => new Date(stat.date).getTime() === today.getTime()
    );

    if (dailyStat) {
      if (type === 'view') dailyStat.views += 1;
      if (type === 'impression') dailyStat.impressions += 1;
    } else {
      analytics.dailyStats.push({
        date: today,
        views: type === 'view' ? 1 : 0,
        impressions: type === 'impression' ? 1 : 0
      });
    }

    analytics.lastUpdated = new Date();
    await analytics.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}