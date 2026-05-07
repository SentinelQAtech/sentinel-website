'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Video, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore, DEFAULT_REGIONS } from '@/store/daily'
import { Button } from '@/components/ui/button'

interface AddMeetingModalProps {
  open:    boolean
  onClose: () => void
}

const inputCls = cn(
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5',
  'text-sm text-white placeholder:text-white/25 outline-none',
  'focus:border-white/20 focus:bg-white/[0.06] transition-all duration-150'
)

export function AddMeetingModal({ open, onClose }: AddMeetingModalProps) {
  const addMeeting = useDailyStore(s => s.addMeeting)

  const [region,  setRegion]  = useState(DEFAULT_REGIONS[0])
  const [custom,  setCustom]  = useState('')
  const [time,    setTime]    = useState('')
  const [title,   setTitle]   = useState('')
  const [parts,   setParts]   = useState('')
  const [notes,   setNotes]   = useState('')

  const effectiveRegion = region === '__custom' ? custom.trim() : region

  const reset = () => {
    setRegion(DEFAULT_REGIONS[0]); setCustom(''); setTime('')
    setTitle(''); setParts(''); setNotes('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!time) return
    addMeeting({
      region:       effectiveRegion,
      time,
      title:        title.trim() || undefined,
      participants: parts.trim() || undefined,
      notes:        notes.trim() || undefined,
    })
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[18vh] left-1/2 -translate-x-1/2 w-full max-w-md z-50"
          >
            <div className="glass-card border border-white/[0.12] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-sm font-semibold text-white/85">Adicionar Reunião</span>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
                {/* Region + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Região</label>
                    <div className="relative">
                      <select value={region} onChange={e => setRegion(e.target.value)}
                        className={cn(inputCls, 'appearance-none pr-7 py-2')}>
                        {DEFAULT_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        <option value="__custom">Outra...</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Horário *</label>
                    <input autoFocus type="time" value={time} onChange={e => setTime(e.target.value)}
                      className={cn(inputCls, 'py-2')} required />
                  </div>
                </div>

                {region === '__custom' && (
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Nome da região</label>
                    <input value={custom} onChange={e => setCustom(e.target.value)}
                      placeholder="Ex: China, Austrália..." className={inputCls} />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Título</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Sprint Planning, Daily Scrum..." className={inputCls} />
                </div>

                {/* Participants */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Participantes</label>
                  <input value={parts} onChange={e => setParts(e.target.value)}
                    placeholder="Ex: Raphael, Shrest, Antonio..." className={inputCls} />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Notas</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Pauta ou informações relevantes..." rows={2}
                    className={cn(inputCls, 'resize-none')} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button type="button" onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all">
                    Cancelar
                  </button>
                  <Button type="submit" size="sm" variant="glow">
                    Adicionar Reunião
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
