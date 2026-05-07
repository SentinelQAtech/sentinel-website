'use client'

import { useCallback } from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useDashboardLayoutStore,
  type WidgetConfig,
  type WidgetSize,
} from '@/store/dashboard-layout'

// Full-width widgets — no size selector
const FULL_WIDTH_IDS = new Set(['daily', 'metrics', 'sentinel-ai'])

const WIDGET_META: Record<string, { label: string; icon: React.ElementType }> = {
  'daily':           { label: 'Daily de Hoje',   icon: Target        },
  'metrics':         { label: 'Métricas',         icon: TrendingUp    },
  'sentinel-ai':     { label: 'Sentinel AI',      icon: Cpu           },
  'bug-trend':       { label: 'Bug Trend',        icon: Bug           },
  'sprint':          { label: 'Sprint Progress',  icon: Target        },
  'active-projects': { label: 'Projetos Ativos',  icon: FolderOpen    },
  'team-presence':   { label: 'Presença do Time', icon: Users         },
  'critical-bugs':   { label: 'Bugs Críticos',    icon: AlertTriangle },
  'recent-activity': { label: 'Atividade Recente',icon: Activity      },
  'calendar':        { label: 'Calendário',        icon: CalendarDays  },
  'qa-today':        { label: 'QA de Hoje',        icon: FlaskConical  },
  'qa-quick-action': { label: 'QA Quick Action',   icon: ClipboardCheck},
}

const SIZES: { value: WidgetSize; label: string; tip: string }[] = [
  { value: 'sm',   label: '¼',    tip: '3 colunas'  },
  { value: 'md',   label: '⅓',    tip: '4 colunas'  },
  { value: 'lg',   label: '½',    tip: '6 colunas'  },
  { value: 'xl',   label: '⅔',    tip: '8 colunas'  },
  { value: 'full', label: '■',    tip: 'Largura toda'},
]

interface SortableItemProps {
  widget:        WidgetConfig
  onToggle:      () => void
  onSizeChange:  (size: WidgetSize) => void
}

function SortableItem({ widget, onToggle, onSizeChange }: SortableItemProps) {
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

      {/* Size selector — only for grid widgets */}
      {!isFullWidth && (
        <div className="flex items-center gap-1 px-2.5 pb-2.5">
          <span className="text-[10px] text-white/20 mr-1">Tamanho</span>
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
  const { getLayout, toggleWidget, setWidgetSize, reorderWidgets, resetLayout } = useDashboardLayoutStore()

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
    if (from !== -1 && to !== -1) reorderWidgets(userId, from, to)
  }, [widgets, userId, reorderWidgets])

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
                <p className="text-[10px] text-white/30">{visible}/{widgets.length} visíveis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Hint */}
          <p className="px-4 py-2 text-[10px] text-white/25 border-b border-white/[0.04] shrink-0">
            Arraste · Olho para ocultar · Botões de tamanho para grid
          </p>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                  {widgets.map(widget => (
                    <SortableItem
                      key={widget.id}
                      widget={widget}
                      onToggle={() => toggleWidget(userId, widget.id)}
                      onSizeChange={(size) => setWidgetSize(userId, widget.id, size)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.06] px-3 py-3 shrink-0">
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
