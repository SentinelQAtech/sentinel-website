'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const members = [
  { name: 'Raphael Castilho', role: 'QA Engineer',     isOnline: true,  task: 'Reviewing SPM bugs'     },
  { name: 'Antonio Silva',    role: 'Developer',        isOnline: true,  task: 'Sprint 14 tasks'        },
  { name: 'Maria Santos',     role: 'QA Analyst',       isOnline: true,  task: 'Writing test cases'     },
  { name: 'João Lima',        role: 'Project Manager',  isOnline: false, task: 'Last seen 2h ago'       },
  { name: 'Carlos Mendes',    role: 'Developer',        isOnline: true,  task: 'API Gateway refactor'   },
  { name: 'Fernanda Costa',   role: 'QA Analyst',       isOnline: false, task: 'Last seen 30m ago'      },
]

export function TeamPresence() {
  const online = members.filter(m => m.isOnline).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Team</CardTitle>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {online} online
          </span>
        </div>
        <span className="text-xs text-white/40">{members.length} members</span>
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        {members.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors duration-150"
          >
            <Avatar user={{ name: m.name }} size="sm" showStatus isOnline={m.isOnline} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/85 truncate">{m.name}</p>
              <p className={cn('text-xs truncate', m.isOnline ? 'text-white/40' : 'text-white/25')}>
                {m.task}
              </p>
            </div>
            <span className="text-xs text-white/30 shrink-0">{m.role.split(' ')[0]}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
