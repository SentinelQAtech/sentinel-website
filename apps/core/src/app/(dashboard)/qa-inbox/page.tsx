import { TasksClient } from '@/components/qa-importer/qa-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'QA Inbox' }

export default function QAInboxPage() {
  return <TasksClient />
}
