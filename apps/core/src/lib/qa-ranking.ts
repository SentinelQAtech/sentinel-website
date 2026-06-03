import type { QAItem, QAPriority, QACategory } from '@/store/qa-importer'

// ─── Types ────────────────────────────────────────────────────

export type RankSortMode = 'fastest' | 'priority' | 'bugs' | 'manual'

export interface RankResult {
  score:            number
  estimatedMinutes: number
  tag:              string
  tagColor:         string
  detectedType:     'BE' | 'FE' | 'FULL' | null
}

// ─── Scoring tables ───────────────────────────────────────────

const PRIORITY_SCORE: Record<QAPriority, number> = {
  Critical: 100,
  High:     75,
  Medium:   50,
  Low:      25,
  Unknown:  10,
}

const CATEGORY_SCORE: Record<QACategory, number> = {
  'Bug Validation': 30,
  'Regression':     25,
  'In Testing':     15,
  'Ready for QA':   10,
  'Review':          5,
  'Other':           5,
  'Blocked':         0,
  'Done':          -50,
}

const URGENCY_RULES: { words: string[]; score: number }[] = [
  { words: ['blocker', 'crash', 'prod', 'produção', 'critical', 'crítico', 'down', 'broken', 'quebrado'], score: 40 },
  { words: ['bug', 'erro', 'error', 'falha', 'fail'], score: 20 },
  { words: ['regression', 'regressão', 'broke', 'quebrou'], score: 15 },
]

const BE_KEYWORDS = ['[be]', 'api', 'endpoint', 'backend', 'server', 'database', 'query', 'migration', 'service', 'route']
const FE_KEYWORDS = ['[fe]', 'button', 'modal', 'ui', 'layout', 'component', 'css', 'style', 'frontend', 'page', 'screen', 'tela', 'botão', 'ícone']

// ─── Helpers ──────────────────────────────────────────────────

function detectType(item: QAItem): 'BE' | 'FE' | 'FULL' | null {
  const text = `${item.title} ${item.notes ?? ''} ${item.type ?? ''}`.toLowerCase()
  const isBE = BE_KEYWORDS.some(k => text.includes(k))
  const isFE = FE_KEYWORDS.some(k => text.includes(k))
  if (isBE && isFE) return 'FULL'
  if (isBE) return 'BE'
  if (isFE) return 'FE'
  return null
}

function estimateMinutes(item: QAItem): number {
  const notesLen = (item.notes ?? '').length
  let minutes = 15

  if (notesLen > 60)  minutes += 10
  if (notesLen > 200) minutes += 10
  if (notesLen > 500) minutes += 15

  if (item.qaCategory === 'Bug Validation') minutes += 15
  if (item.qaCategory === 'Regression')     minutes += 10
  if (item.priority === 'Critical')         minutes += 10

  return Math.min(minutes, 90)
}

// ─── Main ranking function ────────────────────────────────────

export function rankItem(item: QAItem): RankResult {
  const text = `${item.title} ${item.notes ?? ''}`.toLowerCase()

  const priorityScore  = PRIORITY_SCORE[item.priority] ?? 10
  const categoryScore  = CATEGORY_SCORE[item.qaCategory] ?? 5

  let urgencyScore = 0
  for (const { words, score } of URGENCY_RULES) {
    if (words.some(w => text.includes(w))) {
      urgencyScore = Math.max(urgencyScore, score)
    }
  }

  const total            = priorityScore + categoryScore + urgencyScore
  const detectedType     = detectType(item)
  const estimatedMinutes = estimateMinutes(item)

  let tag      = ''
  let tagColor = ''

  if (item.priority === 'Critical' || urgencyScore >= 40) {
    tag      = '🔴 Crítico'
    tagColor = 'text-red-400 bg-red-500/10 border-red-500/15'
  } else if (item.qaCategory === 'Bug Validation') {
    tag      = '🐛 Bug'
    tagColor = 'text-red-300 bg-red-500/10 border-red-500/15'
  } else if (item.qaCategory === 'Regression') {
    tag      = '🔄 Regressão'
    tagColor = 'text-orange-300 bg-orange-500/10 border-orange-500/15'
  } else if (estimatedMinutes <= 20) {
    tag      = '⚡ Rápido'
    tagColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15'
  } else if (item.priority === 'High') {
    tag      = '🔶 Alta'
    tagColor = 'text-amber-400 bg-amber-500/10 border-amber-500/15'
  } else {
    tag      = '📋 Normal'
    tagColor = 'text-white/40 bg-white/[0.04] border-white/[0.08]'
  }

  return { score: total, estimatedMinutes, tag, tagColor, detectedType }
}

// ─── Sort by mode ─────────────────────────────────────────────

export function sortByRankMode(items: QAItem[], mode: RankSortMode): QAItem[] {
  if (mode === 'manual') return items

  const ranked = items.map(item => ({ item, rank: rankItem(item) }))

  switch (mode) {
    case 'fastest':
      return ranked
        .sort((a, b) => {
          const timeDiff = a.rank.estimatedMinutes - b.rank.estimatedMinutes
          if (timeDiff !== 0) return timeDiff
          return b.rank.score - a.rank.score
        })
        .map(r => r.item)

    case 'priority':
      return ranked
        .sort((a, b) => b.rank.score - a.rank.score)
        .map(r => r.item)

    case 'bugs':
      return ranked
        .sort((a, b) => {
          const bugScore = (x: typeof ranked[0]) => {
            if (x.item.qaCategory === 'Bug Validation') return x.rank.score + 200
            if (x.item.qaCategory === 'Regression')     return x.rank.score + 150
            return x.rank.score
          }
          return bugScore(b) - bugScore(a)
        })
        .map(r => r.item)

    default:
      return items
  }
}
