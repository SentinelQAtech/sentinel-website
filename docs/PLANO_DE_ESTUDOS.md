# Plano de Estudos — Sentinel Project Manager
> Aprender com o projeto real. Cada fase usa código que você já tem rodando.

---

## Como usar este plano

1. Abra o VS Code no projeto (`d:/DEV/sentinel-project-manager/`)
2. Leia o conceito da fase
3. Abra os arquivos indicados e leia o código com calma
4. Faça o exercício prático — pode errar, pode pedir ajuda ao Claude
5. Só avance para a próxima fase quando o exercício fizer sentido

Não precisa memorizar nada. O objetivo é **reconhecer** quando ver, e **saber perguntar** quando não entender.

---

## Fase 1 — TypeScript: Por que o código tem ": string" e "interface"?

### O que é
TypeScript é JavaScript com tipos. Em vez de escrever `let nome = "Rapha"`, você escreve `let nome: string = "Rapha"`. Isso faz o editor avisar quando algo está errado antes de rodar.

### Por que usamos no SPM
Com TypeScript, quando você passa um `QAItem` para um componente, o editor sabe exatamente quais campos existem. Sem TypeScript, você só descobriria o erro no browser.

### Arquivos para abrir agora
```
apps/web/src/store/ai.ts           → veja os "type" e "interface" no topo
apps/web/src/lib/env.ts            → veja "as const" e tipos simples
apps/web/src/lib/sentinelContextBuilder.ts → veja interfaces complexas
```

### Conceitos para identificar nesses arquivos
- `interface Algo { campo: tipo }` — define a "forma" de um objeto
- `type X = Y | Z` — X pode ser Y ou Z
- `function f(param: string): number` — tipo do parâmetro e do retorno
- `as const` — congela um valor, impede alteração
- `Record<string, unknown>` — objeto com chaves string e valores desconhecidos

### Exercício
Abra `apps/web/src/store/ai.ts`. Encontre a interface que descreve uma mensagem do chat.
Responda: quais campos ela tem? Quais são obrigatórios? Algum é opcional (tem `?`)?

---

## Fase 2 — React: Componentes, Props e Hooks

### O que é
React é a biblioteca que transforma código em tela. Cada "peça" da interface é um componente — uma função que retorna HTML (chamado JSX).

### Por que usamos no SPM
Cada card do QA Importer, cada botão do painel da AI, cada linha do Daily — tudo é um componente React separado que recebe dados (props) e exibe algo na tela.

### Arquivos para abrir agora
```
apps/web/src/components/qa-importer/qa-card.tsx    → componente simples com props
apps/web/src/components/ai/ai-floating-button.tsx  → componente com estado (useState)
apps/web/src/components/ai/ai-panel.tsx            → componente complexo com vários hooks
apps/web/src/app/(dashboard)/layout.tsx            → useEffect para redirecionar
```

### Conceitos para identificar nesses arquivos
- `function MeuComponente({ prop1, prop2 }: Props)` — componente recebendo props
- `useState(valorInicial)` — estado local: `const [aberto, setAberto] = useState(false)`
- `useEffect(() => { ... }, [dependencias])` — roda código quando algo muda
- `useRef()` — referência a um elemento do DOM (ex: scroll automático)
- JSX: o HTML dentro do JavaScript — `<div className="...">texto</div>`

### Exercício
Abra `apps/web/src/components/ai/ai-quick-actions.tsx`.
Identifique: quantas quick actions existem? Como cada uma chega no componente? O que acontece quando você clica em uma? Tente mudar o texto de uma delas e veja o resultado no browser.

---

## Fase 3 — Next.js: Rotas, Layouts e Server vs Client

### O que é
Next.js é o framework que organiza o React em páginas, rotas e APIs. A estrutura de pastas **é** a estrutura de URLs do site.

### Por que usamos no SPM
`apps/web/src/app/dashboard/page.tsx` vira a URL `/dashboard`. O `(dashboard)/layout.tsx` envolve todas as páginas do painel com a sidebar e o header automaticamente.

