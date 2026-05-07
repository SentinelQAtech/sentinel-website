'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { type QAItem, QA_CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/store/qa-importer'
import { CheckSquare, FlaskConical, Zap, AlertCircle, ShieldAlert, Send } from 'lucide-react'

interface Props { items: QAItem[] }

interface StatCard {
  label:   string
  value:   number
  color:   string
  bg:      string
  border:  string
  glow:    string
  icon:    React.ReactNode
}

export function QASummaryCards({ items }: Props) {
  const stats = useMemo(() => ({
    total:       items.length,
    readyForQA:  items.filter(i => i.qaCategory === 'Ready for QA').length,
    inTesting:   items.filter(i => i.qaCategory === 'In Testing').length,
    blocked:     items.filter(i => i.qaCategory === 'Blocked').length,
    critical:    items.filter(i => i.priority === 'Critical' || i.priority === 'High').length,
    sentToDaily: items.filter(i => i.sentToDaily).length,
  }), [items])

  const cards: StatCard[] = [
    {
      label: 'Total QA Items', value: stats.total,
      color: '#6366f1', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20',
      glow: 'hover:shadow-[0_0_24px_rgba(99,102,241,0.12)]',
      icon: <FlaskConical className="w-4 h-4" />,
    },
    {
      label: 'Ready for QA', value: stats.readyForQA,
      color: QA_CATEGORY_CONFIG['Ready for QA'].color,
      bg: 'bg-indigo-500/10', border: 'border-indigo-500/20',
      glow: 'hover:shadow-[0_0_24px_rgba(99,102,241,0.12)]',
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      label: 'In Testing', value: stats.inTesting,
      color: QA_CATEGORY_CONFIG['In Testing'].color,
      bg: 'bg-cyan-500/10', border: 'border-cyan-500/20',
      glow: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.12)]',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      label: 'Blocked', value: stats.blocked,
      color: PRIORITY_CONFIG.High.color,
      bg: 'bg-amber-500/10', border: 'border-amber-500/20',
      glow: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]',
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      label: 'Critical / High', value: stats.critical,
      color: PRIORITY_CONFIG.Critical.color,
      bg: 'bg-red-500/10', border: 'border-red-500/20',
      glow: 'hover:shadow-[0_0_24px_rgba(239,68,68,0.12)]',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      label: 'Sent to Daily', value: stats.sentToDaily,
      color: '#10b981',
      bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
      glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]',
      icon: <Send className="w-4 h-4" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map(c => (
        <div
          key={c.label}
          className={cn(
            'relative glass-card p-4 border overflow-hidden transition-all duration-200 cursor-default',
            c.bg, c.border, c.glow,
          )}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: c.color + '50' }} />
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: c.color + 'aa' }}>
                {c.label}
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">{c.value}</p>
            </div>
            <div className="p-2 rounded-xl" style={{ backgroundColor: c.color + '20', color: c.color }}>
              {c.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
