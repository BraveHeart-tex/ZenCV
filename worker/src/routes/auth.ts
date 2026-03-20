import { createClerkClient, verifyToken } from '@clerk/backend';
import * as Sentry from '@sentry/cloudflare';
import { Hono } from 'hono';
import type { Env } from '../env';
import { captureError } from '../lib/sentry';

const route = new Hono<{ Bindings: Env }>();

route.delete('/delete-account', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return c.json(
        {
          success: false,
          message: 'You must be signed in to delete your account.',
          timestamp: Date.now(),
        },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string | undefined;

    try {
      const { sub } = await verifyToken(token, {
        secretKey: c.env.CLERK_SECRET_KEY,
      });
      userId = sub;
    } catch (err) {
      captureError(err, c, {
        handler: 'auth/delete-account',
        step: 'verifyToken',
      });
      return c.json(
        {
          success: false,
          message: 'You must be signed in to delete your account.',
          timestamp: Date.now(),
        },
        401
      );
    }

    if (!userId) {
      return c.json(
        {
          success: false,
          message: 'You must be signed in to delete your account.',
          timestamp: Date.now(),
        },
        401
      );
    }

    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'Deleting user account',
      level: 'info',
      data: { userId },
    });

    const clerk = createClerkClient({ secretKey: c.env.CLERK_SECRET_KEY });
    await clerk.users.deleteUser(userId);

    return c.json(
      {
        success: true,
        message: 'Your account has been deleted.',
        timestamp: Date.now(),
      },
      200
    );
  } catch (error) {
    captureError(error, c, { handler: 'auth/delete-account' });
    return c.json(
      {
        success: false,
        message: 'An internal error occurred while processing the request.',
        timestamp: Date.now(),
      },
      500
    );
  }
});

export default route;
