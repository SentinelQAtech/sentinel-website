import type { AuthTokens, User } from '@/types'

interface RestoreInternalApiSessionDependencies {
  exchange: (accessToken: string) => Promise<AuthTokens>
  storeTokens: (tokens: AuthTokens | undefined, userId: string) => void
  fetchCurrentUser: () => Promise<User>
  setUserId: (userId: string) => void
  clearTokens: () => void
}

export async function restoreInternalApiSession(
  supabaseAccessToken: string,
  dependencies: RestoreInternalApiSessionDependencies,
): Promise<User> {
  try {
    const tokens = await dependencies.exchange(supabaseAccessToken)
    dependencies.storeTokens(tokens, '')
    const user = await dependencies.fetchCurrentUser()
    dependencies.setUserId(user.id)
    return user
  } catch (error) {
    dependencies.clearTokens()
    throw error
  }
}
