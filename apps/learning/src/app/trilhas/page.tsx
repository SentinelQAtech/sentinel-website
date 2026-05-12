import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { phases } from '@/lib/trilhas-data'

export const metadata: Metadata = { title: 'Trilhas' }

export default function Trilhas() {
  return (
    <div className="relative mx-auto max-w-4xl px-6 py-16">

      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-mono text-primary-400 uppercase tracking-widest">Trilha Principal</p>
        <h1 className="text-4xl font-black tracking-tight">Desenvolvimento Web com o Sentinel Core</h1>
        <p className="mt-3 text-white/40 max-w-xl mx-auto">
          7 fases progressivas usando o código real do Sentinel Core como material de estudo.
        </p>
      </div>

      <div className="space-y-3">
        {phases.map((p) => (
          <Link
            key={p.id}
            href={`/trilhas/${p.id}`}
            className="group flex items-start gap-5 glass rounded-2xl p-6 hover:border-white/10 transition-all hover:-translate-y-px"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${p.bg} ring-1 ${p.ring}`}>
              <span className={`font-mono text-sm font-bold ${p.textColor}`}>{p.id}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`text-base font-bold group-hover:${p.textColor} transition-colors`}>{p.title}</h2>
                <ArrowRight className={`h-4 w-4 shrink-0 text-white/20 group-hover:${p.textColor} group-hover:translate-x-0.5 transition-all`} />
              </div>
              <p className="mt-0.5 text-sm text-white/40 leading-relaxed">{p.tagline}</p>
              <p className="mt-2 text-xs text-white/30 leading-relaxed line-clamp-2">{p.why}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 glass rounded-2xl p-6 text-center">
        <p className="text-sm text-white/40">
          Complete cada exercício antes de avançar. Não precisa memorizar — precisa <span className="text-white/70">reconhecer</span>.
        </p>
      </div>
    </div>
  )
}
