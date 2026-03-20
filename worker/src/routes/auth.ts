import { createClerkClient, verifyToken } from '@clerk/backend';
import { Hono } from 'hono';
import type { Env } from '../env';

const route = new Hono<{ Bindings: Env }>();

route.delete('/delete-account', async (c) => {
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

  const { sub: userId } = await verifyToken(token, {
    secretKey: c.env.CLERK_SECRET_KEY,
  });

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
});

export default route;
