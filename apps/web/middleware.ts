import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@repo/db/client';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/auth/signin');
  const isNewUserPage = pathname.startsWith('/auth/new-user');

  // Redirect authenticated users away from signin
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/earn', request.url));
    }
    return NextResponse.next();
  }

  // 🔁 Redirect users away from /auth/new-user if wallet is already added
  if (isNewUserPage) {
    if (!token?.email) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (user?.solanaAddress) {
      return NextResponse.redirect(new URL('/earn', request.url));
    }
  }

  if (pathname.startsWith('/earn')) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/earn/:path*',
    '/auth/signin',
    '/auth/new-user',
  ],
};
