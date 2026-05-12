import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth'

const PUBLIC = ['/login', '/api/auth']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (PUBLIC.some(p => path.startsWith(p))) return NextResponse.next()

  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifySessionToken(token))) {
    const login = new URL('/login', req.url)
    login.searchParams.set('from', path)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
