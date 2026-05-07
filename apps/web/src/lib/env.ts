// Typed, centralised access to environment variables.
// Server-only vars (no NEXT_PUBLIC_ prefix) are only safe to use in
// API routes and Server Components — never imported by client bundles.

export const env = {
  // Server-side
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,

  // Public (available on client and server)
  apiUrl:   process.env.NEXT_PUBLIC_API_URL   ?? 'http://localhost:3001',
  wsUrl:    process.env.NEXT_PUBLIC_WS_URL    ?? 'http://localhost:3001',
  appName:  process.env.NEXT_PUBLIC_APP_NAME  ?? 'Sentinel Project Manager',

  isDev:  process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const
