'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, Send, Sparkles, RotateCcw, ChevronDown, ChevronUp, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAIStore } from '@/store/ai'
import { useSentinelAI } from '@/hooks/useSentinelAI'
import { AIMessageItem } from './ai-message'
import { AIQuickActions } from './ai-quick-actions'

export function AIPanel() {
  const { isOpen, closePanel, messages, isStreaming, clearMessages } = useAIStore()
  const { send } = useSentinelAI()

  const [input,       setInput]       = useState('')
  const [showActions, setShowActions] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const handleSend = useCallback(async () => {
    const content = input.trim()
    if (!content || isStreaming) return
    setInput('')
    setShowActions(false)
    await send(content)
  }, [input, isStreaming, send])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = useCallback(async (prompt: string) => {
    setShowActions(false)
    await send(prompt)
  }, [send])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
          />

          {/* Side panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen z-50 w-[430px] max-w-[100vw] flex flex-col"
            style={{
              background:  'linear-gradient(180deg, rgba(9,13,22,0.99) 0%, rgba(6,9,17,1) 100%)',
              borderLeft:  '1px solid rgba(99,102,241,0.18)',
              boxShadow:   '-20px 0 60px rgba(0,0,0,0.55), -4px 0 24px rgba(99,102,241,0.1)',
            }}
          >
            {/* ── Header ───────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#090d16]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">Sentinel AI</span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
                      <Sparkles className="w-2 h-2" />
                      Claude
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-0.5">Operational Intelligence Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    title="Limpar conversa"
                    className="p-2 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={closePanel}
                  className="p-2 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 pb-10">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-primary/50" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-white/55">Sentinel AI está pronto</p>
                    <p className="text-xs text-white/28 max-w-[220px] leading-relaxed">
                      Pergunte sobre QA, Daily, sprints ou use as ações rápidas abaixo.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <AIMessageItem
                    key={msg.id}
                    message={msg}
                    isStreaming={
                      isStreaming &&
                      idx === messages.length - 1 &&
                      msg.role === 'assistant'
                    }
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick actions ─────────────────────────── */}
            <div className="border-t border-white/[0.05] shrink-0">
              <button
                onClick={() => setShowActions(o => !o)}
                className="w-full flex items-center justify-between px-5 py-2 text-[11px] text-white/28 hover:text-white/50 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" />
                  <span>Ações rápidas</span>
                </div>
                {showActions
                  ? <ChevronDown className="w-3 h-3" />
                  : <ChevronUp   className="w-3 h-3" />
                }
              </button>

              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden px-5 pb-3"
                  >
                    <AIQuickActions onSelect={handleQuickAction} disabled={isStreaming} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Input ─────────────────────────────────── */}
            <div className="px-4 pb-5 pt-2 border-t border-white/[0.05] shrink-0">
              <div className={cn(
                'flex gap-2 p-2 rounded-xl border transition-all duration-200',
                'bg-white/[0.03]',
                'border-white/[0.08] focus-within:border-primary/40 focus-within:bg-white/[0.04]',
              )}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte ao Sentinel AI…"
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 bg-transparent text-xs text-white/80 placeholder-white/20 resize-none outline-none leading-relaxed disabled:opacity-50"
                  style={{ maxHeight: '100px', minHeight: '20px' }}
                  onInput={e => {
                    const el = e.currentTarget
                    el.style.height = 'auto'
                    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 self-end transition-all duration-150',
                    input.trim() && !isStreaming
                      ? 'bg-primary/80 text-white hover:bg-primary shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                      : 'bg-white/[0.05] text-white/20',
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-white/15 text-center mt-2">
                Enter para enviar · Shift+Enter para nova linha
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
