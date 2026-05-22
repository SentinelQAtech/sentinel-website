// Sentinel Learning — QA M5: CI/CD para QA
window.QA_M5 = [

  // ─── 5.1 ───────────────────────────────────────────────
  {
    module: 5, lesson: 1,
    title: 'CI/CD — O que é e por que o QA precisa saber',
    tag: 'Conceito', duration: '18 min', xp: 100,
    sections: [
      { type: 'text', content: `
        <h2>O que é CI/CD</h2>
        <p><strong>CI</strong> (Continuous Integration) é a prática de integrar código frequentemente — várias vezes por dia — com validação automática a cada push. <strong>CD</strong> pode significar Continuous Delivery (pronto para deploy manual) ou Continuous Deployment (deploy automático).</p>
        <p>O resultado é um pipeline que, a cada mudança de código, executa: build → testes → análise → deploy.</p>

        <h2>Por que isso importa para o QA</h2>
        <p>Em times modernos, o QA não testa apenas antes do deploy — os testes fazem parte do pipeline e <strong>bloqueiam o deploy</strong> se falharem. Isso significa:</p>
        <ul>
          <li>Testes automatizados precisam ser confiáveis (sem flakiness)</li>
          <li>O QA configura e mantém stages de teste no pipeline</li>
          <li>Falhas de teste são investigadas antes de qualquer merge</li>
          <li>Feedback chega em minutos, não dias</li>
        </ul>

        <h2>Ferramentas de CI/CD comuns</h2>
        <pre><code class="language-text">GitHub Actions    → integrado ao GitHub, fácil de configurar
GitLab CI/CD      → similar, integrado ao GitLab
Jenkins           → self-hosted, muito configurável
CircleCI          → cloud, rápido
Azure DevOps      → ecossistema Microsoft
Bitbucket Pipelines → integrado ao Bitbucket</code></pre>

        <h2>Anatomia de um pipeline de QA</h2>
        <pre><code class="language-text">┌─────────────────────────────────────────────────────┐
│  Push para branch / abertura de PR                  │
└──────────────────────┬──────────────────────────────┘
                       ▼
              ┌─────────────────┐
              │   1. Build      │  compila, instala deps
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  2. Lint/Types  │  ESLint, TypeScript
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  3. Unit Tests  │  Jest, Vitest
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │ 4. API Tests    │  Newman, Playwright request
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  5. E2E Tests   │  Playwright (chromium)
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  6. Deploy      │  somente se tudo passou
              └─────────────────┘</code></pre>

        <div class="callout callout-cyan">
          <strong>Papel do QA no pipeline:</strong> Você define quais testes existem em cada stage, qual falha bloqueia o deploy, e garante que a suite roda de forma determinística em ambiente de CI — sem dependência de estado local.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-5-1-ex1',
        prompt: 'Seu time não tem CI/CD — testes são rodados manualmente antes de cada deploy. Quais riscos concretos isso gera? Escreva pelo menos 5 cenários de problemas reais que acontecem sem automação no pipeline.',
        placeholder: 'Sua análise aqui...' }
    ]
  },

  // ─── 5.2 ───────────────────────────────────────────────
  {
    module: 5, lesson: 2,
    title: 'GitHub Actions — Configurando seu primeiro pipeline',
    tag: 'Prática', duration: '30 min', xp: 150,
    sections: [
      { type: 'text', content: `
        <h2>GitHub Actions em 5 conceitos</h2>
        <ul>
          <li><strong>Workflow</strong>: arquivo YAML em <code>.github/workflows/</code></li>
          <li><strong>Trigger</strong>: o que dispara o workflow (push, PR, schedule)</li>
          <li><strong>Job</strong>: conjunto de steps que rodam num runner</li>
          <li><strong>Step</strong>: comando ou action individual</li>
          <li><strong>Action</strong>: step reutilizável do marketplace</li>
        </ul>

        <h2>Pipeline básico com Playwright</h2>
        <pre><code class="language-yaml"># .github/workflows/qa.yml
name: QA Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Instalar browsers Playwright
        run: npx playwright install --with-deps chromium

      - name: Rodar testes E2E
        run: npx playwright test
        env:
          BASE_URL: \${{ secrets.STAGING_URL }}
          API_KEY:  \${{ secrets.API_KEY }}

      - name: Upload relatório de testes
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7</code></pre>

        <h2>Usando secrets para não expor credenciais</h2>
        <p>Nunca coloque URLs de produção, tokens ou senhas no YAML. Use Secrets do GitHub:</p>
        <pre><code class="language-text">// GitHub → Settings → Secrets and variables → Actions
STAGING_URL = https://staging.suaapp.com
API_KEY     = sk_test_AbCdEf...

// No YAML, acessa via:
\${{ secrets.STAGING_URL }}</code></pre>

        <h2>Rodando testes apenas em PRs relevantes</h2>
        <pre><code class="language-yaml">on:
  pull_request:
    paths:
      - 'src/**'        # apenas se src mudou
      - 'tests/**'      # ou se testes mudaram
      - 'package.json'  # ou se deps mudaram</code></pre>

        <h2>Paralelizando testes</h2>
        <pre><code class="language-yaml">jobs:
  test-e2e:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
          - run: npx playwright test --shard=\${{ matrix.shard }}/4</code></pre>
        <p>Isso divide os testes em 4 máquinas paralelas — reduz o tempo de 20 min para ~5 min.</p>

        <div class="callout callout-purple">
          <strong>Atenção:</strong> Testes E2E com UI precisam de browser. No GitHub Actions (Linux sem display), use <code>--with-deps</code> no install e certifique que seu playwright.config.ts usa <code>headless: true</code> (já é o default).
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-5-2-ex1',
        prompt: 'Você precisa configurar um pipeline que: (1) roda lint e unit tests a cada push em qualquer branch, (2) roda E2E apenas em PRs para main, (3) faz deploy automático para staging quando merge em develop. Descreva a estrutura de workflows que você criaria (pode ser em texto, não precisa de YAML completo). Justifique as escolhas.',
        placeholder: 'Sua proposta aqui...' }
    ]
  },

  // ─── 5.3 ───────────────────────────────────────────────
  {
    module: 5, lesson: 3,
    title: 'Relatórios, Artifacts e Notificações',
    tag: 'Prática', duration: '22 min', xp: 110,
    sections: [
      { type: 'text', content: `
        <h2>Por que relatórios importam no CI</h2>
        <p>Quando um teste falha no CI, o desenvolvedor precisa entender o quê falhou, onde e por quê — sem ter acesso à máquina onde rodou. Um bom relatório é a diferença entre "o CI quebrou" e "o fluxo de checkout falhou no Safari quando o estoque é zero".</p>

        <h2>Configurando o HTML reporter do Playwright</h2>
        <pre><code class="language-typescript">// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { open: 'never' }],   // relatório HTML local
    ['junit', { outputFile: 'results.xml' }],  // para CI
    ['list']                        // output no terminal
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  }
});</code></pre>

        <h2>Publicando o relatório como artifact</h2>
        <pre><code class="language-yaml">- name: Upload relatório HTML
  if: always()   # roda mesmo se os testes falharam
  uses: actions/upload-artifact@v4
  with:
          name: playwright-report-\${{ github.run_id }}
    path: playwright-report/
    retention-days: 14

- name: Upload screenshots de falhas
  if: failure()
  uses: actions/upload-artifact@v4
  with:
          name: test-failures-\${{ github.run_id }}
    path: test-results/</code></pre>

        <h2>Notificando no Slack quando testes falham</h2>
        <pre><code class="language-yaml">- name: Notificar Slack em falha
  if: failure()
  uses: slackapi/slack-github-action@v1.25.0
  with:
    payload: |
      {
        "text": "❌ QA Pipeline falhou!",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
                "text": "*Branch:* \${{ github.ref_name }}\n*Autor:* \${{ github.actor }}\n*Resultado:* <\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|Ver detalhes>"
            }
          }
        ]
      }
  env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}</code></pre>

        <h2>Publicando resultados como GitHub Check</h2>
        <p>Usando o reporter JUnit, o GitHub mostra os testes com status diretamente no PR:</p>
        <pre><code class="language-yaml">- name: Publicar resultados de teste
  if: always()
  uses: dorny/test-reporter@v1
  with:
    name: Playwright Tests
    path: results.xml
    reporter: java-junit</code></pre>

        <div class="callout callout-cyan">
          <strong>Visibilidade é tudo:</strong> Um time que não sabe quando os testes quebraram não consegue agir. Configure notificações desde o início — não espere o primeiro incidente em produção.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-5-3-ex1',
        prompt: 'Um teste E2E falhou no CI às 23h. O desenvolvedor que fez o push já foi dormir. Descreva como um bom setup de CI/CD com relatórios e notificações ajudaria o time a: (1) saber que falhou, (2) entender o que falhou, (3) reproduzir localmente. Seja concreto — cite as ferramentas e o que cada uma entrega.',
        placeholder: 'Sua resposta aqui...' }
    ]
  },

  // ─── 5.4 ───────────────────────────────────────────────
  {
    module: 5, lesson: 4,
    title: 'Ambientes de Teste e Dados no CI',
    tag: 'Estratégia', duration: '24 min', xp: 120,
    sections: [
      { type: 'text', content: `
        <h2>O problema dos ambientes no CI</h2>
        <p>Testes E2E precisam de um sistema funcionando. No CI, você não tem um ambiente local — precisa decidir: onde os testes vão rodar?</p>

        <h2>Estratégia 1: Subir aplicação no próprio CI</h2>
        <pre><code class="language-yaml">jobs:
  test:
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run db:migrate   # aplica migrations
      - run: npm run db:seed      # dados de teste
      - run: npm run start:test & # sobe a app
      - run: npx playwright test  # roda os testes</code></pre>

        <h2>Estratégia 2: Testar contra staging</h2>
        <pre><code class="language-text">Vantagens:
  ✓ Ambiente mais próximo do produção
  ✓ Não precisa subir serviços no CI
  ✓ Testa infraestrutura real

Desvantagens:
  ✗ Estado compartilhado (dados de outros desenvolvedores)
  ✗ Testes podem interferir entre si
  ✗ Ambiente pode estar instável por outras causas</code></pre>

        <h2>Gerenciamento de dados de teste</h2>
        <p>O maior desafio de testes em CI é o estado: cada test run precisa de dados limpos e previsíveis.</p>
        <pre><code class="language-typescript">// fixtures/setup.ts — criação de dados antes dos testes
import { test as base, request } from '@playwright/test';

export const test = base.extend({
  testUser: async ({ request }, use) => {
    // Cria usuário de teste
    const res = await request.post('/api/users', {
      data: {
        name: 'QA Test User',
        email: \`qa+\${Date.now()}@teste.com\`,
        password: 'Senha@123'
      }
    });
    const user = await res.json();

    await use(user);

    // Cleanup: deleta após o teste
    await request.delete(\`/api/users/\${user.id}\`, {
      headers: { Authorization: \`Bearer \${adminToken}\` }
    });
  }
});</code></pre>

        <h2>Isolamento por timestamp</h2>
        <p>Quando não dá pra deletar dados (ex: API de terceiro), use dados únicos:</p>
        <pre><code class="language-typescript">const ts = Date.now();
const email = \`qa.test.\${ts}@naoexiste.com\`;
const cpf   = geraCpfUnico(ts);
const pedido = \`PED-\${ts}\`;</code></pre>

        <div class="callout callout-purple">
          <strong>Erro comum:</strong> Testes que dependem de dados criados por outros testes. Se o teste A cria um usuário e o teste B usa esse usuário, quando rodar em paralelo ou ordem diferente, B quebra. Cada teste deve criar e limpar seus próprios dados.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-5-4-ex1',
        prompt: 'Você tem uma suite de 50 testes E2E que precisa rodar no CI. 20 deles criam pedidos, 15 criam usuários, e 15 testam fluxos de admin. O banco de staging é compartilhado com o time de dev. Descreva sua estratégia para garantir que os testes não interfiram entre si e que o banco não acumule lixo após cada run.',
        placeholder: 'Sua estratégia aqui...' }
    ]
  },

  // ─── 5.5 ───────────────────────────────────────────────
  {
    module: 5, lesson: 5,
    title: 'Testes de Regressão no Pipeline',
    tag: 'Estratégia', duration: '20 min', xp: 110,
    sections: [
      { type: 'text', content: `
        <h2>Regressão automatizada como rede de segurança</h2>
        <p>Teste de regressão verifica que o que funcionava antes ainda funciona depois de uma mudança. No CI, toda suite de testes E2E é, essencialmente, uma regressão automatizada rodando a cada PR.</p>

        <h2>Camadas de proteção no pipeline</h2>
        <pre><code class="language-text">┌─────────────────────────────────────────────────────┐
│ RÁPIDO   Unit tests     → 30s   → falha = bug local  │
│          API tests      → 2min  → falha = contrato   │
│ LENTO    E2E smoke      → 5min  → falha = crítico    │
│          E2E full suite → 20min → falha = regressão  │
└─────────────────────────────────────────────────────┘</code></pre>

        <h2>Smoke test antes da suite completa</h2>
        <p>Smoke tests verificam o essencial em poucos minutos. Se o smoke falhar, nem adianta rodar a suite completa:</p>
        <pre><code class="language-typescript">// tests/smoke/critical.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke — Fluxos críticos', () => {
  test('Home carrega', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Meu App/);
  });

  test('Login funciona', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', process.env.TEST_EMAIL!);
    await page.fill('[name=password]', process.env.TEST_PASS!);
    await page.click('[type=submit]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('API responde', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);
  });
});</code></pre>

        <pre><code class="language-yaml"># No pipeline: smoke primeiro, E2E depois
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test tests/smoke/ --reporter=list

  e2e-full:
    needs: smoke   # só roda se smoke passou
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test</code></pre>

        <h2>Tags para controlar o que roda onde</h2>
        <pre><code class="language-typescript">test('Checkout completo @regressao @critico', async ({ page }) => {
  // ...
});

test('Upload de avatar @regressao', async ({ page }) => {
  // ...
});</code></pre>
        <pre><code class="language-bash"># Roda só testes críticos (smoke)
npx playwright test --grep @critico

# Roda regressão completa (release)
npx playwright test --grep @regressao</code></pre>

        <div class="callout callout-cyan">
          <strong>Estratégia de tagging:</strong> Use tags para separar smoke, regressão, sanidade e testes longos. Com isso você controla o que roda em cada stage do pipeline sem duplicar configuração.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-5-5-ex1',
        prompt: 'Você tem 200 testes E2E. O pipeline está demorando 45 minutos, o que torna o feedback lento demais para o time. Liste pelo menos 4 estratégias para reduzir o tempo de execução sem reduzir a cobertura de risco. Para cada estratégia, explique o trade-off.',
        placeholder: 'Suas estratégias aqui...' }
    ]
  },

  // ─── 5.6 ───────────────────────────────────────────────
  {
    module: 5, lesson: 6,
    title: 'QA como Guardião do Pipeline',
    tag: 'Estratégia', duration: '22 min', xp: 120,
    sections: [
      { type: 'text', content: `
        <h2>O QA como dono da qualidade no pipeline</h2>
        <p>Em times maduros, o QA não é quem "aprova antes do deploy" — é quem <strong>constrói e mantém o pipeline de qualidade</strong>. Isso inclui:</p>
        <ul>
          <li>Definir quais testes bloqueiam o merge</li>
          <li>Investigar e resolver flakiness</li>
          <li>Monitorar tendências de falha ao longo do tempo</li>
          <li>Garantir que novos casos de teste entram no pipeline</li>
          <li>Auditar a cobertura regularmente</li>
        </ul>

        <h2>Lidando com flakiness</h2>
        <p><strong>Flaky test</strong>: teste que às vezes passa, às vezes falha, sem mudança de código. É o maior inimigo da confiabilidade do CI.</p>
        <pre><code class="language-typescript">// Evitar: espera por tempo fixo
await page.waitForTimeout(3000);

// Correto: espera pelo estado
await expect(page.getByText('Pedido confirmado')).toBeVisible();
await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();

// Retry automático para testes instáveis conhecidos (usar com parcimônia)
test.describe.configure({ retries: 2 });

// Retry no playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,  // só retry no CI
});</code></pre>

        <h2>Métricas de qualidade do pipeline</h2>
        <pre><code class="language-text">KPIs que um QA deve acompanhar:

Flakiness Rate     → % de runs que falham por flakiness (meta < 5%)
Pipeline Duration  → tempo total de execução (meta < 15min para PR)
Test Coverage      → % de fluxos críticos cobertos
Failure Detection  → bugs encontrados pelo CI vs produção
MTTR do pipeline   → tempo médio para resolver falha de CI</code></pre>

        <h2>Processo quando um teste quebra no CI</h2>
        <pre><code class="language-text">1. Investigar: é falha real ou flakiness?
   → Se real: abrir bug, bloquear merge, notificar dev
   → Se flaky: marcar como known issue, investigar causa raiz

2. Reproduzir localmente com as mesmas condições do CI

3. Corrigir ou adaptar o teste (nunca só adicionar retry sem entender)

4. Documentar: o que causou, como foi resolvido

5. Prevenir: se necessário, adicionar step de verificação no pipeline</code></pre>

        <h2>Branch protection rules</h2>
        <pre><code class="language-text">// GitHub → Settings → Branches → Branch protection rules
☑ Require status checks to pass before merging
  ☑ lint
  ☑ unit-tests
  ☑ smoke
☑ Require branches to be up to date before merging
☑ Restrict who can push to matching branches</code></pre>

        <div class="callout callout-cyan">
          <strong>Mindset de QA no CI/CD:</strong> Você não está testando para encontrar bugs — você está construindo um sistema que detecta bugs automaticamente antes que cheguem ao usuário. A diferença é de reativo para preventivo.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-5-6-ex1',
        prompt: 'Você é o QA responsável pelo pipeline de um produto com 3 devs, deploys diários e 80 testes E2E. Nos últimos 7 dias, 30% dos builds falharam — metade por falha real de código, metade por flakiness. Descreva seu plano de ação para a semana: o que você faria em qual ordem, com qual critério de priorização.',
        placeholder: 'Seu plano de ação aqui...' }
    ]
  }

];
