import assert from 'node:assert/strict'
import test from 'node:test'
import { getApiV1Url, normalizeApiUrl } from './api-url'

test('keeps a configured API origin unchanged', () => {
  assert.equal(
    normalizeApiUrl('https://sentinel-core-api.vercel.app'),
    'https://sentinel-core-api.vercel.app'
  )
})

test('removes an accidental api/v1 suffix and trailing slash', () => {
  assert.equal(
    normalizeApiUrl('https://sentinel-core-api.vercel.app/api/v1/'),
    'https://sentinel-core-api.vercel.app'
  )
})

test('builds exactly one api/v1 prefix', () => {
  assert.equal(
    getApiV1Url('https://sentinel-core-api.vercel.app/api/v1'),
    'https://sentinel-core-api.vercel.app/api/v1'
  )
})
