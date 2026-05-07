'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'

// ∴ RC · 0bfeeace
function printSignature() {
  console.log(
    '%cSENTINEL PROJECT MANAGER',
    'color:#6366f1;font-size:20px;font-weight:900;font-family:monospace;letter-spacing:3px;padding:8px 0;'
  )
  console.log(
    '%cPlataforma Interna · Proprietário · 2025',
    'color:#4f46e5;font-size:11px;font-family:monospace;letter-spacing:2px;'
  )
  console.log(
    '%c' + '─'.repeat(48),
    'color:#312e81;font-family:monospace;'
  )
  console.log(
    '%c∴ Forged by Raphael Castilho · Sentinel Tech QA',
    'color:#818cf8;font-size:12px;font-family:monospace;font-style:italic;'
  )
  console.log(
    '%csig · RC∴0bfeeace',
    'color:#4338ca;font-size:10px;font-family:monospace;'
  )
  console.log(
    '%c⚠ Sistema proprietário. Acesso não autorizado é proibido.',
    'color:#7f1d1d;font-size:10px;font-family:monospace;'
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => { printSignature() }, [])

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(222 47% 7%)',
            color: 'hsl(210 40% 98%)',
            border: '1px solid hsl(217 32% 12%)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0b0f1a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0b0f1a' },
          },
        }}
      />
    </QueryClientProvider>

  )
}
