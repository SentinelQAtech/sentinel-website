'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, AtSign, Shield, Camera, Check, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const ROLE_LABEL: Record<string, string> = {
  ADMIN:          'Administrador',
  PROJECT_MANAGER:'Project Manager',
  QA_ANALYST:     'QA Analyst',
  QA_ENGINEER:    'QA Engineer',
  DEVELOPER:      'Developer',
  CLIENT_VIEWER:  'Client Viewer',
}

const ROLE_COLOR: Record<string, string> = {
  ADMIN:          'bg-red-500/15 text-red-400 border-red-500/25',
  PROJECT_MANAGER:'bg-violet-500/15 text-violet-400 border-violet-500/25',
  QA_ANALYST:     'bg-primary/15 text-primary border-primary/25',
  QA_ENGINEER:    'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  DEVELOPER:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  CLIENT_VIEWER:  'bg-white/[0.07] text-white/50 border-white/[0.1]',
}

function Field({
  label, value, onChange, icon: Icon, readOnly = false, placeholder,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  icon: React.ElementType
  readOnly?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            'w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-150',
            'bg-white/[0.04] border text-white placeholder:text-white/20',
            readOnly
              ? 'border-white/[0.04] text-white/40 cursor-default'
              : 'border-white/[0.08] focus:border-white/20 focus:bg-white/[0.06]'
          )}
        />
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateUser } = useAuthStore()

  const [name,     setName]     = useState(user?.name     ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [saved,    setSaved]    = useState(false)

  if (!user) return null

  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  function handleSave() {
    updateUser({ name: name.trim() || user!.name, username: username.trim() || user!.username })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
      </div>

      {/* Avatar card */}
      <div className="glass-card border border-white/[0.07] p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-violet-600/40 border border-primary/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <button
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-surface-800 border border-white/[0.12] flex items-center justify-center text-white/50 hover:text-white hover:bg-surface-700 transition-colors"
              title="Alterar foto"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{user.name}</h2>
            <p className="text-sm text-white/40 truncate mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                ROLE_COLOR[user.role] ?? ROLE_COLOR.CLIENT_VIEWER
              )}>
                {ROLE_LABEL[user.role] ?? user.role}
              </span>
              <span className="text-[10px] text-white/25">
                Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass-card border border-white/[0.07] p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white/70">Informações pessoais</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Nome completo"
            value={name}
            onChange={setName}
            icon={User}
            placeholder="Seu nome completo"
          />
          <Field
            label="Username"
            value={username}
            onChange={setUsername}
            icon={AtSign}
            placeholder="@username"
          />
          <Field
            label="E-mail"
            value={user.email}
            icon={Mail}
            readOnly
          />
          <Field
            label="Cargo"
            value={ROLE_LABEL[user.role] ?? user.role}
            icon={Shield}
            readOnly
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <p className="text-[11px] text-white/25">
            E-mail e cargo são gerenciados pelo administrador.
          </p>
          <button
            onClick={handleSave}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              saved
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                : 'bg-primary text-white hover:bg-primary-600 shadow-[0_0_14px_rgba(99,102,241,0.3)]'
            )}
          >
            {saved ? <><Check className="w-3.5 h-3.5" /> Salvo</> : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Status',     value: user.isActive ? 'Ativo' : 'Inativo', color: user.isActive ? 'text-emerald-400' : 'text-white/30' },
          { label: 'Último acesso', value: user.lastSeen ? new Date(user.lastSeen).toLocaleDateString('pt-BR') : 'Agora', color: 'text-white/70' },
          { label: 'ID',         value: `#${user.id.slice(-6).toUpperCase()}`, color: 'text-white/40' },
        ].map(stat => (
          <div key={stat.label} className="glass-card border border-white/[0.06] px-4 py-3 text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={cn('text-sm font-semibold', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
