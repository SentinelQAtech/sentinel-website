import Link from 'next/link'
import { ArrowRight, BookOpen, Code2, Zap, Users, Trophy } from 'lucide-react'

const phases = [
  { n: '01', title: 'TypeScript',       desc: 'Tipos, interfaces e por que o código tem ": string"',        color: 'from-blue-500/20 to-blue-600/10',   ring: 'ring-blue-500/20' },
  { n: '02', title: 'React + Hooks',    desc: 'Componentes, useState, useEffect e como a tela é montada',  color: 'from-cyan-500/20 to-cyan-600/10',    ring: 'ring-cyan-500/20' },
  { n: '03', title: 'Next.js',          desc: 'App Router, rotas, layouts e Server vs Client',              color: 'from-primary/20 to-primary/10',      ring: 'ring-primary/20' },
  { n: '04', title: 'Zustand',          desc: 'Gerenciamento de estado global sem complicação',             color: 'from-violet-500/20 to-violet-600/10', ring: 'ring-violet-500/20' },
  { n: '05', title: 'Tailwind CSS',     desc: 'Design system com classes utilitárias direto no HTML',      color: 'from-sky-500/20 to-sky-600/10',      ring: 'ring-sky-500/20' },
  { n: '06', title: 'APIs & Segurança', desc: 'Rotas de API, middleware, headers e variáveis de ambiente',  color: 'from-amber-500/20 to-amber-600/10',  ring: 'ring-amber-500/20' },
  { n: '07', title: 'Inteligência AI',  desc: 'Claude API, streaming SSE e prompts que funcionam',         color: 'from-rose-500/20 to-rose-600/10',    ring: 'ring-rose-500/20' },
]

const stats = [
  { icon: BookOpen, value: '7',         label: 'Trilhas de aprendizado' },
  { icon: Code2,    value: 'Real',      label: 'Código de produção' },
  { icon: Users,    value: 'Time',      label: 'Aprendizado coletivo' },
  { icon: Trophy,   value: '100%',      label: 'Gratuito e interno' },
]

export default function Home() {
  return (
    <div className="relative overflow-hidden">

      {/* Background effects */}
      <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-3xl rounded-full" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-primary-400" />
          <span className="text-xs text-primary-400 font-medium">Sentinel Tech QA · Plataforma Interna</span>
        </div>

        <h1 className="mb-6 text-5xl font-black tracking-tight md:text-7xl leading-none">
          Aprenda com o<br />
          <span className="gradient-text">projeto real.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/50 leading-relaxed">
          O Sentinel Learning usa o código que você já tem em produção como material de estudo.
          Cada fase ensina uma tecnologia real, com arquivos reais, exercícios reais.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/trilhas"
            className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors glow"
          >
            Começar agora
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/sobre"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white/70 hover:border-white/20 hover:text-white transition-colors"
          >
            Saiba mais
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center">
              <s.icon className="mx-auto mb-3 h-5 w-5 text-primary-400" />
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="mt-1 text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trilhas preview */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Trilha de Aprendizado</h2>
          <p className="mt-2 text-white/40">7 fases progressivas, do básico ao avançado</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {phases.map(p => (
            <Link key={p.n} href={`/trilhas/${p.n}`} className="group glass rounded-2xl p-5 hover:border-primary/30 transition-all hover:-translate-y-0.5">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} ring-1 ${p.ring}`}>
                <span className="font-mono text-xs font-bold text-white/70">{p.n}</span>
              </div>
              <h3 className="mb-1.5 font-semibold text-sm text-white group-hover:text-primary-400 transition-colors">{p.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{p.desc}</p>
            </Link>
          ))}

          {/* CTA card */}
          <Link href="/trilhas" className="group glass rounded-2xl p-5 border-dashed hover:border-primary/30 transition-all hover:-translate-y-0.5 flex flex-col items-center justify-center text-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary-400 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium text-primary-400">Ver trilha completa</span>
          </Link>
        </div>
      </section>

      {/* Quote */}
      <section className="relative mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="glass rounded-2xl px-8 py-10">
          <p className="text-xl font-medium text-white/80 italic leading-relaxed">
            "Não precisa saber construir o motor.<br />
            Mas saber como ele funciona faz de você um piloto muito melhor."
          </p>
          <p className="mt-4 text-sm text-white/30">— Sentinel Learning</p>
        </div>
      </section>

    </div>
  )
}
