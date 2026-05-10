'use client'

import { useMemo, useState } from 'react'
import { Building2, Check, Edit3, Globe2, Map as MapIcon, Plus, Search, Trash2, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCompaniesStore, type Company, type CompanyStatus } from '@/store/companies'
import { WORLD_COUNTRY_PATHS } from '@/data/world-map-paths'

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
            Mapa de atuacao
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
    { x: 0, y: 0, labelX: 38, labelY: -55 },
    { x: 38, y: -18, labelX: 44, labelY: -66 },
    { x: -34, y: 26, labelX: 46, labelY: -20 },
    { x: 34, y: 34, labelX: 42, labelY: 10 },
    { x: -46, y: -28, labelX: -188, labelY: -52 },
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
        labelX: basePoint.x + offset.x + offset.labelX,
        labelY: basePoint.y + offset.y + offset.labelY,
      },
    }
  })

  const regions = [...new Set(plottedCompanies.map(item => item.point.region))]
  const hub = { x: 505, y: 250 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-primary/20 bg-[#070a14] shadow-2xl shadow-primary/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(99,102,241,0.20),transparent_32%),radial-gradient(circle_at_16%_85%,rgba(6,182,212,0.12),transparent_28%)]" />
        <div className="relative flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/15">
              <Globe2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Mapa de atuacao global</h2>
              <p className="text-xs text-white/35">{companies.length} empresas ativas conectadas em {regions.length} regioes</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/35 hover:bg-white/[0.06] hover:text-white/70">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative grid gap-0 lg:grid-cols-[1fr_300px]">
          <div className="relative min-h-[500px] overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-20" />
            <div className="absolute left-8 top-8 rounded-full border border-cyan-400/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200/55">
              Sentinel network
            </div>
            <div className="absolute bottom-8 left-8 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
                <p className="text-white/30">Empresas</p>
                <p className="mt-1 font-semibold text-white">{companies.length}</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
                <p className="text-white/30">Regioes</p>
                <p className="mt-1 font-semibold text-white">{regions.length}</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
                <p className="text-white/30">Status</p>
                <p className="mt-1 font-semibold text-emerald-300">Ativo</p>
              </div>
            </div>
            <svg viewBox="0 0 1000 520" className="relative z-10 h-full min-h-[460px] w-full">
              <defs>
                <linearGradient id="landGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(99,102,241,0.28)" />
                  <stop offset="52%" stopColor="rgba(6,182,212,0.18)" />
                  <stop offset="100%" stopColor="rgba(168,85,247,0.22)" />
                </linearGradient>
                <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="45%" stopColor="rgba(99,102,241,0.85)" />
                  <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                </radialGradient>
                <filter id="networkGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g opacity="0.26" stroke="rgba(148,163,184,0.45)" strokeWidth="1">
                {[160, 260, 360, 460, 560, 660, 760, 860].map(x => <line key={`v-${x}`} x1={x} y1="74" x2={x} y2="430" />)}
                {[115, 185, 255, 325, 395].map(y => <path key={`h-${y}`} d={`M95 ${y} C300 ${y - 32} 700 ${y - 32} 905 ${y}`} fill="none" />)}
              </g>

              <g filter="url(#networkGlow)">
                {WORLD_COUNTRY_PATHS.map((country, index) => (
                  <path
                    key={`${country.id}-${country.name}-${index}`}
                    d={country.path}
                    fill="url(#landGradient)"
                    stroke="rgba(125,211,252,0.30)"
                    strokeWidth="0.65"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>

              <g opacity="0.55">
                {plottedCompanies.map(({ company, point }) => (
                  <path
                    key={`route-${company.id}`}
                    d={`M${hub.x} ${hub.y} Q${(hub.x + point.x) / 2} ${Math.min(hub.y, point.y) - 80} ${point.x} ${point.y}`}
                    fill="none"
                    stroke={company.color}
                    strokeWidth="1.4"
                    strokeDasharray="6 8"
                    filter="url(#networkGlow)"
                  />
                ))}
              </g>

              <circle cx={hub.x} cy={hub.y} r="58" fill="url(#hubGradient)" opacity="0.28" />
              <circle cx={hub.x} cy={hub.y} r="10" fill="rgba(255,255,255,0.92)" stroke="rgba(99,102,241,0.9)" strokeWidth="3" />
              <circle cx={hub.x} cy={hub.y} r="24" fill="none" stroke="rgba(99,102,241,0.42)" strokeWidth="1">
                <animate attributeName="r" values="20;34;20" dur="3.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.15;0.8" dur="3.4s" repeatCount="indefinite" />
              </circle>
              <text x={hub.x + 18} y={hub.y - 14} fill="rgba(255,255,255,0.82)" fontSize="11" fontWeight="700">SENTINEL</text>
              <text x={hub.x + 18} y={hub.y + 2} fill="rgba(255,255,255,0.42)" fontSize="10">global ops</text>

              {plottedCompanies.map(({ company, point }, index) => (
                <g key={company.id}>
                  <circle cx={point.x} cy={point.y} r="28" fill={company.color} opacity="0.10">
                    <animate attributeName="r" values="18;36;18" dur={`${2.8 + index * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={point.x} cy={point.y} r="7" fill={company.color} stroke="rgba(255,255,255,0.9)" strokeWidth="2.4" filter="url(#networkGlow)" />
                  <line x1={point.x} y1={point.y - 9} x2={point.labelX} y2={point.labelY + 19} stroke={company.color} strokeWidth="1" opacity="0.75" />
                  <rect x={point.labelX} y={point.labelY} width="154" height="44" rx="10" fill="rgba(7,10,20,0.88)" stroke="rgba(125,211,252,0.18)" />
                  <text x={point.labelX + 10} y={point.labelY + 23} fill="rgba(255,255,255,0.88)" fontSize="12" fontWeight="700">
                    {company.shortName || company.name.slice(0, 16)}
                  </text>
                  <text x={point.labelX + 10} y={point.labelY + 40} fill="rgba(255,255,255,0.42)" fontSize="11">
                    {point.region}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="border-t border-white/[0.08] bg-white/[0.03] p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Presenca operacional</p>
            <div className="mt-4 space-y-3">
              {plottedCompanies.map(({ company, point }) => (
                <div key={company.id} className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: company.color }} />
                    <span className="text-sm font-semibold text-white/80">{company.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/35">{company.country || point.region}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-white/30">
              Visao executiva das regioes onde a Sentinel conecta clientes, QA, boards e rotinas de entrega.
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
    return {
      ...projectMapCoordinate(text.includes('usa') || text.includes('eua') ? -98 : -52, text.includes('usa') || text.includes('eua') ? 39 : -10),
      region: text.includes('usa') || text.includes('eua') ? 'America do Norte' : 'America do Sul',
    }
  }
  if (text.includes('india') || text.includes('ambev')) return { ...projectMapCoordinate(78, 22), region: 'Asia' }
  if (text.includes('ucrania') || text.includes('ukr') || text.includes('scrumlaunch')) return { ...projectMapCoordinate(31, 49), region: 'Europa' }
  return { x: 515, y: 305, region: 'Operacao global' }
}

function projectMapCoordinate(lon: number, lat: number) {
  return {
    x: 35 + ((lon + 180) / 360) * 930,
    y: 28 + ((90 - lat) / 180) * 444,
  }
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
