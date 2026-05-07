import { BugsClient } from '@/components/bugs/bugs-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bug Tracker' }

export default function BugsPage() {
  return <BugsClient />
}
