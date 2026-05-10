'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical, Eye, EyeOff, RotateCcw, X,
  LayoutDashboard, TrendingUp, Cpu, Bug, Target,
  FolderOpen, Users, AlertTriangle, Activity,
  CalendarDays, FlaskConical, ClipboardCheck,
  Flame, GitBranch, PieChart,
  Download, Upload, Check, Save,
  Sun, ListTodo, Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useDashboardLayoutStore,
  type WidgetConfig,
  type WidgetSize,
  type WidgetHeight,
} from '@/store/dashboard-layout'

const FULL_WIDTH_IDS = new Set(['daily', 'metrics', 'sentinel-ai'])

const WIDGET_META: Record<string, { label: string; icon: React.ElementType }> = {
  'daily':            { label: 'Daily de Hoje',    icon: Target         },
  'daily-progress':   { label: 'Daily — Progresso', icon: Sun           },
  'daily-tasks':      { label: 'Daily — Tarefas',   icon: ListTodo      },
  'daily-meetings':   { label: 'Daily — Reuniões',  icon: Video         },
  'metrics':          { label: 'Métricas',          icon: TrendingUp     },
  'sentinel-ai':      { label: 'Sentinel AI',       icon: Cpu            },
  'bug-trend':        { label: 'Bug Trend',         icon: Bug            },
  'sprint':           { label: 'Sprint Progress',   icon: Target         },
  'active-projects':  { label: 'Projetos Ativos',   icon: FolderOpen     },
  'team-presence':    { label: 'Presença do Time',  icon: Users          },
  'critical-bugs':    { label: 'Bugs Críticos',     icon: AlertTriangle  },
  'recent-activity':  { label: 'Atividade Recente', icon: Activity       },
  'calendar':         { label: 'Calendário',         icon: CalendarDays   },
  'qa-today':          { label: 'QA de Hoje',         icon: FlaskConical   },
  'qa-quick-action':   { label: 'QA Quick Action',    icon: ClipboardCheck },
  'activity-heatmap':  { label: 'Heatmap Atividade',  icon: Flame          },
  'burndown':          { label: 'Burndown Chart',     icon: GitBranch      },
  'qa-donut':          { label: 'QA Coverage',        icon: PieChart       },
}

const SIZES: { value: WidgetSize; label: string; tip: string }[] = [
  { value: 'sm',   label: '¼', tip: '3 colunas'   },
  { value: 'md',   label: '⅓', tip: '4 colunas'   },
  { value: 'lg',   label: '½', tip: '6 colunas'   },
  { value: 'xl',   label: '⅔', tip: '8 colunas'   },
  { value: 'full', label: '■', tip: 'Largura toda' },
]

const HEIGHTS: { value: WidgetHeight; label: string; tip: string }[] = [
  { value: '1', label: '1', tip: 'Altura compacta'  },
  { value: '2', label: '2', tip: 'Altura média'     },
  { value: '3', label: '3', tip: 'Altura grande'    },
  { value: '4', label: '4', tip: 'Altura máxima'    },
]

