import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Widget } from '@/models/Widget';

// GET single widget
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

    return NextResponse.json(widget);
  } catch (error) {
    console.error('Error fetching widget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget' },
      { status: 500 }
    );
  }
}

// UPDATE widget
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const userId = request.headers.get('user-id');

    const widget = await Widget.findOne({ _id: params.id, userId });
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    Object.assign(widget, body);
    await widget.save();

    return NextResponse.json(widget);
  } catch (error) {
    console.error('Error updating widget:', error);
    return NextResponse.json(
      { error: 'Failed to update widget' },
      { status: 500 }
    );
  }
}

// DELETE widget
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const userId = request.headers.get('user-id');
    
    const widget = await Widget.findOneAndDelete({ _id: params.id, userId });
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting widget:', error);
    return NextResponse.json(
      { error: 'Failed to delete widget' },
      { status: 500 }
    );
  }
}