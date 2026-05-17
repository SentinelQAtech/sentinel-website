# SENTINEL TECH - QA - MASTER CURRENT STATE 2026

> Fonte de contexto principal do ecossistema Sentinel.
>
> Este arquivo deve ser usado como memoria operacional para conversas com IAs, ferramentas de desenvolvimento, revisoes de escopo e continuidade do projeto.
>
> Ultima consolidacao: 17/05/2026.

---

## 1. Visao Geral

A **Sentinel Tech - QA** e uma empresa/marca focada em engenharia de qualidade, operacoes de QA, automacao, validacao de software e produtos internos para gestao operacional.

O ecossistema Sentinel hoje nao e apenas uma landing page ou um projeto isolado. Ele e composto por:

- Site publico institucional;
- Plataforma interna de operacao;
- Backend/API;
- Extensao de apoio ao fluxo QA;
- Area de aprendizado;
- Documentacao tecnica;
- Estrutura de monorepo.

O objetivo geral e transformar a Sentinel em uma operacao real de QA, com marca forte, processos internos, produtos proprios e capacidade de atender clientes com padrao profissional.

---

## 2. Nomes Oficiais

### Empresa / Marca Publica

**Sentinel Tech - QA**

Uso recomendado:

- Site publico;
- Materiais comerciais;
- Cartoes;
- Apresentacoes;
- Comunicacao com clientes;
- Rodape institucional;
- Conteudo de marca.

Slogan oficial:

**Quality You Can Trust.**

### Plataforma Interna

**Sentinel Core**

Uso recomendado:

- Sistema interno;
- Dashboard operacional;
- Gestao de clientes, projetos, bugs, dailies, time, calendario e relatorios;
- Comunicacao tecnica interna;
- Documentacao de produto interno.

O Sentinel Core nao deve ser tratado como produto publico principal para clientes. Ele e a plataforma interna de operacao da Sentinel.

---

## 3. Posicionamento da Empresa

A Sentinel deve transmitir:

- Confianca;
- Qualidade;
- Engenharia;
- Organizacao;
- Tecnologia;
- Seguranca;
- Processo;
- Clareza operacional;
- Maturidade profissional.

Evitar:

- Linguagem infantil;
- Visual gamer exagerado;
- Neon em excesso;
- Promessas vagas;
- Aparencia de portfolio pessoal;
- Sensacao de template generico.

Direcao visual atual:

- Fundo claro/lavanda;
- Roxo como cor principal;
- Logo com escudo e circuitos;
- Detalhes de placa-mae/componentes no fundo;
- Layout limpo, moderno e B2B;
- Estetica tecnologica, mas controlada.

---

## 4. Servicos da Sentinel

A Sentinel pode oferecer os seguintes servicos:

- Testes manuais;
- Testes automatizados;
- Testes de API;
- Testes de performance;
- Testes web;
- Testes mobile;
- QA Operations;
- Auditoria de qualidade;
- Estruturacao de processos de QA;
- Sprints de automacao;
- Validacao de releases;
- Apoio em QA Gate;
- Organizacao de bugs, riscos e evidencias;
- Relatorios de qualidade.

Modelos de atuacao sugeridos:

- **Quality Audit**: diagnostico de maturidade, riscos, gaps e oportunidades.
- **QA Operations**: acompanhamento continuo de qualidade e operacao.
- **Automation Sprint**: ciclo focado em automacao, regressao e estabilidade.

---

## 5. Produtos e Plataformas

### 5.1 Site Publico

URL:

```text
https://sentinelqa.tech
```

Responsabilidade:

- Apresentar a Sentinel Tech - QA;
- Comunicar servicos;
- Explicar processo;
- Direcionar contato;
- Mostrar a existencia do Sentinel Core;
- Servir como porta de entrada institucional.

Codigo:

```text
apps/website
```

Stack:

- HTML;
- CSS;
- JavaScript simples;
- Deploy via Vercel.

Observacao:

O site publico e intencionalmente simples e leve. Ele nao precisa ser Next.js neste momento.

### 5.2 Sentinel Core

URL:

```text
https://sentinelqa.tech/core/dashboard
```

Alias:

```text
https://app.sentinelqa.tech
```

Responsabilidade:

- Operacao interna;
- Dashboard;
- Clientes;
- Projetos;
- Board/Kanban;
- Bugs;
- Daily;
- Calendario;
- Sprints;
- Reports;
- Team;
- Notificacoes;
- QA Importer;
- Perfil;
- Configuracoes.

Codigo:

```text
apps/core
```

Stack:

- Next.js 15;
- React 19;
- TypeScript;
- TailwindCSS;
- Framer Motion;
- dnd-kit;
- Zustand;
- TanStack Query;
- Recharts;
- Radix UI;
- Lucide Icons.

Base path:

```text
NEXT_PUBLIC_BASE_PATH=/core
```

### 5.3 API

Codigo:

```text
apps/api
```

Stack:

