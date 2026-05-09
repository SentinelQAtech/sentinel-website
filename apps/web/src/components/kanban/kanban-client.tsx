'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
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
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { Plus, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Task, TaskStatus } from '@/types'

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'BACKLOG',     label: 'Backlog',     color: '#475569' },
  { id: 'TODO',        label: 'To Do',       color: '#3b82f6' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#8b5cf6' },
  { id: 'QA_TESTING',  label: 'QA Testing',  color: '#06b6d4' },
  { id: 'REVIEW',      label: 'Review',      color: '#f59e0b' },
  { id: 'DONE',        label: 'Done',        color: '#10b981' },
]

const DEFAULT_CREATOR = {
  id: '1', email: '', username: '', name: 'Raphael',
  role: 'ADMIN' as const, isActive: true, createdAt: '',
}

const mockTasks: Task[] = [
  { id: 't1',  title: 'Setup authentication module',  status: 'DONE',        priority: 'HIGH',     storyPoints: 5,  projectId: '1', creatorId: '1', creator: DEFAULT_CREATOR, tags: ['auth', 'backend'],     order: 0, createdAt: '', updatedAt: '' },
  { id: 't2',  title: 'Design system token setup',    status: 'DONE',        priority: 'MEDIUM',   storyPoints: 3,  projectId: '1', creatorId: '1', creator: DEFAULT_CREATOR, tags: ['design'],              order: 1, createdAt: '', updatedAt: '' },
  { id: 't3',  title: 'Build Dashboard page',         status: 'IN_PROGRESS', priority: 'HIGH',     storyPoints: 8,  projectId: '1', creatorId: '1', creator: DEFAULT_CREATOR, tags: ['frontend'],            order: 0, createdAt: '', updatedAt: '' },
  { id: 't4',  title: 'Kanban drag & drop',           status: 'IN_PROGRESS', priority: 'HIGH',     storyPoints: 5,  projectId: '1', creatorId: '1', creator: { ...DEFAULT_CREATOR, name: 'Antonio', role: 'DEVELOPER' }, tags: ['frontend', 'dnd'], order: 1, createdAt: '', updatedAt: '' },
  { id: 't5',  title: 'Bug management module',        status: 'TODO',        priority: 'CRITICAL',  storyPoints: 13, projectId: '1', creatorId: '1', creator: DEFAULT_CREATOR, tags: ['bugs'],                order: 0, createdAt: '', updatedAt: '' },
  { id: 't6',  title: 'Sprint velocity chart',        status: 'TODO',        priority: 'MEDIUM',   storyPoints: 5,  projectId: '1', creatorId: '1', creator: { ...DEFAULT_CREATOR, name: 'Maria', role: 'QA_ANALYST' }, tags: ['charts'], order: 1, createdAt: '', updatedAt: '' },
  { id: 't7',  title: 'Write E2E test suite',         status: 'QA_TESTING',  priority: 'HIGH',     storyPoints: 8,  projectId: '1', creatorId: '1', creator: { ...DEFAULT_CREATOR, name: 'Maria', role: 'QA_ANALYST' }, tags: ['qa', 'e2e'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't8',  title: 'API rate limiting',            status: 'REVIEW',      priority: 'HIGH',     storyPoints: 5,  projectId: '1', creatorId: '1', creator: { ...DEFAULT_CREATOR, name: 'Antonio', role: 'DEVELOPER' }, tags: ['backend', 'api'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't9',  title: 'Notification system',          status: 'BACKLOG',     priority: 'LOW',      storyPoints: 8,  projectId: '1', creatorId: '1', creator: DEFAULT_CREATOR, tags: ['backend', 'realtime'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't10', title: 'Reports module',               status: 'BACKLOG',     priority: 'MEDIUM',   storyPoints: 13, projectId: '1', creatorId: '1', creator: DEFAULT_CREATOR, tags: ['reports'],             order: 1, createdAt: '', updatedAt: '' },
]

export function KanbanClient() {
  const [tasks, setTasks]           = useState<Task[]>(mockTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Dialog state
  const [taskDialogOpen, setTaskDialogOpen]       = useState(false)
  const [taskDialogStatus, setTaskDialogStatus]   = useState<TaskStatus>('TODO')
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const getTasksByColumn = (status: TaskStatus) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)

  // ── Dialog handlers ────────────────────────────────────────────

  const openAddTask = (status: TaskStatus = 'TODO') => {
    setTaskDialogStatus(status)
    setTaskDialogOpen(true)
  }

  const handleAddTask = (data: Pick<Task, 'title' | 'status' | 'priority' | 'tags' | 'storyPoints'>) => {
    const colTasks = tasks.filter(t => t.status === data.status)
    const newTask: Task = {
      id:        `t${Date.now()}`,
      title:     data.title,
      status:    data.status,
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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId   = over.id as string

    const draggedTask = tasks.find(t => t.id === activeId)
    if (!draggedTask) return

    // Dragging over a column droppable zone
    const overColumn = COLUMNS.find(c => c.id === overId)
    if (overColumn) {
      if (draggedTask.status !== overColumn.id) {
        setTasks(prev =>
          prev.map(t => t.id === activeId ? { ...t, status: overColumn.id } : t)
        )
      }
      return
    }

    // Dragging over a card in a different column → move to that column
    const overTask = tasks.find(t => t.id === overId)
    if (overTask && overTask.status !== draggedTask.status) {
      setTasks(prev =>
        prev.map(t => t.id === activeId ? { ...t, status: overTask.status } : t)
      )
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId   = over.id as string

    const overColumn = COLUMNS.find(c => c.id === overId)
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
          <p className="text-sm text-white/40 mt-0.5">Sprint 14 · Sentinel Project Manager</p>
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
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full min-h-[500px] pb-4" style={{ minWidth: 'max-content' }}>
            {COLUMNS.map(col => {
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
                  />
                </SortableContext>
              )
            })}
          </div>

          <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
            {activeTask && <KanbanCard task={activeTask} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      <KanbanTaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        defaultStatus={taskDialogStatus}
        onAdd={handleAddTask}
      />
      <KanbanSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        columns={COLUMNS}
      />
    </div>
  )
}
