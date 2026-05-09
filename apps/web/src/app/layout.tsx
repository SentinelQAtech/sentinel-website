import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'

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
    default: 'Sentinel Project Manager',
    template: '%s | SPM',
  },
  description: 'Enterprise-grade project management platform focused on QA, Agile, and intelligent operations.',
  keywords: ['project management', 'QA', 'bug tracking', 'agile', 'sprints', 'sentinel tech'],
  authors: [{ name: 'Sentinel Tech' }],
  icons: {
    icon: '/brand/logo_icon.png',
    shortcut: '/brand/logo_icon.png',
    apple: '/brand/logo_icon.png',
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
      </body>
    </html>
  )
}
