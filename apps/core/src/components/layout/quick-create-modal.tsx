'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FolderKanban, CheckSquare, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api-error'
import { useClientOptions } from '@/hooks/useClients'
import { useCreateProject } from '@/hooks/useProjects'
import { useCreateQAItem } from '@/hooks/useQAItems'

type EntityType = 'task' | 'project'

const ENTITY_TYPES: { id: EntityType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'task',    label: 'Tarefa',   icon: <CheckSquare className="w-4 h-4" />,  color: '#6366f1' },
  { id: 'project', label: 'Projeto',  icon: <FolderKanban className="w-4 h-4" />, color: '#3b82f6' },
]

const PRIORITIES = ['Crítico', 'Alto', 'Médio', 'Baixo']

function mapPriority(value: string) {
  if (value === 'Crítico') return 'Critical'
  if (value === 'Alto') return 'High'
  if (value === 'Baixo') return 'Low'
  return 'Medium'
}

function mapProjectPriority(value: string) {
  if (value === 'Crítico') return 'CRITICAL'
  if (value === 'Alto') return 'HIGH'
  if (value === 'Baixo') return 'LOW'
  return 'MEDIUM'
}

// Custom dark-themed select to avoid browser native white dropdown
function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  return (
    <div className="flex-1" ref={ref}>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1 block">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/70 outline-none hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-150"
        >
          <span>{value}</span>
          <ChevronDown className={cn('w-3 h-3 text-white/30 transition-transform duration-150', open && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{   opacity: 0, y: -4, scale: 0.97  }}
              transition={{ duration: 0.1 }}
              className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-white/[0.1] bg-surface-900 shadow-2xl overflow-hidden"
            >
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false) }}
                  className={cn(
                    'w-full text-left px-3 py-2 text-xs transition-colors',
                    value === opt
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/60 hover:bg-white/[0.06] hover:text-white/85'
                  )}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface QuickCreateModalProps {
  open: boolean
  onClose: () => void
}

export function QuickCreateModal({ open, onClose }: QuickCreateModalProps) {
  const { options: clientOptions } = useClientOptions()
  const createProject = useCreateProject()
  const createQAItem = useCreateQAItem()
  const [type, setType]           = useState<EntityType>('task')
  const [title, setTitle]         = useState('')
  const [priority, setPriority]   = useState('Médio')
  const [company, setCompany]     = useState('')
  const [description, setDescription] = useState('')

  const selected = ENTITY_TYPES.find(e => e.id === type)!
  const selectedClient = clientOptions.find(client => client.value === company) ?? clientOptions[0]
  const isPending = createProject.isPending || createQAItem.isPending
  const mutationError = createProject.error ?? createQAItem.error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (type === 'project') {
      createProject.mutate(
        {
          name: title.trim(),
          description: description.trim() || 'Projeto criado pelo Quick Create.',
          priority: mapProjectPriority(priority),
          clientName: selectedClient?.value,
          coverColor: selectedClient?.color ?? '#6366f1',
          tags: ['quick-create'],
        },
        { onSuccess: resetAndClose }
      )
      return
    }

    createQAItem.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        source: 'manual',
        clientName: selectedClient?.value,
        priority: mapPriority(priority),
        category: 'Other',
        status: 'Ready for QA',
        workflowState: 'inbox',
        metadata: { createdFrom: 'quick-create' },
      },
      { onSuccess: resetAndClose }
    )
  }

  const resetAndClose = () => {
    setTitle('')
    setDescription('')
    setPriority('Médio')
    setType('task')
    onClose()
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
            <div className="glass-card border border-white/[0.12] shadow-2xl">
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
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={`Título ${type === 'project' ? 'do projeto' : 'da tarefa'}...`}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-150"
                  required
                />

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
                  <SelectField
                    label="Prioridade"
                    value={priority}
                    options={PRIORITIES}
                    onChange={setPriority}
                  />
                  <SelectField
                    label="Empresa"
                    value={selectedClient?.value ?? '—'}
                    options={clientOptions.length > 0 ? clientOptions.map(client => client.value) : ['—']}
                    onChange={setCompany}
                  />
                </div>

                {clientOptions.length === 0 && (
                  <p className="text-[11px] text-white/35">
                    Nenhum cliente cadastrado — opcional. Você pode{' '}
                    <Link href="/companies" onClick={onClose} className="text-primary underline">cadastrar um cliente</Link>{' '}
                    para organizar por empresa.
                  </p>
                )}

                {mutationError && (
                  <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {getApiErrorMessage(mutationError)}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
                  >
                    Cancelar
                  </button>
                  <Button type="submit" size="sm" variant="glow" loading={isPending} disabled={isPending}>
                    {isPending ? 'Criando...' : `Criar ${selected.label}`}
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
