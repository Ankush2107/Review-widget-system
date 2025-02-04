import { NextResponse } from 'next/server';
import { fetchGoogleReviews, fetchFacebookReviews } from '@/lib/apify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get widget data (replace with database query in production)
    const widget = widgets.find(w => w.id === params.id);
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    // Fetch reviews based on widget sources
    const reviews = [];
    
    if (widget.sources.includes('google') && widget.googlePlaceId) {
      const googleReviews = await fetchGoogleReviews(widget.googlePlaceId);
      reviews.push(...googleReviews);
    }

    if (widget.sources.includes('facebook') && widget.facebookPageUrl) {
      const facebookReviews = await fetchFacebookReviews(widget.facebookPageUrl);
      reviews.push(...facebookReviews);
    }

    // Sort reviews by date
    const sortedReviews = reviews.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      widget,
      reviews: sortedReviews
    });
  } catch (error) {
    console.error('Error fetching widget data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget data' },
      { status: 500 }
    );
  }
}