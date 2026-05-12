import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = { title: 'Recursos' }

const sections = [
  {
    title: 'Documentação Oficial',
    color: 'text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/20',
    items: [
      { name: 'Next.js Docs',       desc: 'App Router, rotas, API routes, deployment',        href: 'https://nextjs.org/docs' },
      { name: 'React Docs',         desc: 'Componentes, hooks, estado e ciclo de vida',        href: 'https://react.dev' },
      { name: 'TypeScript Handbook',desc: 'Tipos, interfaces, generics — do básico ao avançado', href: 'https://www.typescriptlang.org/docs/handbook/' },
      { name: 'Tailwind CSS',       desc: 'Referência completa de classes utilitárias',        href: 'https://tailwindcss.com/docs' },
      { name: 'Zustand',            desc: 'Estado global simples e escalável',                 href: 'https://zustand.docs.pmnd.rs' },
    ],
  },
  {
    title: 'Qualidade de Software & QA',
    color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20',
    items: [
      { name: 'ISTQB Foundation',    desc: 'Fundamentos internacionais de teste de software',  href: 'https://www.istqb.org/certifications/certified-tester-foundation-level' },
      { name: 'Playwright',          desc: 'Automação de testes E2E moderna',                  href: 'https://playwright.dev' },
      { name: 'Testing Library',     desc: 'Testes de componentes React centrados no usuário', href: 'https://testing-library.com' },
      { name: 'Postman Learning',    desc: 'Testes de API, collections e automação',           href: 'https://learning.postman.com' },
    ],
  },
  {
    title: 'Inteligência Artificial',
    color: 'text-violet-400', bg: 'bg-violet-500/10', ring: 'ring-violet-500/20',
    items: [
      { name: 'Anthropic Docs',      desc: 'Claude API, modelos, streaming e boas práticas',   href: 'https://docs.anthropic.com' },
      { name: 'Prompt Engineering',  desc: 'Guia oficial da Anthropic para escrever prompts',  href: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    ],
  },
  {
    title: 'Ferramentas do Dia a Dia',
    color: 'text-amber-400', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20',
    items: [
      { name: 'Vercel Docs',         desc: 'Deploy, variáveis de ambiente, domínios',          href: 'https://vercel.com/docs' },
      { name: 'Git — Pro Book',      desc: 'Git do básico ao avançado, grátis e completo',     href: 'https://git-scm.com/book/pt-br/v2' },
      { name: 'MDN Web Docs',        desc: 'Referência completa de HTML, CSS e JavaScript',    href: 'https://developer.mozilla.org/pt-BR' },
      { name: 'Can I Use',           desc: 'Compatibilidade de recursos CSS/JS entre browsers', href: 'https://caniuse.com' },
    ],
  },
]

export default function Recursos() {
  return (
    <div className="relative mx-auto max-w-4xl px-6 py-16">

      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-mono text-primary-400 uppercase tracking-widest">Links Úteis</p>
        <h1 className="text-4xl font-black tracking-tight">Recursos</h1>
        <p className="mt-3 text-white/40 max-w-xl mx-auto">
          Documentações, ferramentas e referências curadas para o time Sentinel Tech QA.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map(s => (
          <div key={s.title}>
            <div className="mb-4 flex items-center gap-2">
              <div className={`h-5 w-1 rounded-full ${s.bg} ring-1 ${s.ring}`} />
              <h2 className={`text-sm font-semibold ${s.color}`}>{s.title}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {s.items.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass rounded-xl p-4 flex items-start justify-between gap-3 hover:border-white/10 transition-all hover:-translate-y-0.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{item.name}</p>
                    <p className="mt-0.5 text-xs text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-0.5 text-white/20 group-hover:text-primary-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
