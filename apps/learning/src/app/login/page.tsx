'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Eye, EyeOff, Loader2, Lock } from 'lucide-react'

function LoginForm() {
  const router  = useRouter()
  const params  = useSearchParams()
  const from    = params.get('from') ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Erro ao fazer login.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-violet-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20">
            <BookOpen className="h-7 w-7 text-primary-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Sentinel <span className="text-primary-400">Learning</span>
          </h1>
          <p className="mt-1.5 text-sm text-white/40">Plataforma interna · Acesso restrito</p>
        </div>

        <div className="glass rounded-2xl p-7">
          <div className="mb-6 flex items-center gap-2 text-xs text-white/40">
            <Lock className="h-3.5 w-3.5" />
            <span>Área restrita a colaboradores Sentinel Tech QA</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="sentinel"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-primary/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-white/20 outline-none transition focus:border-primary/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/20 font-mono">RC::0bfeeace</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
