// Sentinel Learning — QA M4: Testes de API
window.QA_M4 = [

  // ─── 4.1 ───────────────────────────────────────────────
  {
    module: 4, lesson: 1,
    title: 'Fundamentos de API REST',
    tag: 'Conceito', duration: '20 min', xp: 100,
    sections: [
      { type: 'text', content: `
        <h2>O que é uma API?</h2>
        <p><strong>API</strong> (Application Programming Interface) é um contrato de comunicação entre sistemas. Quando o front-end exibe dados do usuário, quando um app de delivery rastreia seu pedido, quando um PIX é processado — uma API está no meio.</p>
        <p>Como QA, você vai testar exatamente esse contrato: garantir que quem consome a API recebe exatamente o que foi prometido, nas condições certas.</p>

        <h2>REST — o estilo arquitetural dominante</h2>
        <p><strong>REST</strong> (Representational State Transfer) é um conjunto de princípios para construir APIs usando HTTP. Uma API RESTful:</p>
        <ul>
          <li>Usa URLs para representar <strong>recursos</strong> (ex: <code>/users/42</code>)</li>
          <li>Usa <strong>verbos HTTP</strong> para indicar a ação desejada</li>
          <li>É <strong>stateless</strong>: cada requisição é independente, o servidor não guarda sessão</li>
          <li>Retorna dados em <strong>JSON</strong> (na grande maioria dos casos)</li>
        </ul>

        <h2>Anatomia de uma requisição HTTP</h2>
        <pre><code class="language-text">POST /api/users HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "name": "Raphael",
  "email": "raphael@exemplo.com"
}</code></pre>
        <p>Toda requisição tem:</p>
        <ul>
          <li><strong>Método (verbo)</strong>: GET, POST, PUT, PATCH, DELETE</li>
          <li><strong>URL</strong>: o endereço do recurso</li>
          <li><strong>Headers</strong>: metadados (autenticação, tipo de conteúdo, etc.)</li>
          <li><strong>Body</strong>: payload de dados (opcional, depende do verbo)</li>
        </ul>

        <h2>Anatomia de uma resposta HTTP</h2>
        <pre><code class="language-text">HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 99,
  "name": "Raphael",
  "email": "raphael@exemplo.com",
  "createdAt": "2026-05-16T10:00:00Z"
}</code></pre>
        <p>Toda resposta tem:</p>
        <ul>
          <li><strong>Status code</strong>: indica sucesso ou tipo de erro</li>
          <li><strong>Headers</strong>: metadados da resposta</li>
          <li><strong>Body</strong>: dados retornados (geralmente JSON)</li>
        </ul>

        <div class="callout callout-cyan">
          <strong>Visão de QA:</strong> A API é um contrato. Seu trabalho é garantir que esse contrato é honrado em todos os cenários — feliz, triste e no limite.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-4-1-ex1',
        prompt: 'Descreva com suas palavras: qual é a diferença entre testar uma API e testar uma interface visual? Qual delas expõe mais os dados reais do sistema e por quê?',
        placeholder: 'Sua reflexão aqui...' }
    ]
  },

  // ─── 4.2 ───────────────────────────────────────────────
  {
    module: 4, lesson: 2,
    title: 'HTTP: Verbos, Status Codes e Headers',
    tag: 'Conceito', duration: '22 min', xp: 110,
    sections: [
      { type: 'text', content: `
        <h2>Verbos HTTP</h2>
        <p>Cada verbo tem uma semântica específica. Como QA, você precisa garantir que a API os usa corretamente:</p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0;">
          <thead>
            <tr style="border-bottom:1px solid var(--border);">
              <th style="text-align:left; padding:8px 12px; color:var(--cyan); font-size:12px;">VERBO</th>
              <th style="text-align:left; padding:8px 12px; color:var(--cyan); font-size:12px;">AÇÃO</th>
              <th style="text-align:left; padding:8px 12px; color:var(--cyan); font-size:12px;">BODY</th>
              <th style="text-align:left; padding:8px 12px; color:var(--cyan); font-size:12px;">IDEMPOTENTE?</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px 12px;">GET</td><td style="padding:8px 12px;">Buscar recurso</td><td style="padding:8px 12px;">Não</td><td style="padding:8px 12px;">Sim</td></tr>
            <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px 12px;">POST</td><td style="padding:8px 12px;">Criar recurso</td><td style="padding:8px 12px;">Sim</td><td style="padding:8px 12px;">Não</td></tr>
            <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px 12px;">PUT</td><td style="padding:8px 12px;">Substituir recurso</td><td style="padding:8px 12px;">Sim</td><td style="padding:8px 12px;">Sim</td></tr>
            <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px 12px;">PATCH</td><td style="padding:8px 12px;">Atualizar parcialmente</td><td style="padding:8px 12px;">Sim</td><td style="padding:8px 12px;">Depende</td></tr>
            <tr><td style="padding:8px 12px;">DELETE</td><td style="padding:8px 12px;">Remover recurso</td><td style="padding:8px 12px;">Não</td><td style="padding:8px 12px;">Sim</td></tr>
          </tbody>
        </table>
        <p><strong>Idempotente</strong>: chamar N vezes tem o mesmo efeito que chamar 1 vez. Um GET de /users/42 sempre retorna o mesmo usuário. Um POST de /users cria um novo usuário a cada chamada — não é idempotente.</p>

        <h2>Status Codes — as classes que importam</h2>
        <pre><code class="language-text">2xx — Sucesso
  200 OK             → GET, PUT, PATCH com retorno
  201 Created        → POST que cria recurso
  204 No Content     → DELETE, ou PUT/PATCH sem corpo

3xx — Redirecionamento
  301 Moved Permanently
  302 Found (temporário)

4xx — Erro do cliente (bug no consumidor ou dado inválido)
  400 Bad Request    → payload malformado ou validação falhou
  401 Unauthorized   → não autenticado
  403 Forbidden      → autenticado mas sem permissão
  404 Not Found      → recurso não existe
  409 Conflict       → duplicidade (email já cadastrado)
  422 Unprocessable  → entidade semanticamente inválida

5xx — Erro do servidor (bug na API)
  500 Internal Server Error → exceção não tratada
  502 Bad Gateway           → upstream offline
  503 Service Unavailable   → sobrecarga ou manutenção</code></pre>

        <div class="callout callout-purple">
          <strong>Bug clássico:</strong> API retorna 200 com <code>{"error": "not found"}</code> no body. Isso é um contrato quebrado — o status code deveria ser 404. Teste sempre o status code, não apenas o body.
        </div>

        <h2>Headers mais importantes para QA</h2>
        <pre><code class="language-text">// Request Headers
Content-Type: application/json       → formato do body enviado
Accept: application/json             → formato esperado na resposta
Authorization: Bearer {token}        → autenticação JWT
X-Api-Key: {chave}                   → autenticação por chave

// Response Headers
Content-Type: application/json       → formato do body retornado
X-RateLimit-Remaining: 42            → requisições restantes
Cache-Control: no-cache              → política de cache
Location: /api/users/99              → URL do recurso criado (201)</code></pre>
      ` },
      { type: 'write-exercise', id: 'qa-4-2-ex1',
        prompt: 'Uma API de login retorna status 200 quando as credenciais estão erradas, mas o body diz {"success": false, "message": "Invalid credentials"}. Descreva: qual é o problema, qual o impacto disso e como você reportaria esse bug?',
        placeholder: 'Sua análise aqui...' }
    ]
  },

  // ─── 4.3 ───────────────────────────────────────────────
  {
    module: 4, lesson: 3,
    title: 'Postman — Criando e Executando Requisições',
    tag: 'Ferramenta', duration: '28 min', xp: 130,
    sections: [
      { type: 'text', content: `
        <h2>Postman como ambiente de testes de API</h2>
        <p>O <strong>Postman</strong> é a ferramenta padrão de mercado para explorar, testar e documentar APIs. Como QA, você vai usá-lo para:</p>
        <ul>
          <li>Fazer requisições manualmente (exploração)</li>
          <li>Escrever testes automatizados por endpoint</li>
          <li>Organizar cenários em coleções</li>
          <li>Gerenciar ambientes (dev, staging, produção)</li>
          <li>Rodar suites completas via Newman (CLI)</li>
        </ul>

        <h2>Estrutura de uma coleção bem organizada</h2>
        <pre><code class="language-text">📁 API — Sistema de Usuários
  📁 Auth
    POST /auth/login              (caso feliz)
    POST /auth/login — senha errada
    POST /auth/login — sem body
    POST /auth/refresh-token
  📁 Usuários
    GET  /users                   (lista)
    GET  /users/:id               (existente)
    GET  /users/:id               (não existente → 404)
    POST /users                   (criar)
    POST /users — email duplicado → 409
    PUT  /users/:id
    DELETE /users/:id
  📁 Admin (requer role admin)
    GET /admin/users              (com permissão)
    GET /admin/users              (sem permissão → 403)</code></pre>

        <h2>Variáveis de ambiente</h2>
        <p>Nunca hardcode URLs ou tokens nos requests. Use variáveis:</p>
        <pre><code class="language-text">// Environment: DEV
BASE_URL = http://localhost:3000
TOKEN    = (vazio — preenchido pelo teste de login)

// Environment: STAGING
BASE_URL = https://staging.api.exemplo.com
TOKEN    = (vazio)

// Uso na requisição
URL: {{BASE_URL}}/api/users
Header: Authorization: Bearer {{TOKEN}}</code></pre>

        <h2>Scripts de teste no Postman</h2>
        <p>A aba <strong>Tests</strong> de cada request aceita JavaScript (Chai-style):</p>
        <pre><code class="language-javascript">// Valida status code
pm.test('Status 200', function () {
  pm.response.to.have.status(200);
});

// Valida que o body é JSON
pm.test('Response é JSON', function () {
  pm.response.to.be.json;
});

// Valida campos no body
pm.test('Retorna id e email', function () {
  var body = pm.response.json();
  pm.expect(body).to.have.property('id');
  pm.expect(body.email).to.be.a('string');
});

// Valida tempo de resposta
pm.test('Responde em menos de 500ms', function () {
  pm.expect(pm.response.responseTime).to.be.below(500);
});

// Salva token para próximos requests
var body = pm.response.json();
pm.environment.set('TOKEN', body.token);</code></pre>

        <h2>Script Pre-request</h2>
        <p>Executa antes da requisição — útil para preparar dados dinâmicos:</p>
        <pre><code class="language-javascript">// Gera email único para não violar unique constraint
var timestamp = new Date().getTime();
pm.environment.set('TEST_EMAIL', 'qa+' + timestamp + '@teste.com');</code></pre>

        <h2>Rodando coleções com Newman (CI/CD)</h2>
        <pre><code class="language-bash">npm install -g newman

newman run minha-colecao.json \
  --environment staging.json \
  --reporters cli,junit \
  --reporter-junit-export resultado.xml</code></pre>
        <div class="callout callout-cyan">
          <strong>Dica profissional:</strong> Exporte a coleção e o environment como JSON e versione no Git. Isso permite rodar os testes de API no pipeline de CI automaticamente.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-4-3-ex1',
        prompt: 'Você recebeu para testar uma API de e-commerce com endpoints de produto (CRUD) e carrinho (adicionar/remover itens). Desenhe a estrutura de coleção que você criaria no Postman, listando os endpoints e os cenários principais de cada um (não precisa escrever código, só a estrutura organizada).',
        placeholder: 'Estrutura da coleção aqui...' }
    ]
  },

  // ─── 4.4 ───────────────────────────────────────────────
  {
    module: 4, lesson: 4,
    title: 'Validando Response Body e Schema',
    tag: 'Técnica', duration: '25 min', xp: 120,
    sections: [
      { type: 'text', content: `
        <h2>O que validar no body da resposta</h2>
        <p>Um status 200 não significa que a API está correta. O body pode estar incompleto, com campos errados, tipos incorretos ou dados incoerentes. Valide sempre:</p>
        <ul>
          <li><strong>Campos obrigatórios presentes</strong></li>
          <li><strong>Tipos corretos</strong> (string, number, boolean, array, null)</li>
          <li><strong>Valores dentro do domínio esperado</strong> (ex: age > 0)</li>
          <li><strong>Campos que <em>não</em> deviam estar presentes</strong> (ex: password no body de usuário)</li>
          <li><strong>Datas no formato correto</strong> (ISO 8601: 2026-05-16T10:00:00Z)</li>
          <li><strong>Consistência com o que foi enviado</strong></li>
        </ul>

        <h2>Validação de Schema com Postman + Ajv</h2>
        <p>Schema validation garante que o contrato da API não quebrou — mesmo que você não saiba exatamente o valor retornado:</p>
        <pre><code class="language-javascript">// Schema esperado para o endpoint GET /users/:id
var schema = {
  type: 'object',
  required: ['id', 'name', 'email', 'createdAt'],
  properties: {
    id:        { type: 'integer' },
    name:      { type: 'string', minLength: 1 },
    email:     { type: 'string', format: 'email' },
    role:      { type: 'string', enum: ['user', 'admin', 'moderator'] },
    createdAt: { type: 'string' },
    password:  { not: {} }   // password NUNCA deve aparecer
  },
  additionalProperties: false   // nenhum campo extra permitido
};

pm.test('Schema correto', function () {
  var Ajv = require('ajv');
  var ajv = new Ajv({ allErrors: true });
  var valid = ajv.validate(schema, pm.response.json());
  pm.expect(valid, JSON.stringify(ajv.errors)).to.be.true;
});</code></pre>

        <h2>Validações de negócio no body</h2>
        <pre><code class="language-javascript">pm.test('Usuário criado com dados corretos', function () {
  var body = pm.response.json();
  var sent = JSON.parse(pm.request.body.raw);

  // dados enviados devem bater com os retornados
  pm.expect(body.name).to.eql(sent.name);
  pm.expect(body.email).to.eql(sent.email.toLowerCase());

  // id deve ser inteiro positivo
  pm.expect(body.id).to.be.a('number').and.above(0);

  // password nunca deve vazar
  pm.expect(body).to.not.have.property('password');
  pm.expect(body).to.not.have.property('passwordHash');
});

pm.test('createdAt é ISO 8601', function () {
  var body = pm.response.json();
  var date = new Date(body.createdAt);
  pm.expect(isNaN(date.getTime())).to.be.false;
});</code></pre>

        <h2>Testando listas (arrays)</h2>
        <pre><code class="language-javascript">pm.test('Lista de usuários tem formato correto', function () {
  var body = pm.response.json();

  // deve ser array
  pm.expect(body).to.be.an('array');

  // não pode estar vazio em ambiente de teste
  pm.expect(body.length).to.be.above(0);

  // cada item deve ter os campos mínimos
  body.forEach(function (user) {
    pm.expect(user).to.have.property('id');
    pm.expect(user).to.have.property('email');
    pm.expect(user).to.not.have.property('password');
  });
});</code></pre>

        <div class="callout callout-purple">
          <strong>Bug real:</strong> API de listagem expõe o campo <code>passwordHash</code> de todos os usuários. Passa em todos os testes funcionais porque o login funciona. Só é encontrado por quem valida o schema com rigor. Esse tipo de falha vaza dados sensíveis em produção.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-4-4-ex1',
        prompt: 'Um endpoint GET /products/:id retorna este body:\n\n{"id": 1, "name": "Camiseta", "price": "29.90", "stock": null, "internalCode": "SKU-XYZ", "supplierPassword": "abc123"}\n\nIdentifique todos os problemas nesse response e explique o impacto de cada um.',
        placeholder: 'Sua análise aqui...' }
    ]
  },

  // ─── 4.5 ───────────────────────────────────────────────
  {
    module: 4, lesson: 5,
    title: 'Autenticação em APIs',
    tag: 'Segurança', duration: '24 min', xp: 120,
    sections: [
      { type: 'text', content: `
        <h2>Por que autenticação é crítica para QA</h2>
        <p>Falhas de autenticação e autorização são as vulnerabilidades mais exploradas em APIs. Como QA, você deve testar não só o fluxo feliz (acesso autorizado) mas todos os cenários de acesso indevido.</p>

        <h2>Tipos de autenticação</h2>

        <h3>1. Bearer Token (JWT)</h3>
        <p>O mais comum em APIs modernas. O cliente faz login e recebe um token JWT que envia em todos os requests:</p>
        <pre><code class="language-text">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code></pre>
        <p>O JWT tem 3 partes separadas por ponto: <code>header.payload.signature</code>. O payload contém os dados do usuário (claims) e pode ser lido em base64 — mas nunca deve ser confiável sem verificar a assinatura.</p>

        <h3>2. API Key</h3>
        <pre><code class="language-text">// Via header
X-Api-Key: sk_live_AbCdEf123456

// Via query param (menos seguro — fica nos logs)
GET /api/data?api_key=sk_live_AbCdEf123456</code></pre>

        <h3>3. Basic Auth</h3>
        <pre><code class="language-text">// username:password em base64
Authorization: Basic cmFwaGFlbDpzZW5oYTEyMw==</code></pre>
        <p>Evitar em produção sem HTTPS — as credenciais são facilmente decodificadas.</p>

        <h3>4. OAuth 2.0</h3>
        <p>Fluxo mais complexo com authorization code, client credentials, etc. Comum em integrações com Google, GitHub, etc.</p>

        <h2>O que testar em autenticação</h2>
        <pre><code class="language-text">Cenários obrigatórios:

✅ Acesso com token válido           → 200 OK
❌ Sem token (sem header Auth)       → 401 Unauthorized
❌ Token inválido (string aleatória) → 401 Unauthorized
❌ Token expirado                    → 401 Unauthorized
❌ Token de outro usuário/ambiente   → 401 ou 403
❌ Token com role insuficiente       → 403 Forbidden</code></pre>

        <h2>Testando autorização (o que quem pode fazer)</h2>
        <pre><code class="language-javascript">// Teste: usuário comum não pode acessar rota de admin
pm.test('Usuário sem role admin recebe 403', function () {
  pm.response.to.have.status(403);
});

// Teste: usuário A não pode ver dados do usuário B
pm.test('Não expõe dados de outro usuário', function () {
  pm.response.to.have.status(403);
  var body = pm.response.json();
  pm.expect(body).to.not.have.property('email');
});</code></pre>

        <h2>Script Postman: login automático salva token</h2>
        <pre><code class="language-javascript">// POST /auth/login — Tests
pm.test('Login retorna token', function () {
  pm.response.to.have.status(200);
  var body = pm.response.json();
  pm.expect(body.token).to.be.a('string').and.not.empty;
  pm.environment.set('TOKEN', body.token);
});</code></pre>

        <div class="callout callout-cyan">
          <strong>Vulnerabilidade comum — IDOR:</strong> Insecure Direct Object Reference. O usuário de ID 5 faz GET /users/6 e consegue ver dados de outro usuário. Sempre teste se a API valida que o recurso pertence ao usuário autenticado.
        </div>

        <h2>Teste de expiração de token</h2>
        <pre><code class="language-javascript">// Se você tem acesso a um token expirado (salvo de sessão anterior):
pm.environment.set('TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAxfQ.assinatura');

// Verifica que a API rejeita
pm.test('Token expirado retorna 401', function () {
  pm.response.to.have.status(401);
});</code></pre>
      ` },
      { type: 'write-exercise', id: 'qa-4-5-ex1',
        prompt: 'Você está testando uma API de blog onde cada usuário só pode editar seus próprios posts. Descreva todos os cenários de teste de autorização que você cobriria, incluindo os cenários de tentativa de acesso indevido. Seja específico nos endpoints e nos resultados esperados.',
        placeholder: 'Seus cenários aqui...' }
    ]
  },

  // ─── 4.6 ───────────────────────────────────────────────
  {
    module: 4, lesson: 6,
    title: 'Testes Negativos e Cenários de Contrato',
    tag: 'Técnica', duration: '26 min', xp: 130,
    sections: [
      { type: 'text', content: `
        <h2>Por que testes negativos são críticos em APIs</h2>
        <p>A maioria dos QAs cobre o fluxo feliz. O sistema entra em produção e quebra no primeiro input inesperado. Testes negativos garantem que a API:</p>
        <ul>
          <li>Rejeita dados inválidos com respostas claras</li>
          <li>Não vaza informações em mensagens de erro</li>
          <li>Não explode com 500 quando deveria retornar 400</li>
          <li>Valida campos obrigatórios</li>
          <li>Resiste a payloads maliciosos</li>
        </ul>

        <h2>Categorias de testes negativos</h2>
        <pre><code class="language-text">1. CAMPOS OBRIGATÓRIOS AUSENTES
   POST /users sem "email"           → 400 + mensagem clara

2. TIPOS INCORRETOS
   POST /users com age: "vinte"      → 400 + erro de validação

3. VALORES FORA DO DOMÍNIO
   POST /users com age: -5           → 400
   POST /products com price: 0       → 400 ou regra de negócio

4. FORMATO INVÁLIDO
   POST /users com email: "isso não é email"  → 400
   POST /events com date: "amanhã"            → 400

5. TAMANHO FORA DO LIMITE
   POST /users com name: "A" * 1000           → 400 (max length)
   POST /users com name: ""                   → 400 (min length)

6. DUPLICIDADE
   POST /users com email já existente         → 409 Conflict

7. RECURSO INEXISTENTE
   GET /users/9999999                         → 404

8. BODY VAZIO
   POST /users com {} ou sem body            → 400

9. PAYLOAD MALFORMADO
   POST /users com JSON inválido             → 400

10. INJEÇÃO (básica)
    POST /users com name: "'; DROP TABLE users;--"  → 400 ou sanitizado</code></pre>

        <h2>O que validar na resposta de erro</h2>
        <pre><code class="language-javascript">// Valida estrutura de erro consistente
pm.test('Erro tem estrutura padronizada', function () {
  pm.response.to.have.status(400);
  var body = pm.response.json();

  // deve ter um campo de mensagem de erro
  pm.expect(body).to.have.any.keys(['error', 'message', 'errors']);

  // NÃO deve expor stack trace
  pm.expect(JSON.stringify(body)).to.not.include('at Object.');
  pm.expect(JSON.stringify(body)).to.not.include('node_modules');

  // NÃO deve expor detalhes de banco
  pm.expect(JSON.stringify(body)).to.not.include('SQL');
  pm.expect(JSON.stringify(body)).to.not.include('column');
});</code></pre>

        <h2>Testes de contrato</h2>
        <p>Contrato de API = o que o produtor promete entregar ao consumidor. Quando o back-end muda um campo sem avisar o front-end, isso é uma quebra de contrato. Testes de contrato detectam isso antes do deploy.</p>

        <pre><code class="language-javascript">// Consumer-driven contract test
// O front-end define o que precisa; o teste verifica se a API entrega

var contrato = {
  camposObrigatorios: ['id', 'name', 'email', 'avatar', 'plan'],
  tipos: {
    id:     'number',
    name:   'string',
    email:  'string',
    plan:   'string'
  },
  valoresPossiveis: {
    plan: ['free', 'pro', 'enterprise']
  }
};

pm.test('API honra o contrato do front-end', function () {
  var body = pm.response.json();

  contrato.camposObrigatorios.forEach(function (campo) {
    pm.expect(body, 'Campo ausente: ' + campo).to.have.property(campo);
  });

  Object.keys(contrato.tipos).forEach(function (campo) {
    if (body[campo] !== undefined) {
      pm.expect(typeof body[campo], 'Tipo errado: ' + campo)
        .to.equal(contrato.tipos[campo]);
    }
  });

  if (body.plan) {
    pm.expect(contrato.valoresPossiveis.plan).to.include(body.plan);
  }
});</code></pre>

        <div class="callout callout-purple">
          <strong>Sinal de API mal implementada:</strong> Qualquer input inválido retorna 500. Isso indica que o servidor não valida entradas e expõe exceções não tratadas. Reporte com severidade Alta — é risco de segurança e estabilidade.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-4-6-ex1',
        prompt: 'Para o endpoint POST /orders (criar pedido), com campos: userId (obrigatório, inteiro), items (obrigatório, array de objetos com productId e quantity), deliveryDate (opcional, string ISO 8601) — escreva 10 cenários de teste negativos, especificando o input e o resultado esperado para cada um.',
        placeholder: 'Seus cenários aqui...' }
    ]
  },

  // ─── 4.7 ───────────────────────────────────────────────
  {
    module: 4, lesson: 7,
    title: 'Projeto — Suite de Testes de API',
    tag: 'Projeto', duration: '40 min', xp: 200,
    sections: [
      { type: 'text', content: `
        <h2>Objetivo do projeto</h2>
        <p>Você vai estruturar uma suite completa de testes para a API pública <strong>JSONPlaceholder</strong> (<code>https://jsonplaceholder.typicode.com</code>) — uma API de prática gratuita com endpoints de posts, usuários, comentários e outros.</p>
        <p>Este projeto simula o trabalho real de um QA que recebe uma API para testar do zero e precisa entregar uma suite organizada, com cobertura funcional e de contrato.</p>

        <h2>API alvo — endpoints disponíveis</h2>
        <pre><code class="language-text">GET    /posts              lista posts
GET    /posts/:id          post por id
POST   /posts              cria post (fake — retorna id 101)
PUT    /posts/:id          atualiza post (fake)
DELETE /posts/:id          deleta (fake — retorna {})
GET    /posts/:id/comments comentários do post
GET    /users              lista usuários
GET    /users/:id          usuário por id</code></pre>

        <h2>Estrutura da suite</h2>
        <pre><code class="language-text">📁 JSONPlaceholder — Suite QA
  📁 Posts
    📁 GET /posts
      ✅ Lista posts com sucesso (200)
      ✅ Retorna array não vazio
      ✅ Schema de cada post (id, title, body, userId)
    📁 GET /posts/:id
      ✅ Post existente (200)
      ✅ Schema correto
      ❌ Post inexistente → 404
    📁 POST /posts
      ✅ Cria post com todos campos (201)
      ✅ Retorna id no body
      ❌ Sem título → validação
    📁 PUT /posts/:id
      ✅ Atualiza post existente (200)
    📁 DELETE /posts/:id
      ✅ Deleta post (200)
  📁 Usuários
    📁 GET /users
      ✅ Lista usuários (200)
      ✅ Schema de usuário (id, name, email, address)
    📁 GET /users/:id
      ✅ Usuário existente
      ❌ Usuário inexistente → 404
  📁 Comentários
    ✅ GET /posts/:id/comments
    ✅ Cada comentário tem postId, email, body</code></pre>

        <h2>Implementação dos testes principais</h2>
        <pre><code class="language-javascript">// ─── GET /posts — Tests ───────────────────────────────
pm.test('Status 200', () => pm.response.to.have.status(200));

pm.test('Retorna array de posts', function () {
  var body = pm.response.json();
  pm.expect(body).to.be.an('array').and.not.empty;
});

pm.test('Schema de post correto', function () {
  var posts = pm.response.json();
  posts.slice(0, 5).forEach(function (post) {
    pm.expect(post).to.have.all.keys('id', 'title', 'body', 'userId');
    pm.expect(post.id).to.be.a('number');
    pm.expect(post.title).to.be.a('string').and.not.empty;
    pm.expect(post.userId).to.be.a('number');
  });
});

pm.test('Responde em menos de 1s', function () {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});

// ─── GET /posts/:id — Não existente ────────────────────
pm.test('Status 404 para post inexistente', function () {
  pm.response.to.have.status(404);
});

// ─── POST /posts ────────────────────────────────────────
pm.test('Post criado com status 201', function () {
  pm.response.to.have.status(201);
});

pm.test('Resposta contém id gerado', function () {
  var body = pm.response.json();
  pm.expect(body).to.have.property('id');
  pm.expect(body.id).to.be.a('number').and.above(0);
  pm.environment.set('CREATED_POST_ID', body.id);
});</code></pre>

        <h2>Relatório de cobertura</h2>
        <p>Ao final da suite, você deve ser capaz de responder:</p>
        <ul>
          <li>Quantos endpoints foram testados?</li>
          <li>Qual a cobertura de cenários negativos?</li>
          <li>Todos os schemas foram validados?</li>
          <li>Existe monitoramento de performance (tempo de resposta)?</li>
          <li>A suite é reproduzível em qualquer ambiente?</li>
        </ul>

        <div class="callout callout-cyan">
          <strong>Entrega profissional:</strong> Exporte a coleção como JSON, versione no Git e documente no README: como instalar o Newman, como rodar a suite e o que cada pasta testa. Isso é o que um QA entrega para um time de verdade.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-4-7-ex1',
        prompt: 'Escreva um plano de teste resumido para a suite do projeto: liste os módulos, os tipos de cenário cobertos (positivos, negativos, contrato, performance), a estratégia de dados de teste e como você garantiria que a suite pode rodar em CI/CD. Seja objetivo e direto — como um QA entregaria para um tech lead.',
        placeholder: 'Seu plano aqui...' }
    ]
  }

];
