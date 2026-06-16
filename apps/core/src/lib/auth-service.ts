import { api, exchangeSupabaseSession } from './api'
import { createClient } from './supabase/client'
import type { User, AuthTokens, Role } from '@/types'

export interface AuthResult {
  user: User
  tokens: AuthTokens
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_ID_KEY = 'userId'

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function storeTokens(tokens: AuthTokens, userId: string): void {
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
  const token = getStoredAccessToken()
  if (!token) return null
  const { data } = await api.get<User>('/auth/me')
  return data
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) throw new Error(error?.message ?? 'Falha na autenticação')

  const u = data.user
  const user: User = {
    id: u.id,
    email: u.email!,
    username: u.user_metadata?.username ?? u.email!.split('@')[0],
    name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? u.email!.split('@')[0],
    role: (u.user_metadata?.role as Role) ?? 'ADMIN',
    isActive: true,
    createdAt: u.created_at,
  }

  let tokens: AuthTokens = { accessToken: '', refreshToken: '' }
  if (data.session?.access_token) {
    try {
      tokens = await exchangeSupabaseSession(data.session.access_token)
    } catch {
      console.warn('Supabase bridge exchange failed (API may be offline)')
    }
  }

  return { user, tokens }
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