const LAYOUT_PRESETS: { label: string; items: WidgetConfig[] }[] = [
  {
    label: 'Operacional',
    items: [
      { id: 'sentinel-ai', visible: true },
      { id: 'metrics', visible: true },
      { id: 'daily-progress', visible: true, size: 'md', height: '3' },
      { id: 'daily-tasks', visible: true, size: 'md', height: '3' },
      { id: 'daily-meetings', visible: true, size: 'md', height: '3' },
      { id: 'qa-quick-action', visible: true, size: 'sm', height: '4' },
      { id: 'qa-today', visible: true, size: 'sm', height: '4' },
      { id: 'critical-bugs', visible: true, size: 'sm', height: '4' },
      { id: 'calendar', visible: true, size: 'sm', height: '4' },
    ],
  },
  {
    label: 'QA Focus',
    items: [
      { id: 'sentinel-ai', visible: true },
      { id: 'qa-quick-action', visible: true, size: 'lg', height: '4' },
      { id: 'qa-today', visible: true, size: 'md', height: '4' },
      { id: 'critical-bugs', visible: true, size: 'md', height: '3' },
      { id: 'qa-donut', visible: true, size: 'md', height: '3' },
      { id: 'bug-trend', visible: true, size: 'xl', height: '3' },
      { id: 'daily-progress', visible: true, size: 'md', height: '3' },
    ],
  },
  {
    label: 'Gestao',
    items: [
      { id: 'sentinel-ai', visible: true },
      { id: 'metrics', visible: true },
      { id: 'active-projects', visible: true, size: 'lg', height: '4' },
      { id: 'team-presence', visible: true, size: 'md', height: '4' },
      { id: 'sprint', visible: true, size: 'md', height: '3' },
      { id: 'burndown', visible: true, size: 'lg', height: '3' },
      { id: 'activity-heatmap', visible: true, size: 'lg', height: '3' },
    ],
  },
  {
    label: 'Daily',
    items: [
      { id: 'daily', visible: true },
      { id: 'daily-progress', visible: true, size: 'md', height: '3' },
      { id: 'daily-tasks', visible: true, size: 'lg', height: '4' },
      { id: 'daily-meetings', visible: true, size: 'md', height: '4' },
      { id: 'calendar', visible: true, size: 'md', height: '3' },
      { id: 'qa-quick-action', visible: true, size: 'md', height: '3' },
    ],
  },
]

interface SortableItemProps {
  widget:         WidgetConfig
  onToggle:       () => void
  onSizeChange:   (size: WidgetSize) => void
  onHeightChange: (height: WidgetHeight) => void
}

