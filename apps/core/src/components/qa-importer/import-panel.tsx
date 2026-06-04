'use client'

import { useState, useCallback, useEffect } from 'react'
import { FileText, Table2, Upload, Zap, Eye, EyeOff, RefreshCw, Puzzle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Building2, Plus, Trash2, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseTextInput, parseCsvInput, isQARelated, type ParsedQAItem } from '@/lib/qa-parser'
import { useCompaniesStore } from '@/store/companies'
import { useQAImporterStore } from '@/store/qa-importer'

type TabType = 'text' | 'csv' | 'extension'

interface Props {
  qaFilterEnabled: boolean
  onQaFilterChange:(enabled: boolean) => void
  onImport:       (items: ParsedQAItem[], source: TabType) => { added: number; updated: number; total: number }
  onSuccess?:     () => void
}

const TEXT_PLACEHOLDER = `issueKey | título | status | prioridade | sprint | descrição | link

Exemplos:
SFC-1061 | [FE] Validate login flow | Ready QA | High | Sprint 14 | Validar fluxo completo de login incluindo OAuth | https://seu-jira/browse/SFC-1061
SFC-442  | [BE] Fix checkout bug    | Testing  | Critical | Sprint 14

Campos mínimos: issueKey | título | status | prioridade | sprint
Campos opcionais: descrição e link (qualquer ordem, URL detectada automaticamente)`

const CSV_PLACEHOLDER = `Cole CSV ou use o botão para fazer upload.

Colunas suportadas (qualquer ordem):
issueKey, title, status, priority, sprint, client, assignee, link, notes

Exemplo:
issueKey,title,status,priority,sprint,client,assignee,link,notes
CARD-123,Validate login flow,Ready QA,High,Current Sprint,Client Name,Raphael,,Validate all scenarios`

// ─── Helper: apply client override + prefix fallback ─────────

function applyClient(
  items: ParsedQAItem[],
  selectedClient: string,
  prefixMap: Record<string, string>,
): ParsedQAItem[] {
  return items.map(item => {
    // Explicit selection always wins
    if (selectedClient) return { ...item, client: selectedClient }
    // Prefix fallback: detect from issueKey (e.g. "SFC-1061" → prefix "SFC")
    if (!item.client && item.issueKey) {
      const prefix = item.issueKey.replace(/-\d+$/, '').toUpperCase()
      const mapped = prefixMap[prefix]
      if (mapped) return { ...item, client: mapped }
    }
    return item
  })
}

// ─── ImportPanel ─────────────────────────────────────────────

