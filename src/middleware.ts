import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = '__session';
const LOGIN_PATH = '/login';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/replView/:path*'],
};
