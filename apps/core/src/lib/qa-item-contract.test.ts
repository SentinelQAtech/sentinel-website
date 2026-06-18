import assert from 'node:assert/strict'
import test from 'node:test'
import {
  normalizeQACategory,
  normalizeQAPriority,
  normalizeQAItemSource,
} from './qa-item-contract'

test('normalizes canonical and legacy QA categories', () => {
  assert.equal(normalizeQACategory('Ready for QA'), 'Ready for QA')
  assert.equal(normalizeQACategory('in_testing'), 'In Testing')
  assert.equal(normalizeQACategory('  BUG-VALIDATION '), 'Bug Validation')
})

test('falls back safely for unknown QA categories', () => {
  assert.equal(normalizeQACategory('Awaiting product'), 'Other')
  assert.equal(normalizeQACategory(undefined), 'Other')
})

test('normalizes priorities and sources without trusting API strings', () => {
  assert.equal(normalizeQAPriority('Highest'), 'Critical')
  assert.equal(normalizeQAPriority('unexpected'), 'Unknown')
  assert.equal(normalizeQAItemSource('extension'), 'extension')
  assert.equal(normalizeQAItemSource('jira'), 'manual')
})
