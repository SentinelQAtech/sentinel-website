'use client'

import { useState, useCallback, useEffect } from 'react'
import { FileText, Table2, Upload, Zap, Eye, EyeOff, RefreshCw, Puzzle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseTextInput, parseCsvInput, isQARelated, type ParsedQAItem } from '@/lib/qa-parser'

type TabType = 'text' | 'csv' | 'extension'

interface Props {
  qaFilterEnabled: boolean
  onQaFilterChange:(enabled: boolean) => void
  onImport:       (items: ParsedQAItem[], source: TabType) => { added: number; updated: number; total: number }
}

const TEXT_PLACEHOLDER = `Cole aqui o texto copiado do Jira.

Formatos suportados:

Pipe-separated:
CARD-123 | Validate login flow | Ready QA | High | Current Sprint
BUG-442 | Review checkout bug | Testing | Critical | Current Sprint

Ou qualquer texto com issue keys Jira:
CARD-123 Validate login flow
BUG-88 Test homepage after deploy`

const CSV_PLACEHOLDER = `Cole CSV ou use o botão para fazer upload.

Colunas suportadas (qualquer ordem):
issueKey, title, status, priority, sprint, client, assignee, link, notes

Exemplo:
issueKey,title,status,priority,sprint,client,assignee,link,notes
CARD-123,Validate login flow,Ready QA,High,Current Sprint,Client Name,Raphael,,Validate all scenarios
BUG-442,Review checkout bug,Testing,Critical,Current Sprint,Client Name,Raphael,,Confirm bug fixed`

