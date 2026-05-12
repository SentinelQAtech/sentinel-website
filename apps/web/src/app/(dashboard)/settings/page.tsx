'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Moon, Globe, Bell, Shield,
  LogOut, Trash2, Check, ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-9 h-5 rounded-full border transition-all duration-200 shrink-0',
        checked
          ? 'bg-primary border-primary/80'
          : 'bg-white/[0.06] border-white/[0.1]'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm',
        checked ? 'translate-x-4' : 'translate-x-0'
      )} />
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card border border-white/[0.07] overflow-hidden">
      <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">{title}</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">{children}</div>
    </div>
  )
}

function SettingRow({
  icon: Icon, label, description, children, danger = false,
}: {
  icon: React.ElementType
  label: string
  description?: string
  children?: React.ReactNode
  danger?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
          danger ? 'bg-red-500/10' : 'bg-white/[0.05]'
        )}>
          <Icon className={cn('w-3.5 h-3.5', danger ? 'text-red-400' : 'text-white/40')} />
        </div>
        <div className="min-w-0">
          <p className={cn('text-sm font-medium', danger ? 'text-red-400' : 'text-white/80')}>{label}</p>
          {description && <p className="text-[11px] text-white/30 mt-0.5 truncate">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const router   = useRouter()
  const { logout } = useAuthStore()

  // Notificação prefs
  const [notifBugs,    setNotifBugs]    = useState(true)
  const [notifSprints, setNotifSprints] = useState(true)
  const [notifMentions,setNotifMentions]= useState(true)
  const [notifProjects,setNotifProjects]= useState(false)

  // Privacidade
  const [twoFactor,    setTwoFactor]    = useState(false)
  const [sessionAlert, setSessionAlert] = useState(true)

  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogout() {
    logout()
    router.push('/login')
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
        <h1 className="text-xl font-bold text-white">Configurações</h1>
      </div>

      {/* Aparência */}
      <Section title="Aparência">
        <SettingRow icon={Moon} label="Tema" description="Modo escuro — único tema disponível">
          <span className="text-xs text-white/30 bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 rounded-lg">
            Dark
          </span>
        </SettingRow>
        <SettingRow icon={Globe} label="Idioma" description="Português (Brasil)">
          <div className="flex items-center gap-1.5 text-white/30">
            <span className="text-xs">PT-BR</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </SettingRow>
      </Section>

      {/* Notificações */}
      <Section title="Notificações">
        <SettingRow icon={Bell} label="Bugs críticos" description="Alertas de novos bugs com severidade crítica">
          <Toggle checked={notifBugs} onChange={setNotifBugs} />
        </SettingRow>
        <SettingRow icon={Bell} label="Sprints" description="Início e término de sprints">
          <Toggle checked={notifSprints} onChange={setNotifSprints} />
        </SettingRow>
        <SettingRow icon={Bell} label="Menções" description="Quando alguém mencionar você em um comentário">
          <Toggle checked={notifMentions} onChange={setNotifMentions} />
        </SettingRow>
        <SettingRow icon={Bell} label="Atualizações de projeto" description="Mudanças de status em projetos que você participa">
          <Toggle checked={notifProjects} onChange={setNotifProjects} />
        </SettingRow>
      </Section>

      {/* Segurança */}
      <Section title="Privacidade e Segurança">
        <SettingRow icon={Shield} label="Autenticação em dois fatores" description="Camada extra de segurança na conta">
          <Toggle checked={twoFactor} onChange={setTwoFactor} />
        </SettingRow>
        <SettingRow icon={Shield} label="Alerta de novo login" description="Notificar ao detectar acesso de novo dispositivo">
          <Toggle checked={sessionAlert} onChange={setSessionAlert} />
        </SettingRow>
        <SettingRow icon={Shield} label="Alterar senha" description="Atualizar credenciais de acesso">
          <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            Alterar <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </SettingRow>
      </Section>

      {/* Save prefs */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={cn(
            'flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            saved
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
              : 'bg-primary text-white hover:bg-primary-600 shadow-[0_0_14px_rgba(99,102,241,0.3)]'
          )}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Salvo</> : 'Salvar preferências'}
        </button>
      </div>

      {/* Zona de perigo */}
      <Section title="Conta">
        <SettingRow
          icon={LogOut}
          label="Sair da conta"
          description="Encerrar sessão atual no Sentinel Core"
          danger
        >
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sair
          </button>
        </SettingRow>
        <SettingRow
          icon={Trash2}
          label="Excluir conta"
          description="Ação irreversível — remove todos os dados"
          danger
        >
          <button className="text-xs text-red-400/60 hover:text-red-400 border border-red-500/10 hover:border-red-500/25 px-3 py-1.5 rounded-lg transition-colors">
            Excluir
          </button>
        </SettingRow>
      </Section>
    </motion.div>
  )
}
