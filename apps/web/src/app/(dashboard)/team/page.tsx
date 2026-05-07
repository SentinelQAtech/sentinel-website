'use client'

import { motion } from 'framer-motion'
import {
  Users, Mail, Github, Linkedin, Calendar, Shield,
  FolderKanban, Bug, Zap, Crown, Star, Activity,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

// ─── Team Data ────────────────────────────────────────────────────────────────

interface TeamMember {
  user: User
  title: string
  bio: string
  skills: string[]
  projects: number
  bugsResolved: number
  sprintsCompleted: number
  github?: string
  linkedin?: string
  color: string
  glow: string
}

const TEAM: TeamMember[] = [
  {
    user: {
      id: '1',
      email: 'raphael@sentinel.tech',
      username: 'raphacastilho',
      name: 'Raphael Castilho',
      role: 'ADMIN',
      isActive: true,
      lastSeen: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    title: 'Founder & QA Lead',
    bio: 'Especialista em automação de testes e qualidade de software. Lidera a estratégia de QA e desenvolvimento de projetos na Sentinel Tech.',
    skills: ['QA Automation', 'Playwright', 'Cypress', 'Agile', 'TypeScript', 'Python'],
    projects: 3,
    bugsResolved: 28,
    sprintsCompleted: 7,
    github: 'raphacastilho',
    linkedin: 'raphacastilho',
    color: '#6366f1',
    glow: 'shadow-[0_0_30px_rgba(99,102,241,0.12)]',
  },
  {
    user: {
      id: '2',
      email: 'antonio@sentinel.tech',
      username: 'antoniosilva',
      name: 'Antonio Silva',
      role: 'ADMIN',
      isActive: true,
      lastSeen: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    title: 'Founder & Tech Lead',
    bio: 'Engenheiro full-stack com foco em arquitetura de sistemas e entrega de produtos de alta qualidade. Co-fundador da Sentinel Tech.',
    skills: ['Next.js', 'NestJS', 'PostgreSQL', 'Docker', 'TypeScript', 'AWS'],
    projects: 3,
    bugsResolved: 19,
    sprintsCompleted: 7,
    github: 'antoniosilva',
    linkedin: 'antoniosilva',
    color: '#06b6d4',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.12)]',
  },
]

const COMPANY_CLIENTS = [
  { name: 'Concept-USA',     flag: '🇺🇸', color: '#3b82f6' },
  { name: 'ABinBev-IND',     flag: '🇮🇳', color: '#f59e0b' },
  { name: 'ScrumLaunch-UKR', flag: '🇺🇦', color: '#06b6d4' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Time</h1>
          <p className="text-sm text-white/40 mt-0.5">Conheça quem está por trás da Sentinel Tech</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <Users className="w-4 h-4 text-white/40" />
          <span className="text-sm font-semibold text-white/70">{TEAM.length} membros</span>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Clientes ativos', value: COMPANY_CLIENTS.length, icon: <Crown className="w-4 h-4" />, color: '#f59e0b' },
          { label: 'Bugs resolvidos', value: TEAM.reduce((a, m) => a + m.bugsResolved, 0), icon: <Bug className="w-4 h-4" />, color: '#ef4444' },
          { label: 'Sprints concluídos', value: TEAM.reduce((a, m) => a + m.sprintsCompleted, 0) / 2, icon: <Zap className="w-4 h-4" />, color: '#8b5cf6' },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="glass-card p-4 flex items-center gap-3 border border-white/[0.07]"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: color + '20', color }}
            >
              {icon}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Member cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.user.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            className={cn('glass-card border border-white/[0.08] overflow-hidden', member.glow)}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${member.color}60, ${member.color}10)` }} />

            <div className="p-6 space-y-5">
              {/* Identity row */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <Avatar user={member.user} size="lg" showStatus isOnline />
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-900"
                    style={{ backgroundColor: member.color }}
                  >
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white truncate">{member.user.name}</h2>
                    <Star className="w-3.5 h-3.5 shrink-0" style={{ color: member.color }} />
                  </div>
                  <p className="text-sm font-medium mt-0.5" style={{ color: member.color }}>
                    {member.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Mail className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/40 truncate">{member.user.email}</span>
                  </div>
                </div>

                {/* Online badge */}
                <div className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-400">Online</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-white/50 leading-relaxed">{member.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Projetos', value: member.projects, icon: <FolderKanban className="w-3 h-3" /> },
                  { label: 'Bugs', value: member.bugsResolved, icon: <Bug className="w-3 h-3" /> },
                  { label: 'Sprints', value: member.sprintsCompleted, icon: <Zap className="w-3 h-3" /> },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <span className="text-white/30">{icon}</span>
                    <span className="text-lg font-bold text-white">{value}</span>
                    <span className="text-[10px] text-white/35">{label}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.06] border border-white/[0.08] text-white/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Member since + links */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                  <Calendar className="w-3 h-3" />
                  <span>Desde Janeiro 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  {member.github && (
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${member.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Clients section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card border border-white/[0.07] p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-white/40" />
          <h3 className="text-sm font-semibold text-white/70">Clientes Atendidos</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {COMPANY_CLIENTS.map(client => (
            <div
              key={client.name}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-150"
              style={{
                backgroundColor: client.color + '10',
                borderColor: client.color + '30',
              }}
            >
              <span className="text-lg">{client.flag}</span>
              <span className="text-sm font-medium" style={{ color: client.color }}>{client.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
