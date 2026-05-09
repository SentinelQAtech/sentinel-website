'use client'

import { useMemo, useState } from 'react'
import { Building2, Check, Edit3, Globe2, Map as MapIcon, Plus, Search, Trash2, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCompaniesStore, type Company, type CompanyStatus } from '@/store/companies'

const STATUS_LABEL: Record<CompanyStatus, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  finished: 'Finalizada',
}

const STATUS_CLASS: Record<CompanyStatus, string> = {
  active: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  paused: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  finished: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
}

const EMPTY_FORM: Omit<Company, 'id'> = {
  name: '',
  shortName: '',
  status: 'active',
  startedAt: new Date().toISOString().slice(0, 10),
  country: '',
  contactName: '',
  contactEmail: '',
  jiraUrl: '',
  notes: '',
  color: '#6366f1',
}

export default function CompaniesPage() {
  const { companies, addCompany, updateCompany, deleteCompany, finishCompany } = useCompaniesStore()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Company, 'id'>>(EMPTY_FORM)
  const [mapOpen, setMapOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.country?.toLowerCase().includes(q)
    )
  }, [companies, query])

  const startEdit = (company: Company) => {
    setEditingId(company.id)
    const { id: _id, ...rest } = company
    setForm(rest)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const saveCompany = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const payload = {
      ...form,
      name: form.name.trim(),
      shortName: form.shortName.trim() || form.name.slice(0, 3).toUpperCase(),
    }
    if (editingId) updateCompany(editingId, payload)
    else addCompany(payload)
    resetForm()
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/15">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Empresas</h1>
              <p className="text-sm text-white/40">Base de clientes usada no Daily, projetos e rotinas de QA.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <button
            onClick={() => setMapOpen(true)}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/15 px-4 text-sm font-semibold text-primary hover:bg-primary/25"
          >
            <MapIcon className="h-4 w-4" />
            Mapa mundial
          </button>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar empresa..."
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary/40"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map(company => (
            <div key={company.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: company.color }} />
                    <h2 className="truncate text-base font-semibold text-white">{company.name}</h2>
                    <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold', STATUS_CLASS[company.status])}>
                      {STATUS_LABEL[company.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/35">{company.shortName} · desde {company.startedAt}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(company)} className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.06] hover:text-white/70">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => finishCompany(company.id)} className="rounded-lg p-1.5 text-white/30 hover:bg-emerald-500/10 hover:text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Excluir ${company.name}? Esta acao remove a empresa da lista.`)) deleteCompany(company.id)
                    }}
                    className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <Info label="Pais" value={company.country || 'Nao informado'} />
                <Info label="Contato" value={company.contactName || 'Nao informado'} />
                <Info label="E-mail" value={company.contactEmail || 'Nao informado'} />
                <Info label="Jira" value={company.jiraUrl || 'Nao informado'} />
              </div>
              {company.notes && <p className="mt-3 rounded-lg bg-white/[0.03] p-3 text-xs text-white/45">{company.notes}</p>}
            </div>
          ))}
        </div>

        <form onSubmit={saveCompany} className="glass-card h-fit p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/85">{editingId ? 'Editar empresa' : 'Nova empresa'}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.06] hover:text-white/60">
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            <Field label="Nome" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sigla" value={form.shortName} onChange={v => setForm({ ...form, shortName: v })} />
              <Field label="Inicio" type="date" value={form.startedAt} onChange={v => setForm({ ...form, startedAt: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Status</span>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as CompanyStatus })}
                  className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white outline-none"
                >
                  <option value="active">Ativa</option>
                  <option value="paused">Pausada</option>
                  <option value="finished">Finalizada</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Cor</span>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] p-1"
                />
              </label>
            </div>
            <Field label="Pais/regiao" value={form.country ?? ''} onChange={v => setForm({ ...form, country: v })} />
            <Field label="Contato" value={form.contactName ?? ''} onChange={v => setForm({ ...form, contactName: v })} />
            <Field label="E-mail" value={form.contactEmail ?? ''} onChange={v => setForm({ ...form, contactEmail: v })} />
            <Field label="Jira/Board URL" value={form.jiraUrl ?? ''} onChange={v => setForm({ ...form, jiraUrl: v })} />
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Notas</span>
              <textarea
                value={form.notes ?? ''}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                placeholder="Contexto, contrato, observacoes..."
              />
            </label>
          </div>

          <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">
            <Plus className="h-4 w-4" />
            {editingId ? 'Salvar alteracoes' : 'Adicionar empresa'}
          </button>
        </form>
      </div>

      {mapOpen && (
        <WorldMapModal
          companies={companies.filter(c => c.status !== 'finished')}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  )
}

