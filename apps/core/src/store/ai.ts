import { create } from 'zustand'

export interface AIMessage {
  id:        string
  role:      'user' | 'assistant'
  content:   string
  timestamp: string
}

interface AIStore {
  isOpen:        boolean
  isPaletteOpen: boolean
  messages:      AIMessage[]
  isStreaming:   boolean

  togglePanel:    () => void
  openPanel:      () => void
  closePanel:     () => void
  togglePalette:  () => void
  closePalette:   () => void

  addMessage:       (msg: Omit<AIMessage, 'id' | 'timestamp'>) => string
  appendToMessage:  (id: string, text: string) => void
  setStreaming:     (v: boolean) => void
  clearMessages:    () => void
}

let _counter = 0

export const useAIStore = create<AIStore>((set) => ({
  isOpen:        false,
  isPaletteOpen: false,
  messages:      [],
  isStreaming:   false,

  togglePanel:   () => set(s => ({ isOpen: !s.isOpen, isPaletteOpen: false })),
  openPanel:     () => set({ isOpen: true, isPaletteOpen: false }),
  closePanel:    () => set({ isOpen: false }),
  togglePalette: () => set(s => ({ isPaletteOpen: !s.isPaletteOpen })),
  closePalette:  () => set({ isPaletteOpen: false }),

  addMessage: (msg) => {
    const id = `msg-${++_counter}-${Date.now()}`
    set(s => ({
      messages: [...s.messages, { ...msg, id, timestamp: new Date().toISOString() }],
    }))
    return id
  },

  appendToMessage: (id, text) =>
    set(s => ({
      messages: s.messages.map(m => m.id === id ? { ...m, content: m.content + text } : m),
    })),

  setStreaming:  (v) => set({ isStreaming: v }),
  clearMessages: ()  => set({ messages: [] }),
}))
