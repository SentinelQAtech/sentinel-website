import { ProjectsClient } from '@/components/projects/projects-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  return <ProjectsClient />
}
