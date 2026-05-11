'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { TEAM, TEAM_STORAGE_KEY, type TeamMember } from '@/lib/team-data'
import { useI18nStore } from '@/store/i18n'

function useDashboardTeam() {
  const [members, setMembers] = useState<TeamMember[]>(TEAM)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TEAM_STORAGE_KEY)
      if (saved) setMembers(JSON.parse(saved) as TeamMember[])
    } catch {
      setMembers(TEAM)
    }
  }, [])

  return members.filter(member => member.user.isActive)
}

export function TeamPresence() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const members = useDashboardTeam()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{t('team')}</CardTitle>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {members.length} online
          </span>
        </div>
        <span className="text-xs text-white/40">{members.length} {t('activeMembers').toLowerCase()}</span>
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        {members.length === 0 ? (
          <div className="py-8 text-center text-xs text-white/30">{t('emptyDashboard')}</div>
        ) : members.map(member => (
          <div
            key={member.user.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors duration-150"
          >
            <Avatar user={member.user} size="sm" showStatus isOnline />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/85 truncate">{member.user.name}</p>
              <p className="text-xs truncate text-white/40">{member.title}</p>
            </div>
            <span className="text-xs text-white/30 shrink-0">{member.user.role.split('_')[0]}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
