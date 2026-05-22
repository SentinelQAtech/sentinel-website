// Sentinel Learning — JavaScript Foundation
// window.SL_JS_FOUNDATION
// Conteúdo real migrado de: archive/old-root-Sentinel-Learning/assets/js/lessons-m*.js
// Lesson content (sections) disponível em window.M1 ... window.M7 (load-on-demand)

(function () {
  'use strict';

  var COURSE = {
    id:             'javascript-foundation',
    slug:           'javascript',
    title:          'JavaScript Foundation',
    subtitle:       'Do zero ao desenvolvedor front-end',
    description:    'Lógica, DOM, APIs, Git, deploy e projetos reais. Tudo que você precisa para entrar no mercado como dev front-end.',
    category:       'Programação',
    level:          'Iniciante',
    estimatedHours: 30,
    totalModules:   7,
    totalLessons:   48,
    status:         'coming-soon',
    tags:           ['javascript', 'dom', 'git', 'deploy', 'frontend', 'es6'],
    storageKey:     null,

    // getLessonContent(moduleNum, lessonIndex) — retorna o objeto de aula do arquivo antigo
    // Requer que os arquivos lessons-m*.js estejam carregados (js/data/js/lessons-m*.js)
    getLessonContent: function (moduleNum, lessonIndex) {
      var key = 'M' + moduleNum;
      return window[key] ? window[key][lessonIndex] : null;
    },

    modules: [
      {
        id: 'M1',
        title: 'Fundamentos',
        description: 'Lógica de programação, variáveis, condicionais, loops e funções em JavaScript.',
        status: 'coming-soon',
        lessons: [
          { id: 'js.1.1', title: 'Lógica de Programação',    description: 'Algoritmos, sequências, condições e repetições — pensar antes de codar.',    duration: '12 min', xp: 60,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.1.2', title: 'Variáveis e Tipos de Dados', description: 'var, let, const, string, number, boolean, null, undefined e typeof.',     duration: '15 min', xp: 75,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.1.3', title: 'Condicionais (if / else)',  description: 'if, else if, else, operadores de comparação e switch/case.',                 duration: '14 min', xp: 70,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.1.4', title: 'Loops (for / while)',       description: 'for, while, do-while, break, continue e quando usar cada um.',               duration: '16 min', xp: 80,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.1.5', title: 'Funções',                   description: 'Declaração, expressão, arrow function, parâmetros e return.',                duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.1.6', title: 'Escopo de Variáveis',       description: 'Escopo global, de função, de bloco e o comportamento de hoisting.',          duration: '12 min', xp: 60,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.1.7', title: 'Exercícios Práticos',       description: 'Desafios com FizzBuzz, palíndromo e manipulação de strings.',                duration: '20 min', xp: 100, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.1.8', title: 'Projeto: Calculadora Simples', description: 'Construir uma calculadora com operações básicas e científicas em JS puro.', duration: '30 min', xp: 150, type: 'project', status: 'coming-soon' },
        ]
      },
      {
        id: 'M2',
        title: 'JavaScript Base',
        description: 'Arrays, objetos, métodos funcionais, desestruturação, strings e tratamento de erros.',
        status: 'coming-soon',
        lessons: [
          { id: 'js.2.1',  title: 'Arrays: Fundamentos',           description: 'Criar, acessar, iterar e modificar arrays com índice e length.',            duration: '15 min', xp: 75,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.2',  title: 'Métodos de Array: Modificar',   description: 'push, pop, shift, unshift, splice, sort e reverse.',                        duration: '14 min', xp: 70,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.3',  title: 'Métodos de Array: Transformar', description: 'map, filter, reduce, find, findIndex, some, every e flat.',                  duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.4',  title: 'Objetos: Fundamentos',          description: 'Criar objetos, acessar propriedades, métodos e this básico.',                duration: '16 min', xp: 80,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.5',  title: 'Objetos: Avançado',             description: 'Object.keys, values, entries, assign, spread e imutabilidade.',              duration: '15 min', xp: 75,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.6',  title: 'Desestruturação e Spread',      description: 'Desestruturar arrays e objetos, rest params e spread operator.',              duration: '15 min', xp: 75,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.7',  title: 'Métodos de String',             description: 'slice, split, replace, includes, startsWith, trim, padStart e template literals.', duration: '14 min', xp: 70, type: 'lesson', status: 'coming-soon' },
          { id: 'js.2.8',  title: 'Tratamento de Erros',           description: 'try/catch/finally, throw, Error types e estratégias de fallback.',           duration: '14 min', xp: 70,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.9',  title: 'Exercícios Práticos M2',        description: 'Desafios de arrays, objetos e estatísticas de notas.',                       duration: '25 min', xp: 125, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.2.10', title: 'Projeto: Lista de Tarefas',     description: 'App de tarefas com prioridades, filtros e persistência em localStorage.',    duration: '35 min', xp: 175, type: 'project', status: 'coming-soon' },
        ]
      },
      {
        id: 'M3',
        title: 'DOM & Eventos',
        description: 'Manipular a página com JavaScript: selecionar, criar, remover e reagir a eventos do usuário.',
        status: 'coming-soon',
        lessons: [
          { id: 'js.3.1', title: 'O que é o DOM',                        description: 'Document Object Model: a representação da página como árvore de objetos.',  duration: '14 min', xp: 70,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.2', title: 'Selecionando Elementos',               description: 'getElementById, querySelector, querySelectorAll e NodeList.',              duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.3', title: 'Manipulando Conteúdo e Estilos',       description: 'textContent, innerHTML, classList, style e atributos.',                   duration: '20 min', xp: 100, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.4', title: 'Criando e Removendo Elementos',         description: 'createElement, appendChild, insertBefore, remove e cloneNode.',           duration: '20 min', xp: 100, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.5', title: 'Eventos — addEventListener',           description: 'click, keydown, submit, load, DOMContentLoaded e removeEventListener.',    duration: '22 min', xp: 110, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.6', title: 'Eventos de Formulário',                description: 'submit, input, change, blur, validação nativa e event.preventDefault().',  duration: '22 min', xp: 110, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.7', title: 'Delegação de Eventos',                 description: 'event.target, bubbling, e delegação em listas dinâmicas.',                 duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.8', title: 'localStorage — Dados no Browser',      description: 'getItem, setItem, removeItem, JSON.stringify/parse e sessionStorage.',     duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.3.9', title: 'Projeto — Lista de Tarefas Completa',  description: 'App completo com CRUD, filtros, drag & drop e persistência local.',        duration: '45 min', xp: 225, type: 'project', status: 'coming-soon' },
        ]
      },
      {
        id: 'M4',
        title: 'Projetos Reais',
        description: 'Três projetos progressivos: calculadora, app de clima com API e dashboard financeiro.',
        status: 'coming-soon',
        lessons: [
          { id: 'js.4.1', title: 'Projeto 1 — Calculadora',                description: 'Calculadora científica com histórico, teclado e modo dark/light.',        duration: '50 min', xp: 250, type: 'project', status: 'coming-soon' },
          { id: 'js.4.2', title: 'Projeto 2 — App de Clima com API',       description: 'Consumir API real de clima com fetch, geolocalização e cache local.',     duration: '55 min', xp: 275, type: 'project', status: 'coming-soon' },
          { id: 'js.4.3', title: 'Projeto 3 — Dashboard de Finanças',      description: 'Dashboard com gráficos, filtros por mês e exportação CSV de despesas.',   duration: '60 min', xp: 300, type: 'project', status: 'coming-soon' },
        ]
      },
      {
        id: 'M5',
        title: 'Git & GitHub',
        description: 'Controle de versão com Git: commits, branches, conflitos, GitHub e colaboração profissional.',
        status: 'coming-soon',
        lessons: [
          { id: 'js.5.1', title: 'O que é Git e por que usar',                       description: 'O problema do "versão_final_2_REAL.zip" e como o Git resolve.',       duration: '16 min', xp: 80,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.5.2', title: 'Comandos Essenciais',                              description: 'init, add, commit, status, log, diff e .gitignore.',                  duration: '22 min', xp: 110, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.5.3', title: 'GitHub — Repositórios Remotos',                   description: 'clone, push, pull, fetch e sincronização com o remote.',              duration: '22 min', xp: 110, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.5.4', title: 'Resolvendo Conflitos',                             description: 'Merge conflicts, branches, rebase interativo e estratégias de merge.', duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.5.5', title: 'GitHub Pages e Colaboração Open Source',           description: 'Publicar no GitHub Pages, fork, pull request e code review.',         duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.5.6', title: 'Git no Dia a Dia — Dicas Profissionais',           description: 'git stash, cherry-pick, alias, conventional commits e GitHub Flow.',   duration: '16 min', xp: 80,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.5.7', title: 'Projeto — Histórico de um Projeto Real',           description: 'Criar repositório profissional com README, releases e perfil GitHub.', duration: '30 min', xp: 150, type: 'project', status: 'coming-soon' },
        ]
      },
      {
        id: 'M6',
        title: 'Deploy & Portfólio',
        description: 'Deploy na Vercel, performance, acessibilidade e construção do portfólio profissional.',
        status: 'coming-soon',
        lessons: [
          { id: 'js.6.1', title: 'O que é Deploy e como funciona',       description: 'Ambientes, domínios, CDN e o fluxo de publicação na web.',                 duration: '16 min', xp: 80,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.6.2', title: 'Deploy na Vercel',                     description: 'Conectar repositório, configurar domínio e preview por PR automático.',     duration: '20 min', xp: 100, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.6.3', title: 'Otimização de Performance',            description: 'Lighthouse, Core Web Vitals, lazy loading e minificação de assets.',        duration: '20 min', xp: 100, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.6.4', title: 'Acessibilidade Web (a11y)',            description: 'ARIA, contraste, foco, leitores de tela e auditoria com axe.',              duration: '20 min', xp: 100, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.6.5', title: 'Projeto Final — Portfólio Profissional', description: 'Portfólio publicado com todos os projetos do curso: design, conteúdo e SEO.', duration: '90 min', xp: 450, type: 'project', status: 'coming-soon' },
        ]
      },
      {
        id: 'M7',
        title: 'Mercado de Trabalho',
        description: 'Currículo, LinkedIn, entrevistas técnicas e próximos passos na carreira front-end.',
        status: 'coming-soon',
        lessons: [
          { id: 'js.7.1', title: 'O mercado de desenvolvimento em 2025',               description: 'Vagas, salários, stacks pedidas e como mapear oportunidades.',        duration: '18 min', xp: 90,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.7.2', title: 'Currículo e LinkedIn para devs',                    description: 'Escrever currículo técnico e otimizar LinkedIn para recruters.',       duration: '22 min', xp: 110, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.7.3', title: 'Entrevistas técnicas para Front-end',               description: 'HTML/CSS/JS ao vivo, desafios de código e perguntas de sistema.',      duration: '26 min', xp: 130, type: 'lesson',  status: 'coming-soon' },
          { id: 'js.7.4', title: 'Aprendizado contínuo e comunidade',                 description: 'Newsletters, podcasts, conferências e como se manter atualizado.',     duration: '16 min', xp: 80,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.7.5', title: 'Próximos passos — o que vem depois do Front-end',   description: 'React, TypeScript, Node.js, QA: como escolher o próximo passo.',       duration: '16 min', xp: 80,  type: 'lesson',  status: 'coming-soon' },
          { id: 'js.7.6', title: 'Projeto Final — Portfólio + Candidatura Real',      description: 'Candidatura completa: portfólio publicado, currículo e LinkedIn.',     duration: '60 min', xp: 300, type: 'project', status: 'coming-soon' },
        ]
      },
    ]
  };

  // Helper: flatten all lessons
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

  window.SL_JS_FOUNDATION = COURSE;
})();
