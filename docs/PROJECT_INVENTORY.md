# SentinelQATech - Inventario dos Projetos

Este inventario registra o estado atual do ecossistema Sentinel dentro do repositorio canonico:

```text
https://github.com/SentinelQAtech/sentinel-website
```

Diretorio local principal:

```text
D:\DEV\01_COMPANIES\SentinelQAtech\sentinel-website
```

## Estado Atual

| Produto | Caminho no monorepo | Tipo | Estado atual | Observacoes |
| --- | --- | --- | --- | --- |
| Site publico | `apps/website` | HTML, CSS e JavaScript | Ativo no dominio principal | Entrada institucional da Sentinel Tech - QA em `sentinelqa.tech`. |
| Sentinel Core | `apps/core` | Next.js 15, React 19 e Tailwind | Ativo em `/core/dashboard` | Plataforma interna de operacoes QA. Usa `NEXT_PUBLIC_BASE_PATH=/core` no deploy. |
| API | `apps/api` | NestJS, Prisma e TypeScript | Estrutural e buildando | Deve evoluir como fonte real de dados do Core. |
| Sentinel Learning | Projeto Vercel `sentinel-learning` | HTML, CSS e JavaScript | Ativo em `learning.sentinelqa.tech` | A rota publica antiga `/learning/` no site principal deve redirecionar para o subdominio atual. |
| Sentinel Extension | `tools/core-extension` | Chrome Extension Manifest V3 | Versionada no monorepo | A rota publica `/extension/` apresenta a extensao; a extensao em si nao roda no Vercel. |
| Prisma | `prisma` | Schema de dados | Base de persistencia planejada | Deve ser mantido alinhado com a API. |
| Docs | `docs` | Documentacao operacional | Fonte de contexto para IAs e operacao | O arquivo mestre e `MASTER_CURRENT_STATE-SENTINEL-2026.md`. |

## Estrutura Canonica

```text
sentinel-website/
  apps/
    api/
    core/
    learning/
    website/
  packages/
  prisma/
  tools/
    core-extension/
  docs/
  package.json
  package-lock.json
  turbo.json
  docker-compose.yml
  README.md
```

## Rotas e Produtos

| Rota | Produto | Responsabilidade |
| --- | --- | --- |
| `https://sentinelqa.tech` | Site publico | Marca, servicos, processo e contato. |
| `https://sentinelqa.tech/core` | Sentinel Core | Redirect para `/core/dashboard`. |
| `https://sentinelqa.tech/core/dashboard` | Sentinel Core | Plataforma interna operacional. |
| `https://learning.sentinelqa.tech/` | Sentinel Learning | Experiencia atual do Learning. |
| `https://sentinelqa.tech/learning/` | Sentinel Learning | Redirect legado para `learning.sentinelqa.tech`. |
| `https://sentinelqa.tech/extension/` | Sentinel Extension | Documentacao/download/instrucoes da extensao. |
| `https://app.sentinelqa.tech` | Alias interno | Redirect para `sentinelqa.tech/core/dashboard`. |

## Repositorio e GitHub

Repositorio canonico:

```text
SentinelQAtech/sentinel-website
```

Remote local esperado:

```text
origin  https://github.com/SentinelQAtech/sentinel-website.git
```

Nao manter remotes antigos de projetos legados no clone principal. Eles confundem automacoes, IAs e comandos de push/pull.

## Cuidados

- Nao copiar `node_modules`, `.next`, `.git`, `dist`, `.vercel` ou arquivos `.env`.
- Manter secrets somente em ambiente local, Vercel ou GitHub Secrets.
- Validar build por app antes de deploy.
- Nao publicar pela raiz do monorepo no Vercel.
- Nao misturar site publico com Sentinel Core interno.
- Tratar `MASTER_CURRENT_STATE-SENTINEL-2026.md` como fonte principal de contexto.
