import { createClerkClient, verifyToken } from '@clerk/backend';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'DELETE') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { status: 405 }
    );
  }
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'You must be signed in to delete your account.',
          timestamp: Date.now(),
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const token = authHeader.replace('Bearer ', '');
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const { sub: userId } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'You must be signed in to delete your account.',
          timestamp: Date.now(),
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    await clerk.users.deleteUser(userId);
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your account has been deleted.',
        timestamp: Date.now(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          'An error occurred while deleting your account. Please try again later.',
        timestamp: Date.now(),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
