import { NextResponse } from 'next/server';
import { reviewFetcher } from '@/lib/reviewFetcher';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const widgetId = searchParams.get('widgetId');

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Poll for new reviews
  setInterval(async () => {
    try {
      const widget = await Widget.findById(widgetId);
      if (!widget) return;

      const reviews = await reviewFetcher.fetchAllReviews(
        widget.businessDetails.googlePlaceId,
        widget.businessDetails.facebookPageUrl
      );

      const data = encoder.encode(`data: ${JSON.stringify(reviews)}\n\n`);
      await writer.write(data);
    } catch (error) {
      console.error('Stream error:', error);
    }
  }, 30000); // Poll every 30 seconds

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}