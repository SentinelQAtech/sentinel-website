// Cookie-based session auth using Web Crypto (works in Edge + Node runtimes)
// Token = base64(timestamp:HMAC-SHA256(timestamp, AUTH_SECRET))
// Max session age: 7 days

const SESSION_COOKIE = 'sl_session'
const MAX_AGE_MS     = 7 * 24 * 60 * 60 * 1000

async function getKey(): Promise<CryptoKey> {
  const secret  = process.env.AUTH_SECRET ?? 'change-me-set-AUTH_SECRET-in-env'
  const encoded = new TextEncoder().encode(secret)
  return crypto.subtle.importKey('raw', encoded, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export async function createSessionToken(): Promise<string> {
  const key = await getKey()
  const ts  = Date.now().toString()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts))
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return btoa(`${ts}:${hex}`)
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const decoded      = atob(token)
    const colonIdx     = decoded.indexOf(':')
    const ts           = decoded.slice(0, colonIdx)
    const sigHex       = decoded.slice(colonIdx + 1)
    if (!ts || !sigHex) return false
    if (Date.now() - parseInt(ts) > MAX_AGE_MS) return false

    const key         = await getKey()
    const expectedSig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts))
    const expectedHex = Array.from(new Uint8Array(expectedSig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return sigHex === expectedHex
  } catch {
    return false
  }
}

export { SESSION_COOKIE }
