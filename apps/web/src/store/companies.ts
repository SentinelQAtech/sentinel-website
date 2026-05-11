import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CompanyStatus = 'active' | 'paused' | 'finished'

export interface Company {
  id: string
  name: string
  shortName: string
  status: CompanyStatus
  startedAt: string
  finishedAt?: string
  country?: string
  contactName?: string
  contactEmail?: string
  jiraUrl?: string
  notes?: string
  color: string
}

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'uol',
    name: 'UOL',
    shortName: 'UOL',
    status: 'active',
    startedAt: '2026-01-01',
    country: 'Brasil',
    contactName: 'Cliente UOL',
    color: '#ef4444',
  },
  {
    id: 'concepta',
    name: 'Concepta',
    shortName: 'CON',
    status: 'active',
    startedAt: '2026-01-01',
    country: 'USA',
    contactName: 'Cliente Concepta',
    color: '#3b82f6',
  },
  {
    id: 'scrumlaunch',
    name: 'ScrumLaunch',
    shortName: 'SCR',
    status: 'active',
    startedAt: '2026-01-01',
    country: 'Ucrania',
    contactName: 'Cliente ScrumLaunch',
    color: '#06b6d4',
  },
  {
    id: 'ambev',
    name: 'Ambev',
    shortName: 'AMB',
    status: 'active',
    startedAt: '2026-01-01',
    country: 'India',
    contactName: 'Cliente Ambev',
    color: '#f59e0b',
  },
  {
    id: 'pessoal',
    name: 'Pessoal',
    shortName: 'PES',
    status: 'active',
    startedAt: '2026-01-01',
    country: 'Brasil',
    color: '#8b5cf6',
  },
]

interface CompaniesState {
  companies: Company[]
  addCompany: (company: Omit<Company, 'id'>) => void
  updateCompany: (id: string, updates: Partial<Company>) => void
  deleteCompany: (id: string) => void
  finishCompany: (id: string) => void
}

export const useCompaniesStore = create<CompaniesState>()(
  persist(
    (set) => ({
      companies: INITIAL_COMPANIES,

      addCompany: (company) =>
        set(s => ({
          companies: [
            ...s.companies,
            { ...company, id: `${company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}` },
          ],
        })),

      updateCompany: (id, updates) =>
        set(s => ({
          companies: s.companies.map(c => c.id === id ? { ...c, ...updates } : c),
        })),

      deleteCompany: (id) =>
        set(s => ({ companies: s.companies.filter(c => c.id !== id) })),

      finishCompany: (id) =>
        set(s => ({
          companies: s.companies.map(c =>
            c.id === id ? { ...c, status: 'finished', finishedAt: new Date().toISOString().slice(0, 10) } : c
          ),
        })),
    }),
    { name: 'spm-companies', version: 1 }
  )
)

export function useActiveCompanies() {
  return useCompaniesStore(s => s.companies).filter(c => c.status !== 'finished')
}
