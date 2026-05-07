'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search, Brain,
  LayoutDashboard, CheckSquare, ClipboardCheck,
  CalendarDays, BarChart3, Layers, ArrowRight, Kanban,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAIStore } from '@/store/ai'
import { useSentinelAI } from '@/hooks/useSentinelAI'

interface Command {
  id:           string
  type:         'navigate' | 'ai'
  label:        string
  description?: string
  icon:         React.ReactNode
  href?:        string
  prompt?:      string
}

const NAV_COMMANDS: Command[] = [
  { id: 'nav-dashboard', type: 'navigate', label: 'Dashboard',    icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard'   },
  { id: 'nav-daily',     type: 'navigate', label: 'Daily',        icon: <CheckSquare     className="w-4 h-4" />, href: '/daily'       },
  { id: 'nav-qa',        type: 'navigate', label: 'QA Importer',  icon: <ClipboardCheck  className="w-4 h-4" />, href: '/qa-importer' },
  { id: 'nav-calendar',  type: 'navigate', label: 'Calendar',     icon: <CalendarDays    className="w-4 h-4" />, href: '/calendar'    },
  { id: 'nav-kanban',    type: 'navigate', label: 'Kanban',       icon: <Kanban          className="w-4 h-4" />, href: '/kanban'      },
  { id: 'nav-reports',   type: 'navigate', label: 'Reports',      icon: <BarChart3       className="w-4 h-4" />, href: '/reports'     },
  { id: 'nav-sprints',   type: 'navigate', label: 'Sprints',      icon: <Layers          className="w-4 h-4" />, href: '/sprints'     },
]

const AI_COMMANDS: Command[] = [
  { id: 'ai-day',      type: 'ai', description: 'AI', label: 'Resumir meu dia',         icon: <Brain className="w-4 h-4" />, prompt: 'Resuma meu dia de trabalho com base nas tarefas do Daily, itens QA e reuniões. Seja específico e prático.' },
  { id: 'ai-qa',       type: 'ai', description: 'AI', label: 'Prioridades QA',           icon: <Brain className="w-4 h-4" />, prompt: 'Quais são minhas prioridades QA mais urgentes agora? Liste em ordem de impacto e urgência.' },
  { id: 'ai-checklist',type: 'ai', description: 'AI', label: 'Gerar checklist QA',       icon: <Brain className="w-4 h-4" />, prompt: 'Gere um checklist completo de QA para os itens pendentes de maior prioridade.' },
  { id: 'ai-report',   type: 'ai', description: 'AI', label: 'Relatório do Daily',       icon: <Brain className="w-4 h-4" />, prompt: 'Crie um relatório conciso das atividades de hoje para o Daily meeting.' },
  { id: 'ai-blockers', type: 'ai', description: 'AI', label: 'Identificar bloqueios',    icon: <Brain className="w-4 h-4" />, prompt: 'Identifique todos os bloqueios e itens em risco no trabalho atual.' },
  { id: 'ai-sprint',   type: 'ai', description: 'AI', label: 'Riscos do Sprint',         icon: <Brain className="w-4 h-4" />, prompt: 'Analise os riscos do sprint atual com base nas tarefas e QA pendentes.' },
  { id: 'ai-order',    type: 'ai', description: 'AI', label: 'Ordem de execução',        icon: <Brain className="w-4 h-4" />, prompt: 'Sugira a melhor ordem de execução das minhas tarefas de hoje. Justifique.' },
  { id: 'ai-testplan', type: 'ai', description: 'AI', label: 'Gerar plano de teste',     icon: <Brain className="w-4 h-4" />, prompt: 'Gere um plano de teste detalhado para os itens QA críticos.' },
]

const ALL_COMMANDS = [...NAV_COMMANDS, ...AI_COMMANDS]

export function CommandPalette() {
  const { isPaletteOpen, closePalette, openPanel } = useAIStore()
  const { send } = useSentinelAI()
  const router = useRouter()

  const [query,  setQuery]  = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        useAIStore.getState().togglePalette()
      }
      if (e.key === 'Escape') useAIStore.getState().closePalette()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Reset state on open
  useEffect(() => {
    if (isPaletteOpen) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isPaletteOpen])

  const filtered = query.trim()
    ? ALL_COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_COMMANDS

  const execute = useCallback(async (cmd: Command) => {
    closePalette()
    if (cmd.type === 'navigate' && cmd.href) {
      router.push(cmd.href)
    } else if (cmd.type === 'ai' && cmd.prompt) {
      openPanel()
      setTimeout(() => send(cmd.prompt!), 350)
    }
  }, [closePalette, router, openPanel, send])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && filtered[active]) execute(filtered[active])
  }

  return (
    <AnimatePresence>
      {isPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[18%] left-1/2 -translate-x-1/2 z-[71] w-[540px] max-w-[95vw]"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background:  'rgba(8,12,20,0.98)',
                border:      '1px solid rgba(99,102,241,0.22)',
                boxShadow:   '0 30px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,102,241,0.08), 0 0 80px rgba(99,102,241,0.06)',
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <Search className="w-4 h-4 text-white/30 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setActive(0) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Navegar ou perguntar ao Sentinel AI…"
                  className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20 outline-none"
                />
                <kbd className="text-[10px] text-white/20 px-1.5 py-0.5 rounded border border-white/[0.08] font-mono">ESC</kbd>
              </div>

              {/* Section: Navigation */}
              {!query && (
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/20">
                  Navegação
                </p>
              )}

              {/* Results */}
              <div className="max-h-72 overflow-y-auto pb-2">
                {filtered.length === 0 ? (
                  <p className="text-xs text-white/30 text-center py-8">Nenhum resultado</p>
                ) : (
                  <>
                    {filtered.map((cmd, i) => {
                      // Show AI section header
                      const prevIsNav = i > 0 && filtered[i - 1].type === 'navigate'
                      const isFirstAI = cmd.type === 'ai' && (i === 0 || prevIsNav)

                      return (
                        <div key={cmd.id}>
                          {isFirstAI && !query && (
                            <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/20">
                              Sentinel AI
                            </p>
                          )}
                          <button
                            onClick={() => execute(cmd)}
                            onMouseEnter={() => setActive(i)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
                              active === i ? 'bg-primary/10' : 'hover:bg-white/[0.03]',
                            )}
                          >
                            <span className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                              cmd.type === 'ai'
                                ? 'bg-primary/15 text-primary'
                                : 'bg-white/[0.07] text-white/45',
                            )}>
                              {cmd.icon}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="text-sm text-white/80 font-medium">{cmd.label}</span>
                              {cmd.description && (
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                                  {cmd.description}
                                </span>
                              )}
                            </span>
                            {active === i && (
                              <ArrowRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-white/20">
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono px-1 border border-white/[0.08] rounded">↑↓</kbd> navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono px-1 border border-white/[0.08] rounded">↵</kbd> executar
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                  <Brain className="w-3 h-3 text-primary/50" />
                  <span>Sentinel AI · Ctrl+K</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
