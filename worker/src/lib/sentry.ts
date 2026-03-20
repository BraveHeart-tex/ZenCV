// worker/src/lib/sentry.ts
import * as Sentry from '@sentry/cloudflare';
import type { Context } from 'hono';
import type { Env } from '../env';

export async function captureError(
  err: unknown,
  c: Context<{ Bindings: Env }>,
  context?: Record<string, unknown>
) {
  Sentry.withScope((scope) => {
    scope.setTag('route', c.req.path);
    scope.setTag('method', c.req.method);
    scope.setExtra('url', c.req.url);
    scope.setExtra(
      'cf_connecting_ip',
      c.req.header('cf-connecting-ip') ?? 'unknown'
    );
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureException(err);
  });

  // flush ensures events are sent before the worker response closes
  await Sentry.flush(2000);
}
