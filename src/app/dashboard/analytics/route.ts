import { NextResponse } from 'next/server';
import { getWidgetAnalytics } from '@/lib/analytics';

export async function GET() {
  try {
    // In production, fetch from database
    const analytics = {};
    // Mock data for development
    analytics['widget1'] = getWidgetAnalytics('widget1');
    
    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}