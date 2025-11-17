import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';

export const runtime = 'nodejs';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY_MS = 432000000; // 5 days in milliseconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: idToken is required' },
        { status: 400 }
      );
    }

    let sessionCookie: string;
    
    try {
      sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn: SESSION_EXPIRY_MS,
      });
    } catch (error) {
      console.error('Error creating session cookie:', error);
      return NextResponse.json(
        { error: 'Failed to create session cookie' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: 'Session created successfully' },
      { status: 200 }
    );
    
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_EXPIRY_MS / 1000,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in POST /api/auth/session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Session deleted successfully' },
      { status: 200 }
    );
    
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in DELETE /api/auth/session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