export function ImportPanel({ qaFilterEnabled, onQaFilterChange, onImport }: Props) {
  const [tab,           setTab]           = useState<TabType>('text')
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

  const currentInput    = tab === 'text' ? textInput : csvInput
  const setCurrentInput = tab === 'text' ? setTextInput : setCsvInput

  // Listen for cards delivered by the Chrome Extension bridge (qa-bridge.js).
  // The background service worker injects the bridge into this page when pending
  // cards exist in chrome.storage.local, bypassing the serverless memory limitation.
  useEffect(() => {
    const handler = (e: Event) => {
      const { cards, count } = (e as CustomEvent<{ cards: ParsedQAItem[]; count: number }>).detail
      setTab('extension')
      setExtResult(null)
      setExtItems([])
      setExtListOpen(false)
      if (count > 0) {
        const filtered = qaFilterEnabled ? cards.filter(isQARelated) : cards
        onImport(filtered, 'extension')
        setExtItems(filtered)
        setExtResult({ count: filtered.length })
        setExtListOpen(true)
      } else {
        setExtResult({ count: 0 })
      }
    }
    window.addEventListener('sentinel-qa-sync', handler)
    return () => window.removeEventListener('sentinel-qa-sync', handler)
  }, [qaFilterEnabled, onImport])

  const parse = useCallback((): ParsedQAItem[] => {
    if (tab === 'extension') return []
    const raw = tab === 'text'
      ? parseTextInput(currentInput)
      : parseCsvInput(currentInput)
    return qaFilterEnabled ? raw.filter(isQARelated) : raw
  }, [tab, currentInput, qaFilterEnabled])

  const handleExtensionPull = useCallback(async () => {
    setExtLoading(true)
    setExtResult(null)
    setExtItems([])
    setExtListOpen(false)
    try {
      const res = await fetch('/api/qa-import')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { items: ParsedQAItem[]; count: number }
      if (data.items.length === 0) {
        setExtResult({ count: 0 })
        return
      }
      const filtered = qaFilterEnabled ? data.items.filter(isQARelated) : data.items
      onImport(filtered, 'extension')
      setExtItems(filtered)
      setExtResult({ count: filtered.length })
    } catch (err) {
      console.error('[QA Extension Pull]', err)
      setExtResult({ count: -1 })
    } finally {
      setExtLoading(false)
    }
  }, [qaFilterEnabled, onImport])

  const handlePreview = () => {
    setPreview(parse())
    setShowPreview(true)
  }

  const handleImport = () => {
    const items = parse()
    if (items.length === 0) return
    setLoading(true)
    setTimeout(() => {
      const result = onImport(items, tab)
      setLastResult({ added: result.added, updated: result.updated })
      setCurrentInput('')
      setPreview(null)
      setShowPreview(false)
      setLoading(false)
    }, 200)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCsvInput(ev.target?.result as string ?? '')
      setTab('csv')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const parsedCount  = preview?.length ?? 0
  const rawCount      = tab === 'text'
    ? parseTextInput(currentInput).length
    : tab === 'csv' ? parseCsvInput(currentInput).length : 0
  const filteredCount = qaFilterEnabled ? parse().length : rawCount

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
        {([
          { id: 'text',      icon: <FileText className="w-3.5 h-3.5" />, label: 'Texto' },
          { id: 'csv',       icon: <Table2   className="w-3.5 h-3.5" />, label: 'CSV'   },
          { id: 'extension', icon: <Puzzle   className="w-3.5 h-3.5" />, label: 'Extensão' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setPreview(null); setLastResult(null); setExtResult(null) }}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-150',
              tab === t.id
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-white/40 hover:text-white/60',
            )}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* QA Filter toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-primary/70" />
          <span className="text-xs font-medium text-white/60">Filtrar só itens QA</span>
        </div>
        <button
          onClick={() => onQaFilterChange(!qaFilterEnabled)}
          className={cn(
            'relative w-9 h-5 rounded-full transition-colors duration-200',
            qaFilterEnabled ? 'bg-primary/60' : 'bg-white/10',
          )}
        >
          <div className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            qaFilterEnabled ? 'translate-x-4' : 'translate-x-0.5',
          )} />
        </button>
      </div>

      {/* ── Extension tab ── */}
      {tab === 'extension' && (
        <div className="flex flex-col gap-3">
          {/* How it works */}
          <div className="p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">Como funciona</p>
            {[
              { n: '1', text: 'Abra o board Jira com as colunas QA visíveis' },
              { n: '2', text: 'Clique no ícone da extensão Sentinel QA Sync' },
              { n: '3', text: 'Clique em "Sincronizar cards QA"' },
              { n: '4', text: 'Abra (ou recarregue) esta página — os cards chegam automaticamente' },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.n}
                </span>
                <span className="text-xs text-white/50 leading-snug">{s.text}</span>
              </div>
            ))}
          </div>

          {/* Result feedback */}
          {extResult && (
            <div className={cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs',
              extResult.count > 0
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : extResult.count === 0
                ? 'bg-amber-500/10 border border-amber-500/20'
                : 'bg-red-500/10 border border-red-500/20',
            )}>
              {extResult.count > 0 && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white/70">
                    <span className="font-semibold text-white/90">{extResult.count}</span> cards importados do board
                  </span>
                </>
              )}
              {extResult.count === 0 && (
                <span className="text-amber-400">Nenhum card pendente. Sincronize pelo board Jira e reabra esta página.</span>
              )}
              {extResult.count === -1 && (
                <span className="text-red-400">Erro ao conectar com a API. Verifique a URL configurada.</span>
              )}
            </div>
          )}

          {/* Synced cards list */}
          {extItems.length > 0 && (
            <div className="rounded-xl border border-white/[0.07] overflow-hidden">
              <button
                onClick={() => setExtListOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-white/60 hover:bg-white/[0.03] transition-colors"
              >
                <span><span className="text-white/85 font-semibold">{extItems.length}</span> cards sincronizados</span>
                {extListOpen
                  ? <ChevronUp   className="w-3.5 h-3.5 text-white/30" />
                  : <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                }
              </button>
              {extListOpen && (
                <div className="max-h-52 overflow-y-auto divide-y divide-white/[0.04]">
                  {extItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 bg-white/[0.01]">
                      {item.issueKey && (
                        <span className="font-mono text-[10px] text-white/35 shrink-0 mt-0.5">{item.issueKey}</span>
                      )}
                      <span className="text-xs text-white/65 leading-snug flex-1 truncate">{item.title}</span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-white/20 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pull button */}
          <button
            onClick={handleExtensionPull}
            disabled={extLoading}
            className={cn(
              'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              'bg-primary/25 border border-primary/40 text-primary',
              'hover:bg-primary/35 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center gap-2',
            )}
          >
            {extLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Buscando cards...
              </>
            ) : (
              <>
                <Puzzle className="w-4 h-4" />
                Buscar cards da extensao
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Text / CSV tabs ── */}
      {tab !== 'extension' && (
        <>
          {/* Textarea */}
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
              <button
                onClick={() => { setCurrentInput(''); setPreview(null); setLastResult(null) }}
                className="absolute top-2 right-2 p-1 rounded text-white/20 hover:text-white/50 transition-colors duration-150"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* CSV upload */}
          {tab === 'csv' && (
            <label className={cn(
              'flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed',
              'border-white/[0.08] text-white/30 text-xs cursor-pointer',
              'hover:border-primary/30 hover:text-primary/60 transition-all duration-200',
            )}>
              <Upload className="w-3.5 h-3.5" />
              Fazer upload de arquivo CSV
              <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
          )}

          {/* Preview info */}
          {currentInput && !preview && rawCount > 0 && (
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-white/40">
                <span className="font-semibold text-white/70">{rawCount}</span> linhas detectadas
                {qaFilterEnabled && rawCount !== filteredCount && (
                  <span className="text-primary/70 ml-1.5">→ <span className="font-semibold">{filteredCount}</span> QA-related</span>
                )}
              </span>
              <button
                onClick={handlePreview}
                className="flex items-center gap-1 text-primary/70 hover:text-primary transition-colors duration-150"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
          )}

          {/* Preview list */}
          {showPreview && preview && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span><span className="font-semibold text-white/70">{parsedCount}</span> itens para importar</span>
                <button onClick={() => setShowPreview(false)} className="flex items-center gap-1 hover:text-white/60">
                  <EyeOff className="w-3 h-3" />
                  Ocultar
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {preview.slice(0, 20).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    {item.issueKey && (
                      <span className="font-mono text-[10px] text-white/40 shrink-0 mt-0.5">{item.issueKey}</span>
                    )}
                    <span className="text-xs text-white/65 truncate">{item.title}</span>
                    {item.priority && item.priority !== 'Unknown' && (
                      <span className="text-[10px] text-white/30 shrink-0">{item.priority}</span>
                    )}
                  </div>
                ))}
                {preview.length > 20 && (
                  <p className="text-[10px] text-white/25 text-center">+{preview.length - 20} mais</p>
                )}
              </div>
            </div>
          )}

          {/* Success message */}
          {lastResult && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="text-emerald-400 font-semibold">✓</span>
              <span className="text-white/60">
                <span className="text-white/80 font-semibold">{lastResult.added}</span> adicionados
                {lastResult.updated > 0 && (
                  <span className="ml-1.5 text-amber-400">{lastResult.updated} atualizados</span>
                )}
              </span>
            </div>
          )}

          {/* Import button */}
          <button
            onClick={handleImport}
            disabled={!currentInput.trim() || filteredCount === 0 || loading}
            className={cn(
              'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              'bg-primary/25 border border-primary/40 text-primary',
              'hover:bg-primary/35 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none',
            )}
          >
            {loading ? 'Importando...' : `Importar para QA ${filteredCount > 0 ? `(${filteredCount})` : ''}`}
          </button>
        </>
      )}
    </div>
  )
}