- NestJS;
- TypeScript;
- Prisma;
- PostgreSQL previsto;
- JWT;
- Socket.IO previsto/estruturado;
- Swagger previsto via dependencias.

Modulos principais:

- Auth;
- Users;
- Projects;
- Tasks;
- Bugs;
- Sprints;
- Reports;
- Notifications.

Observacao:

A API existe estruturalmente e deve ser evoluida como fonte real de dados. O Core ainda pode conter partes locais/mockadas que precisam ser consolidadas conforme o uso real avanca.

### 5.4 Sentinel Learning

URL publica atual:

```text
https://sentinelqa.tech/learning/
```

Codigo:

```text
apps/learning
```

Objetivo:

- Area educacional;
- Conteudos de QA;
- Trilhas de aprendizado;
- Possivel produto futuro de ensino.

Estado:

- Ja existe no monorepo;
- Ainda precisa amadurecer visualmente e em conteudo;
- Pode futuramente virar produto separado ou modulo mais integrado.

### 5.5 Sentinel Extension

URL publica atual:

```text
https://sentinelqa.tech/extension/
```

Codigo:

```text
tools/core-extension
```

Tipo:

- Chrome Extension Manifest V3.

Responsabilidade:

- Apoiar captura/importacao de informacoes de QA;
- Enviar cards/dados para o fluxo do Sentinel Core;
- Reduzir trabalho manual no processo de importacao.

---

## 6. Estrutura de Repositorio

Repositorio canonico:

```text
https://github.com/SentinelQAtech/sentinel-website
```

Diretorio local principal:

```text
D:\DEV\01_COMPANIES\SentinelQAtech\sentinel-website
```

Estrutura atual:

```text
sentinel-website/
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
  package-lock.json
  turbo.json
  docker-compose.yml
  README.md
  LICENSE
```

Workspaces:

```text
apps/*
packages/*
```

Nome do package raiz:

```text
sentinel-core
```

Scripts principais:

```text
npm run dev
npm run build
npm run lint
npm run type-check
npm run dev:web
npm run build:web
npm run type-check:web
npm run dev:api
npm run build:api
npm run verify:web
npm run db:generate
npm run db:migrate
npm run db:studio
```

---

## 7. Rotas e Dominios

Rotas atuais:

```text
sentinelqa.tech              Site publico Sentinel Tech - QA
sentinelqa.tech/core         Redireciona para /core/dashboard
sentinelqa.tech/core/dashboard Sentinel Core
sentinelqa.tech/learning     Sentinel Learning
sentinelqa.tech/extension    Sentinel Extension
app.sentinelqa.tech          Redireciona para sentinelqa.tech/core/dashboard
```

DNS:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Deploy:

- Vercel para site publico;
- Vercel para Sentinel Core;
- Rewrites do site publico apontam `/core` para o projeto do Core;
- `app.sentinelqa.tech` funciona como alias/redirecionamento para o Core.

---

## 8. Estado Atual do Projeto

Status geral:

```text
Fase: consolidacao operacional
```

O projeto ja possui:

- Marca definida;
- Dominio proprio;
- Site publico online;
- Sentinel Core online;
- Learning online;
- Extension online;
- Monorepo;
- Deploy Vercel;
- Estrutura de API;
- Estrutura de extensao;
- Documentacao inicial;
- Direcao visual consistente.

O projeto ainda precisa:

- Reduzir dados demo/mockados;
- Consolidar persistencia real;
- Atualizar documentacao antiga;
- Melhorar README;
- Padronizar textos e idioma;
- Amadurecer Learning e Extension;
- Definir backup/export dos dados reais;
- Validar fluxos com clientes reais.

---

## 9. Modulos do Sentinel Core

Modulos atuais/esperados:

- Dashboard;
- Projects;
- Board/Kanban;
- Bugs;
- Clients;
- Team;
- Daily;
- Calendar;
- Sprints;
- Reports;
- Notifications;
- QA Importer;
- Profile;
- Settings.

Regras de produto:

- O Core deve ser uma ferramenta interna de produtividade e operacao.
- Os dados exibidos no dashboard devem refletir dados reais do sistema.
- Cards, bugs, projetos, clientes e membros nao devem depender de informacoes demo permanentes.
- O Core deve ajudar no trabalho diario, nao ser apenas visual.

---

## 10. Dados e Persistencia

Estado atual:

- Parte do Core ainda usa estruturas locais/client-side;
- A API ja existe como caminho para consolidacao;
- O uso real deve priorizar dados persistentes, recuperaveis e confiaveis.

Direcao desejada:

- Centralizar dados importantes na API/banco;
- Manter historico de operacoes relevantes;
- Evitar perda de informacao ao limpar cache/localStorage;
- Permitir export/backup;
- Garantir que dashboards tragam dados reais.

Dados criticos:

- Clientes;
- Projetos;
- Bugs;
- Tasks;
- Membros;
- Dailies;
- Calendario;
- Reports;
- Notificacoes;
- Importacoes da extensao.

---

## 11. Padrao Visual e UX

### Sentinel Tech - QA

Visual:

