import * as Sentry from '@sentry/cloudflare';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { Context, Next } from 'hono';
import type { Env } from '../env';

export async function rateLimitMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  if (c.env.ENVIRONMENT === 'development') {
    await next();
    return;
  }

  const redis = new Redis({
    url: c.env.UPSTASH_REDIS_REST_URL,
    token: c.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1m'),
  });

  const ip =
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-forwarded-for') ??
    'anonymous';

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    Sentry.addBreadcrumb({
      category: 'rate_limit',
      message: `Rate limit hit`,
      level: 'warning',
      data: {
        ip,
        route: c.req.path,
        limit,
        reset: new Date(reset).toISOString(),
      },
    });

    return c.json(
      {
        success: false,
        timestamp: Date.now(),
        message: 'Too many requests. Please wait a few minutes and try again.',
      },
      429
    );
  }

  c.header('X-RateLimit-Limit', String(limit));
  c.header('X-RateLimit-Remaining', String(remaining));
  c.header('X-RateLimit-Reset', String(reset));

  await next();
}
