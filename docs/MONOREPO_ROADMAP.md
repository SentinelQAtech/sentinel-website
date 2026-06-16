# Roadmap de organizacao do monorepo SentinelQATech

Objetivo: concentrar os produtos Sentinel no repositorio `SentinelQAtech/sentinel-website`, com deploys previsiveis, dominios claros e baixa chance de duplicidade.

## Fase 1 - Base canonica

Status: concluida como base operacional.

- [x] Alterar `origin` local para `SentinelQAtech/sentinel-website`.
- [x] Publicar o Sentinel Core no repo canonico.
- [x] Configurar Vercel por app (`apps/website` e `apps/core`).
- [x] Criar projeto Vercel `sentinel-website`.
- [x] Adicionar dominios `sentinelqa.tech` e `www.sentinelqa.tech` no Vercel.
- [x] Ajustar nameservers no Namecheap para Vercel DNS.
- [ ] Confirmar GitHub App do Vercel para deploy automatico do repo `SentinelQAtech/sentinel-website`.
- [ ] Documentar o fluxo exato de preview deploy para PRs.

## Fase 2 - Separar publico vs interno

Recomendacao:

- `sentinelqa.tech`: site institucional.
- `sentinelqa.tech/core`: Sentinel Core.
- `learning.sentinelqa.tech`: Sentinel Learning.
- `sentinelqa.tech/learning`: redirect legado para `learning.sentinelqa.tech`.
- `sentinelqa.tech/extension`: pagina/download/docs da extensao.
- `app.sentinelqa.tech`: redirect para `sentinelqa.tech/core`.

Essa separacao evita que o site publico e o produto operacional disputem a raiz do dominio.

## Fase 3 - Consolidar apps restantes

Status: importacao estrutural concluida; amadurecimento continua.

Estrutura atual:

- `apps/website`: site publico, redirect legado de `/learning/` e pagina estatica de `/extension/`.
- `apps/core`: Sentinel Core.
- `apps/api`: API NestJS.
- Projeto Vercel `sentinel-learning`: Sentinel Learning atual em `learning.sentinelqa.tech`.
- `tools/core-extension`: extensao Chrome.

Proximos passos desta fase:

1. Manter `/learning/` como redirect legado para `learning.sentinelqa.tech`.
2. Evoluir a pagina `/extension/` para documentacao/download mais completa.
3. Garantir que todo app tenha README ou nota operacional minima.

## Fase 4 - Padronizacao

Depois que tudo estiver dentro do repo:

- Criar padrao de variaveis `.env.example` por app.
- Centralizar tokens e secrets somente no Vercel/GitHub, nunca no repo.
- Criar checklists de release.
- Criar documentacao para restaurar ambiente local do zero.
- Avaliar pacote compartilhado `packages/ui` apenas se houver repeticao real de componentes.
- Manter `AI_CONTEXT.md` como entrada curta para IAs e `MASTER_CURRENT_STATE-SENTINEL-2026.md` como fonte mestre.
- Manter o E2E do Core isolado de caches locais usando `apps/core/scripts/clean-next-cache.mjs`.

## Fase 5 - Operacao diaria

Quando a base estiver estavel:

- Habilitar deploy automatico por push na branch `main`.
- Usar preview deploys para PRs.
- Definir uma rotina de backup/export dos dados reais do Sentinel Core.
- Manter changelog curto por release importante.
- Revisar periodicamente dominios, DNS e permissoes GitHub/Vercel.
