import type { QAItem, QAPriority, QACategory } from '@/store/qa-importer'

export type ParsedQAItem = Omit<QAItem, 'id' | 'importedAt' | 'sentToDaily' | 'source'>

// ─── Constants ────────────────────────────────────────────────

const ISSUE_KEY_RE = /\b([A-Z]{2,10}-\d+)\b/

const QA_STATUS_KW = [
  'qa', 'testing', 'ready for qa', 'in testing', 'review',
  'validation', 'homolog', 'blocked', 'validaç', 'in qa',
  'em qa', 'em teste', 'aguardando qa',
]
const QA_TEXT_KW = [
  'qa', 'test', 'bug', 'validat', 'regress', 'review',
  'homolog', 'cenário', 'teste', 'validação',
]
const QA_TYPE_KW = ['bug', 'qa', 'test', 'review', 'regression']

// ─── Priority normalization ────────────────────────────────────

export function normalizePriority(raw: string): QAPriority {
  const p = raw.trim().toLowerCase()
  if (['critical', 'crítico', 'critico', 'blocker'].includes(p)) return 'Critical'
  if (['high', 'alta', 'alto', 'major'].includes(p))             return 'High'
  if (['medium', 'média', 'media', 'medio', 'normal'].includes(p)) return 'Medium'
  if (['low', 'baixa', 'baixo', 'minor', 'trivial'].includes(p)) return 'Low'
  return 'Unknown'
}

// ─── Category detection ───────────────────────────────────────

export function detectQACategory(status: string, type = ''): QACategory {
  const s = status.toLowerCase()
  const t = type.toLowerCase()

  if (['ready for qa', 'pronto para qa', 'aguardando qa', 'awaiting qa'].some(k => s.includes(k))) return 'Ready for QA'
  if (['in testing', 'em teste', 'in qa', 'em qa', 'testing in progress'].some(k => s.includes(k)))  return 'In Testing'
  if (s.includes('review') || (t.includes('review') && !t.includes('qa')))                            return 'Review'
  if (s.includes('blocked') || s.includes('bloqueado') || s.includes('impediment'))                   return 'Blocked'
  if (['done', 'concluíd', 'closed', 'resolved', 'released', 'finaliz'].some(k => s.includes(k)))    return 'Done'
  if (t.includes('regress') || s.includes('regress'))                                                 return 'Regression'
  if (t.includes('bug') || s.includes('bug') || s.includes('validat') || t.includes('validat'))       return 'Bug Validation'
  if (s.includes('testing') || s.includes('test') || t.includes('qa') || t.includes('test'))          return 'In Testing'
  return 'Other'
}

// ─── QA relevance check ───────────────────────────────────────

export function isQARelated(item: Partial<ParsedQAItem>): boolean {
  if (item.priority === 'Critical') return true
  const comments = item.comments?.map(comment => comment.body).join(' ') ?? ''
  const links = [
    ...(item.pullRequests ?? []).map(link => `${link.text ?? ''} ${link.url}`),
    ...(item.externalLinks ?? []).map(link => `${link.text ?? ''} ${link.url}`),
  ].join(' ')
  const text  = `${item.title ?? ''} ${item.notes ?? ''} ${item.description ?? ''} ${comments} ${links}`.toLowerCase()
  const status = (item.status ?? '').toLowerCase()
  const type   = (item.type   ?? '').toLowerCase()

  if (QA_TEXT_KW.some(k  => text.includes(k)))   return true
  if (QA_STATUS_KW.some(k => status.includes(k))) return true
  if (QA_TYPE_KW.some(k  => type.includes(k)))    return true
  return false
}

// ─── Text / pipe-separated parser ────────────────────────────

function blankItem(): ParsedQAItem {
  return {
    issueKey: '', title: '', client: '', project: '',
    status: '', priority: 'Unknown', sprint: '',
    assignee: '', type: '', link: '', notes: '',
    qaCategory: 'Other',
  }
}

