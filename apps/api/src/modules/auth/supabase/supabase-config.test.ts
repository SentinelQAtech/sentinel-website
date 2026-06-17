import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveSupabaseServerKey } from './supabase-config'

test('prefers a service role key when one is configured', () => {
  assert.equal(
    resolveSupabaseServerKey({
      SUPABASE_SERVICE_ROLE_KEY: 'service-role',
      SUPABASE_PUBLISHABLE_KEY: 'publishable'
    }),
    'service-role'
  )
})

test('uses a publishable key to validate user tokens without admin privileges', () => {
  assert.equal(
    resolveSupabaseServerKey({
      SUPABASE_PUBLISHABLE_KEY: 'publishable'
    }),
    'publishable'
  )
})
