import type { QACategory, QAPriority, QAItemSource } from '@/store/qa-importer'

const CATEGORY_BY_KEY: Record<string, QACategory> = {
  'ready for qa': 'Ready for QA',
  ready: 'Ready for QA',
  'in testing': 'In Testing',
  testing: 'In Testing',
  'bug validation': 'Bug Validation',
  regression: 'Regression',
  review: 'Review',
  blocked: 'Blocked',
  done: 'Done',
  other: 'Other',
}

const PRIORITY_BY_KEY: Record<string, QAPriority> = {
  blocker: 'Critical',
  critical: 'Critical',
  highest: 'Critical',
  high: 'High',
  medium: 'Medium',
  normal: 'Medium',
  low: 'Low',
  lowest: 'Low',
  unknown: 'Unknown',
}

function contractKey(value: unknown) {
  return typeof value === 'string'
    ? value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')
    : ''
}

export function normalizeQACategory(value: unknown): QACategory {
  return CATEGORY_BY_KEY[contractKey(value)] ?? 'Other'
}

export function normalizeQAPriority(value: unknown): QAPriority {
  return PRIORITY_BY_KEY[contractKey(value)] ?? 'Unknown'
}

export function normalizeQAItemSource(value: unknown): QAItemSource {
  const key = contractKey(value)
  return key === 'csv' || key === 'extension' ? key : 'manual'
}
