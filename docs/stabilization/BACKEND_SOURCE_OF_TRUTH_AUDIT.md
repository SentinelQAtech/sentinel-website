# Backend Source Of Truth Audit

Data: 17/06/2026
Branch: `stabilization/backend-source-of-truth-v1`

## Respostas obrigatorias

| Pergunta | Resposta |
| --- | --- |
| Existe tabela para QA Items? | Nao antes desta fase. O schema tinha `Task` e `Bug`, mas nao `QAItem`. |
| Existe endpoint para QA Items? | Nao antes desta fase. Existia apenas `/api/qa-import` no Next e `/bugs/bulk-sync` na API Nest. |
| Existe hook React Query? | Nao antes desta fase. QA Items vinham de Zustand em `useQAImporterStore`. |
| Existe tipo compartilhado? | Parcialmente. `QAItem` existia em `apps/core/src/store/qa-importer.ts`, acoplado ao store. |
| Existe workspace_id? | Nao como entidade/tabela. Sera criado campo `workspaceId` string em `QAItem`. |
| Existe user_id/owner_id? | Sim em entidades existentes. Para QA Items sera usado `createdById`. |
| Existe RLS? | Nao ha migrations Supabase/RLS especificas para QA Items no repo. |
| O Core ja consulta algo parecido? | Sim, mas via Zustand/localStorage e sync parcial para Bugs. |
| Board/Daily/Bugs dependem do mesmo tipo? | Board e Daily dependem de `QAItem`; Bugs recebem derivacao via sync parcial. |

## Backend existente

### API

O backend principal fica em `apps/api` e usa Nest:

- `AuthModule`
- `UsersModule`
- `ProjectsModule`
- `BugsModule`
- `SprintsModule`
- `TasksModule`
- `NotificationsModule`
- `ReportsModule`

Todos os modulos operacionais protegidos usam `JwtAuthGuard`.

### Banco

O schema Prisma fica em `prisma/schema.prisma`.

Entidades existentes relevantes:

- `User`
- `Project`
- `Task`
- `Bug`
- `Sprint`
- `Notification`
- `ActivityLog`

Nao existia:

- `QAItem`
- `QAEvidence`
- `QABlocker`
- relacao formal `Bug -> QAItem`
- `Workspace`

## Frontend existente

### React Query

Hooks remotos existentes:

- `useAuth`
- `useBugs`
- `useProjects`
- `useSprints`
- `useReports`
- `useNotifications`

### Zustand

Stores criticas para QA:

- `qa-importer.ts`
- `daily.ts`
- `kanban.ts`

Estado antes da Phase 2:

- QA Inbox: `useQAImporterStore`
- Daily QA cockpit: `useQAImporterStore`
- Board: `useQAImporterStore`
- Reports: `useQAImporterStore` + API parcial

## Conclusao

A migracao precisa introduzir uma entidade backend nova e uma camada React Query dedicada. A store `qa-importer.ts` deve deixar de ser banco operacional e ficar apenas como legado para migracao local/manual.

