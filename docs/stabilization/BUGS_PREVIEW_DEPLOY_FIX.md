# Bugs Preview Deploy Fix

Data/hora: 17/06/2026 18:50 BRT
Branch: `stabilization/operational-corrections-sprint-1`
Baseline antes da correcao: `7a72c15`
Commit esperado: `Fix bugs screen loading in preview deploy`

## Resultado

A tela Bugs foi validada no Preview consumindo a API Nest publica.

| Verificacao | Resultado |
| --- | --- |
| API publica | `https://sentinel-core-api.vercel.app` |
| Swagger | `GET /api/docs -> 200` |
| CORS Preview | `OPTIONS /api/v1/bugs -> 204` |
| Bugs autenticado | `GET /api/v1/bugs -> 200` |
| Contrato remoto observado | `{ data: Bug[], total, page, limit, totalPages }` |
| Preview validado | `https://sentinel-core-q1q8xozkz-castilho-raphael-5448s-projects.vercel.app` |
| Login no Preview | Passou com usuario tecnico e auth local |
| Tela Bugs | Passou, 1 bug renderizado |
| Refresh em Bugs | Passou, tabela persistiu |
| Empty state | Passou com filtro sem resultados |
| Erro de carregamento | Nao foi exibido durante chamadas saudaveis |

O console ainda registra falha do WebSocket legado porque nao existe um endpoint WebSocket configurado no Preview. Isso nao afetou o REST de Bugs e esta fora do escopo desta correcao.

## Causa raiz

1. `NEXT_PUBLIC_API_URL` existia no projeto Core, mas estava vazio no Preview.
2. Nao havia um deploy publico da API Nest.
3. O Core usava `http://localhost:3001` como fallback fora do ambiente local.
4. A CSP de producao nao liberava a origem configurada da API.
5. O CORS da API aceitava apenas origens exatas e rejeitava aliases dinamicos do Preview.
6. `useBugs` executava `data.data.map` e quebrava caso o backend respondesse um array simples.

## Correcao aplicada

### API

- Projeto Vercel separado: `sentinel-core-api`.
- Alias estavel: `https://sentinel-core-api.vercel.app`.
- Repositorio conectado: `SentinelQAtech/sentinel-website`.
- Entry point: `apps/api/api/index.ts`.
- O handler reutiliza `AppModule`, guards, pipes e prefixo `/api/v1`.
- `main.ts` e serverless usam o mesmo `createApp()`.
- CORS aceita origens exatas e aliases HTTPS com:
  - prefixo `sentinel-core-`;
  - sufixo `castilho-raphael-5448s-projects.vercel.app`.
- A conexao Prisma usa o pooler transacional do Supabase com `pgbouncer=true&connection_limit=1`.
- O bridge Supabase aceita `SUPABASE_SERVICE_ROLE_KEY` ou `SUPABASE_PUBLISHABLE_KEY`. A chave publica basta para validar o access token pelo Auth server e evita exigir privilegio administrativo.

### Core

- `NEXT_PUBLIC_API_URL` foi configurada em Production e no Preview desta branch.
- O Preview desta branch usa `NEXT_PUBLIC_AUTH_MODE=local` para validacao operacional sem credencial pessoal.
- Builds nao-locais falham de forma explicita quando `NEXT_PUBLIC_API_URL` esta ausente.
- A CSP inclui somente a origem HTTP(S) derivada da URL configurada.
- O hook normaliza `[]` e `{ data: [] }`.
- Payload fora desses contratos gera erro explicito.
- A tela diferencia falha de sessao, permissao, servidor, rede e contrato invalido.

## Variaveis Vercel

### sentinel-core-api

Obrigatorias em Production e nos Previews que publicarem a API:

| Variavel | Uso |
| --- | --- |
| `DATABASE_URL` | Pooler transacional Supabase para Prisma |
| `JWT_SECRET` | JWT interno |
| `JWT_EXPIRES_IN` | Duracao do access token |
| `JWT_REFRESH_SECRET` | Refresh token interno |
| `JWT_REFRESH_EXPIRES_IN` | Duracao do refresh token |
| `SUPABASE_URL` | Auth server Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Validacao remota do JWT Supabase |
| `CORS_ORIGINS` | Origens exatas separadas por virgula |
| `VERCEL_PREVIEW_HOST_SUFFIX` | Sufixo restrito dos aliases Preview |

Nao colocar valores dessas variaveis no Git. `SUPABASE_SERVICE_ROLE_KEY` e opcional e nao deve ser exposta ao Core.

### sentinel-core

| Ambiente | Variavel | Valor operacional |
| --- | --- | --- |
| Production | `NEXT_PUBLIC_API_URL` | `https://sentinel-core-api.vercel.app` |
| Preview da branch | `NEXT_PUBLIC_API_URL` | `https://sentinel-core-api.vercel.app` |
| Preview da branch | `NEXT_PUBLIC_AUTH_MODE` | `local` |

## Contrato de Bugs

Resposta paginada:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 20,
  "totalPages": 0
}
```

Resposta legada aceita:

```json
[]
```

Os dois formatos viram a mesma pagina vazia no frontend. `401`, CORS, rede, `5xx` e payload invalido continuam sendo falhas reais.

## Comandos de deploy

API a partir da raiz do monorepo:

```powershell
vercel deploy . --project sentinel-core-api --prod --yes
```

Core Preview:

```powershell
vercel deploy . --project sentinel-core --yes
```

Validacao focada:

```powershell
npm.cmd run test:bugs-preview
npm.cmd run type-check:api
npm.cmd run type-check:core
npm.cmd run build:api
npm.cmd run build:core
git diff --check
```

## Rollback

1. Restaurar `NEXT_PUBLIC_API_URL` do Core para a API publica anterior.
2. Redeployar `sentinel-core`.
3. Promover um deployment anterior de `sentinel-core-api` se o problema estiver na API.
4. Nao remover a normalizacao do frontend durante rollback; ela e compativel com ambos os contratos.
5. Se o Preview precisar voltar ao Supabase Auth, remover apenas a variavel de branch `NEXT_PUBLIC_AUTH_MODE=local` e redeployar.

## Evidencia operacional

Resposta remota observada:

```text
docsStatus=200
preflightStatus=204
allowOrigin=https://sentinel-core-ppr65du3o-castilho-raphael-5448s-projects.vercel.app
bugsStatus=200
shape=wrapped
```

Validacao visual:

1. Preview abriu sem overlay de framework.
2. Login local gerou JWT e abriu `/dashboard`.
3. `/bugs` renderizou `Bug Tracker` e `BUG-001`.
4. Refresh manteve o mesmo item.
5. Filtro Critical, sem resultados, mostrou `Nenhum bug encontrado`.
6. A tela nao exibiu `Erro ao carregar bugs`.
