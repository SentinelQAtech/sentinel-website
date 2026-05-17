'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { brandLogoIcon } from '@/lib/routes'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />

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
            <h1 className="text-xl font-bold text-white">Create your account</h1>
            <p className="text-sm text-white/40 mt-1">Join Sentinel Core</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full Name" placeholder="Raphael Castilho" leftIcon={<User className="w-4 h-4" />} required />
              <Input label="Username" placeholder="raphacastilho" required />
            </div>
            <Input label="Work Email" type="email" placeholder="you@company.com" leftIcon={<Mail className="w-4 h-4" />} required />
            <Input label="Organization" placeholder="Sentinel Tech" leftIcon={<Building2 className="w-4 h-4" />} />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              hint="Use at least 8 characters with letters and numbers."
              rightIcon={
                <button type="button" onClick={() => setShowPassword(s => !s)} className="hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" className="w-3.5 h-3.5 mt-0.5 rounded accent-primary" required />
              <label htmlFor="terms" className="text-xs text-white/50 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
              </label>
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" variant="glow" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-white/40 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
