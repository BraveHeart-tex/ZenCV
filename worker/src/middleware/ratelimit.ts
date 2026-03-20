import * as Sentry from '@sentry/cloudflare';
import type { Context, Next } from 'hono';
import type { Env } from '../env';

export async function rateLimitMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const ip =
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-forwarded-for') ??
    'anonymous';

  const { success } = await c.env.RATE_LIMITER.limit({ key: ip });

  if (!success) {
    Sentry.addBreadcrumb({
      category: 'rate_limit',
      message: 'Rate limit hit',
      level: 'warning',
      data: { ip, route: c.req.path },
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

  await next();
}
