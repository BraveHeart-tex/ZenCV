import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  if (
    !request.headers.get('X-CRON-TOKEN') ||
    request.headers.get('X-CRON-TOKEN') !== process.env.CRON_TOKEN
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const redis = Redis.fromEnv();

  try {
    const response = await redis.ping();

    if (response !== 'PONG') {
      return new Response('Error', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
