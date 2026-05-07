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

const mockTasks: Task[] = [
  { id: 't1', title: 'Setup authentication module',    status: 'DONE',        priority: 'HIGH',   storyPoints: 5, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, tags: ['auth', 'backend'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't2', title: 'Design system token setup',      status: 'DONE',        priority: 'MEDIUM', storyPoints: 3, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, tags: ['design'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't3', title: 'Build Dashboard page',           status: 'IN_PROGRESS', priority: 'HIGH',   storyPoints: 8, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, tags: ['frontend'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't4', title: 'Kanban drag & drop',             status: 'IN_PROGRESS', priority: 'HIGH',   storyPoints: 5, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Antonio', role: 'DEVELOPER', isActive: true, createdAt: '' }, tags: ['frontend', 'dnd'], order: 1, createdAt: '', updatedAt: '' },
  { id: 't5', title: 'Bug management module',          status: 'TODO',        priority: 'CRITICAL',storyPoints: 13, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, tags: ['bugs'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't6', title: 'Sprint velocity chart',          status: 'TODO',        priority: 'MEDIUM', storyPoints: 5, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Maria', role: 'QA_ANALYST', isActive: true, createdAt: '' }, tags: ['charts'], order: 1, createdAt: '', updatedAt: '' },
  { id: 't7', title: 'Write E2E test suite',           status: 'QA_TESTING',  priority: 'HIGH',   storyPoints: 8, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Maria', role: 'QA_ANALYST', isActive: true, createdAt: '' }, tags: ['qa', 'e2e'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't8', title: 'API rate limiting',              status: 'REVIEW',      priority: 'HIGH',   storyPoints: 5, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Antonio', role: 'DEVELOPER', isActive: true, createdAt: '' }, tags: ['backend', 'api'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't9', title: 'Notification system',            status: 'BACKLOG',     priority: 'LOW',    storyPoints: 8, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, tags: ['backend', 'realtime'], order: 0, createdAt: '', updatedAt: '' },
  { id: 't10', title: 'Reports module',                status: 'BACKLOG',     priority: 'MEDIUM', storyPoints: 13, projectId: '1', creatorId: '1', creator: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, tags: ['reports'], order: 1, createdAt: '', updatedAt: '' },
]

export function KanbanClient() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const getTasksByColumn = (status: TaskStatus) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return
    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)

    if (!activeTask) return

    // Dropping over a column
    const overColumn = COLUMNS.find(c => c.id === overId)
    if (overColumn && activeTask.status !== overColumn.id) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: overColumn.id } : t))
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const overColumn = COLUMNS.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)

    if (!overTask && !overColumn) return

    const targetStatus = overColumn?.id ?? overTask?.status

    setTasks(prev => {
      const newTasks = prev.map(t =>
        t.id === activeId ? { ...t, status: targetStatus as TaskStatus } : t
      )

      if (overTask) {
        const colTasks = newTasks.filter(t => t.status === targetStatus)
        const oldIdx = colTasks.findIndex(t => t.id === activeId)
        const newIdx = colTasks.findIndex(t => t.id === overId)
        if (oldIdx !== newIdx) {
          const reordered = arrayMove(colTasks, oldIdx, newIdx).map((t, i) => ({ ...t, order: i }))
          return newTasks.map(t => reordered.find(r => r.id === t.id) ?? t)
        }
      }

      return newTasks
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
          <Button variant="outline" size="sm" leftIcon={<Settings2 className="w-3.5 h-3.5" />}>
            Board Settings
          </Button>
          <Button variant="glow" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
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
                  />
                </SortableContext>
              )
            })}
          </div>

          <DragOverlay>
            {activeTask && <KanbanCard task={activeTask} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
