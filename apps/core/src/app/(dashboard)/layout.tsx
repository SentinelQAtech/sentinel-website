'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AIFloatingButton } from '@/components/ai/ai-floating-button'
import { AIPanel } from '@/components/ai/ai-panel'
import { CommandPalette } from '@/components/ai/command-palette'
import { useAuthStore } from '@/store/auth'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace('/login')
    }
  }, [_hasHydrated, isAuthenticated, router])

  if (!_hasHydrated) return null
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-3xl rounded-full" />
      </div>

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className={cn('flex-1 overflow-y-auto', 'p-6')}>
          {children}
        </main>
      </div>

      {/* ── Sentinel AI ── */}
      <AIFloatingButton />
      <AIPanel />
      <CommandPalette />
    </div>
  )
}
