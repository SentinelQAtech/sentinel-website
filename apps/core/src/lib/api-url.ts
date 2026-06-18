const API_V1_SUFFIX = '/api/v1'

export function normalizeApiUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '')
  return trimmed.endsWith(API_V1_SUFFIX)
    ? trimmed.slice(0, -API_V1_SUFFIX.length)
    : trimmed
}

export function getApiV1Url(value: string): string {
  return `${normalizeApiUrl(value)}${API_V1_SUFFIX}`
}
