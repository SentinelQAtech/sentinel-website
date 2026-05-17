import { KanbanClient } from '@/components/kanban/kanban-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kanban Board' }

export default function KanbanPage() {
  return <KanbanClient />
}
