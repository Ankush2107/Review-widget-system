import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EmailTest } from '@/models/EmailTest';

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    await connectDB();
    
    const test = await EmailTest.findById(params.testId)
      .populate('templateA')
      .populate('templateB');

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Calculate metrics
    const calculateMetrics = (data: any) => ({
      openRate: (data.opened / data.sent) * 100,
      clickRate: (data.clicked / data.sent) * 100,
      conversionRate: (data.clicked / data.opened) * 100
    });

    // Calculate daily metrics
    const dailyMetrics = await getDailyMetrics(params.testId);

    const metrics = {
      id: test._id,
      name: test.name,
      metrics: {
        daily: dailyMetrics,
        overall: {
          templateA: {
            ...test.results.templateA,
            ...calculateMetrics(test.results.templateA)
          },
          templateB: {
            ...test.results.templateB,
            ...calculateMetrics(test.results.templateB)
          }
        }
      }
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

async function getDailyMetrics(testId: string) {
  const dailyStats = await EmailTest.aggregate([
    { $match: { _id: testId } },
    { $unwind: '$dailyStats' },
    {
      $group: {
        _id: '$dailyStats.date',
        templateA: {
          $first: '$dailyStats.templateA'
        },
        templateB: {
          $first: '$dailyStats.templateB'
        }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  return dailyStats.map((stat: any) => ({
    date: stat._id.toISOString().split('T')[0],
    templateA: {
      ...stat.templateA,
      openRate: (stat.templateA.opened / stat.templateA.sent) * 100,
      clickRate: (stat.templateA.clicked / stat.templateA.sent) * 100
    },
    templateB: {
      ...stat.templateB,
      openRate: (stat.templateB.opened / stat.templateB.sent) * 100,
      clickRate: (stat.templateB.clicked / stat.templateB.sent) * 100
    }
  }));
}