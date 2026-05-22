// Sentinel Learning — Playwright para QA
// window.SL_PLAYWRIGHT

(function () {
  'use strict';

  var COURSE = {
    id: 'playwright-qa',
    slug: 'playwright-qa',
    title: 'Playwright para QA',
    subtitle: 'Automação E2E com Playwright + TypeScript',
    description: 'Page Object Model, fixtures, relatórios, CI/CD integration. Do primeiro test à suite completa em produção.',
    category: 'Automação',
    level: 'Intermediário',
    estimatedHours: 35,
    totalModules: 6,
    totalLessons: 30,
    status: 'available',
    tags: ['playwright', 'typescript', 'automation', 'e2e'],
    storageKey: null,

    getLessonContent: function (moduleNum, lessonIndex) {
      var mod = COURSE.modules[moduleNum - 1];
      if (!mod || !mod.lessons) return null;
      return mod.lessons[lessonIndex] || null;
    },

    modules: [
      {
        id: 'M1',
        title: 'Intro ao Playwright',
        description: 'Instalação, configuração e primeiro teste com Playwright.',
        status: 'available',
        lessons: [
          {
            id: 'pw.1.1', title: 'O que é Playwright?', description: 'Visão geral e comparação com Selenium e Cypress.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O que é Playwright?' },
              { type: 'p', html: '<strong>Playwright</strong> é uma biblioteca de automação de browser criada pela Microsoft. Ela permite escrever testes E2E (end-to-end) em JavaScript, TypeScript, Python, Java ou C# que rodam nos três principais browsers: <strong>Chromium, Firefox e WebKit</strong> — com uma única API.' },
              { type: 'h2', text: 'Por que Playwright e não Selenium?' },
              { type: 'p', html: 'Selenium foi a ferramenta padrão por 15 anos, mas exige drivers separados por browser e tem auto-espera limitada. <strong>Playwright resolve esses problemas</strong> nativamente: instala os browsers, tem auto-wait embutido e API moderna.' },
              { type: 'callout', html: '<strong>Comparativo rápido:</strong><br>• Playwright — multi-browser nativo, async/await, auto-wait, trace viewer<br>• Cypress — apenas Chromium (sem Firefox real), excelente DX mas menos flexível<br>• Selenium — legado, mais burocrático, mas suporte universal' },
              { type: 'h2', text: 'O que você consegue testar com Playwright?' },
              { type: 'p', html: 'Qualquer coisa que um usuário faz em um browser: <strong>cliques, formulários, uploads, downloads, modais, iframes, múltiplas abas</strong> e até chamadas de rede. Playwright também tem uma API para testes de API REST direto — sem browser.' },
            ]
          },
          {
            id: 'pw.1.2', title: 'Instalação e setup', description: 'Configurar o ambiente com Node.js e Playwright.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Instalando o Playwright' },
              { type: 'p', html: 'Você precisa de <strong>Node.js 18+</strong>. Com ele instalado, crie um projeto e rode o setup interativo:' },
              { type: 'code', lang: 'bash', raw: '# Criar pasta do projeto\nmkdir meus-testes && cd meus-testes\n\n# Setup interativo do Playwright\nnpm init playwright@latest\n\n# O wizard vai perguntar:\n# - TypeScript ou JavaScript? → TypeScript\n# - Pasta dos testes? → tests/\n# - Adicionar GitHub Actions? → y\n# - Instalar browsers? → y' },
              { type: 'h2', text: 'O que foi criado?' },
              { type: 'p', html: 'O setup cria: <code>playwright.config.ts</code> (configuração global), <code>tests/</code> (seus testes), <code>tests-examples/</code> (exemplos para aprender) e <code>.github/workflows/playwright.yml</code> (CI).' },
              { type: 'callout', html: '<strong>Browsers instalados localmente:</strong> Playwright baixa versões controladas do Chromium, Firefox e WebKit em <code>~/.cache/ms-playwright/</code>. São isolados do seu browser do sistema.' },
              { type: 'exercise', title: 'Verificando a instalação', desc: 'Execute os testes de exemplo para confirmar que tudo funciona.', steps: ['Abra o terminal na pasta do projeto', 'Rode: npx playwright test', 'Abra o relatório: npx playwright show-report', 'Veja os testes passando no relatório HTML'], starterCode: 'npx playwright test\nnpx playwright show-report', solution: '# Deve aparecer: X passed\n# O relatório abre no browser automaticamente' },
            ]
          },
          {
            id: 'pw.1.3', title: 'Primeiro teste', description: 'Escrever e executar o primeiro teste automatizado.', duration: '15 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Anatomia de um teste Playwright' },
              { type: 'p', html: 'Todo teste usa <code>test()</code> para declarar o caso e recebe <code>page</code> — o objeto que representa o browser.' },
              { type: 'code', lang: 'TypeScript', raw: 'import { test, expect } from \'@playwright/test\';\n\ntest(\'página de login carrega corretamente\', async ({ page }) => {\n  // 1. Navegar para a URL\n  await page.goto(\'https://example.com/login\');\n\n  // 2. Verificar que o título está correto\n  await expect(page).toHaveTitle(/Login/);\n\n  // 3. Verificar que o campo email existe\n  await expect(page.getByLabel(\'Email\')).toBeVisible();\n\n  // 4. Verificar que o botão existe\n  await expect(page.getByRole(\'button\', { name: \'Entrar\' })).toBeEnabled();\n});' },
              { type: 'h2', text: 'O trio essencial: goto, locator, expect' },
              { type: 'p', html: '<strong>page.goto(url)</strong> — navega para a página. <strong>page.locator()</strong> ou getBy*() — localiza elementos. <strong>expect(locator)</strong> — faz assertions. Esses três cobrem 80% dos seus testes.' },
              { type: 'callout', html: '<strong>Auto-wait:</strong> Playwright espera automaticamente que o elemento esteja visível e estável antes de interagir. Você raramente precisa de <code>sleep()</code> ou <code>waitFor()</code> explícitos.' },
              { type: 'exercise', title: 'Seu primeiro teste real', desc: 'Escreva um teste para o site playwright.dev', steps: ['Crie o arquivo tests/meu-primeiro.spec.ts', 'Use page.goto() para ir a playwright.dev', 'Verifique que o título contém "Playwright"', 'Verifique que existe um link "Get started" na página', 'Execute: npx playwright test meu-primeiro.spec.ts'], starterCode: 'import { test, expect } from \'@playwright/test\';\n\ntest(\'playwright.dev carrega\', async ({ page }) => {\n  await page.goto(\'https://playwright.dev\');\n  // TODO: adicionar assertions\n});', solution: 'import { test, expect } from \'@playwright/test\';\n\ntest(\'playwright.dev carrega\', async ({ page }) => {\n  await page.goto(\'https://playwright.dev\');\n  await expect(page).toHaveTitle(/Playwright/);\n  await expect(page.getByRole(\'link\', { name: \'Get started\' })).toBeVisible();\n});' },
            ]
          },
          {
            id: 'pw.1.4', title: 'Estrutura do projeto', description: 'Organizar arquivos, configuração e boas práticas iniciais.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Estrutura recomendada de projeto' },
              { type: 'code', lang: 'text', raw: 'meu-projeto/\n├── playwright.config.ts    ← configuração global\n├── tests/\n│   ├── login.spec.ts       ← testes por funcionalidade\n│   ├── checkout.spec.ts\n│   └── dashboard.spec.ts\n├── pages/\n│   ├── LoginPage.ts        ← Page Objects\n│   └── DashboardPage.ts\n├── fixtures/\n│   └── auth.ts             ← fixtures customizados\n└── utils/\n    └── helpers.ts          ← funções utilitárias' },
              { type: 'h2', text: 'O playwright.config.ts' },
              { type: 'p', html: 'A config central controla browsers, base URL, timeouts, paralelismo e muito mais. Veja as opções mais importantes:' },
              { type: 'code', lang: 'TypeScript', raw: 'import { defineConfig, devices } from \'@playwright/test\';\n\nexport default defineConfig({\n  testDir: \'./tests\',\n  timeout: 30_000,          // timeout por teste\n  expect: { timeout: 5000 },// timeout das assertions\n  fullyParallel: true,      // rodar testes em paralelo\n  retries: process.env.CI ? 2 : 0, // retry no CI\n  reporter: \'html\',\n  use: {\n    baseURL: \'http://localhost:3000\',\n    screenshot: \'only-on-failure\',\n    video: \'on-first-retry\',\n  },\n  projects: [\n    { name: \'chromium\', use: { ...devices[\'Desktop Chrome\'] } },\n    { name: \'firefox\',  use: { ...devices[\'Desktop Firefox\'] } },\n    { name: \'webkit\',   use: { ...devices[\'Desktop Safari\'] } },\n  ],\n});' },
              { type: 'callout', html: '<strong>baseURL:</strong> configure <code>baseURL</code> e use apenas <code>page.goto(\'/login\')</code> nos testes. Quando mudar de ambiente, você troca em um só lugar.' },
            ]
          },
          {
            id: 'pw.1.5', title: 'Executando e depurando', description: 'Rodar testes, trace viewer e depurar falhas.', duration: '14 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Comandos essenciais da CLI' },
              { type: 'code', lang: 'bash', raw: '# Rodar todos os testes\nnpx playwright test\n\n# Rodar um arquivo específico\nnpx playwright test login.spec.ts\n\n# Rodar em modo headed (ver o browser)\nnpx playwright test --headed\n\n# Rodar no Playwright UI (interativo)\nnpx playwright test --ui\n\n# Rodar com debug (pausa em cada passo)\nnpx playwright test --debug\n\n# Gerar código gravando ações do usuário\nnpx playwright codegen http://localhost:3000' },
              { type: 'h2', text: 'O Trace Viewer — debug visual' },
              { type: 'p', html: 'Quando um teste falha, o trace viewer mostra o <strong>screenshot de cada ação</strong>, as network calls, o DOM e os logs do console. É o melhor debug tool de automação que existe.' },
              { type: 'code', lang: 'TypeScript', raw: '// Ativar trace na config:\nuse: {\n  trace: \'on-first-retry\',  // grava no primeiro retry\n  // trace: \'on\'            // sempre grava (mais lento)\n}\n\n// Ver o trace após uma falha:\nnpx playwright show-trace trace.zip' },
              { type: 'callout', html: '<strong>Playwright UI Mode</strong>: rode <code>npx playwright test --ui</code> para uma interface visual que mostra testes em tempo real, permite re-rodar casos individuais e ver o trace sem falha.' },
            ]
          },
        ]
      },

      {
        id: 'M2',
        title: 'Seletores e Locators',
        description: 'Dominar a arte de localizar elementos com precisão e resiliência.',
        status: 'available',
        lessons: [
          {
            id: 'pw.2.1', title: 'Tipos de seletores', description: 'CSS, XPath, text e os locators do Playwright.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O problema dos seletores frágeis' },
              { type: 'p', html: 'Um seletor frágil quebra toda vez que o dev muda o CSS ou a estrutura HTML. <strong>A prioridade é: semântico > texto > CSS > XPath</strong>. Seletores baseados em role e texto refletem o que o usuário vê, não implementação interna.' },
              { type: 'h2', text: 'Os métodos getBy* do Playwright' },
              { type: 'code', lang: 'TypeScript', raw: '// ✅ Prioridade 1 — por role semântico (mais robusto)\npage.getByRole(\'button\', { name: \'Entrar\' })\npage.getByRole(\'textbox\', { name: \'Email\' })\npage.getByRole(\'link\', { name: \'Início\' })\n\n// ✅ Prioridade 2 — por label de formulário\npage.getByLabel(\'Senha\')\n\n// ✅ Prioridade 3 — por placeholder\npage.getByPlaceholder(\'Digite seu email\')\n\n// ✅ Prioridade 4 — por texto visível\npage.getByText(\'Bem-vindo, Raphael\')\n\n// ⚠️  Prioridade 5 — por test id (só quando necessário)\npage.getByTestId(\'submit-btn\')\n\n// ❌ Evitar — CSS com classes geradas\npage.locator(\'.css-1x2y3z button\')' },
              { type: 'callout', html: '<strong>Adicione data-testid</strong> nos elementos críticos do sistema que você testa. É um contrato explícito entre dev e QA: <code>&lt;button data-testid="submit-btn"&gt;</code>' },
            ]
          },
          {
            id: 'pw.2.2', title: 'getByRole e semântica', description: 'Preferir seletores baseados em acessibilidade.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Por que usar getByRole?' },
              { type: 'p', html: '<code>getByRole</code> usa a <strong>Accessibility Tree</strong> do browser — a mesma que leitores de tela usam. Isso significa que seu teste também valida acessibilidade. Se o elemento não tem role correto, o teste falha.' },
              { type: 'code', lang: 'TypeScript', raw: '// Roles mais comuns:\npage.getByRole(\'button\')          // <button>\npage.getByRole(\'link\')            // <a>\npage.getByRole(\'textbox\')         // <input type="text">\npage.getByRole(\'checkbox\')\npage.getByRole(\'combobox\')        // <select>\npage.getByRole(\'heading\', { level: 1 })  // <h1>\npage.getByRole(\'dialog\')          // modal/dialog\npage.getByRole(\'list\')\npage.getByRole(\'listitem\')\npage.getByRole(\'navigation\')\npage.getByRole(\'main\')\n\n// Com name (texto ou aria-label):\npage.getByRole(\'button\', { name: \'Confirmar pedido\' })' },
              { type: 'callout', html: '<strong>Dica:</strong> quando o <code>getByRole</code> não encontra o elemento, é um sinal de que o elemento pode ter acessibilidade ruim. Isso é informação valiosa para reportar para o time.' },
            ]
          },
          {
            id: 'pw.2.3', title: 'getByText e getByLabel', description: 'Localizar por conteúdo de texto e rótulos.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'getByText — localizar por texto visível' },
              { type: 'code', lang: 'TypeScript', raw: '// Texto exato\npage.getByText(\'Carrinho vazio\')\n\n// Substring (partial match)\npage.getByText(\'Bem-vindo\', { exact: false })\n\n// Regex — útil para textos dinâmicos\npage.getByText(/Olá, \\w+/)          // "Olá, Raphael", "Olá, Ana"...\npage.getByText(/R\\$\\s*\\d+,\\d{2}/)  // valores monetários\n\n// ❌ Cuidado: getByText encontra qualquer elemento com esse texto\n// Se há múltiplos, use .first() ou seja mais específico:' },
              { type: 'h2', text: 'getByLabel — a forma certa de pegar campos' },
              { type: 'code', lang: 'TypeScript', raw: '// Formulário HTML:\n// <label for="email">Email</label>\n// <input id="email" type="email">\n\n// Playwright associa label → input automaticamente:\nconst emailInput = page.getByLabel(\'Email\');\nawait emailInput.fill(\'user@test.com\');\nawait expect(emailInput).toHaveValue(\'user@test.com\');\n\n// aria-label também funciona:\n// <input aria-label="Campo de busca">\npage.getByLabel(\'Campo de busca\')' },
              { type: 'callout', html: '<strong>Formulários sem label são um problema:</strong> se o dev não colocou <code>&lt;label&gt;</code>, <code>getByLabel</code> não vai funcionar — e usuários de leitor de tela também não conseguem usar o campo. Reporte isso como um bug de acessibilidade.' },
            ]
          },
          {
            id: 'pw.2.4', title: 'Locators encadeados', description: 'Compor locators para elementos aninhados e listas.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Escopo com .locator() encadeado' },
              { type: 'p', html: 'Quando há múltiplos elementos similares na página (como uma lista de produtos), use encadeamento para escopo o locator a uma seção específica.' },
              { type: 'code', lang: 'TypeScript', raw: '// Múltiplos cards na página:\n// <div class="product-card">...</div> × 10\n\n// ❌ Frágil — pega o primeiro sem contexto\npage.getByRole(\'button\', { name: \'Adicionar\' })\n\n// ✅ Escopo no card específico:\nconst produtoCard = page.locator(\'.product-card\')\n  .filter({ hasText: \'Camiseta Azul\' });\nawait produtoCard.getByRole(\'button\', { name: \'Adicionar\' }).click();\n\n// .filter() — filtrar por texto ou por locator filho:\nconst itemNoCarrinho = page.locator(\'.cart-item\')\n  .filter({ has: page.getByRole(\'img\', { name: \'Camiseta Azul\' }) });\nawait expect(itemNoCarrinho).toBeVisible();\n\n// .nth() — pegar pelo índice:\nconst primeiroItem = page.locator(\'.product-card\').nth(0);\nconst ultimoItem   = page.locator(\'.product-card\').last();' },
              { type: 'callout', html: '<strong>.filter() é poderoso:</strong> use <code>{ hasText }</code> para filtrar por texto e <code>{ has }</code> para filtrar pelo conteúdo de um locator filho. É mais explícito e robusto do que <code>.nth()</code>.' },
            ]
          },
          {
            id: 'pw.2.5', title: 'Assertions com expect()', description: 'Web-first assertions do Playwright.', duration: '14 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Web-first assertions — o que isso significa?' },
              { type: 'p', html: 'Assertions no Playwright são <strong>web-first</strong>: elas esperam automaticamente até que a condição seja verdadeira (por padrão, até 5 segundos). Você nunca precisa adicionar <code>await page.waitForSelector()</code> antes de um expect.' },
              { type: 'code', lang: 'TypeScript', raw: '// Visibilidade\nawait expect(page.getByRole(\'dialog\')).toBeVisible();\nawait expect(page.getByText(\'Carregando\')).toBeHidden();\n\n// Texto e valor\nawait expect(page.getByRole(\'heading\')).toHaveText(\'Checkout\');\nawait expect(page.getByLabel(\'Email\')).toHaveValue(\'user@test.com\');\nawait expect(page.getByText(/Total/)).toContainText(\'R$ 99\');\n\n// URL e título\nawait expect(page).toHaveURL(/\\/dashboard/);\nawait expect(page).toHaveTitle(/Sentinel Learning/);\n\n// Estado do elemento\nawait expect(page.getByRole(\'button\', { name: \'Enviar\' })).toBeEnabled();\nawait expect(page.getByRole(\'checkbox\')).toBeChecked();\n\n// Count\nawait expect(page.locator(\'.product-card\')).toHaveCount(12);\n\n// Negação com .not:\nawait expect(page.getByRole(\'alert\')).not.toBeVisible();' },
              { type: 'callout', html: '<strong>Customize o timeout:</strong> <code>await expect(locator).toBeVisible({ timeout: 10000 })</code> — use timeouts maiores apenas quando a operação é genuinamente lenta (ex: upload de arquivo). Não mascare problemas de performance.' },
            ]
          },
        ]
      },

      {
        id: 'M3',
        title: 'Page Object Model',
        description: 'Estruturar testes com o padrão POM para máxima reutilização.',
        status: 'available',
        lessons: [
          {
            id: 'pw.3.1', title: 'Por que usar POM?', description: 'O problema de manutenção sem POM.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O problema sem POM' },
              { type: 'p', html: 'Imagine 20 testes que todos fazem login. Cada um tem <code>page.fill(\'#email\', ...)</code> e <code>page.click(\'.login-btn\')</code>. Quando o seletor muda, você atualiza em 20 lugares. Com POM, atualiza em 1.' },
              { type: 'code', lang: 'TypeScript', raw: '// ❌ Sem POM — duplicação em todo lugar:\ntest(\'compra produto\', async ({ page }) => {\n  await page.goto(\'/login\');\n  await page.fill(\'#email\', \'user@test.com\');  // duplicado\n  await page.fill(\'#password\', \'senha123\');    // duplicado\n  await page.click(\'.login-btn\');              // duplicado\n  // ... lógica real do teste\n});\n\n// ✅ Com POM — limpo, DRY, maintainável:\ntest(\'compra produto\', async ({ page }) => {\n  const login = new LoginPage(page);\n  await login.goto();\n  await login.login(\'user@test.com\', \'senha123\');\n  // ... lógica real do teste\n});' },
              { type: 'callout', html: '<strong>POM é sobre encapsulamento:</strong> a Page Object esconde os detalhes de implementação (seletores, URLs) e expõe apenas ações de alto nível. Os testes descrevem O QUÊ fazer, a Page Object sabe COMO fazer.' },
            ]
          },
          {
            id: 'pw.3.2', title: 'Criando sua primeira Page Object', description: 'Modelar a página de login como uma classe TypeScript.', duration: '15 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Estrutura básica de uma Page Object' },
              { type: 'code', lang: 'TypeScript', raw: '// pages/LoginPage.ts\nimport { Page, Locator } from \'@playwright/test\';\n\nexport class LoginPage {\n  readonly page: Page;\n\n  // 1. Definir locators como propriedades\n  readonly emailInput:    Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton:  Locator;\n  readonly errorMessage:  Locator;\n\n  constructor(page: Page) {\n    this.page           = page;\n    this.emailInput     = page.getByLabel(\'Email\');\n    this.passwordInput  = page.getByLabel(\'Senha\');\n    this.submitButton   = page.getByRole(\'button\', { name: \'Entrar\' });\n    this.errorMessage   = page.getByRole(\'alert\');\n  }\n\n  // 2. Definir ações como métodos\n  async goto() {\n    await this.page.goto(\'/login\');\n  }\n\n  async login(email: string, password: string) {\n    await this.emailInput.fill(email);\n    await this.passwordInput.fill(password);\n    await this.submitButton.click();\n  }\n\n  async getErrorText() {\n    return this.errorMessage.textContent();\n  }\n}' },
              { type: 'h2', text: 'Usando a Page Object no teste' },
              { type: 'code', lang: 'TypeScript', raw: '// tests/login.spec.ts\nimport { test, expect } from \'@playwright/test\';\nimport { LoginPage } from \'../pages/LoginPage\';\n\ntest(\'login com credenciais válidas\', async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.goto();\n  await loginPage.login(\'user@test.com\', \'senha123\');\n  await expect(page).toHaveURL(/\\/dashboard/);\n});\n\ntest(\'login com senha errada\', async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.goto();\n  await loginPage.login(\'user@test.com\', \'senhaerrada\');\n  await expect(page.getByRole(\'alert\')).toContainText(\'Credenciais inválidas\');\n});' },
            ]
          },
          {
            id: 'pw.3.3', title: 'Componentes reutilizáveis', description: 'Extrair Header, Nav e outros componentes em classes.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Componentes vs Pages' },
              { type: 'p', html: 'Um Header que aparece em 10 páginas não precisa ser reescrito em 10 Page Objects. Crie uma classe de componente e <strong>compose-a</strong> nas pages que precisam.' },
              { type: 'code', lang: 'TypeScript', raw: '// pages/components/Header.ts\nimport { Page, Locator } from \'@playwright/test\';\n\nexport class Header {\n  readonly userMenu:   Locator;\n  readonly cartBadge:  Locator;\n  readonly searchBar:  Locator;\n\n  constructor(page: Page) {\n    this.userMenu  = page.getByRole(\'button\', { name: /menu do usuário/i });\n    this.cartBadge = page.getByTestId(\'cart-badge\');\n    this.searchBar = page.getByRole(\'searchbox\');\n  }\n\n  async openUserMenu() {\n    await this.userMenu.click();\n  }\n\n  async getCartCount() {\n    return parseInt(await this.cartBadge.textContent() || \'0\', 10);\n  }\n}\n\n// pages/DashboardPage.ts\nimport { Header } from \'./components/Header\';\n\nexport class DashboardPage {\n  readonly header: Header;  // ← composição\n\n  constructor(page: Page) {\n    this.header = new Header(page);\n    // ...\n  }\n}' },
              { type: 'callout', html: '<strong>Regra prática:</strong> se o mesmo conjunto de locators/ações aparece em mais de 2 Page Objects, crie um componente. Componentes representam partes da UI, não páginas completas.' },
            ]
          },
          {
            id: 'pw.3.4', title: 'Herança e composição', description: 'BasePage e hierarquia de classes.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'BasePage — comportamento compartilhado' },
              { type: 'p', html: 'Uma <code>BasePage</code> centraliza lógica comum: navegar para a URL, verificar se a página carregou, métodos de utilidade.' },
              { type: 'code', lang: 'TypeScript', raw: '// pages/BasePage.ts\nimport { Page } from \'@playwright/test\';\n\nexport abstract class BasePage {\n  constructor(protected page: Page) {}\n\n  // Método obrigatório em cada page\n  abstract goto(): Promise<void>;\n\n  // Utilitários comuns\n  async waitForLoad() {\n    await this.page.waitForLoadState(\'networkidle\');\n  }\n\n  async takeScreenshot(name: string) {\n    await this.page.screenshot({ path: `screenshots/${name}.png` });\n  }\n}\n\n// pages/LoginPage.ts\nimport { BasePage } from \'./BasePage\';\n\nexport class LoginPage extends BasePage {\n  async goto() {\n    await this.page.goto(\'/login\');\n    await this.waitForLoad();  // herda da BasePage\n  }\n}' },
              { type: 'callout', html: '<strong>Herança vs Composição:</strong> use herança para comportamento que TODA page deve ter (BasePage). Use composição para partes da UI reutilizáveis (Header, Footer). Não force herança onde composição é mais natural.' },
            ]
          },
          {
            id: 'pw.3.5', title: 'Projeto prático: e-commerce', description: 'Implementar POM completo para um fluxo de compra.', duration: '20 min', xp: 100, type: 'project', status: 'available',
            sections: [
              { type: 'h2', text: 'Projeto: Suite de testes para e-commerce' },
              { type: 'p', html: 'Você vai criar um projeto Playwright com POM completo para testar um e-commerce. O objetivo é cobrir o fluxo: busca → produto → carrinho → checkout.' },
              { type: 'code', lang: 'text', raw: 'Estrutura a criar:\npages/\n├── BasePage.ts\n├── HomePage.ts        ← busca de produtos\n├── ProductPage.ts     ← detalhes + adicionar ao carrinho\n├── CartPage.ts        ← visualizar e editar carrinho\n└── CheckoutPage.ts    ← formulário de pagamento\n\ntests/\n├── checkout.spec.ts   ← fluxo completo E2E\n└── cart.spec.ts       ← testes específicos do carrinho' },
              { type: 'exercise', title: 'Construindo o POM', desc: 'Implemente as Page Objects e testes para o site demo: https://playwright.dev/docs/intro', steps: ['Crie BasePage.ts com goto() abstrato e waitForLoad()', 'Crie ProductPage.ts com locators para título, preço e botão "Adicionar"', 'Escreva um teste: buscar produto → adicionar → verificar no carrinho', 'Garanta que os seletores não usam classes CSS geradas', 'Execute e valide que os testes passam em Chromium e Firefox'], starterCode: '// pages/ProductPage.ts\nimport { BasePage } from \'./BasePage\';\n\nexport class ProductPage extends BasePage {\n  async goto(productSlug: string) {\n    await this.page.goto(`/products/${productSlug}`);\n  }\n\n  // TODO: adicionar locators e métodos\n}', solution: '// Veja a solução completa na pasta examples/ do projeto' },
            ]
          },
        ]
      },

      {
        id: 'M4',
        title: 'Fixtures e Setup',
        description: 'Configurar estado compartilhado, fixtures e dados de teste.',
        status: 'available',
        lessons: [
          {
            id: 'pw.4.1', title: 'beforeAll e beforeEach', description: 'Configurar estado antes dos testes.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Hooks de ciclo de vida' },
              { type: 'code', lang: 'TypeScript', raw: 'import { test, expect } from \'@playwright/test\';\nimport { LoginPage } from \'../pages/LoginPage\';\n\n// beforeAll — roda UMA VEZ antes de todos os testes do arquivo\ntest.beforeAll(async ({ browser }) => {\n  // Criar contexto compartilhado (ex: auth state)\n  console.log(\'Setup inicial do arquivo de testes\');\n});\n\n// beforeEach — roda ANTES de CADA teste\ntest.beforeEach(async ({ page }) => {\n  const login = new LoginPage(page);\n  await login.goto();\n  await login.login(\'user@test.com\', \'senha123\');\n  // Agora cada teste começa já logado\n});\n\n// afterEach — cleanup após cada teste\ntest.afterEach(async ({ page }, testInfo) => {\n  if (testInfo.status !== \'passed\') {\n    await page.screenshot({ path: `screenshots/fail-${testInfo.title}.png` });\n  }\n});\n\ntest(\'ver dashboard\', async ({ page }) => {\n  await expect(page).toHaveURL(/\\/dashboard/);  // já logado\n});' },
              { type: 'callout', html: '<strong>Cuidado com beforeAll compartilhado:</strong> quando testes em <code>beforeAll</code> compartilham estado, podem criar dependências entre testes. Prefira <code>beforeEach</code> para manter testes isolados e a suite rodando em qualquer ordem.' },
            ]
          },
          {
            id: 'pw.4.2', title: 'Fixtures do Playwright', description: 'Built-in fixtures: page, browser, context, request.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O que são fixtures?' },
              { type: 'p', html: 'Fixtures são recursos que o Playwright cria e injeta nos testes automaticamente. Cada teste recebe seus próprios recursos isolados — sem interferência entre testes paralelos.' },
              { type: 'code', lang: 'TypeScript', raw: '// Fixtures built-in mais usados:\ntest(\'exemplo\', async ({\n  page,        // página nova em cada teste\n  browser,     // instância do browser\n  context,     // contexto do browser (cookies, localStorage)\n  request,     // cliente HTTP para API testing\n  browserName, // "chromium" | "firefox" | "webkit"\n}) => {\n  // Cada um é criado fresh para este teste\n});\n\n// context é útil para múltiplas páginas:\ntest(\'duas abas\', async ({ context }) => {\n  const pagina1 = await context.newPage();\n  const pagina2 = await context.newPage();\n\n  await pagina1.goto(\'/tab-a\');\n  await pagina2.goto(\'/tab-b\');\n  // Compartilham cookies do mesmo contexto\n});' },
              { type: 'callout', html: '<strong>browser vs context vs page:</strong> <code>browser</code> = processo do Chrome. <code>context</code> = sessão isolada (como janela anônima). <code>page</code> = aba. Um contexto pode ter múltiplas pages.' },
            ]
          },
          {
            id: 'pw.4.3', title: 'Custom fixtures', description: 'Criar fixtures personalizados com extend.', duration: '14 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Fixtures customizados — login automático' },
              { type: 'p', html: 'Em vez de repetir o login em cada teste, crie um fixture que injeta uma página já autenticada.' },
              { type: 'code', lang: 'TypeScript', raw: '// fixtures/auth.ts\nimport { test as base } from \'@playwright/test\';\nimport { LoginPage } from \'../pages/LoginPage\';\n\n// Definir o tipo do fixture extra\ntype AuthFixtures = {\n  loggedPage: import(\'@playwright/test\').Page;\n};\n\n// Estender o test base com o fixture\nexport const test = base.extend<AuthFixtures>({\n  loggedPage: async ({ page }, use) => {\n    // Setup: fazer login\n    const login = new LoginPage(page);\n    await login.goto();\n    await login.login(\'user@test.com\', \'senha123\');\n    await expect(page).toHaveURL(/\\/dashboard/);\n\n    // Injetar a página logada no teste\n    await use(page);\n\n    // Teardown (opcional): logout\n    // await page.goto(\'/logout\');\n  },\n});\n\nexport { expect } from \'@playwright/test\';\n\n// ---\n// tests/dashboard.spec.ts\nimport { test, expect } from \'../fixtures/auth\';\n\n// Usa o fixture "loggedPage" — já está logado!\ntest(\'ver perfil\', async ({ loggedPage }) => {\n  await loggedPage.goto(\'/profile\');\n  await expect(loggedPage.getByRole(\'heading\')).toContainText(\'Meu Perfil\');\n});' },
            ]
          },
          {
            id: 'pw.4.4', title: 'Dados de teste', description: 'Gerenciar dados de teste com JSON e factories.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Organizar dados de teste' },
              { type: 'p', html: 'Hardcodar dados dentro dos testes cria acoplamento. Prefira arquivos de dados externos ou factories.' },
              { type: 'code', lang: 'TypeScript', raw: '// fixtures/test-data.ts\nexport const users = {\n  admin:    { email: \'admin@test.com\',    password: \'Admin@123\' },\n  customer: { email: \'customer@test.com\', password: \'Test@123\' },\n  readonly: { email: \'readonly@test.com\', password: \'Test@123\' },\n};\n\nexport const products = {\n  basic:    { name: \'Camiseta Básica\',  price: 49.90  },\n  premium:  { name: \'Camiseta Premium\', price: 99.90  },\n};\n\n// Usando nos testes:\nimport { users, products } from \'../fixtures/test-data\';\n\ntest(\'admin pode editar preço\', async ({ page }) => {\n  await loginAs(page, users.admin);\n  await expect(page.getByRole(\'button\', { name: \'Editar preço\' })).toBeVisible();\n});\n\ntest(\'customer não pode editar preço\', async ({ page }) => {\n  await loginAs(page, users.customer);\n  await expect(page.getByRole(\'button\', { name: \'Editar preço\' })).not.toBeVisible();\n});' },
              { type: 'callout', html: '<strong>Dados sensíveis:</strong> nunca commit senhas reais ou tokens no repositório. Use <code>.env</code> e <code>process.env.TEST_PASSWORD</code> para variáveis sensíveis, e adicione <code>.env</code> ao <code>.gitignore</code>.' },
            ]
          },
          {
            id: 'pw.4.5', title: 'Paralelismo e sharding', description: 'Rodar testes em paralelo e distribuir em múltiplos workers.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Paralelismo no Playwright' },
              { type: 'p', html: 'Por padrão, Playwright roda <strong>arquivos de teste em paralelo</strong> (um worker por arquivo). Dentro de um arquivo, testes rodam em série. Você pode controlar isso:' },
              { type: 'code', lang: 'TypeScript', raw: '// playwright.config.ts\nexport default defineConfig({\n  workers: 4,              // 4 arquivos em paralelo\n  fullyParallel: true,     // testes DENTRO do arquivo também em paralelo\n});\n\n// Forçar série em um arquivo (quando testes dependem de ordem):\ntest.describe.configure({ mode: \'serial\' });\n\n// ---\n// Sharding — distribuir em múltiplas máquinas (CI):\n\n// Máquina 1 de 3:\nnpx playwright test --shard=1/3\n\n// Máquina 2 de 3:\nnpx playwright test --shard=2/3\n\n// Máquina 3 de 3:\nnpx playwright test --shard=3/3' },
              { type: 'callout', html: '<strong>Testes paralelos exigem isolamento:</strong> cada worker precisa de dados independentes. Nunca compartilhe estado global entre testes paralelos (usuário com mesmo email, ID de produto etc.).' },
            ]
          },
        ]
      },

      {
        id: 'M5',
        title: 'Relatórios e CI/CD',
        description: 'Configurar relatórios, screenshots e pipeline de CI.',
        status: 'available',
        lessons: [
          {
            id: 'pw.5.1', title: 'Reporters', description: 'HTML, JSON, JUnit e reporters customizados.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Configurando reporters' },
              { type: 'code', lang: 'TypeScript', raw: '// playwright.config.ts\nexport default defineConfig({\n  reporter: [\n    [\'html\'],        // relatório visual → playwright-report/index.html\n    [\'json\', { outputFile: \'results.json\' }],  // dados para processar\n    [\'junit\', { outputFile: \'results.xml\' }],  // CI/CD (Jenkins, GitHub)\n    [\'line\'],        // saída limpa no terminal\n    [\'dot\'],         // saída compacta (.F.F.)\n  ],\n});\n\n// Ver o relatório HTML localmente:\nnpx playwright show-report' },
              { type: 'h2', text: 'O que o HTML reporter mostra?' },
              { type: 'p', html: 'O relatório HTML é o mais completo: <strong>lista todos os testes</strong> (passou/falhou/pulou), mostra a <strong>duração de cada um</strong>, permite filtrar por status, e quando há falha mostra <strong>screenshot, vídeo e trace</strong> embutidos.' },
              { type: 'callout', html: '<strong>No CI:</strong> configure <code>reporter: [["github"], ["html"]]</code> para ter as falhas anotadas diretamente no Pull Request do GitHub.' },
            ]
          },
          {
            id: 'pw.5.2', title: 'Screenshots e vídeos', description: 'Capturar evidências automáticas de falhas.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Evidências automáticas' },
              { type: 'code', lang: 'TypeScript', raw: '// playwright.config.ts — configuração recomendada para CI:\nuse: {\n  screenshot: \'only-on-failure\',  // screenshot quando falha\n  video:      \'on-first-retry\',   // vídeo no primeiro retry\n  trace:      \'on-first-retry\',   // trace no primeiro retry\n}\n\n// Manualmente no teste:\nawait page.screenshot({ path: \'homepage.png\', fullPage: true });\n\n// Screenshot de um elemento específico:\nawait page.locator(\'.produto-card\').screenshot({ path: \'produto.png\' });\n\n// Anexar arquivo ao relatório (aparece no HTML reporter):\nawait testInfo.attach(\'screenshot\', {\n  body: await page.screenshot(),\n  contentType: \'image/png\',\n});' },
              { type: 'callout', html: '<strong>Política de evidências:</strong> em CI, configure <code>screenshot: "only-on-failure"</code> e <code>video: "on-first-retry"</code>. Em dev local, use <code>--headed</code> e trace viewer. Screenshots e vídeos sempre geram mais artefatos em disco.' },
            ]
          },
          {
            id: 'pw.5.3', title: 'GitHub Actions', description: 'Pipeline de CI com GitHub Actions.', duration: '14 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Workflow de CI com Playwright' },
              { type: 'code', lang: 'yaml', raw: '# .github/workflows/playwright.yml\nname: Playwright Tests\n\non:\n  push:    { branches: [main, develop] }\n  pull_request: { branches: [main] }\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with: { node-version: 20 }\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Install Playwright browsers\n        run: npx playwright install --with-deps\n\n      - name: Run Playwright tests\n        run: npx playwright test\n        env:\n          BASE_URL: ${{ secrets.STAGING_URL }}\n          TEST_USER_PASSWORD: ${{ secrets.TEST_PASSWORD }}\n\n      - name: Upload test report\n        uses: actions/upload-artifact@v4\n        if: always()   # ← upload mesmo quando há falhas\n        with:\n          name: playwright-report\n          path: playwright-report/\n          retention-days: 14' },
              { type: 'callout', html: '<strong>if: always()</strong> no upload do relatório é crucial — sem isso, se os testes falham, o relatório não sobe e você não consegue ver o que aconteceu.' },
            ]
          },
          {
            id: 'pw.5.4', title: 'Estratégia de testes', description: 'Smoke tests, regressão e tags.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Organizando testes por categoria' },
              { type: 'code', lang: 'TypeScript', raw: '// Tageando testes com @tag\ntest(\'homepage carrega @smoke\', async ({ page }) => { /* ... */ });\ntest(\'login funciona @smoke @auth\', async ({ page }) => { /* ... */ });\ntest(\'checkout completo @regression\', async ({ page }) => { /* ... */ });\n\n// Rodando por tag:\nnpx playwright test --grep @smoke          # só smoke tests\nnpx playwright test --grep @regression      # regressão completa\nnpx playwright test --grep-invert @slow    # tudo exceto lentos\n\n// No CI:\n# Na branch main → smoke apenas (rápido, feedback em 2min)\nnpx playwright test --grep @smoke\n\n# Nightly / scheduled → suite completa\nnpx playwright test' },
              { type: 'callout', html: '<strong>Pirâmide de testes E2E:</strong> smoke tests (5-10 casos críticos, &lt;5 min), regressão (fluxos completos, &lt;30 min), exploratório (manual). Não tente automatizar tudo — priorize o que quebra mais e custa mais.' },
            ]
          },
          {
            id: 'pw.5.5', title: 'Ambientes e variáveis', description: 'Gerenciar múltiplos ambientes de teste.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Múltiplos ambientes com .env' },
              { type: 'code', lang: 'TypeScript', raw: '// playwright.config.ts\nimport { defineConfig } from \'@playwright/test\';\nimport dotenv from \'dotenv\';\n\n// Carrega .env.local, .env.staging ou .env conforme o ENV\ndotenv.config({ path: `.env.${process.env.ENV || \'local\'}` });\n\nexport default defineConfig({\n  use: {\n    baseURL: process.env.BASE_URL || \'http://localhost:3000\',\n  },\n});\n\n// .env.local\nBASE_URL=http://localhost:3000\nTEST_EMAIL=dev@test.com\nTEST_PASSWORD=devpassword\n\n// .env.staging\nBASE_URL=https://staging.meuapp.com\nTEST_EMAIL=qa@test.com\nTEST_PASSWORD=stagingpassword\n\n// Rodar em staging:\nENV=staging npx playwright test' },
              { type: 'callout', html: '<strong>Nunca commite .env com segredos:</strong> adicione <code>.env.local</code>, <code>.env.staging</code> ao <code>.gitignore</code>. No GitHub Actions, use <strong>Secrets</strong> (<code>Settings → Secrets → Actions</code>).' },
            ]
          },
        ]
      },

      {
        id: 'M6',
        title: 'Suite Completa',
        description: 'Boas práticas, testes de API, visual testing e projeto final.',
        status: 'available',
        lessons: [
          {
            id: 'pw.6.1', title: 'Arquitetura de uma suite profissional', description: 'Organização, nomenclatura e boas práticas.', duration: '14 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Boas práticas de nomenclatura' },
              { type: 'code', lang: 'TypeScript', raw: '// ✅ Descrever COMPORTAMENTO, não implementação\ntest(\'usuário sem permissão não vê botão Deletar\', async ...)\ntest(\'checkout falha com cartão expirado\', async ...)\ntest(\'busca retorna resultados ao digitar 3+ caracteres\', async ...)\n\n// ❌ Evitar nomes técnicos/genéricos\ntest(\'teste 1\', async ...)\ntest(\'verifica componente\', async ...)\ntest(\'clica no botão\', async ...)\n\n// test.describe para agrupar casos relacionados:\ntest.describe(\'Autenticação\', () => {\n  test.describe(\'Login\', () => {\n    test(\'login válido redireciona para dashboard\', async ...)\n    test(\'senha errada mostra mensagem de erro\', async ...)\n    test(\'3 tentativas bloqueia conta\', async ...)\n  });\n\n  test.describe(\'Recuperação de senha\', () => {\n    test(\'email de recuperação é enviado\', async ...)\n  });\n});' },
              { type: 'callout', html: '<strong>AAA Pattern:</strong> cada teste deve ter 3 blocos claros: <strong>Arrange</strong> (setup), <strong>Act</strong> (ação), <strong>Assert</strong> (verificação). Se seu teste tem múltiplos Acts e Asserts, provavelmente deveria ser dividido.' },
            ]
          },
          {
            id: 'pw.6.2', title: 'Login state com storageState', description: 'Reutilizar sessão autenticada entre testes.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Salvar e reutilizar estado de autenticação' },
              { type: 'p', html: 'Em vez de fazer login em cada teste (lento!), faça login uma vez, salve os cookies/localStorage, e reutilize-os. Isso pode reduzir o tempo da suite em 50%.' },
              { type: 'code', lang: 'TypeScript', raw: '// global-setup.ts — roda uma vez antes de todos os testes\nimport { chromium } from \'@playwright/test\';\n\nasync function globalSetup() {\n  const browser = await chromium.launch();\n  const page    = await browser.newPage();\n\n  await page.goto(\'/login\');\n  await page.getByLabel(\'Email\').fill(\'user@test.com\');\n  await page.getByLabel(\'Senha\').fill(\'senha123\');\n  await page.getByRole(\'button\', { name: \'Entrar\' }).click();\n  await page.waitForURL(\'/dashboard\');\n\n  // Salvar cookies + localStorage\n  await page.context().storageState({ path: \'.auth/user.json\' });\n  await browser.close();\n}\n\nexport default globalSetup;\n\n// playwright.config.ts:\nexport default defineConfig({\n  globalSetup: \'./global-setup.ts\',\n  use: {\n    storageState: \'.auth/user.json\',  // todos os testes começam logados\n  },\n});' },
            ]
          },
          {
            id: 'pw.6.3', title: 'Testes de API com Playwright', description: 'APIRequestContext para testar endpoints REST.', duration: '14 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'API testing sem browser' },
              { type: 'p', html: 'Playwright tem um cliente HTTP nativo. Você pode testar APIs REST diretamente — sem abrir um browser. Útil para popular dados de teste, verificar respostas de backend, ou testar endpoints que não têm UI.' },
              { type: 'code', lang: 'TypeScript', raw: '// tests/api/users.spec.ts\nimport { test, expect } from \'@playwright/test\';\n\ntest(\'criar usuário via API\', async ({ request }) => {\n  const response = await request.post(\'/api/users\', {\n    data: {\n      name:  \'Raphael\',\n      email: \'raphael@test.com\',\n      role:  \'qa-engineer\',\n    }\n  });\n\n  expect(response.status()).toBe(201);\n  const body = await response.json();\n  expect(body).toMatchObject({\n    name:  \'Raphael\',\n    email: \'raphael@test.com\',\n    id:    expect.any(Number),\n  });\n});\n\n// API + UI — criar dado via API, verificar na UI:\ntest(\'produto criado via API aparece na listagem\', async ({ page, request }) => {\n  // 1. Criar dado via API (mais rápido que pela UI)\n  const resp = await request.post(\'/api/products\', {\n    data: { name: \'Produto Teste\', price: 99.90 }\n  });\n  const { id } = await resp.json();\n\n  // 2. Verificar que aparece na UI\n  await page.goto(\'/products\');\n  await expect(page.getByText(\'Produto Teste\')).toBeVisible();\n\n  // 3. Cleanup via API\n  await request.delete(`/api/products/${id}`);\n});' },
            ]
          },
          {
            id: 'pw.6.4', title: 'Visual testing e screenshots', description: 'Comparação visual automática de screenshots.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Screenshot comparison' },
              { type: 'p', html: 'Visual testing compara screenshots pixel a pixel com uma imagem base salva. Detecta mudanças visuais não intencionais — regressões de CSS, quebra de layout etc.' },
              { type: 'code', lang: 'TypeScript', raw: '// Screenshot da página inteira:\nawait expect(page).toHaveScreenshot(\'homepage.png\');\n\n// Screenshot de um elemento:\nawait expect(page.locator(\'.product-card\').first())\n  .toHaveScreenshot(\'product-card.png\');\n\n// Com tolerância (pixels que podem diferir):\nawait expect(page).toHaveScreenshot(\'homepage.png\', {\n  maxDiffPixels: 100,   // até 100 pixels podem diferir\n});\n\n// Primeira execução: GERA o snapshot base\n// Execuções seguintes: COMPARA com o base\n\n// Atualizar o snapshot base quando a mudança é intencional:\nnpx playwright test --update-snapshots' },
              { type: 'callout', html: '<strong>Visual testing tem limitações:</strong> pequenas variações de font rendering, animações e conteúdo dinâmico (datas, preços) geram falsos positivos. Use para componentes estáticos e configure <code>maxDiffPixels</code> adequado.' },
            ]
          },
          {
            id: 'pw.6.5', title: 'Projeto Final — Suite E2E Completa', description: 'Suite E2E com POM, fixtures, API e CI integrado.', duration: '30 min', xp: 150, type: 'project', status: 'available',
            sections: [
              { type: 'h2', text: 'Projeto Final: Suite E2E de e-commerce' },
              { type: 'p', html: 'Você vai construir uma suite completa usando tudo que aprendeu: POM, fixtures de autenticação, API testing, relatórios e CI.' },
              { type: 'code', lang: 'text', raw: 'Requisitos do projeto:\n\n✅ Estrutura\n  - Page Objects para Login, Produtos, Carrinho, Checkout\n  - Fixture de autenticação (storageState)\n  - global-setup.ts para login único\n\n✅ Cobertura de testes\n  - Smoke: login, listar produtos, adicionar ao carrinho\n  - Fluxo E2E: busca → produto → carrinho → checkout\n  - API: criar produto, verificar na UI, deletar\n  - Negativo: checkout sem endereço falha com mensagem certa\n\n✅ CI/CD\n  - GitHub Actions rodando em push/PR\n  - Upload do relatório HTML como artefato\n  - Retry 2x em CI\n\n✅ Qualidade\n  - 0 seletores CSS frágeis (sem classes geradas)\n  - Testes passam em Chromium e Firefox\n  - Nenhum sleep() hardcoded' },
              { type: 'exercise', title: 'Entregável', desc: 'Submeta um link para o repositório GitHub com o projeto funcionando.', steps: ['Fork ou crie o repositório', 'Implemente conforme os requisitos acima', 'Garanta que os testes passam localmente', 'Configure o GitHub Actions', 'Submeta o link do PR ou repositório'], starterCode: '# Clone o template:\ngit clone https://github.com/seu-usuario/playwright-final\ncd playwright-final\nnpm install\nnpx playwright install', solution: '# Solução de referência disponível nos recursos do curso' },
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

  window.SL_PLAYWRIGHT = COURSE;
})();
