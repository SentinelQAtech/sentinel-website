export interface CodeBlock {
  filename: string
  code: string
  note: string
}

export interface Concept {
  title: string
  explanation: string
  code?: CodeBlock
}

export interface TrilhaExercise {
  prompt: string
  steps: string[]
  expected: string
}

export interface TrilhaPhase {
  id: string
  title: string
  tagline: string
  intro: string
  why: string
  concepts: Concept[]
  files: { path: string; why: string }[]
  exercise: TrilhaExercise
  color: string
  textColor: string
  bg: string
  ring: string
  borderColor: string
  prev: string | null
  next: string | null
}

export const phases: TrilhaPhase[] = [
  {
    id: '01',
    title: 'TypeScript',
    tagline: 'JavaScript que avisa o erro antes de você rodar.',
    color: 'blue',
    textColor: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
    borderColor: 'border-blue-500/30',
    prev: null,
    next: '02',

    why: 'Você já sabe JavaScript. TypeScript é a mesma linguagem — com um diferencial: o editor lê o seu código e grita antes de você abrir o browser. No Sentinel Core, uma função que espera um objeto com title e status não vai aceitar silenciosamente um número. O TypeScript impede isso em tempo de desenvolvimento.',

    intro: 'Todo o Sentinel Core é escrito em TypeScript. Quando você abre qualquer arquivo .ts ou .tsx, você está vendo JavaScript com anotações de tipo. O compilador usa essas anotações para detectar erros que, em JS puro, só apareceriam em produção — ou no relatório de bug de um cliente.',

    concepts: [
      {
        title: 'interface — a "forma" de um objeto',
        explanation: 'Uma interface descreve exatamente quais campos um objeto tem, e de que tipo é cada um. Se você tentar passar um objeto com campos diferentes, o TypeScript acusa erro antes de compilar. No Sentinel Core, cada mensagem do chat da IA segue a interface AIMessage.',
        code: {
          filename: 'src/store/ai.ts',
          code: `export interface AIMessage {
  id:        string
  role:      'user' | 'assistant'
  content:   string
  timestamp: string
}`,
          note: "role só aceita dois valores exatos: 'user' ou 'assistant'. Se você tentar passar 'admin', o TypeScript recusa na hora.",
        },
      },
      {
        title: 'Interfaces que descrevem ações, não só dados',
        explanation: 'Além de campos com dados, interfaces também descrevem funções. Essa é a assinatura do store de IA — como um contrato que garante que todo store de IA vai ter exatamente essas funções.',
        code: {
          filename: 'src/store/ai.ts',
          code: `interface AIStore {
  isOpen:      boolean
  messages:    AIMessage[]
  isStreaming: boolean

  togglePanel:   () => void
  addMessage:    (msg: Omit<AIMessage, 'id' | 'timestamp'>) => string
  appendToMessage: (id: string, text: string) => void
  setStreaming:  (v: boolean) => void
}`,
          note: "Omit<AIMessage, 'id' | 'timestamp'> significa: 'um AIMessage, mas sem os campos id e timestamp'. O store vai gerar esses dois automaticamente.",
        },
      },
      {
        title: 'Campos opcionais com ?',
        explanation: 'Nem todo objeto tem todos os campos. O ponto de interrogação marca um campo como opcional — TypeScript aceita o objeto mesmo sem ele, mas também sabe que ele pode ser undefined e avisa quando você tentar usá-lo sem verificar.',
        code: {
          filename: 'src/lib/sentinelContextBuilder.ts',
          code: `daily: {
  tasks: {
    client:   string
    title:    string
    type:     string
    priority: string
    status:   string
    notes?:   string   // opcional: nem toda task tem notas
  }[]
}`,
          note: 'notes?: string significa que o campo pode existir ou não. Se você tentar fazer task.notes.toLowerCase() sem checar, TypeScript avisa: "notes pode ser undefined".',
        },
      },
      {
        title: 'as const — congela um valor',
        explanation: 'Quando você usa as const, TypeScript trata cada campo como um literal exato, não como um tipo genérico. Isso é importante para variáveis de ambiente: o editor sabe exatamente quais campos existem e quais são opcionais.',
        code: {
          filename: 'src/lib/env.ts',
          code: `export const env = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  apiUrl:   process.env.NEXT_PUBLIC_API_URL   ?? 'http://localhost:3001',
  appName:  process.env.NEXT_PUBLIC_APP_NAME  ?? 'Sentinel Core',
  isDev:    process.env.NODE_ENV === 'development',
  isProd:   process.env.NODE_ENV === 'production',
} as const`,
          note: "Sem 'as const', isDev seria do tipo boolean. Com 'as const', TypeScript sabe que isProd e isDev nunca podem ser true ao mesmo tempo — e avisa se você tratar como se fossem.",
        },
      },
      {
        title: 'Tipagem de contexto complexo',
        explanation: 'No Sentinel Core, a interface SentinelContext descreve tudo que é enviado ao Claude. É um objeto aninhado — cada campo interno também tem sua própria forma definida. Isso garante que o modelo sempre receba dados no formato esperado.',
        code: {
          filename: 'src/lib/sentinelContextBuilder.ts',
          code: `export interface SentinelContext {
  today: string
  daily: {
    tasks:    { client: string; title: string; status: string }[]
    meetings: { region: string; time: string; title?: string }[]
    summary:  { total: number; done: number; blocked: number }
  }
  qa: {
    total:    number
    pending:  number
    critical: number
    items:    { issueKey: string; title: string; priority: string }[]
  }
}`,
          note: 'Veja como os arrays são tipados: tasks é um array de objetos com campos específicos. TypeScript garante que cada elemento do array siga esse formato.',
        },
      },
    ],

    files: [
      { path: 'src/store/ai.ts',                     why: 'Interfaces AIMessage e AIStore — o contrato do chat da IA' },
      { path: 'src/lib/env.ts',                       why: 'Padrão as const para variáveis de ambiente' },
      { path: 'src/lib/sentinelContextBuilder.ts',    why: 'Interface complexa e aninhada: SentinelContext' },
      { path: 'src/store/auth.ts',                    why: 'Interface AuthState com User como tipo externo' },
    ],

    exercise: {
      prompt: 'Abra src/store/ai.ts no Sentinel Core. Leia a interface AIMessage e a interface AIStore.',
      steps: [
        'Qual é o tipo do campo role na AIMessage? Quantos valores ele aceita?',
        'Encontre a função addMessage. O que é Omit<AIMessage, \'id\' | \'timestamp\'>?',
        'Por que addMessage retorna string e não void?',
        'Tente mentalmente: o que aconteceria se você chamasse addMessage com role: \'admin\'?',
      ],
      expected: "role aceita só 'user' | 'assistant'. addMessage retorna o ID gerado automaticamente (string). TypeScript recusaria 'admin' em tempo de desenvolvimento, antes de qualquer deploy.",
    },
  },

  {
    id: '02',
    title: 'React + Hooks',
    tagline: 'Funções que transformam dados em tela — e reagem quando os dados mudam.',
    color: 'cyan',
    textColor: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    ring: 'ring-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    prev: '01',
    next: '03',

    why: 'Você sabe manipular o DOM com JavaScript puro. React inverte a lógica: em vez de você ir ao DOM e atualizar elemento por elemento, você descreve o estado atual (dados) e o React atualiza o DOM sozinho. Quando o estado muda, a tela atualiza. Sem querySelector, sem innerHTML.',

    intro: 'No Sentinel Core, cada painel, botão e formulário é um componente React. Um componente é uma função que recebe dados (props) e retorna o HTML que deve aparecer. Quando algum dado muda, React chama a função de novo e a tela atualiza automaticamente.',

    concepts: [
      {
        title: 'Componente — função que retorna HTML (JSX)',
        explanation: 'Um componente é uma função JavaScript/TypeScript que retorna JSX — uma sintaxe parecida com HTML que React converte em elementos reais na tela. Props são os parâmetros dessa função: dados passados de fora para dentro.',
        code: {
          filename: 'src/components/ai/ai-panel.tsx (simplificado)',
          code: `'use client'

export function AIPanel() {
  // Retorna o painel completo da IA
  return (
    <div className="fixed right-0 h-full w-80">
      <h2>Sentinel AI</h2>
      {/* ... mensagens, input, botões ... */}
    </div>
  )
}`,
          note: "'use client' no topo significa que esse componente roda no browser. Sem essa linha, roda no servidor (Server Component).",
        },
      },
      {
        title: 'useState — memória local do componente',
        explanation: 'useState cria uma variável que o React "observa". Quando você chama o setter (a função que atualiza o valor), React sabe que precisa re-renderizar — chamar a função de novo e atualizar o DOM com o novo estado.',
        code: {
          filename: 'src/components/ai/ai-panel.tsx',
          code: `const [input,       setInput]       = useState('')
const [showActions, setShowActions] = useState(true)

// Para atualizar:
setInput('')           // limpa o campo de texto
setShowActions(false)  // esconde as quick actions`,
          note: 'useState retorna um array com dois itens: o valor atual e a função para atualizá-lo. A desestruturação [valor, setValor] é o padrão universal.',
        },
      },
      {
        title: 'useEffect — código que roda quando algo muda',
        explanation: 'useEffect recebe uma função e um array de dependências. Quando qualquer valor no array muda, React roda a função. Sem dependências [], roda só uma vez ao montar o componente. É onde você faz scroll automático, fetch de dados, timers.',
        code: {
          filename: 'src/components/ai/ai-panel.tsx',
          code: `// Scroll para o final sempre que chega nova mensagem
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])  // roda toda vez que 'messages' mudar

// Foca o input quando o painel abre
useEffect(() => {
  if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
}, [isOpen])  // roda toda vez que 'isOpen' mudar`,
          note: 'O array de dependências é o "gatilho". Se você esquecer ele, o efeito roda em todo render. Se colocar [] vazio, roda só uma vez — útil para inicialização.',
        },
      },
      {
        title: 'useRef — referência direta a um elemento',
        explanation: 'useRef cria uma referência que persiste entre renders sem causar re-render quando muda. É usado para acessar diretamente elementos do DOM (como focar um input, ou fazer scroll) — coisas que você faria com getElementById em JS puro.',
        code: {
          filename: 'src/components/ai/ai-panel.tsx',
          code: `const messagesEndRef = useRef<HTMLDivElement>(null)
const inputRef       = useRef<HTMLTextAreaElement>(null)

// Usar:
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
inputRef.current?.focus()`,
          note: 'O .current é onde o ref guarda o elemento real. O ? (optional chaining) evita erro se o elemento ainda não existir na tela.',
        },
      },
      {
        title: 'useCallback — memoriza uma função',
        explanation: 'useCallback evita recriar uma função em cada render. É relevante quando você passa funções para componentes filhos — sem useCallback, cada render cria uma nova referência de função, podendo causar renders desnecessários.',
        code: {
          filename: 'src/components/ai/ai-panel.tsx',
          code: `const handleSend = useCallback(async () => {
  const content = input.trim()
  if (!content || isStreaming) return
  setInput('')
  setShowActions(false)
  await send(content)
}, [input, isStreaming, send])  // recria só quando essas dependências mudam`,
          note: 'As dependências do useCallback funcionam igual ao useEffect: a função é recriada só quando algum desses valores muda.',
        },
      },
    ],

    files: [
      { path: 'src/components/ai/ai-panel.tsx',          why: 'useState, useEffect, useRef e useCallback juntos em um componente real' },
      { path: 'src/components/ai/ai-floating-button.tsx', why: 'Componente simples com useState' },
      { path: 'src/components/qa-importer/qa-card.tsx',  why: 'Componente com props — recebe dados de fora' },
      { path: 'src/app/(dashboard)/layout.tsx',          why: 'useEffect para verificar autenticação' },
    ],

    exercise: {
      prompt: 'Abra src/components/ai/ai-panel.tsx no Sentinel Core.',
      steps: [
        'Quantos useState existem no componente? Liste cada um com seu valor inicial.',
        'Encontre o useEffect que faz scroll automático. O que está no array de dependências?',
        'Por que inputRef e messagesEndRef usam useRef em vez de useState?',
        'O que acontece quando setShowActions(false) é chamado?',
      ],
      expected: 'Dois useState: input (string vazia) e showActions (true). O useEffect de scroll tem [messages] como dependência. useRef não causa re-render — ideal para referências ao DOM. setShowActions(false) esconde as quick actions após enviar uma mensagem.',
    },
  },

  {
    id: '03',
    title: 'Next.js App Router',
    tagline: 'A estrutura de pastas É a estrutura de URLs do seu site.',
    color: 'indigo',
    textColor: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    ring: 'ring-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    prev: '02',
    next: '04',

    why: "Você já fez APIs com Express ou similares — sabe o que são rotas e handlers. Next.js traz isso para o mesmo projeto que o frontend, eliminando servidores separados. Mais importante: no App Router, o servidor não é opcional. Componentes rodam no servidor por padrão, o que significa que chaves de API nunca chegam ao browser.",

    intro: "No Sentinel Core, a pasta src/app/ é tudo. Cada subpasta vira uma URL, cada page.tsx é a página, cada route.ts é uma API, e cada layout.tsx envolve as páginas da pasta. É um sistema de convenção: o nome do arquivo determina o comportamento.",

    concepts: [
      {
        title: "'use client' vs Server Component",
        explanation: "Por padrão, todo componente no App Router roda no servidor. O servidor renderiza o HTML e envia para o browser — seguro, rápido, sem expor código. 'use client' transforma o componente: ele passa a rodar no browser, permitindo useState, eventos de clique, e acesso ao DOM.",
        code: {
          filename: 'src/components/ai/ai-panel.tsx',
          code: `'use client'  // ← essa linha muda tudo

// Sem 'use client': não pode usar useState, onClick, etc.
// Com 'use client': roda no browser, pode usar todos os hooks

import { useState, useEffect } from 'react'
export function AIPanel() {
  const [input, setInput] = useState('')  // OK — é client component
  // ...
}`,
          note: "Se você tentar usar useState em um componente sem 'use client', o Next.js lança um erro de compilação. A regra é simples: estado e eventos = 'use client'.",
        },
      },
      {
        title: 'page.tsx — a página',
        explanation: "Cada pasta com um page.tsx vira uma rota. A pasta (dashboard) com parênteses não afeta a URL — é só uma forma de agrupar arquivos. O arquivo page.tsx dentro dela é o que o usuário vê quando acessa a URL.",
        code: {
          filename: 'Estrutura de pastas (src/app/)',
          code: `src/app/
├── page.tsx                    → /
├── layout.tsx                  → layout raiz (todo o site)
├── login/
│   └── page.tsx               → /login
├── (dashboard)/
│   ├── layout.tsx             → layout das páginas do dashboard
│   └── dashboard/
│       └── page.tsx           → /dashboard
└── api/
    └── sentinel-ai/
        └── route.ts           → /api/sentinel-ai`,
          note: "Pastas com (parênteses) são grupos de rota: organizam o código sem criar segmentos de URL. São invisíveis para o browser.",
        },
      },
      {
        title: 'layout.tsx — o envelope',
        explanation: "Um layout envolve todas as páginas da sua pasta. É onde ficam navbar, sidebar, verificação de autenticação — qualquer coisa que persiste entre páginas. O layout pai não re-renderiza quando você navega entre páginas filhas.",
        code: {
          filename: 'src/app/(dashboard)/layout.tsx (simplificado)',
          code: `'use client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificação de auth aqui — protege todas as páginas filhas
  return (
    <div>
      <Navbar />
      <main>{children}</main>  {/* página atual renderiza aqui */}
    </div>
  )
}`,
          note: "children é a página atual sendo exibida. O layout permanece — só o children muda quando o usuário navega.",
        },
      },
      {
        title: 'route.ts — API no mesmo projeto',
        explanation: "Um arquivo route.ts é uma API Route Handler. Ele exporta funções com o nome do método HTTP (GET, POST, DELETE). Roda 100% no servidor — variáveis de ambiente secretas ficam seguras aqui. O browser nunca vê esse código.",
        code: {
          filename: 'src/app/api/sentinel-ai/route.ts',
          code: `import { env } from '@/lib/env'

export async function POST(req: NextRequest) {
  const apiKey = env.anthropicApiKey  // variável secreta — segura aqui
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500 }
    )
  }
  // Chama o Claude, retorna streaming
}`,
          note: "env.anthropicApiKey nunca chega ao browser. Se você tentar importar esse arquivo em um componente 'use client', o Next.js avisa com erro.",
        },
      },
    ],

    files: [
      { path: 'src/app/',                             why: 'Explore toda a estrutura — entenda como pasta = URL' },
      { path: 'src/app/(dashboard)/layout.tsx',       why: 'Layout compartilhado com verificação de auth' },
      { path: 'src/app/dashboard/page.tsx',           why: 'Página do dashboard — Server Component' },
      { path: 'src/app/api/sentinel-ai/route.ts',     why: 'API Route Handler — roda no servidor, acessa a API key' },
    ],

    exercise: {
      prompt: "Olhe a estrutura de pastas em src/app/ do Sentinel Core.",
      steps: [
        "Por que a pasta (dashboard) tem parênteses? O que isso significa para a URL?",
        "Abra src/app/api/sentinel-ai/route.ts. Por que é seguro usar env.anthropicApiKey aqui?",
        "Se você criasse src/app/relatorios/page.tsx, qual seria a URL da nova página?",
        "Qual a diferença entre page.tsx e layout.tsx na mesma pasta?",
      ],
      expected: "(dashboard) é um grupo de rota — sem efeito na URL. A API key fica segura porque route.ts roda só no servidor. /relatorios seria a nova URL. page.tsx é o conteúdo da rota; layout.tsx envolve todas as páginas filhas e persiste na navegação.",
    },
  },

  {
    id: '04',
    title: 'Zustand',
    tagline: 'Estado global: qualquer componente lê ou escreve, sem passar dados por props.',
    color: 'violet',
    textColor: 'text-violet-400',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/20',
    borderColor: 'border-violet-500/30',
    prev: '03',
    next: '05',

    why: "Você já usou useState — estado local de um componente. O problema: se dois componentes precisam do mesmo dado, você precisa elevar o estado para o pai e passar via props por cada nível. Zustand resolve isso com um store global: qualquer componente acessa e atualiza diretamente, sem prop drilling.",

    intro: "No Sentinel Core, o Zustand gerencia o estado do chat da IA, a autenticação do usuário, as tarefas do daily, os itens de QA, e os eventos do calendário. Cada store é um objeto JavaScript com estado e funções para modificá-lo — qualquer componente pode usar esse store com um hook.",

    concepts: [
      {
        title: 'create() — criando o store',
        explanation: "A função create() recebe uma função que retorna o estado inicial e as funções que modificam esse estado. O resultado é um hook que você usa em qualquer componente para acessar o store.",
        code: {
          filename: 'src/store/ai.ts',
          code: `import { create } from 'zustand'

export const useAIStore = create<AIStore>((set) => ({
  // Estado inicial
  isOpen:      false,
  messages:    [],
  isStreaming: false,

  // Funções que atualizam o estado
  togglePanel: () => set(s => ({ isOpen: !s.isOpen })),
  openPanel:   () => set({ isOpen: true }),
  closePanel:  () => set({ isOpen: false }),
}))`,
          note: "set() é a função que atualiza o estado. Você passa um objeto parcial com os campos que quer mudar — Zustand faz o merge automaticamente.",
        },
      },
      {
        title: 'set() e get() — atualizando e lendo o estado',
        explanation: "set() atualiza o estado e dispara re-renders nos componentes que usam o store. Você pode passar um objeto diretamente ou uma função que recebe o estado atual — útil quando o novo valor depende do valor anterior.",
        code: {
          filename: 'src/store/ai.ts',
          code: `addMessage: (msg) => {
  const id = \`msg-\${++_counter}-\${Date.now()}\`
  set(s => ({
    messages: [...s.messages, { ...msg, id, timestamp: new Date().toISOString() }],
  }))
  return id  // retorna o ID para quem chamou
},

appendToMessage: (id, text) =>
  set(s => ({
    messages: s.messages.map(m =>
      m.id === id ? { ...m, content: m.content + text } : m
    ),
  })),`,
          note: "set(s => ...) recebe o estado atual como s. Essencial quando você precisa do valor anterior para calcular o próximo — como adicionar em um array.",
        },
      },
      {
        title: 'Usando o store em um componente',
        explanation: "Em qualquer componente, você importa o hook do store e desestrutura só os campos que precisa. Zustand é inteligente: o componente só re-renderiza quando os campos que ele leu mudarem.",
        code: {
          filename: 'src/components/ai/ai-panel.tsx',
          code: `import { useAIStore } from '@/store/ai'

export function AIPanel() {
  // Pega só o que precisa — render otimizado
  const { isOpen, closePanel, messages, isStreaming, clearMessages } = useAIStore()

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={clearMessages}>Limpar</button>
    </div>
  )
}`,
          note: "Se você desestruturar só messages e messages mudar, o componente re-renderiza. Se isOpen mudar mas esse componente não lê isOpen, não re-renderiza.",
        },
      },
      {
        title: 'persist() — salvando no localStorage',
        explanation: "O middleware persist() envolve o store e sincroniza o estado com o localStorage automaticamente. Quando o usuário recarrega a página, o estado é restaurado. Você pode usar partialize para persistir só parte do estado.",
        code: {
          filename: 'src/store/auth.ts',
          code: `import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      login:  (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'sentinel-core-auth',  // chave no localStorage
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)`,
          note: "partialize define quais campos são salvos. Sem ele, tudo é persistido — incluindo funções, o que causaria erros na restauração.",
        },
      },
    ],

    files: [
      { path: 'src/store/ai.ts',      why: 'Store sem persistência — estado de UI do chat da IA' },
      { path: 'src/store/auth.ts',    why: 'Store com persist() — mantém login entre recarregamentos' },
      { path: 'src/store/daily.ts',   why: 'Store das tarefas do daily com persist' },
      { path: 'src/store/calendar.ts',why: 'Store dos eventos do calendário' },
    ],

    exercise: {
      prompt: "Abra src/store/ai.ts no Sentinel Core.",
      steps: [
        "Encontre a função addMessage. O que ela faz com _counter antes de criar o ID?",
        "Por que addMessage retorna string? Quem usa esse retorno?",
        "Encontre appendToMessage. O que ela faz? Quando seria chamada?",
        "Compare store/ai.ts com store/auth.ts. Qual usa persist? Por quê faz sentido persistir auth mas não as mensagens do chat?",
      ],
      expected: "_counter++ gera um número único crescente. addMessage retorna o ID para que o caller possa depois chamar appendToMessage nessa mensagem específica (para streaming). appendToMessage adiciona texto ao final de uma mensagem existente — usada quando o Claude está gerando tokens. Auth persiste para não perder a sessão no F5; mensagens do chat são temporárias.",
    },
  },

  {
    id: '05',
    title: 'Tailwind CSS',
    tagline: 'Classes utilitárias direto no HTML — sem arquivos .css separados.',
    color: 'sky',
    textColor: 'text-sky-400',
    bg: 'bg-sky-500/10',
    ring: 'ring-sky-500/20',
    borderColor: 'border-sky-500/30',
    prev: '04',
    next: '06',

    why: "Com CSS tradicional, você escreve classes em arquivos .css separados e aplica nos elementos. Com Tailwind, as classes são o CSS — cada classe aplica uma única propriedade CSS. Em vez de criar .card { display: flex; padding: 1rem; }, você escreve className='flex p-4' direto no JSX. O resultado é um código mais rápido de escrever e muito mais fácil de ler — você vê o estilo e o conteúdo juntos.",

    intro: "O Sentinel Core tem um design system customizado em cima do Tailwind: cores surface-* (cinzas escuros), primary (índigo), e classes custom como glass e glow definidas no globals.css. Entender Tailwind é entender como cada elemento do Sentinel Core foi construído.",

    concepts: [
      {
        title: 'Layout: flex e grid',
        explanation: "flex e grid são os sistemas de layout do Tailwind. Com flex, você alinha itens em linha ou coluna. Com grid, cria grades bidimensionais. Os modificadores (items-, justify-, gap-) controlam o comportamento.",
        code: {
          filename: 'Exemplos de layout',
          code: `{/* Navbar: flex horizontal, space between, centralizado verticalmente */}
<div className="flex items-center justify-between h-16">
  <Logo />
  <Nav />
  <UserMenu />
</div>

{/* Grid de cards: 1 coluna no mobile, 3 no desktop */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>`,
          note: "md:grid-cols-3 é responsividade: abaixo do breakpoint md (768px), a grade tem 1 coluna. Acima, 3 colunas.",
        },
      },
      {
        title: 'Espaçamento: padding e margin',
        explanation: "p-4 aplica padding de 1rem em todos os lados. px-6 é padding horizontal (left e right). mt-2 é margin-top. O número é múltiplo de 4px: p-1 = 4px, p-4 = 16px, p-8 = 32px.",
        code: {
          filename: 'Exemplos de espaçamento',
          code: `{/* p-6 = 24px em todos os lados */}
<div className="p-6">Conteúdo interno</div>

{/* px-6 py-3 = 24px horizontal, 12px vertical */}
<button className="px-6 py-3">Botão</button>

{/* mb-4 mt-2 = margin bottom 16px, margin top 8px */}
<h2 className="mb-4">Título</h2>
<p className="mt-2 ml-4">Parágrafo deslocado</p>`,
          note: "A escala do Tailwind é consistente. Você não precisa memorizar os valores exatos — aprende a lógica (4px por unidade) e usa a referência.",
        },
      },
      {
        title: 'Cores e transparência',
        explanation: "Tailwind tem paletas de cores (blue, indigo, violet...) com shades de 50 a 950. A barra / adiciona transparência: bg-primary/10 é o fundo primary com 10% de opacidade. O Sentinel Core usa muito isso para o efeito glass.",
        code: {
          filename: 'src/styles/globals.css (padrão do Sentinel Core)',
          code: `/* Classe glass — definida no globals.css */
.glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
}

/* Uso no JSX: */
{/* bg-primary/10 = cor primary com 10% opacidade */}
<div className="glass rounded-2xl p-6">
  <span className="text-primary-400">Texto em índigo</span>
  <div className="bg-white/5 border border-white/10">...</div>
</div>`,
          note: "text-white/40 é branco com 40% opacidade — cria a hierarquia visual do design sem precisar de cores diferentes. Quanto menor o número, mais transparente.",
        },
      },
      {
        title: 'Estados: hover, focus, disabled',
        explanation: "Prefixos como hover: e focus: aplicam estilos condicionais. disabled: aplica quando o elemento está desabilitado. Você combina com qualquer classe utilitária.",
        code: {
          filename: 'Exemplo de botão do Sentinel Core',
          code: `<button
  disabled={loading}
  className="
    w-full rounded-xl bg-primary py-2.5
    text-sm font-semibold text-white

    hover:bg-primary-600        /* cor mais escura no hover */
    focus:ring-2                /* anel de foco para acessibilidade */
    focus:ring-primary/50
    disabled:opacity-50         /* semi-transparente quando disabled */
    disabled:cursor-not-allowed /* cursor de proibido */
    transition-colors           /* animação suave entre estados */
  "
>
  Entrar
</button>`,
          note: "transition-colors anima automaticamente qualquer mudança de cor — hover, focus, ou programática. Sem JavaScript.",
        },
      },
      {
        title: 'Cores customizadas do Sentinel Core',
        explanation: "O tailwind.config.ts do Sentinel Core define cores que não existem no Tailwind padrão: primary (baseado em índigo), surface-* (cinzas muito escuros para o dark theme), e shades específicas como primary-400, primary-600.",
        code: {
          filename: 'apps/core/tailwind.config.ts (trecho)',
          code: `theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#6366f1',  // indigo-500
        400: '#818cf8',      // mais claro
        600: '#4f46e5',      // mais escuro
      },
      surface: {
        900:  '#0f0f14',
        950:  '#09090e',     // fundo principal do Sentinel Core
        1000: '#050508',
      },
    },
  },
}`,
          note: "surface-950 é o fundo mais escuro do Sentinel Core — um preto azulado quase puro. Todas as classes surface-* são customizações que não existem no Tailwind padrão.",
        },
      },
    ],

    files: [
      { path: 'apps/core/tailwind.config.ts',   why: 'Cores customizadas do design system Sentinel' },
      { path: 'apps/core/src/styles/globals.css', why: 'Classes .glass, .glow, .dot-grid e variáveis CSS' },
      { path: 'src/components/navbar.tsx',     why: 'Layout flex, estados hover:, responsividade md:' },
      { path: 'src/app/login/page.tsx',        why: 'Uso extensivo de glass morphism e transparências' },
    ],

    exercise: {
      prompt: "Abra qualquer componente do Sentinel Core (sugestão: src/components/ai/ai-floating-button.tsx).",
      steps: [
        "Liste todas as classes do primeiro elemento. Separe: layout, espaçamento, cor, estado.",
        "Encontre uma classe com /. O que o número após a / representa?",
        "Abra tailwind.config.ts. Qual é o valor hex de primary?",
        "Mude temporariamente bg-primary para bg-red-500 em um componente. Salve e veja no browser. Desfaça.",
      ],
      expected: "/ representa opacidade (0-100%). primary é #6366f1 (indigo-500). A mudança de cor aparece imediatamente — o Tailwind recompila em menos de 1 segundo com hot reload.",
    },
  },

  {
    id: '06',
    title: 'APIs & Segurança',
    tagline: 'Como proteger chaves secretas e filtrar requisições maliciosas.',
    color: 'amber',
    textColor: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
    borderColor: 'border-amber-500/30',
    prev: '05',
    next: '07',

    why: "Você sabe fazer requisições HTTP — fetch, POST, headers. Aqui vai além: como o servidor protege as chaves que não podem vazar, como o middleware intercepta cada requisição antes de chegar nas rotas, e o que acontece quando alguém tenta abusar da API. Segurança não é um módulo separado — está no design de cada rota.",

    intro: "O Sentinel Core tem dois pontos de entrada para código externo: a API do Sentinel AI (que chama o Claude) e o middleware que inspeciona toda requisição. Analisar esses dois arquivos juntos dá uma visão completa de como uma aplicação Next.js se protege.",

    concepts: [
      {
        title: 'Variáveis de ambiente — secrets que não vão ao browser',
        explanation: "process.env acessa variáveis definidas no .env.local. Sem o prefixo NEXT_PUBLIC_, a variável nunca é incluída no bundle do browser. É o mecanismo fundamental para manter API keys, senhas de banco e outros secrets seguros.",
        code: {
          filename: 'src/lib/env.ts',
          code: `export const env = {
  // Sem NEXT_PUBLIC_: só no servidor
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,

  // Com NEXT_PUBLIC_: disponível no browser também
  apiUrl:  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Sentinel Core',
} as const`,
          note: "Se você importar env.anthropicApiKey em um componente 'use client', o Next.js avisa com erro. ANTHROPIC_API_KEY ficaria undefined no browser de qualquer forma — mas o aviso previne o erro silencioso.",
        },
      },
      {
        title: 'Route Handler — API com validação',
        explanation: "Toda rota de API é uma oportunidade de ataque. O handler do Sentinel AI valida o body, sanitiza o texto para remover scripts maliciosos, e retorna erros semânticos (400, 500) em vez de deixar o servidor crashar.",
        code: {
          filename: 'src/app/api/sentinel-ai/route.ts',
          code: `function sanitize(text: string): string {
  return text
    .replace(/<script[\\s\\S]*?<\\/script>/gi, '')  // remove scripts
    .replace(/<[^>]+>/g, '')                       // remove HTML
    .trim()
    .slice(0, 8_000)                               // limita tamanho
}

export async function POST(req: NextRequest) {
  const apiKey = env.anthropicApiKey
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500 }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }
  // ...
}`,
          note: "sanitize() é defesa contra XSS via input do usuário. slice(0, 8_000) previne que um input gigantesco gere custos absurdos na API do Claude.",
        },
      },
      {
        title: 'Middleware — o porteiro de toda requisição',
        explanation: "O arquivo middleware.ts roda antes de qualquer rota ou página. É onde o Sentinel Core verifica autenticação, aplica rate limiting, e pode bloquear requisições inválidas globalmente — sem repetir a lógica em cada rota individualmente.",
        code: {
          filename: 'src/middleware.ts (Sentinel Core)',
          code: `import { NextRequest, NextResponse } from 'next/server'

const PUBLIC = ['/login', '/api/auth']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Rotas públicas passam livre
  if (PUBLIC.some(p => path.startsWith(p))) return NextResponse.next()

  // Qualquer outra rota: verifica o token de sessão
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifySessionToken(token))) {
    const login = new URL('/login', req.url)
    login.searchParams.set('from', path)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
}`,
          note: "O searchParams.set('from', path) passa a URL original para o login. Após autenticar, o usuário é redirecionado de volta para onde queria ir.",
        },
      },
      {
        title: 'Status HTTP com significado',
        explanation: "Retornar o status correto não é formalidade — é comunicação. 401 diz 'você não está autenticado'. 403 diz 'você está autenticado mas não tem permissão'. 429 diz 'muitas requisições'. O cliente usa esses códigos para decidir o que fazer.",
        code: {
          filename: 'Tabela de status usados no Sentinel Core',
          code: `200 OK            → Requisição bem sucedida
400 Bad Request   → Body inválido (JSON malformado, campos faltando)
401 Unauthorized  → Token ausente ou expirado → redirecionar para login
403 Forbidden     → Token válido, mas sem permissão para esse recurso
429 Too Many Req  → Rate limit atingido → aguardar antes de tentar de novo
500 Server Error  → Erro inesperado no servidor`,
          note: "Retornar 200 com { error: 'algo deu errado' } no body é um anti-padrão: o cliente não consegue detectar o erro facilmente. Status HTTP é a interface correta para comunicar resultados.",
        },
      },
    ],

    files: [
      { path: 'src/middleware.ts',                     why: 'Intercepta toda requisição: auth check e rate limiting' },
      { path: 'src/lib/env.ts',                        why: 'Acesso tipado e centralizado a variáveis de ambiente' },
      { path: 'src/app/api/sentinel-ai/route.ts',      why: 'Validação de input, sanitização e chamada à API externa' },
      { path: 'next.config.ts',                        why: 'HTTP security headers: X-Frame-Options, nosniff' },
    ],

    exercise: {
      prompt: "Abra src/app/api/sentinel-ai/route.ts no Sentinel Core.",
      steps: [
        "Encontre a função sanitize. Que tipos de input malicioso ela remove?",
        "Por que o limite de 8.000 caracteres existe? O que aconteceria sem ele?",
        "O que retorna o handler se ANTHROPIC_API_KEY não estiver configurada?",
        "Abra src/middleware.ts. O que acontece com a URL quando o usuário não está autenticado?",
      ],
      expected: "sanitize() remove tags script e HTML genérico. Sem limite de tamanho, um usuário poderia enviar um texto enorme e gerar uma fatura enorme na Anthropic. Sem API key, retorna 500 com mensagem de erro. O middleware redireciona para /login?from=<url-original>, permitindo retorno após login.",
    },
  },

  {
    id: '07',
    title: 'Inteligência Artificial',
    tagline: 'Como o Claude recebe contexto real e responde palavra por palavra.',
    color: 'rose',
    textColor: 'text-rose-400',
    bg: 'bg-rose-500/10',
    ring: 'ring-rose-500/20',
    borderColor: 'border-rose-500/30',
    prev: '06',
    next: null,

    why: "Você já sabe fazer um fetch para uma API e receber JSON. A IA generativa adiciona dois conceitos novos: o system prompt (que define a personalidade e o contexto do modelo) e o streaming (que envia a resposta palavra por palavra, em vez de esperar ela ficar pronta). Juntos, criam a experiência de uma IA que 'pensa em tempo real'.",

    intro: "O Sentinel AI é construído em cima do Claude da Anthropic. O Sentinel Core envia o contexto atual do usuário (tarefas, QA items, reuniões) como parte do system prompt, fazendo o Claude responder com dados reais em vez de respostas genéricas. O streaming usa SSE (Server-Sent Events) para o texto aparecer token por token.",

    concepts: [
      {
        title: 'System prompt — a identidade do modelo',
        explanation: "O system prompt é uma instrução enviada antes de qualquer mensagem do usuário. Define a personalidade, o contexto, as capacidades e o comportamento do modelo. No Sentinel Core, o system prompt inclui quem é o Sentinel AI e todos os dados atuais do usuário.",
        code: {
          filename: 'src/app/api/sentinel-ai/route.ts',
          code: `function buildSystemPrompt(context: Record<string, unknown>): string {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return \`You are Sentinel AI, the operational intelligence layer
of the Sentinel Core.

Today is \${today}.

## Your Role
You are a QA & productivity assistant. You understand daily workflow,
QA priorities, sprint goals.

## Current Sentinel Context
\${JSON.stringify(context, null, 2)}

## Capabilities
- Analyze QA items, identify priorities
- Summarize Daily tasks and suggest execution order
- Generate test scenarios, regression checklists\`
}`,
          note: "JSON.stringify(context, null, 2) serializa todo o estado atual do Sentinel Core (tarefas, QA, reuniões) em texto legível. O Claude lê esse JSON como contexto para suas respostas.",
        },
      },
      {
        title: 'Context building — o que o Claude sabe',
        explanation: "A função buildSentinelContext agrega dados de vários stores Zustand e os formata para enviar ao Claude. É o que faz o Sentinel AI responder sobre 'suas tarefas de hoje' em vez de respostas genéricas.",
        code: {
          filename: 'src/lib/sentinelContextBuilder.ts',
          code: `export function buildSentinelContext(
  tasks:    DailyTask[],
  meetings: DailyMeeting[],
  qaItems:  QAItem[],
  events:   CalendarEvent[],
): SentinelContext {
  const today = new Date().toISOString().split('T')[0]

  const pendingQA  = qaItems.filter(i => !i.sentToDaily && i.qaCategory !== 'Done')
  const criticalQA = qaItems.filter(i => i.priority === 'Critical' && i.qaCategory !== 'Done')

  return {
    today,
    daily: {
      tasks: tasks.map(t => ({
        client:   t.client,
        title:    t.title,
        priority: t.priority,
        status:   t.status,
      })),
      summary: {
        total:    tasks.length,
        done:     tasks.filter(t => t.status === 'Done').length,
        blocked:  tasks.filter(t => t.status === 'Blocked').length,
      },
    },
    // ... qa, calendar
  }
}`,
          note: "O contexto é construído no momento do envio — o Claude sempre tem os dados mais recentes. Isso transforma um LLM genérico em um assistente que conhece sua realidade específica.",
        },
      },
      {
        title: 'Streaming — tokens chegando em tempo real',
        explanation: "A API do Claude suporta streaming: em vez de esperar a resposta completa, ela envia tokens (palavras/pedaços) um a um via SSE (Server-Sent Events). O browser lê esse fluxo e atualiza o texto da mensagem progressivamente.",
        code: {
          filename: 'src/app/api/sentinel-ai/route.ts (simplificado)',
          code: `const stream = await anthropic.messages.stream({
  model:      'claude-opus-4-5',
  max_tokens: 1024,
  system:     buildSystemPrompt(context),
  messages:   sanitizedMessages,
})

// Retorna um ReadableStream que envia dados conforme chegam
return new Response(
  new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          const text = chunk.delta?.text ?? ''
          controller.enqueue(new TextEncoder().encode(text))
        }
      }
      controller.close()
    }
  }),
  { headers: { 'Content-Type': 'text/event-stream' } }
)`,
          note: "ReadableStream é uma API nativa do browser (e do Node.js moderno). Em vez de uma resposta única, ela é um 'tubo' pelo qual os dados fluem. O cliente lê esse tubo conforme os dados chegam.",
        },
      },
      {
        title: 'Lendo o stream no cliente',
        explanation: "No browser, o hook useSentinelAI lê o ReadableStream do servidor e vai adicionando cada chunk ao conteúdo da mensagem. É por isso que o texto aparece progressivamente — cada token é uma atualização de estado.",
        code: {
          filename: 'src/hooks/useSentinelAI.ts (simplificado)',
          code: `const res = await fetch('/api/sentinel-ai', {
  method: 'POST',
  body:   JSON.stringify({ messages: allMessages, context }),
})

// Cria uma mensagem vazia — vai sendo preenchida
const msgId = addMessage({ role: 'assistant', content: '' })
setStreaming(true)

const reader = res.body!.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const text = decoder.decode(value)
  appendToMessage(msgId, text)  // adiciona cada chunk à mensagem
}
setStreaming(false)`,
          note: "appendToMessage(msgId, text) é o que faz o texto aparecer progressivamente. Cada chamada adiciona um pedaço ao conteúdo existente da mensagem.",
        },
      },
    ],

    files: [
      { path: 'src/lib/sentinelContextBuilder.ts',     why: 'O que é enviado ao Claude como contexto' },
      { path: 'src/app/api/sentinel-ai/route.ts',      why: 'System prompt, chamada ao Claude, streaming SSE' },
      { path: 'src/hooks/useSentinelAI.ts',            why: 'Como o browser lê o stream token por token' },
      { path: 'src/components/ai/ai-message.tsx',      why: 'Renderização de markdown das respostas do Claude' },
    ],

    exercise: {
      prompt: "Abra src/lib/sentinelContextBuilder.ts e src/app/api/sentinel-ai/route.ts no Sentinel Core.",
      steps: [
        "No contextBuilder: quais dados do Sentinel Core são enviados ao Claude? Liste as categorias principais.",
        "No route.ts: encontre onde o system prompt é construído. O contexto entra como string ou como objeto?",
        "Como o streaming funciona no nível mais simples? O que é um 'chunk'?",
        "Por que appendToMessage recebe o ID da mensagem em vez de só o texto?",
      ],
      expected: "O contexto inclui: tarefas do daily (com status/prioridade), reuniões, itens de QA (com pending/critical) e eventos do calendário. O contexto entra como JSON.stringify() — objeto virou string. Um chunk é um pedaço de texto (1-10 tokens) que chega antes de a resposta terminar. appendToMessage precisa do ID para saber qual mensagem atualizar — pode haver várias no histórico.",
    },
  },
]

export function getPhase(id: string): TrilhaPhase | undefined {
  return phases.find(p => p.id === id)
}
