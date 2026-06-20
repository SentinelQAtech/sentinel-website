'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ArrowRight, ShieldAlert, Zap, AlertCircle, FlaskConical, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PRIORITY_ORDER } from '@/store/qa-importer'
import { useQAItems } from '@/hooks/useQAItems'
import { cn } from '@/lib/utils'

export function QATodayWidget() {
  const { data: items = [] } = useQAItems()

  const stats = useMemo(() => {
    const active = items.filter(i => i.qaCategory !== 'Done')
    return {
      readyForQA:  items.filter(i => i.qaCategory === 'Ready for QA').length,
      inTesting:   items.filter(i => i.qaCategory === 'In Testing').length,
      blocked:     items.filter(i => i.qaCategory === 'Blocked').length,
      critical:    items.filter(i => i.priority === 'Critical').length,
      done:        items.filter(i => i.qaCategory === 'Done').length,
      top: active
        .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
        .at(0) ?? null,
    }
  }, [items])

  const statRows = [
    { label: 'Ready for QA', value: stats.readyForQA, color: '#6366f1', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { label: 'In Testing',   value: stats.inTesting,  color: '#06b6d4', icon: <Zap className="w-3.5 h-3.5" />          },
    { label: 'Blocked',      value: stats.blocked,    color: '#f59e0b', icon: <AlertCircle className="w-3.5 h-3.5" />   },
    { label: 'Critical',     value: stats.critical,   color: '#ef4444', icon: <ShieldAlert className="w-3.5 h-3.5" />   },
    { label: 'Done',         value: stats.done,       color: '#10b981', icon: <CheckCircle className="w-3.5 h-3.5" />   },
  ]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <FlaskConical className="w-3 h-3 text-primary" />
          </div>
          <CardTitle>QA Today</CardTitle>
        </div>
        <Link
          href="/qa-inbox"
          className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors duration-150"
        >
          QA Inbox
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-2 flex-1">
        {/* Stats grid */}
        <div className="grid grid-cols-5 gap-2">
          {statRows.map(row => (
            <div key={row.label} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: row.color + '18', color: row.color }}
              >
                {row.icon}
              </div>
              <p className="text-lg font-bold text-white tabular-nums">{row.value}</p>
              <p className="text-[9px] text-white/30 text-center leading-tight">{row.label}</p>
            </div>
          ))}
        </div>

        {/* Top priority item */}
        {stats.top ? (
          <div
            className={cn(
              'p-3 rounded-xl border',
              stats.top.priority === 'Critical'
                ? 'bg-red-500/10 border-red-500/25'
                : 'bg-white/[0.03] border-white/[0.08]',
            )}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">
                  Top Prioridade
                </p>
                <p className="text-xs font-medium text-white/80 leading-snug truncate">{stats.top.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-white/35">
                  {stats.top.issueKey && <span className="font-mono">{stats.top.issueKey}</span>}
                  {stats.top.client   && <span>{stats.top.client}</span>}
                  <span
                    className="font-semibold"
                    style={{ color: stats.top.priority === 'Critical' ? '#ef4444' : '#f97316' }}
                  >
                    {stats.top.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
            <p className="text-xs text-white/25">Nenhum item QA pendente</p>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/qa-inbox"
          className={cn(
            'mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl',
            'border border-primary/25 bg-primary/10 text-xs font-semibold text-primary',
            'hover:bg-primary/20 hover:border-primary/40 transition-all duration-200',
          )}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Abrir QA Inbox
        </Link>
      </CardContent>
    </Card>
  )
}
