# Roadmap de organizacao do monorepo SentinelQATech

Objetivo: concentrar os produtos Sentinel no repositorio `SentinelQAtech/sentinel-website`, com deploys previsiveis, dominios claros e baixa chance de duplicidade.

## Fase 1 - Base canonica

Status: em andamento.

- [x] Alterar `origin` local para `SentinelQAtech/sentinel-website`.
- [x] Publicar o Sentinel Core no repo canonico.
- [x] Configurar `vercel.json` para o app web atual.
- [x] Criar projeto Vercel `sentinel-website`.
- [x] Adicionar dominios `sentinelqa.tech` e `www.sentinelqa.tech` no Vercel.
- [x] Ajustar nameservers no Namecheap para Vercel DNS.
- [ ] Liberar GitHub App do Vercel para o repo `SentinelQAtech/sentinel-website`.
- [ ] Conectar deploy automatico do Vercel ao repo canonico.

## Fase 2 - Separar publico vs interno

Recomendacao:

- `sentinelqa.tech`: site institucional.
- `app.sentinelqa.tech`: Sentinel Core.
- `learning.sentinelqa.tech`: Sentinel Learning.
- `extension.sentinelqa.tech`: pagina/download/docs da extensao, se necessario.

Essa separacao evita que o site publico e o produto operacional disputem a raiz do dominio.

## Fase 3 - Importar apps restantes

Ordem recomendada:

1. Importar `sentinel-tech-qa` para `apps/website`.
2. Importar `sentinel-learning` para `apps/learning`.
3. Importar `sentinel-extension` para `apps/extension`.

Para cada importacao:

- Copiar somente codigo fonte e assets.
- Remover artefatos locais e caches.
- Ajustar `package.json` se for app com build.
- Adicionar scripts no root quando necessario.
- Rodar build local.
- Fazer commit pequeno e descritivo.

## Fase 4 - Padronizacao

Depois que tudo estiver dentro do repo:

- Criar padrao de variaveis `.env.example` por app.
- Centralizar tokens e secrets somente no Vercel/GitHub, nunca no repo.
- Criar checklists de release.
- Criar documentacao para restaurar ambiente local do zero.
- Avaliar pacote compartilhado `packages/ui` apenas se houver repeticao real de componentes.

## Fase 5 - Operacao diaria

Quando a base estiver estavel:

- Habilitar deploy automatico por push na branch `main`.
- Usar preview deploys para PRs.
- Definir uma rotina de backup/export dos dados reais do Sentinel Core.
- Manter changelog curto por release importante.
- Revisar periodicamente dominios, DNS e permissoes GitHub/Vercel.
