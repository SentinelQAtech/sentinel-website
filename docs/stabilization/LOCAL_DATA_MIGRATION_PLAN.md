# Local Data Migration Plan

Data: 17/06/2026
Branch: `stabilization/backend-source-of-truth-v1`

## Objetivo

Definir como migrar dados antigos de QA Items que ainda existem no navegador, sem apagar historico local automaticamente e sem duplicar itens ja importados no backend.

## Estado atual

Antes da Phase 2, QA Items eram persistidos em Zustand/localStorage via `apps/core/src/store/qa-importer.ts`.

Depois da Phase 2:

- QA Inbox le e escreve via API `/qa-items`;
- Daily QA Cockpit le e escreve via API `/qa-items`;
- Board le e escreve via API `/qa-items`;
- a store `qa-importer.ts` permanece para configuracoes locais, historico e migracao assistida;
- dados antigos no browser nao sao apagados automaticamente.

## Estrategia recomendada

1. Detectar itens locais no primeiro acesso autenticado.
2. Mostrar uma acao explicita de migracao para o usuario.
3. Enviar itens locais para `POST /qa-items/import`.
4. Usar `externalKey` quando existir para evitar duplicacao.
5. Preservar `source`, `priority`, `status`, `category`, `notes`, `links`, `comments`, `dailyStatus`, `sentToDaily`, `dailyDate`, `dailyOrder` e `resolutionDetails`.
6. Marcar a migracao como concluida em uma chave local separada.
7. Manter rollback manual possivel ate validacao final.

## Chaves locais envolvidas

| Store | Uso atual | Acao |
| --- | --- | --- |
| `qa-importer-storage` | QA Items antigos, filtros, prefixos e historico | Migrar somente `items`; manter preferencias locais |
| `daily-storage` | Tarefas manuais e reunioes | Nao migrar nesta fase |
| `kanban-storage` | Colunas visuais do board | Manter como preferencia local |

## Mapeamento

| Campo local | Campo backend |
| --- | --- |
| `id` | `metadata.legacyId` |
| `taskId` | `externalKey` |
| `title` | `title` |
| `client` | `clientName` |
| `priority` | `priority` |
| `status` | `status` |
| `category` | `category` |
| `sentToDaily` | `sentToDaily` |
| `dailyDate` | `dailyDate` |
| `dailyOrder` | `dailyOrder` |
| `dailyStatus` | `dailyStatus` |
| `resolution` | `resolutionDetails` |
| `links` | `metadata.links` |
| `comments` | `metadata.comments` |

## Regras anti-duplicacao

- Se `taskId` existir, usar como `externalKey`.
- Se `taskId` nao existir, enviar sem `externalKey` e salvar `legacyId` em `metadata`.
- Importacoes futuras devem preferir `externalKey` da origem.
- A API faz upsert por `externalKey` dentro do `workspaceId` atual.

## Rollback

Como a Phase 2 nao apaga automaticamente os dados locais, o rollback operacional e:

1. reverter a branch/commit da Phase 2;
2. preservar localStorage do navegador;
3. voltar ao fluxo local antigo se necessario.

## Pendencias

- Criar UI de migracao assistida.
- Criar resumo antes/depois da migracao.
- Adicionar flag local `qa-items-local-migration-completed`.
- Definir por quanto tempo a store legada sera mantida.

