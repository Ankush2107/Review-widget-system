import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Widget } from '@/models/Widget';
import { sendReviewNotification } from '@/lib/email';
import { reviewFetcher } from '@/lib/reviewFetcher';
export async function GET(
  request: Request,
  { params }: { params: { widgetId: string } }
) {
  try {
    await connectDB();
    const widget = await Widget.findById(params.widgetId).populate('userId');
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    const lastCheck = widget.lastNotificationCheck || new Date(0);
    const reviews = await reviewFetcher.fetchAllReviews(
      widget.businessDetails.googlePlaceId,
      widget.businessDetails.facebookPageUrl
    );

    const newReviews = reviews.filter(
      review => new Date(review.date) > lastCheck
    );

    await Widget.findByIdAndUpdate(params.widgetId, {
      lastNotificationCheck: new Date()
    });
    for (const review of newReviews) {
        await sendReviewNotification(review, widget.userId);
    }

    return NextResponse.json(newReviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}