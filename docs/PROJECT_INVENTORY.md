# SentinelQATech - Inventario dos projetos

Este inventario registra o estado atual dos projetos locais que devem convergir para o repositorio canonico:

`https://github.com/SentinelQAtech/sentinel-website`

## Projetos locais

| Projeto | Caminho local | Tipo | Estado atual | Observacoes |
| --- | --- | --- | --- | --- |
| Sentinel Project Manager | `D:\DEV\Sentinel\sentinel-project-manager` | Monorepo com Next.js + NestJS | Ja conectado ao repo canonico | App web em `apps/web`; API em `apps/api`; deploy manual no Vercel funcionando. |
| Sentinel Tech QA | `D:\DEV\Sentinel\sentinel-tech-qa` | Site estatico | Ainda fora do monorepo canonico | Contem `index.html`, `assets/css`, `assets/js` e logos. Bom candidato para virar o site publico em `sentinelqa.tech`. |
| Sentinel Learning | `D:\DEV\Sentinel\sentinel-learning` | Next.js 15 | Ainda fora do monorepo canonico | Usa App Router, Tailwind, auth propria e porta local `3002`. Bom candidato para `learning.sentinelqa.tech`. |
| Sentinel Extension | `D:\DEV\Sentinel\sentinel-extension` | Chrome Extension Manifest V3 | Ainda fora do monorepo canonico | Sem build step. Deve ser versionada e documentada dentro do monorepo, mas nao precisa de deploy Vercel. |

## Estrutura recomendada

Curto prazo, para reduzir risco:

```text
apps/
  web/              # Project Manager atual, manter por enquanto
  api/              # API atual
  website/          # futuro site publico Sentinel Tech QA
  learning/         # futuro app Sentinel Learning
  extension/        # extensao Chrome, versionada no repo
packages/
  config/           # configs compartilhadas quando fizer sentido
  ui/               # componentes compartilhados futuramente
docs/
  PROJECT_INVENTORY.md
  MONOREPO_ROADMAP.md
  VERCEL_DEPLOY.md
  DOMAIN_DNS.md
```

## Dominios sugeridos

| Produto | Dominio sugerido | Observacao |
| --- | --- | --- |
| Site institucional | `sentinelqa.tech` e `www.sentinelqa.tech` | Deve ser a entrada publica da Sentinel. |
| Project Manager | `app.sentinelqa.tech` | Evita misturar app interno com site publico. |
| Learning | `learning.sentinelqa.tech` | Mantem o produto de estudo separado. |
| Extensao | `extension.sentinelqa.tech` ou pagina no site | A extensao em si nao roda no Vercel; o dominio pode hospedar docs/download. |

## Cuidados antes de importar

- Nao copiar `node_modules`, `.next`, `.git`, `dist`, `.vercel` ou arquivos `.env`.
- Criar `README.md` proprio para cada app importado.
- Validar build individual antes de conectar dominio.
- Usar variaveis de ambiente separadas por projeto no Vercel.
- Manter deploy manual ate a integracao GitHub App do Vercel estar liberada.
