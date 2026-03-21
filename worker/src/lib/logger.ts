/** biome-ignore-all lint/suspicious/noConsole: the whole point of this is to log to console */
import type { Env } from '../env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  handler?: string;
  route?: string;
  method?: string;
  ip?: string;
  durationMs?: number;
  statusCode?: number;
  userId?: string;
  step?: string;
  [key: string]: unknown;
}

export function createLogger(env: Env, baseContext?: LogContext) {
  const log = (level: LogLevel, message: string, context?: LogContext) => {
    const entry = {
      level,
      message,
      environment: env.ENVIRONMENT,
      timestamp: new Date().toISOString(),
      ...baseContext,
      ...context,
    };

    if (level === 'error') {
      console.error(entry);
    } else if (level === 'warn') {
      console.warn(entry);
    } else {
      console.log(entry);
    }
  };

  return {
    debug: (message: string, context?: LogContext) =>
      log('debug', message, context),
    info: (message: string, context?: LogContext) =>
      log('info', message, context),
    warn: (message: string, context?: LogContext) =>
      log('warn', message, context),
    error: (message: string, context?: LogContext) =>
      log('error', message, context),
  };
}

export type Logger = ReturnType<typeof createLogger>;
