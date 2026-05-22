import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// ── Rate limiting (for /api/sentinel-ai) ─────────────────────────────────────
const ALLOWED_ORIGINS = (
  process.env.NEXT_PUBLIC_ALLOWED_ORIGINS ??
  'https://sentinel-core-web.vercel.app,http://localhost:3000'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

// In-memory — not shared across Edge runtime instances.
// Provides per-instance friction, not a globally enforced limit.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 15
const WINDOW_MS  = 60_000

function handleAiRoute(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin') ?? ''
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const now    = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  } else {
    record.count++
    if (record.count > RATE_LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Try again in a minute.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        }
      )
    }
  }

  return null // allow through
}

function redirectWithCookies(to: NextResponse, cookieSource: NextResponse): NextResponse {
  cookieSource.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value)
  })
  return to
}

// ── Auth pages — accessible without a session ────────────────────────────────
const AUTH_PATHS = ['/login', '/forgot-password', '/change-password', '/auth/callback']

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Dedicated handler for the AI API route
  if (pathname === '/api/sentinel-ai') {
    const blocked = handleAiRoute(req)
    if (blocked) return blocked
    return NextResponse.next()
  }

  // Short-circuit /auth/callback — it exchanges the code for a session and
  // has no existing session to check.
  if (pathname.startsWith('/auth/callback')) {
    return NextResponse.next({ request: req })
  }

  // Short-circuit other /api/* routes — they don't need a session check here.
  if (pathname.startsWith('/api/') && pathname !== '/api/sentinel-ai') {
    return NextResponse.next({ request: req })
  }

  // ── Supabase session check ────────────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const onAuthPage  = isAuthPath(pathname)
  const onChangePwd = pathname === '/change-password' || pathname.startsWith('/change-password/')
  const forceChange = user?.user_metadata?.force_password_change === true

  // Not logged in and trying to access a protected page
  if (!user && !onAuthPage) {
    const redirectTo = req.nextUrl.clone()
    redirectTo.pathname = '/login'
    redirectTo.search = ''
    return redirectWithCookies(NextResponse.redirect(redirectTo), supabaseResponse)
  }

  // Logged in but must change password first
  if (user && forceChange && !onChangePwd) {
    const redirectTo = req.nextUrl.clone()
    redirectTo.pathname = '/change-password'
    redirectTo.search = ''
    return redirectWithCookies(NextResponse.redirect(redirectTo), supabaseResponse)
  }

  // Logged in and landing on login/forgot-password → go to dashboard
  if (user && (pathname === '/login' || pathname === '/forgot-password')) {
    const redirectTo = req.nextUrl.clone()
    redirectTo.pathname = '/dashboard'
    return redirectWithCookies(NextResponse.redirect(redirectTo), supabaseResponse)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
