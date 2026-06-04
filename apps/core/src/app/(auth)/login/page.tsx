'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { brandLogoIcon } from '@/lib/routes'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/6 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8 border border-white/[0.08]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center shadow-glow-md ring-1 ring-white/10 mb-4">
              <img src={brandLogoIcon} alt="Sentinel" className="h-9 w-9 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white">Sentinel Core</h1>
            <p className="text-sm text-white/40 mt-1">Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@sentinel.tech"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              required
              autoComplete="email"
            />

            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              error={error}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              autoComplete="current-password"
            />

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                data-testid="login-error"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-primary" />
                <span className="text-xs text-white/50">Lembrar de mim</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              variant="glow"
              loading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-xs text-white/30">ou</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-white/15 text-white/70 text-sm font-medium hover:bg-white/[0.04] hover:border-white/25 hover:text-white transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </button>

          <p className="text-center text-xs text-white/40 mt-6">
            Não tem conta?{' '}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Criar conta
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          © 2026 Sentinel Tech. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  )
}
