import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ratelimit } from './lib/rateLimiter';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const log = (
  level: LogLevel,
  message: string,
  context: Record<string, unknown> = {}
) => {
  console.info(
    JSON.stringify({
      level,
      scope: 'middleware',
      message,
      timestamp: new Date().toISOString(),
      ...context,
    })
  );
};

const isProtectedRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const start = Date.now();
  const url = req.nextUrl.pathname;
  const method = req.method;
  const requestId = req.headers.get('x-request-id') ?? crypto.randomUUID();

  try {
    log('debug', 'Incoming request', {
      requestId,
      method,
      url,
      ip: req.headers.get('x-forwarded-for') ?? 'unknown',
      userAgent: req.headers.get('user-agent'),
    });

    if (isProtectedRoute(req)) {
      const authObject = await auth();

      if (!authObject.sessionId || !authObject.userId) {
        log('warn', 'Unauthorized access attempt', {
          requestId,
          method,
          url,
        });

        return NextResponse.json(
          {
            success: false,
            timestamp: Date.now(),
            message: 'You must be signed in to use this service.',
            data: null,
          },
          { status: 401 }
        );
      }

      const { success } = await ratelimit.limit(authObject.userId);

      if (!success) {
        log('warn', 'Rate limit exceeded', {
          requestId,
          userId: authObject.userId,
          method,
          url,
        });

        return NextResponse.json(
          {
            success: false,
            timestamp: Date.now(),
            message:
              'Too many requests. Please wait a few minutes and try again.',
            data: null,
          },
          { status: 429 }
        );
      }

      log('info', 'Authorized request passed rate limit', {
        requestId,
        userId: authObject.userId,
        method,
        url,
      });
    }

    const response = NextResponse.next();

    log('info', 'Request completed', {
      requestId,
      method,
      url,
      durationMs: Date.now() - start,
      status: response.status,
    });

    return response;
  } catch (error: unknown) {
    log('error', 'Unhandled middleware error', {
      requestId,
      method,
      url,
      durationMs: Date.now() - start,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        timestamp: Date.now(),
        message: 'Internal server error. Please try again later.',
        data: null,
      },
      { status: 500 }
    );
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api)(.*)',
  ],
};
