import { Redis } from '@upstash/redis';
import { Hono } from 'hono';
import type { Env } from '../env';

const route = new Hono<{ Bindings: Env }>();

route.get('/', async (c) => {
  const cronToken = c.req.header('X-CRON-TOKEN');

  if (!cronToken || cronToken !== c.env.CRON_TOKEN) {
    return c.text('Unauthorized', 401);
  }

  const redis = new Redis({
    url: c.env.UPSTASH_REDIS_REST_URL,
    token: c.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const response = await redis.ping();

  if (response !== 'PONG') {
    return c.text('Error', 500);
  }

  return c.text('OK', 200);
});

export default route;
