// Sentinel Learning — Course Catalog Data
// window.COURSES_DATA

(function () {
  'use strict';

  var COURSES = [
    {
      id:             'english-for-devs',
      title:          'English for Developers',
      subtitle:       'Inglês técnico para times internacionais',
      description:    'Do primeiro standup à code review em inglês. 4 níveis (A1 → C1) com vocabulário técnico, diálogos reais e quiz interativo.',
      category:       'Idiomas',
      categoryVariant:'accent',
      level:          'A1 → C1',
      estimatedHours: 80,
      totalModules:   28,
      totalLessons:   140,
      progress:       25,  // % — calculado via EStorage em runtime
      status:         'available',
      storageKey:     'sentinel_learning_english_v1',
      href:           'pages/english-dashboard.html',
      iconLabel:      'EN',
      iconVariant:    'accent',
      color:          '#00D4AA',
      highlight:      true
    },
    {
      id:             'qa-foundation',
      title:          'QA Foundation',
      subtitle:       'Fundamentos de garantia de qualidade',
      description:    'Ciclo de vida do bug, casos de teste, pirâmide de testes, relatórios de defeitos e pensamento analítico para QA Engineers.',
      category:       'QA',
      categoryVariant:'primary',
      level:          'Iniciante',
      estimatedHours: 40,
      totalModules:   7,
      totalLessons:   35,
      progress:       42,
      status:         'available',
      storageKey:     'sl_dashboard_progress',
      href:           '#/modules',
      iconLabel:      'QA',
      iconVariant:    'primary',
      color:          '#6C63FF',
      highlight:      false
    },
    {
      id:             'playwright-qa',
      title:          'Playwright para QA',
      subtitle:       'Automação E2E com Playwright + TypeScript',
      description:    'Page Object Model, fixtures, relatórios, CI/CD integration. Do primeiro test à suite completa em produção.',
      category:       'Automação',
      categoryVariant:'warning',
      level:          'Intermediário',
      estimatedHours: 35,
      totalModules:   6,
      totalLessons:   30,
      progress:       0,
      status:         'coming-soon',
      href:           '#/courses',
      iconLabel:      'PW',
      iconVariant:    'warning',
      color:          '#FFB347',
      highlight:      false
    },
    {
      id:             'frontend-foundation',
      title:          'Front-End Foundation',
      subtitle:       'HTML, CSS e JavaScript essencial',
      description:    'Semântica HTML5, Flexbox, Grid, JavaScript moderno (ES6+), responsividade e boas práticas para devs front-end.',
      category:       'Front-End',
      categoryVariant:'info',
      level:          'Iniciante',
      estimatedHours: 50,
      totalModules:   8,
      totalLessons:   40,
      progress:       0,
      status:         'coming-soon',
      href:           '#/courses',
      iconLabel:      'FE',
      iconVariant:    'info',
      color:          '#38BDF8',
      highlight:      false
    },
    {
      id:             'jira-jql',
      title:          'Jira & JQL',
      subtitle:       'Gestão de projetos ágeis com Jira',
      description:    'Criação de projetos, boards, sprints, backlog e consultas JQL avançadas para QA Engineers e equipes ágeis.',
      category:       'Ferramentas',
      categoryVariant:'danger',
      level:          'Iniciante',
      estimatedHours: 15,
      totalModules:   3,
      totalLessons:   15,
      progress:       0,
      status:         'coming-soon',
      href:           '#/courses',
      iconLabel:      'JR',
      iconVariant:    'danger',
      color:          '#FF4D6D',
      highlight:      false
    },
    {
      id:             'git-github',
      title:          'Git & GitHub',
      subtitle:       'Controle de versão na prática',
      description:    'Workflows com Git, pull requests, branches, merge, rebase, GitHub Actions e colaboração em times de desenvolvimento.',
      category:       'DevOps',
      categoryVariant:'success',
      level:          'Iniciante',
      estimatedHours: 20,
      totalModules:   4,
      totalLessons:   20,
      progress:       0,
      status:         'coming-soon',
      href:           '#/courses',
      iconLabel:      'GT',
      iconVariant:    'success',
      color:          '#00D4AA',
      highlight:      false
    },
    {
      id:             'web-fundamentals',
      title:          'Web Fundamentals',
      subtitle:       'Como a web funciona de verdade',
      description:    'HTTP, DNS, APIs REST, autenticação, cookies, CORS e o ciclo completo de uma requisição — conhecimento essencial para QA e devs.',
      category:       'Base',
      categoryVariant:'primary',
      level:          'Iniciante',
      estimatedHours: 18,
      totalModules:   4,
      totalLessons:   20,
      progress:       0,
      status:         'coming-soon',
      href:           '#/courses',
      iconLabel:      'WB',
      iconVariant:    'primary',
      color:          '#6C63FF',
      highlight:      false
    },
    {
      id:             'javascript-foundation',
      title:          'JavaScript Foundation',
      subtitle:       'JS moderno para QA e automação',
      description:    'Variáveis, funções, arrays, objetos, Promises, async/await. Foco em JS aplicado a testes e scripts de automação.',
      category:       'Programação',
      categoryVariant:'warning',
      level:          'Iniciante',
      estimatedHours: 30,
      totalModules:   6,
      totalLessons:   30,
      progress:       0,
      status:         'coming-soon',
      href:           '#/courses',
      iconLabel:      'JS',
      iconVariant:    'warning',
      color:          '#FFB347',
      highlight:      false
    }
  ];

  window.COURSES_DATA = {
    courses: COURSES,
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
})();
