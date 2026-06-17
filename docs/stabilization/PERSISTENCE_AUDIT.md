# Persistence Audit

Data: 16/06/2026
Branch: `stabilization/operational-flow-v1`
Checkpoint inicial: `6731b4a`

## Resumo executivo

O Core ainda nao tem uma unica fonte de verdade operacional. A sessao ja foi estabilizada com Supabase Auth, mas o fluxo real de QA ainda depende bastante de stores Zustand persistidas no browser. Isso explica a sensacao de "nao sei se salvou" e o risco de comportamento diferente depois de refresh, troca de navegador ou limpeza de cache.

## Uso de localStorage direto

| Local | Uso | Classificacao | Risco |
| --- | --- | --- | --- |
| `apps/core/src/lib/auth-service.ts` | tokens auxiliares da API Nest | TRANSITIONAL | Medio; Supabase Auth ja e fonte real |
| `apps/core/src/lib/api.ts` | refresh token da API Nest | TRANSITIONAL | Medio; ponte pode falhar/offline |
| `apps/core/src/lib/socket.ts` | token/userId para notificacoes socket | TRANSITIONAL | Medio; depende da ponte API |
| `apps/core/src/lib/workspace-storage.ts` | escopo de storage por usuario | LEGACY/TRANSITIONAL | Alto para dados criticos |
| `apps/core/src/app/(dashboard)/team/page.tsx` | membros de time | LOCAL ONLY | Alto para gestao real |
| `apps/core/src/components/reports/reports-client.tsx` | leitura de time local | LOCAL ONLY | Medio; reports misturam fontes |
| `apps/core/src/components/dashboard/team-presence.tsx` | presenca/time local | LOCAL ONLY | Baixo a medio |

## Stores Zustand

| Store | Persistencia | Estado | Observacao |
| --- | --- | --- | --- |
| `auth.ts` | `sentinel-core-auth` | LEGACY | Convive com Supabase Auth; revisar uso remanescente |
| `qa-importer.ts` | `sentinel-core-qa-importer` com workspace storage | TRANSITIONAL | E o nucleo atual do QA Inbox, Daily sync, Board e Reports |
| `daily.ts` | `sentinel-core-daily` | LOCAL ONLY | Centro operacional atual, mas sem backend |
| `kanban.ts` | `sentinel-core-kanban` | TRANSITIONAL | Colunas locais; cards derivam de QA Items |
| `calendar.ts` | `sentinel-core-calendar` | LOCAL ONLY | Agenda local |
| `companies.ts` | store persistido | LOCAL ONLY | Clientes locais |
| `dashboard-layout.ts` | `sentinel-core-dashboard-layout` | REAL para UI | Preferencia visual, pode continuar local |
| `i18n.ts` | `sentinel-core-locale` | REAL para UI | Preferencia visual, pode continuar local |
| `team.ts` | localStorage custom | LOCAL ONLY | Time local |
| `bugs.ts` | nao persistido | LEGACY/TRANSITIONAL | Comentario aponta migracao para React Query/API |
| `projects.ts` | nao persistido | LEGACY/TRANSITIONAL | Comentario aponta migracao para React Query/API |
| `sprints.ts` | nao persistido | LEGACY/TRANSITIONAL | Usado por sync legado |
| `ai.ts` | memoria | REAL para UI temporaria | Sem persistencia critica |

## React Query e API

Hooks com API real/parcial:

- `useAuth.ts`
- `useBugs.ts`
- `useProjects.ts`
- `useSprints.ts`
- `useReports.ts`
- `useNotifications.ts`

Endpoints Nest encontrados:

- `/api/v1/auth`
- `/api/v1/bugs`
- `/api/v1/projects`
- `/api/v1/sprints`
- `/api/v1/tasks`
- `/api/v1/reports`
- `/api/v1/notifications`
- `/api/v1/users`

Endpoints Next internos encontrados:

- `/api/qa-import`
- `/api/qa-copilot`
- `/api/sentinel-ai`
- `/auth/callback`

## Persistencia critica local

Prioridade de migracao:

1. `qa-importer.ts`: QA Items, historico, resolucoes, envio para Today.
2. `daily.ts`: plano do dia, status, reunioes, blockers.
3. `kanban.ts`: estado visual de execucao, principalmente colunas customizadas.
4. `reports-client.tsx`: dados de relatorio vindos de stores locais.
5. `team/page.tsx`, `companies.ts`, `calendar.ts`: dados de gestao/suporte.

## Interacoes fake ou incompletas

| Item | Estado | Recomendacao |
| --- | --- | --- |
| Quick Create | Submete visualmente, mas nao cria entidade real | Remover da UI ate conectar API |
| Dashboard widgets | Misturam React Query e stores locais | Classificar widgets por confiabilidade |
| QA Importer sync | Tenta API e ignora erro silenciosamente | Exibir estado de sync/falha |
| Reports | Usa QA Importer local em parte da tela | Migrar para API apos QA Items oficiais |

## Conclusao

A maior fonte de instabilidade percebida nao e visual: e epistemica. O usuario nao consegue saber se um dado virou dado real, se ficou local, ou se apenas atualizou um widget. A estabilizacao deve comecar por reduzir as interacoes falsas e promover QA Inbox, Today, Execution, Evidence e Reports para um mesmo modelo persistido.

