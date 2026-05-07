import { SprintsClient } from '@/components/sprints/sprints-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sprints' }

export default function SprintsPage() {
  return <SprintsClient />
}
