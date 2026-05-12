'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { brandLogoIcon } from '@/lib/routes'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8 border border-white/[0.08]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center shadow-glow-md ring-1 ring-white/10 mb-4">
              <img src={brandLogoIcon} alt="Sentinel" className="h-9 w-9 object-contain" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-xl font-bold text-white text-center mb-1">Forgot password?</h1>
                <p className="text-sm text-white/40 text-center mb-6">We&apos;ll send you a reset link</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@sentinel.tech"
                    leftIcon={<Mail className="w-4 h-4" />}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" size="lg" variant="glow" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Send reset link
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Check your email</h2>
                <p className="text-sm text-white/50">
                  We&apos;ve sent a password reset link to<br />
                  <span className="text-white">{email}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-6">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
