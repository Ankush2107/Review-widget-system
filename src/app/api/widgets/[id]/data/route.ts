import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Widget } from '@/models/Widget';
import { fetchGoogleReviews, fetchFacebookReviews } from '@/lib/apify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const widget = await Widget.findById(params.id);
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    // Fetch reviews from configured sources
    const reviews = [];
    
    if (widget.sources.includes('google') && widget.businessDetails.googlePlaceId) {
      const googleReviews = await fetchGoogleReviews(widget.businessDetails.googlePlaceId);
      reviews.push(...googleReviews);
    }

    if (widget.sources.includes('facebook') && widget.businessDetails.facebookPageUrl) {
      const facebookReviews = await fetchFacebookReviews(widget.businessDetails.facebookPageUrl);
      reviews.push(...facebookReviews);
    }

    // Sort reviews by date
    reviews.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      widget,
      reviews
    });
  } catch (error) {
    console.error('Error fetching widget data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget data' },
      { status: 500 }
    );
  }
}