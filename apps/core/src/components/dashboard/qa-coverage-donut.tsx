'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { QA_CATEGORY_CONFIG } from '@/store/qa-importer'
import { useQAItems } from '@/hooks/useQAItems'
import type { QACategory } from '@/store/qa-importer'

const SHOWN_CATEGORIES: QACategory[] = [
  'Ready for QA', 'In Testing', 'Bug Validation', 'Done', 'Blocked',
]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const { name, value, fill } = payload[0]
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <span className="flex items-center gap-1.5" style={{ color: fill }}>
        <span className="w-2 h-2 rounded-full" style={{ background: fill }} />
        {name}
      </span>
      <span className="font-bold text-white ml-3.5">{value} itens</span>
    </div>
  )
}

export function QACoverageDonut() {
  const { data: items = [] } = useQAItems()
  const total = items.length

  // Count per shown category
  const counts: { name: string; value: number; fill: string }[] = SHOWN_CATEGORIES.map(cat => ({
    name:  cat as string,
    value: items.filter(i => i.qaCategory === cat).length,
    fill:  QA_CATEGORY_CONFIG[cat].color,
  })).filter(d => d.value > 0)

  const other = total - counts.reduce((s, d) => s + d.value, 0)
  if (other > 0) {
    counts.push({ name: 'Outros', value: other, fill: QA_CATEGORY_CONFIG['Other'].color })
  }

  const doneCount = items.filter(i => i.qaCategory === 'Done').length
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <div className="glass-card border border-white/[0.07] p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
          <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/85">QA Coverage</h3>
          <p className="text-[10px] text-white/35">{total} itens · {pct}% concluídos</p>
        </div>
      </div>

      {/* Chart + legend */}
      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-white/25 italic">Nenhum item importado</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col items-center">
          {/* Donut */}
          <div className="relative w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={counts}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {counts.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white tabular-nums">{total}</span>
              <span className="text-[10px] text-white/35">itens</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full shrink-0 grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
            {counts.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill }} />
                <span className="text-[10px] text-white/50 truncate">{d.name}</span>
                <span className="text-[10px] font-bold text-white/70 ml-auto shrink-0">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
