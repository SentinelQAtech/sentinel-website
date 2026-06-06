'use client'

import { useState, useMemo, useEffect, useRef, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, AtSign, Shield, Camera, Check, ArrowLeft,
  Github, Linkedin, Bug, Zap, Calendar, Lock, X, Plus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser, useUpdateUser } from '@/hooks/useAuth'
import { useTeamStore } from '@/store/team'
import { useBugs } from '@/hooks/useBugs'
import { useSprintsStore } from '@/store/sprints'
import { cn } from '@/lib/utils'

const ROLE_LABEL: Record<string, string> = {
  ADMIN:           'Administrador',
  PROJECT_MANAGER: 'QA Ops Lead',
  QA_ANALYST:      'QA Analyst',
  QA_ENGINEER:     'QA Engineer',
  DEVELOPER:       'Developer',
  CLIENT_VIEWER:   'Client Viewer',
}

const ROLE_COLOR: Record<string, string> = {
  ADMIN:           'bg-red-500/15 text-red-400 border-red-500/25',
  PROJECT_MANAGER: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  QA_ANALYST:      'bg-primary/15 text-primary border-primary/25',
  QA_ENGINEER:     'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  DEVELOPER:       'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  CLIENT_VIEWER:   'bg-white/[0.07] text-white/50 border-white/[0.1]',
}

