# SENTINEL CORE — AUDITORIA DE PRONTIDÃO OPERACIONAL

- **Data:** 2026-06-20
- **Branch auditada:** `stabilization/operational-corrections-sprint-1`
- **Escopo:** Sentinel Core (`apps/core`) + dependências (`apps/api`, `prisma/`)
- **Pergunta central:** *O Sentinel Core pode ser adotado hoje como o workspace operacional principal do Raphael por 30 dias, abandonando Notion/Trello/Jira-pessoal/Excel/Docs?*

> **Método:** inspeção completa do código-fonte + configuração da branch (todas as páginas, todos os stores, todos os hooks de dados, o serviço/seed da API e os documentos de evidência de produção do projeto). A navegação no app rodando **não** foi feita porque o único banco para o qual a API aponta é a instância de **produção do Supabase** (`apps/api/.env`) — uma auditoria de cliques teria gravado dados de teste no workspace real. Onde uma conclusão depende de comportamento em runtime, isso está indicado com o código que prova.

---

## Resumo Executivo

O Sentinel Core são **dois produtos vestindo a mesma pele.**

O primeiro produto — o **cockpit de execução de QA** (QA Inbox → Daily QA → Resolução → Board → Bugs/Sprints/Clientes) — é real, coeso e sustentado por uma API + Postgres ao vivo. Ele mapeia diretamente o trabalho real de QA, persiste e sobrevive a uma troca de dispositivo. Isso é genuinamente bom e genuinamente usável.

O segundo produto — o **"hub operacional pessoal"** que o briefing descreve (planejamento diário, tarefas pessoais, tracking de estudos, planejamento operacional, configurações, relatórios) — é em grande parte uma **casca em localStorage com várias telas não funcionais ou falsas.** O plano diário vive no cache de um único navegador, sem sincronização e sem backup. As Configurações não salvam nada. Os Relatórios mostram números errados sob um rótulo de "Dados reais". O "Atividade Recente / Live" do dashboard é um array vazio hardcoded. Reportar um bug manualmente falha em silêncio.

Resposta honesta para *"O Raphael consegue adotar isso hoje como seu workspace operacional principal?"*: **Ele consegue tocar o dia de QA aqui dentro. Ainda não consegue confiar nisso como a casa única de tudo, e não consegue apagar suas outras ferramentas.** O sistema está rachado ao meio entre uma espinha dorsal de nuvem confiável e uma camada local frágil e parcialmente falsa — e a metade frágil é exatamente a metade com que o briefing mais se importa.

---

## Nota de Prontidão Operacional

# 53 / 100

| Dimensão | Nota | Por quê |
|---|---|---|
| Operações de QA (importar→triar→executar→resolver) | 80 | Real, persistido, bem desenhado. A espinha dorsal do produto. |
| Integridade dos dados em nuvem (Projetos/Bugs/Sprints/Clientes/QA) | 70 | API + DB compartilhado reais; sobrevive a troca de dispositivo — mas é ponto único de falha, sem modo offline/degradado, e o próprio login morre se a API cair. |
| Planejamento diário / pessoal | 35 | UI funcional, mas só localStorage: sem sync, sem backup, risco de perda total silenciosa. |
| Confiança / honestidade da UI (faz o que diz) | 30 | Configurações é inerte; números do Relatório são velhos/errados; "Live" é fake; "Team online" é fake; reportar bug manual falha em silêncio. |
| Arquitetura de informação / modelo mental | 45 | Três conceitos diferentes de "tarefa" que não compartilham estado; "Tasks" redireciona para QA Inbox. |
| Onboarding de um workspace novo | 40 | Ovo-e-galinha escondido: não dá para criar projeto/tarefa sem um Cliente existir, sem nenhuma orientação. |

Só passa de 40 porque o núcleo de QA é legitimamente forte e persistido. Fica bem abaixo de "pronto" porque as telas que o briefing pergunta — *daily, pessoal, estudos, planejamento, relatórios, configurações* — são as mais fracas e menos confiáveis.

---

## Pontos Fortes

