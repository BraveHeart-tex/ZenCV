import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const authObject = await auth();
  if (!authObject || !authObject.userId) {
    return NextResponse.json({
      success: false,
      message: 'You must be signed in to delete your account.',
      timestamp: Date.now(),
    });
  }

  try {
    const client = await clerkClient();
    await client.users.deleteUser(authObject.userId);
    return NextResponse.json({
      success: true,
      message: 'Your account has been deleted.',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message:
        'An error occurred while deleting your account. Please try again later.',
      timestamp: Date.now(),
    });
  }
}
