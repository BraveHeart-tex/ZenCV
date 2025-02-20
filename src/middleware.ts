import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ratelimit } from './lib/rateLimiter';

const isProtectedRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authObject = await auth();
    if (!authObject.sessionId || !authObject.userId) {
      return NextResponse.json(
        {
          success: false,
          timestamp: Date.now(),
          message: 'You must be signed in to use this service.',
          data: null,
        },
        {
          status: 401,
        },
      );
    }

    const { success } = await ratelimit.limit(authObject.userId);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          timestamp: Date.now(),
          message:
            'Too many requests. Please wait a few minutes and try again.',
          data: null,
        },
        {
          status: 429,
        },
      );
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api)(.*)',
  ],
};
