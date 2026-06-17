import assert from 'node:assert/strict'
import test from 'node:test'
import { isAllowedCorsOrigin } from './cors'

const configuredOrigins = [
  'http://localhost:3000',
  'https://sentinel-core-iota.vercel.app'
]

test('allows requests without Origin and exact configured origins', () => {
  assert.equal(isAllowedCorsOrigin(undefined, configuredOrigins), true)
  assert.equal(
    isAllowedCorsOrigin(
      'https://sentinel-core-iota.vercel.app',
      configuredOrigins
    ),
    true
  )
})

test('allows only HTTPS Vercel aliases owned by the sentinel-core project', () => {
  assert.equal(
    isAllowedCorsOrigin(
      'https://sentinel-core-ppr65du3o-castilho-raphael-5448s-projects.vercel.app',
      configuredOrigins
    ),
    true
  )
  assert.equal(
    isAllowedCorsOrigin(
      'https://sentinel-core-git-feature-castilho-raphael-5448s-projects.vercel.app',
      configuredOrigins
    ),
    true
  )
})

test('rejects lookalike, insecure and unrelated origins', () => {
  assert.equal(
    isAllowedCorsOrigin(
      'https://sentinel-core.attacker.example',
      configuredOrigins
    ),
    false
  )
  assert.equal(
    isAllowedCorsOrigin(
      'http://sentinel-core-preview.vercel.app',
      configuredOrigins
    ),
    false
  )
  assert.equal(
    isAllowedCorsOrigin('https://other-project.vercel.app', configuredOrigins),
    false
  )
  assert.equal(
    isAllowedCorsOrigin(
      'https://sentinel-core-preview-other-team.vercel.app',
      configuredOrigins
    ),
    false
  )
})