function parseTextLine(raw: string): ParsedQAItem | null {
  const line = raw.trim()
  if (!line || line.startsWith('#') || line.startsWith('//')) return null

  const sep = line.includes('|') ? '|' : line.includes('\t') ? '\t' : null

  if (sep) {
    const parts = line.split(sep).map(p => p.trim())
    const keyMatch = parts[0].match(ISSUE_KEY_RE)
    const offset   = keyMatch ? 1 : 0

    const issueKey = keyMatch ? keyMatch[1].toUpperCase() : ''
    const title    = keyMatch ? (parts[1] ?? '') : (parts[0] ?? '')
    const status   = parts[1 + offset] ?? ''
    const priority = normalizePriority(parts[2 + offset] ?? '')
    const sprint   = parts[3 + offset] ?? ''

    // Fields 5+ : notes then link (URL auto-detected)
    const field5 = parts[4 + offset] ?? ''
    const field6 = parts[5 + offset] ?? ''
    const isUrl  = (v: string) => /^https?:\/\//i.test(v)
    const notes  = isUrl(field5) ? '' : field5
    const link   = isUrl(field5) ? field5 : (isUrl(field6) ? field6 : field6)

    return { issueKey, title, client: '', project: '', status, priority, sprint, assignee: '', type: '', link, notes, qaCategory: detectQACategory(status) }
  }

  // No separator — try to pull an issue key from anywhere in the line
  const keyMatch = line.match(ISSUE_KEY_RE)
  return {
    ...blankItem(),
    issueKey:   keyMatch ? keyMatch[1].toUpperCase() : '',
    title:      line,
    qaCategory: 'Other',
  }
}

export function parseTextInput(raw: string): ParsedQAItem[] {
  return raw
    .split('\n')
    .flatMap(line => {
      const item = parseTextLine(line)
      return item ? [item] : []
    })
}

// ─── CSV parser ───────────────────────────────────────────────

const CSV_HEADERS: Record<string, keyof ParsedQAItem> = {
  issuekey:     'issueKey',
  'issue key':  'issueKey',
  issue_key:    'issueKey',
  key:          'issueKey',
  id:           'issueKey',
  title:        'title',
  summary:      'title',
  name:         'title',
  status:       'status',
  estado:       'status',
  priority:     'priority',
  prioridade:   'priority',
  sprint:       'sprint',
  client:       'client',
  cliente:      'client',
  project:      'project',
  projeto:      'project',
  assignee:     'assignee',
  responsavel:  'assignee',
  link:         'link',
  url:          'link',
  notes:        'notes',
  notas:        'notes',
  description:  'description',
  descricao:    'description',
  descrição:    'description',
  comments:     'devNotes',
  comentarios:  'devNotes',
  comentários:  'devNotes',
  pr:           'devNotes',
  prs:          'devNotes',
  pullrequest:  'devNotes',
  pullrequests: 'devNotes',
  type:         'type',
  tipo:         'type',
}

function parseCsvRow(row: string): string[] {
  const result: string[] = []
  let cur = '', inQuote = false
  for (const ch of row) {
    if (ch === '"') { inQuote = !inQuote }
    else if (ch === ',' && !inQuote) { result.push(cur.trim()); cur = '' }
    else cur += ch
  }
  result.push(cur.trim())
  return result.map(v => v.replace(/^["']|["']$/g, ''))
}

export function parseCsvInput(raw: string): ParsedQAItem[] {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length === 0) return []

  const firstCols = parseCsvRow(lines[0]).map(h => h.toLowerCase().trim())
  const hasHeader  = firstCols.some(h => h in CSV_HEADERS)
  const startRow   = hasHeader ? 1 : 0

  const fieldKeys: (keyof ParsedQAItem | null)[] = hasHeader
    ? firstCols.map(h => CSV_HEADERS[h] ?? null)
    : (['issueKey', 'title', 'status', 'priority', 'sprint', 'client', 'assignee', 'link', 'notes'] as (keyof ParsedQAItem)[])

  return lines.slice(startRow).flatMap(line => {
    const vals = parseCsvRow(line)
    if (vals.every(v => !v)) return []

    const obj: Partial<ParsedQAItem> = blankItem()

    fieldKeys.forEach((key, i) => {
      if (!key || vals[i] === undefined || vals[i] === '') return
      if (key === 'priority') {
        obj.priority = normalizePriority(vals[i])
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(obj as any)[key] = vals[i]
      }
    })

    if (!obj.title) return []

    const status = obj.status ?? ''
    const type   = obj.type   ?? ''
    return [{ ...blankItem(), ...obj, qaCategory: detectQACategory(status, type) }]
  })
}
