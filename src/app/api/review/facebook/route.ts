import { NextResponse } from 'next/server';
import { fetchFacebookReviews } from '@/lib/apify';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pageUrl = searchParams.get('pageUrl');

        if (!pageUrl) {
            return NextResponse.json(
                { error: 'Facebook Page URL is required' },
                { status: 400 }
            );
        }

        const reviews = await fetchFacebookReviews(pageUrl);
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching Facebook reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Facebook reviews' },
            { status: 500 }
        );
    }
}