function WorldMapModal({ companies, onClose }: { companies: Company[]; onClose: () => void }) {
  const regionIndexes = new Map<string, number>()
  const offsetPattern = [
    { x: 0, y: 0 },
    { x: 38, y: -18 },
    { x: -34, y: 20 },
    { x: 30, y: 28 },
    { x: -42, y: -22 },
  ]

  const plottedCompanies = companies.map(company => {
    const basePoint = getMapPoint(company)
    const regionIndex = regionIndexes.get(basePoint.region) ?? 0
    const offset = offsetPattern[regionIndex % offsetPattern.length]
    regionIndexes.set(basePoint.region, regionIndex + 1)

    return {
      company,
      point: {
        ...basePoint,
        x: basePoint.x + offset.x,
        y: basePoint.y + offset.y,
      },
    }
  })

  const regions = [...new Set(plottedCompanies.map(item => item.point.region))]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/[0.10] bg-surface-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/15">
              <Globe2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Mapa mundial de atuacao</h2>
              <p className="text-xs text-white/35">{companies.length} empresas ativas em {regions.length} regioes</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/35 hover:bg-white/[0.06] hover:text-white/70">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
          <div className="relative min-h-[460px] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.16),transparent_55%)]">
            <div className="absolute inset-0 dot-grid opacity-25" />
            <svg viewBox="0 0 1000 520" className="relative z-10 h-full min-h-[460px] w-full">
              <defs>
                <filter id="continentGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path d="M121 170 C170 111 257 104 312 147 C353 180 337 236 284 254 C216 276 150 248 121 170Z" fill="rgba(99,102,241,0.16)" stroke="rgba(99,102,241,0.35)" filter="url(#continentGlow)" />
              <path d="M250 275 C315 286 350 346 325 417 C306 470 250 448 230 388 C213 337 205 293 250 275Z" fill="rgba(6,182,212,0.13)" stroke="rgba(6,182,212,0.32)" filter="url(#continentGlow)" />
              <path d="M455 151 C532 95 670 98 765 151 C835 190 822 260 732 272 C635 286 582 229 492 246 C421 258 383 204 455 151Z" fill="rgba(139,92,246,0.18)" stroke="rgba(139,92,246,0.36)" filter="url(#continentGlow)" />
              <path d="M500 255 C548 271 586 318 578 390 C570 457 500 451 474 389 C451 334 454 276 500 255Z" fill="rgba(245,158,11,0.14)" stroke="rgba(245,158,11,0.34)" filter="url(#continentGlow)" />
              <path d="M731 294 C790 281 856 315 888 370 C911 410 872 439 821 424 C770 409 715 348 731 294Z" fill="rgba(16,185,129,0.13)" stroke="rgba(16,185,129,0.32)" filter="url(#continentGlow)" />

              {plottedCompanies.map(({ company, point }, index) => (
                <g key={company.id}>
                  <circle cx={point.x} cy={point.y} r="18" fill={company.color} opacity="0.14">
                    <animate attributeName="r" values="12;24;12" dur={`${2.4 + index * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={point.x} cy={point.y} r="6" fill={company.color} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
                  <line x1={point.x} y1={point.y - 8} x2={point.x + 34} y2={point.y - 36} stroke={company.color} strokeWidth="1" opacity="0.8" />
                  <rect x={point.x + 38} y={point.y - 55} width="150" height="42" rx="10" fill="rgba(15,23,42,0.88)" stroke="rgba(255,255,255,0.10)" />
                  <text x={point.x + 48} y={point.y - 32} fill="rgba(255,255,255,0.88)" fontSize="12" fontWeight="700">
                    {company.shortName || company.name.slice(0, 16)}
                  </text>
                  <text x={point.x + 48} y={point.y - 15} fill="rgba(255,255,255,0.42)" fontSize="11">
                    {point.region}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="border-t border-white/[0.08] bg-white/[0.02] p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Areas em destaque</p>
            <div className="mt-4 space-y-3">
              {plottedCompanies.map(({ company, point }) => (
                <div key={company.id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: company.color }} />
                    <span className="text-sm font-semibold text-white/80">{company.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/35">{company.country || point.region}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-white/30">
              Visao operacional das regioes onde a Sentinel acompanha clientes, QA, boards e rotinas de entrega.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getMapPoint(company: Company) {
  const text = `${company.country ?? ''} ${company.name}`.toLowerCase()
  if (text.includes('usa') || text.includes('eua') || text.includes('uol') || text.includes('brasil')) {
    return { x: text.includes('usa') || text.includes('eua') ? 245 : 325, y: text.includes('usa') || text.includes('eua') ? 185 : 355, region: text.includes('usa') || text.includes('eua') ? 'America do Norte' : 'America do Sul' }
  }
  if (text.includes('india') || text.includes('ambev')) return { x: 690, y: 250, region: 'Asia' }
  if (text.includes('ucrania') || text.includes('ukr') || text.includes('scrumlaunch')) return { x: 560, y: 175, region: 'Europa' }
  return { x: 515, y: 305, region: 'Operacao global' }
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2">
      <p className="text-[10px] uppercase tracking-wider text-white/25">{label}</p>
      <p className="mt-1 truncate text-xs text-white/55">{value}</p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="space-y-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary/40"
      />
    </label>
  )
}
