// Sentinel Learning — QA Foundation
// window.SL_QA_FOUNDATION
// Conteúdo real migrado de: archive/old-root-Sentinel-Learning/assets/js/lessons-qa-m*.js
// Lesson content (sections) disponível em window.QA_M1 ... window.QA_M7 (load-on-demand)

(function () {
  'use strict';

  var COURSE = {
    id:             'qa-foundation',
    slug:           'qa-foundation',
    title:          'QA Foundation',
    subtitle:       'Do fundamento ao mercado de qualidade',
    description:    'Testes manuais, automação com Playwright, testes de API, CI/CD, estratégia e posicionamento profissional em QA.',
    category:       'QA',
    level:          'Iniciante',
    estimatedHours: 40,
    totalModules:   7,
    totalLessons:   48,
    status:         'available',
    tags:           ['qa', 'testing', 'playwright', 'api', 'ci-cd', 'bugs', 'test cases'],
    storageKey:     'sl_dashboard_progress',

    // getLessonContent(moduleNum, lessonIndex) — retorna o objeto de aula do arquivo antigo
    // Requer que os arquivos lessons-qa-m*.js estejam carregados (js/data/qa/lessons-qa-m*.js)
    getLessonContent: function (moduleNum, lessonIndex) {
      var key = 'QA_M' + moduleNum;
      return window[key] ? window[key][lessonIndex] : null;
    },

    modules: [
      {
        id: 'M1',
        title: 'Fundamentos de QA',
        description: 'Qualidade de software, tipos de teste, papel do QA e mindset analítico.',
        status: 'available',
        lessons: [
          { id: 'qa.1.1', title: 'O que é Qualidade de Software?',    description: 'Definição de qualidade, dimensões e o custo dos bugs.',         duration: '12 min', xp: 60,  type: 'lesson',  status: 'available' },
          { id: 'qa.1.2', title: 'Tipos de Teste',                     description: 'Unitário, integração, E2E, caixa-branca, caixa-preta e pirâmide.', duration: '14 min', xp: 70,  type: 'lesson',  status: 'available' },
          { id: 'qa.1.3', title: 'O Papel do QA no Time',              description: 'Como QA colabora com devs, PO e stakeholders no processo ágil.',  duration: '11 min', xp: 55,  type: 'lesson',  status: 'available' },
          { id: 'qa.1.4', title: 'Mindset de QA',                      description: 'Pensar como QA: questionar, explorar, prevenir e documentar.',     duration: '10 min', xp: 50,  type: 'lesson',  status: 'available' },
          { id: 'qa.1.5', title: 'Critérios de Aceite e User Stories', description: 'Ler e validar user stories, escrever critérios de aceite claros.',  duration: '13 min', xp: 65,  type: 'lesson',  status: 'available' },
          { id: 'qa.1.6', title: 'Processo de Testes na Prática',      description: 'Ciclo completo: planejamento, execução, reporte e reteste.',        duration: '12 min', xp: 60,  type: 'lesson',  status: 'available' },
          { id: 'qa.1.7', title: 'Análise de Risco em QA',             description: 'Priorizar o que testar com base em risco e impacto de negócio.',    duration: '11 min', xp: 55,  type: 'lesson',  status: 'available' },
          { id: 'qa.1.8', title: 'Projeto: Monte um Plano de Testes',  description: 'Criar um plano de testes completo para um produto real.',           duration: '20 min', xp: 100, type: 'project', status: 'available' },
        ]
      },
      {
        id: 'M2',
        title: 'Testes Manuais & Bug Reports',
        description: 'Design de casos de teste, bug reports profissionais e gestão de defeitos.',
        status: 'available',
        lessons: [
          { id: 'qa.2.1', title: 'Design de Casos de Teste',                      description: 'Técnicas: partição de equivalência, valor limite, tabela de decisão.',   duration: '14 min', xp: 70,  type: 'lesson',  status: 'available' },
          { id: 'qa.2.2', title: 'Estratégias de Teste Manual',                   description: 'Quando testar manualmente e como otimizar o esforço.',                  duration: '12 min', xp: 60,  type: 'lesson',  status: 'available' },
          { id: 'qa.2.3', title: 'Escrita de Bug Reports de Qualidade',           description: 'Estrutura de bug report: título, passos, esperado, obtido, evidências.', duration: '15 min', xp: 75,  type: 'lesson',  status: 'available' },
          { id: 'qa.2.4', title: 'Coleta e Gestão de Evidências',                 description: 'Screenshots, logs, vídeos e como organizar evidências de testes.',       duration: '11 min', xp: 55,  type: 'lesson',  status: 'available' },
          { id: 'qa.2.5', title: 'Gestão de Defeitos no Ciclo de Vida',           description: 'Fluxo do bug: aberto → em análise → corrigido → verificado → fechado.', duration: '12 min', xp: 60,  type: 'lesson',  status: 'available' },
          { id: 'qa.2.6', title: 'Teste de Regressão Manual',                     description: 'Montar e executar suite de regressão de forma eficiente.',               duration: '11 min', xp: 55,  type: 'lesson',  status: 'available' },
          { id: 'qa.2.7', title: 'Testes de Interface, Acessibilidade e UX',      description: 'Validar UI, fluxos de usuário e conformidade com WCAG básico.',          duration: '13 min', xp: 65,  type: 'lesson',  status: 'available' },
          { id: 'qa.2.8', title: 'Projeto: Suite de Testes Manuais Completa',     description: 'Criar suite de testes manual para um sistema de e-commerce completo.',  duration: '25 min', xp: 125, type: 'project', status: 'available' },
        ]
      },
      {
        id: 'M3',
        title: 'Automação com Playwright',
        description: 'Do primeiro teste à suite E2E profissional com Playwright e Page Object Model.',
        status: 'available',
        lessons: [
          { id: 'qa.3.1', title: 'Introdução ao Playwright',                     description: 'Por que Playwright, instalação, config e primeiro teste.',                  duration: '14 min', xp: 70,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.2', title: 'Locators — Seletores Resilientes',             description: 'getByRole, getByText, getByLabel e composição de locators.',               duration: '16 min', xp: 80,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.3', title: 'Ações e Interações com a Página',              description: 'click, fill, select, hover, drag e upload de arquivos.',                   duration: '14 min', xp: 70,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.4', title: 'Assertions com expect()',                       description: 'toBeVisible, toHaveText, toBeEnabled, toHaveURL e mais.',                  duration: '13 min', xp: 65,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.5', title: 'Page Object Model (POM)',                       description: 'Estruturar testes com POM para máxima reutilização e manutenção.',         duration: '16 min', xp: 80,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.6', title: 'Fixtures e Dados de Teste',                    description: 'beforeAll, beforeEach, fixtures customizados e dados de teste.',           duration: '13 min', xp: 65,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.7', title: 'Interceptação de Rede e Mocking de API',       description: 'route.fulfill(), page.route() para simular respostas de backend.',         duration: '14 min', xp: 70,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.8', title: 'Screenshots, Vídeos e Relatórios',             description: 'Configurar evidências automáticas e o HTML reporter do Playwright.',       duration: '11 min', xp: 55,  type: 'lesson',  status: 'available' },
          { id: 'qa.3.9', title: 'Projeto: Suite E2E de Login e Cadastro',        description: 'Suite completa com POM, fixtures, assertions e relatório de execução.',   duration: '30 min', xp: 150, type: 'project', status: 'available' },
        ]
      },
      {
        id: 'M4',
        title: 'Testes de API',
        description: 'REST, HTTP, Postman, validação de schema, autenticação e testes de contrato.',
        status: 'available',
        lessons: [
          { id: 'qa.4.1', title: 'Fundamentos de API REST',                       description: 'Recursos, endpoints, CRUD e os princípios REST que todo QA precisa.',     duration: '20 min', xp: 100, type: 'lesson',  status: 'available' },
          { id: 'qa.4.2', title: 'HTTP: Verbos, Status Codes e Headers',          description: 'GET, POST, PUT, DELETE, PATCH e os códigos 2xx, 4xx, 5xx na prática.',   duration: '22 min', xp: 110, type: 'lesson',  status: 'available' },
          { id: 'qa.4.3', title: 'Postman — Criando e Executando Requisições',    description: 'Coleções, variáveis de ambiente, pré-scripts e testes automáticos.',      duration: '28 min', xp: 130, type: 'lesson',  status: 'available' },
          { id: 'qa.4.4', title: 'Validando Response Body e Schema',              description: 'Verificar JSON, status, headers e validar schema com JSON Schema.',        duration: '25 min', xp: 120, type: 'lesson',  status: 'available' },
          { id: 'qa.4.5', title: 'Autenticação em APIs',                          description: 'Basic Auth, Bearer Token, OAuth 2.0 e como testar cada um.',              duration: '24 min', xp: 120, type: 'lesson',  status: 'available' },
          { id: 'qa.4.6', title: 'Testes Negativos e Cenários de Contrato',       description: 'Inputs inválidos, limites, erros e consumer-driven contract testing.',     duration: '26 min', xp: 130, type: 'lesson',  status: 'available' },
          { id: 'qa.4.7', title: 'Projeto — Suite de Testes de API',              description: 'Suite completa no Postman para uma API REST real com CI integration.',    duration: '40 min', xp: 200, type: 'project', status: 'available' },
        ]
      },
      {
        id: 'M5',
        title: 'CI/CD para QA',
        description: 'GitHub Actions, pipelines de teste, ambientes e qualidade no processo de entrega contínua.',
        status: 'available',
        lessons: [
          { id: 'qa.5.1', title: 'CI/CD — O que é e por que o QA precisa saber',          description: 'Conceitos de integração e entrega contínua e o papel do QA.',          duration: '18 min', xp: 100, type: 'lesson',  status: 'available' },
          { id: 'qa.5.2', title: 'GitHub Actions — Configurando seu primeiro pipeline',    description: 'Workflow, jobs, steps e rodar testes de Playwright no CI.',            duration: '30 min', xp: 150, type: 'lesson',  status: 'available' },
          { id: 'qa.5.3', title: 'Relatórios, Artifacts e Notificações',                  description: 'Publicar relatórios HTML, salvar screenshots e notificar no Slack.',   duration: '22 min', xp: 110, type: 'lesson',  status: 'available' },
          { id: 'qa.5.4', title: 'Ambientes de Teste e Dados no CI',                      description: 'Variáveis de ambiente, secrets, seed de dados e isolamento.',          duration: '24 min', xp: 120, type: 'lesson',  status: 'available' },
          { id: 'qa.5.5', title: 'Testes de Regressão no Pipeline',                       description: 'Configurar regressão automática a cada PR e bloqueio de merge.',       duration: '20 min', xp: 110, type: 'lesson',  status: 'available' },
          { id: 'qa.5.6', title: 'QA como Guardião do Pipeline',                          description: 'Quality gates, monitoramento pós-deploy e alerta precoce de falhas.',  duration: '22 min', xp: 120, type: 'lesson',  status: 'available' },
        ]
      },
      {
        id: 'M6',
        title: 'Estratégia & Métricas',
        description: 'Pensar QA estrategicamente: planos, métricas, exploratório e cultura de qualidade.',
        status: 'available',
        lessons: [
          { id: 'qa.6.1', title: 'Estratégia de Teste — Pensando antes de executar', description: 'Cobertura, priorização, abordagem risk-based e decisões de QA.',       duration: '22 min', xp: 110, type: 'lesson',  status: 'available' },
          { id: 'qa.6.2', title: 'Métricas de Qualidade',                             description: 'Bug rate, cobertura, MTTR, flakiness e como usar dados para decidir.', duration: '24 min', xp: 120, type: 'lesson',  status: 'available' },
          { id: 'qa.6.3', title: 'Plano de Teste — Como estruturar',                  description: 'Escrever planos de teste profissionais: escopo, critérios, riscos.',    duration: '26 min', xp: 130, type: 'lesson',  status: 'available' },
          { id: 'qa.6.4', title: 'Teste Exploratório com Método',                     description: 'Session-based testing, charters e como explorar sem roteiro fixo.',     duration: '20 min', xp: 110, type: 'lesson',  status: 'available' },
          { id: 'qa.6.5', title: 'Qualidade como Cultura',                            description: 'Shift-left, "quality is everyone\'s job" e QA além do teste.',         duration: '20 min', xp: 120, type: 'lesson',  status: 'available' },
        ]
      },
      {
        id: 'M7',
        title: 'QA no Mercado',
        description: 'Portfólio, entrevistas técnicas, certificações e como se posicionar como QA Engineer.',
        status: 'available',
        lessons: [
          { id: 'qa.7.1', title: 'O Mercado de QA em 2025',                        description: 'Salários, demanda, stacks mais pedidas e onde encontrar vagas.',            duration: '18 min', xp: 100, type: 'lesson',  status: 'available' },
          { id: 'qa.7.2', title: 'Construindo seu Portfólio de QA',                description: 'Projetos que impressionam: suite Playwright, Postman, relatórios reais.',   duration: '26 min', xp: 130, type: 'lesson',  status: 'available' },
          { id: 'qa.7.3', title: 'Entrevistas técnicas de QA',                     description: 'Perguntas comuns, live coding, resolução de casos e como se preparar.',    duration: '28 min', xp: 140, type: 'lesson',  status: 'available' },
          { id: 'qa.7.4', title: 'Certificações e Aprendizado Contínuo',           description: 'CTFL, AWS, Playwright Certified e como se manter atualizado em QA.',       duration: '18 min', xp: 100, type: 'lesson',  status: 'available' },
          { id: 'qa.7.5', title: 'Projeto Final — Sua Suite Completa de QA',       description: 'Suite E2E + API + CI/CD + portfólio publicado: entrega final do curso.',   duration: '60 min', xp: 300, type: 'project', status: 'available' },
        ]
      },
    ]
  };

  // Helper: flatten all lessons across modules
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

  // Helper: find lesson by id
  COURSE.getLessonById = function (id) {
    var all = COURSE.getAllLessons();
    for (var k = 0; k < all.length; k++) {
      if (all[k].lesson.id === id) return all[k];
    }
    return null;
  };

  window.SL_QA_FOUNDATION = COURSE;
})();
