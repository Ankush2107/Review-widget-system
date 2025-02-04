import { NextResponse } from 'next/server';
import { trackWidgetEvent } from '@/lib/analytics';

export async function POST(
  request: Request,
  { params }: { params: { widgetId: string } }
) {
  try {
    const { eventType, referrer } = await request.json();
    const analytics = await trackWidgetEvent(params.widgetId, eventType, referrer);
    
    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}