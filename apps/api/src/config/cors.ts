const DEFAULT_VERCEL_PREVIEW_SUFFIX =
  'castilho-raphael-5448s-projects.vercel.app'

export function parseCorsOrigins(value: string | undefined): string[] {
  return (value ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export function isAllowedCorsOrigin(
  origin: string | undefined,
  configuredOrigins: string[],
  previewHostSuffix = process.env.VERCEL_PREVIEW_HOST_SUFFIX ??
    DEFAULT_VERCEL_PREVIEW_SUFFIX
): boolean {
  if (!origin || configuredOrigins.includes(origin)) return true

  try {
    const url = new URL(origin)
    if (url.protocol !== 'https:' || url.port || url.pathname !== '/')
      return false

    return (
      url.hostname.startsWith('sentinel-core-') &&
      url.hostname.endsWith(`-${previewHostSuffix}`)
    )
  } catch {
    return false
  }
}
