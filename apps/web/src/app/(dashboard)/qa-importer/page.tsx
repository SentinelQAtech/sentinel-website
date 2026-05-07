import { ClipboardCheck } from 'lucide-react'
import { QAImporterClient } from '@/components/qa-importer/qa-client'

export default function QAImporterPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">QA Jira Importer</h1>
            <p className="text-xs text-white/35 mt-0.5">
              Import, filter and organize QA-related Jira work into your Sentinel Daily cockpit.
            </p>
          </div>
        </div>
      </div>

      <QAImporterClient />
    </div>
  )
}
