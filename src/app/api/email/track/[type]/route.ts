import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EmailTest } from '@/models/EmailTest';

export async function POST(
  request: Request,
  { params }: { params: { type: 'open' | 'click' } }
) {
  try {
    await connectDB();
    const { testId, templateVersion, emailId } = await request.json();

    const test = await EmailTest.findById(testId);
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Update metrics
    const templateKey = `results.template${templateVersion}`;
    const updateField = `${templateKey}.${params.type}ed`;
    
    await EmailTest.updateOne(
      { _id: testId },
      { 
        $inc: { [updateField]: 1 },
        $push: {
          dailyStats: {
            date: new Date(),
            [`template${templateVersion}`]: {
              [params.type]: 1
            }
          }
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking email event:', error);
    return NextResponse.json(
      { error: 'Failed to track email event' },
      { status: 500 }
    );
  }
}