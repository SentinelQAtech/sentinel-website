'use client'

import { SeverityBadge, BugStatusBadge, PriorityBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { timeAgo } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import type { Bug } from '@/types'

interface BugTableProps {
  bugs: Bug[]
  onOpenBug?: (bug: Bug) => void
}

export function BugTable({ bugs, onOpenBug }: BugTableProps) {
  if (bugs.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
          <span className="text-3xl">🐛</span>
        </div>
        <p className="text-white/50 font-medium">No bugs found</p>
        <p className="text-white/30 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Bug ID', 'Title', 'Severity', 'Priority', 'Status', 'Project', 'Reporter', 'Assignee', 'Created'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug, i) => (
            <tr
              key={bug.id}
              className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-150 group"
            >
              <td className="px-4 py-3.5">
                <button
                  onClick={() => onOpenBug?.(bug)}
                  className="font-mono text-xs text-primary/80 hover:text-primary flex items-center gap-1 transition-colors"
                >
                  {bug.bugId}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </td>
              <td className="px-4 py-3.5 max-w-[280px]">
                <button onClick={() => onOpenBug?.(bug)} className="text-left text-white/80 hover:text-white transition-colors line-clamp-1">
                  {bug.title}
                </button>
                {bug.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {bug.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-1 py-0.5 rounded text-[10px] bg-white/[0.05] text-white/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <SeverityBadge severity={bug.severity} />
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <PriorityBadge priority={bug.priority} />
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <BugStatusBadge status={bug.status} />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bug.project.coverColor }} />
                  <span className="text-xs text-white/50 truncate max-w-[100px]">{bug.project.name}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Avatar user={bug.reporter} size="xs" />
                  <span className="text-xs text-white/50 truncate max-w-[80px]">{bug.reporter.name.split(' ')[0]}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                {bug.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar user={bug.assignee} size="xs" />
                    <span className="text-xs text-white/50 truncate max-w-[80px]">{bug.assignee.name.split(' ')[0]}</span>
                  </div>
                ) : (
                  <span className="text-xs text-white/25">—</span>
                )}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="text-xs text-white/35">{timeAgo(bug.createdAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
