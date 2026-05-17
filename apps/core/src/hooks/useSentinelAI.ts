'use client'

import { useCallback, useMemo } from 'react'
import { useAIStore } from '@/store/ai'
import { useDailyStore } from '@/store/daily'
import { useQAImporterStore } from '@/store/qa-importer'
import { useCalendarStore } from '@/store/calendar'
import { buildSentinelContext } from '@/lib/sentinelContextBuilder'

export function useSentinelContext() {
  const tasks    = useDailyStore(s => s.tasks)
  const meetings = useDailyStore(s => s.meetings)
  const qaItems  = useQAImporterStore(s => s.items)
  const events   = useCalendarStore(s => s.events)

  return useMemo(
    () => buildSentinelContext(tasks, meetings, qaItems, events),
    [tasks, meetings, qaItems, events],
  )
}

export function useSentinelAI() {
  const store   = useAIStore()
  const context = useSentinelContext()

  const send = useCallback(async (content: string) => {
    if (store.isStreaming) return

    // Build conversation history (non-empty messages only, last 12)
    const history = store.messages
      .filter(m => m.content.trim().length > 0)
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content }))

    // Add user message to UI
    store.addMessage({ role: 'user', content })
    // Add empty assistant placeholder
    const assistantId = store.addMessage({ role: 'assistant', content: '' })
    store.setStreaming(true)

    try {
      const response = await fetch('/api/sentinel-ai', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: [...history, { role: 'user', content }],
          context,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
        store.appendToMessage(
          assistantId,
          `❌ ${(err as { error?: string }).error ?? 'Erro ao conectar com Sentinel AI.'}`
        )
        return
      }

      const reader  = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') { store.setStreaming(false); return }
          try {
            const { text } = JSON.parse(data) as { text?: string }
            if (text) store.appendToMessage(assistantId, text)
          } catch { /* skip malformed */ }
        }
      }
    } catch {
      store.appendToMessage(assistantId, '❌ Falha na conexão com Sentinel AI.')
    } finally {
      store.setStreaming(false)
    }
  }, [store, context])

  return { ...store, send, context }
}
