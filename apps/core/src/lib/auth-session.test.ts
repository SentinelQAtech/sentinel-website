import assert from 'node:assert/strict'
import test from 'node:test'
import { restoreInternalApiSession } from './auth-session'

const tokens = { accessToken: 'internal-access', refreshToken: 'internal-refresh' }
const user = {
  id: 'user-1',
  email: 'raphael@sentinelqa.tech',
  username: 'raphael',
  name: 'Raphael',
  role: 'ADMIN' as const,
  isActive: true,
  createdAt: '2026-06-20T00:00:00.000Z',
}

test('recreates and persists the internal API session from a restored Supabase session', async () => {
  const events: string[] = []

  const result = await restoreInternalApiSession('supabase-access', {
    exchange: async (accessToken) => {
      assert.equal(accessToken, 'supabase-access')
      events.push('exchange')
      return tokens
    },
    storeTokens: (received, userId) => {
      assert.deepEqual(received, tokens)
      assert.equal(userId, '')
      events.push('store-tokens')
    },
    fetchCurrentUser: async () => {
      events.push('fetch-user')
      return user
    },
    setUserId: (userId) => {
      assert.equal(userId, user.id)
      events.push('set-user-id')
    },
    clearTokens: () => events.push('clear'),
  })

  assert.deepEqual(result, user)
  assert.deepEqual(events, ['exchange', 'store-tokens', 'fetch-user', 'set-user-id'])
})

test('clears partial internal credentials when session restoration fails', async () => {
  let cleared = false

  await assert.rejects(() => restoreInternalApiSession('supabase-access', {
    exchange: async () => tokens,
    storeTokens: () => undefined,
    fetchCurrentUser: async () => { throw new Error('API unavailable') },
    setUserId: () => undefined,
    clearTokens: () => { cleared = true },
  }), /API unavailable/)

  assert.equal(cleared, true)
})
