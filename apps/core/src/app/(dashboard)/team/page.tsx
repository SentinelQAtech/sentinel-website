'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, Mail, Github, Linkedin, Calendar, Shield,
  FolderKanban, Bug, Zap, Crown, Star, Activity,
  Plus, Pencil, UserMinus, X, Search, Archive,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import { TEAM, TEAM_STORAGE_KEY, type TeamMember } from '@/lib/team-data'
import { useActiveClients, type Client } from '@/hooks/useClients'
import { useI18nStore } from '@/store/i18n'
import type { Role } from '@/types'

type MemberForm = {
  name: string
  email: string
  username: string
  role: Role
  title: string
  bio: string
  skills: string
  github: string
  linkedin: string
}

const COLORS = ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6']
function emptyForm(): MemberForm {
  return {
    name: '',
    email: '',
    username: '',
    role: 'QA_ANALYST',
    title: '',
    bio: '',
    skills: '',
    github: '',
    linkedin: '',
  }
}

function formFromMember(member: TeamMember): MemberForm {
  return {
    name: member.user.name,
    email: member.user.email,
    username: member.user.username,
    role: member.user.role,
    title: member.title,
    bio: member.bio,
    skills: member.skills.join(', '),
    github: member.github ?? '',
    linkedin: member.linkedin ?? '',
  }
}

