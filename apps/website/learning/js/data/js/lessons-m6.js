// Sentinel Learning — Módulo 6: Deploy & Portfólio

(function () {
  window.M6 = [

    // ─── 6.1 ────────────────────────────────────────────────────────────────
    {
      id: '6.1', module: 6, index: 1,
      title: 'O que é Deploy e como funciona',
      duration: 16,
      sections: [
        { type: 'h2', text: 'Do local para a internet' },
        { type: 'p', html: 'Enquanto você desenvolve, o projeto só existe no seu computador. <strong>Deploy</strong> é o processo de colocar o projeto num servidor para que qualquer pessoa possa acessar pela internet.' },
        { type: 'code', lang: 'text', raw: 'Tipos de projeto e onde hospedar:\n\nHTML/CSS/JS estático\n  → GitHub Pages (gratuito)\n  → Vercel (gratuito, deploy automático)\n  → Netlify (gratuito, drag & drop)\n\nNode.js / Back-end\n  → Render (gratuito com limitações)\n  → Railway\n  → Heroku (pago)\n\nFull Stack\n  → Vercel (front) + Render (back)\n  → Railway (tudo junto)' },
        { type: 'h2', text: 'Deploy contínuo — o padrão moderno' },
        { type: 'p', html: 'Com <strong>CI/CD</strong>, o deploy acontece automaticamente quando você faz push no GitHub. Você não precisa "subir" arquivos manualmente — cada push na main vai direto para produção (ou para um ambiente de staging primeiro).' },
        { type: 'callout', html: '<strong>Fluxo profissional:</strong> você faz push → GitHub dispara o CI → testes rodam → se passam → deploy automático para produção. Se falham → você recebe notificação e o deploy não acontece.' },
        { type: 'h2', text: 'Variáveis de ambiente' },
        { type: 'code', lang: 'text', raw: '# Nunca coloque credenciais no código!\n# Use variáveis de ambiente:\n\n# Local: arquivo .env (no .gitignore)\nAPI_KEY=abc123\nDB_URL=postgresql://user:pass@host/db\n\n# Na plataforma de deploy:\n# Vercel → Settings → Environment Variables\n# Render → Environment → Add variable\n\n# No código:\nconst apiKey = process.env.API_KEY' },
      ]
    },

    // ─── 6.2 ────────────────────────────────────────────────────────────────
    {
      id: '6.2', module: 6, index: 2,
      title: 'Deploy na Vercel',
      duration: 20,
      sections: [
        { type: 'h2', text: 'Por que Vercel' },
        { type: 'p', html: 'A <strong>Vercel</strong> é a plataforma de deploy mais usada para projetos front-end. Ela se conecta ao GitHub, faz deploy automático em cada push, gera URLs de preview para cada PR e tem CDN global gratuita.' },
        { type: 'h2', text: 'Deploy em 3 passos' },
        { type: 'code', lang: 'text', raw: '1. Crie uma conta em vercel.com\n   → Fazer login com GitHub\n\n2. Import Project\n   → Selecione o repositório do GitHub\n   → Vercel detecta automaticamente o framework\n   → Para HTML puro: "Other" como framework\n\n3. Deploy!\n   → URL gerada: https://meu-projeto.vercel.app\n   → Deploy automático a cada push na main\n   → Preview URL a cada PR' },
        { type: 'h2', text: 'Configurando domínio personalizado' },
        { type: 'code', lang: 'text', raw: '# Na Vercel, após o deploy:\n# Settings → Domains → Add domain\n\n# Compre um domínio em:\n#   namecheap.com, registro.br, godaddy.com\n\n# No registrador, adicione o DNS record:\n# Tipo: CNAME\n# Nome: www\n# Valor: cname.vercel-dns.com\n\n# Ou registro A para apex domain:\n# 76.76.21.21' },
        { type: 'h2', text: 'Vercel CLI — deploy via terminal' },
        { type: 'code', lang: 'bash', raw: '# Instalar\nnpm install -g vercel\n\n# Deploy (na pasta do projeto)\nvercel\n\n# Deploy para produção\nvercel --prod\n\n# Ver status dos deploys\nvercel ls\n\n# Logs em tempo real\nvercel logs https://meu-projeto.vercel.app' },
        { type: 'exercise',
          title: 'Deploy do seu portfólio na Vercel',
          desc: 'Coloque seu portfólio online com domínio .vercel.app em menos de 5 minutos.',
          steps: [
            'Certifique que seu portfólio está no GitHub com HTML/CSS/JS funcionando',
            'Crie conta na Vercel com login GitHub',
            'Importe o repositório do portfólio',
            'Aguarde o deploy e acesse a URL gerada',
            'Faça uma pequena mudança no código, push, e veja o re-deploy automático'
          ],
          solution: '# Após conectar GitHub à Vercel:\n# 1. Import Project → selecione o repo\n# 2. Framework Preset: Other\n# 3. Root Directory: / (raiz)\n# 4. Deploy\n# URL: https://SEU-PROJETO.vercel.app\n\n# Para re-deploy automático, apenas:\ngit add .\ngit commit -m "feat: atualizar conteúdo do portfólio"\ngit push\n# A Vercel detecta o push e faz o deploy automaticamente' },
      ]
    },

    // ─── 6.3 ────────────────────────────────────────────────────────────────
    {
      id: '6.3', module: 6, index: 3,
      title: 'Otimização de Performance',
      duration: 20,
      sections: [
        { type: 'h2', text: 'Por que performance importa' },
        { type: 'p', html: 'Sites lentos perdem usuários. Estudos mostram que 53% dos usuários mobile abandonam páginas que demoram mais de 3 segundos para carregar. Performance é UX, é SEO e é negócio.' },
        { type: 'h2', text: 'Medindo performance — Lighthouse' },
        { type: 'code', lang: 'text', raw: '# No Chrome DevTools → Lighthouse → Generate report\n\nMétricas principais:\n  LCP  (Largest Contentful Paint) → carga do maior elemento visual\n       Meta: < 2.5s\n  FID  (First Input Delay)        → resposta ao primeiro clique\n       Meta: < 100ms\n  CLS  (Cumulative Layout Shift)  → estabilidade visual\n       Meta: < 0.1\n  FCP  (First Contentful Paint)   → primeiro conteúdo visível\n       Meta: < 1.8s' },
        { type: 'h2', text: 'Otimizações práticas' },
        { type: 'code', lang: 'HTML', raw: '<!-- 1. Imagens otimizadas -->\n<!-- Nunca suba PNG de 5MB — use ferramentas como squoosh.app -->\n<img src="foto.webp" alt="descrição" width="800" height="600" loading="lazy">\n\n<!-- 2. Fontes do Google sem blocking -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<!-- display=swap evita flash de texto invisível -->\n<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">\n\n<!-- 3. CSS no head, JS antes do </body> -->\n<head>\n  <link rel="stylesheet" href="style.css">  <!-- CSS no head -->\n</head>\n<body>\n  ...\n  <script src="app.js"></script>  <!-- JS no final -->\n</body>' },
        { type: 'code', lang: 'JavaScript', raw: '// 4. Lazy loading de imagens com Intersection Observer\nconst imagens = document.querySelectorAll("img[data-src]")\n\nconst observer = new IntersectionObserver(function(entries) {\n  entries.forEach(function(entry) {\n    if (entry.isIntersecting) {\n      const img = entry.target\n      img.src = img.dataset.src\n      observer.unobserve(img)\n    }\n  })\n})\n\nimagens.forEach(img => observer.observe(img))' },
        { type: 'code', lang: 'JavaScript', raw: '// 5. Debounce em eventos frequentes (scroll, resize, input)\nfunction debounce(fn, delay) {\n  let timer\n  return function(...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), delay)\n  }\n}\n\n// Sem debounce: dispara centenas de vezes por segundo\n// Com debounce: espera 300ms após parar de digitar\ninput.addEventListener("input", debounce(function() {\n  buscarSugestoes(this.value)\n}, 300))' },
        { type: 'exercise',
          title: 'Auditar e otimizar seu portfólio',
          desc: 'Rode o Lighthouse no seu portfólio e melhore pelo menos 2 pontos.',
          steps: [
            'Abra o portfólio no Chrome, F12 → Lighthouse → Generate report',
            'Anote os scores iniciais (Performance, Acessibilidade, SEO)',
            'Identifique os 2 maiores problemas apontados',
            'Corrija e rode o Lighthouse novamente — documente a melhoria',
            'Faça push e veja o deploy na Vercel com as otimizações'
          ],
          solution: '// Correções mais comuns:\n// 1. Imagens sem width/height → adicionar atributos\n// 2. Imagens sem alt → adicionar descrições\n// 3. JS blockeando render → mover para antes de </body>\n// 4. CSS de terceiros desnecessário → remover\n// 5. Imagens grandes → comprimir em squoosh.app' },
      ]
    },

    // ─── 6.4 ────────────────────────────────────────────────────────────────
    {
      id: '6.4', module: 6, index: 4,
      title: 'Acessibilidade Web (a11y)',
      duration: 20,
      sections: [
        { type: 'h2', text: 'O que é acessibilidade' },
        { type: 'p', html: 'Acessibilidade web significa que pessoas com deficiências visuais, motoras, cognitivas ou auditivas conseguem usar seu site. Além de ser ético, em muitos países é obrigação legal. Sites acessíveis também têm melhor SEO.' },
        { type: 'h2', text: 'Princípios WCAG' },
        { type: 'code', lang: 'text', raw: 'WCAG 2.1 — 4 princípios fundamentais:\n  P - Perceptível    → conteúdo visível e audível\n  O - Operável       → navegável por teclado\n  C - Compreensível  → linguagem clara, comportamento previsível\n  R - Robusto        → funciona com diferentes tecnologias assistivas\n\nNíveis:\n  A   → mínimo obrigatório\n  AA  → padrão de mercado (geralmente exigido)\n  AAA → excelência (nem sempre viável)' },
        { type: 'h2', text: 'Práticas essenciais' },
        { type: 'code', lang: 'HTML', raw: '<!-- 1. Textos alternativos em imagens -->\n<img src="foto.jpg" alt="Desenvolvedor trabalhando em laptop">\n<img src="decorativa.svg" alt="">  <!-- decorativa: alt vazio -->\n\n<!-- 2. Labels em formulários -->\n<label for="email">E-mail</label>\n<input type="email" id="email" name="email">\n\n<!-- 3. Hierarquia de headings -->\n<h1>Título da página</h1>   <!-- apenas UM por página -->\n  <h2>Seção</h2>\n    <h3>Subseção</h3>\n  <h2>Outra seção</h2>\n\n<!-- 4. HTML semântico (não use div para tudo) -->\n<header>  <nav>  <main>  <section>  <article>  <aside>  <footer>\n<button> (não <div onclick>)\n<a href=""> (não <span onclick>)\n\n<!-- 5. ARIA quando HTML não é suficiente -->\n<button aria-label="Fechar menu" aria-expanded="false">\n  <span class="icone-x"></span>\n</button>\n\n<div role="alert" aria-live="polite" id="mensagem-status"></div>' },
        { type: 'code', lang: 'CSS', raw: '/* 6. Foco visível — nunca remova sem substituir */\n/* Ruim: */\n*:focus { outline: none; }\n\n/* Bom: */\n*:focus-visible {\n  outline: 3px solid #00d4ff;\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n\n/* 7. Contraste suficiente */\n/* Use o WebAIM Contrast Checker para validar */\n/* Texto normal: razão mínima 4.5:1 */\n/* Texto grande (18px+): razão mínima 3:1 */\n\n/* 8. Respeitar preferências do usuário */\n@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important; transition: none !important; }\n}' },
        { type: 'exercise',
          title: 'Auditoria de acessibilidade',
          desc: 'Corrija os problemas de acessibilidade do seu portfólio.',
          steps: [
            'No Lighthouse, veja o score de Acessibilidade do portfólio',
            'Certifique que todas as imagens têm alt adequado',
            'Navegue o portfólio inteiro usando apenas o teclado (Tab, Enter, Esc)',
            'Verifique se há contraste suficiente nas cores usando webaim.org/resources/contrastchecker',
            'Adicione um link "Pular para o conteúdo" no topo (acessibilidade para leitores de tela)'
          ],
          solution: '<!-- Link "Pular para conteúdo" -->\n<a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>\n\n<style>\n.skip-link {\n  position: absolute;\n  left: -9999px;\n}\n.skip-link:focus {\n  left: 16px;\n  top: 16px;\n  z-index: 9999;\n  background: #000;\n  color: #fff;\n  padding: 8px 16px;\n  border-radius: 4px;\n}\n</style>\n\n<main id="main-content">\n  <!-- conteúdo principal -->\n</main>' },
      ]
    },

    // ─── 6.5 ────────────────────────────────────────────────────────────────
    {
      id: '6.5', module: 6, index: 5,
      title: 'Projeto Final — Portfólio Profissional',
      duration: 90,
      sections: [
        { type: 'h2', text: 'Construindo seu portfólio do zero' },
        { type: 'p', html: 'O portfólio é o projeto mais importante para quem está entrando no mercado. É a prova concreta de que você sabe o que aprendeu. Vamos construir um portfólio profissional, responsivo, acessível e otimizado.' },
        { type: 'h2', text: 'Seções essenciais' },
        { type: 'code', lang: 'text', raw: 'Estrutura recomendada:\n\n1. Hero          → nome, título, CTA (ver projetos, contato)\n2. Sobre         → quem é você, sua jornada, o que busca\n3. Skills        → tecnologias com nível visual\n4. Projetos      → cards com: nome, descrição, stack, links\n5. Contato       → email, LinkedIn, GitHub\n\nOpcionais:\n  Experiência / Formação\n  Artigos / Blog\n  Certificados' },
        { type: 'h2', text: 'HTML estruturado com semântica' },
        { type: 'code', lang: 'HTML', raw: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta name="description" content="Portfólio de [Nome] — Desenvolvedor Front-end">\n  <title>[Nome] — Dev Front-end</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <a href="#main" class="skip-link">Pular para conteúdo</a>\n\n  <header>\n    <nav aria-label="Navegação principal">\n      <a href="#sobre">Sobre</a>\n      <a href="#projetos">Projetos</a>\n      <a href="#contato">Contato</a>\n    </nav>\n  </header>\n\n  <main id="main">\n    <section id="hero" aria-label="Apresentação">\n      <h1>[Seu Nome]</h1>\n      <p>Desenvolvedor Front-end em formação</p>\n      <a href="#projetos" class="btn-cta">Ver projetos</a>\n    </section>\n\n    <section id="projetos" aria-label="Projetos">\n      <h2>Projetos</h2>\n      <div class="grid-projetos">\n        <!-- cards aqui -->\n      </div>\n    </section>\n\n    <section id="contato" aria-label="Contato">\n      <h2>Contato</h2>\n      <p>email@exemplo.com</p>\n    </section>\n  </main>\n\n  <footer>\n    <p>Feito com HTML, CSS e JS por [Nome]</p>\n  </footer>\n\n  <script src="script.js"></script>\n</body>\n</html>' },
        { type: 'h2', text: 'Cards de projeto' },
        { type: 'code', lang: 'JavaScript', raw: '// Dados dos projetos em JavaScript\nconst projetos = [\n  {\n    nome: "Lista de Tarefas",\n    descricao: "App de gerenciamento de tarefas com persistência local.",\n    stack: ["HTML", "CSS", "JavaScript"],\n    demo: "https://usuario.github.io/todo-app",\n    codigo: "https://github.com/usuario/todo-app",\n    imagem: "img/todo.png"\n  },\n  {\n    nome: "App de Clima",\n    descricao: "Busca clima em tempo real via OpenWeatherMap API.",\n    stack: ["HTML", "CSS", "JavaScript", "Fetch API"],\n    demo: "https://usuario.github.io/weather-app",\n    codigo: "https://github.com/usuario/weather-app",\n    imagem: "img/weather.png"\n  }\n]\n\nfunction renderizarProjetos() {\n  const grid = document.querySelector(".grid-projetos")\n  grid.innerHTML = projetos.map(p => `\n    <article class="card-projeto">\n      <img src="${p.imagem}" alt="${p.nome}">\n      <div class="card-body">\n        <h3>${p.nome}</h3>\n        <p>${p.descricao}</p>\n        <div class="stack">\n          ${p.stack.map(t => `<span class="tag">${t}</span>`).join("")}\n        </div>\n        <div class="links">\n          <a href="${p.demo}" target="_blank" rel="noopener">Demo ↗</a>\n          <a href="${p.codigo}" target="_blank" rel="noopener">Código</a>\n        </div>\n      </div>\n    </article>\n  `).join("")\n}\n\nrenderizarProjetos()' },
        { type: 'callout', html: '<strong>Dica de ouro:</strong> Um portfólio com 3 projetos bem feitos, código limpo no GitHub e README completo vale mais que um portfólio com 10 projetos inacabados ou copiados de tutorial. Qualidade sobre quantidade.' },
        { type: 'exercise',
          title: 'Construa e publique seu portfólio',
          desc: 'Este é o projeto final do módulo — e um dos projetos mais importantes da sua carreira.',
          steps: [
            'Crie o portfólio com as seções: hero, sobre, projetos e contato',
            'Use HTML semântico, CSS responsivo (funciona em mobile) e JavaScript para renderizar os cards',
            'Adicione os 3 projetos que você construiu neste curso (lista, clima, dashboard)',
            'Teste acessibilidade: navegação por teclado, contraste, alt em imagens',
            'Publique na Vercel com URL personalizada e adicione o link ao seu LinkedIn e GitHub'
          ],
          solution: '// Este é o projeto mais pessoal do curso.\n// Não existe solução única — use seu estilo.\n// Requisitos mínimos:\n// ✅ HTML semântico com landmark regions\n// ✅ CSS com mobile-first responsive\n// ✅ Pelo menos 3 projetos com links reais\n// ✅ Links abrindo em nova aba com rel="noopener"\n// ✅ Deploy na Vercel (ou GitHub Pages)\n// ✅ Score Lighthouse > 90 em Performance e Acessibilidade' },
      ]
    },

  ]
})()
