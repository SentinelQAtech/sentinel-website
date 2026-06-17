import { api, exchangeSupabaseSession } from './api'
import { createClient } from './supabase/client'
import type { User, AuthTokens, Role } from '@/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface AuthResult {
  user: User
  tokens?: AuthTokens
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_ID_KEY = 'userId'

function isLocalAuthMode(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_MODE === 'local'
}

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function storeTokens(tokens: AuthTokens | undefined, userId: string): void {
  clearTokens()
  if (!tokens?.accessToken || !tokens.refreshToken) return

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  localStorage.setItem(USER_ID_KEY, userId)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
}

export async function getCurrentUser(): Promise<User | null> {
  if (isLocalAuthMode()) {
    if (!getStoredAccessToken()) return null

    try {
      const { data } = await api.get<User>('/auth/me')
      return data
    } catch {
      clearTokens()
      return null
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return toAppUser(data.user)
}

function toAppUser(user: SupabaseUser): User {
  const email = user.email ?? ''

  return {
    id: user.id,
    email,
    username: user.user_metadata?.username ?? email.split('@')[0],
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? email.split('@')[0],
    role: (user.app_metadata?.role as Role) ?? (user.user_metadata?.role as Role) ?? 'ADMIN',
    isActive: true,
    createdAt: user.created_at,
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  if (isLocalAuthMode()) {
    clearTokens()
    const { data: tokens } = await api.post<AuthTokens>('/auth/login', { email, password })
    storeTokens(tokens, '')
    const { data: user } = await api.get<User>('/auth/me')
    localStorage.setItem(USER_ID_KEY, user.id)
    return { user, tokens }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) throw new Error(error?.message ?? 'Falha na autenticação')

  const user = toAppUser(data.user)

  if (data.session?.access_token) {
    try {
      const tokens = await exchangeSupabaseSession(data.session.access_token)
      return { user, tokens }
    } catch {
      console.warn('Supabase bridge exchange failed (API may be offline)')
    }
  }

  return { user }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch {
    // Proceed with local cleanup even if API call fails
  }
  clearTokens()
  const supabase = createClient()
  await supabase.auth.signOut()
}