export default function TeamPage() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const [members, setMembers] = useState<TeamMember[]>(TEAM)
  const [hydrated, setHydrated] = useState(false)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [offboarding, setOffboarding] = useState<TeamMember | null>(null)
  const { data: activeCompanies = [] } = useActiveClients()

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TEAM_STORAGE_KEY)
      if (saved) setMembers(JSON.parse(saved) as TeamMember[])
    } catch {
      setMembers(TEAM)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members))
  }, [hydrated, members])

  const activeMembers = useMemo(
    () => members.filter(member => member.user.isActive),
    [members]
  )

  const offboardedMembers = useMemo(
    () => members.filter(member => !member.user.isActive),
    [members]
  )

  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return activeMembers
    return activeMembers.filter(member =>
      member.user.name.toLowerCase().includes(query) ||
      member.title.toLowerCase().includes(query) ||
      member.skills.some(skill => skill.toLowerCase().includes(query))
    )
  }, [activeMembers, search])

  const skillCount = useMemo(
    () => new Set(activeMembers.flatMap(member => member.skills)).size,
    [activeMembers]
  )

  const saveMember = (form: MemberForm) => {
    if (!form.name.trim() || !form.email.trim() || !form.title.trim()) return

    const skills = form.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean)

    if (editing) {
      setMembers(current => current.map(member => member.user.id === editing.user.id
        ? {
            ...member,
            title: form.title.trim(),
            bio: form.bio.trim() || member.bio,
            skills,
            github: form.github.trim() || undefined,
            linkedin: form.linkedin.trim() || undefined,
            user: {
              ...member.user,
              name: form.name.trim(),
              email: form.email.trim(),
              username: form.username.trim() || form.email.split('@')[0],
              role: form.role,
              lastSeen: new Date().toISOString(),
            },
          }
        : member
      ))
    } else {
      const color = COLORS[members.length % COLORS.length]
      setMembers(current => [{
        user: {
          id: String(Date.now()),
          email: form.email.trim(),
          username: form.username.trim() || form.email.split('@')[0],
          name: form.name.trim(),
          role: form.role,
          isActive: true,
          lastSeen: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        title: form.title.trim(),
        bio: form.bio.trim() || 'Novo membro cadastrado no time Sentinel Tech.',
        skills,
        projects: 0,
        bugsResolved: 0,
        sprintsCompleted: 0,
        joinedAt: new Date().toISOString().slice(0, 10),
        github: form.github.trim() || undefined,
        linkedin: form.linkedin.trim() || undefined,
        color,
        glow: `shadow-[0_0_30px_${color}20]`,
      }, ...current])
    }

    setFormOpen(false)
    setEditing(null)
  }

  const offboardMember = () => {
    if (!offboarding) return
    setMembers(current => current.map(member => member.user.id === offboarding.user.id
      ? {
          ...member,
          offboardedAt: new Date().toISOString().slice(0, 10),
          user: {
            ...member.user,
            isActive: false,
            lastSeen: new Date().toISOString(),
          },
        }
      : member
    ))
    setOffboarding(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">{t('teamTitle')}</h1>
          <p className="text-sm text-white/40 mt-0.5">{t('teamSubtitle')}</p>
        </div>
        <Button
          variant="glow"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => { setEditing(null); setFormOpen(true) }}
        >
          {t('newMember')}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: t('activeMembers'), value: activeMembers.length, icon: <Users className="w-4 h-4" />, color: '#06b6d4' },
          { label: t('clients'), value: activeCompanies.length, icon: <Crown className="w-4 h-4" />, color: '#f59e0b' },
          { label: t('offboardHistory'), value: offboardedMembers.length, icon: <Archive className="w-4 h-4" />, color: '#8b5cf6' },
          { label: 'Skills', value: skillCount, icon: <Zap className="w-4 h-4" />, color: '#22c55e' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3 border border-white/[0.07]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20', color }}>
              {icon}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="flex items-center gap-3 glass-card px-3 py-2">
        <Search className="w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/25"
          placeholder={t('searchTeam')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleMembers.map((member, i) => (
          <motion.div
            key={member.user.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className={cn('glass-card border border-white/[0.08] overflow-hidden', member.glow)}
          >
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${member.color}60, ${member.color}10)` }} />

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <Avatar user={member.user} size="lg" showStatus isOnline />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-900" style={{ backgroundColor: member.color }}>
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white truncate">{member.user.name}</h2>
                    <Star className="w-3.5 h-3.5 shrink-0" style={{ color: member.color }} />
                  </div>
                  <p className="text-sm font-medium mt-0.5" style={{ color: member.color }}>{member.title}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Mail className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/40 truncate">{member.user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditing(member); setFormOpen(true) }}
                    className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title={t('editMember')}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setOffboarding(member)}
                    className="p-1.5 rounded-lg text-white/35 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title={t('offboardMember')}
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">{member.bio}</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('projects'), value: 0, icon: <FolderKanban className="w-3 h-3" /> },
                  { label: t('bugs'), value: 0, icon: <Bug className="w-3 h-3" /> },
                  { label: 'Sprints', value: 0, icon: <Zap className="w-3 h-3" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-white/30">{icon}</span>
                    <span className="text-lg font-bold text-white">{value}</span>
                    <span className="text-[10px] text-white/35">{label}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.06] border border-white/[0.08] text-white/60">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                  <Calendar className="w-3 h-3" />
                  <span>Desde {member.joinedAt ? formatDate(member.joinedAt) : 'Janeiro 2026'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {member.github && (
                    <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={`https://linkedin.com/in/${member.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {offboardedMembers.length > 0 && (
        <section className="glass-card border border-white/[0.07] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="w-4 h-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white/70">{t('offboardedMembers')}</h3>
          </div>
          <div className="space-y-2">
            {offboardedMembers.map(member => (
              <div key={member.user.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/70 truncate">{member.user.name}</p>
                  <p className="text-xs text-white/35 truncate">{member.title} - {member.user.email}</p>
                </div>
                <span className="text-xs text-white/35 shrink-0">
                  Desligado em {member.offboardedAt ? formatDate(member.offboardedAt) : 'data nao informada'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="glass-card border border-white/[0.07] p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white/70">{t('clientsServed')}</h3>
          </div>
          <Link href="/companies" className="text-xs font-medium text-primary hover:text-primary/80">
            {t('clientsTitle')}
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {activeCompanies.map(client => <ClientPill key={client.id} client={client} />)}
          {activeCompanies.length === 0 && (
            <p className="text-sm text-white/35">Nenhum cliente ativo cadastrado.</p>
          )}
        </div>
      </section>

      {formOpen && (
        <MemberModal
          initial={editing ? formFromMember(editing) : emptyForm()}
          title={editing ? t('editMember') : t('newMember')}
          onClose={() => { setFormOpen(false); setEditing(null) }}
          onSave={saveMember}
        />
      )}

      {offboarding && (
        <ConfirmOffboarding
          member={offboarding}
          onClose={() => setOffboarding(null)}
          onConfirm={offboardMember}
        />
      )}
    </div>
  )
}

function ClientPill({ client }: { client: Client }) {
  const color = client.color || '#6366f1'
  const shortName = (client.shortName || client.name.slice(0, 3)).toUpperCase()

  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border px-4 py-2.5"
      style={{ backgroundColor: `${color}10`, borderColor: `${color}35` }}
    >
      <span className="flex h-7 min-w-7 items-center justify-center rounded-lg border border-white/10 bg-black/15 px-1.5 text-xs font-bold text-white/65">
        {shortName}
      </span>
      <span className="text-sm font-semibold" style={{ color }}>{client.name}</span>
    </div>
  )
}

function MemberModal({ initial, title, onClose, onSave }: {
  initial: MemberForm
  title: string
  onClose: () => void
  onSave: (form: MemberForm) => void
}) {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const [form, setForm] = useState<MemberForm>(initial)
  const inputCls = 'w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 outline-none focus:border-primary/50'

  const update = <K extends keyof MemberForm>(key: K, value: MemberForm[K]) => {
    setForm(current => ({ ...current, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl dropdown-panel overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <span className="text-sm font-semibold text-white/90">{title}</span>
          <button onClick={onClose} className="p-1 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={e => update('name', e.target.value)} className={inputCls} placeholder={t('name')} autoFocus />
            <input value={form.email} onChange={e => update('email', e.target.value)} className={inputCls} placeholder={t('email')} />
            <input value={form.username} onChange={e => update('username', e.target.value)} className={inputCls} placeholder={t('username')} />
            <select value={form.role} onChange={e => update('role', e.target.value as Role)} className={inputCls}>
              {(['ADMIN', 'PROJECT_MANAGER', 'QA_ANALYST', 'QA_ENGINEER', 'DEVELOPER', 'CLIENT_VIEWER'] as Role[]).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <input value={form.title} onChange={e => update('title', e.target.value)} className={inputCls} placeholder={t('titleRole')} />
          <textarea value={form.bio} onChange={e => update('bio', e.target.value)} className={cn(inputCls, 'resize-none')} rows={3} placeholder={t('bioContext')} />
          <input value={form.skills} onChange={e => update('skills', e.target.value)} className={inputCls} placeholder={t('skillsComma')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">GitHub</span>
              <input value={form.github} onChange={e => update('github', e.target.value)} className={inputCls} placeholder="usuario-do-github" />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">LinkedIn</span>
              <input value={form.linkedin} onChange={e => update('linkedin', e.target.value)} className={inputCls} placeholder="slug-do-perfil" />
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
            <Button variant="glow" onClick={() => onSave(form)} disabled={!form.name.trim() || !form.email.trim() || !form.title.trim()}>
              {t('save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfirmOffboarding({ member, onClose, onConfirm }: {
  member: TeamMember
  onClose: () => void
  onConfirm: () => void
}) {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md dropdown-panel border border-red-500/20 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <span className="text-sm font-semibold text-white/90">{t('offboardMember')}</span>
          <button onClick={onClose} className="p-1 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-white/55">
            {member.user.name} sairá dos cards de membros ativos, mas seus dados seguem preservados no historico e em registros passados.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
            <Button variant="destructive" onClick={onConfirm} leftIcon={<UserMinus className="w-4 h-4" />}>
              {t('offboardMember')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
