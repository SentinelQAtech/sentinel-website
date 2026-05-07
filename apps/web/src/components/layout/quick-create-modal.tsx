'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FolderKanban, Bug, Zap, CheckSquare, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type EntityType = 'task' | 'bug' | 'project' | 'sprint'

const ENTITY_TYPES: { id: EntityType; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { id: 'task',    label: 'Tarefa',   icon: <CheckSquare className="w-4 h-4" />,   color: '#6366f1', description: 'Item de trabalho no Kanban' },
  { id: 'bug',     label: 'Bug',      icon: <Bug className="w-4 h-4" />,            color: '#ef4444', description: 'Defeito ou problema reportado' },
  { id: 'project', label: 'Projeto',  icon: <FolderKanban className="w-4 h-4" />,  color: '#3b82f6', description: 'Novo projeto ou iniciativa' },
  { id: 'sprint',  label: 'Sprint',   icon: <Zap className="w-4 h-4" />,           color: '#8b5cf6', description: 'Ciclo ágil de desenvolvimento' },
]

const PRIORITIES = ['Crítico', 'Alto', 'Médio', 'Baixo']
const COMPANIES  = ['Concept-USA 🇺🇸', 'ABinBev-IND 🇮🇳', 'ScrumLaunch-UKR 🇺🇦']

interface QuickCreateModalProps {
  open: boolean
  onClose: () => void
}

export function QuickCreateModal({ open, onClose }: QuickCreateModalProps) {
  const [type, setType]           = useState<EntityType>('task')
  const [title, setTitle]         = useState('')
  const [priority, setPriority]   = useState('Médio')
  const [company, setCompany]     = useState(COMPANIES[0])
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const selected = ENTITY_TYPES.find(e => e.id === type)!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setTitle('')
      setDescription('')
      setPriority('Médio')
      setType('task')
      onClose()
    }, 1200)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[18vh] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="glass-card border border-white/[0.12] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: selected.color + '20', color: selected.color }}
                  >
                    {selected.icon}
                  </div>
                  <span className="text-sm font-semibold text-white/85">
                    Criar {selected.label}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Type selector */}
              <div className="flex gap-1 px-5 pt-4">
                {ENTITY_TYPES.map(et => (
                  <button
                    key={et.id}
                    onClick={() => setType(et.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                      type === et.id
                        ? 'text-white bg-white/[0.1] border border-white/[0.12]'
                        : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                    )}
                  >
                    <span style={{ color: type === et.id ? et.color : undefined }}>{et.icon}</span>
                    {et.label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                {/* Title */}
                <div>
                  <input
                    autoFocus
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={`Título ${type === 'bug' ? 'do bug' : type === 'project' ? 'do projeto' : type === 'sprint' ? 'do sprint' : 'da tarefa'}...`}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-150"
                    required
                  />
                </div>

                {/* Description */}
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descrição (opcional)..."
                  rows={2}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-150 resize-none"
                />

                {/* Priority + Company row */}
                <div className="flex gap-3">
                  {/* Priority */}
                  <div className="flex-1 relative">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">
                      Prioridade
                    </label>
                    <div className="relative">
                      <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/70 outline-none focus:border-white/20 transition-all duration-150 pr-7"
                      >
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="flex-1 relative">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">
                      Empresa
                    </label>
                    <div className="relative">
                      <select
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/70 outline-none focus:border-white/20 transition-all duration-150 pr-7"
                      >
                        {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    size="sm"
                    variant="glow"
                    loading={submitted}
                  >
                    {submitted ? 'Criando...' : `Criar ${selected.label}`}
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
