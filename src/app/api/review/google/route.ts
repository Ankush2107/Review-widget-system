import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/apify';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const placeId = searchParams.get('placeId');

        if (!placeId) {
            return NextResponse.json(
                { error: 'Place ID is required' },
                { status: 400 }
            );
        }

        const reviews = await fetchGoogleReviews(placeId);
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Google reviews' },
            { status: 500 }
        );
    }
}