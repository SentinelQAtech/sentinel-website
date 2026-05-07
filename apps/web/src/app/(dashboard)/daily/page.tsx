import { DailyClient } from '@/components/daily/daily-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Daily Command Center' }

export default function DailyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <DailyClient />
    </div>
  )
}
