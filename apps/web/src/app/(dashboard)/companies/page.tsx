'use client'

import { useMemo, useState } from 'react'
import { Building2, Check, Edit3, Plus, Search, Trash2, XCircle } from 'lucide-react'
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
    </div>
  )
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
