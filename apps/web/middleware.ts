import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/auth/signin')

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/earn', request.url))
  }

  if (pathname.startsWith('/earn') || pathname.startsWith('/auth/new-user')) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/earn/:path*',
    '/auth/signin',
    '/auth/new-user',
  ],
}