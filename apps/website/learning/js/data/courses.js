// Sentinel Learning — Full Course Catalog
// window.SL_COURSES  (also aliases window.COURSES_DATA for backward compat)

(function () {
  'use strict';

  var COURSES = [
    {
      id:             'english-for-devs',
      slug:           'english',
      title:          'English for Developers',
      subtitle:       'Inglês técnico para times internacionais',
      description:    'Do primeiro standup à code review em inglês. 4 níveis (A1 → C1) com vocabulário técnico, diálogos reais e quiz interativo.',
      category:       'Idiomas',
      categoryVariant: 'accent',
      level:          'A1 → C1',
      estimatedHours: 80,
      totalModules:   28,
      totalLessons:   140,
      status:         'available',
      tags:           ['english', 'communication', 'soft skills'],
      color:          '#00D4AA',
      iconLabel:      'EN',
      iconVariant:    'accent',
      highlight:      true,
      href:           '#/course/english',
      storageKey:     'sentinel_learning_english_v1',
      modules: [
        { id: 'L1M1', title: 'Introductions & Greetings',  lessons: 5, level: 'A1', status: 'available' },
        { id: 'L1M2', title: 'Daily Routine',              lessons: 5, level: 'A1', status: 'available' },
        { id: 'L1M3', title: 'Basic Tech Vocabulary',      lessons: 5, level: 'A1', status: 'available' },
        { id: 'L1M4', title: 'Frontend Basics',            lessons: 5, level: 'A1', status: 'available' },
        { id: 'L1M5', title: 'Talking About Projects',     lessons: 5, level: 'A2', status: 'available' },
        { id: 'L1M6', title: 'Asking Questions',           lessons: 5, level: 'A2', status: 'available' },
        { id: 'L1M7', title: 'Simple Conversations',       lessons: 5, level: 'A2', status: 'available' },
        { id: 'L2M1', title: 'Agile & Scrum',             lessons: 5, level: 'B1', status: 'coming-soon' },
        { id: 'L2M2', title: 'Code Reviews',              lessons: 5, level: 'B1', status: 'coming-soon' },
        { id: 'L2M3', title: 'Technical Presentations',   lessons: 5, level: 'B1', status: 'coming-soon' },
        { id: 'L2M4', title: 'Remote Communication',      lessons: 5, level: 'B1', status: 'coming-soon' },
        { id: 'L2M5', title: 'Writing & Documentation',   lessons: 5, level: 'B1', status: 'coming-soon' },
        { id: 'L2M6', title: 'Bug Reports & QA',          lessons: 5, level: 'B1', status: 'coming-soon' },
        { id: 'L2M7', title: 'API & Backend Vocab',       lessons: 5, level: 'B2', status: 'coming-soon' },
      ]
    },
    {
      id:             'qa-foundation',
      slug:           'qa-foundation',
      title:          'QA Foundation',
      subtitle:       'Fundamentos de garantia de qualidade',
      description:    'Ciclo de vida do bug, casos de teste, pirâmide de testes, relatórios de defeitos e pensamento analítico para QA Engineers.',
      category:       'QA',
      categoryVariant: 'primary',
      level:          'Iniciante',
      estimatedHours: 40,
      totalModules:   7,
      totalLessons:   48,
      status:         'available',
      tags:           ['qa', 'testing', 'bugs', 'test cases'],
      color:          '#6C63FF',
      iconLabel:      'QA',
      iconVariant:    'primary',
      highlight:      false,
      href:           '#/modules',
      storageKey:     'sl_dashboard_progress',
      modules: [
        { id: 'M1', title: 'Fundamentos de QA',            lessons: 8,  level: 'Iniciante',    status: 'done'    },
        { id: 'M2', title: 'Testes Manuais & Bug Reports', lessons: 8,  level: 'Iniciante',    status: 'done'    },
        { id: 'M3', title: 'Automação com Playwright',     lessons: 9,  level: 'Básico',       status: 'current' },
        { id: 'M4', title: 'Testes de API',                lessons: 7,  level: 'Básico',       status: 'locked'  },
        { id: 'M5', title: 'CI/CD para QA',                lessons: 6,  level: 'Intermediário',status: 'locked'  },
        { id: 'M6', title: 'Estratégia & Métricas',        lessons: 5,  level: 'Intermediário',status: 'locked'  },
        { id: 'M7', title: 'QA no Mercado',                lessons: 5,  level: 'Avançado',     status: 'locked'  },
      ]
    },
    {
      id:             'playwright-qa',
      slug:           'playwright-qa',
      title:          'Playwright para QA',
      subtitle:       'Automação E2E com Playwright + TypeScript',
      description:    'Page Object Model, fixtures, relatórios, CI/CD integration. Do primeiro test à suite completa em produção.',
      category:       'Automação',
      categoryVariant: 'warning',
      level:          'Intermediário',
      estimatedHours: 35,
      totalModules:   6,
      totalLessons:   30,
      status:         'available',
      tags:           ['playwright', 'typescript', 'automation', 'e2e'],
      color:          '#FFB347',
      iconLabel:      'PW',
      iconVariant:    'warning',
      highlight:      false,
      href:           '#/course/playwright-qa',
      storageKey:     null,
      modules: [
        { id: 'M1', title: 'Intro ao Playwright',    lessons: 5, level: 'Básico',       status: 'available' },
        { id: 'M2', title: 'Seletores e Locators',   lessons: 5, level: 'Básico',       status: 'available' },
        { id: 'M3', title: 'Page Object Model',      lessons: 5, level: 'Intermediário',status: 'available' },
        { id: 'M4', title: 'Fixtures e Setup',       lessons: 5, level: 'Intermediário',status: 'available' },
        { id: 'M5', title: 'Relatórios e CI/CD',     lessons: 5, level: 'Avançado',     status: 'available' },
        { id: 'M6', title: 'Suite Completa',         lessons: 5, level: 'Avançado',     status: 'available' },
      ]
    },
    {
      id:             'frontend-foundation',
      slug:           'frontend',
      title:          'Front-End Foundation',
      subtitle:       'HTML, CSS e JavaScript essencial',
      description:    'Semântica HTML5, Flexbox, Grid, JavaScript moderno (ES6+), responsividade e boas práticas para devs front-end.',
      category:       'Front-End',
      categoryVariant: 'info',
      level:          'Iniciante',
      estimatedHours: 50,
      totalModules:   8,
      totalLessons:   40,
      status:         'available',
      tags:           ['html', 'css', 'javascript', 'frontend'],
      color:          '#38BDF8',
      iconLabel:      'FE',
      iconVariant:    'info',
      highlight:      false,
      href:           '#/course/frontend',
      storageKey:     null,
      modules: [
        { id: 'M1', title: 'HTML Semântico',       lessons: 5, level: 'Iniciante',    status: 'available' },
        { id: 'M2', title: 'CSS Flexbox',          lessons: 5, level: 'Iniciante',    status: 'available' },
        { id: 'M3', title: 'CSS Grid',             lessons: 5, level: 'Básico',       status: 'available' },
        { id: 'M4', title: 'JavaScript ES6+',      lessons: 5, level: 'Básico',       status: 'available' },
        { id: 'M5', title: 'Responsividade',       lessons: 5, level: 'Intermediário',status: 'available' },
        { id: 'M6', title: 'Acessibilidade',       lessons: 5, level: 'Intermediário',status: 'available' },
        { id: 'M7', title: 'Performance Web',      lessons: 5, level: 'Avançado',     status: 'available' },
        { id: 'M8', title: 'Projeto Final',        lessons: 5, level: 'Avançado',     status: 'available' },
      ]
    },
    {
      id:             'jira-jql',
      slug:           'jira-jql',
      title:          'Jira & JQL',
      subtitle:       'Gestão de projetos ágeis com Jira',
      description:    'Criação de projetos, boards, sprints, backlog e consultas JQL avançadas para QA Engineers e equipes ágeis.',
      category:       'Ferramentas',
      categoryVariant: 'danger',
      level:          'Iniciante',
      estimatedHours: 15,
      totalModules:   3,
      totalLessons:   15,
      status:         'available',
      tags:           ['jira', 'jql', 'agile', 'project management'],
      color:          '#FF4D6D',
      iconLabel:      'JR',
      iconVariant:    'danger',
      highlight:      false,
      href:           '#/course/jira-jql',
      storageKey:     null,
      modules: [
        { id: 'M1', title: 'Jira Essentials',      lessons: 5, level: 'Iniciante',    status: 'available' },
        { id: 'M2', title: 'Boards e Sprints',     lessons: 5, level: 'Básico',       status: 'available' },
        { id: 'M3', title: 'JQL Avançado',         lessons: 5, level: 'Intermediário',status: 'available' },
      ]
    },
    {
      id:             'git-github',
      slug:           'git-github',
      title:          'Git & GitHub',
      subtitle:       'Controle de versão na prática',
      description:    'Workflows com Git, pull requests, branches, merge, rebase, GitHub Actions e colaboração em times.',
      category:       'DevOps',
      categoryVariant: 'success',
      level:          'Iniciante',
      estimatedHours: 20,
      totalModules:   4,
      totalLessons:   20,
      status:         'available',
      tags:           ['git', 'github', 'version control', 'devops'],
      color:          '#00D4AA',
      iconLabel:      'GT',
      iconVariant:    'success',
      highlight:      false,
      href:           '#/course/git-github',
      storageKey:     null,
      modules: [
        { id: 'M1', title: 'Git Fundamentos',        lessons: 5, level: 'Iniciante',    status: 'available' },
        { id: 'M2', title: 'Branches & Merge',       lessons: 5, level: 'Básico',       status: 'available' },
        { id: 'M3', title: 'GitHub & Pull Requests', lessons: 5, level: 'Intermediário',status: 'available' },
        { id: 'M4', title: 'GitHub Actions',         lessons: 5, level: 'Avançado',     status: 'available' },
      ]
    },
    {
      id:             'web-fundamentals',
      slug:           'web-fundamentals',
      title:          'Web Fundamentals',
      subtitle:       'Como a web funciona de verdade',
      description:    'HTTP, DNS, APIs REST, autenticação, cookies, CORS e o ciclo completo de uma requisição — essencial para QA e devs.',
      category:       'Base',
      categoryVariant: 'primary',
      level:          'Iniciante',
      estimatedHours: 18,
      totalModules:   4,
      totalLessons:   20,
      status:         'available',
      tags:           ['http', 'api', 'rest', 'web', 'dns'],
      color:          '#6C63FF',
      iconLabel:      'WB',
      iconVariant:    'primary',
      highlight:      false,
      href:           '#/course/web-fundamentals',
      storageKey:     null,
      modules: [
        { id: 'M1', title: 'HTTP & DNS',             lessons: 5, level: 'Iniciante',    status: 'available' },
        { id: 'M2', title: 'APIs REST',              lessons: 5, level: 'Básico',       status: 'available' },
        { id: 'M3', title: 'Autenticação & Cookies', lessons: 5, level: 'Intermediário',status: 'available' },
        { id: 'M4', title: 'CORS & Segurança',       lessons: 5, level: 'Intermediário',status: 'available' },
      ]
    },
    {
      id:             'javascript-foundation',
      slug:           'javascript',
      title:          'JavaScript Foundation',
      subtitle:       'JS moderno para QA e automação',
      description:    'Variáveis, funções, arrays, objetos, Promises, async/await. Foco em JS aplicado a testes e scripts de automação.',
      category:       'Programação',
      categoryVariant: 'warning',
      level:          'Iniciante',
      estimatedHours: 30,
      totalModules:   7,
      totalLessons:   48,
      status:         'coming-soon',
      tags:           ['javascript', 'es6', 'async', 'promises', 'automation'],
      color:          '#FFB347',
      iconLabel:      'JS',
      iconVariant:    'warning',
      highlight:      false,
      href:           '#/course/javascript',
      storageKey:     null,
      modules: [
        { id: 'M1', title: 'Fundamentos',         lessons: 8,  level: 'Iniciante',    status: 'coming-soon' },
        { id: 'M2', title: 'JavaScript Base',     lessons: 10, level: 'Iniciante',    status: 'coming-soon' },
        { id: 'M3', title: 'DOM & Eventos',       lessons: 9,  level: 'Básico',       status: 'coming-soon' },
        { id: 'M4', title: 'Projetos Reais',      lessons: 3,  level: 'Básico',       status: 'coming-soon' },
        { id: 'M5', title: 'Git & GitHub',        lessons: 7,  level: 'Intermediário',status: 'coming-soon' },
        { id: 'M6', title: 'Deploy & Portfólio', lessons: 5,  level: 'Intermediário',status: 'coming-soon' },
        { id: 'M7', title: 'Mercado de Trabalho',lessons: 6,  level: 'Avançado',     status: 'coming-soon' },
      ]
    },
  ];

  window.SL_COURSES = {
    courses: COURSES,
    getBySlug: function (slug) {
      for (var i = 0; i < COURSES.length; i++) {
        if (COURSES[i].slug === slug) return COURSES[i];
      }
      return null;
    },
    getById: function (id) {
      for (var i = 0; i < COURSES.length; i++) {
        if (COURSES[i].id === id) return COURSES[i];
      }
      return null;
    },
    getAvailable: function () {
      return COURSES.filter(function (c) { return c.status === 'available'; });
    }
  };

  // Backward-compat alias
  window.COURSES_DATA = {
    courses: COURSES,
    getById:      window.SL_COURSES.getById,
    getAvailable: window.SL_COURSES.getAvailable
  };
})();
