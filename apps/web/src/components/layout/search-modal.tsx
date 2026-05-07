'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FolderKanban, Bug, Zap, ArrowRight, Clock, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface SearchItem {
  id: string
  type: 'project' | 'bug' | 'sprint' | 'page'
  title: string
  subtitle?: string
  href: string
  icon: React.ReactNode
  color: string
}

const STATIC_ITEMS: SearchItem[] = [
  { id: 'p1', type: 'project', title: 'E-Commerce Platform',     subtitle: 'Concept-USA',     href: '/projects/1', icon: <FolderKanban className="w-4 h-4" />, color: '#3b82f6' },
  { id: 'p2', type: 'project', title: 'Brewery QA Automation',   subtitle: 'ABinBev-IND',     href: '/projects/3', icon: <FolderKanban className="w-4 h-4" />, color: '#f59e0b' },
  { id: 'p3', type: 'project', title: 'Sprint Tracker App',      subtitle: 'ScrumLaunch-UKR', href: '/projects/5', icon: <FolderKanban className="w-4 h-4" />, color: '#06b6d4' },
  { id: 'b1', type: 'bug',     title: 'BUG-042 · Auth token not refreshing', subtitle: 'Critical · Open', href: '/bugs/1', icon: <Bug className="w-4 h-4" />, color: '#ef4444' },
  { id: 'b2', type: 'bug',     title: 'BUG-041 · Kanban drag & drop Safari', subtitle: 'High · In Progress', href: '/bugs/2', icon: <Bug className="w-4 h-4" />, color: '#f97316' },
  { id: 's1', type: 'sprint',  title: 'Sprint 14',               subtitle: 'SPM Frontend · Active', href: '/sprints', icon: <Zap className="w-4 h-4" />, color: '#8b5cf6' },
]

const PAGES: SearchItem[] = [
  { id: 'pg1', type: 'page', title: 'Dashboard',   subtitle: 'Visão geral', href: '/dashboard', icon: <Hash className="w-4 h-4" />, color: '#6366f1' },
  { id: 'pg2', type: 'page', title: 'Projects',    subtitle: 'Todos os projetos', href: '/projects', icon: <Hash className="w-4 h-4" />, color: '#6366f1' },
  { id: 'pg3', type: 'page', title: 'Kanban',      subtitle: 'Board de tarefas', href: '/kanban', icon: <Hash className="w-4 h-4" />, color: '#6366f1' },
  { id: 'pg4', type: 'page', title: 'Bug Tracker', subtitle: 'Gerenciar bugs', href: '/bugs', icon: <Hash className="w-4 h-4" />, color: '#6366f1' },
  { id: 'pg5', type: 'page', title: 'Sprints',     subtitle: 'Gestão ágil', href: '/sprints', icon: <Hash className="w-4 h-4" />, color: '#6366f1' },
  { id: 'pg6', type: 'page', title: 'Reports',     subtitle: 'Análises e métricas', href: '/reports', icon: <Hash className="w-4 h-4" />, color: '#6366f1' },
]

const ALL_ITEMS = [...STATIC_ITEMS, ...PAGES]

const TYPE_LABEL: Record<string, string> = {
  project: 'Projeto', bug: 'Bug', sprint: 'Sprint', page: 'Página',
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim()
    ? ALL_ITEMS.filter(i =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : PAGES

  useEffect(() => { setCursor(0) }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  const navigate = (item: SearchItem) => {
    router.push(item.href)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
    if (e.key === 'Enter')      { if (results[cursor]) navigate(results[cursor]) }
    if (e.key === 'Escape')     { onClose() }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="glass-card border border-white/[0.12] shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
                <Search className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar projetos, bugs, sprints..."
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                />
                <kbd className="hidden sm:block px-1.5 py-0.5 rounded text-[10px] bg-white/[0.07] border border-white/10 text-white/30">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto scrollbar-hide py-2">
                {results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-white/40 text-sm">Nenhum resultado para</p>
                    <p className="text-white/60 font-medium mt-1">&quot;{query}&quot;</p>
                  </div>
                ) : (
                  <>
                    <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                      {query ? 'Resultados' : 'Navegação rápida'}
                    </p>
                    {results.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(item)}
                        onMouseEnter={() => setCursor(i)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
                          cursor === i ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                        )}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: item.color + '20', color: item.color }}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/85 truncate">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-xs text-white/35 truncate">{item.subtitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-white/25">{TYPE_LABEL[item.type]}</span>
                          {cursor === i && <ArrowRight className="w-3 h-3 text-white/30" />}
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06]">
                {[
                  { keys: ['↑', '↓'], label: 'navegar' },
                  { keys: ['↵'], label: 'abrir' },
                  { keys: ['ESC'], label: 'fechar' },
                ].map(({ keys, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[10px] text-white/25">
                    {keys.map(k => (
                      <kbd key={k} className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white/35">{k}</kbd>
                    ))}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
