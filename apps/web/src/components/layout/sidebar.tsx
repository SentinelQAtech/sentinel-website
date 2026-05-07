'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FolderKanban, Bug, Zap, BarChart3,
  Bell, Settings, Users, ChevronLeft, ChevronRight,
  Shield, Search, Plus, GitBranch, Sun, CalendarDays, ClipboardCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Nav items with optional badge ────────────────────────────

interface BadgeConfig {
  count: number
  cls: string   // tailwind classes for color
}

interface NavItem {
  label: string
  href:  string
  icon:  React.ElementType
  badge?: BadgeConfig
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects',  href: '/projects',  icon: FolderKanban    },
  { label: 'Kanban',    href: '/kanban',    icon: GitBranch       },
  {
    label: 'Bugs', href: '/bugs', icon: Bug,
    badge: { count: 6, cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  },
  {
    label: 'Sprints', href: '/sprints', icon: Zap,
    badge: { count: 3, cls: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Team',    href: '/team',    icon: Users     },
  { label: 'Daily',       href: '/daily',       icon: Sun           },
  { label: 'Calendar',   href: '/calendar',   icon: CalendarDays  },
  { label: 'QA Importer', href: '/qa-importer', icon: ClipboardCheck },
]

const bottomItems: NavItem[] = [
  {
    label: 'Notifications', href: '/notifications', icon: Bell,
    badge: { count: 5, cls: 'bg-primary/20 text-primary border-primary/30' },
  },
  { label: 'Settings', href: '/settings', icon: Settings },
]

// ─── Sidebar ──────────────────────────────────────────────────

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const renderItem = (item: NavItem, active: boolean) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium',
        'transition-all duration-150 group relative',
        active
          ? 'bg-primary/15 text-primary border border-primary/20 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
          : 'text-white/55 hover:text-white hover:bg-white/[0.05]',
        collapsed && 'justify-center px-2'
      )}
    >
      <item.icon className={cn(
        'w-4 h-4 shrink-0 transition-colors duration-150',
        active ? 'text-primary' : 'text-white/40 group-hover:text-white/70'
      )} />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge — expanded mode */}
      {item.badge && !collapsed && (
        <span className={cn(
          'ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold border leading-none',
          item.badge.cls
        )}>
          {item.badge.count}
        </span>
      )}

      {/* Badge dot — collapsed mode */}
      {item.badge && collapsed && (
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold bg-red-500 text-white border border-surface-900 leading-none">
          {item.badge.count}
        </span>
      )}

      {/* Active indicator dot */}
      {active && !collapsed && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      )}

      {/* Tooltip on collapsed */}
      {collapsed && (
        <div className={cn(
          'absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium',
          'bg-surface-800 border border-white/10 text-white whitespace-nowrap',
          'opacity-0 pointer-events-none group-hover:opacity-100',
          'transition-opacity duration-150 shadow-xl z-50',
          'flex items-center gap-2'
        )}>
          {item.label}
          {item.badge && (
            <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-bold border', item.badge.cls)}>
              {item.badge.count}
            </span>
          )}
        </div>
      )}
    </Link>
  )

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className={cn(
        'relative flex flex-col h-screen bg-surface-900 border-r border-white/[0.06]',
        'shrink-0'
      )}
    >
      {/* Inner content wrapper — overflow-hidden here so toggle button can escape the aside bounds */}
      <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-sentinel-gradient flex items-center justify-center shrink-0 shadow-glow-sm">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <span className="text-sm font-bold text-white whitespace-nowrap">Sentinel</span>
              <span className="text-xs text-white/40 block -mt-0.5 whitespace-nowrap">Project Manager</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-white/[0.06]">
        <button className={cn(
          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg',
          'bg-white/[0.04] border border-white/[0.08] text-white/40',
          'hover:bg-white/[0.07] hover:text-white/60 transition-all duration-200',
          collapsed && 'justify-center'
        )}>
          <Search className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span className="text-xs">Search... ⌘K</span>}
        </button>
      </div>

      {/* Quick Create */}
      {!collapsed && (
        <div className="px-3 py-2">
          <button className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium',
            'bg-primary/20 border border-primary/30 text-primary',
            'hover:bg-primary/30 transition-all duration-200'
          )}>
            <Plus className="w-3.5 h-3.5" />
            Quick Create
          </button>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide space-y-0.5">
        {!collapsed && (
          <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
            Navigation
          </p>
        )}
        {navItems.map(item => renderItem(item, pathname.startsWith(item.href)))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 py-3 border-t border-white/[0.06] space-y-0.5">
        {bottomItems.map(item => renderItem(item, pathname.startsWith(item.href)))}
      </div>
      </div>{/* end inner overflow-hidden wrapper */}

      {/* Collapse toggle — lives outside the overflow-hidden div so it's fully visible */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute -right-3 top-20 w-6 h-6 rounded-full',
          'bg-surface-800 border border-white/15 text-white/50',
          'flex items-center justify-center',
          'hover:bg-surface-700 hover:text-white/80 transition-all duration-200',
          'shadow-lg z-10'
        )}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  )
}