1. **O fluxo de QA é a coisa de verdade.** `src/components/qa-importer/qa-client.tsx` → `src/components/daily/qa-daily-cockpit.tsx` → diálogo de resolução é um pipeline coeso e opinativo: importar do Jira (extensão/CSV/colar), triar com filtros/agrupamento, "enviar para o Daily", um cockpit de execução focada com ranqueamento ("⚡ mais rápidas / 🎯 prioridade / 🐛 bugs primeiro") e um report de resolução estruturado que dá para copiar. Feito por alguém que de fato faz QA.
2. **A espinha de QA é persistida em nuvem num DB compartilhado.** QA items, Projetos, Bugs, Sprints, Clientes, Notificações e estatísticas de Relatórios passam todos pela API (`src/hooks/useQAItems.ts`, `src/hooks/useBugs.ts`, `src/hooks/useProjects.ts`) para um único Postgres. Troque de navegador/máquina e o trabalho de QA continua lá.
3. **Um board, várias lentes, estado consistente.** Kanban, QA Inbox e o cockpit de QA do Daily são todos visões sobre os *mesmos* QA items da API — arraste um card no board e o status fica correto no cockpit do Daily. As colunas padrão do Kanban são deliberadamente alinhadas ao enum `workflowState` do backend (`src/store/kanban.ts:5`).
4. **Funcionalidades de apoio reais:** Notificações (com polling de não-lidas), estatísticas de Relatórios, CRUD de Sprints, CRUD de Clientes/Empresas com mapa-múndi, busca ⌘K, copilot de IA ligado a uma rota Anthropic real.
5. **Casca visual polida e consistente.** Dark UI, agrupamento da sidebar (Daily Flow / Execution / Management / Analytics), empty states e trabalho de loading/animação acima da média para uma ferramenta interna.

---

## Achados P0 — Bloqueadores Operacionais

### P0-1 — O plano diário/pessoal vive no localStorage de um único navegador. Sem sync, sem backup, risco de perda total silenciosa.
As tarefas e reuniões manuais do planejador Daily (`src/store/daily.ts`, chave `sentinel-core-daily`), o Calendário, a config de colunas do Kanban e o Time são todos `zustand/persist` para `localStorage`, escopados por dispositivo (`src/lib/workspace-storage.ts`). Para uma ferramenta que pretende *substituir Notion/Trello/Excel na organização pessoal*, isso é desqualificante: limpar dados do navegador, trocar para o notebook ou usar outro browser → o plano pessoal inteiro some, sem aviso e sem recuperação. Não dá para fazer disso um "sistema de registro" quando o registro é um cache.

### P0-2 — "Reportar Bug" falha em silêncio.
O modal de criação da tela de Bugs hardcoda `projectId: defaultProject.id`, onde `defaultProject.id = 'manual-project'` (`src/store/bugs.ts:30`), e **não há seletor de projeto/cliente** no formulário. A API faz `prisma.bug.create({ data: { ...dto } })` (`apps/api/src/modules/bugs/bugs.service.ts:31`), e o seed **não contém `manual-project`** (só `proj-sentinel-core`, `proj-portal-uol`, `proj-ecommerce-concepta` — `prisma/seed.ts`). O POST bate numa falha de foreign key, e a mutation no cliente só tem `onSuccess`, sem `onError` (`src/components/bugs/bugs-client.tsx:75`) — o modal fica parado. Uma ação central de QA parece não fazer nada.

### P0-3 — Dependência total de um único backend, incluindo o login, com zero degradação graciosa.
Tudo que importa (auth, Projetos, Bugs, QA, Board, Sprints, Clientes, Relatórios, Notificações) é só-API, sem fallback em cache/offline. Se a API ou o Supabase ficarem indisponíveis, o `getCurrentUser` falha e o `AuthGuard` joga para o `/login` — que *também* precisa da API (`src/lib/auth-service.ts:39`). As páginas não degradam; mostram "Erro ao carregar…" ou ficam vazias. Depender disso exclusivamente por 30 dias significa que um soluço do backend = trancado para fora do dia operacional inteiro.

### P0-4 — O dashboard e o Relatórios distorcem ativamente a realidade.
O cabeçalho do dashboard afirma "Dados reais do seu workspace", mas "Atividade Recente" é um `const activities = []` hardcoded com um badge "Live" pulsante falso (`src/components/dashboard/recent-activity.tsx:22`), e "Team online" mostra membros do seed como permanentemente "online" (`src/components/dashboard/team-presence.tsx`). O Relatórios é rotulado "Dados reais / Atualizado em tempo real", mas puxa contagens de empresas e QA dos **stores localStorage deprecados** (`useCompaniesStore`, `useQAImporterStore`) enquanto os dados reais estão na API (`src/components/reports/reports-client.tsx:34`) — a maioria dos números ali vai ler 0 ou velho. Um operador que não confia nos números para de olhar para eles. É P0 porque envenena a confiança no sistema inteiro.

