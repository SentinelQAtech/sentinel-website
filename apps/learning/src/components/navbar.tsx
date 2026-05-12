'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',         label: 'Início' },
  { href: '/trilhas',  label: 'Trilhas' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/sobre',    label: 'Sobre' },
]

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30 group-hover:bg-primary/30 transition-colors">
            <BookOpen className="h-4 w-4 text-primary-400" />
          </div>
          <span className="font-semibold tracking-tight">
            Sentinel <span className="text-primary-400">Learning</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm transition-colors',
                pathname === l.href
                  ? 'bg-primary/10 text-primary-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sair"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sair</span>
          </button>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(o => !o)} className="md:hidden text-white/60 hover:text-white">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-surface-950 px-6 py-4 flex flex-col gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm transition-colors',
                pathname === l.href
                  ? 'bg-primary/10 text-primary-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
