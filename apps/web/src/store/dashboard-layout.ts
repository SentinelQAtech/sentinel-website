import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WidgetConfig {
  id:      string
  visible: boolean
}

// Default order and visibility — applied per user (keyed by userId)
const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'daily',          visible: true },
  { id: 'metrics',        visible: true },
  { id: 'sentinel-ai',    visible: true },
  { id: 'bug-trend',      visible: true },
  { id: 'sprint',         visible: true },
  { id: 'active-projects',visible: true },
  { id: 'team-presence',  visible: true },
  { id: 'critical-bugs',  visible: true },
  { id: 'recent-activity',visible: true },
  { id: 'calendar',       visible: true },
  { id: 'qa-today',        visible: true },
  { id: 'qa-quick-action', visible: true },
]

interface DashboardLayoutState {
  // layouts keyed by userId so each user has their own config
  layouts: Record<string, WidgetConfig[]>

  getLayout:      (userId: string) => WidgetConfig[]
  toggleWidget:   (userId: string, id: string) => void
  reorderWidgets: (userId: string, from: number, to: number) => void
  resetLayout:    (userId: string) => void
}

export const useDashboardLayoutStore = create<DashboardLayoutState>()(
  persist(
    (set, get) => ({
      layouts: {},

      getLayout: (userId) => {
        const saved = get().layouts[userId]
        if (!Array.isArray(saved)) return DEFAULT_WIDGETS

        const savedIds = new Set(saved.map(w => w.id))
        const newWidgets = DEFAULT_WIDGETS.filter(w => !savedIds.has(w.id))
        return [...saved, ...newWidgets]
      },

      toggleWidget: (userId, id) =>
        set(s => {
          const raw = s.layouts[userId]
          const current = Array.isArray(raw) ? raw : DEFAULT_WIDGETS
          return {
            layouts: {
              ...s.layouts,
              [userId]: current.map(w => w.id === id ? { ...w, visible: !w.visible } : w),
            },
          }
        }),

      reorderWidgets: (userId, from, to) =>
        set(s => {
          const raw = s.layouts[userId]
          const current = [...(Array.isArray(raw) ? raw : DEFAULT_WIDGETS)]
          const [moved] = current.splice(from, 1)
          current.splice(to, 0, moved)
          return { layouts: { ...s.layouts, [userId]: current } }
        }),

      resetLayout: (userId) =>
        set(s => ({
          layouts: { ...s.layouts, [userId]: DEFAULT_WIDGETS },
        })),
    }),
    {
      name: 'spm-dashboard-layout',
    }
  )
)
