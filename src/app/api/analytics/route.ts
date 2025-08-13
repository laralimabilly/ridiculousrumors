// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.action || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: action, category' },
        { status: 400 }
      );
    }

    // Log the analytics data (you can extend this to send to external services)
    console.log('Analytics Event:', {
      action: body.action,
      category: body.category,
      label: body.label,
      value: body.value,
      theory_id: body.theory_id,
      platform: body.platform,
      timestamp: body.timestamp,
      url: body.url,
      referrer: body.referrer,
      user_agent: body.user_agent,
      custom_parameters: body.custom_parameters,
    });

    // Here you could send the data to external analytics services:
    // - Google Analytics 4
    // - Mixpanel
    // - PostHog
    // - Your own analytics database
    
    // Example: Send to external service
    // await sendToAnalyticsService(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Analytics API is running',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  });
}

// Optional: Add other HTTP methods if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}