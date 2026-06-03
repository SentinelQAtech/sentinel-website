'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useI18nStore } from '@/store/i18n'
import {
  LayoutDashboard, Bug, BarChart3,
  Bell, Settings, Users, ChevronLeft, ChevronRight,
  Search, Zap, CalendarDays, ClipboardCheck,
  Activity, Columns, FolderOpen, Building2, GraduationCap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { brandLogoIcon } from '@/lib/routes'

// ─── Types ─────────────────────────────────────────────────────

interface BadgeConfig {
  count: number
  cls:   string
}

interface NavItem {
  labelKey: string
  href:     string
  icon:     React.ElementType
  badge?:   BadgeConfig
  external?: boolean
}

interface NavGroup {
  labelKey: string
  items: NavItem[]
}

// ─── Navigation structure ───────────────────────────────────────

const navGroups: NavGroup[] = [
  {
    labelKey: 'overview',
    items: [
      { labelKey: 'dashboard', href: '/dashboard',                        icon: LayoutDashboard },
      { labelKey: 'daily',     href: '/daily',                            icon: Activity        },
      { labelKey: 'calendar',  href: '/calendar',                         icon: CalendarDays    },
      { labelKey: 'learning',  href: 'https://sentinelqa.tech/learning/', icon: GraduationCap, external: true },
    ],
  },
  {
    labelKey: 'workspace',
    items: [
      { labelKey: 'projects', href: '/projects', icon: FolderOpen },
      { labelKey: 'board',    href: '/kanban',   icon: Columns    },
      { labelKey: 'sprints',  href: '/sprints',  icon: Zap        },
      { labelKey: 'bugs', href: '/bugs', icon: Bug },
    ],
  },
  {
    labelKey: 'management',
    items: [
      { labelKey: 'team',       href: '/team',        icon: Users          },
      { labelKey: 'clients',    href: '/companies',   icon: Building2      },
      { labelKey: 'tasks', href: '/tasks', icon: ClipboardCheck },
    ],
  },
  {
    labelKey: 'analytics',
    items: [
      { labelKey: 'reports', href: '/reports', icon: BarChart3 },
    ],
  },
]

const bottomItems: NavItem[] = [
  { labelKey: 'notifications', href: '/notifications', icon: Bell },
  { labelKey: 'settings', href: '/settings', icon: Settings },
]

// ─── Sidebar ───────────────────────────────────────────────────

interface SidebarProps {
  collapsed?: boolean
  onToggle?:  () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

  const renderItem = (item: NavItem) => {
    const active = !item.external && pathname.startsWith(item.href)
    const label = t(item.labelKey)
    const itemClass = cn(
      'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium',
      'transition-all duration-150 group relative',
      active
        ? 'bg-primary/15 text-primary border border-primary/20 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
        : 'text-white/55 hover:text-white hover:bg-white/[0.05]',
      collapsed && 'justify-center px-2'
    )
    const Wrapper = item.external
      ? ({ children }: { children: React.ReactNode }) => (
          <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={itemClass}>
            {children}
          </a>
        )
      : ({ children }: { children: React.ReactNode }) => (
          <Link key={item.href} href={item.href} className={itemClass}>
            {children}
          </Link>
        )
    return (
      <Wrapper key={item.href}>
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
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge — expanded */}
        {item.badge && !collapsed && (
          <span className={cn(
            'ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold border leading-none',
            item.badge.cls
          )}>
            {item.badge.count}
          </span>
        )}

        {/* Badge dot — collapsed */}
        {item.badge && collapsed && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold bg-red-500 text-white border border-surface-900 leading-none">
            {item.badge.count}
          </span>
        )}

        {/* Active dot */}
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
            {label}
            {item.badge && (
              <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-bold border', item.badge.cls)}>
                {item.badge.count}
              </span>
            )}
          </div>
        )}
      </Wrapper>
    )
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-surface-900 border-r border-white/[0.06] shrink-0"
    >
      <div className="flex flex-col h-full overflow-hidden">

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0 shadow-glow-sm ring-1 ring-white/10">
            <img src={brandLogoIcon} alt="Sentinel" className="h-6 w-6 object-contain" />
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
                <span className="text-xs text-white/40 block -mt-0.5 whitespace-nowrap">Sentinel Core</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="px-3 py-3 border-b border-white/[0.06]">
          <button className={cn(
            'flex items-center justify-center gap-2.5 px-2.5 py-2 rounded-lg',
            'bg-white/[0.04] border border-white/[0.08] text-white/40',
            'hover:bg-white/[0.07] hover:text-white/60 transition-all duration-200',
            collapsed ? 'w-full' : 'w-9'
          )}>
            <Search className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {/* Grouped Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide">
          {navGroups.map((group, gi) => (
            <div key={group.labelKey} className={cn(gi > 0 && 'mt-3')}>

              {/* Section label */}
              {!collapsed ? (
                <p className="px-2 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/25 select-none">
                  {t(group.labelKey)}
                </p>
              ) : (
                gi > 0 && <div className="my-2 mx-2 border-t border-white/[0.06]" />
              )}

              <div className="space-y-0.5">
                {group.items.map(item => renderItem(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 py-3 border-t border-white/[0.06] space-y-0.5">
          {bottomItems.map(item => renderItem(item))}
        </div>

      </div>

      {/* Collapse toggle */}
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
