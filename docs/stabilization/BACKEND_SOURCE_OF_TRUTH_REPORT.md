# Backend Source Of Truth Report

Data: 17/06/2026
Branch: `stabilization/backend-source-of-truth-v1`
Checkpoint: `b3dcb38`

## Objetivo

Transformar QA Items em entidade backend-first para que QA Inbox, Today/Daily e Board trabalhem sobre o mesmo registro operacional.

## Entregue

### Backend

- Criado modelo Prisma `QAItem`.
- Criada relacao opcional `Bug -> QAItem`.
- Adicionado `User.supabaseId` para ponte entre Auth Supabase e dados operacionais.
- Criada migration `20260617000000_add_qa_items`.
- Criado modulo Nest `QAItemsModule`.
- Criados endpoints protegidos por `JwtAuthGuard`:
  - `GET /qa-items`
  - `GET /qa-items/:id`
  - `POST /qa-items`
  - `POST /qa-items/import`
  - `PATCH /qa-items/:id`
  - `POST /qa-items/:id/send-to-daily`
  - `PATCH /qa-items/:id/workflow-state`
  - `PATCH /qa-items/:id/daily-status`
  - `PATCH /qa-items/:id/daily-order/:direction`
  - `POST /qa-items/:id/resolution`
  - `DELETE /qa-items/:id`

### Frontend

- Criado hook oficial `apps/core/src/hooks/useQAItems.ts`.
- QA Inbox passou a listar/importar/atualizar/arquivar via API.
- Daily QA Cockpit passou a consumir QA Items remotos filtrados por `sentToDaily` e `dailyDate`.
- Board passou a derivar cards de QA Items remotos e atualizar `workflowState` na API.
- `kanban.ts` ficou restrito a preferencias de colunas, nao a dados operacionais.
- `qa-importer.ts` permanece como legado para preferencias locais, historico e migracao.

## Fonte de verdade apos a Phase 2

| Area | Fonte de verdade |
| --- | --- |
| QA Items | API Nest / Prisma `qa_items` |
| QA Inbox | `/qa-items` |
| Daily QA Cockpit | `/qa-items?sentToDaily=true&dailyDate=...` |
| Board | `/qa-items` + `workflowState` |
| Resolucao/evidencia de QA | `qa_items.resolutionDetails` e `qa_items.evidence` |
| Bugs | API existente de Bugs, com relacao opcional futura para `qaItemId` |
| Reports | Ainda transicional |

## Decisoes tecnicas

- `workspaceId` foi criado como string obrigatoria e derivado de `user:{userId}` porque ainda nao existe entidade `Workspace`.
- O Core continua usando a API Nest como camada oficial, nao acesso direto ao Supabase Data API.
- A migration habilita RLS em `qa_items` para uso futuro via Supabase Data API.
- Policies usam `createdByAuthId = (select auth.uid())`, alinhado a recomendacao atual de performance e seguranca de policies.
- UPDATE tem policy propria com `USING` e `WITH CHECK`, preservando a regra de que leitura e atualizacao precisam estar autorizadas.

## Fora de escopo mantido

- Reports backend-only.
- Refactor completo de Bugs.
- Criacao de entidade `Workspace`.
- Migracao automatica de localStorage.
- Remocao da store legada.
- Colaboracao multiusuario real.

## Validacao executada

| Comando | Resultado |
| --- | --- |
| `npm.cmd run db:generate` | Passou |
| `npm.cmd run type-check:api` | Passou |
| `npm.cmd run type-check:core` | Passou |
| `npm.cmd run build:api` | Passou |
| `npm.cmd run build:core` | Passou com warnings preexistentes |
| `npm.cmd run test:e2e:core` | Nao concluiu: timeout apos 3 minutos |
| `npm.cmd run test:e2e:core -- tests/e2e/navigation.spec.ts --reporter=list` | Nao concluiu: timeout apos 3 minutos |

## Warnings observados

O build do Core segue emitindo warnings de lint em areas fora do escopo da Phase 2, principalmente Bugs, Dashboard, Calendar, Notifications, Projects e Reports. Nenhum deles bloqueou o build.

O Playwright nao retornou resultado util dentro do timeout local. A segunda tentativa deixou processos do runner/Next ativos, encerrados manualmente apos confirmacao por command line.

## Riscos restantes

| Risco | Impacto | Mitigacao |
| --- | --- | --- |
| Dados antigos ainda no localStorage | Usuario pode nao ver itens locais antigos no fluxo novo | Implementar migracao assistida |
| Reports ainda misturam fontes | Indicadores podem divergir do fluxo oficial | Migrar Reports para API |
| Bugs ainda nao nascem formalmente de FAIL/evidence | Pode haver duplicacao conceitual | Criar acao explicita "abrir bug a partir de QA Item" |
| Sem Workspace real | Sem colaboracao multiusuario robusta | Criar entidade Workspace em fase futura |

## Conclusao

A Phase 2 removeu o principal blocker arquitetural: QA Items agora existem no backend e as tres telas centrais do fluxo trabalham sobre a mesma entidade. O Sentinel ainda tem modulos transicionais, mas o eixo operacional `QA Inbox -> Daily -> Board` deixou de depender de localStorage como fonte principal.
