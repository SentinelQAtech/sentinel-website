import { ReportsClient } from '@/components/reports/reports-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return <ReportsClient />
}
