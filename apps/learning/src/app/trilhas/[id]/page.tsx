import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, FileCode2, FlaskConical, BookOpen } from 'lucide-react'
import { getPhase, phases } from '@/lib/trilhas-data'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return phases.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const phase = getPhase(id)
  if (!phase) return {}
  return { title: `Fase ${phase.id} — ${phase.title}` }
}

export default async function TrilhaPage({ params }: Props) {
  const { id } = await params
  const phase = getPhase(id)
  if (!phase) notFound()

  return (
    <div className="relative mx-auto max-w-4xl px-6 py-12">

      {/* Back */}
      <Link
        href="/trilhas"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar às trilhas
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${phase.bg} ring-1 ${phase.ring}`}>
            <span className={`font-mono text-base font-bold ${phase.textColor}`}>{phase.id}</span>
          </div>
          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest">Fase {phase.id} de 07</p>
            <h1 className="text-3xl font-black tracking-tight">{phase.title}</h1>
          </div>
        </div>
        <p className="text-lg text-white/60 leading-relaxed">{phase.tagline}</p>
      </div>

      {/* Why it matters */}
      <section className={`mb-8 rounded-2xl border ${phase.borderColor} ${phase.bg} p-6`}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Por que importa</p>
        <p className="text-sm text-white/80 leading-relaxed">{phase.why}</p>
      </section>

      {/* Intro */}
      <section className="mb-10 glass rounded-2xl p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Contexto</p>
        <p className="text-sm text-white/70 leading-relaxed">{phase.intro}</p>
      </section>

      {/* Concepts */}
      <section className="mb-10">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wide">
          <CheckCircle2 className="h-4 w-4" /> Conceitos
        </h2>
        <div className="space-y-6">
          {phase.concepts.map((concept, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/[0.05]">
                <h3 className={`text-base font-bold mb-2 ${phase.textColor}`}>{concept.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{concept.explanation}</p>
              </div>
              {concept.code && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-black/30 border-b border-white/[0.04]">
                    <FileCode2 className="h-3.5 w-3.5 text-white/30" />
                    <span className="font-mono text-xs text-white/40">{concept.code.filename}</span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-xs text-white/70 font-mono leading-relaxed bg-black/20">
                    <code>{concept.code.code}</code>
                  </pre>
                  <div className="px-4 py-3 bg-white/[0.02] border-t border-white/[0.04]">
                    <p className="text-xs text-white/50 italic leading-relaxed">
                      <span className="text-white/30 not-italic font-semibold">Observe: </span>
                      {concept.code.note}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Files to explore */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wide">
          <FileCode2 className="h-4 w-4" /> Arquivos para explorar no Sentinel Core
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {phase.files.map((f, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <p className={`font-mono text-xs font-semibold mb-1.5 ${phase.textColor}`}>{f.path}</p>
              <p className="text-xs text-white/50 leading-relaxed">{f.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exercise */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wide">
          <FlaskConical className="h-4 w-4" /> Exercício
        </h2>
        <div className={`glass rounded-2xl overflow-hidden border ${phase.borderColor}`}>
          <div className="p-5">
            <p className="text-sm font-semibold text-white mb-4">{phase.exercise.prompt}</p>
            <ol className="space-y-2.5">
              {phase.exercise.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/60 leading-relaxed">
                  <span className={`shrink-0 font-mono text-xs font-bold mt-0.5 ${phase.textColor}`}>
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="px-5 py-4 bg-white/[0.02] border-t border-white/[0.05]">
            <p className="text-xs text-white/30 font-semibold uppercase tracking-wide mb-2">Resposta esperada</p>
            <p className="text-xs text-white/50 leading-relaxed">{phase.exercise.expected}</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {phase.prev ? (
          <Link
            href={`/trilhas/${phase.prev}`}
            className="group flex items-center gap-2 glass rounded-xl px-4 py-3 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Fase anterior</span>
          </Link>
        ) : (
          <div />
        )}

        {phase.next ? (
          <Link
            href={`/trilhas/${phase.next}`}
            className={`group flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${phase.bg} hover:opacity-80`}
          >
            <span>Próxima fase</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="glass rounded-xl px-4 py-3 text-sm text-white/50 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary-400" />
            <span>Trilha concluída!</span>
          </div>
        )}
      </div>
    </div>
  )
}