- Claro;
- Profissional;
- Roxo como assinatura;
- Componentes/circuitos sutis;
- B2B;
- Moderno;
- Premium.

Objetivo:

- Passar confianca para clientes;
- Comunicar qualidade;
- Parecer empresa real;
- Evitar cara de template.

### Sentinel Core

Visual:

- Operacional;
- Escuro;
- Tecnologico;
- Denso, mas organizado;
- Foco em produtividade;
- Interface de uso diario.

Objetivo:

- Parecer uma plataforma interna de operacoes;
- Ser rapida;
- Ser clara;
- Evitar elementos decorativos desnecessarios;
- Priorizar fluxo real de trabalho.

---

## 12. Idiomas

Direcao desejada:

- Suporte a Portugues Brasil;
- Suporte a Ingles Estados Unidos;
- Selecionador discreto por bandeira;
- Todo o conteudo deve acompanhar o idioma selecionado.

Regra:

Nao traduzir apenas menus. A experiencia inteira deve respeitar o idioma selecionado.

---

## 13. Documentacao Atual

Pasta:

```text
docs/
```

Documentos existentes:

- `DOMAIN_DNS.md`;
- `MONOREPO_ROADMAP.md`;
- `PLANO_DE_ESTUDOS.md`;
- `PROJECT_INVENTORY.md`;
- `ROUTING_STRATEGY.md`;
- `VERCEL_DEPLOY.md`;
- `sentinel-resumo-atual.md`;
- `sentinel-resumo-atual.pdf`.

Atencao:

Alguns documentos antigos podem estar parcialmente defasados, especialmente os que dizem que Learning, Extension ou Website ainda estao fora do monorepo.

Este arquivo deve ser tratado como contexto mestre mais atualizado.

---

## 14. Regras Para IAs e Ferramentas

Ao trabalhar neste projeto:

1. Preservar a arquitetura do monorepo.
2. Nao transformar o Core em site publico.
3. Nao tratar Sentinel Core como portfolio.
4. Nao voltar a stack antiga de HTML/CSS/JS para o Core.
5. Nao remover Next.js, React, NestJS ou Turborepo.
6. Manter `Sentinel Tech - QA` como empresa/marca publica.
7. Manter `Sentinel Core` como plataforma interna.
8. Manter as rotas sob `sentinelqa.tech`.
9. Preservar `/core` como base path do Core.
10. Evitar refactors gigantes sem necessidade.
11. Priorizar estabilidade, dados reais e operacao diaria.
12. Antes de excluir dados, pedir confirmacao.
13. Evitar informacoes demo em dashboards e relatorios.
14. Manter visual profissional e consistente.
15. Documentar decisoes importantes.

---

## 15. O Que Nao Fazer

Nao fazer:

- Renomear o projeto inteiro sem necessidade;
- Quebrar imports/rotas;
- Remover o base path `/core`;
- Misturar site publico com Core interno;
- Apagar dados historicos sem confirmacao;
- Reintroduzir excesso de neon/gamer;
- Criar landing page dentro do Core;
- Duplicar projetos Vercel sem motivo;
- Criar novas stacks sem necessidade;
- Ignorar a documentacao de rotas.

---

## 16. Prioridades Atuais

Prioridade 1:

- Estabilizar o Core para uso real diario.

Prioridade 2:

- Garantir que dashboards, reports, team, clients, projects e bugs usem dados reais.

Prioridade 3:

- Limpar dados demo e padronizar informacoes.

Prioridade 4:

- Amadurecer persistencia/API.

Prioridade 5:

- Melhorar Learning e Extension para seguirem o mesmo padrao profissional.

Prioridade 6:

- Manter site publico com comunicacao clara, profissional e comercial.

---

## 17. Estado Mental do Projeto

A Sentinel esta saindo da fase:

```text
projeto em construcao
```

e entrando na fase:

```text
operacao real da empresa
```

Isso significa que as proximas decisoes devem priorizar:

- Uso real;
- Dados reais;
- Confiabilidade;
- Clareza;
- Manutencao;
- Backup;
- Escalabilidade;
- Experiencia profissional.

---

## 18. Fonte de Verdade

Este arquivo deve ser usado como fonte de contexto para outras conversas e ferramentas de IA.

Quando houver mudancas importantes em:

- Nome;
- Arquitetura;
- Stack;
- Dominio;
- Rotas;
- Deploy;
- Produtos;
- Modulos;
- Processo;
- Dados;
- UX;
- Branding;

este arquivo deve ser atualizado.

---

## 19. Resumo Final

A **Sentinel Tech - QA** e a marca publica e comercial.

O **Sentinel Core** e a plataforma interna de operacoes.

O projeto atual e um monorepo moderno com:

- Site publico;
- App interno Next.js;
- API NestJS;
- Extensao Chrome;
- Area Learning;
- Pacotes compartilhados;
- Documentacao;
- Deploy Vercel;
- Dominio proprio.

O foco agora e transformar essa estrutura em operacao real, com dados reais, clientes reais e processos confiaveis.
