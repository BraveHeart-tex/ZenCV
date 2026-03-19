import { createClerkClient, verifyToken } from '@clerk/backend';

export const config = { runtime: 'nodejs' };

export default async function handler(request: Request) {
  if (request.method !== 'DELETE') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { status: 405 }
    );
  }
  try {
    const authHeader = request.headers.get('Authorization');
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
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
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
    console.error('delete-clerk-account error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
