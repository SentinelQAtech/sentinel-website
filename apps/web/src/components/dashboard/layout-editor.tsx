'use client'

import { useState, useCallback } from 'react'
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
  GripVertical,
  Eye,
  EyeOff,
  RotateCcw,
  X,
  Check,
  LayoutDashboard,
  TrendingUp,
  Cpu,
  Bug,
  Target,
  FolderOpen,
  Users,
  AlertTriangle,
  Activity,
  CalendarDays,
  FlaskConical,
  ClipboardCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardLayoutStore, type WidgetConfig } from '@/store/dashboard-layout'

const WIDGET_META: Record<string, { label: string; description: string; icon: React.ElementType }> = {
  'daily':           { label: 'Tarefas do Dia',    description: 'Daily tasks e reuniões de hoje',       icon: Target },
  'metrics':         { label: 'Métricas',           description: 'KPIs, contadores e indicadores',      icon: TrendingUp },
  'sentinel-ai':     { label: 'Sentinel AI',        description: 'Widget de acesso rápido à IA',        icon: Cpu },
  'bug-trend':       { label: 'Bug Trend',          description: 'Gráfico de tendência de bugs',        icon: Bug },
  'sprint':          { label: 'Sprint Progress',    description: 'Progresso e burndown do sprint atual', icon: Target },
  'active-projects': { label: 'Projetos Ativos',    description: 'Status dos projetos em andamento',    icon: FolderOpen },
  'team-presence':   { label: 'Presença do Time',   description: 'Quem está online agora',              icon: Users },
  'critical-bugs':   { label: 'Bugs Críticos',      description: 'Bugs de alta severidade abertos',     icon: AlertTriangle },
  'recent-activity': { label: 'Atividade Recente',  description: 'Últimas ações no sistema',            icon: Activity },
  'calendar':        { label: 'Calendário',          description: 'Próximos eventos e reuniões',         icon: CalendarDays },
  'qa-today':        { label: 'QA de Hoje',          description: 'Items de QA pendentes para hoje',    icon: FlaskConical },
  'qa-quick-action': { label: 'QA Quick Action',     description: 'Card de sync rápido do QA Importer', icon: ClipboardCheck },
}

interface SortableItemProps {
  widget:   WidgetConfig
  onToggle: () => void
}

function SortableItem({ widget, onToggle }: SortableItemProps) {
  const meta = WIDGET_META[widget.id]
  const Icon = meta?.icon ?? LayoutDashboard

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 transition-colors',
        isDragging
          ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10 z-50 opacity-80'
          : widget.visible
            ? 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12]'
            : 'border-white/[0.04] bg-transparent opacity-50'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors touch-none shrink-0"
        tabIndex={-1}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Icon */}
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
        widget.visible ? 'bg-primary/10 text-primary-400' : 'bg-white/5 text-white/20'
      )}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', widget.visible ? 'text-white' : 'text-white/30')}>
          {meta?.label ?? widget.id}
        </p>
        <p className="text-xs text-white/30 truncate">{meta?.description}</p>
      </div>

      {/* Toggle visibility */}
      <button
        onClick={onToggle}
        className={cn(
          'shrink-0 rounded-lg p-1.5 transition-colors',
          widget.visible
            ? 'text-white/40 hover:text-white/80 hover:bg-white/5'
            : 'text-white/20 hover:text-white/50 hover:bg-white/5'
        )}
        title={widget.visible ? 'Ocultar widget' : 'Mostrar widget'}
      >
        {widget.visible
          ? <Eye    className="h-4 w-4" />
          : <EyeOff className="h-4 w-4" />
        }
      </button>
    </div>
  )
}

interface LayoutEditorProps {
  userId: string
  open:   boolean
  onClose: () => void
}

export function LayoutEditor({ userId, open, onClose }: LayoutEditorProps) {
  const { getLayout, toggleWidget, reorderWidgets, resetLayout } = useDashboardLayoutStore()

  const widgets  = getLayout(userId)
  const visible  = widgets.filter(w => w.visible).length
  const sensors  = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [justSaved, setJustSaved] = useState(false)

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = widgets.findIndex(w => w.id === active.id)
    const to   = widgets.findIndex(w => w.id === over.id)
    if (from !== -1 && to !== -1) reorderWidgets(userId, from, to)
  }, [widgets, userId, reorderWidgets])

  const handleSave = () => {
    setJustSaved(true)
    setTimeout(() => { setJustSaved(false); onClose() }, 800)
  }

  const handleReset = () => resetLayout(userId)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0,      opacity: 1 }}
            exit={{   x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-white/[0.07] bg-surface-950/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <LayoutDashboard className="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Personalizar Layout</p>
                  <p className="text-xs text-white/30">{visible} de {widgets.length} widgets visíveis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Instructions */}
            <div className="px-5 py-3 border-b border-white/[0.04]">
              <p className="text-xs text-white/30 leading-relaxed">
                Arraste para reordenar · Clique no olho para ocultar
              </p>
            </div>

            {/* Sortable list */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={widgets.map(w => w.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {widgets.map(widget => (
                      <SortableItem
                        key={widget.id}
                        widget={widget}
                        onToggle={() => toggleWidget(userId, widget.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-4 py-4 space-y-2">
              <button
                onClick={handleSave}
                className={cn(
                  'w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
                  justSaved
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-primary text-white hover:bg-primary-600 glow'
                )}
              >
                {justSaved
                  ? <><Check className="h-4 w-4" /> Salvo!</>
                  : 'Salvar layout'
                }
              </button>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restaurar padrão
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
