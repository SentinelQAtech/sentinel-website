import { KanbanClient } from '@/components/kanban/kanban-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Board' }

export default function BoardPage() {
  return <KanbanClient />
}
