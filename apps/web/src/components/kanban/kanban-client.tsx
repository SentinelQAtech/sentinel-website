'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { KanbanTaskDialog } from './kanban-task-dialog'
import { KanbanSettingsDialog } from './kanban-settings-dialog'
import { KanbanTaskPreviewDialog } from './kanban-task-preview-dialog'
import { Plus, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Task, TaskStatus } from '@/types'
import type { KanbanColumnDefinition, NewKanbanTask } from './kanban-types'

const INITIAL_COLUMNS: KanbanColumnDefinition[] = [
  { id: 'BACKLOG',     label: 'Backlog',     color: '#475569', isDefault: true },
  { id: 'TODO',        label: 'To Do',       color: '#3b82f6', isDefault: true },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#8b5cf6', isDefault: true },
  { id: 'QA_TESTING',  label: 'QA Testing',  color: '#06b6d4', isDefault: true },
  { id: 'REVIEW',      label: 'Review',      color: '#f59e0b', isDefault: true },
  { id: 'DONE',        label: 'Done',        color: '#10b981', isDefault: true },
]

const COLUMN_COLORS = ['#14b8a6', '#ec4899', '#f97316', '#84cc16', '#0ea5e9', '#a855f7']

const DEFAULT_CREATOR = {
  id: '1', email: '', username: '', name: 'Raphael',
  role: 'ADMIN' as const, isActive: true, createdAt: '',
}

const initialTasks: Task[] = []

export function KanbanClient() {
  const [columns, setColumns]       = useState<KanbanColumnDefinition[]>(INITIAL_COLUMNS)
  const [tasks, setTasks]           = useState<Task[]>(initialTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Dialog state
  const [taskDialogOpen, setTaskDialogOpen]       = useState(false)
  const [taskDialogStatus, setTaskDialogStatus]   = useState<string>('TODO')
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const getTasksByColumn = (status: string) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)

  // ── Dialog handlers ────────────────────────────────────────────

  const openAddTask = (status: string = 'TODO') => {
    setTaskDialogStatus(status)
    setTaskDialogOpen(true)
  }

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task)
    setPreviewDialogOpen(true)
  }

  const handleAddColumn = () => {
    setColumns(prev => {
      const next = prev.length + 1
      return [
        ...prev,
        {
          id: `CUSTOM_${Date.now()}`,
          label: `Nova coluna ${next}`,
          color: COLUMN_COLORS[prev.length % COLUMN_COLORS.length],
        },
      ]
    })
  }

  const handleRenameColumn = (columnId: string, label: string) => {
    setColumns(prev => prev.map(col => col.id === columnId ? { ...col, label } : col))
  }

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
        `A coluna "${column.label}" tem ${columnTasks.length} card(s). Ao excluir, eles serao movidos para a primeira coluna restante. Deseja continuar?`
      )
      if (!confirmed) return
    }

    const remainingColumns = columns.filter(col => col.id !== columnId)
    const fallbackStatus = remainingColumns[0]?.id

    setColumns(remainingColumns)
    if (fallbackStatus) {
      setTasks(prev => prev.map(t =>
        t.status === columnId ? { ...t, status: fallbackStatus as TaskStatus } : t
      ))
    }
  }

  const handleAddTask = (data: NewKanbanTask) => {
    const colTasks = tasks.filter(t => t.status === data.status)
    const newTask: Task = {
      id:        `t${Date.now()}`,
      title:     data.title,
      status:    data.status as TaskStatus,
      priority:  data.priority,
      tags:      data.tags,
      storyPoints: data.storyPoints,
      projectId: '1',
      creatorId: '1',
      creator:   DEFAULT_CREATOR,
      order:     colTasks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks(prev => [...prev, newTask])
  }

  // ── Drag & Drop handlers ────────────────────────────────────────

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId   = over.id as string

    const draggedTask = tasks.find(t => t.id === activeId)
    if (!draggedTask) return

    // Dragging over a column droppable zone
    const overColumn = columns.find(c => c.id === overId)
    if (overColumn) {
      if (draggedTask.status !== overColumn.id) {
        setTasks(prev =>
          prev.map(t => t.id === activeId ? { ...t, status: overColumn.id as TaskStatus } : t)
        )
      }
      return
    }

    // Dragging over a card in a different column → move to that column
    const overTask = tasks.find(t => t.id === overId)
    if (overTask && overTask.status !== draggedTask.status) {
      setTasks(prev =>
        prev.map(t => t.id === activeId ? { ...t, status: overTask.status as TaskStatus } : t)
      )
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId   = over.id as string

    const overColumn = columns.find(c => c.id === overId)
    const overTask   = tasks.find(t => t.id === overId)

    if (!overTask && !overColumn) return

    const targetStatus = overColumn?.id ?? overTask?.status

    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === activeId ? { ...t, status: targetStatus as TaskStatus } : t
      )
      // Reorder within column if dropped on another card
      if (overTask) {
        const colTasks = updated.filter(t => t.status === targetStatus)
        const oldIdx   = colTasks.findIndex(t => t.id === activeId)
        const newIdx   = colTasks.findIndex(t => t.id === overId)
        if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
          const reordered = arrayMove(colTasks, oldIdx, newIdx).map((t, i) => ({ ...t, order: i }))
          return updated.map(t => reordered.find(r => r.id === t.id) ?? t)
        }
      }
      return updated
    })
  }

  return (
    <div className="h-full flex flex-col gap-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
          <p className="text-sm text-white/40 mt-0.5">Workspace operacional</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings2 className="w-3.5 h-3.5" />}
            onClick={() => setSettingsDialogOpen(true)}
          >
            Board Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleAddColumn}
          >
            Add Column
          </Button>
          <Button
            variant="glow"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => openAddTask('TODO')}
          >
            Add Task
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
          <div className="flex gap-4 h-full min-h-[500px] pb-4" style={{ minWidth: 'max-content' }}>
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
