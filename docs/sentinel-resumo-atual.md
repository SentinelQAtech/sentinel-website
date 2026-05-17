# Sentinel Tech - QA

## Resumo Executivo

Hoje a Sentinel ja deixou de ser apenas um projeto e passou a ter uma estrutura real de marca, produto e operacao.

A empresa publica e a **Sentinel Tech - QA**, posicionada como uma marca moderna, tecnologica e confiavel para servicos de Quality Assurance. A plataforma interna e o **Sentinel Core**, usada para organizar operacoes, projetos, bugs, clientes, time, dailies, calendario, relatorios e notificacoes.

O ecossistema atual esta centralizado no dominio **sentinelqa.tech** e em um monorepo com site publico, plataforma interna, API, extensao e area de aprendizado.

## 1. Empresa

### Imagem da Marca

A Sentinel hoje transmite uma imagem de empresa de QA moderna, premium e voltada para engenharia de qualidade.

Principais elementos da identidade:

- Logo roxa com escudo e circuitos;
- Visual limpo, tecnologico e corporativo;
- Fundo claro com detalhes inspirados em placa mae;
- Paleta roxa e branca;
- Slogan oficial: **Quality You Can Trust.**

A marca comunica confianca, tecnologia, protecao, metodo e qualidade de software. O posicionamento atual se aproxima mais de uma empresa B2B especializada em QA do que de um portfolio pessoal ou projeto experimental.

### Servicos Que Podem Ser Prestados

A estrutura atual suporta bem a oferta dos seguintes servicos:

- Testes manuais;
- Testes automatizados;
- Testes de API;
- Testes de performance;
- Testes web e mobile;
- QA Operations;
- Auditoria de qualidade;
- Estruturacao de processos QA;
- Sprints de automacao;
- Apoio em release confidence e QA Gate.

### Modelo de Atuacao

A Sentinel pode se apresentar ao mercado com tres frentes principais:

- **Quality Audit**: avaliacao de riscos, fluxo atual e maturidade de QA.
- **QA Operations**: acompanhamento continuo de qualidade, bugs, releases e processos.
- **Automation Sprint**: ciclos focados em automacao, regressao e estabilidade.

## 2. Produtos e Plataformas

### Sentinel Tech - QA

Site publico institucional em:

`https://sentinelqa.tech`

E a vitrine da empresa, com apresentacao da marca, servicos, processo, plataforma e contato.

### Sentinel Core

Plataforma interna de operacao QA em:

`https://sentinelqa.tech/core/dashboard`

E o centro operacional da Sentinel. Nao e uma area publica para clientes; e uma ferramenta interna para organizar o dia a dia da empresa.

Modulos principais:

- Dashboard;
- Projetos;
- Board/Kanban;
- Bugs;
- Clientes;
- Time;
- Daily;
- Calendario;
- Relatorios;
- Notificacoes;
- QA Importer.

### Sentinel Learning

Area de aprendizado e conteudo em:

`https://sentinelqa.tech/learning/`

Hoje existe como parte do ecossistema, mas ainda pode evoluir em conteudo, apresentacao e integracao com a marca.

### Sentinel Extension

Area da extensao em:

`https://sentinelqa.tech/extension/`

A extensao apoia a captura/importacao de informacoes de QA para dentro do fluxo operacional.

## 3. Estrutura de T.I.

O projeto esta centralizado em:

```text
D:\DEV\01_COMPANIES\SentinelQAtech\sentinel-website
```

Estrutura principal:

```text
apps/
  api/
  extension/
  learning/
  web/
  website/

packages/
  shared/

docs/
prisma/
package.json
turbo.json
docker-compose.yml
README.md
```

### Apps

- `apps/website`: site publico da Sentinel.
- `apps/core`: Sentinel Core, plataforma interna em Next.js.
- `apps/api`: backend em NestJS, com estrutura modular.
- `tools/core-extension`: extensao Chrome para apoio ao processo de QA.
- `apps/learning`: aplicacao de aprendizado.

### Backend

O backend esta organizado em modulos:

- Auth;
- Users;
- Projects;
- Tasks;
- Bugs;
- Sprints;
- Reports;
- Notifications.

A arquitetura ja aponta para uma operacao mais robusta, com separacao entre frontend, API, dados compartilhados e apps auxiliares.

### Documentacao

A pasta `docs` concentra materiais sobre:

- DNS;
- Vercel;
- Roadmap do monorepo;
- Inventario do projeto;
- Estrategia de rotas;
- Plano de estudos.

Alguns documentos precisam de revisao porque ainda citam etapas antigas ou ja superadas. O README tambem possui pequenos trechos com caracteres corrompidos, o que vale limpar para deixar o repositorio mais profissional.

## 4. Estado Atual

Status verificado em 17/05/2026:

- `https://sentinelqa.tech` esta online.
- `https://sentinelqa.tech/core` redireciona para `/core/dashboard`.
- `https://sentinelqa.tech/core/dashboard` esta online.
- `https://sentinelqa.tech/learning/` esta online.
- `https://sentinelqa.tech/extension/` esta online.
- `https://app.sentinelqa.tech` redireciona para o Core.

O repositorio local esta limpo, sem alteracoes pendentes.

## 5. Leitura Geral

A Sentinel hoje esta em uma fase de consolidacao.

Ela ja tem:

- Marca propria;
- Dominio proprio;
- Site institucional;
- Plataforma interna;
- Estrutura de monorepo;
- Extensao;
- Area de aprendizado;
- Direcao visual consistente;
- Posicionamento claro em QA.

O principal proximo passo e transformar essa base em rotina real de operacao: limpar dados demo, usar clientes reais, alimentar o Sentinel Core diariamente e amadurecer a API/backoffice para reduzir dependencias locais ou mockadas.

## 6. Pontos de Atencao

- Limpar informacoes demo do Core;
- Revisar documentacao antiga;
- Corrigir encoding do README;
- Evoluir Learning e Extension visualmente;
- Consolidar persistencia real dos dados;
- Definir melhor quais fluxos serao internos e quais poderao ser vistos por clientes no futuro;
- Manter o padrao de marca em todos os produtos.

## Conclusao

A Sentinel hoje ja tem base de empresa e estrutura de produto. O visual publico esta profissional, a arquitetura esta organizada e o Sentinel Core ja funciona como nucleo operacional.

O projeto esta pronto para sair da fase de construcao visual e entrar em uma fase mais operacional: uso real, dados reais, clientes reais e melhoria continua baseada no dia a dia.
