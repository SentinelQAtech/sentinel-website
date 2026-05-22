// Sentinel Learning — Módulo 7: Mercado de Trabalho

(function () {
  window.M7 = [

    // ─── 7.1 ────────────────────────────────────────────────────────────────
    {
      id: '7.1', module: 7, index: 1,
      title: 'O mercado de desenvolvimento em 2025',
      duration: 18,
      sections: [
        { type: 'h2', text: 'Como está o mercado' },
        { type: 'p', html: 'O mercado de dev em 2025 é competitivo — mais candidatos que antes, mas também mais oportunidades. A chave é <strong>se destacar com habilidades práticas e portfólio concreto</strong>, não com listas de tecnologias no currículo.' },
        { type: 'h2', text: 'O que o mercado realmente busca' },
        { type: 'code', lang: 'text', raw: 'Junior Front-end:\n  Stack básica:     HTML, CSS, JavaScript (ES6+)\n  Framework:        React ou Vue (o mais comum no BR é React)\n  Versionamento:    Git + GitHub\n  Deploy básico:    Vercel, Netlify, GitHub Pages\n  Extras valorizados:\n    → Responsividade e acessibilidade básica\n    → Consumo de APIs REST\n    → CSS moderno (Flexbox, Grid, variáveis)\n    → TypeScript (diferencial forte)\n\nO que NÃO é necessário ainda:\n  → Conhecer todas as tecnologias\n  → Ter 5+ anos de experiência\n  → Saber algoritmos avançados\n  → Ter certificações caras' },
        { type: 'h2', text: 'Salários no mercado brasileiro (2025)' },
        { type: 'code', lang: 'text', raw: 'Junior:    R$ 2.500 – R$ 5.000 (CLT)\n           R$ 3.500 – R$ 7.000 (PJ)\n\nPleno:     R$ 5.000 – R$ 10.000 (CLT)\n           R$ 7.000 – R$ 14.000 (PJ)\n\nSenior:    R$ 10.000 – R$ 20.000+ (CLT)\n           R$ 15.000 – R$ 30.000+ (PJ)\n\nRemoto Internacional (USD):\n  Junior:  $25k – $50k/ano\n  Pleno:   $50k – $90k/ano\n  Senior:  $90k – $200k+/ano\n\nPara remoto internacional: inglês é mandatory.' },
        { type: 'callout', html: '<strong>Dica:</strong> PJ (Pessoa Jurídica) costuma pagar 30-50% a mais que CLT bruto, mas você paga seus próprios impostos e benefícios. Para comparar: multiplique o CLT por ~1.5 para ter o equivalente em PJ.' },
        { type: 'exercise',
          title: 'Mapeando o mercado',
          desc: 'Pesquise vagas reais e mapeie os requisitos para entender o que estudar.',
          steps: [
            'Pesquise 5 vagas de "Desenvolvedor Front-end Junior" no LinkedIn, Glassdoor ou Gupy',
            'Liste as 10 tecnologias mais pedidas entre as 5 vagas',
            'Marque quais você já domina e quais ainda precisa aprender',
            'Identifique qual é o gap mais crítico para você e anote o plano de estudo'
          ],
          solution: '// Exercício prático — não há solução de código.\n// Tecnologias mais comuns que você vai encontrar:\n// HTML5, CSS3, JavaScript ES6+, React, Git, GitHub,\n// Responsividade, API REST, TypeScript, Node.js básico' },
      ]
    },

    // ─── 7.2 ────────────────────────────────────────────────────────────────
    {
      id: '7.2', module: 7, index: 2,
      title: 'Currículo e LinkedIn para devs',
      duration: 22,
      sections: [
        { type: 'h2', text: 'Currículo de dev — o que funciona' },
        { type: 'code', lang: 'text', raw: 'O que incluir:\n  1. Nome + contato (email, LinkedIn, GitHub, portfólio)\n  2. Resumo profissional (2-3 linhas: quem é você e o que busca)\n  3. Projetos (2-3 projetos com: nome, descrição, stack, links)\n  4. Habilidades técnicas (agrupadas: Frontend, Ferramentas, etc.)\n  5. Formação (cursos relevantes, bootcamps, faculdade se tiver)\n  6. Experiência (se tiver, mesmo que não seja dev)\n\nO que NÃO fazer:\n  ✗ Foto (no BR é opcional — foque no conteúdo)\n  ✗ Barras de progresso de habilidades ("JavaScript: ████░ 80%")\n  ✗ Objetivo genérico ("busco oportunidade de crescimento")\n  ✗ Lista de tecnologias sem contexto de uso\n  ✗ Mais de 1 página (para junior)' },
        { type: 'h2', text: 'Resumo profissional que funciona' },
        { type: 'code', lang: 'text', raw: '// Ruim:\n"Profissional dinâmico buscando oportunidade de crescimento\nna área de desenvolvimento."\n\n// Bom:\n"Desenvolvedor Front-end em formação, com projetos reais\nem HTML, CSS, JavaScript e consumo de APIs REST.\nBusco minha primeira oportunidade como Junior, com foco\nem times ágeis e produtos digitais."' },
        { type: 'h2', text: 'LinkedIn para devs' },
        { type: 'code', lang: 'text', raw: 'Pontos críticos do perfil:\n\n  Título:    "Desenvolvedor Front-end | HTML · CSS · JavaScript"\n             (não "Estudante de programação")\n\n  Sobre:     3-5 parágrafos: quem é você, o que construiu,\n             o que busca, tecnologias que usa.\n\n  Projetos:  Adicione cada projeto com: nome, descrição,\n             link da demo, tecnologias usadas.\n\n  Formação:  Cursos, bootcamps, graduação.\n\n  URL:       Personalize → linkedin.com/in/seu-nome\n\nO que fazer regularmente:\n  → Poste sobre o que está aprendendo (1x/semana)\n  → Comente em posts de pessoas da área\n  → Conecte com devs, recrutadores e líderes técnicos' },
        { type: 'exercise',
          title: 'Atualizar LinkedIn e currículo',
          desc: 'Aplique as boas práticas ao seu perfil real.',
          steps: [
            'Atualize o título do LinkedIn para incluir suas tecnologias principais',
            'Escreva ou reescreva o "Sobre" usando o modelo: quem é, o que construiu, o que busca',
            'Adicione os 3 projetos do curso como experiências na seção "Projetos"',
            'Personalize sua URL do LinkedIn (linkedin.com/in/seu-nome)',
            'Publique um post sobre o que aprendeu neste curso — engajamento real'
          ],
          solution: '// Exercício prático de carreira.\n// Dica para o post no LinkedIn:\n// "Finalizei o módulo de [X] e construí [projeto].\n// Aprendi [conceito específico] e percebi que [insight real].\n// Link do projeto: [url]\n// #javascript #frontend #dev"' },
      ]
    },

    // ─── 7.3 ────────────────────────────────────────────────────────────────
    {
      id: '7.3', module: 7, index: 3,
      title: 'Entrevistas técnicas para Front-end',
      duration: 26,
      sections: [
        { type: 'h2', text: 'Como funcionam as entrevistas de dev' },
        { type: 'p', html: 'Entrevistas de dev junior costumam ter: triagem de RH, entrevista técnica (teoria + prática), desafio técnico (em casa ou ao vivo) e entrevista cultural/comportamental.' },
        { type: 'h2', text: 'Perguntas técnicas mais comuns' },
        { type: 'code', lang: 'JavaScript', raw: '// 1. "Qual a diferença entre var, let e const?"\nvar x = 1    // escopo de função, hoisting, pode ser redeclarada\nlet y = 2    // escopo de bloco, hoisting sem valor, não redeclarada\nconst z = 3  // escopo de bloco, não pode ser reatribuída\n\n// 2. "O que é closure?"\nfunction contador() {\n  let count = 0\n  return function() {\n    return ++count\n  }\n}\nconst c = contador()\nc()  // 1\nc()  // 2 — count é lembrado\n\n// 3. "Qual a diferença entre == e ===?"\n1 == "1"   // true  — compara valor (coerção de tipo)\n1 === "1"  // false — compara valor E tipo\n\n// 4. "O que é event bubbling?"\n// Um evento num elemento filho sobe pelo DOM:\n// li → ul → div → body → html → document\n\n// 5. "Como o JavaScript é single-threaded e assíncrono ao mesmo tempo?"\n// Event loop: JS executa 1 linha de cada vez (single-thread)\n// mas I/O (fetch, setTimeout) vai para Web APIs do browser\n// e o callback volta quando a stack está vazia (event loop)' },
        { type: 'h2', text: 'Desafio técnico típico' },
        { type: 'code', lang: 'text', raw: 'Exemplos reais de desafios para junior:\n  → "Crie uma lista de tarefas com adicionar e remover"\n  → "Consuma esta API e exiba os dados em cards"\n  → "Corrija os bugs neste código"\n  → "Implemente um autocomplete"\n\nO que avaliam:\n  ✓ Código funcionando\n  ✓ Estrutura organizada (HTML semântico, CSS separado)\n  ✓ Nomes descritivos para variáveis e funções\n  ✓ Tratamento de casos de borda (input vazio, erro de API)\n  ✓ README com como rodar\n  ✓ Commits descritivos (se for no GitHub)' },
        { type: 'h2', text: 'Perguntas para você fazer' },
        { type: 'code', lang: 'text', raw: '✓ "Qual é o maior desafio técnico que o time enfrenta hoje?"\n✓ "Como é a rotina de deploy — com que frequência vai para produção?"\n✓ "Qual é a stack frontend atual e tem planos de migração?"\n✓ "Como é o processo de code review?"\n✓ "Como funciona o onboarding para novos devs?"' },
        { type: 'exercise',
          title: 'Simulação de entrevista técnica',
          desc: 'Responda as perguntas mais comuns como em uma entrevista real.',
          steps: [
            'Explique com suas palavras: o que é o event loop do JavaScript?',
            'Escreva de memória: uma função que recebe um array de números e retorna apenas os pares',
            'Explique a diferença entre flexbox e grid CSS — quando usar cada um?',
            'Descreva como você implementaria um componente de modal: HTML, CSS e JS',
            'Qual projeto do seu portfólio você mais se orgulha e por quê?'
          ],
          solution: '// Respostas de referência:\n\n// 1. Event Loop:\n// JS tem uma call stack (onde executa o código),\n// uma fila de callbacks (onde ficam as funções assíncronas prontas)\n// e o event loop que fica verificando: stack vazia? pega o próximo callback.\n\n// 2. Filtrar pares:\nfunction filtrarPares(numeros) {\n  return numeros.filter(n => n % 2 === 0)\n}\nfiltrarPares([1, 2, 3, 4, 5, 6])  // [2, 4, 6]\n\n// 3. Flex vs Grid:\n// Flexbox: unidimensional (1 linha ou 1 coluna) — ótimo para nav, cards em linha\n// Grid: bidimensional (linhas E colunas) — ótimo para layouts completos de página' },
      ]
    },

    // ─── 7.4 ────────────────────────────────────────────────────────────────
    {
      id: '7.4', module: 7, index: 4,
      title: 'Aprendizado contínuo e comunidade',
      duration: 16,
      sections: [
        { type: 'h2', text: 'O conhecimento de dev expira rápido' },
        { type: 'p', html: 'Em 2010, jQuery era essencial. Em 2015, era Angular. Hoje é React/Vue/Svelte. Em 2028, será outra coisa. Devs que ficam no mercado são os que <strong>aprendem a aprender</strong> — não os que dominam uma ferramenta específica para sempre.' },
        { type: 'h2', text: 'Fontes de aprendizado que valem' },
        { type: 'code', lang: 'text', raw: 'Documentação oficial — sempre a fonte mais confiável:\n  → MDN Web Docs (developer.mozilla.org) → HTML, CSS, JS\n  → React Docs (react.dev)\n  → TypeScript Handbook\n\nCursos e plataformas:\n  → The Odin Project (gratuito, completo)\n  → Frontend Masters (pago, alto nível)\n  → Rocketseat (BR, focado em prática)\n  → Scrimba (interativo)\n\nConteúdo gratuito:\n  → Fireship (YouTube) — conceitos rápidos e modernos\n  → Kevin Powell (YouTube) — CSS profundo\n  → Traversy Media (YouTube) — projetos práticos\n  → JavaScript.info — guia mais completo de JS\n\nPrática real:\n  → Frontend Mentor (frontendmentor.io) — desafios reais\n  → CSS Battle — desafios de CSS\n  → LeetCode Easy → algoritmos básicos para entrevistas' },
        { type: 'h2', text: 'Comunidade — aprender com outros' },
        { type: 'code', lang: 'text', raw: 'BR:\n  → Rocketseat Discord\n  → DevPro (grupos no WhatsApp/Telegram)\n  → TDC, Campus Party, JSDAY (eventos)\n\nInternacional:\n  → Dev.to (artigos)\n  → Hashnode (blog de devs)\n  → X/Twitter — comunidade ativa de devs\n  → Discord de React, TypeScript, etc.' },
        { type: 'h2', text: 'Rotina de dev que aprende' },
        { type: 'code', lang: 'text', raw: 'Diário (30-60 min):\n  → Avançar em um projeto real\n  → Ler um artigo ou assistir um vídeo curto\n\nSemanal:\n  → Contribuir no GitHub (mesmo que seja seu próprio projeto)\n  → Interagir com a comunidade (comentar, responder dúvidas)\n\nMensal:\n  → Revisar e atualizar o portfólio\n  → Participar de um evento ou meetup\n  → Fazer um retrospectivo: o que aprendi? o que quero aprender?\n\nO segredo: consistência > intensidade.\n30 minutos todo dia supera 8 horas uma vez por semana.' },
        { type: 'exercise',
          title: 'Plano de desenvolvimento',
          desc: 'Crie seu PDI — Plano de Desenvolvimento Individual — para os próximos 3 meses.',
          steps: [
            'Liste suas 3 maiores lacunas técnicas hoje (ex: React, TypeScript, testes)',
            'Para cada lacuna, escolha: um recurso de aprendizado + um projeto para praticar',
            'Defina uma meta concreta para 90 dias: "Em [data], quero conseguir [resultado específico]"',
            'Identifique 2 comunidades para participar ativamente',
            'Anote 1 ação que você vai fazer ainda hoje para começar'
          ],
          solution: '// Exemplo de PDI:\n\n// Lacunas: React, TypeScript, consumo de APIs\n\n// React:\n//   Recurso: react.dev (documentação oficial)\n//   Projeto: reescrever o app de clima em React com hooks\n\n// TypeScript:\n//   Recurso: TypeScript Handbook\n//   Projeto: adicionar tipos ao projeto de finanças\n\n// APIs:\n//   Recurso: MDN — Fetch API\n//   Projeto: app que consome uma API pública de sua escolha\n\n// Meta 90 dias: "Em 16/08/2026, ter 3 projetos React no\n// portfólio com TypeScript e publicados na Vercel"\n\n// Ação hoje: criar conta no react.dev e começar o tutorial oficial' },
      ]
    },

    // ─── 7.5 ────────────────────────────────────────────────────────────────
    {
      id: '7.5', module: 7, index: 5,
      title: 'Próximos passos — o que vem depois do Front-end',
      duration: 16,
      sections: [
        { type: 'h2', text: 'Você terminou o curso de JavaScript. E agora?' },
        { type: 'p', html: 'Terminar este curso significa que você tem a base. O mercado vai pedir mais — e é normal. A trilha mais comum para um dev front-end é:' },
        { type: 'code', lang: 'text', raw: 'Base (você está aqui após este curso):\n  HTML → CSS → JavaScript → DOM → APIs → Git\n\nPróximos passos naturais:\n\n  1. React (ou Vue)\n     → Componentes, hooks, estado, rotas\n     → É o framework mais pedido no BR\n     → 2-3 meses de prática para fluência básica\n\n  2. TypeScript\n     → Tipagem estática sobre JavaScript\n     → Diferencial forte para vaga de pleno\n     → 1 mês para o básico\n\n  3. Node.js básico\n     → Entender o back-end para trabalhar melhor com APIs\n     → Express, criação de APIs REST simples\n\n  4. Testes\n     → Jest para unit tests\n     → Playwright para E2E (já temos o curso aqui!)\n\n  5. Build tools\n     → Vite (padrão moderno)\n     → bundling, hot reload, variáveis de ambiente\n\n  Especialização (escolha uma):\n     → Design system / Component library\n     → Performance e Core Web Vitals\n     → Full Stack (Next.js)\n     → Mobile (React Native)' },
        { type: 'h2', text: 'A jornada não é linear' },
        { type: 'p', html: 'Você vai estudar React e sentir que não sabe nada. Vai conseguir a primeira vaga e sentir que não merece. Vai trabalhar por 6 meses e olhar para o seu código antigo com vergonha — e isso é sinal de que você cresceu. <strong>Essa é a jornada.</strong> Todo dev passou por isso.' },
        { type: 'callout', html: '<strong>Síndrome do impostor</strong> — a sensação de "eu não sei o suficiente" — é universal na área de tech. O antídoto é construir coisas, mostrá-las ao mundo e continuar aprendendo. O problema não é não saber — é parar de aprender.' },
        { type: 'h2', text: 'Parabéns por ter chegado até aqui' },
        { type: 'p', html: 'Você cobriu fundamentos de lógica, arrays, objetos, funções, DOM, eventos, APIs assíncronas, Git, deploy, performance e acessibilidade. Isso é a base real de um desenvolvedor front-end. O portfólio que você construiu ao longo deste curso é prova concreta de que você sabe o que aprendeu.' },
        { type: 'callout', html: 'Abra o repositório, continue construindo, interaja com a comunidade, mande aquela candidatura que você ficou com medo de mandar. A primeira vaga é a mais difícil — e está mais perto do que você acha.' },
        { type: 'exercise',
          title: 'Reflexão final e próximos passos',
          desc: 'Uma última reflexão antes de partir para o próximo nível.',
          steps: [
            'Escreva: qual foi o conceito mais difícil que você aprendeu neste curso?',
            'Escreva: qual foi o momento mais satisfatório?',
            'Liste: quais são os 3 projetos do seu portfólio que você vai publicar e linkar no LinkedIn?',
            'Defina: qual é o próximo curso/assunto que você vai estudar (React? TypeScript? QA?)',
            'Faça: envie uma candidatura para uma vaga Junior — mesmo que não se sinta "pronto". A melhor forma de descobrir o que precisa aprender é ir ao mercado.'
          ],
          solution: '// Não existe solução de código aqui.\n// Mas existe um próximo passo:\n// abrir o GitHub, criar o repositório,\n// escrever o README e fazer o push.\n// Tudo começa com esse commit.' },
      ]
    },

    // ─── 7.6 ────────────────────────────────────────────────────────────────
    {
      id: '7.6', module: 7, index: 6,
      title: 'Projeto Final — Portfólio + Candidatura Real',
      duration: 60,
      sections: [
        { type: 'h2', text: 'O projeto final do curso' },
        { type: 'p', html: 'Este é o último projeto — e o mais importante de todos. Você vai consolidar tudo em um portfólio publicado, com código no GitHub, com README, com deploy na Vercel. E vai usar esse portfólio para mandar a primeira candidatura.' },
        { type: 'h2', text: 'Checklist final do portfólio' },
        { type: 'code', lang: 'text', raw: 'Repositório GitHub:\n  ✅ Código limpo no repositório público\n  ✅ README com descrição, demo, stack e como rodar\n  ✅ .gitignore configurado\n  ✅ Histórico de commits descritivo\n  ✅ Projetos linkados na bio do perfil\n\nPortfólio web:\n  ✅ HTML semântico\n  ✅ Responsivo (mobile, tablet, desktop)\n  ✅ Acessível (navegação por teclado, contrast OK, alts)\n  ✅ Performance > 90 no Lighthouse\n  ✅ Deploy na Vercel com URL funcionando\n  ✅ Links dos projetos funcionando\n\nPresença online:\n  ✅ LinkedIn atualizado com projetos\n  ✅ GitHub com README de perfil\n  ✅ URL do portfólio no LinkedIn, GitHub e currículo' },
        { type: 'h2', text: 'Como escrever a primeira candidatura' },
        { type: 'code', lang: 'text', raw: '// Mensagem de candidatura (LinkedIn, email, Gupy):\n\nOlá [Nome do recrutador/pessoa],\n\nEstou em busca da minha primeira oportunidade como\ndesenvolvedor Front-end Junior. Finalizei recentemente um\ncurso completo de JavaScript, DOM, APIs e Git, e construí\ntrês projetos publicados:\n\n→ [nome do projeto 1] — [link] — [tecnologias]\n→ [nome do projeto 2] — [link] — [tecnologias]\n→ [nome do projeto 3] — [link] — [tecnologias]\n\nPortfólio: [link]\nGitHub: [link]\n\nEstaria disponível para uma conversa?\n\n[Seu nome]' },
        { type: 'callout', html: '<strong>Volume importa:</strong> mandar 100 candidaturas personalizadas é mais eficiente que esperar a vaga perfeita. A taxa de resposta para junior costuma ser 5-15%. É um jogo de números — não é rejeição pessoal.' },
        { type: 'h2', text: 'Você chegou até aqui' },
        { type: 'p', html: 'Do zero à lógica, dos arrays ao DOM, das APIs ao Git, do portfólio ao mercado. Você tem o mapa. Agora é construir, publicar, candidatar e iterar. Boa sorte — e bem-vindo ao mundo do desenvolvimento.' },
        { type: 'exercise',
          title: 'Entrega final',
          desc: 'Finalize e publique. Este é o commit mais importante da sua jornada até agora.',
          steps: [
            'Publique o portfólio na Vercel com URL funcionando',
            'Certifique que GitHub, LinkedIn e currículo têm o link do portfólio',
            'Mande pelo menos UMA candidatura usando o modelo acima',
            'Poste no LinkedIn sobre a conclusão do curso — com o link do portfólio',
            'Comece o próximo passo (React, TypeScript ou o que você definiu no PDI)'
          ],
          solution: '// O próximo commit começa agora.\n// git add .\n// git commit -m "feat: portfólio profissional completo"\n// git push\n//\n// Parabéns por ter terminado.' },
      ]
    },

  ]
})()
