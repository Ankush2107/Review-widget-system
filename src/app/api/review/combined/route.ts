import { NextResponse } from 'next/server';
import { fetchAllReviews } from '@/lib/apify';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const placeId = searchParams.get('placeId');
        const pageUrl = searchParams.get('pageUrl');

        if (!placeId || !pageUrl) {
            return NextResponse.json(
                { error: 'Both Place ID and Page URL are required' },
                { status: 400 }
            );
        }

        const reviews = await fetchAllReviews(placeId, pageUrl);
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching combined reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}