import type { Context, Next } from 'hono';
import type { Env } from '../env';
import { createLogger, type Logger } from '../lib/logger';

export async function loggerMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const start = Date.now();
  const ip =
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-forwarded-for') ??
    'anonymous';

  const logger = createLogger(c.env, {
    route: c.req.path,
    method: c.req.method,
    ip,
  });

  c.set('logger' as never, logger);

  logger.info('request_start');

  await next();

  logger.info('request_end', {
    statusCode: c.res.status,
    durationMs: Date.now() - start,
  });
}

export function getLogger(c: Context): Logger {
  return c.get('logger' as never) as Logger;
}