function SortableItem({ widget, onToggle, onSizeChange, onHeightChange }: SortableItemProps) {
  const meta = WIDGET_META[widget.id]
  const Icon = meta?.icon ?? LayoutDashboard
  const isFullWidth = FULL_WIDTH_IDS.has(widget.id)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-xl border transition-colors',
        isDragging
          ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10 z-50 opacity-80'
          : widget.visible
            ? 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12]'
            : 'border-white/[0.04] bg-transparent opacity-50'
      )}
    >
      {/* Main row */}
      <div className="flex items-center gap-2.5 p-2.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors touch-none shrink-0"
          tabIndex={-1}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
          widget.visible ? 'bg-primary/10 text-primary-400' : 'bg-white/5 text-white/20'
        )}>
          <Icon className="h-3.5 w-3.5" />
        </div>

        <p className={cn('flex-1 text-sm font-medium truncate', widget.visible ? 'text-white' : 'text-white/30')}>
          {meta?.label ?? widget.id}
        </p>

        <button
          onClick={onToggle}
          className={cn(
            'shrink-0 rounded-lg p-1.5 transition-colors',
            widget.visible
              ? 'text-white/40 hover:text-white/80 hover:bg-white/5'
              : 'text-white/20 hover:text-white/50 hover:bg-white/5'
          )}
          title={widget.visible ? 'Ocultar' : 'Mostrar'}
        >
          {widget.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Size + Height selectors — only for grid widgets */}
      {!isFullWidth && (
        <div className="px-2.5 pb-2.5 space-y-1.5">
          {/* Width */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/20 w-10 shrink-0">Largura</span>
            {SIZES.map(s => (
              <button
                key={s.value}
                onClick={() => onSizeChange(s.value)}
                title={s.tip}
                className={cn(
                  'flex-1 py-0.5 rounded text-[11px] font-medium transition-all',
                  widget.size === s.value
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-white/[0.04] text-white/25 border border-transparent hover:bg-white/[0.08] hover:text-white/50'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Height */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/20 w-10 shrink-0">Altura</span>
            {HEIGHTS.map(h => (
              <button
                key={h.value}
                onClick={() => onHeightChange(h.value)}
                title={h.tip}
                className={cn(
                  'flex-1 py-0.5 rounded text-[11px] font-medium transition-all',
                  widget.height === h.value
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'bg-white/[0.04] text-white/25 border border-transparent hover:bg-white/[0.08] hover:text-white/50'
                )}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface LayoutEditorProps {
  userId:  string
  open:    boolean
  onClose: () => void
}

export function LayoutEditor({ userId, open, onClose }: LayoutEditorProps) {
  const {
    getLayout, toggleWidget, setWidgetSize, setWidgetHeight,
    reorderWidgets, resetLayout, importLayout,
  } = useDashboardLayoutStore()

  const importRef   = useRef<HTMLInputElement>(null)
  const savedTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saved, setSaved] = useState(false)

  function flash() {
    setSaved(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSaved(false), 1800)
  }

  const widgets = getLayout(userId)
  const visible = widgets.filter(w => w.visible).length

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = widgets.findIndex(w => w.id === active.id)
    const to   = widgets.findIndex(w => w.id === over.id)
    if (from !== -1 && to !== -1) { reorderWidgets(userId, from, to); flash() }
  }, [widgets, userId, reorderWidgets])

  function handleExport() {
    const payload = JSON.stringify({ version: 1, userId, layout: widgets }, null, 2)
    const blob    = new Blob([payload], { type: 'application/json' })
    const url     = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href     = url
    a.download = `spm-dashboard-${userId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        const layout = Array.isArray(parsed) ? parsed : parsed?.layout
        if (Array.isArray(layout)) { importLayout(userId, layout); flash() }
      } catch {
        // invalid file — silently ignore
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.97 }}
          animate={{ opacity: 1, x: 0,  scale: 1    }}
          exit={{   opacity: 0, x: 24, scale: 0.97  }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={cn(
            'fixed right-4 top-16 z-50',
            'w-72 max-h-[calc(100vh-5rem)]',
            'flex flex-col rounded-2xl overflow-hidden',
            'border border-white/[0.09]',
            'bg-surface-900/90 backdrop-blur-xl',
            'shadow-2xl shadow-black/40',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <LayoutDashboard className="h-3.5 w-3.5 text-primary-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Personalizar Layout</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] text-white/30">{visible}/{widgets.length} visíveis</p>
                  <AnimatePresence>
                    {saved && (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-0.5 text-[10px] text-emerald-400"
                      >
                        <Check className="h-2.5 w-2.5" />
                        Salvo
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Save button — topo, fácil visualização */}
          <div className="px-3 pt-2.5 pb-2 border-b border-white/[0.06] shrink-0">
            <button
              onClick={flash}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all duration-200',
                saved
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/35'
              )}
            >
              {saved
                ? <><Check className="h-3 w-3" /> Salvo</>
                : <><Save className="h-3 w-3" /> Salvar Layout</>
              }
            </button>
          </div>

          {/* Hint */}
          <p className="px-4 py-1.5 text-[10px] text-white/20 border-b border-white/[0.04] shrink-0">
            Arraste · Olho para ocultar · Largura e Altura para grid
          </p>

          <div className="border-b border-white/[0.05] px-3 py-2.5 shrink-0">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/25">Presets</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LAYOUT_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => { importLayout(userId, preset.items); flash() }}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1.5 text-[11px] font-medium text-white/45 hover:border-primary/25 hover:bg-primary/10 hover:text-primary"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                  {widgets.map(widget => (
                    <SortableItem
                      key={widget.id}
                      widget={widget}
                      onToggle={() => { toggleWidget(userId, widget.id); flash() }}
                      onSizeChange={(size) => { setWidgetSize(userId, widget.id, size); flash() }}
                      onHeightChange={(height) => { setWidgetHeight(userId, widget.id, height); flash() }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.06] px-3 py-3 shrink-0 space-y-1.5">
            {/* Export / Import */}
            <div className="flex gap-1.5">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent hover:border-white/[0.08] transition-all"
              >
                <Download className="h-3 w-3" />
                Exportar
              </button>
              <button
                onClick={() => importRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent hover:border-white/[0.08] transition-all"
              >
                <Upload className="h-3 w-3" />
                Importar
              </button>
              <input
                ref={importRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            {/* Reset */}
            <button
              onClick={() => resetLayout(userId)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Restaurar padrão
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
