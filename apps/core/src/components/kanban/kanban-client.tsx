'use client'

import { useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn }              from './kanban-column'
import { KanbanTaskDialog }          from './kanban-task-dialog'
import { KanbanSettingsDialog }      from './kanban-settings-dialog'
import { KanbanTaskPreviewDialog }   from './kanban-task-preview-dialog'
import { Plus, Settings2 }           from 'lucide-react'
import { Button }                    from '@/components/ui/button'
import type { Task, TaskStatus, Priority } from '@/types'
import type { NewKanbanTask }        from './kanban-types'
import { useKanbanStore }            from '@/store/kanban'
import {
  useQAImporterStore,
  type QAItem, type QACategory, type QAPriority,
} from '@/store/qa-importer'

// ─── Converters ───────────────────────────────────────────

const DEFAULT_CREATOR = {
  id: '1', email: '', username: '', name: 'Raphael',
  role: 'ADMIN' as const, isActive: true, createdAt: '',
}

function qaItemToTask(item: QAItem): Task {
  return {
    id:          item.id,
    title:       item.issueKey ? `[${item.issueKey}] ${item.title}` : item.title,
    description: item.notes || item.description || undefined,
    status:      item.qaCategory as unknown as TaskStatus,
    priority:    mapPriority(item.priority),
    tags:        [item.client, item.sprint, item.type].filter(Boolean) as string[],
    storyPoints: mapPoints(item.priority),
    projectId:   item.project || item.client || 'qa',
    sprintId:    item.sprint,
    creatorId:   DEFAULT_CREATOR.id,
    creator:     DEFAULT_CREATOR,
    order:       0,
    createdAt:   item.importedAt,
    updatedAt:   item.importedAt,
  }
}

function mapPriority(p: QAPriority): Priority {
  if (p === 'Critical') return 'CRITICAL'
  if (p === 'High')     return 'HIGH'
  if (p === 'Low')      return 'LOW'
  return 'MEDIUM'
}

function mapPoints(p: QAPriority) {
  if (p === 'Critical') return 8
  if (p === 'High')     return 5
  if (p === 'Medium')   return 3
  if (p === 'Low')      return 1
  return undefined
}

function mapPriorityToQA(p: Priority): QAPriority {
  if (p === 'CRITICAL') return 'Critical'
  if (p === 'HIGH')     return 'High'
  if (p === 'LOW')      return 'Low'
  return 'Medium'
}

// ─── Component ────────────────────────────────────────────

export function KanbanClient() {
  const columns     = useKanbanStore(s => s.columns)
  const setColumns  = useKanbanStore(s => s.setColumns)
  const qaItems     = useQAImporterStore(s => s.items)
  const updateItem  = useQAImporterStore(s => s.updateItem)
  const importItems = useQAImporterStore(s => s.importItems)

  const [selectedTask,       setSelectedTask]       = useState<Task | null>(null)
  const [taskDialogOpen,     setTaskDialogOpen]     = useState(false)
  const [taskDialogStatus,   setTaskDialogStatus]   = useState<string>('Ready for QA')
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [previewDialogOpen,  setPreviewDialogOpen]  = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  // Convert QA items to Task[] for rendering
  const tasks = useMemo(() => qaItems.map(qaItemToTask), [qaItems])

  const getTasksByColumn = (columnId: string) =>
    tasks.filter(t => t.status === columnId)

  // ── Handlers ─────────────────────────────────────────────

  const openAddTask = (status: string = 'Ready for QA') => {
    setTaskDialogStatus(status)
    setTaskDialogOpen(true)
  }

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task)
    setPreviewDialogOpen(true)
  }

  const handleAddTask = (data: NewKanbanTask) => {
    importItems([{
      issueKey:   '',
      title:      data.title,
      client:     (data.tags?.[0] as string) || '',
      project:    '',
      status:     data.status,
      priority:   mapPriorityToQA(data.priority),
      sprint:     data.tags?.[1] as string || '',
      assignee:   '',
      type:       '',
      link:       '',
      notes:      '',
      source:     'manual',
      qaCategory: data.status as QACategory,
    }], 'manual')
  }

  const handleAddColumn = () => {
    setColumns(prev => [
      ...prev,
      { id: `CUSTOM_${Date.now()}`, label: `Nova coluna ${prev.length + 1}`, color: '#8b5cf6' },
    ])
  }

  const handleRenameColumn = (columnId: string, label: string) =>
    setColumns(prev => prev.map(col => col.id === columnId ? { ...col, label } : col))

  const handleDeleteColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column) return
    if (columns.length <= 1) {
      window.alert('O board precisa manter pelo menos uma coluna.')
      return
    }
    const columnTasks = tasks.filter(t => t.status === columnId)
    if (columnTasks.length > 0) {
      const confirmed = window.confirm(
        `A coluna "${column.label}" tem ${columnTasks.length} card(s). Excluir mesmo assim?`
      )
      if (!confirmed) return
    }
    const remaining = columns.filter(col => col.id !== columnId)
    const fallback  = remaining[0]?.id as QACategory
    if (fallback) {
      columnTasks.forEach(t => updateItem(t.id, { qaCategory: fallback }))
    }
    setColumns(remaining)
  }

  // ── Drag & Drop ───────────────────────────────────────────

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId   = over.id as string

    // Dragging over a column zone
    const overColumn = columns.find(c => c.id === overId)
    if (overColumn) {
      const activeTask = tasks.find(t => t.id === activeId)
      if (activeTask && activeTask.status !== overColumn.id) {
        updateItem(activeId, { qaCategory: overColumn.id as QACategory })
      }
      return
    }

    // Dragging over a card in a different column
    const overTask = tasks.find(t => t.id === overId)
    if (overTask) {
      const activeTask = tasks.find(t => t.id === activeId)
      if (activeTask && activeTask.status !== overTask.status) {
        updateItem(activeId, { qaCategory: overTask.status as unknown as QACategory })
      }
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    const activeId   = active.id as string
    const overId     = over.id as string
    const overColumn = columns.find(c => c.id === overId)
    const overTask   = tasks.find(t => t.id === overId)
    const target     = overColumn?.id ?? overTask?.status

    if (target) {
      updateItem(activeId, { qaCategory: target as QACategory })
    }
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col gap-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Board</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {qaItems.length} task{qaItems.length !== 1 ? 's' : ''} · arraste para mudar o status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings2 className="w-3.5 h-3.5" />}
            onClick={() => setSettingsDialogOpen(true)}
          >
            Colunas
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleAddColumn}
          >
            Nova coluna
          </Button>
          <Button
            variant="glow"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => openAddTask('Ready for QA')}
          >
            Nova task
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full min-h-[500px] pb-4 min-w-max">
            {columns.map(col => {
              const colTasks = getTasksByColumn(col.id)
              return (
                <SortableContext
                  key={col.id}
                  items={colTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    column={col}
                    tasks={colTasks}
                    count={colTasks.length}
                    onAddTask={openAddTask}
                    onOpenTask={handleOpenTask}
                    onRenameColumn={handleRenameColumn}
                    onDeleteColumn={handleDeleteColumn}
                  />
                </SortableContext>
              )
            })}
          </div>
        </DndContext>
      </div>

      {/* Modals */}
      <KanbanTaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        columns={columns}
        defaultStatus={taskDialogStatus}
        onAdd={handleAddTask}
      />
      <KanbanSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        columns={columns}
        onRenameColumn={handleRenameColumn}
        onAddColumn={handleAddColumn}
      />
      <KanbanTaskPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        task={selectedTask}
        columns={columns}
      />
    </div>
  )
}