export function ImportPanel({ qaFilterEnabled, onQaFilterChange, onImport, onSuccess }: Props) {
  const companies  = useCompaniesStore(s => s.companies).filter(c => c.status !== 'finished')
  const prefixMap  = useQAImporterStore(s => s.prefixMap)
  const setPrefixMap = useQAImporterStore(s => s.setPrefixMap)

  const [tab,           setTab]           = useState<TabType>('extension')
  const [textInput,     setTextInput]     = useState('')
  const [csvInput,      setCsvInput]      = useState('')
  const [preview,       setPreview]       = useState<ParsedQAItem[] | null>(null)
  const [showPreview,   setShowPreview]   = useState(false)
  const [lastResult,    setLastResult]    = useState<{ added: number; updated: number } | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [extLoading,    setExtLoading]    = useState(false)
  const [extResult,     setExtResult]     = useState<{ count: number } | null>(null)
  const [extItems,      setExtItems]      = useState<ParsedQAItem[]>([])
  const [extListOpen,   setExtListOpen]   = useState(false)

  // Company selector
  const [selectedClient, setSelectedClient] = useState('')

  // Prefix map config UI
  const [prefixOpen,    setPrefixOpen]    = useState(false)
  const [newPrefix,     setNewPrefix]     = useState('')
  const [newClient,     setNewClient]     = useState(() => companies[0]?.name ?? '')

  const currentInput    = tab === 'text' ? textInput : csvInput
  const setCurrentInput = tab === 'text' ? setTextInput : setCsvInput

  const doImport = useCallback((items: ParsedQAItem[], source: TabType) => {
    const withClient = applyClient(items, selectedClient, prefixMap)
    return onImport(withClient, source)
  }, [selectedClient, prefixMap, onImport])

  // Extension bridge event
  useEffect(() => {
    const handler = (e: Event) => {
      const { cards, count } = (e as CustomEvent<{ cards: ParsedQAItem[]; count: number }>).detail
      setTab('extension')
      setExtResult(null)
      setExtItems([])
      setExtListOpen(false)
      if (count > 0) {
        const filtered = qaFilterEnabled ? cards.filter(isQARelated) : cards
        doImport(filtered, 'extension')
        setExtItems(filtered)
        setExtResult({ count: filtered.length })
        setExtListOpen(true)
      } else {
        setExtResult({ count: 0 })
      }
    }
    window.addEventListener('sentinel-qa-sync', handler)
    return () => window.removeEventListener('sentinel-qa-sync', handler)
  }, [qaFilterEnabled, doImport])

  const parse = useCallback((): ParsedQAItem[] => {
    if (tab === 'extension') return []
    const raw = tab === 'text' ? parseTextInput(currentInput) : parseCsvInput(currentInput)
    return qaFilterEnabled ? raw.filter(isQARelated) : raw
  }, [tab, currentInput, qaFilterEnabled])

  const handleExtensionPull = useCallback(async () => {
    setExtLoading(true)
    setExtResult(null)
    setExtItems([])
    setExtListOpen(false)
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
      const res = await fetch(`${base}/api/qa-import`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { items: ParsedQAItem[]; count: number }
      if (data.items.length === 0) { setExtResult({ count: 0 }); return }
      const filtered = qaFilterEnabled ? data.items.filter(isQARelated) : data.items
      doImport(filtered, 'extension')
      setExtItems(filtered)
      setExtResult({ count: filtered.length })
    } catch (err) {
      console.error('[QA Extension Pull]', err)
      setExtResult({ count: -1 })
    } finally {
      setExtLoading(false)
    }
  }, [qaFilterEnabled, doImport])

  const handlePreview = () => { setPreview(parse()); setShowPreview(true) }

  const handleImport = () => {
    const items = parse()
    if (items.length === 0) return
    setLoading(true)
    setTimeout(() => {
      const result = doImport(items, tab)
      setLastResult({ added: result.added, updated: result.updated })
      setCurrentInput('')
      setPreview(null)
      setShowPreview(false)
      setLoading(false)
      if (result.added > 0 && onSuccess) onSuccess()
    }, 200)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setCsvInput(ev.target?.result as string ?? ''); setTab('csv') }
    reader.readAsText(file)
    e.target.value = ''
  }

  const addPrefixEntry = () => {
    if (!newPrefix.trim() || !newClient.trim()) return
    setPrefixMap({ ...prefixMap, [newPrefix.trim().toUpperCase()]: newClient.trim() })
    setNewPrefix('')
    setNewClient(companies[0]?.name ?? '')
  }

  const removePrefixEntry = (key: string) => {
    const next = { ...prefixMap }
    delete next[key]
    setPrefixMap(next)
  }

  const rawCount      = tab === 'text' ? parseTextInput(currentInput).length : tab === 'csv' ? parseCsvInput(currentInput).length : 0
  const filteredCount = qaFilterEnabled ? parse().length : rawCount
  const canImport     = !!selectedClient && (tab === 'extension' || (!!currentInput.trim() && filteredCount > 0)) && !loading
  const prefixEntries = Object.entries(prefixMap)

  return (
    <div className="flex flex-col gap-4">

      {/* ── Empresa (required) ─────────────────────────────── */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
          <Building2 className="h-3 w-3" />
          Empresa <span className="text-red-400/70">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {companies.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedClient(prev => prev === c.name ? '' : c.name)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                selectedClient === c.name
                  ? 'border-primary/40 bg-primary/20 text-primary shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.04] text-white/50 hover:border-white/[0.18] hover:text-white/80',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        {!selectedClient && (
          <p className="mt-1.5 text-[10px] text-white/25">Selecione a empresa antes de importar</p>
        )}
      </div>

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
        {([
          { id: 'text',      icon: <FileText className="w-3.5 h-3.5" />, label: 'Texto'    },
          { id: 'csv',       icon: <Table2   className="w-3.5 h-3.5" />, label: 'CSV'      },
          { id: 'extension', icon: <Puzzle   className="w-3.5 h-3.5" />, label: 'Extensão' },
        ] as const).map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTab(t.id); setPreview(null); setLastResult(null); setExtResult(null) }}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-150',
              tab === t.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-white/40 hover:text-white/60',
            )}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── QA Filter toggle ────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-primary/70" />
          <span className="text-xs font-medium text-white/60">Filtrar só itens QA</span>
        </div>
        <button
          type="button"
          aria-label={qaFilterEnabled ? 'Desativar filtro QA' : 'Ativar filtro QA'}
          onClick={() => onQaFilterChange(!qaFilterEnabled)}
          className={cn('relative w-9 h-5 rounded-full transition-colors duration-200', qaFilterEnabled ? 'bg-primary/60' : 'bg-white/10')}
        >
          <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', qaFilterEnabled ? 'translate-x-4' : 'translate-x-0.5')} />
        </button>
      </div>

      {/* ── Extension tab ───────────────────────────────────── */}
      {tab === 'extension' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">Como funciona</p>
            {[
              { n: '1', text: 'Selecione a empresa acima' },
              { n: '2', text: 'Abra o board Jira com as colunas QA visíveis' },
              { n: '3', text: 'Clique no ícone da extensão Sentinel QA Sync' },
              { n: '4', text: 'Clique em "Sincronizar cards QA"' },
              { n: '5', text: 'Abra (ou recarregue) esta página — os cards chegam automaticamente' },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                <span className="text-xs text-white/50 leading-snug">{s.text}</span>
              </div>
            ))}
          </div>

          {extResult && (
            <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs',
              extResult.count > 0  ? 'bg-emerald-500/10 border border-emerald-500/20' :
              extResult.count === 0 ? 'bg-amber-500/10 border border-amber-500/20' :
                                      'bg-red-500/10 border border-red-500/20',
            )}>
              {extResult.count > 0  && <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span className="text-white/70"><span className="font-semibold text-white/90">{extResult.count}</span> cards importados do board</span></>}
              {extResult.count === 0 && <span className="text-amber-400">Nenhum card pendente. Sincronize pelo board Jira e reabra esta página.</span>}
              {extResult.count === -1 && <span className="text-red-400">Erro ao conectar com a API.</span>}
            </div>
          )}

          {extItems.length > 0 && (
            <div className="rounded-xl border border-white/[0.07] overflow-hidden">
              <button type="button" onClick={() => setExtListOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-white/60 hover:bg-white/[0.03] transition-colors"
              >
                <span><span className="text-white/85 font-semibold">{extItems.length}</span> cards sincronizados</span>
                {extListOpen ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
              </button>
              {extListOpen && (
                <div className="max-h-52 overflow-y-auto divide-y divide-white/[0.04]">
                  {extItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 bg-white/[0.01]">
                      {item.issueKey && <span className="font-mono text-[10px] text-white/35 shrink-0 mt-0.5">{item.issueKey}</span>}
                      <span className="text-xs text-white/65 leading-snug flex-1 truncate">{item.title}</span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" title="Abrir no Jira" className="shrink-0 text-white/20 hover:text-primary transition-colors">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleExtensionPull}
            disabled={extLoading || !selectedClient}
            className={cn(
              'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2',
              'bg-primary/25 border border-primary/40 text-primary',
              'hover:bg-primary/35 hover:border-primary/60',
              'disabled:opacity-30 disabled:cursor-not-allowed',
            )}
          >
            {extLoading ? <><RefreshCw className="w-4 h-4 animate-spin" />Buscando cards...</> : <><Puzzle className="w-4 h-4" />Buscar cards da extensão</>}
          </button>
        </div>
      )}

      {/* ── Text / CSV tabs ─────────────────────────────────── */}
      {tab !== 'extension' && (
        <>
          <div className="relative">
            <textarea
              value={currentInput}
              onChange={e => { setCurrentInput(e.target.value); setPreview(null); setLastResult(null) }}
              placeholder={tab === 'text' ? TEXT_PLACEHOLDER : CSV_PLACEHOLDER}
              rows={10}
              className={cn(
                'w-full px-3 py-3 rounded-xl text-xs font-mono bg-white/[0.03] border border-white/[0.08]',
                'text-white/70 placeholder-white/15 outline-none resize-none leading-relaxed',
                'focus:border-primary/40 focus:ring-1 focus:ring-primary/15 transition-all duration-150',
              )}
            />
            {currentInput && (
              <button type="button" aria-label="Limpar texto" onClick={() => { setCurrentInput(''); setPreview(null); setLastResult(null) }}
                className="absolute top-2 right-2 p-1 rounded text-white/20 hover:text-white/50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {tab === 'csv' && (
            <label className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/[0.08] text-white/30 text-xs cursor-pointer hover:border-primary/30 hover:text-primary/60 transition-all">
              <Upload className="w-3.5 h-3.5" />
              Fazer upload de arquivo CSV
              <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
          )}

          {currentInput && !preview && rawCount > 0 && (
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-white/40">
                <span className="font-semibold text-white/70">{rawCount}</span> linhas detectadas
                {qaFilterEnabled && rawCount !== filteredCount && (
                  <span className="text-primary/70 ml-1.5">→ <span className="font-semibold">{filteredCount}</span> QA-related</span>
                )}
              </span>
              <button type="button" onClick={handlePreview} className="flex items-center gap-1 text-primary/70 hover:text-primary transition-colors">
                <Eye className="w-3.5 h-3.5" />Preview
              </button>
            </div>
          )}

          {showPreview && preview && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span><span className="font-semibold text-white/70">{preview.length}</span> itens para importar</span>
                <button type="button" onClick={() => setShowPreview(false)} className="flex items-center gap-1 hover:text-white/60">
                  <EyeOff className="w-3 h-3" />Ocultar
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {preview.slice(0, 20).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    {item.issueKey && <span className="font-mono text-[10px] text-white/40 shrink-0 mt-0.5">{item.issueKey}</span>}
                    <span className="text-xs text-white/65 truncate flex-1">{item.title}</span>
                    {item.priority && item.priority !== 'Unknown' && (
                      <span className="text-[10px] text-white/30 shrink-0">{item.priority}</span>
                    )}
                  </div>
                ))}
                {preview.length > 20 && <p className="text-[10px] text-white/25 text-center">+{preview.length - 20} mais</p>}
              </div>
            </div>
          )}

          {lastResult && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="text-emerald-400 font-semibold">✓</span>
              <span className="text-white/60">
                <span className="text-white/80 font-semibold">{lastResult.added}</span> adicionados
                {lastResult.updated > 0 && <span className="ml-1.5 text-amber-400">{lastResult.updated} atualizados</span>}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleImport}
            disabled={!canImport}
            className={cn(
              'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              'bg-primary/25 border border-primary/40 text-primary',
              'hover:bg-primary/35 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none',
            )}
          >
            {loading ? 'Importando...' : !selectedClient ? 'Selecione a empresa primeiro' : `Importar para ${selectedClient} ${filteredCount > 0 ? `(${filteredCount})` : ''}`}
          </button>
        </>
      )}

      {/* ── Prefixos automáticos (collapsible) ───────────────── */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <button
          type="button"
          onClick={() => setPrefixOpen(o => !o)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs text-white/35">
            <Settings2 className="h-3.5 w-3.5" />
            <span className="font-medium">Prefixos automáticos</span>
            {prefixEntries.length > 0 && (
              <span className="rounded-full bg-primary/15 border border-primary/25 px-1.5 py-0.5 text-[10px] text-primary font-semibold">
                {prefixEntries.length}
              </span>
            )}
          </div>
          {prefixOpen ? <ChevronUp className="h-3.5 w-3.5 text-white/20" /> : <ChevronDown className="h-3.5 w-3.5 text-white/20" />}
        </button>

        {prefixOpen && (
          <div className="border-t border-white/[0.06] px-3.5 py-3 space-y-3">
            <p className="text-[11px] text-white/30 leading-relaxed">
              Detecta automaticamente a empresa pelo prefixo do issueKey. Ex: <span className="font-mono text-white/50">SFC</span> → ScrumLaunch.
              Usado como fallback quando nenhuma empresa está selecionada (ex: extensão).
            </p>

            {/* Existing entries */}
            {prefixEntries.length > 0 && (
              <div className="space-y-1.5">
                {prefixEntries.map(([prefix, client]) => (
                  <div key={prefix} className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-primary/70 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md min-w-[56px] text-center">
                      {prefix}
                    </span>
                    <span className="text-white/30 text-xs">→</span>
                    <span className="flex-1 text-xs text-white/65">{client}</span>
                    <button
                      type="button"
                      onClick={() => removePrefixEntry(prefix)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                      aria-label={`Remover ${prefix}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new entry */}
            <div className="flex gap-2">
              <input
                value={newPrefix}
                onChange={e => setNewPrefix(e.target.value.toUpperCase())}
                placeholder="SFC"
                className="w-16 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 font-mono text-xs text-white/70 placeholder-white/20 outline-none focus:border-primary/30"
              />
              <select
                aria-label="Empresa para o prefixo"
                value={newClient}
                onChange={e => setNewClient(e.target.value)}
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-xs text-white/70 outline-none focus:border-primary/30"
              >
                <option value="">→ Empresa</option>
                {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <button
                type="button"
                onClick={addPrefixEntry}
                disabled={!newPrefix.trim() || !newClient}
                className="flex items-center justify-center rounded-lg border border-primary/25 bg-primary/10 px-2.5 text-primary hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Adicionar prefixo"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