export default function ProfilePage() {
  const router   = useRouter()
  const user = useUser()
  const updateUserMutation = useUpdateUser()
  const { members, updateMember } = useTeamStore()
  const { data: bugsResult } = useBugs()
  const bugs = bugsResult?.data ?? []
  const sprints  = useSprintsStore(s => s.sprints)

  // Match logged-in user to their team card by email or username
  const teamMember = useMemo(() => {
    if (!user) return null
    const emailLower    = user.email.toLowerCase()
    const usernameLower = user.username.toLowerCase()
    const emailLocal    = emailLower.split('@')[0]
    return members.find(m =>
      m.user.email.toLowerCase() === emailLower ||
      m.user.username.toLowerCase() === usernameLower ||
      m.user.email.toLowerCase().split('@')[0] === emailLocal
    ) ?? null
  }, [members, user])

  const accent = teamMember?.color ?? '#6366f1'

  const [name,        setName]        = useState(user?.name          ?? '')
  const [username,    setUsername]    = useState(user?.username       ?? '')
  const [bio,         setBio]         = useState(teamMember?.bio      ?? '')
  const [title,       setTitle]       = useState(teamMember?.title    ?? '')
  const [github,      setGithub]      = useState(teamMember?.github   ?? '')
  const [linkedin,    setLinkedin]    = useState(teamMember?.linkedin ?? '')
  const [skills,      setSkills]      = useState<string[]>(teamMember?.skills ?? [])
  const [skillInput,  setSkillInput]  = useState('')
  const [saved,       setSaved]       = useState(false)
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatar)

  // Sync form fields when stores hydrate after first render
  const didSyncRef = useRef(false)
  useEffect(() => {
    if (didSyncRef.current || !teamMember) return
    didSyncRef.current = true
    setBio(teamMember.bio ?? '')
    setTitle(teamMember.title ?? '')
    setGithub(teamMember.github ?? '')
    setLinkedin(teamMember.linkedin ?? '')
    setSkills(teamMember.skills ?? [])
  }, [teamMember])

  if (!user) return null

  const initials      = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const bugCount      = bugs.length
  const sprintsDone   = sprints.filter(s => s.status === 'COMPLETED').length
  const memberSince   = new Date(teamMember?.joinedAt ?? user.createdAt)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills(prev => [...prev, s])
    setSkillInput('')
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill() }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setAvatarPreview(dataUrl)
      updateUserMutation.mutate({ avatar: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    updateUserMutation.mutate({ name: name.trim() || user!.name, username: username.trim() || user!.username })
    if (teamMember) {
      updateMember(teamMember.user.id, {
        bio:      bio.trim(),
        title:    title.trim() || teamMember.title,
        skills,
        github:   github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        user: { ...teamMember.user, name: name.trim() || user!.name, username: username.trim() || user!.username },
      })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputCls = cn(
    'w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-150',
    'bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20',
    'focus:border-white/20 focus:bg-white/[0.06]'
  )
  const readOnlyCls = cn(
    'w-full px-3.5 py-2.5 rounded-xl text-sm',
    'bg-white/[0.02] border border-white/[0.04] text-white/35 cursor-default select-none'
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => router.back()}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-6 items-start">

        {/* ── Left column ── */}
        <div className="space-y-4">

          {/* Avatar card */}
          <div
            className="glass-card border border-white/[0.07] overflow-hidden text-center"
            style={{ boxShadow: `0 0 40px ${accent}18` }}
          >
            <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}90, ${accent}10)` }} />
            <div className="p-6">
              <div className="relative inline-block">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto overflow-hidden"
                  style={{
                    background: avatarPreview ? 'transparent' : `linear-gradient(135deg, ${accent}50, ${accent}20)`,
                    border: `1px solid ${accent}40`,
                  }}
                >
                  {avatarPreview
                    ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    : <span className="text-2xl font-bold text-white">{initials}</span>
                  }
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  aria-label="Alterar foto de perfil"
                  title="Alterar foto"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-surface-800 border border-white/[0.12] flex items-center justify-center text-white/50 hover:text-white hover:bg-surface-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4 space-y-0.5">
                <h2 className="text-base font-bold text-white leading-snug">{user.name}</h2>
                {title && (
                  <p className="text-sm font-medium" style={{ color: accent }}>{title}</p>
                )}
                <p className="text-xs text-white/40 mt-1">{user.email}</p>
              </div>

              <div className="flex items-center justify-center mt-3">
                <span className={cn(
                  'text-[10px] font-semibold px-2.5 py-0.5 rounded-full border',
                  ROLE_COLOR[user.role] ?? ROLE_COLOR.CLIENT_VIEWER
                )}>
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-white/30">
                <Calendar className="w-3 h-3" />
                <span>Membro desde {memberSince}</span>
              </div>

              {/* Social links — shown only when filled */}
              {(github || linkedin) && (
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                  {github && (
                    <a
                      href={`https://github.com/${github}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] text-xs transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      {github}
                    </a>
                  )}
                  {linkedin && (
                    <a
                      href={`https://linkedin.com/in/${linkedin}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] text-xs transition-all"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity stats */}
          <div className="glass-card border border-white/[0.06] p-5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Atividade</p>
            {[
              { label: 'Bugs rastreados',      value: bugCount,     icon: Bug,    color: '#f87171' },
              { label: 'Sprints concluídas',   value: sprintsDone,  icon: Zap,    color: '#a78bfa' },
              { label: 'Status',               value: user.isActive ? 'Ativo' : 'Inativo', icon: Shield, color: user.isActive ? '#34d399' : '#6b7280' },
              { label: 'ID',                   value: `#${user.id.slice(-6).toUpperCase()}`, icon: User, color: '#64748b' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                  {label}
                </div>
                <span className="text-xs font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Informações pessoais */}
          <div className="glass-card border border-white/[0.07] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white/70">Informações pessoais</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">Nome completo</span>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                  <input value={name} onChange={e => setName(e.target.value)} className={cn(inputCls, 'pl-9')} placeholder="Seu nome completo" />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">Username</span>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                  <input value={username} onChange={e => setUsername(e.target.value)} className={cn(inputCls, 'pl-9')} placeholder="username" />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">E-mail</span>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                  <input value={user.email} readOnly className={cn(readOnlyCls, 'pl-9')} />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">Cargo</span>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                  <input value={ROLE_LABEL[user.role] ?? user.role} readOnly className={cn(readOnlyCls, 'pl-9')} />
                </div>
              </label>
            </div>

            <label className="space-y-1.5 block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">Título profissional</span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={inputCls}
                placeholder="ex: Founder & QA Lead"
              />
            </label>
          </div>

          {/* Bio */}
          <div className="glass-card border border-white/[0.07] p-6 space-y-3">
            <h3 className="text-sm font-semibold text-white/70">Bio</h3>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className={cn(inputCls, 'resize-none leading-relaxed')}
              placeholder="Fale sobre sua experiência, especialidades e o que você traz para o time..."
            />
          </div>

          {/* Skills */}
          <div className="glass-card border border-white/[0.07] p-6 space-y-3">
            <h3 className="text-sm font-semibold text-white/70">Skills</h3>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-white/70"
                  >
                    {skill}
                    <button
                      type="button"
                      aria-label={`Remover skill ${skill}`}
                      onClick={() => setSkills(prev => prev.filter(s => s !== skill))}
                      className="text-white/25 hover:text-white/60 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className={cn(inputCls, 'flex-1')}
                placeholder="Adicionar skill — Enter ou vírgula"
              />
              <button
                type="button"
                aria-label="Adicionar skill"
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.09] disabled:opacity-30 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Social links */}
          <div className="glass-card border border-white/[0.07] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white/70">Links sociais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">GitHub</span>
                <div className="relative">
                  <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                  <input value={github} onChange={e => setGithub(e.target.value)} className={cn(inputCls, 'pl-9')} placeholder="usuario-no-github" />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">LinkedIn</span>
                <div className="relative">
                  <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                  <input value={linkedin} onChange={e => setLinkedin(e.target.value)} className={cn(inputCls, 'pl-9')} placeholder="slug-do-perfil" />
                </div>
              </label>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                saved
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_16px_rgba(99,102,241,0.3)]'
              )}
            >
              {saved
                ? <><Check className="w-3.5 h-3.5" /> Salvo com sucesso</>
                : 'Salvar alterações'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card border border-white/[0.07] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-white/35" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">Segurança</p>
              <p className="text-xs text-white/35 mt-0.5">Gerencie sua senha de acesso ao Sentinel Core.</p>
            </div>
          </div>
          <Link
            href="/forgot-password"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-white/[0.08] text-white/55 hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-150 shrink-0"
          >
            Alterar senha
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
