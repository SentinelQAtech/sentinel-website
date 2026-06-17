# Bugs Preview Deploy Fix Design

Data: 17/06/2026
Branch: `stabilization/operational-corrections-sprint-1`

## Objetivo

Fazer a tela Bugs do Sentinel Core carregar no Preview da Vercel usando uma API publica, sem alterar QAItem, Daily, Board, Reports, Calendar ou Learning.

## Diagnostico confirmado

- O Preview atual do Core possui `NEXT_PUBLIC_API_URL` com valor vazio.
- O fallback de build aponta o browser para `http://localhost:3001`.
- Nao existe um projeto publico da API na conta Vercel atual.
- A CSP de producao do Core nao inclui a API configurada em `connect-src`.
- O CORS da API aceita apenas origens exatas configuradas e nao contempla aliases dinamicos de Preview.
- `useBugs` assume exclusivamente `{ data: Bug[] }` e quebra se a API responder `Bug[]`.

## Arquitetura escolhida

### API publica

A API Nest sera publicada como um projeto Vercel separado. O entrypoint serverless deve inicializar a mesma `AppModule`, os mesmos guards e o mesmo prefixo `/api/v1`, sem duplicar regras de negocio.

O deploy recebe as variaveis de banco, JWT, Supabase e CORS no projeto da API. Nenhum segredo deve ser salvo no repositorio ou exposto ao Core.

### Core Preview

`NEXT_PUBLIC_API_URL` deve apontar para a URL publica da API tanto em Preview quanto em Production. A CSP deve incluir a origem derivada dessa variavel em `connect-src` em qualquer ambiente, desde que seja uma URL HTTP(S) valida.

### CORS

A API deve aceitar:

- origens exatas listadas em `CORS_ORIGINS`;
- aliases Vercel do projeto `sentinel-core` por meio de uma regra restrita ao hostname do projeto;
- requisicoes sem `Origin`, usadas por scripts e health checks.

Headers permitidos continuam limitados a `Content-Type` e `Authorization`.

### Contrato de Bugs

A normalizacao acontece na fronteira do hook:

- `[]` vira uma pagina vazia;
- `{ data: [] }` preserva metadados validos e completa valores ausentes;
- payloads fora desses dois contratos geram erro explicito;
- erros HTTP e de auth continuam sendo erros reais e nao sao mascarados.

O componente usa a lista normalizada e o empty state existente. A mensagem de erro deve usar o erro real recebido quando houver falha de rede, auth ou servidor.

## Fluxo de dados

1. O browser abre o Preview do Core.
2. O Core le a URL publica embutida por `NEXT_PUBLIC_API_URL`.
3. O client Axios anexa o bearer token existente.
4. A API valida a origem e o JWT.
5. `GET /api/v1/bugs` responde `200` com lista paginada ou lista vazia.
6. O hook normaliza o payload e a tela renderiza tabela ou empty state.
7. Em falha real, React Query entrega o erro ao componente e a UI mostra uma mensagem util.

## Testes e validacao

- Teste de regressao para `[]`, `{ data: [] }` e payload invalido.
- Teste da regra de origens do CORS.
- Verificacao remota de status, CORS e contrato do endpoint autenticado.
- Validacao no Preview: login, Bugs, empty state e refresh.
- `type-check` e `build` de API/Core, alem de `git diff --check`.

## Deploy e rollback

O projeto da API e as variaveis Vercel serao documentados em `docs/stabilization/BUGS_PREVIEW_DEPLOY_FIX.md`. O rollback consiste em restaurar `NEXT_PUBLIC_API_URL` para a API anterior e redeployar o Core; a mudanca de normalizacao e compativel com os dois formatos de resposta.

## Fora de escopo

- Alterar regras de QAItem, Daily ou Board.
- Alterar Reports, Calendar ou Learning.
- Redesign da tela Bugs.
- Usar localStorage como fonte de Bugs.
