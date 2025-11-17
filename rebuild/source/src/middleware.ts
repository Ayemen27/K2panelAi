import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseSession } from '@/server/auth/verifyFirebaseSession';

const SESSION_COOKIE_NAME = '__session';
const LOGIN_PATH = '/login';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  const verificationResult = await verifyFirebaseSession(sessionCookie);

  if (!verificationResult.success) {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', verificationResult.uid || '');
  requestHeaders.set('x-user-email', verificationResult.email || '');
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/replView/:path*'],
};
