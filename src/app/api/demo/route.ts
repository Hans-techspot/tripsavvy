import { NextRequest, NextResponse } from 'next/server';
import { populateDemoData } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from the authenticated session
    // For demo purposes, we'll use a placeholder
    const userId = 'demo-user-123'; // This should come from auth context

    const tripIds = await populateDemoData(userId);

    return NextResponse.json({
      success: true,
      message: 'Demo data populated successfully',
      tripIds,
      count: tripIds.length
    });
  } catch (error) {
    console.error('Error populating demo data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to populate demo data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Demo data API endpoint. Use POST to populate demo data.',
    usage: 'POST /api/demo'
  });
}