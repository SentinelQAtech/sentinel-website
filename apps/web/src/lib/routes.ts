export const CORE_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? ''

export function withCoreBasePath(path: string) {
  if (!CORE_BASE_PATH || /^https?:\/\//.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${CORE_BASE_PATH}${normalized}`
}

export const brandLogoIcon = withCoreBasePath('/brand/logo_icon.png')
