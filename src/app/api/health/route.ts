import { NextResponse } from 'next/server';
import { redisClient } from '@/lib/redis';

export async function GET() {
  try {
    // Check Redis connection
    const redisStatus = redisClient.isOpen ? 'connected' : 'disconnected';

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        redis: redisStatus,
        api: 'running'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
