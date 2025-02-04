import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Widget } from '@/models/Widget';

// GET all widgets
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    let query = Widget.find().sort({ createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const widgets = await query.exec();
    return NextResponse.json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widgets' },
      { status: 500 }
    );
  }
}

// CREATE new widget
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Get user ID from auth headers (set by middleware)
    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create widget
    const widget = new Widget({
      ...body,
      userId,
      active: true,
      reviewCount: 0,
      totalRating: 0
    });

    await widget.save();

    return NextResponse.json(widget, { status: 201 });
  } catch (error) {
    console.error('Error creating widget:', error);
    return NextResponse.json(
      { error: 'Failed to create widget' },
      { status: 500 }
    );
  }
}