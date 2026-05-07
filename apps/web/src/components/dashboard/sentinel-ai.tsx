'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingDown, TrendingUp, AlertTriangle, Bug, ArrowRight, Cpu, Sparkles, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAIStore } from '@/store/ai'
import { useDailyStore } from '@/store/daily'
import { useQAImporterStore } from '@/store/qa-importer'

// ─── Dynamic insights from real store data ────────────────────

function useInsights() {
  const tasks   = useDailyStore(s => s.tasks)
  const qaItems = useQAImporterStore(s => s.items)

  return useMemo(() => {
    const insights = []

    const criticalTasks = tasks.filter(t => t.priority === 'Critical' && t.status !== 'done')
    const blockedTasks  = tasks.filter(t => t.status === 'blocked')
    const doneTasks     = tasks.filter(t => t.status === 'done')
    const completionPct = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0

    const criticalQA = qaItems.filter(i => i.priority === 'Critical' && i.qaCategory !== 'Done')
    const pendingQA  = qaItems.filter(i => !i.sentToDaily && i.qaCategory !== 'Done')
    const blockedQA  = qaItems.filter(i => i.qaCategory === 'Blocked')

    // QA critical items
    if (criticalQA.length > 0) {
      insights.push({
        id:     'qa-critical',
        icon:   Bug,
        color:  '#ef4444',
        border: 'border-red-500/20',
        ring:   'hover:border-red-500/35',
        metric: `${criticalQA.length} crítico${criticalQA.length > 1 ? 's' : ''}`,
        title:  'QA crítico pendente',
        detail: `${criticalQA.length} item${criticalQA.length > 1 ? 'ns' : ''} crítico${criticalQA.length > 1 ? 's' : ''} de QA aguardando validação.`,
        action: 'Prioridade máxima recomendada',
        type:   'danger',
      })
    } else {
      insights.push({
        id:     'qa-ok',
        icon:   TrendingUp,
        color:  '#10b981',
        border: 'border-emerald-500/20',
        ring:   'hover:border-emerald-500/35',
        metric: `${qaItems.length} itens`,
        title:  'QA sem críticos',
        detail: `${pendingQA.length} item${pendingQA.length !== 1 ? 'ns' : ''} QA pendente${pendingQA.length !== 1 ? 's' : ''}, nenhum crítico no momento.`,
        action: 'Continue as validações em andamento',
        type:   'success',
      })
    }

    // Daily completion
    insights.push({
      id:     'daily-progress',
      icon:   completionPct >= 50 ? TrendingUp : TrendingDown,
      color:  completionPct >= 50 ? '#10b981' : '#f59e0b',
      border: completionPct >= 50 ? 'border-emerald-500/20' : 'border-amber-500/20',
      ring:   completionPct >= 50 ? 'hover:border-emerald-500/35' : 'hover:border-amber-500/35',
      metric: `${completionPct}%`,
      title:  'Progresso do Daily',
      detail: `${doneTasks.length} de ${tasks.length} tarefas concluídas hoje.`,
      action: completionPct >= 80 ? 'Excelente ritmo — mantenha!' : 'Acelere tarefas de alta prioridade',
      type:   completionPct >= 50 ? 'success' : 'warning',
    })

    // Blocked items
    const totalBlocked = blockedTasks.length + blockedQA.length
    if (totalBlocked > 0) {
      insights.push({
        id:     'blockers',
        icon:   AlertTriangle,
        color:  '#8b5cf6',
        border: 'border-violet-500/20',
        ring:   'hover:border-violet-500/35',
        metric: `${totalBlocked} bloqueio${totalBlocked > 1 ? 's' : ''}`,
        title:  'Itens bloqueados',
        detail: `${blockedTasks.length} tarefas e ${blockedQA.length} itens QA estão bloqueados.`,
        action: 'Escale dependências imediatamente',
        type:   'info',
      })
    } else {
      insights.push({
        id:     'no-blockers',
        icon:   TrendingUp,
        color:  '#06b6d4',
        border: 'border-cyan-500/20',
        ring:   'hover:border-cyan-500/35',
        metric: 'Livre',
        title:  'Sem bloqueios',
        detail: 'Nenhuma tarefa ou item QA bloqueado no momento.',
        action: 'Fluxo de trabalho saudável',
        type:   'success',
      })
    }

    // Critical tasks
    if (criticalTasks.length > 0) {
      insights.push({
        id:     'critical-tasks',
        icon:   AlertTriangle,
        color:  '#f97316',
        border: 'border-orange-500/20',
        ring:   'hover:border-orange-500/35',
        metric: `${criticalTasks.length} urgente${criticalTasks.length > 1 ? 's' : ''}`,
        title:  'Tarefas críticas',
        detail: `${criticalTasks.length} tarefa${criticalTasks.length > 1 ? 's' : ''} crítica${criticalTasks.length > 1 ? 's' : ''} pendente${criticalTasks.length > 1 ? 's' : ''} no Daily.`,
        action: 'Execute antes das demais tarefas',
        type:   'warning',
      })
    } else {
      insights.push({
        id:     'workload',
        icon:   Cpu,
        color:  '#6366f1',
        border: 'border-primary/20',
        ring:   'hover:border-primary/35',
        metric: `${tasks.length} tarefas`,
        title:  'Carga do dia',
        detail: `${tasks.filter(t => t.status !== 'done').length} tarefas abertas distribuídas entre os clientes.`,
        action: 'Planejamento dentro do esperado',
        type:   'info',
      })
    }

    return insights.slice(0, 4)
  }, [tasks, qaItems])
}

// ─── Component ────────────────────────────────────────────────

export function SentinelAI() {
  const insights   = useInsights()
  const { openPanel } = useAIStore()

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-ai-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/85">Sentinel AI</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
              <Sparkles className="w-2.5 h-2.5" />
              Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-white/30">
            <Cpu className="w-3 h-3" />
            <span>{insights.length} insights ativos</span>
          </div>
          <button
            onClick={openPanel}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 transition-all duration-150"
          >
            <MessageSquare className="w-3 h-3" />
            Abrir AI
          </button>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={openPanel}
              className={cn(
                'group relative glass-card p-4 border overflow-hidden cursor-pointer',
                'hover:bg-white/[0.05] transition-all duration-200',
                insight.border, insight.ring
              )}
            >
              {/* Left accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                style={{ background: `linear-gradient(to bottom, ${insight.color}, ${insight.color}40)` }}
              />

              <div className="flex items-start justify-between gap-2 mb-3 pl-1">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: insight.color + '18', color: insight.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span
                  className="text-xs font-bold tabular-nums leading-none mt-0.5"
                  style={{ color: insight.color }}
                >
                  {insight.metric}
                </span>
              </div>

              <div className="pl-1">
                <p className="text-xs font-semibold text-white/80 leading-snug mb-1">{insight.title}</p>
                <p className="text-[11px] text-white/38 leading-relaxed">{insight.detail}</p>
              </div>

              <div className={cn(
                'flex items-center gap-1 mt-2.5 pl-1 text-[10px] font-medium',
                'max-h-0 overflow-hidden opacity-0',
                'group-hover:max-h-6 group-hover:opacity-100',
                'transition-all duration-200 ease-out'
              )} style={{ color: insight.color }}>
                <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                <span>{insight.action}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
