import { NextResponse } from 'next/server';

// Mock data for development - we'll replace this with Apify integration
const mockReviews = {
  google: [
    {
      id: 'g1',
      source: 'google',
      rating: 5,
      content: 'Excellent service, really impressed with the quality!',
      author: 'John Doe',
      date: new Date().toISOString(),
    },
    {
      id: 'g2',
      source: 'google',
      rating: 4,
      content: 'Great experience overall, would recommend.',
      author: 'Jane Smith',
      date: new Date().toISOString(),
    }
  ],
  facebook: [
    {
      id: 'f1',
      source: 'facebook',
      rating: 5,
      content: 'Amazing customer service and great products!',
      author: 'Mike Johnson',
      date: new Date().toISOString(),
    },
    {
      id: 'f2',
      source: 'facebook',
      rating: 4,
      content: 'Very satisfied with my purchase.',
      author: 'Sarah Williams',
      date: new Date().toISOString(),
    }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');

  try {
    if (source === 'google') {
      return NextResponse.json(mockReviews.google);
    } else if (source === 'facebook') {
      return NextResponse.json(mockReviews.facebook);
    } else {
      // Return all reviews
      return NextResponse.json([...mockReviews.google, ...mockReviews.facebook]);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}