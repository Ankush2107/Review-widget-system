import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Analytics } from '@/models/Analytics';
import { Widget } from '@/models/Widget';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const widgetId = searchParams.get('widget');
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    }[range] || 7;
    const startDate = new Date(now.setDate(now.getDate() - daysAgo));

    // Build query
    let query = widgetId !== 'all' ? { widgetId } : {};

    // Fetch analytics
    const analytics = await Analytics.find({
      ...query,
      'dailyStats.date': { $gte: startDate }
    }).populate('widgetId');

    // Format response
    const response = analytics.map(item => ({
      ...item.widgetId.toObject(),
      analytics: {
        views: item.views,
        impressions: item.impressions,
        domains: item.domains,
        dailyStats: item.dailyStats.filter(stat => 
          new Date(stat.date) >= startDate
        )
      }
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}