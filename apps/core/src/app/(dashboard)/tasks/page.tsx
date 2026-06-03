import { ClipboardList } from 'lucide-react'
import { TasksClient } from '@/components/qa-importer/qa-client'

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tasks</h1>
            <p className="text-xs text-white/35 mt-0.5">
              Gerencie, organize e envie suas tasks para execução no Daily.
            </p>
          </div>
        </div>
      </div>

      <TasksClient />
    </div>
  )
}