### Arquivos para abrir agora
```
apps/web/src/app/                          → olhe a estrutura de pastas
apps/web/src/app/(dashboard)/layout.tsx   → layout compartilhado
apps/web/src/app/dashboard/page.tsx       → página do dashboard
apps/web/src/app/api/sentinel-ai/route.ts → API Route (roda no servidor)
apps/web/src/app/login/page.tsx           → página sem layout do dashboard
```

### Conceitos para identificar nesses arquivos
- `'use client'` no topo → roda no browser (pode usar hooks, eventos)
- Sem `'use client'` → roda no servidor (mais seguro, mais rápido)
- `(dashboard)` com parênteses → agrupa rotas sem afetar a URL
- `layout.tsx` → envolve todas as páginas dentro da pasta
- `page.tsx` → é a página em si
- `route.ts` → é uma API (não aparece na tela, responde JSON ou Stream)

### Exercício
Olhe a pasta `apps/web/src/app/`. Encontre onde está a página de `/qa-importer`.
Depois abra `apps/web/src/app/api/sentinel-ai/route.ts` e tente responder:
por que esse arquivo tem `'use server'` implícito? Por que a API key pode ficar aqui com segurança?

---

## Fase 4 — Zustand: O "cérebro" que guarda os dados

### O que é
Zustand é a biblioteca que guarda o estado global da aplicação. Pense como uma "memória compartilhada" que qualquer componente pode ler ou modificar.

### Por que usamos no SPM
Quando você adiciona um card no QA Importer, ele vai para o store do Zustand. Quando o Sentinel AI abre o painel, ele lê o store de QA para ter contexto. Os dados ficam disponíveis em qualquer tela sem precisar passar props.

### Arquivos para abrir agora
```
apps/web/src/store/ai.ts           → store mais simples (só UI)
apps/web/src/store/auth.ts         → store com persist (salva no localStorage)
```

### Conceitos para identificar nesses arquivos
- `create<TipoDoStore>()((set, get) => ({ ... }))` — cria o store
- `set({ campo: valor })` — atualiza o estado
- `get()` — lê o estado atual de dentro de uma função
- `persist(...)` — salva automaticamente no localStorage
- `useNomeDoStore()` — hook para usar o store em um componente

### Exercício
Abra `apps/web/src/store/ai.ts`.
Encontre a função que adiciona uma mensagem ao chat. O que ela recebe? O que ela retorna? Por que ela retorna um ID?
Depois encontre a função que atualiza o texto de uma mensagem em andamento (streaming).

---

## Fase 5 — Tailwind CSS: Escrever CSS sem sair do HTML

### O que é
Tailwind é um sistema de classes CSS utilitárias. Em vez de criar um arquivo `.css` com `.meu-botao { background: blue; padding: 8px }`, você escreve `className="bg-blue-500 p-2"` diretamente no componente.

### Por que usamos no SPM
Todo o visual dark, os efeitos glass, as animações — tudo é Tailwind. Facilita manter o padrão visual sem criar centenas de arquivos CSS.

### Arquivos para abrir agora
```
apps/web/src/components/error-boundary.tsx  → classes simples de layout
apps/web/src/components/ai/ai-panel.tsx     → classes de posicionamento fixo
apps/web/tailwind.config.ts                 → onde as cores custom do SPM são definidas
apps/web/src/styles/globals.css             → variáveis CSS e classes personalizadas
```

### Conceitos para identificar nesses arquivos
- `flex`, `grid`, `h-screen`, `w-full` → layout
- `bg-surface-950`, `text-white/70` → cores customizadas do SPM (definidas no tailwind.config)
- `p-4`, `px-6`, `mt-2` → espaçamento (padding e margin)
- `rounded-lg`, `border`, `shadow` → visual
- `hover:bg-white/10`, `transition-colors` → estados e animações
- `fixed`, `absolute`, `z-50` → posicionamento

### Exercício
Abra `apps/web/tailwind.config.ts`. Encontre onde a cor `surface-950` está definida.
Agora abra `apps/web/src/components/error-boundary.tsx` e mude `bg-surface-950` para `bg-red-950`.
Inicie o dev server (`npx next dev -p 3000`) e provoque um erro para ver a mudança.

---

## Fase 6 — APIs e Segurança: Como protegemos o sistema

### O que é
Uma API Route no Next.js é uma função que roda no servidor e responde requisições HTTP. É o que separa código seguro (com chaves secretas) do código que vai para o browser.