---

## Achados P1 — Alta Fricção

### P1-1 — Não existe uma "tarefa" única. Existem três, e elas não conversam.
`/tasks` redireciona para `/qa-inbox` (`src/app/(dashboard)/tasks/page.tsx`); o "+ Criar → Tarefa" global na verdade cria um **item de QA Inbox** (`src/components/layout/quick-create-modal.tsx:144`); as tarefas manuais da página Daily são uma lista localStorage *separada*; e o cockpit de QA do Daily é a lista da API. "Onde está minha tarefa?" não tem resposta única.

### P1-2 — A página Daily é ela mesma split-brain.
Numa só tela, tarefas/reuniões manuais vêm do localStorage enquanto o cockpit de QA-do-dia embutido vem da API (`src/components/daily/daily-client.tsx` + `src/components/daily/qa-daily-cockpit.tsx`). Elas nunca se fundem. Além disso, a visão "por prioridade" do Daily renderiza as tarefas como **texto puro não interativo** (sem toggle de status/edição) (`src/components/daily/daily-client.tsx:381`).

### P1-3 — Configurações é um mockup não funcional.
Cada toggle é `useState` local; "Salvar preferências" só troca um rótulo por 2s e não persiste nada; "Alterar senha", "Excluir conta" e o 2FA não têm comportamento algum (`src/app/(dashboard)/settings/page.tsx`). Só o Logout funciona.

### P1-4 — Ovo-e-galinha no onboarding.
Quick Create e Novo Projeto ficam `disabled` quando `clientOptions.length === 0` (clientes vêm da API `/clients`) — num workspace novo/vazio é impossível criar projeto ou tarefa até primeiro criar um Cliente pela página Empresas, sem nenhum aviso (`src/components/layout/quick-create-modal.tsx:283`, `src/components/projects/projects-client.tsx:321`).

### P1-5 — Deriva de identidade nos defaults hardcoded.
O usuário mock/`defaultReporter` do app é `raphael@sentinel.tech` id `'1'` (`src/store/bugs.ts:20`, `src/lib/mock-auth.ts`), mas o usuário real do seed é `Castilho_raphael@hotmail.com` id `user-raphael` (`prisma/seed.ts`). Identidade placeholder espalhada pelos fluxos de criação — origem do P0-2.

### P1-6 — "Arquivar e limpar board" perde o histórico.
A ação de arquivar do QA Inbox chama o delete da API por item mas nunca popula o `archivedSessions`/histórico de importação a partir do qual renderiza (`src/components/qa-importer/qa-client.tsx:281`); o painel "Sessões anteriores" é alimentado pelo store localStorage legado, desconectado do que foi de fato arquivado.

---

## Achados P2 — Melhorias

- **Colunas customizadas do Kanban são cosméticas e quebram movimentações.** "Nova coluna" cria `id: CUSTOM_<timestamp>` (`src/components/kanban/kanban-client.tsx:130`); arrastar um card para dentro dela envia essa string como `workflowState`, fora do enum do backend → movimentação rejeitada.
- **Métricas por cliente em Empresas (Projetos/QA Items/Bugs) leem o store localStorage morto de QA** (`src/app/(dashboard)/companies/page.tsx:54`) e mostram 0.
- **Time é dado de seed estático**, local-do-dispositivo, nunca no DB (`src/store/team.ts`) — ok como placeholder, enganoso como "Time".
- **Polimento de idioma/encoding:** rótulos PT/EN misturados ("Board", "Active Projects", "QA Inbox" vs "Relatórios") e strings sem acento ("Nao foi possivel", "Notificacoes", "Relatorios"). Cosmético, mas lê como inacabado para um usuário pt-BR.
- **Nenhuma superfície de notas / documentos / conhecimento** em lugar nenhum — relevante porque o briefing lista *tracking de estudos* e *planejamento operacional*, hoje sem casa além de uma tarefa do Daily com tipo `Study`.

---

## Simulação de Adoção de 30 Dias

**Dias 1–2 — Fricção de setup.** Login funciona (só porque o DB tem seed). Abre o Quick Create para adicionar uma tarefa; o botão está acinzentado. Confuso, acha Empresas, cria um cliente, e a criação passa a funcionar. Primeira impressão: "por que eu não pude simplesmente adicionar uma tarefa?"

