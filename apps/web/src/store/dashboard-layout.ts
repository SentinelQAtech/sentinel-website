import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WidgetSize   = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type WidgetHeight = '1' | '2' | '3' | '4'

export interface WidgetConfig {
  id:      string
  visible: boolean
  size?:   WidgetSize
  height?: WidgetHeight
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'daily',            visible: true  },
  { id: 'metrics',          visible: true  },
  { id: 'sentinel-ai',      visible: true  },
  { id: 'bug-trend',        visible: true  },
  { id: 'sprint',           visible: true  },
  { id: 'active-projects',  visible: true  },
  { id: 'team-presence',    visible: true  },
  { id: 'critical-bugs',    visible: true  },
  { id: 'recent-activity',  visible: true  },
  { id: 'calendar',         visible: true  },
  { id: 'qa-today',          visible: true  },
  { id: 'qa-quick-action',   visible: true  },
  { id: 'activity-heatmap',  visible: false },
  { id: 'burndown',          visible: false },
  { id: 'qa-donut',          visible: false },
]

interface DashboardLayoutState {
  layouts: Record<string, WidgetConfig[]>

  getLayout:       (userId: string) => WidgetConfig[]
  toggleWidget:    (userId: string, id: string) => void
  setWidgetSize:   (userId: string, id: string, size: WidgetSize | undefined) => void
  setWidgetHeight: (userId: string, id: string, height: WidgetHeight | undefined) => void
  reorderWidgets:  (userId: string, from: number, to: number) => void
  resetLayout:     (userId: string) => void
  importLayout:    (userId: string, layout: WidgetConfig[]) => void
}

function sanitize(raw: unknown): WidgetConfig[] {
  if (!Array.isArray(raw)) return [...DEFAULT_WIDGETS]
  const valid = (raw as unknown[]).filter(
    (w): w is WidgetConfig => w != null && typeof (w as WidgetConfig).id === 'string'
  )
  if (valid.length === 0) return [...DEFAULT_WIDGETS]
  const savedIds = new Set(valid.map(w => w.id))
  const merged = DEFAULT_WIDGETS.filter(w => !savedIds.has(w.id))
  return [...valid, ...merged]
}

export const useDashboardLayoutStore = create<DashboardLayoutState>()(
  persist(
    (set, get) => ({
      layouts: {},

      getLayout: (userId) => sanitize(get().layouts[userId]),

      toggleWidget: (userId, id) =>
        set(s => {
          const current = sanitize(s.layouts[userId])
          return {
            layouts: {
              ...s.layouts,
              [userId]: current.map(w => w.id === id ? { ...w, visible: !w.visible } : w),
            },
          }
        }),

      setWidgetSize: (userId, id, size) =>
        set(s => {
          const current = sanitize(s.layouts[userId])
          return {
            layouts: {
              ...s.layouts,
              [userId]: current.map(w => w.id === id ? { ...w, size } : w),
            },
          }
        }),

      setWidgetHeight: (userId, id, height) =>
        set(s => {
          const current = sanitize(s.layouts[userId])
          return {
            layouts: {
              ...s.layouts,
              [userId]: current.map(w => w.id === id ? { ...w, height } : w),
            },
          }
        }),

      reorderWidgets: (userId, from, to) =>
        set(s => {
          const current = sanitize(s.layouts[userId])
          const arr = [...current]
          const [moved] = arr.splice(from, 1)
          if (moved) arr.splice(to, 0, moved)
          return { layouts: { ...s.layouts, [userId]: arr } }
        }),

      resetLayout: (userId) =>
        set(s => ({
          layouts: { ...s.layouts, [userId]: [...DEFAULT_WIDGETS] },
        })),

      importLayout: (userId, layout) =>
        set(s => ({
          layouts: { ...s.layouts, [userId]: sanitize(layout) },
        })),
    }),
    {
      name: 'spm-dashboard-layout',
      version: 3,
    }
  )
)
