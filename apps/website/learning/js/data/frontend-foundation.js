// Sentinel Learning — Front-End Foundation
// window.SL_FRONTEND

(function () {
  'use strict';

  var COURSE = {
    id: 'frontend-foundation',
    slug: 'frontend',
    title: 'Front-End Foundation',
    subtitle: 'HTML, CSS e JavaScript essencial',
    description: 'Semântica HTML5, Flexbox, Grid, JavaScript moderno (ES6+), responsividade e boas práticas para devs front-end.',
    category: 'Front-End',
    level: 'Iniciante',
    estimatedHours: 50,
    totalModules: 8,
    totalLessons: 40,
    status: 'available',
    tags: ['html', 'css', 'javascript', 'frontend'],
    storageKey: null,

    getLessonContent: function (moduleNum, lessonIndex) {
      var mod = COURSE.modules[moduleNum - 1];
      if (!mod || !mod.lessons) return null;
      return mod.lessons[lessonIndex] || null;
    },

    modules: [
      {
        id: 'M1', title: 'HTML Semântico',
        description: 'Estruturar páginas com HTML5 correto e acessível.',
        status: 'available',
        lessons: [
          {
            id: 'fe.1.1', title: 'O que é HTML e como o browser o lê', description: 'Conceitos básicos de HTML e DOM.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'HTML — a estrutura de toda página web' },
              { type: 'p', html: 'HTML (HyperText Markup Language) define a <strong>estrutura</strong> de uma página. Não é programação — é marcação. Você usa tags para dizer ao browser o que cada conteúdo é: um título, um parágrafo, uma imagem, um link.' },
              { type: 'code', lang: 'html', raw: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Minha Página</title>\n</head>\n<body>\n  <h1>Olá, mundo!</h1>\n  <p>Este é meu primeiro parágrafo.</p>\n  <a href="https://exemplo.com">Clique aqui</a>\n</body>\n</html>' },
              { type: 'callout', html: '<strong>DOCTYPE:</strong> <code>&lt;!DOCTYPE html&gt;</code> na primeira linha diz ao browser "este é HTML5". Sem isso, browsers entram em "quirks mode" e renderizam de forma inconsistente.' },
            ]
          },
          {
            id: 'fe.1.2', title: 'Tags semânticas vs div soup', description: 'Usar as tags certas para o conteúdo certo.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Semântica: o que é e por que importa' },
              { type: 'p', html: 'HTML semântico usa tags que <strong>descrevem o significado do conteúdo</strong>, não apenas sua aparência. Isso é essencial para acessibilidade (leitores de tela), SEO e manutenibilidade.' },
              { type: 'code', lang: 'html', raw: '<!-- ❌ Div soup — sem semântica -->\n<div class="header">\n  <div class="nav">\n    <div class="nav-item">Home</div>\n  </div>\n</div>\n<div class="content">\n  <div class="post-title">Título</div>\n  <div class="post-text">Texto...</div>\n</div>\n\n<!-- ✅ HTML semântico -->\n<header>\n  <nav>\n    <a href="/">Home</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>Título</h1>\n    <p>Texto...</p>\n  </article>\n</main>' },
              { type: 'h2', text: 'Tags semânticas principais do HTML5' },
              { type: 'code', lang: 'text', raw: '<header>    → cabeçalho da página ou seção\n<nav>       → bloco de navegação\n<main>      → conteúdo principal (único por página)\n<section>   → seção temática\n<article>   → conteúdo independente (post, card)\n<aside>     → conteúdo relacionado (sidebar, anúncio)\n<footer>    → rodapé da página ou seção\n<figure>    → imagem com legenda\n<figcaption>→ legenda da figura\n<time>      → datas e horários\n<mark>      → texto destacado\n<address>   → informações de contato' },
            ]
          },
          {
            id: 'fe.1.3', title: 'Formulários e inputs', description: 'Criar formulários acessíveis e funcionais.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Formulários corretos' },
              { type: 'code', lang: 'html', raw: '<form action="/cadastro" method="POST">\n  <!-- Label SEMPRE vinculado ao input -->\n  <label for="nome">Nome completo</label>\n  <input\n    type="text"\n    id="nome"\n    name="nome"\n    required\n    autocomplete="name"\n    placeholder="Ex: Raphael Castilho"\n  />\n\n  <label for="email">Email</label>\n  <input\n    type="email"\n    id="email"\n    name="email"\n    required\n    autocomplete="email"\n  />\n\n  <label for="senha">Senha</label>\n  <input\n    type="password"\n    id="senha"\n    name="senha"\n    minlength="8"\n    required\n    aria-describedby="senha-hint"\n  />\n  <span id="senha-hint">Mínimo 8 caracteres</span>\n\n  <button type="submit">Criar conta</button>\n</form>' },
              { type: 'callout', html: '<strong>Sempre use label for + input id:</strong> o <code>for</code> vincula o label ao input. Clicar no label foca o campo — melhora a usabilidade. Sem label, leitores de tela não sabem para que serve o campo.' },
            ]
          },
          {
            id: 'fe.1.4', title: 'Imagens e mídia', description: 'img, picture, video, audio e acessibilidade.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Imagens semânticas e acessíveis' },
              { type: 'code', lang: 'html', raw: '<!-- Alt obrigatório -- descreve a imagem para leitores de tela -->\n<img src="produto.jpg" alt="Camiseta azul tamanho M" width="400" height="300">\n\n<!-- Imagem decorativa -- alt vazio -->\n<img src="divisor.png" alt="" role="presentation">\n\n<!-- Imagem responsiva com picture -->\n<picture>\n  <source media="(min-width: 800px)" srcset="hero-large.webp">\n  <source media="(min-width: 400px)" srcset="hero-medium.webp">\n  <img src="hero-small.jpg" alt="Banner principal do site">\n</picture>\n\n<!-- Lazy loading -- carrega só quando entra na tela -->\n<img src="produto.jpg" alt="Produto" loading="lazy">',
              },
              { type: 'callout', html: '<strong>width e height nas imagens:</strong> definir dimensões no HTML previne Cumulative Layout Shift (CLS) — o conteúdo não "pula" quando a imagem carrega. É uma métrica Core Web Vitals importante.' },
            ]
          },
          {
            id: 'fe.1.5', title: 'Tabelas e listas', description: 'Quando usar table, ul, ol e dl corretamente.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Listas — ul, ol e dl' },
              { type: 'code', lang: 'html', raw: '<!-- ul: lista não ordenada (itens sem sequência) -->\n<ul>\n  <li>Playwright</li>\n  <li>Postman</li>\n  <li>Jira</li>\n</ul>\n\n<!-- ol: lista ordenada (passos, ranking) -->\n<ol>\n  <li>Instalar Node.js</li>\n  <li>Instalar Playwright</li>\n  <li>Rodar: npx playwright test</li>\n</ol>\n\n<!-- dl: lista de definições (glossário, metadados) -->\n<dl>\n  <dt>Smoke Test</dt>\n  <dd>Teste rápido dos fluxos mais críticos para verificar que o sistema está operando</dd>\n\n  <dt>Regression Test</dt>\n  <dd>Verificação de que funcionalidades existentes não foram quebradas</dd>\n</dl>' },
              { type: 'h2', text: 'Tabelas acessíveis' },
              { type: 'code', lang: 'html', raw: '<!-- Tabela com scope para acessibilidade -->\n<table>\n  <caption>Status dos módulos do curso QA Foundation</caption>\n  <thead>\n    <tr>\n      <th scope="col">Módulo</th>\n      <th scope="col">Status</th>\n      <th scope="col">Progresso</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope="row">M1 — Fundamentos</th>\n      <td>Concluído</td>\n      <td>100%</td>\n    </tr>\n  </tbody>\n</table>' },
            ]
          },
        ]
      },

      {
        id: 'M2', title: 'CSS Flexbox',
        description: 'Layouts unidimensionais com Flexbox.',
        status: 'available',
        lessons: [
          {
            id: 'fe.2.1', title: 'O modelo de caixa (Box Model)', description: 'margin, padding, border e como elementos se relacionam.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Box Model — a base de todo layout CSS' },
              { type: 'code', lang: 'css', raw: '/* Cada elemento é uma "caixa" com 4 camadas: */\n\n.box {\n  /* 1. Content — o conteúdo em si */\n  width: 200px;\n  height: 100px;\n\n  /* 2. Padding — espaço interno */\n  padding: 16px;          /* todos os lados */\n  padding: 8px 16px;      /* vertical | horizontal */\n\n  /* 3. Border — borda */\n  border: 2px solid #6C63FF;\n  border-radius: 8px;\n\n  /* 4. Margin — espaço externo */\n  margin: 24px auto;      /* vertical | horizontal (centralizar) */\n\n  /* box-sizing: border-box — padding e border incluídos no width */\n  box-sizing: border-box; /* Use SEMPRE — é mais intuitivo */\n}\n\n/* Reset global recomendado: */\n*, *::before, *::after {\n  box-sizing: border-box;\n}' },
              { type: 'callout', html: '<strong>box-sizing: border-box</strong> é o padrão mais intuitivo: o <code>width</code> que você define É o tamanho total do elemento, incluindo padding e border. Sem isso, padding adiciona ao width e você precisa fazer contas.' },
            ]
          },
          {
            id: 'fe.2.2', title: 'Flexbox — container e itens', description: 'display: flex e as propriedades principais.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Ativando o Flexbox' },
              { type: 'code', lang: 'css', raw: '/* No container pai: */\n.container {\n  display: flex;            /* ativa flexbox */\n  flex-direction: row;      /* row (padrão) | column */\n  justify-content: center;  /* eixo principal */\n  align-items: center;      /* eixo cruzado */\n  gap: 16px;                /* espaço entre itens */\n  flex-wrap: wrap;          /* quebrar linha se não couber */\n}\n\n/* Nos itens filhos: */\n.item {\n  flex: 1;      /* cresce para preencher o espaço disponível */\n  /* flex é shorthand para: flex-grow flex-shrink flex-basis */\n\n  flex: 0 0 200px; /* largura fixa de 200px, não cresce */\n  flex: 1 1 auto;  /* cresce e encolhe conforme necessário */\n}' },
              { type: 'h2', text: 'justify-content e align-items' },
              { type: 'code', lang: 'text', raw: 'justify-content (eixo principal — horizontal no row):\n  flex-start   → começo\n  center       → centro\n  flex-end     → fim\n  space-between → espaço entre itens (sem nas bordas)\n  space-around  → espaço ao redor de cada item\n  space-evenly  → espaço igual em todos os lados\n\nalign-items (eixo cruzado — vertical no row):\n  flex-start  → topo\n  center      → centro (vertical!)\n  flex-end    → base\n  stretch     → esticar para preencher (padrão)\n  baseline    → alinhar pela linha de base do texto' },
            ]
          },
          {
            id: 'fe.2.3', title: 'Casos de uso do Flexbox', description: 'Navbar, card layout e centralização.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Padrões reais com Flexbox' },
              { type: 'code', lang: 'css', raw: '/* 1. Navbar — logo à esquerda, links à direita */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 24px;\n  height: 60px;\n}\n\n/* 2. Centralizar absolutamente um elemento */\n.center-me {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\n/* 3. Cards em linha que quebram */\n.card-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.card {\n  flex: 1 1 300px; /* cresce mas mínimo de 300px */\n  max-width: 400px;\n}\n\n/* 4. Sidebar + conteúdo principal */\n.layout {\n  display: flex;\n  gap: 24px;\n}\n.sidebar { flex: 0 0 250px; }  /* largura fixa */\n.content  { flex: 1; }          /* cresce para preencher */' },
            ]
          },
          {
            id: 'fe.2.4', title: 'order, align-self e flex-grow', description: 'Controle fino dos itens flex.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Propriedades dos itens flex' },
              { type: 'code', lang: 'css', raw: '.item {\n  /* order — mudar a ordem visual sem alterar o HTML */\n  order: 2;  /* padrão é 0. Menor = primeiro */\n\n  /* align-self — sobrescrever align-items do container */\n  align-self: flex-end;   /* só esse item fica embaixo */\n\n  /* flex-grow — quanto esse item cresce relativo aos outros */\n  flex-grow: 2;  /* cresce 2x mais que itens com flex-grow: 1 */\n\n  /* flex-shrink — quanto encolhe quando não há espaço */\n  flex-shrink: 0;  /* não encolhe */\n\n  /* flex-basis — tamanho base antes de crescer/encolher */\n  flex-basis: 200px;\n\n  /* shorthand: grow shrink basis */\n  flex: 1 1 200px;\n}' },
            ]
          },
          {
            id: 'fe.2.5', title: 'Projeto: Navbar e card grid', description: 'Construir navbar + grid de cards com Flexbox.', duration: '16 min', xp: 80, type: 'project', status: 'available',
            sections: [
              { type: 'h2', text: 'Projeto: Página de cursos com Flexbox' },
              { type: 'exercise', title: 'Construa o layout', desc: 'Construa uma página com navbar e grid de cards usando apenas Flexbox.', steps: ['Crie index.html com HTML semântico (header, main, footer)', 'Estilize a navbar com logo + links usando justify-content: space-between', 'Crie 6 cards de cursos em uma linha que quebra (flex-wrap: wrap)', 'Cada card deve ter: imagem, título, descrição e botão', 'Centralize verticalmente o texto dentro de cada card'], starterCode: '<!-- index.html -->\n<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Cursos</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <header class="navbar">\n    <!-- TODO: logo + nav links -->\n  </header>\n  <main class="card-grid">\n    <!-- TODO: 6 cards de cursos -->\n  </main>\n</body>\n</html>', solution: '/* styles.css */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 24px;\n  height: 60px;\n  border-bottom: 1px solid #e2e8f0;\n}\n.card-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 24px;\n  padding: 24px;\n}\n.card {\n  flex: 1 1 280px;\n  max-width: 340px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}' },
            ]
          },
        ]
      },

      {
        id: 'M3', title: 'CSS Grid',
        description: 'Layouts bidimensionais com CSS Grid.',
        status: 'available',
        lessons: [
          {
            id: 'fe.3.1', title: 'Grid vs Flexbox', description: 'Quando usar Grid e quando usar Flexbox.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Flexbox vs Grid — não é ou/ou' },
              { type: 'code', lang: 'text', raw: 'Flexbox — unidimensional\n  → Itens em UMA linha ou coluna\n  → Os itens ditam o layout\n  → Ideal: navbar, lista de tags, botões em linha,\n           centralizar um elemento\n\nCSS Grid — bidimensional\n  → Linhas E colunas ao mesmo tempo\n  → O layout dita os itens\n  → Ideal: layout de página completa, dashboards,\n           galeria de fotos, qualquer grid 2D\n\nRegra prática:\n  → Componente interno (botões, tags) → Flexbox\n  → Layout da página ou seção → Grid' },
            ]
          },
          {
            id: 'fe.3.2', title: 'display: grid e fr unit', description: 'Criar grids com fr, repeat e auto-fill.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Ativando o Grid' },
              { type: 'code', lang: 'css', raw: '.grid {\n  display: grid;\n\n  /* 3 colunas iguais */\n  grid-template-columns: 1fr 1fr 1fr;\n  /* ou: */\n  grid-template-columns: repeat(3, 1fr);\n\n  /* 3 linhas definidas */\n  grid-template-rows: 60px 1fr auto;\n\n  /* Espaço entre células */\n  gap: 24px;\n  /* ou: */\n  column-gap: 16px;\n  row-gap: 24px;\n}\n\n/* Grid responsivo automático */\n.auto-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n  gap: 16px;\n  /* auto-fill: cria quantas colunas couberem\n     minmax(250px, 1fr): mínimo 250px, máximo 1fr */\n}' },
              { type: 'callout', html: '<strong>fr (fractional unit)</strong> distribui o espaço disponível proporcionalmente. <code>1fr 2fr 1fr</code> cria 3 colunas onde a do meio tem o dobro do espaço.' },
            ]
          },
          {
            id: 'fe.3.3', title: 'Posicionamento de itens no Grid', description: 'grid-column, grid-row e grid-area.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Posicionando itens no grid' },
              { type: 'code', lang: 'css', raw: '.container {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: auto;\n  gap: 16px;\n}\n\n/* Item ocupa colunas 1 a 3 (2 colunas) */\n.destaque {\n  grid-column: 1 / 3;      /* de 1 até linha 3 */\n  /* ou: */\n  grid-column: 1 / span 2; /* começa em 1, ocupa 2 */\n}\n\n/* Item ocupa da linha 2 à 4 (2 linhas) */\n.sidebar {\n  grid-row: 2 / 4;\n}\n\n/* Ocupar a célula inteira com -1 (última linha de grade) */\n.footer {\n  grid-column: 1 / -1; /* ocupa toda a largura */\n}' },
            ]
          },
          {
            id: 'fe.3.4', title: 'grid-template-areas', description: 'Layout visual com nomes de áreas.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Layout com nomes semânticos' },
              { type: 'code', lang: 'css', raw: '.layout {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 60px 1fr 50px;\n  grid-template-areas:\n    "header  header"\n    "sidebar content"\n    "footer  footer";\n  min-height: 100vh;\n  gap: 0;\n}\n\n/* Atribuindo itens às áreas */\nheader  { grid-area: header; }\naside   { grid-area: sidebar; }\nmain    { grid-area: content; }\nfooter  { grid-area: footer; }\n\n/* Responsivo: empilhar em mobile */\n@media (max-width: 768px) {\n  .layout {\n    grid-template-columns: 1fr;\n    grid-template-areas:\n      "header"\n      "content"\n      "sidebar"\n      "footer";\n  }\n}' },
              { type: 'callout', html: '<strong>grid-template-areas</strong> é a forma mais legível de criar layouts complexos. O diagrama ASCII na CSS reflete exatamente o layout visual — qualquer dev entende a estrutura em segundos.' },
            ]
          },
          {
            id: 'fe.3.5', title: 'Projeto: Dashboard com CSS Grid', description: 'Layout de admin dashboard usando Grid.', duration: '16 min', xp: 80, type: 'project', status: 'available',
            sections: [
              { type: 'h2', text: 'Projeto: Dashboard com Grid' },
              { type: 'exercise', title: 'Construa o dashboard', desc: 'Crie um layout de dashboard com header, sidebar, área principal e footer usando grid-template-areas.', steps: ['Defina grid-template-areas com header, sidebar, main, footer', 'Header ocupa toda a largura (2 colunas)', 'Sidebar com 240px fixos, main cresce com 1fr', 'Footer ocupa toda a largura', 'Em mobile (<768px), empilhe tudo em 1 coluna'], starterCode: '.dashboard {\n  display: grid;\n  /* TODO: definir colunas */\n  /* TODO: definir template-areas */\n  min-height: 100vh;\n}', solution: '.dashboard {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-rows: 60px 1fr 48px;\n  grid-template-areas:\n    "sidebar header"\n    "sidebar main"\n    "sidebar footer";\n  min-height: 100vh;\n}' },
            ]
          },
        ]
      },

      {
        id: 'M4', title: 'JavaScript ES6+',
        description: 'JavaScript moderno para front-end.',
        status: 'available',
        lessons: [
          {
            id: 'fe.4.1', title: 'const, let e arrow functions', description: 'Declarações modernas e funções arrow.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Declarações modernas — esqueça o var' },
              { type: 'code', lang: 'javascript', raw: '// const — valor que não muda (use por padrão)\nconst API_URL = "https://api.meusite.com";\nconst user = { name: "Raphael", role: "QA" };\n// user = {}  ← Error: Assignment to constant variable\n// user.name = "Ana"  ← OK! const protege a referência, não o conteúdo\n\n// let — valor que pode mudar\nlet contador = 0;\ncontador++;\ncontador = 10;\n\n// var — evite (escopo de função, hoisting confuso)\n// var x = 1;\n\n// Arrow functions — sintaxe concisa\nconst somar = (a, b) => a + b;\nconst dobrar = n => n * 2;\nconst greet = nome => `Olá, ${nome}!`;  // template literal\n\n// Arrow vs function regular:\n// arrow não tem seu próprio "this" (importante para classes e callbacks)\nconst arr = [1, 2, 3];\nconst dobros = arr.map(n => n * 2);  // [2, 4, 6]' },
            ]
          },
          {
            id: 'fe.4.2', title: 'Destructuring e spread', description: 'Desestruturação de arrays e objetos, rest params.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Destructuring — extrair valores elegantemente' },
              { type: 'code', lang: 'javascript', raw: '// Objetos:\nconst user = { name: "Raphael", role: "QA", age: 25 };\nconst { name, role } = user;\nconsole.log(name);  // "Raphael"\n\n// Com alias:\nconst { name: userName, role: userRole } = user;\n\n// Com valor padrão:\nconst { name, city = "SP" } = user;  // city = "SP"\n\n// Arrays:\nconst [primeiro, segundo, ...resto] = [1, 2, 3, 4, 5];\nconsole.log(primeiro);  // 1\nconsole.log(resto);     // [3, 4, 5]\n\n// Em parâmetros de função:\nfunction exibirUser({ name, role }) {\n  return `${name} — ${role}`;\n}\nexibirUser(user);  // "Raphael — QA"\n\n// Spread operator — espalhar valores:\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]\n\nconst obj1 = { a: 1, b: 2 };\nconst obj2 = { ...obj1, c: 3 };  // { a: 1, b: 2, c: 3 }' },
            ]
          },
          {
            id: 'fe.4.3', title: 'Promises e async/await', description: 'Programação assíncrona moderna.', duration: '16 min', xp: 80, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Async/Await — a forma moderna de lidar com assincronismo' },
              { type: 'code', lang: 'javascript', raw: '// fetch retorna uma Promise\nasync function buscarUsuario(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n\n    if (!response.ok) {\n      throw new Error(`Erro ${response.status}: ${response.statusText}`);\n    }\n\n    const user = await response.json();\n    return user;\n\n  } catch (error) {\n    console.error("Falha ao buscar usuário:", error.message);\n    throw error;  // propagar para quem chamou tratar\n  }\n}\n\n// Chamando a função async:\nbuscarUsuario(42)\n  .then(user => console.log(user.name))\n  .catch(err => alert("Não foi possível carregar"));\n\n// Ou dentro de outro async:\nasync function render() {\n  const user = await buscarUsuario(42);\n  document.getElementById("nome").textContent = user.name;\n}' },
              { type: 'callout', html: '<strong>Sempre trate erros em async/await:</strong> um <code>await</code> sem try/catch que falha resulta em "Unhandled Promise Rejection". Em produção, isso pode silenciosamente quebrar features. Use try/catch ou <code>.catch()</code>.' },
            ]
          },
          {
            id: 'fe.4.4', title: 'Módulos ES6 — import e export', description: 'Organizar código em módulos reutilizáveis.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Módulos — dividir para conquistar' },
              { type: 'code', lang: 'javascript', raw: '// utils/format.js\nexport function formatPrice(value) {\n  return new Intl.NumberFormat("pt-BR", {\n    style: "currency", currency: "BRL"\n  }).format(value);\n}\n\nexport const TAX_RATE = 0.12;\n\nexport default function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}\n\n// main.js — importando\nimport capitalize from "./utils/format.js";      // default export\nimport { formatPrice, TAX_RATE } from "./utils/format.js"; // named\nimport * as Format from "./utils/format.js";    // tudo como namespace\n\nconsole.log(formatPrice(49.90));    // R$ 49,90\nconsole.log(Format.TAX_RATE);       // 0.12\n\n// No HTML:\n<script type="module" src="main.js"></script>' },
            ]
          },
          {
            id: 'fe.4.5', title: 'Array methods funcionais', description: 'map, filter, reduce, find e chaining.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Os métodos que você mais vai usar' },
              { type: 'code', lang: 'javascript', raw: 'const produtos = [\n  { id: 1, nome: "Camiseta", preco: 49.90, ativo: true  },\n  { id: 2, nome: "Calça",    preco: 89.90, ativo: false },\n  { id: 3, nome: "Tênis",   preco: 199.90, ativo: true },\n];\n\n// map — transformar cada item\nconst nomes = produtos.map(p => p.nome);\n// ["Camiseta", "Calça", "Tênis"]\n\n// filter — selecionar itens\nconst ativos = produtos.filter(p => p.ativo);\n// [{ id: 1, ...}, { id: 3, ... }]\n\n// find — encontrar o primeiro que satisfaz\nconst camiseta = produtos.find(p => p.nome === "Camiseta");\n// { id: 1, nome: "Camiseta", preco: 49.90, ativo: true }\n\n// reduce — acumular um valor\nconst total = produtos.reduce((acc, p) => acc + p.preco, 0);\n// 339.70\n\n// Encadeamento:\nconst totalAtivos = produtos\n  .filter(p => p.ativo)\n  .reduce((acc, p) => acc + p.preco, 0);\n// 249.80' },
            ]
          },
        ]
      },

      {
        id: 'M5', title: 'Responsividade',
        description: 'Criar layouts que funcionam em qualquer tela.',
        status: 'available',
        lessons: [
          {
            id: 'fe.5.1', title: 'Mobile-first e breakpoints', description: 'A estratégia certa para design responsivo.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Mobile-first — design para o menor primeiro' },
              { type: 'code', lang: 'css', raw: '/* Mobile-first: estilos base são para mobile */\n.container {\n  padding: 16px;\n  width: 100%;\n}\n\n/* Tablet: min-width 768px */\n@media (min-width: 768px) {\n  .container {\n    padding: 24px;\n    max-width: 768px;\n    margin: 0 auto;\n  }\n}\n\n/* Desktop: min-width 1024px */\n@media (min-width: 1024px) {\n  .container {\n    padding: 32px;\n    max-width: 1200px;\n  }\n}\n\n/* Breakpoints comuns:\n   480px  — smartphones landscape\n   768px  — tablets portrait\n   1024px — tablets landscape / small desktop\n   1280px — desktop\n   1440px — large desktop */' },
              { type: 'callout', html: '<strong>Por que mobile-first?</strong> É mais fácil expandir um layout simples do que comprimir um complexo. Além disso, mais de 60% do tráfego web é mobile — começar pelo mais restrito força você a priorizar o essencial.' },
            ]
          },
          {
            id: 'fe.5.2', title: 'Unidades relativas: rem, em, vw, vh', description: 'Unidades que adaptam ao contexto.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Unidades relativas vs absolutas' },
              { type: 'code', lang: 'css', raw: '/* px — absoluta, não escala com preferências do usuário */\nfont-size: 16px;\n\n/* rem — relativo ao font-size do <html> (padrão: 16px)\n   Responde à configuração de fonte do sistema do usuário */\nfont-size: 1rem;    /* = 16px */\nfont-size: 1.5rem;  /* = 24px */\npadding: 1.5rem;\n\n/* em — relativo ao font-size do elemento pai\n   Pode criar efeitos em cascata (cuidado!) */\n.container { font-size: 1.25rem; }\n.container p { font-size: 0.8em; } /* = 0.8 * 1.25rem = 1rem */\n\n/* vw/vh — relativo ao viewport (tela) */\nwidth: 100vw;    /* 100% da largura da tela */\nheight: 100vh;   /* 100% da altura da tela */\nfont-size: 5vw;  /* texto que escala com a tela */\n\n/* clamp — entre um mínimo e um máximo */\nfont-size: clamp(1rem, 2vw, 1.5rem);\n/* mínimo 1rem, ideal 2vw, máximo 1.5rem */' },
            ]
          },
          {
            id: 'fe.5.3', title: 'Imagens e mídia responsiva', description: 'Imagens que se adaptam ao layout.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Imagens responsivas com CSS e HTML' },
              { type: 'code', lang: 'css', raw: '/* Regra base: nunca deixe imagem ultrapassar o container */\nimg {\n  max-width: 100%;\n  height: auto;  /* mantém proporção\n}\n\n/* object-fit — controla como a imagem preenche o container */\n.card-image {\n  width: 100%;\n  height: 200px;\n  object-fit: cover;    /* preenche sem distorcer, corta bordas */\n  object-position: center top;  /* focar no topo da imagem */\n}\n\n/* aspect-ratio — manter proporção sem definir altura */\n.video-container {\n  aspect-ratio: 16 / 9;\n  width: 100%;\n}' },
              { type: 'code', lang: 'html', raw: '<!-- srcset: browser escolhe a imagem certa para a densidade de pixel -->\n<img\n  src="produto-400.jpg"\n  srcset="produto-400.jpg 400w,\n          produto-800.jpg 800w,\n          produto-1200.jpg 1200w"\n  sizes="(max-width: 768px) 100vw,\n         (max-width: 1024px) 50vw,\n         400px"\n  alt="Camiseta azul"\n  loading="lazy"\n>' },
            ]
          },
          {
            id: 'fe.5.4', title: 'CSS Custom Properties (variáveis)', description: 'Variáveis CSS para temas e design tokens.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Variáveis CSS — design tokens nativos' },
              { type: 'code', lang: 'css', raw: '/* Definir variáveis no :root (escopo global) */\n:root {\n  /* Cores */\n  --color-primary: #6C63FF;\n  --color-accent: #00D4AA;\n  --color-text: #1A1A2E;\n  --color-text-secondary: #64748B;\n  --color-surface: #FFFFFF;\n  --color-border: #E2E8F0;\n\n  /* Espaçamentos */\n  --space-1: 4px;\n  --space-2: 8px;\n  --space-4: 16px;\n  --space-6: 24px;\n  --space-8: 32px;\n\n  /* Tipografia */\n  --font-base: "Inter", sans-serif;\n  --text-sm: 0.875rem;\n  --text-base: 1rem;\n  --text-lg: 1.125rem;\n  --text-xl: 1.25rem;\n}\n\n/* Usando as variáveis */\n.button {\n  background: var(--color-primary);\n  padding: var(--space-2) var(--space-4);\n  font-size: var(--text-sm);\n  color: white;\n  border-radius: 8px;\n}\n\n/* Tema escuro — sobrescrever apenas as que mudam */\n[data-theme="dark"] {\n  --color-text: #F1F5F9;\n  --color-surface: #1A1A2E;\n  --color-border: #334155;\n}' },
            ]
          },
          {
            id: 'fe.5.5', title: 'Projeto: Landing page responsiva', description: 'Construir uma landing page completa e responsiva.', duration: '20 min', xp: 100, type: 'project', status: 'available',
            sections: [
              { type: 'h2', text: 'Projeto: Landing page mobile-first' },
              { type: 'exercise', title: 'Construa a landing page', desc: 'Crie uma landing page responsiva com header, hero, features e footer.', steps: ['Defina Custom Properties (--color-*, --space-*, --text-*)', 'Hero: texto + imagem lado a lado (Grid) — empilhados em mobile', 'Features: 3 cards em grid (auto-fill, minmax(280px, 1fr))', 'Header: sticky com logo + nav — hamburger menu em mobile', 'Teste em 375px (mobile) e 1280px (desktop)'], starterCode: ':root {\n  --color-primary: #6C63FF;\n  --space-4: 16px;\n  /* TODO: adicionar mais variáveis */\n}\n\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\nbody {\n  font-family: system-ui, sans-serif;\n  color: #1a1a2e;\n}', solution: '/* Solução de referência no repositório do curso */' },
            ]
          },
        ]
      },

      {
        id: 'M6', title: 'Acessibilidade',
        description: 'Desenvolver para todos os usuários.',
        status: 'available',
        lessons: [
          {
            id: 'fe.6.1', title: 'Por que acessibilidade importa', description: 'Impacto real e obrigações legais.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Acessibilidade web — quem se beneficia?' },
              { type: 'p', html: 'Cerca de <strong>15% da população mundial tem alguma deficiência</strong>. Mas acessibilidade não é só para quem tem deficiência permanente — idosos com visão reduzida, pessoas com braço quebrado, quem usa o celular no sol brilhante: todos se beneficiam.' },
              { type: 'code', lang: 'text', raw: 'Tipos de deficiência que acessibilidade endereça:\n\nVisual:     cegueira, baixa visão, daltonismo\nMotora:     sem mouse, tremor, paralisia\nCognitiva:  dislexia, TDAH, ansiedade\nAuditiva:   surdez (legendas em vídeos)\nTemporal:   braço quebrado, usando somente teclado\n\nBenefícios extras:\n  SEO melhorado (conteúdo estruturado)\n  Código mais limpo e semântico\n  Melhor UX para todos os usuários\n  Conformidade legal (LGPD, WCAG, ADA)' },
              { type: 'callout', html: '<strong>WCAG 2.1</strong> é o padrão internacional de acessibilidade. O nível mínimo esperado em projetos profissionais é o <strong>AA</strong>. Muitos países têm leis exigindo conformidade para sites governamentais e grandes empresas.' },
            ]
          },
          {
            id: 'fe.6.2', title: 'ARIA e roles semânticos', description: 'aria-label, aria-describedby, roles e estados.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'ARIA — Accessible Rich Internet Applications' },
              { type: 'code', lang: 'html', raw: '<!-- aria-label: rótulo para elementos sem texto visível -->\n<button aria-label="Fechar modal">\n  <svg aria-hidden="true"><!-- ícone X --></svg>\n</button>\n\n<!-- aria-describedby: texto descritivo adicional -->\n<input\n  type="password"\n  aria-describedby="senha-requisitos"\n/>\n<p id="senha-requisitos">Mínimo 8 caracteres, 1 número, 1 maiúscula</p>\n\n<!-- aria-expanded: estado de componentes expansíveis -->\n<button aria-expanded="false" aria-controls="menu">Menu</button>\n<ul id="menu" hidden>...</ul>\n\n<!-- role: quando elemento não tem semântica nativa -->\n<div role="alert" aria-live="polite">\n  Formulário enviado com sucesso!\n</div>\n\n<!-- aria-current: item ativo na navegação -->\n<nav>\n  <a href="/" aria-current="page">Home</a>\n  <a href="/sobre">Sobre</a>\n</nav>' },
              { type: 'callout', html: '<strong>Regra de ouro do ARIA:</strong> "Não use ARIA onde HTML semântico resolve". <code>&lt;button&gt;</code> é melhor que <code>&lt;div role="button"&gt;</code>. Use ARIA apenas quando elementos nativos não são suficientes.' },
            ]
          },
          {
            id: 'fe.6.3', title: 'Navegação por teclado', description: 'focus, tabindex e skip links.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Teclado como primeira interface' },
              { type: 'code', lang: 'css', raw: '/* NUNCA remova o outline sem substituir */\n:focus {\n  outline: none;  /* ❌ péssimo para acessibilidade */\n}\n\n/* ✅ Substitua com algo visível */\n:focus-visible {\n  outline: 2px solid #6C63FF;\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n\n/* :focus-visible só aplica quando o usuário usa teclado\n   não aparece ao clicar com mouse */' },
              { type: 'code', lang: 'html', raw: '<!-- Skip link — pular para o conteúdo principal -->\n<!-- Essencial para usuários de teclado e leitores de tela -->\n<a href="#main-content" class="skip-link">Pular para o conteúdo</a>\n\n<main id="main-content" tabindex="-1">\n  <!-- ... -->\n</main>\n\n<style>\n.skip-link {\n  position: absolute;\n  top: -100%;\n  left: 0;\n  background: #6C63FF;\n  color: white;\n  padding: 8px 16px;\n  z-index: 999;\n}\n.skip-link:focus {\n  top: 0;  /* aparece só ao receber foco via teclado */\n}\n</style>' },
            ]
          },
          {
            id: 'fe.6.4', title: 'Contraste e texto legível', description: 'Relação de contraste WCAG e tipografia acessível.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Contraste mínimo — WCAG AA' },
              { type: 'code', lang: 'text', raw: 'WCAG AA (nível mínimo profissional):\n  Texto normal (<18px ou não bold): razão 4.5:1\n  Texto grande (18px+ ou 14px bold): razão 3:1\n  Ícones e gráficos importantes: razão 3:1\n\nWCAG AAA (nível ideal):\n  Texto normal: razão 7:1\n  Texto grande: razão 4.5:1\n\nCombinações que FALHAM no AA:\n  #FFFFFF texto em #6C63FF fundo → 3.2:1 ❌\n  #666666 texto em #FFFFFF fundo → 5.7:1 ✅\n\nFerramentas para verificar:\n  • coolors.co/contrast-checker\n  • WebAIM Contrast Checker\n  • DevTools → Accessibility → Computed\n  • Extensão: axe DevTools' },
              { type: 'callout', html: '<strong>Para QA:</strong> teste contraste de texto reportando pares de cor com ratio abaixo de 4.5:1 para texto normal. É um bug de acessibilidade documentável com evidências (screenshot + ratio medido).' },
            ]
          },
          {
            id: 'fe.6.5', title: 'Teste de acessibilidade automático', description: 'axe, Lighthouse e WAVE para validação.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Ferramentas de teste de acessibilidade' },
              { type: 'code', lang: 'text', raw: '1. Lighthouse (Chrome DevTools)\n   F12 → Lighthouse → Accessibility\n   Score 0-100, lista erros com explicação\n\n2. axe DevTools (extensão Chrome/Firefox)\n   Análise mais detalhada que Lighthouse\n   Integração com Playwright/Cypress\n\n3. WAVE (wave.webaim.org)\n   Versão visual — marca erros diretamente na página\n\n4. axe no Playwright:\n   npm install @axe-core/playwright\n\n   import AxeBuilder from "@axe-core/playwright";\n   test("sem violações de acessibilidade", async ({ page }) => {\n     await page.goto("/");\n     const results = await new AxeBuilder({ page }).analyze();\n     expect(results.violations).toHaveLength(0);\n   });' },
              { type: 'callout', html: '<strong>Ferramentas automáticas detectam ~30% dos problemas.</strong> O resto exige teste manual com teclado e leitor de tela (NVDA no Windows, VoiceOver no Mac). Use automático + manual para cobertura real.' },
            ]
          },
        ]
      },

      {
        id: 'M7', title: 'Performance Web',
        description: 'Core Web Vitals e otimizações de performance.',
        status: 'available',
        lessons: [
          {
            id: 'fe.7.1', title: 'Core Web Vitals', description: 'LCP, FID/INP e CLS — as métricas do Google.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Core Web Vitals — performance que afeta SEO' },
              { type: 'code', lang: 'text', raw: 'LCP — Largest Contentful Paint\n  Tempo para o maior elemento visível renderizar\n  Bom: < 2.5s | Precisa melhorar: 2.5-4s | Ruim: > 4s\n  Causa comum: imagens grandes sem otimização\n\nINP — Interaction to Next Paint (substituiu FID em 2024)\n  Tempo de resposta a interações do usuário (clicks, teclado)\n  Bom: < 200ms | Precisa melhorar: 200-500ms | Ruim: > 500ms\n  Causa comum: JavaScript pesado bloqueando a thread principal\n\nCLS — Cumulative Layout Shift\n  Quanto o layout "pula" durante o carregamento\n  Bom: < 0.1 | Precisa melhorar: 0.1-0.25 | Ruim: > 0.25\n  Causa comum: imagens sem width/height, ads que aparecem' },
              { type: 'callout', html: '<strong>Core Web Vitals afetam o ranking no Google.</strong> Medir com PageSpeed Insights (pagespeed.web.dev) e Chrome DevTools → Lighthouse.' },
            ]
          },
          {
            id: 'fe.7.2', title: 'Otimização de imagens', description: 'WebP, lazy loading e responsive images.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Imagens são a maior causa de páginas lentas' },
              { type: 'code', lang: 'html', raw: '<!-- 1. Formato moderno: WebP é ~30% menor que JPEG -->\n<picture>\n  <source type="image/webp" srcset="hero.webp">\n  <source type="image/jpeg" srcset="hero.jpg">\n  <img src="hero.jpg" alt="Hero image">\n</picture>\n\n<!-- 2. Lazy loading nativo -->\n<img src="produto.webp" alt="Produto" loading="lazy">\n\n<!-- 3. Preload para LCP image (above the fold) -->\n<link rel="preload" as="image" href="hero.webp">\n\n<!-- 4. Dimensões definidas previnem CLS -->\n<img src="logo.png" alt="Logo" width="200" height="50">' },
              { type: 'code', lang: 'css', raw: '/* Comprimir tamanho de imagem na exibição */\n.thumbnail {\n  width: 200px;\n  height: 200px;\n  object-fit: cover;\n}\n/* Mas o arquivo original deve ter ~200px também!\n   Exibir imagem 2000px em 200px é desperdício */' },
            ]
          },
          {
            id: 'fe.7.3', title: 'JavaScript performance', description: 'Code splitting, defer e async.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'JavaScript bloqueia a renderização' },
              { type: 'code', lang: 'html', raw: '<!-- ❌ Bloqueia o parsing do HTML -->\n<script src="app.js"></script>\n\n<!-- ✅ defer: baixa em paralelo, executa após o HTML -->\n<script src="app.js" defer></script>\n\n<!-- ✅ async: baixa em paralelo, executa imediatamente -->\n<!-- Use para scripts independentes (analytics, ads) -->\n<script src="analytics.js" async></script>\n\n<!-- ✅ type="module": defer por padrão -->\n<script type="module" src="main.js"></script>' },
              { type: 'code', lang: 'javascript', raw: '// Dynamic import — carregar código só quando necessário\nasync function carregarGrafico() {\n  const { Chart } = await import("./chart.js");\n  new Chart(ctx, config);\n}\n\n// Só carrega a biblioteca de gráfico quando o usuário\n// interagir com a seção de analytics\ndocument.getElementById("analytics-tab").addEventListener("click", carregarGrafico);' },
            ]
          },
          {
            id: 'fe.7.4', title: 'CSS performance e critical path', description: 'Inline critical CSS e reduzir bloqueio de renderização.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'CSS bloqueia a renderização' },
              { type: 'p', html: 'CSS é <strong>render-blocking</strong>: o browser não exibe nada enquanto processa o CSS. Estratégias para melhorar:' },
              { type: 'code', lang: 'html', raw: '<!-- 1. Critical CSS inline — estilo do above-the-fold direto no HTML -->\n<style>\n  /* Apenas o CSS necessário para o conteúdo inicial */\n  body { font-family: system-ui; margin: 0; }\n  .hero { padding: 60px 24px; }\n</style>\n\n<!-- 2. CSS não-crítico: carregar de forma assíncrona -->\n<link rel="preload" href="styles.css" as="style" onload="this.rel=\'stylesheet\'">\n<noscript><link rel="stylesheet" href="styles.css"></noscript>\n\n<!-- 3. Carregar CSS de fontes de forma eficiente -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' },
            ]
          },
          {
            id: 'fe.7.5', title: 'Ferramentas de performance', description: 'Lighthouse, WebPageTest e Chrome DevTools.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Como medir a performance' },
              { type: 'code', lang: 'text', raw: '1. Lighthouse (DevTools ou pagespeed.web.dev)\n   → Score 0-100 por categoria\n   → Lista de oportunidades de melhoria\n   → Antes e depois de mudanças\n\n2. Chrome DevTools — Performance tab\n   → Gravar timeline detalhado\n   → Ver onde JavaScript trava a thread\n   → Flamegraph de execução\n\n3. Chrome DevTools — Network tab\n   → Waterfall de requisições\n   → Simular 3G lento\n   → Ver tamanho dos arquivos\n\n4. WebPageTest (webpagetest.org)\n   → Teste de múltiplas localizações\n   → Filmstrip de carregamento\n   → Dados reais de usuários reais\n\n5. Chrome UX Report (CrUX)\n   → Dados de campo de usuários reais do Chrome\n   → 28 dias de dados agregados' },
            ]
          },
        ]
      },

      {
        id: 'M8', title: 'Projeto Final',
        description: 'Construir um projeto completo do zero.',
        status: 'available',
        lessons: [
          {
            id: 'fe.8.1', title: 'Planejamento e arquitetura', description: 'Como planejar um projeto front-end.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Planejamento antes do código' },
              { type: 'code', lang: 'text', raw: 'Checklist de planejamento:\n\n1. Definir o objetivo\n   "Um portfólio para mostrar projetos QA e front-end"\n\n2. Definir o público\n   "Recrutadores técnicos e tech leads"\n\n3. Listar as páginas/seções\n   Home, Sobre, Projetos, Contato\n\n4. Wireframe (esboço)\n   → Papel ou Figma básico\n   → Layout mobile e desktop\n\n5. Design tokens\n   → Paleta de cores\n   → Tipografia\n   → Espaçamentos\n\n6. Estrutura de arquivos\n   index.html\n   css/styles.css\n   js/main.js\n   assets/images/' },
            ]
          },
          {
            id: 'fe.8.2', title: 'Construindo o projeto: HTML e estrutura', description: 'HTML semântico do projeto final.', duration: '16 min', xp: 80, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Estrutura HTML do portfólio' },
              { type: 'code', lang: 'html', raw: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta name="description" content="Portfólio de Raphael — QA Engineer & Front-end Developer">\n  <title>Raphael Castilho — QA Engineer</title>\n  <link rel="stylesheet" href="css/styles.css">\n</head>\n<body>\n  <a href="#main-content" class="skip-link">Pular para o conteúdo</a>\n\n  <header class="header">\n    <nav class="nav" aria-label="Navegação principal">\n      <a href="#home" class="nav__logo">RC</a>\n      <ul class="nav__links" role="list">\n        <li><a href="#sobre">Sobre</a></li>\n        <li><a href="#projetos">Projetos</a></li>\n        <li><a href="#contato">Contato</a></li>\n      </ul>\n    </nav>\n  </header>\n\n  <main id="main-content">\n    <section id="home" class="hero" aria-labelledby="hero-title">\n      <h1 id="hero-title">QA Engineer & Front-end Developer</h1>\n      <p>Garantindo qualidade e construindo interfaces.</p>\n      <a href="#projetos" class="button">Ver projetos</a>\n    </section>\n    <!-- ... -->\n  </main>\n\n  <footer class="footer">\n    <p>© 2025 Raphael Castilho</p>\n  </footer>\n</body>\n</html>' },
            ]
          },
          {
            id: 'fe.8.3', title: 'Estilizando: CSS completo', description: 'Aplicando todos os conceitos CSS no projeto.', duration: '20 min', xp: 100, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'CSS do portfólio — sistema completo' },
              { type: 'code', lang: 'css', raw: '/* 1. Custom properties e reset */\n:root {\n  --color-primary: #6C63FF;\n  --color-bg: #0F0F1A;\n  --color-surface: #1A1A2E;\n  --color-text: #F1F5F9;\n  --color-text-secondary: #94A3B8;\n  --space-4: 1rem;\n  --space-8: 2rem;\n  --font-base: "Inter", system-ui, sans-serif;\n}\n\n*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\nbody {\n  font-family: var(--font-base);\n  background: var(--color-bg);\n  color: var(--color-text);\n  line-height: 1.6;\n}\n\n/* 2. Layout com Grid */\n.hero {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  gap: var(--space-8);\n  min-height: 100vh;\n  padding: var(--space-8);\n}\n\n/* 3. Cards de projetos */\n.projects-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 1.5rem;\n}\n\n/* 4. Responsividade */\n@media (max-width: 768px) {\n  .hero { grid-template-columns: 1fr; text-align: center; }\n}' },
            ]
          },
          {
            id: 'fe.8.4', title: 'JavaScript interativo', description: 'Animações, formulário e interatividade.', duration: '16 min', xp: 80, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'JS do portfólio — funcionalidades essenciais' },
              { type: 'code', lang: 'javascript', raw: '// 1. Smooth scroll na navegação\ndocument.querySelectorAll(\'a[href^="#"]\').forEach(link => {\n  link.addEventListener("click", e => {\n    e.preventDefault();\n    const target = document.querySelector(link.getAttribute("href"));\n    if (target) target.scrollIntoView({ behavior: "smooth" });\n  });\n});\n\n// 2. Header fica opaco ao rolar\nconst header = document.querySelector(".header");\nwindow.addEventListener("scroll", () => {\n  header.classList.toggle("is-scrolled", window.scrollY > 50);\n});\n\n// 3. Animação ao entrar na tela (Intersection Observer)\nconst observer = new IntersectionObserver(\n  (entries) => {\n    entries.forEach(entry => {\n      if (entry.isIntersecting) {\n        entry.target.classList.add("is-visible");\n      }\n    });\n  },\n  { threshold: 0.1 }\n);\n\ndocument.querySelectorAll(".animate-on-scroll").forEach(el => {\n  observer.observe(el);\n});' },
            ]
          },
          {
            id: 'fe.8.5', title: 'Deploy e publicação', description: 'Deploy na Vercel, GitHub Pages e domínio próprio.', duration: '14 min', xp: 70, type: 'project', status: 'available',
            sections: [
              { type: 'h2', text: 'Deploy do portfólio' },
              { type: 'code', lang: 'bash', raw: '# GitHub Pages — mais simples para sites estáticos\n# 1. Push o código para GitHub\ngit init\ngit add .\ngit commit -m "chore: initial portfolio commit"\ngit remote add origin https://github.com/seu-usuario/portfolio.git\ngit push -u origin main\n\n# 2. Settings → Pages → Source: Deploy from branch → main\n# → Disponível em: seu-usuario.github.io/portfolio\n\n# ---\n# Vercel — mais rápido e com deploy automático\nnpm i -g vercel\nvercel\n# → Conecta ao GitHub, deploy automático em push\n# → URL: seu-projeto.vercel.app\n\n# Domínio personalizado:\n# Vercel → Settings → Domains → Add domain\n# → raphael.dev, raphael.com, etc.' },
              { type: 'callout', html: '<strong>Parabéns!</strong> Você concluiu o Front-End Foundation. Seu portfólio está no ar. Próximos passos: adicionar projetos reais, escrever um README detalhado, e compartilhar no LinkedIn e GitHub.' },
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

  window.SL_FRONTEND = COURSE;
})();
