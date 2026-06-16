# Sentinel AI Context

Use este arquivo como entrada rapida antes de trabalhar neste repositorio.

## Fonte de Verdade

Leia primeiro:

```text
docs/MASTER_CURRENT_STATE-SENTINEL-2026.md
```

Este documento define nomes oficiais, arquitetura, rotas, deploy, prioridades e regras para IAs.

## Identidade do Projeto

- Marca publica: **Sentinel Tech - QA**
- Slogan: **Quality You Can Trust.**
- Plataforma interna: **Sentinel Core**
- Area educacional: **Sentinel Learning**
- Extensao: **Sentinel Extension**
- Repositorio canonico: `SentinelQAtech/sentinel-website`
- Diretorio local principal: `D:\DEV\01_COMPANIES\SentinelQAtech\sentinel-website`

## Arquitetura Atual

```text
apps/website       Site publico estatico
apps/core          Sentinel Core, app interno em Next.js
apps/api           API NestJS
apps/website/learning Conteudo estatico legado do Sentinel Learning, mantido apenas como origem historica
tools/core-extension Chrome extension
docs/              Documentacao operacional
prisma/            Schema de dados
```

## Rotas Publicas

```text
https://sentinelqa.tech                    Site publico
https://sentinelqa.tech/core               Redirect para /core/dashboard
https://sentinelqa.tech/core/dashboard     Sentinel Core
https://learning.sentinelqa.tech/          Sentinel Learning atual
https://sentinelqa.tech/learning/          Redirect legado para learning.sentinelqa.tech
https://sentinelqa.tech/extension/         Pagina publica da extensao
https://app.sentinelqa.tech                Redirect para Sentinel Core
```

## Regras Para IAs

1. Preserve o monorepo.
2. Nao transforme o Sentinel Core em site publico.
3. Nao misture `apps/website` com `apps/core`.
4. Nao remova o base path `/core` do Core.
5. Nao publique pela raiz do monorepo no Vercel.
6. Nao commite `.env`, `.vercel`, `.next`, `dist`, `node_modules`, `test-results` ou secrets.
7. Antes de apagar dados, pedir confirmacao.
8. Preferir mudancas pequenas, rastreaveis e documentadas.
9. Tratar `sentinelqa.tech/learning` como rota legada que deve redirecionar para `learning.sentinelqa.tech`.
10. Atualizar docs quando mudar rota, deploy, nome, stack ou arquitetura.

## Comandos Uteis

No Windows, prefira `npm.cmd`:

```powershell
npm.cmd run build
npm.cmd run type-check
npm.cmd run build:core
npm.cmd run type-check:core
npm.cmd run build:api
npm.cmd run type-check:api
npm.cmd run test:e2e:core
```

O E2E do Core usa `apps/core/scripts/clean-next-cache.mjs` antes do `next dev` para evitar falhas por `.next` stale em ambiente local.

## Estado Esperado do Git

Remote principal:

```text
origin  https://github.com/SentinelQAtech/sentinel-website.git
```

Evite remotes legados neste clone principal.
