import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',        value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
        { key: 'X-Sentinel-Forge',       value: 'RC::0bfeeace' },
      ],
    }]
  },
}

export default nextConfig
