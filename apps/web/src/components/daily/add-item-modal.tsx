'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useDailyStore,
  DEFAULT_CLIENTS, TASK_TYPES, PRIORITIES, STATUSES,
  type DailyType, type DailyPriority, type DailyStatus,
} from '@/store/daily'
import { useActiveCompanies } from '@/store/companies'
import { Button } from '@/components/ui/button'

interface AddItemModalProps {
  open:    boolean
  onClose: () => void
}

const inputCls = cn(
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5',
  'text-sm text-white placeholder:text-white/25 outline-none',
  'focus:border-white/20 focus:bg-white/[0.06] transition-all duration-150'
)

export function AddItemModal({ open, onClose }: AddItemModalProps) {
  const addTask = useDailyStore(s => s.addTask)
  const activeCompanies = useActiveCompanies()
  const companyOptions = activeCompanies.length > 0 ? activeCompanies.map(c => c.name) : DEFAULT_CLIENTS

  const [client,  setClient]  = useState(DEFAULT_CLIENTS[0])
  const [custom,  setCustom]  = useState('')
  const [title,   setTitle]   = useState('')
  const [type,    setType]    = useState<DailyType>('Daily')
  const [priority,setPriority]= useState<DailyPriority>('Medium')
  const [status,  setStatus]  = useState<DailyStatus>('todo')
  const [notes,   setNotes]   = useState('')
  const [resp,    setResp]    = useState('')

  const effectiveClient = custom.trim() || client

  const reset = () => {
    setClient(DEFAULT_CLIENTS[0]); setCustom(''); setTitle('')
    setType('Daily'); setPriority('Medium'); setStatus('todo')
    setNotes(''); setResp('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask({ client: effectiveClient, title: title.trim(), type, priority, status, notes: notes.trim() || undefined, responsible: resp.trim() || undefined })
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
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="glass-card border border-white/[0.12] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-white/85">Adicionar Tarefa</span>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
                {/* Client row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Cliente</label>
                    <div className="relative">
                      <select value={client} onChange={e => setClient(e.target.value)}
                        className={cn(inputCls, 'appearance-none pr-7 py-2')}>
                        {companyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="__custom">Outro...</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                  {client === '__custom' ? (
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Nome do cliente</label>
                      <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Ex: Google..."
                        className={cn(inputCls, 'py-2')} />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Responsável</label>
                      <input value={resp} onChange={e => setResp(e.target.value)} placeholder="Opcional..."
                        className={cn(inputCls, 'py-2')} />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Título *</label>
                  <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Descreva a tarefa..." className={inputCls} required />
                </div>

                {/* Type + Priority + Status */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Tipo', value: type, set: (v: string) => setType(v as DailyType), opts: TASK_TYPES },
                    { label: 'Prioridade', value: priority, set: (v: string) => setPriority(v as DailyPriority), opts: PRIORITIES },
                    { label: 'Status', value: status, set: (v: string) => setStatus(v as DailyStatus), opts: STATUSES },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">{field.label}</label>
                      <div className="relative">
                        <select value={field.value} onChange={e => field.set(e.target.value)}
                          className={cn(inputCls, 'appearance-none pr-6 py-2 text-xs')}>
                          {field.opts.map((o: string) => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">Notas</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Informações adicionais (opcional)..." rows={2}
                    className={cn(inputCls, 'resize-none')} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button type="button" onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all">
                    Cancelar
                  </button>
                  <Button type="submit" size="sm" variant="glow">
                    Adicionar Tarefa
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
