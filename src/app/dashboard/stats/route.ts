import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Widget } from '@/models/Widget'; // We'll need to create this model

export async function GET() {
  try {
    await connectDB();

    // Get stats from database
    const totalWidgets = await Widget.countDocuments();
    const activeWidgets = await Widget.countDocuments({ active: true });
    
    // Calculate review stats (this will depend on your review model structure)
    const reviews = await Widget.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: "$reviewCount" },
          totalRating: { $sum: "$totalRating" }
        }
      }
    ]);

    const stats = {
      totalWidgets,
      activeWidgets,
      totalReviews: reviews[0]?.totalReviews || 0,
      averageRating: reviews[0] ? reviews[0].totalRating / reviews[0].totalReviews : 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}