# Bugs Preview Deploy Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar a API Nest separadamente e fazer Bugs carregar com seguranca no Preview do Core.

**Architecture:** Extrair configuracao compartilhada do Nest para um entrypoint serverless na raiz do monorepo, mantendo `AppModule` e `/api/v1`. Normalizar somente a fronteira de Bugs, permitir na CSP apenas a origem da API configurada e aceitar no CORS origens exatas mais aliases restritos do projeto Core.

**Tech Stack:** NestJS 10, Next.js 15, React Query, Axios, Vercel Functions, Prisma 6, TypeScript, Node test runner via tsx.

---

## File Map

- Create `apps/core/src/lib/bugs-contract.ts`: normalizacao e mensagem de erro de Bugs.
- Create `apps/core/src/lib/bugs-contract.test.ts`: regressao para os formatos e erros.
- Modify `apps/core/src/hooks/useBugs.ts`: consumir o normalizador.
- Modify `apps/core/src/components/bugs/bugs-client.tsx`: exibir erro util.
- Modify `apps/core/next.config.ts`: validar URL e liberar sua origem na CSP.
- Create `apps/api/src/config/cors.ts`: politica testavel de origens.
- Create `apps/api/src/config/cors.test.ts`: regressao para origens exatas e Preview.
- Create `apps/api/src/bootstrap.ts`: configuracao comum do Nest.
- Modify `apps/api/src/main.ts`: usar bootstrap compartilhado.
- Create `api/index.ts`: handler Vercel serverless.
- Create `vercel.json`: configuracao exclusiva do novo projeto API com raiz no monorepo.
- Modify `package.json`: comando de teste focado.
- Create `docs/stabilization/BUGS_PREVIEW_DEPLOY_FIX.md`: diagnostico, variaveis, deploy e rollback.

### Task 1: Bugs contract

- [ ] Criar testes que esperam pagina vazia para `[]` e `{ data: [] }`, preservam metadados e rejeitam payload invalido.
- [ ] Rodar `npm.cmd exec -- tsx --test apps/core/src/lib/bugs-contract.test.ts` e confirmar falha por modulo ausente.
- [ ] Implementar `normalizeBugsResponse(payload)` e `getBugsLoadErrorMessage(error)` sem mascarar 401, rede ou 5xx.
- [ ] Integrar o normalizador no `useBugs` e a mensagem no `BugsClient`.
- [ ] Rodar o teste novamente e confirmar sucesso.

### Task 2: CORS and CSP

- [ ] Criar testes para localhost configurado, producao do Core, alias Preview `sentinel-core-*.vercel.app`, origem hostil e requisicao sem origem.
- [ ] Rodar `npm.cmd exec -- tsx --test apps/api/src/config/cors.test.ts` e confirmar falha por modulo ausente.
- [ ] Implementar `isAllowedCorsOrigin(origin, configuredOrigins)` e integrar no bootstrap.
- [ ] Alterar a CSP para incluir `new URL(NEXT_PUBLIC_API_URL).origin` em desenvolvimento e producao; URL ausente em producao deve falhar no build em vez de usar localhost.
- [ ] Rodar os testes focados e confirmar sucesso.

### Task 3: Serverless API

- [ ] Extrair `configureApp(app)` e `createApp()` para `apps/api/src/bootstrap.ts`, preservando headers, prefixo, CORS, validation pipe e Swagger.
- [ ] Fazer `apps/api/src/main.ts` apenas criar a aplicacao e chamar `listen`.
- [ ] Criar `api/index.ts` com inicializacao singleton e export default do Express adapter.
- [ ] Criar `vercel.json` para `@vercel/node`, rotear todas as URLs ao handler e gerar Prisma no build.
- [ ] Rodar type-check/build locais da API.

### Task 4: Deploy and remote validation

- [ ] Criar o projeto Vercel `sentinel-core-api` com root no monorepo.
- [ ] Configurar `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, Supabase e `CORS_ORIGINS` sem registrar valores no Git.
- [ ] Publicar a API e validar health/Swagger, auth e `GET /api/v1/bugs`.
- [ ] Configurar `NEXT_PUBLIC_API_URL` em Preview e Production do `sentinel-core`.
- [ ] Redeployar o Core, abrir Preview, logar, abrir Bugs e atualizar a pagina.

### Task 5: Documentation and final gate

- [ ] Documentar URL, status/body observado, variaveis, commits esperados, CORS, auth, rollback e validacao manual.
- [ ] Rodar `npm.cmd run type-check:api`, `npm.cmd run type-check:core`, `npm.cmd run build:api`, `npm.cmd run build:core` e `git diff --check`.
- [ ] Revisar o diff para confirmar que os modulos fora do escopo nao mudaram.
- [ ] Commitar com `Fix bugs screen loading in preview deploy` e enviar a branch.
