'use client'

import { Bell, Search, Plus, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { SearchModal } from './search-modal'
import { NotificationsPanel } from './notifications-panel'
import { QuickCreateModal } from './quick-create-modal'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen]   = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const menuRef  = useRef<HTMLDivElement>(null)
  const bellRef  = useRef<HTMLButtonElement>(null)
  const unreadCount = 3

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <>
      <header className="relative z-20 h-14 border-b border-white/[0.06] flex items-center px-6 gap-4 bg-surface-900/50 backdrop-blur-sm shrink-0">
        <div className="flex-1" />

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              'flex items-center gap-2 h-8 px-3 rounded-lg text-xs',
              'bg-white/[0.04] border border-white/[0.08] text-white/40',
              'hover:bg-white/[0.07] hover:text-white/60 transition-all duration-200'
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Buscar</span>
            <kbd className="hidden sm:block px-1 py-0.5 rounded text-[10px] bg-white/10 border border-white/10 text-white/30">⌘K</kbd>
          </button>

          {/* Quick create */}
          <Button
            size="sm"
            variant="glow"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setCreateOpen(true)}
          >
            <span className="hidden sm:block">Criar</span>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              ref={bellRef}
              onClick={() => setNotifOpen(o => !o)}
              className={cn(
                'relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                notifOpen
                  ? 'text-white bg-white/[0.08]'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              )}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary border border-background" />
              )}
            </button>

            <NotificationsPanel
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              anchorRef={bellRef}
            />
          </div>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={cn(
                'flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-lg transition-all duration-200',
                menuOpen ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'
              )}
            >
              <Avatar user={user} size="sm" showStatus isOnline />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-white/85 leading-none">{user.name.split(' ')[0]}</p>
                <p className="text-[10px] text-white/35 leading-none mt-0.5">{user.role.replace('_', ' ')}</p>
              </div>
              <ChevronDown className={cn('w-3 h-3 text-white/40 transition-transform duration-150 hidden sm:block', menuOpen && 'rotate-180')} />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 dropdown-panel z-50 overflow-hidden animate-fade-in">
                {/* User info */}
                <div className="px-4 py-3.5 border-b border-white/[0.08]">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-white/45 mt-0.5">{user.email}</p>
                </div>

                {/* Menu items */}
                <div className="p-1.5 space-y-0.5">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-150">
                    <User className="w-4 h-4 text-white/40" /> Meu perfil
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-150">
                    <Settings className="w-4 h-4 text-white/40" /> Configurações
                  </button>
                </div>

                <div className="p-1.5 border-t border-white/[0.08]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals (rendered outside header flow) */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}
