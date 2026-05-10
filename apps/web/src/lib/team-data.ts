import type { User } from '@/types'

export interface TeamMember {
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

export const TEAM: TeamMember[] = [
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
    bio: 'Especialista em automacao de testes e qualidade de software. Lidera a estrategia de QA e desenvolvimento de projetos na Sentinel Tech.',
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

export const COMPANY_CLIENTS = [
  { name: 'Concept-USA', flag: 'US', color: '#3b82f6' },
  { name: 'ABinBev-IND', flag: 'IN', color: '#f59e0b' },
  { name: 'ScrumLaunch-UKR', flag: 'UA', color: '#06b6d4' },
]
