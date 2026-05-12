import type { Metadata } from 'next'
import { BookOpen, Target, Users, Lightbulb } from 'lucide-react'

export const metadata: Metadata = { title: 'Sobre' }

const pillars = [
  { icon: Target,    title: 'Aprender fazendo',    desc: 'Cada conceito é ensinado com código real de produção. Sem exemplos genéricos — tudo que você aprende você já viu funcionando.' },
  { icon: Users,     title: 'Time primeiro',        desc: 'O Sentinel Learning foi criado para manter o time Sentinel Tech QA sempre atualizado e alinhado, independente do nível de cada um.' },
  { icon: Lightbulb, title: 'Progressivo',          desc: 'As trilhas respeitam o que você já sabe. Começa pelo TypeScript e vai até Inteligência Artificial — sem pular etapas.' },
  { icon: BookOpen,  title: 'Sempre atualizado',    desc: 'O material é baseado no projeto vivo. Quando o SPM evolui, o conteúdo de aprendizado também evolui.' },
]

export default function Sobre() {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-16">

      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-mono text-primary-400 uppercase tracking-widest">Sentinel Tech QA</p>
        <h1 className="text-4xl font-black tracking-tight">Sobre o Sentinel Learning</h1>
      </div>

      {/* Mission */}
      <div className="glass rounded-2xl p-8 mb-8 text-center">
        <p className="text-xl font-medium text-white/80 leading-relaxed">
          "Uma equipe que aprende junta evolui junta.<br />
          O Sentinel Learning é o espaço onde isso acontece."
        </p>
      </div>

      {/* Origin */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold">Como surgiu</h2>
        <div className="glass rounded-2xl p-6 space-y-3 text-sm text-white/60 leading-relaxed">
          <p>
            O Sentinel Learning nasceu de uma necessidade real: manter os profissionais da Sentinel Tech QA atualizados com as tecnologias que usam no dia a dia — sem precisar recorrer a cursos genéricos que não têm nada a ver com o trabalho de verdade.
          </p>
          <p>
            A ideia é simples: usar o <strong className="text-white/80">código real do Sentinel Project Manager</strong> como material de estudo. Cada trilha ensina uma tecnologia com exemplos dos arquivos que o time já conhece, já usa e já vê funcionando em produção.
          </p>
          <p>
            Nada de exemplos de <span className="font-mono text-white/40">todo list</span>. Aqui o exercício é abrir <span className="font-mono text-white/40">store/ai.ts</span> e entender como o Sentinel AI guarda as mensagens do chat.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold">Pilares</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {pillars.map(p => (
            <div key={p.title} className="glass rounded-2xl p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <p.icon className="h-4 w-4 text-primary-400" />
              </div>
              <h3 className="mb-1.5 font-semibold text-sm">{p.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signature */}
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-xs text-white/20 font-mono">Sentinel Tech QA · RC::0bfeeace</p>
        <p className="mt-1 text-xs text-white/30">Plataforma de aprendizado interno · {new Date().getFullYear()}</p>
      </div>

    </div>
  )
}
