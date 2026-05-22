import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '@/styles/globals.css'
import { Providers } from './providers'
import { brandLogoIcon } from '@/lib/routes'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sentinel Core',
    template: '%s | Sentinel Core',
  },
  description: 'Internal QA operations platform for Sentinel Tech - QA.',
  keywords: ['QA operations', 'quality management', 'bug tracking', 'agile', 'sprints', 'sentinel tech'],
  authors: [{ name: 'Sentinel Tech' }],
  icons: {
    icon: brandLogoIcon,
    shortcut: brandLogoIcon,
    apple: brandLogoIcon,
  },
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0f1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
