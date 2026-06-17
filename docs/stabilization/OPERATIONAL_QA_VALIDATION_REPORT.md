# Operational QA Validation Report

Data: 17/06/2026
Branch: `stabilization/backend-source-of-truth-v1`

## Objetivo

Provar se o fluxo `QA Inbox -> Daily -> Board -> logout/login` funciona como ferramenta operacional real.

## Resultado curto

| Camada | Resultado |
| --- | --- |
| API/backend | Passou |
| Persistencia em banco | Passou |
| UI manual no browser | Bloqueada no login local |

## Cenario validado via API

Usuario local usado: `phase3qa@sentinel.local`

QA Item criado:

- ID: `b4ae84f3-98b3-45ba-9c30-b3066bd0cb80`
- Titulo: `Phase 3 Manual Validation 20260617-011850`

## Checklist solicitado

| Passo | Resultado | Evidencia |
| --- | --- | --- |
| 1. criar QA Item | Passou via API | `POST /api/v1/qa-items` criou o item |
| 2. refresh | Passou via API | `GET /api/v1/qa-items/:id` retornou o mesmo item |
| 3. enviar para Daily | Passou via API | `sentToDaily=true`, `dailyStatus=todo`, `workflowState=planned` |
| 4. marcar Doing | Passou via API | `dailyStatus=doing` |
| 5. ver no Board como In Testing | Passou via API | `workflowState=in_testing` e item retornou no filtro `workflowState=in_testing` |
| 6. mover para Blocked | Passou via API | `PATCH /workflow-state` com `blocked` |
| 7. ver Daily refletir Blocked | Passou via API | `dailyStatus=blocked`, `workflowState=blocked` |
| 8. marcar Done | Passou via API | `dailyStatus=done`, `workflowState=done` |
| 9. logout/login | Parcial | novo login via API emitiu novo JWT |
| 10. item continuar correto | Passou via API | apos novo login, item continuou `done`, `sentToDaily=true` |

## Evidencia final do estado

```json
{
  "id": "b4ae84f3-98b3-45ba-9c30-b3066bd0cb80",
  "createStatus": "Ready for QA",
  "createWorkflow": "inbox",
  "sentToDaily": true,
  "sentDailyStatus": "todo",
  "sentWorkflow": "planned",
  "doingDailyStatus": "doing",
  "doingWorkflow": "in_testing",
  "boardHasInTesting": true,
  "blockedDailyStatus": "blocked",
  "blockedWorkflow": "blocked",
  "doneDailyStatus": "done",
  "doneWorkflow": "done",
  "reloginDailyStatus": "done",
  "reloginWorkflow": "done",
  "reloginSentToDaily": true
}
```

## Problemas encontrados durante validacao

### 1. Banco sem migration da Phase 2

A API falhava antes de login/criacao porque o banco remoto ainda nao tinha a coluna `users.supabaseId`.

Acao executada:

- SQL da migration `20260617000000_add_qa_items` aplicado com `prisma db execute`.

Observacao:

- `prisma migrate deploy` nao pode ser usado diretamente porque o banco existente nao esta baselineado em Prisma Migrate (`P3005`).

### 2. Pooler Supabase + Prisma em ambiente local

Ao usar o pooler `aws-1-us-east-1.pooler.supabase.com:6543`, a API retornou erro de prepared statement:

```text
prepared statement "s0" already exists
```

Mitigacao usada para validacao:

- iniciar API local com conexao direta `db.<project-ref>.supabase.co:5432`.

### 3. Auth local do Core ignorava `NEXT_PUBLIC_AUTH_MODE=local`

Mesmo em modo local, o client tentava `supabase.auth.signInWithPassword`.

Acao executada:

- `apps/core/src/lib/auth-service.ts` agora usa `/auth/login` e `/auth/me` quando `NEXT_PUBLIC_AUTH_MODE=local`.

### 4. CSP bloqueava API local

O browser retornava `AxiosError: Network Error` porque `connect-src` nao permitia `http://localhost:3001`.

Acao executada:

- `apps/core/next.config.ts` agora inclui `NEXT_PUBLIC_API_URL` no `connect-src` em desenvolvimento.

### 5. UI manual ainda nao passou

Mesmo apos corrigir auth local e CSP, a tela de login ainda retornou `401` no browser durante a validacao automatizada. A mesma credencial passou via API direta.

Estado:

- fluxo operacional backend-first esta validado;
- validacao manual visual completa ainda esta bloqueada no login da UI;
- proximo passo deve focar exclusivamente em login local UI/browser.

## Conclusao

O eixo operacional de dados da Phase 2 esta funcionando no backend: o mesmo QA Item atravessa Daily e Board, muda estados corretamente e persiste apos novo login.

A ferramenta ainda nao pode ser declarada validada manualmente de ponta a ponta pela UI, porque o login local no browser segue falhando antes de entrar no workspace.

