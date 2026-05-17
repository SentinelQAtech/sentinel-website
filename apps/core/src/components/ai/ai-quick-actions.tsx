'use client'

import { cn } from '@/lib/utils'

interface QuickAction {
  label:  string
  prompt: string
  emoji:  string
  color:  string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label:  'Resumir meu dia',
    prompt: 'Resuma meu dia de trabalho com base nas tarefas do Daily, itens QA e reuniões agendadas. Seja específico e prático.',
    emoji:  '☀️',
    color:  'text-amber-400 hover:border-amber-500/30',
  },
  {
    label:  'Prioridades QA',
    prompt: 'Quais são minhas prioridades QA mais urgentes agora? Liste em ordem de impacto e urgência.',
    emoji:  '🔬',
    color:  'text-violet-400 hover:border-violet-500/30',
  },
  {
    label:  'Checklist QA',
    prompt: 'Gere um checklist completo de QA para os itens pendentes de maior prioridade. Inclua cenários de teste e critérios de aceitação.',
    emoji:  '✅',
    color:  'text-emerald-400 hover:border-emerald-500/30',
  },
  {
    label:  'Riscos do Sprint',
    prompt: 'Analise os riscos do sprint atual com base nas tarefas do Daily e itens QA pendentes. O que pode atrasar a entrega?',
    emoji:  '⚠️',
    color:  'text-orange-400 hover:border-orange-500/30',
  },
  {
    label:  'Relatório Daily',
    prompt: 'Crie um relatório conciso das atividades de hoje para o Daily meeting. Inclua o que foi feito, o que será feito e bloqueios.',
    emoji:  '📋',
    color:  'text-sky-400 hover:border-sky-500/30',
  },
  {
    label:  'Ordem de execução',
    prompt: 'Com base nas minhas tarefas e prioridades, sugira a melhor ordem de execução das atividades de hoje. Justifique a sequência.',
    emoji:  '📌',
    color:  'text-primary hover:border-primary/30',
  },
  {
    label:  'Identificar bloqueios',
    prompt: 'Identifique todos os bloqueios, dependências e itens em risco no meu trabalho atual. O que precisa de atenção imediata?',
    emoji:  '🚧',
    color:  'text-red-400 hover:border-red-500/30',
  },
  {
    label:  'Plano de teste',
    prompt: 'Gere um plano de teste detalhado para os itens QA mais críticos. Inclua cenários positivos, negativos e edge cases.',
    emoji:  '🧪',
    color:  'text-cyan-400 hover:border-cyan-500/30',
  },
]

interface Props {
  onSelect:  (prompt: string) => void
  disabled?: boolean
}

export function AIQuickActions({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {QUICK_ACTIONS.map(action => (
        <button
          key={action.label}
          onClick={() => onSelect(action.prompt)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium',
            'bg-white/[0.03] border border-white/[0.07]',
            'transition-all duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            action.color,
          )}
        >
          <span className="text-[12px]">{action.emoji}</span>
          {action.label}
        </button>
      ))}
    </div>
  )
}