### Por que usamos no SPM
A chave da Anthropic (`ANTHROPIC_API_KEY`) nunca pode ir para o browser — qualquer um poderia roubá-la. Então criamos uma API Route no servidor que usa a chave e devolve só o resultado.

### Arquivos para abrir agora
```
apps/web/src/middleware.ts                   → o "porteiro" que filtra requests
apps/web/src/app/api/sentinel-ai/route.ts   → a rota que usa a API key
apps/web/src/lib/env.ts                      → acesso tipado às variáveis de ambiente
apps/web/next.config.ts                      → headers de segurança + o easter egg RC∴0bfeeace
apps/web/public/robots.txt                   → bloqueia buscadores
```

### Conceitos para identificar nesses arquivos
- `process.env.NOME_DA_VARIAVEL` → lê variáveis de ambiente (secrets)
- `request.headers.get('origin')` → de onde veio o request
- `NextResponse` com status `403`, `429` → respostas de erro com significado
- Headers HTTP: `X-Frame-Options`, `X-Content-Type-Options` → proteções do browser
- Rate limiting: contar requests por IP para bloquear spam

### Exercício
Abra `apps/web/src/middleware.ts`.
O que acontece se alguém fizer 16 requests em menos de 1 minuto?
O que o header `X-Sentinel-Forge` significa? (dica: está no `next.config.ts` com um comentário)

---

## Fase 7 — Inteligência Artificial: Como o Sentinel AI funciona

### O que é
O Sentinel AI usa a API da Anthropic (Claude) para responder perguntas. Em vez de esperar a resposta completa, usamos **streaming** — as palavras chegam em tempo real, como um chat.

### Por que usamos no SPM
Respostas de IA podem demorar 5-10 segundos. Com streaming, o usuário vê as palavras aparecerem imediatamente, tornando a experiência muito mais fluída.

### Arquivos para abrir agora
```
apps/web/src/lib/sentinelContextBuilder.ts  → monta o contexto (o que o Claude "sabe")
apps/web/src/app/api/sentinel-ai/route.ts   → recebe a pergunta, chama a Anthropic, retorna stream
apps/web/src/hooks/useSentinelAI.ts         → no browser, lê o stream e atualiza a tela
apps/web/src/components/ai/ai-message.tsx   → renderiza markdown das respostas
apps/web/src/components/ai/ai-panel.tsx     → a interface do chat
```

### Conceitos para identificar nesses arquivos
- `system prompt` → a "personalidade" e contexto que o Claude recebe
- `ReadableStream` → fluxo de dados contínuo (o streaming)
- `SSE (Server-Sent Events)` → protocolo para enviar dados em tempo real
- `JSON.stringify(context)` → converte os dados do SPM em texto para o Claude entender
- `buildSentinelContext(...)` → agrega dados de Daily, QA e Calendar para o Claude

### Exercício
Abra `apps/web/src/lib/sentinelContextBuilder.ts`.
Quais dados do SPM são enviados para o Claude? O que está no `dailySummary`?
Agora abra o painel do Sentinel AI no browser e faça uma pergunta sobre suas tarefas do dia. Você consegue imaginar qual parte do contexto o Claude usou para responder?

---

## Resumo da Jornada

| Fase | Conceito | Arquivo âncora |
|------|----------|----------------|
| 1 | TypeScript | `store/ai.ts` |
| 2 | React + Hooks | `components/ai/ai-panel.tsx` |
| 3 | Next.js App Router | `app/(dashboard)/layout.tsx` |
| 4 | Zustand | `store/auth.ts` |
| 5 | Tailwind CSS | `tailwind.config.ts` |
| 6 | APIs + Segurança | `middleware.ts` |
| 7 | IA + Streaming | `api/sentinel-ai/route.ts` |

---

## Dica final

Você não precisa entender **tudo** — precisa entender **o suficiente** para:
- Descrever o que quer com mais precisão
- Saber se o que foi feito faz sentido
- Conseguir fazer pequenas mudanças sozinho

O resto, a gente faz junto.

> *"Não precisa saber construir o motor. Mas saber como ele funciona faz de você um piloto muito melhor."*