**Semana 1 — O dia de QA encaixa.** É onde brilha. Importa cards do Jira para o QA Inbox, tria, manda o lote de hoje para o Daily, trabalha o cockpit focado, registra resoluções, copia reports. Persiste; parece o *seu* fluxo. Se o mês fosse só execução de QA, ele estaria feliz.

**Semana 1, as rachaduras.** Tenta abrir um bug avulso pela tela de Bugs → nada acontece (P0-2). Desliga notificações em Configurações e clica em Salvar → nada salvo (P1-3). Olha o dashboard → Atividade Recente permanentemente vazia com bolinha "Live" (P0-4). Abre Relatórios → números de QA/clientes zerados ou errados (P0-4). Cada um é um "peraí, isso é real?".

**Semana 2 — O susto da durabilidade.** Começa a colocar tarefas pessoais, estudos e planejamento no Daily. Abre o Core no notebook e o plano diário não está lá — dispositivo diferente, localStorage diferente (P0-1). Ou limpa cookies e perde uma semana. Para de confiar na camada pessoal/diária e volta a manter um doc no Notion "por garantia".

**Semanas 3–4 — Equilíbrio.** Assenta usando o Core como **cockpit de QA** (importar, executar, resolver, acompanhar bugs/sprints) — que faz bem — enquanto tarefas pessoais, notas, estudos e "qual meu plano real de hoje" voltam para Notion/Trello/Excel. O experimento de uso exclusivo falha, não porque a parte de QA seja ruim, mas porque as partes que deveriam absorver as operações *pessoais* são frágeis (localStorage) ou falsas (Configurações/Relatórios/Atividade).

- **O que frustra primeiro:** o botão de criar acinzentado (dia 1) e o "Reportar Bug" que falha em silêncio (semana 1).
- **O que manda de volta às ferramentas externas:** o susto de durabilidade do localStorage (semana 2) e a falta de qualquer superfície de notas/docs/estudos.

---

## Veredito Final

# PARCIALMENTE PRONTO

Como **cockpit de execução de QA**, o Sentinel Core é real, persistido e já melhor que um board genérico de Trello para esse trabalho específico — essa metade está perto de "pronta". Mas a auditoria perguntou se ele pode ser o **workspace operacional único e principal**, substituindo Notion/Trello/Jira-pessoal/Excel/Docs, e nessa pergunta a resposta é não — não hoje. A camada pessoal/diária é só-localStorage com risco de perda silenciosa (P0-1); as telas não-QA mais visíveis são não funcionais ou enganosas (P0-3/P0-4); uma ação central falha em silêncio (P0-2); e a coisa toda não degrada se o backend soluçar (P0-3).

### Caminho para "PRONTO PARA USO DIÁRIO" (concreto e não grande)

1. Mover o modelo de tarefas + reuniões do Daily/pessoal para trás da API (já existe um modelo de daily de QA item para espelhar) → durável e multi-dispositivo. Aposenta P0-1 e a maior parte de P1-1/P1-2.
2. Adicionar seletor de projeto/cliente ao "Reportar Bug" e `onError` em todo lugar onde criações podem falhar (P0-2, P1-5).
3. Fazer Configurações de fato persistir, ou esconder os controles que não persistem (P1-3).
4. Apontar Relatórios/widgets do dashboard para a API e remover os "Live"/"online" falsos, ou parar de rotular como "Dados reais" (P0-4).
5. Dar seed/orientação para o primeiro Cliente para que a criação não morra num workspace novo (P1-4).

Resolva esses cinco e isso vira uma ferramenta principal crível. Até lá: **adote para QA, mantenha as outras ferramentas para o resto.**

---

## Apêndice — Mapa de Persistência (split-brain)

**Em nuvem (API NestJS + Postgres/Supabase) — persiste e sincroniza entre dispositivos, mas requer backend online:**
Projetos, Bugs, QA Items (Inbox / Board / cockpit de QA do Daily), Clientes (Empresas), Sprints, Notificações, estatísticas de Relatórios, Auth.

**Local do dispositivo (localStorage via `zustand/persist`) — sem sync, sem backup:**
Tarefas e reuniões manuais do Daily, Calendário, config de colunas do Kanban, Time, layout do dashboard, i18n, histórico/sessões arquivadas do QA importer, e (obsoletos) contadores de Relatórios/Empresas.
