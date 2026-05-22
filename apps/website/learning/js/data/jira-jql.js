// Sentinel Learning — Jira & JQL
// window.SL_JIRA

(function () {
  'use strict';

  var COURSE = {
    id: 'jira-jql',
    slug: 'jira-jql',
    title: 'Jira & JQL',
    subtitle: 'Gestão de projetos ágeis com Jira',
    description: 'Criação de projetos, boards, sprints, backlog e consultas JQL avançadas para QA Engineers e equipes ágeis.',
    category: 'Ferramentas',
    level: 'Iniciante',
    estimatedHours: 15,
    totalModules: 3,
    totalLessons: 15,
    status: 'available',
    tags: ['jira', 'jql', 'agile', 'project management'],
    storageKey: null,

    getLessonContent: function (moduleNum, lessonIndex) {
      var mod = COURSE.modules[moduleNum - 1];
      if (!mod || !mod.lessons) return null;
      return mod.lessons[lessonIndex] || null;
    },

    modules: [
      {
        id: 'M1', title: 'Jira Essentials',
        description: 'Conceitos fundamentais, issue types e navegação.',
        status: 'available',
        lessons: [
          {
            id: 'jira.1.1', title: 'O que é o Jira?', description: 'Visão geral e casos de uso para QA Engineers.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Jira — a ferramenta de rastreamento de trabalho mais usada' },
              { type: 'p', html: 'Jira é uma ferramenta da Atlassian para <strong>rastreamento de projetos, bugs e tarefas</strong>. É o hub central de comunicação entre QA, devs, PO e stakeholders. Saber usá-la bem é uma competência essencial para qualquer QA profissional.' },
              { type: 'code', lang: 'text', raw: 'O que você faz no Jira como QA:\n\n• Acessar os requisitos e histórias de usuário\n• Criar e gerenciar bug reports\n• Vincular bugs à história que causou o problema\n• Rastrear o ciclo de vida de cada defeito\n• Participar do planning e refinamento de backlog\n• Criar dashboards de qualidade para o time\n• Escrever queries JQL para relatórios e automações' },
              { type: 'callout', html: '<strong>Jira vs Trello vs Linear:</strong> Jira é mais robusto e configurável — ideal para times médios e grandes. Trello é mais simples (Kanban visual, sem workflows complexos). Linear é moderno e rápido, popular em startups. Em enterprise, Jira domina.' },
            ]
          },
          {
            id: 'jira.1.2', title: 'Issue Types — tipos de itens no Jira', description: 'Epic, Story, Task, Bug, Sub-task.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Hierarquia de itens no Jira' },
              { type: 'code', lang: 'text', raw: 'EPIC\n└── Iniciativa grande (ex: "Módulo de Checkout")\n    Pode durar várias sprints\n\n    STORY (História de Usuário)\n    └── Funcionalidade da perspectiva do usuário\n        "Como comprador, quero pagar com Pix"\n\n        TASK (Tarefa técnica)\n        └── Trabalho técnico sem perspectiva de usuário\n            "Configurar webhook do banco para Pix"\n\n        BUG (Defeito)\n        └── Comportamento inesperado\n            "Pagamento Pix falha para CPFs com dígito 0"\n\n        SUB-TASK\n        └── Divisão de uma Story ou Task em partes menores' },
              { type: 'callout', html: '<strong>Para QA:</strong> sempre vincule bugs à Story ou Epic de onde eles vieram. Isso permite medir a qualidade por feature: quantos bugs foram encontrados no módulo de checkout? Essa visibilidade ajuda o time a priorizar qualidade.' },
            ]
          },
          {
            id: 'jira.1.3', title: 'Criando um bug report no Jira', description: 'Estrutura de um bug report profissional.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Anatomia de um bug report no Jira' },
              { type: 'code', lang: 'text', raw: 'Título:     [BUG] Pagamento Pix falha para CPFs terminados em 0\n\nAmbiente:   Produção · Chrome 124 · Windows 11\n\nSeveridade: Alta\nPrioridade: P1 — bloqueia fluxo de pagamento\n\nPassos para reproduzir:\n1. Acessar checkout com produto no carrinho\n2. Selecionar pagamento via Pix\n3. Informar CPF: 123.456.789-00 (termina em 0)\n4. Clicar "Gerar QR Code"\n\nResultado Obtido:\n   Erro: "CPF inválido" (modal vermelho)\n   Código de erro no console: ERR_PIX_VALIDATION_001\n\nResultado Esperado:\n   QR Code gerado com sucesso\n   (CPF 123.456.789-00 é válido conforme Receita Federal)\n\nEvidências:\n   Screenshot_checkout_erro.png\n   console-log.txt\n\nLinks:\n   Story: SL-123 (Implementar pagamento Pix)\n   Epic:  SL-45 (Módulo de Checkout)' },
              { type: 'callout', html: '<strong>Título descritivo:</strong> um bug com título "[BUG] Erro no checkout" vai ficar perdido. "[BUG] Pagamento Pix falha para CPFs terminados em 0" é rastreável, pesquisável e autoexplicativo. O tempo de escrita compensa o de debugging.' },
            ]
          },
          {
            id: 'jira.1.4', title: 'Workflow de issues', description: 'O ciclo de vida de uma issue no Jira.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Ciclo de vida de um bug no Jira' },
              { type: 'code', lang: 'text', raw: 'ABERTO → EM ANÁLISE → EM DESENVOLVIMENTO → EM REVISÃO → RESOLVIDO → FECHADO\n\nDetalhes:\n\nABERTO       → bug reportado, aguardando triagem\nEM ANÁLISE   → triagem: confirmado? prioridade? sprint?\nEM DESENVOLVIMENTO → dev corrigindo\nEM REVISÃO   → code review e QA sign-off\nESTAGING     → validação em ambiente de staging\nRESOLVIDO    → fix mergeado, aguardando deploy\nFECHADO      → validado em produção\n\nTransições especiais:\nWON\'T FIX   → equipe decide não corrigir (com justificativa!)\nDUPLICADO   → já existe uma issue igual (link o original)\nNÃO REPRODUZÍVEL → QA não conseguiu reproduzir' },
              { type: 'callout', html: '<strong>"Won\'t Fix" precisa de justificativa:</strong> "custo de correção maior que o impacto", "comportamento intencional", "deprecando essa feature". Sem contexto, QA não sabe se deve reabrir ou arquivar.' },
            ]
          },
          {
            id: 'jira.1.5', title: 'Campos importantes e priorização', description: 'Campos custom, prioridade, severity e labels.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Prioridade vs Severidade — a confusão clássica' },
              { type: 'code', lang: 'text', raw: 'Severidade = impacto técnico/funcional do bug\n  Crítico — sistema inutilizável, perda de dados\n  Alta     — funcionalidade principal quebrada\n  Média    — funcionalidade parcialmente afetada\n  Baixa    — cosmético, workaround disponível\n\nPrioridade = urgência de correção (negócio)\n  P1 — corrija agora (deploy hotfix hoje)\n  P2 — próxima sprint\n  P3 — backlog priorizado\n  P4 — backlog baixo\n\nExemplos:\n• Bug na tela de pagamento → Severidade Alta + P1\n• Botão levemente desalinhado em IE11 → Severidade Baixa + P4\n• Feature crítica com workaround funcional → Severidade Alta + P2' },
              { type: 'callout', html: '<strong>QA define severidade, negócio define prioridade.</strong> Um bug crítico pode ter prioridade baixa se afeta apenas 0,1% dos usuários em um browser descontinuado. Sempre contextualize com o PO.' },
            ]
          },
        ]
      },

      {
        id: 'M2', title: 'Boards e Sprints',
        description: 'Trabalhar com Scrum boards, sprints e Kanban no Jira.',
        status: 'available',
        lessons: [
          {
            id: 'jira.2.1', title: 'Scrum Board vs Kanban Board', description: 'Diferenças e quando usar cada abordagem.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Dois modelos de trabalho no Jira' },
              { type: 'code', lang: 'text', raw: 'SCRUM BOARD\n• Trabalho organizado em Sprints (ciclos fixos: 1-4 semanas)\n• Sprint Planning: time escolhe o que cabe na sprint\n• Sprint Goal: objetivo claro para o período\n• Review e Retrospectiva ao final de cada sprint\n• Backlog organizado por prioridade\n• Bom para: desenvolvimento de produto, times com PO\n\nKANBAN BOARD\n• Fluxo contínuo, sem sprints\n• WIP Limits: máximo de itens por coluna\n• Lead time e cycle time como métricas principais\n• Itens entram e saem continuamente\n• Bom para: suporte, ops, manutenção, bug fixing' },
              { type: 'callout', html: '<strong>Muitos times usam um híbrido:</strong> Sprint planning + board Kanban para bugs e suporte que chegam continuamente durante a sprint. Converse com seu time sobre o modelo que faz sentido.' },
            ]
          },
          {
            id: 'jira.2.2', title: 'Sprint Planning e o papel do QA', description: 'Como QA contribui no planejamento de sprint.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'QA no Sprint Planning' },
              { type: 'p', html: 'Sprint Planning não é só para devs. QA deve participar ativamente para: <strong>estimar o esforço de testes</strong>, identificar dependências de ambientes, garantir que critérios de aceite estão claros antes do sprint começar.' },
              { type: 'code', lang: 'text', raw: 'Perguntas que QA deve fazer no planning:\n\n• "Os critérios de aceite desta story cobrem os edge cases?"\n• "Temos acesso a dados de teste para este cenário?"\n• "Há dependência de outro sistema que ainda não está pronto?"\n• "Esta story inclui testes automatizados? Quem escreve?"\n• "Como vamos validar em staging antes de produção?"\n• "Qual é a estratégia de rollback se der problema?"\n\nDefinition of Ready (DoR) — a story está pronta para entrar na sprint?\n• Critérios de aceite escritos e revisados\n• Mockups aprovados (se houver)\n• Dependências resolvidas\n• Tamanho estimado (story points)' },
            ]
          },
          {
            id: 'jira.2.3', title: 'Gerenciando bugs durante a sprint', description: 'Fluxo de bug report, triagem e priorização.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Bug durante a sprint — o que fazer?' },
              { type: 'code', lang: 'text', raw: 'Cenário 1: Bug na story que está em desenvolvimento\n→ Reportar no Jira vinculado à story\n→ Avisar o dev diretamente (não esperar o processo)\n→ Story não pode ir para "Done" com bug aberto\n\nCenário 2: Bug em produção (hotfix urgente)\n→ Criar com Prioridade P1\n→ Avisar Tech Lead e PO imediatamente\n→ Pode interromper a sprint para resolver\n\nCenário 3: Bug de regressão (funcionalidade antiga quebrou)\n→ Criar e vincular ao Epic original\n→ Investigar qual PR introduziu a regressão (git blame)\n→ Adicionar teste de regressão automático para prevenção\n\nCenário 4: Bug menor, não bloqueia entrega\n→ Criar com prioridade adequada (P3/P4)\n→ Adicionar ao backlog para priorizar no próximo planning' },
              { type: 'callout', html: '<strong>Não aceite "não consegui reproduzir"</strong> sem investigação. Forneça passos detalhados, ambiente exato, dados de teste usados e evidências (screenshot + console log). Se ainda não reproduz, investigue se é flaky (intermitente).' },
            ]
          },
          {
            id: 'jira.2.4', title: 'Definition of Done e critérios de aceite', description: 'Garantir que o "pronto" signifique o mesmo para todos.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Definition of Done (DoD)' },
              { type: 'p', html: 'O DoD é um acordo do time sobre o que significa "a story está pronta". Sem DoD claro, cada pessoa tem um critério diferente — e bugs vão para produção.' },
              { type: 'code', lang: 'text', raw: 'Exemplo de Definition of Done:\n\n✅ Código revisado por pelo menos 1 dev\n✅ Testes unitários escritos e passando\n✅ Testes de integração passando\n✅ QA validou todos os critérios de aceite em staging\n✅ Testes de regressão passando (CI verde)\n✅ Sem bugs P1 ou P2 abertos relacionados\n✅ Documentação atualizada (se aplicável)\n✅ Feature flag configurada (se aplicável)\n✅ PO validou o comportamento final\n\nDoD deve estar visível para o time\n(fixado no Confluence, README ou wiki do projeto)' },
            ]
          },
          {
            id: 'jira.2.5', title: 'Métricas de sprint e qualidade', description: 'Velocity, bug rate e métricas de QA.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Métricas que QA acompanha' },
              { type: 'code', lang: 'text', raw: 'Métricas de sprint:\n\nVelocity         → story points entregues por sprint\n                   Tendência importa mais que o número\n\nBug Rate         → bugs / stories entregues\n                   Alta taxa = processo ou specs com problemas\n\nEscape Rate      → bugs encontrados em produção\n                   vs bugs encontrados em staging/QA\n                   Meta: 0 escapes críticos\n\nRework Rate      → % de stories que voltam por bugs\n                   Alta = critérios de aceite incompletos\n\nTest Coverage    → % de stories com testes automatizados\n                   Tende a aumentar com maturidade do time\n\nMTTD             → Mean Time to Detect\nMTTR             → Mean Time to Repair\n                   Ambos devem diminuir com o tempo' },
              { type: 'callout', html: '<strong>Métricas são um termômetro, não um martelo.</strong> Uma sprint com muitos bugs pode significar features complexas, não QA ruim. Use métricas para conversa e melhoria, não para cobrar individualmente.' },
            ]
          },
        ]
      },

      {
        id: 'M3', title: 'JQL Avançado',
        description: 'Dominar a Jira Query Language para relatórios e automações.',
        status: 'available',
        lessons: [
          {
            id: 'jira.3.1', title: 'Introdução ao JQL', description: 'Sintaxe básica e primeiras queries.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'JQL — a SQL do Jira' },
              { type: 'p', html: 'JQL (Jira Query Language) é uma linguagem de busca para filtrar issues no Jira com precisão. Usada em filtros, dashboards, relatórios e automações.' },
              { type: 'code', lang: 'text', raw: '# Sintaxe básica:\nCampo  Operador  Valor\n\n# Exemplos simples:\nproject = "SENTINEL"\nstatus = "In Progress"\nassignee = currentUser()\ntype = Bug\npriority = High\ncreated >= "2025-01-01"\n\n# Combinar com AND / OR:\nproject = SENTINEL AND status = "To Do" AND priority = High\ntype = Bug AND (priority = High OR priority = Critical)\n\n# Negação com NOT ou !=:\nstatus != Done\nNOT status in (Done, "Won\'t Fix")\ntype NOT IN (Sub-task, Epic)' },
              { type: 'callout', html: '<strong>Acesse o JQL</strong> em qualquer lista de issues, clique no botão "Switch to JQL" no topo direito da barra de pesquisa.' },
            ]
          },
          {
            id: 'jira.3.2', title: 'Funções especiais do JQL', description: 'currentUser(), currentSprint(), startOfWeek() e mais.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Funções dinâmicas do JQL' },
              { type: 'code', lang: 'text', raw: '# Funções de usuário:\nassignee = currentUser()\ncreator = currentUser()\nwatcher = currentUser()\n\n# Funções de sprint:\nsprint = openSprints()        # sprint em andamento\nsprint in openSprints()\nsprint in closedSprints()\n\n# Funções de data:\ncreated >= startOfDay()\ncreated >= startOfWeek()\ncreated >= startOfMonth()\ncreated >= -7d               # últimos 7 dias\nupdated >= "2025-01-01"\n\n# Funções de versão:\nfixVersion in unreleasedVersions()\nfixVersion in releasedVersions("SENTINEL")\n\n# Funções de sprint atual:\nsprint in openSprints() AND type = Bug\n→ Todos os bugs na sprint atual' },
            ]
          },
          {
            id: 'jira.3.3', title: 'Queries de QA mais usadas', description: 'Filtros prontos para o dia a dia de um QA Engineer.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Queries essenciais para QA' },
              { type: 'code', lang: 'text', raw: '# 1. Bugs abertos na sprint atual por prioridade\nproject = SENTINEL\nAND sprint in openSprints()\nAND type = Bug\nAND status NOT IN (Done, "Won\'t Fix", Closed)\nORDER BY priority ASC\n\n# 2. Stories aguardando validação de QA\nproject = SENTINEL\nAND type = Story\nAND status = "In Review"\nAND sprint in openSprints()\n\n# 3. Bugs escaparam para produção esta semana\nproject = SENTINEL\nAND type = Bug\nAND environment = "Produção"\nAND created >= startOfWeek()\n\n# 4. Issues sem critérios de aceite (campo vazio)\nproject = SENTINEL\nAND type = Story\nAND "Acceptance Criteria" is EMPTY\nAND sprint in openSprints()\n\n# 5. Meu backlog pessoal\nproject = SENTINEL\nAND assignee = currentUser()\nAND status != Done\nORDER BY priority ASC, updated DESC' },
            ]
          },
          {
            id: 'jira.3.4', title: 'Dashboards e gadgets no Jira', description: 'Criar dashboards visuais para o time.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Criando um Dashboard de QA' },
              { type: 'p', html: 'Dashboards no Jira são painéis com gadgets (widgets) que exibem dados em tempo real a partir de filtros JQL. Você pode criar um dashboard de qualidade visível para todo o time.' },
              { type: 'code', lang: 'text', raw: 'Dashboard de QA — gadgets sugeridos:\n\n1. Pie Chart — Bugs por prioridade (sprint atual)\n   Filtro: project = X AND type = Bug AND sprint in openSprints()\n\n2. Issue Statistics — Status de bugs\n   Filtro: project = X AND type = Bug AND sprint in openSprints()\n   Agrupar por: Status\n\n3. Two-Dimensional Stats — Bugs por componente e prioridade\n\n4. Assigned to Me — Meus itens pendentes\n   Filtro: assignee = currentUser() AND status != Done\n\n5. Sprint Health — Progress da sprint atual\n\nComo criar:\n   Jira → Dashboards → Create Dashboard → Add Gadget' },
              { type: 'callout', html: '<strong>Compartilhe o dashboard com o time:</strong> um dashboard visível para todos cria transparência sobre a qualidade. Quando devs veem o número de bugs P1 crescer, eles sentem o impacto também.' },
            ]
          },
          {
            id: 'jira.3.5', title: 'Automações e integrações', description: 'Jira Automation Rules e integração com GitHub.', duration: '12 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Jira Automation — regras automáticas' },
              { type: 'p', html: 'Jira Automation permite criar regras "quando X acontece, faça Y" — sem código. Útil para eliminar trabalho manual repetitivo.' },
              { type: 'code', lang: 'text', raw: 'Exemplos de automações úteis para QA:\n\n1. Mover story para "In Review" quando PR é aberto no GitHub\n   Trigger: GitHub PR aberto com branch [PROJ-123]\n   Action: Transicionar issue PROJ-123 → "In Review"\n\n2. Notificar QA quando story vai para revisão\n   Trigger: Status muda para "In Review"\n   Action: Notificar o QA assignee via Slack/email\n\n3. Criar sub-task de QA automaticamente para novas stories\n   Trigger: Issue criada do tipo Story\n   Action: Criar sub-task "QA: validação e casos de teste"\n\n4. Fechar bugs automaticamente quando PR é mergeado\n   Trigger: GitHub PR mergeado com "Fixes PROJ-456" na descrição\n   Action: Transicionar PROJ-456 → "Resolved"' },
              { type: 'exercise', title: 'Crie seu filtro de QA', desc: 'Crie um filtro JQL salvo com seus bugs prioritários.', steps: ['Acesse o Jira do seu time', 'Vá em Filters → Create Filter', 'Escreva uma query JQL para seus bugs P1 e P2 abertos', 'Adicione ao seu dashboard pessoal', 'Compartilhe o filtro com o time de QA'], starterCode: '# Filtro base para personalizar:\nproject = SEU_PROJETO\nAND type = Bug\nAND priority in (High, Critical)\nAND status NOT IN (Done, Closed)\nORDER BY priority ASC', solution: '# Não há solução única — adapte ao seu contexto de projeto' },
            ]
          },
        ]
      },
    ]
  };

  COURSE.getAllLessons = function () {
    var all = [];
    for (var i = 0; i < COURSE.modules.length; i++) {
      var mod = COURSE.modules[i];
      for (var j = 0; j < mod.lessons.length; j++) {
        all.push({ module: mod, lesson: mod.lessons[j], mi: i, li: j });
      }
    }
    return all;
  };

  COURSE.getLessonById = function (id) {
    var all = COURSE.getAllLessons();
    for (var k = 0; k < all.length; k++) {
      if (all[k].lesson.id === id) return all[k];
    }
    return null;
  };

  window.SL_JIRA = COURSE;
})();
