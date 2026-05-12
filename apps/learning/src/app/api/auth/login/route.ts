import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json().catch(() => ({}))

  const validUser = process.env.AUTH_USER     ?? 'sentinel'
  const validPass = process.env.AUTH_PASSWORD

  if (!validPass) {
    return NextResponse.json({ error: 'Servidor não configurado — defina AUTH_PASSWORD.' }, { status: 500 })
  }

  if (username !== validUser || password !== validPass) {
    // Constant-time delay to prevent timing attacks
    await new Promise(r => setTimeout(r, 400))
    return NextResponse.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 })
  }

  const token    = await createSessionToken()
  const response = NextResponse.json({ ok: true })

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  })

  return response
}
