import * as Sentry from '@sentry/cloudflare';
import { Redis } from '@upstash/redis';
import { Hono } from 'hono';
import type { Env } from '../env';
import { captureError } from '../lib/sentry';

const route = new Hono<{ Bindings: Env }>();

route.get('/', async (c) => {
  try {
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
      Sentry.captureMessage(
        'Redis health check failed — unexpected PING response',
        {
          level: 'error',
          extra: { response },
        }
      );
      return c.text('Error', 500);
    }

    Sentry.addBreadcrumb({
      category: 'health_check',
      message: 'Redis ping successful',
      level: 'info',
    });

    return c.text('OK', 200);
  } catch (error) {
    captureError(error, c, { handler: 'health-check' });
    return c.text('Error', 500);
  }
});

export default route;
