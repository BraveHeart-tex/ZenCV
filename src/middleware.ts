import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ratelimit } from './lib/rateLimiter';

const log = (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log('[Middleware]', ...args);
};

const isProtectedRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  try {
    const url = req.nextUrl.pathname;

    if (isProtectedRoute(req)) {
      const authObject = await auth();

      if (!authObject.sessionId || !authObject.userId) {
        log('Unauthorized access attempt', { url });

        return NextResponse.json(
          {
            success: false,
            timestamp: Date.now(),
            message: 'You must be signed in to use this service.',
            data: null,
          },
          { status: 401 },
        );
      }

      const { success } = await ratelimit.limit(authObject.userId);
      if (!success) {
        log('Rate limit exceeded', {
          userId: authObject.userId,
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
          { status: 429 },
        );
      }
    }

    return NextResponse.next();
  } catch (error: unknown) {
    log('Middleware error', {
      message: error instanceof Error ? error?.message : String(error),
      stack: error instanceof Error ? error?.stack : '',
    });

    return NextResponse.json(
      {
        success: false,
        timestamp: Date.now(),
        message: 'Internal server error. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api)(.*)',
  ],
};
