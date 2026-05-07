import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://sentinel-project-manager-web.vercel.app',
  'http://localhost:3000',
]

// In-memory rate limit — persists per Edge worker instance
// Not globally shared across nodes, but adds meaningful friction
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 15   // max requests
const WINDOW_MS  = 60_000 // per 60 seconds

export function middleware(req: NextRequest) {
  // ── Origin check ──────────────────────────────────────────────
  const origin = req.headers.get('origin') ?? ''
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── Rate limiting by IP ────────────────────────────────────────
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
          headers: {
            'Content-Type': 'application/json',
            'Retry-After':  '60',
          },
        }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/sentinel-ai',
}
