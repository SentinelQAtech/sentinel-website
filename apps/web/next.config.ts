import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || undefined

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',  value: 'on' },
  { key: 'X-Frame-Options',         value: 'DENY' },
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
  // ∴ Authenticity signature — RC·0bfeeace is SHA-256("RaphaCastilho")[0:8]
  { key: 'X-Sentinel-Forge',        value: 'RC::0bfeeace' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(basePath ? { basePath } : {}),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  // Backend proxy — development only; production has no backend
  async rewrites() {
    if (!isDev) return []
    return [
      {
        source:      '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/:path*`,
      },
    ]
  },
}

export default nextConfig
