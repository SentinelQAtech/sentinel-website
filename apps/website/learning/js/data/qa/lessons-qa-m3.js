// Sentinel Learning — QA Engineering: Módulo 3 — Automação com Playwright

window.QA_M3 = [

  // 3.1 — Introdução ao Playwright
  {
    module: 3, lesson: 1,
    title: 'Introdução ao Playwright',
    duration: '14 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O que é o Playwright?</h2>
          <p>Playwright é um framework de automação de testes end-to-end criado pela Microsoft. Ele permite controlar browsers reais (Chromium, Firefox, WebKit) via código, simulando ações do usuário com precisão.</p>
          <p>Por que Playwright se destaca:</p>
          <ul>
            <li><strong>Auto-wait:</strong> espera automaticamente os elementos estarem prontos antes de interagir — sem <code>sleep()</code></li>
            <li><strong>Multi-browser:</strong> um teste, três browsers</li>
            <li><strong>Isolamento real:</strong> cada teste roda em contexto isolado (sem vazamento de estado)</li>
            <li><strong>Locators inteligentes:</strong> seletores resilientes baseados em semântica, não em CSS frágil</li>
            <li><strong>Tracing e evidências:</strong> gera screenshots, vídeos e traces automáticos em falha</li>
            <li><strong>TypeScript nativo:</strong> tipagem, autocomplete e segurança de tipo</li>
          </ul>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Setup inicial</h2>
          <p>Para iniciar um projeto Playwright com TypeScript:</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4"># Criar projeto e instalar Playwright</span>
npm init playwright@latest

<span style="color:#6272a4"># Estrutura gerada:</span>
playwright.config.ts   <span style="color:#6272a4">← configuração central</span>
tests/                 <span style="color:#6272a4">← seus arquivos .spec.ts</span>
tests-examples/        <span style="color:#6272a4">← exemplos gerados</span></pre>

          <p>Estrutura mínima de um teste:</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#ff79c6">import</span> { test, expect } <span style="color:#ff79c6">from</span> <span style="color:#f1fa8c">'@playwright/test'</span>;

<span style="color:#50fa7b">test</span>(<span style="color:#f1fa8c">'deve exibir o título da página'</span>, <span style="color:#ff79c6">async</span> ({ page }) => {
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">goto</span>(<span style="color:#f1fa8c">'https://meusite.com'</span>);
  <span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page).<span style="color:#50fa7b">toHaveTitle</span>(<span style="color:#f1fa8c">'Meu Site'</span>);
});</pre>
          <p>Rodar os testes: <code>npx playwright test</code>. Ver relatório: <code>npx playwright show-report</code>.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-1-ex1',
        prompt: 'Por que o auto-wait do Playwright elimina a necessidade de `sleep()` nos testes? Explique o problema que os waits fixos causam e como o Playwright resolve isso. Dê um exemplo concreto de situação onde isso faz diferença.',
        placeholder: 'O problema com sleep() é que...\n\nO Playwright resolve isso porque...\n\nExemplo: ao clicar em "Salvar" e aguardar o toast de confirmação...'
      }
    ]
  },

  // 3.2 — Locators: Seletores Resilientes
  {
    module: 3, lesson: 2,
    title: 'Locators — Seletores Resilientes',
    duration: '16 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O problema com seletores frágeis</h2>
          <p>A maior causa de testes flaky (instáveis) é o uso de seletores frágeis — CSS ou XPath baseados em estrutura interna do DOM que muda a cada refactor.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// ❌ Frágil — quebra se o dev mudar a estrutura HTML</span>
page.locator(<span style="color:#f1fa8c">'.btn-primary:nth-child(3)'</span>)
page.locator(<span style="color:#f1fa8c">'#root > div > div > form > button'</span>)

<span style="color:#6272a4">// ✅ Resiliente — baseado em comportamento e semântica</span>
page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Entrar'</span> })
page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'E-mail'</span>)
page.<span style="color:#50fa7b">getByPlaceholder</span>(<span style="color:#f1fa8c">'Digite seu e-mail'</span>)
page.<span style="color:#50fa7b">getByText</span>(<span style="color:#f1fa8c">'Bem-vindo, Raphael'</span>)
page.<span style="color:#50fa7b">getByTestId</span>(<span style="color:#f1fa8c">'btn-checkout'</span>)</pre>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Os locators do Playwright</h2>
          <h4 style="color:var(--cyan);margin:.75rem 0 .4rem">getByRole()</h4>
          <p>Preferido. Baseado nos roles ARIA — o mesmo que leitores de tela usam. Resiliente a mudanças de CSS e estrutura.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1rem;font-family:var(--font-code);font-size:.82rem;line-height:1.8;margin:.5rem 0">
page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Salvar'</span> })
page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'link'</span>, { name: <span style="color:#f1fa8c">'Esqueci minha senha'</span> })
page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'heading'</span>, { name: <span style="color:#f1fa8c">'Dashboard'</span> })</pre>

          <h4 style="color:var(--cyan);margin:.75rem 0 .4rem">getByLabel()</h4>
          <p>Para inputs associados a um <code>&lt;label&gt;</code>. Garante que label e campo estão corretamente ligados — valida acessibilidade implicitamente.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1rem;font-family:var(--font-code);font-size:.82rem;line-height:1.8;margin:.5rem 0">
page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Senha'</span>).<span style="color:#50fa7b">fill</span>(<span style="color:#f1fa8c">'Senha@123'</span>)</pre>

          <h4 style="color:var(--cyan);margin:.75rem 0 .4rem">getByTestId()</h4>
          <p>Quando nenhum locator semântico funciona: solicite ao dev que adicione <code>data-testid="nome-descritivo"</code> ao elemento. Contrato estável entre dev e QA.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1rem;font-family:var(--font-code);font-size:.82rem;line-height:1.8;margin:.5rem 0">
<span style="color:#6272a4">// HTML: &lt;button data-testid="btn-confirmar-pedido"&gt;</span>
page.<span style="color:#50fa7b">getByTestId</span>(<span style="color:#f1fa8c">'btn-confirmar-pedido'</span>)</pre>

          <h4 style="color:var(--cyan);margin:.75rem 0 .4rem">Encadeamento e filtros</h4>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1rem;font-family:var(--font-code);font-size:.82rem;line-height:1.8;margin:.5rem 0">
<span style="color:#6272a4">// Filtrar dentro de um contexto</span>
page.locator(<span style="color:#f1fa8c">'.product-card'</span>)
    .<span style="color:#50fa7b">filter</span>({ hasText: <span style="color:#f1fa8c">'Tênis Runner'</span> })
    .<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Adicionar ao carrinho'</span> })</pre>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-2-ex1',
        prompt: 'Para cada situação abaixo, escolha o melhor locator Playwright e justifique:\n1. Botão "Finalizar Compra" na tela de checkout\n2. Campo "Data de nascimento" em formulário de cadastro\n3. Link "Sair" no menu do usuário\n4. Card de produto específico "Nike Air Max" numa lista de produtos\n5. Ícone de menu hambúrguer sem texto visível',
        placeholder: '1. Botão "Finalizar Compra" → getByRole("button", { name: "Finalizar Compra" }) porque...\n2. Campo "Data de nascimento" → ...\n3. ...'
      }
    ]
  },

  // 3.3 — Ações e Interações
  {
    module: 3, lesson: 3,
    title: 'Ações e Interações com a Página',
    duration: '14 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Ações principais do Playwright</h2>
          <p>O Playwright espera automaticamente que o elemento esteja visível, estável e interativo antes de executar cada ação.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:2;margin:.75rem 0">
<span style="color:#6272a4">// Navegação</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">goto</span>(<span style="color:#f1fa8c">'https://app.com/login'</span>);
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">goBack</span>();
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">reload</span>();

<span style="color:#6272a4">// Clique</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Entrar'</span> }).<span style="color:#50fa7b">click</span>();
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByText</span>(<span style="color:#f1fa8c">'Ver detalhes'</span>).<span style="color:#50fa7b">dblclick</span>();

<span style="color:#6272a4">// Preencher campos</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'E-mail'</span>).<span style="color:#50fa7b">fill</span>(<span style="color:#f1fa8c">'qa@teste.com'</span>);
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Mensagem'</span>).<span style="color:#50fa7b">clear</span>();

<span style="color:#6272a4">// Select / Dropdown</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Estado'</span>).<span style="color:#50fa7b">selectOption</span>(<span style="color:#f1fa8c">'SP'</span>);

<span style="color:#6272a4">// Checkbox e Radio</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Aceito os Termos'</span>).<span style="color:#50fa7b">check</span>();
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Pessoa Física'</span>).<span style="color:#50fa7b">check</span>();

<span style="color:#6272a4">// Teclado</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Busca'</span>).<span style="color:#50fa7b">press</span>(<span style="color:#f1fa8c">'Enter'</span>);
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">keyboard</span>.<span style="color:#50fa7b">press</span>(<span style="color:#f1fa8c">'Escape'</span>);

<span style="color:#6272a4">// Hover</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByText</span>(<span style="color:#f1fa8c">'Menu'</span>).<span style="color:#50fa7b">hover</span>();

<span style="color:#6272a4">// Upload de arquivo</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Anexar documento'</span>).<span style="color:#50fa7b">setInputFiles</span>(<span style="color:#f1fa8c">'./fixtures/doc.pdf'</span>);</pre>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Esperas explícitas — quando usar</h2>
          <p>O auto-wait cobre 95% dos casos. Para os outros 5%, use esperas explícitas <strong>baseadas em condições</strong>, nunca em tempo fixo.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// ✅ Esperar elemento aparecer</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">waitForSelector</span>(<span style="color:#f1fa8c">'.toast-success'</span>);

<span style="color:#6272a4">// ✅ Esperar URL mudar (após redirect)</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">waitForURL</span>(<span style="color:#f1fa8c">'**/dashboard'</span>);

<span style="color:#6272a4">// ✅ Esperar requisição de rede</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">waitForResponse</span>(
  resp => resp.url().<span style="color:#50fa7b">includes</span>(<span style="color:#f1fa8c">'/api/pedidos'</span>) && resp.<span style="color:#50fa7b">status</span>() === <span style="color:#bd93f9">200</span>
);

<span style="color:#6272a4">// ❌ Nunca use — causa testes lentos e flaky</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">waitForTimeout</span>(<span style="color:#bd93f9">3000</span>);</pre>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-3-ex1',
        prompt: 'Escreva o código Playwright (TypeScript) para automatizar o seguinte fluxo:\n1. Navegar para /login\n2. Preencher e-mail com "qa@empresa.com"\n3. Preencher senha com "Senha@123"\n4. Clicar em "Entrar"\n5. Aguardar redirecionamento para /dashboard\n\nUse os locators mais adequados e justifique suas escolhas.',
        placeholder: "import { test, expect } from '@playwright/test';\n\ntest('login com credenciais válidas', async ({ page }) => {\n  await page.goto('/login');\n  // ...\n});"
      }
    ]
  },

  // 3.4 — Assertions com expect()
  {
    module: 3, lesson: 4,
    title: 'Assertions com expect()',
    duration: '13 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Por que assertions são o coração do teste</h2>
          <p>Um teste sem assertion não testa nada — ele apenas navega. O <code>expect()</code> é o que define o critério de passou/falhou. Playwright tem assertions específicas para web que incluem auto-retry automático.</p>

          <h3 style="margin-top:1.25rem">Assertions de página</h3>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:2;margin:.75rem 0">
<span style="color:#6272a4">// URL e título</span>
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page).<span style="color:#50fa7b">toHaveURL</span>(<span style="color:#f1fa8c">'/dashboard'</span>);
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page).<span style="color:#50fa7b">toHaveTitle</span>(<span style="color:#f1fa8c">'Dashboard | MeuApp'</span>);

<span style="color:#6272a4">// Visibilidade</span>
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByText</span>(<span style="color:#f1fa8c">'Bem-vindo'</span>)).<span style="color:#50fa7b">toBeVisible</span>();
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByTestId</span>(<span style="color:#f1fa8c">'modal-erro'</span>)).<span style="color:#50fa7b">toBeHidden</span>();

<span style="color:#6272a4">// Texto</span>
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'heading'</span>)).<span style="color:#50fa7b">toHaveText</span>(<span style="color:#f1fa8c">'Meu Pedido #1234'</span>);
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByTestId</span>(<span style="color:#f1fa8c">'msg-erro'</span>)).<span style="color:#50fa7b">toContainText</span>(<span style="color:#f1fa8c">'E-mail inválido'</span>);

<span style="color:#6272a4">// Estado de input</span>
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'E-mail'</span>)).<span style="color:#50fa7b">toHaveValue</span>(<span style="color:#f1fa8c">'qa@teste.com'</span>);
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Salvar'</span> })).<span style="color:#50fa7b">toBeDisabled</span>();
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Aceito os Termos'</span>)).<span style="color:#50fa7b">toBeChecked</span>();

<span style="color:#6272a4">// Contagem de elementos</span>
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'listitem'</span>)).<span style="color:#50fa7b">toHaveCount</span>(<span style="color:#bd93f9">5</span>);

<span style="color:#6272a4">// CSS / atributo</span>
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByTestId</span>(<span style="color:#f1fa8c">'status'</span>)).<span style="color:#50fa7b">toHaveClass</span>(<span style="color:#f1fa8c">/success/</span>);
<span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'link'</span>, { name: <span style="color:#f1fa8c">'Perfil'</span> })).<span style="color:#50fa7b">toHaveAttribute</span>(<span style="color:#f1fa8c">'href'</span>, <span style="color:#f1fa8c">'/perfil'</span>);</pre>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-4-ex1',
        prompt: 'Escreva as assertions Playwright para validar os seguintes cenários após um login bem-sucedido:\n1. URL mudou para /dashboard\n2. Cabeçalho exibe "Bem-vindo, Raphael"\n3. Botão "Sair" está visível\n4. Menu de navegação tem 4 itens\n5. Campo de e-mail NÃO está mais visível (foi para outra página)\n\nJustifique qual assertion você usou em cada caso.',
        placeholder: "// 1. URL\nawait expect(page).toHaveURL('/dashboard'); // porque...\n\n// 2. Cabeçalho\nawait expect(...\n\n// 3. Botão Sair\n..."
      }
    ]
  },

  // 3.5 — Page Object Model
  {
    module: 3, lesson: 5,
    title: 'Page Object Model (POM)',
    duration: '16 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O problema sem POM</h2>
          <p>Sem organização, testes ficam assim — frágeis e difíceis de manter:</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// ❌ Locators repetidos em 15 arquivos diferentes</span>
<span style="color:#6272a4">// Se o label "E-mail" virar "Email" → você muda em 15 lugares</span>
test(<span style="color:#f1fa8c">'teste 1'</span>, <span style="color:#ff79c6">async</span> ({ page }) => {
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'E-mail'</span>).<span style="color:#50fa7b">fill</span>(<span style="color:#f1fa8c">'...'</span>);
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Senha'</span>).<span style="color:#50fa7b">fill</span>(<span style="color:#f1fa8c">'...'</span>);
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Entrar'</span> }).<span style="color:#50fa7b">click</span>();
});</pre>

          <h2>Page Object Model — a solução</h2>
          <p>POM encapsula os locators e ações de cada página em uma classe. Os testes ficam limpos e, quando a UI muda, você muda em um único lugar.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// pages/LoginPage.ts</span>
<span style="color:#ff79c6">import</span> { Page, Locator } <span style="color:#ff79c6">from</span> <span style="color:#f1fa8c">'@playwright/test'</span>;

<span style="color:#ff79c6">export class</span> <span style="color:#50fa7b">LoginPage</span> {
  <span style="color:#ff79c6">readonly</span> emailInput:  Locator;
  <span style="color:#ff79c6">readonly</span> senhaInput:  Locator;
  <span style="color:#ff79c6">readonly</span> btnEntrar:   Locator;
  <span style="color:#ff79c6">readonly</span> msgErro:     Locator;

  <span style="color:#50fa7b">constructor</span>(<span style="color:#ff79c6">private</span> page: Page) {
    <span style="color:#ff79c6">this</span>.emailInput = page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'E-mail'</span>);
    <span style="color:#ff79c6">this</span>.senhaInput = page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Senha'</span>);
    <span style="color:#ff79c6">this</span>.btnEntrar  = page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Entrar'</span> });
    <span style="color:#ff79c6">this</span>.msgErro    = page.<span style="color:#50fa7b">getByTestId</span>(<span style="color:#f1fa8c">'msg-erro'</span>);
  }

  <span style="color:#ff79c6">async</span> <span style="color:#50fa7b">goto</span>() {
    <span style="color:#ff79c6">await</span> <span style="color:#ff79c6">this</span>.page.<span style="color:#50fa7b">goto</span>(<span style="color:#f1fa8c">'/login'</span>);
  }

  <span style="color:#ff79c6">async</span> <span style="color:#50fa7b">login</span>(email: <span style="color:#ff79c6">string</span>, senha: <span style="color:#ff79c6">string</span>) {
    <span style="color:#ff79c6">await</span> <span style="color:#ff79c6">this</span>.emailInput.<span style="color:#50fa7b">fill</span>(email);
    <span style="color:#ff79c6">await</span> <span style="color:#ff79c6">this</span>.senhaInput.<span style="color:#50fa7b">fill</span>(senha);
    <span style="color:#ff79c6">await</span> <span style="color:#ff79c6">this</span>.btnEntrar.<span style="color:#50fa7b">click</span>();
  }
}</pre>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Usando o Page Object nos testes</h2>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// tests/login.spec.ts</span>
<span style="color:#ff79c6">import</span> { test, expect } <span style="color:#ff79c6">from</span> <span style="color:#f1fa8c">'@playwright/test'</span>;
<span style="color:#ff79c6">import</span> { LoginPage } <span style="color:#ff79c6">from</span> <span style="color:#f1fa8c">'../pages/LoginPage'</span>;

test.<span style="color:#50fa7b">describe</span>(<span style="color:#f1fa8c">'Login'</span>, () => {
  test(<span style="color:#f1fa8c">'login com credenciais válidas'</span>, <span style="color:#ff79c6">async</span> ({ page }) => {
    <span style="color:#ff79c6">const</span> loginPage = <span style="color:#ff79c6">new</span> <span style="color:#50fa7b">LoginPage</span>(page);
    <span style="color:#ff79c6">await</span> loginPage.<span style="color:#50fa7b">goto</span>();
    <span style="color:#ff79c6">await</span> loginPage.<span style="color:#50fa7b">login</span>(<span style="color:#f1fa8c">'qa@teste.com'</span>, <span style="color:#f1fa8c">'Senha@123'</span>);
    <span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page).<span style="color:#50fa7b">toHaveURL</span>(<span style="color:#f1fa8c">'/dashboard'</span>);
  });

  test(<span style="color:#f1fa8c">'senha inválida exibe mensagem de erro'</span>, <span style="color:#ff79c6">async</span> ({ page }) => {
    <span style="color:#ff79c6">const</span> loginPage = <span style="color:#ff79c6">new</span> <span style="color:#50fa7b">LoginPage</span>(page);
    <span style="color:#ff79c6">await</span> loginPage.<span style="color:#50fa7b">goto</span>();
    <span style="color:#ff79c6">await</span> loginPage.<span style="color:#50fa7b">login</span>(<span style="color:#f1fa8c">'qa@teste.com'</span>, <span style="color:#f1fa8c">'senhaerrada'</span>);
    <span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(loginPage.msgErro).<span style="color:#50fa7b">toContainText</span>(<span style="color:#f1fa8c">'E-mail ou senha incorretos'</span>);
  });
});</pre>
          <p>Perceba como o teste ficou <strong>limpo, legível e sem detalhes de implementação</strong>. Se o label "E-mail" mudar, você altera só o <code>LoginPage.ts</code>.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-5-ex1',
        prompt: 'Escreva um Page Object (CheckoutPage.ts) para uma tela de checkout com os campos: Endereço de entrega, CEP, Cidade, Método de pagamento (dropdown), Número do cartão, e botão "Confirmar Pedido". Inclua pelo menos 2 métodos de ação além do construtor.',
        placeholder: "// pages/CheckoutPage.ts\nimport { Page, Locator } from '@playwright/test';\n\nexport class CheckoutPage {\n  // locators...\n\n  constructor(private page: Page) {\n    // ...\n  }\n\n  async preencherEndereco(...) {\n    // ...\n  }\n}"
      }
    ]
  },

  // 3.6 — Fixtures e Dados de Teste
  {
    module: 3, lesson: 6,
    title: 'Fixtures e Dados de Teste',
    duration: '13 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O que são Fixtures?</h2>
          <p>Fixtures são mecanismos de setup e teardown que preparam o contexto para cada teste e limpam após a execução. Garantem que cada teste começa do estado correto — sem depender do que o teste anterior fez.</p>

          <h3 style="margin-top:1.25rem">Fixtures built-in do Playwright</h3>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// page        → nova página isolada por teste</span>
<span style="color:#6272a4">// context     → contexto de browser (cookies, storage)</span>
<span style="color:#6272a4">// browser     → instância do browser</span>
<span style="color:#6272a4">// request     → cliente HTTP para testes de API</span>

test(<span style="color:#f1fa8c">'exemplo'</span>, <span style="color:#ff79c6">async</span> ({ page, context }) => {
  <span style="color:#6272a4">// page já está limpa e isolada</span>
});</pre>

          <h3 style="margin-top:1.25rem">Fixtures customizadas — usuário já logado</h3>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// fixtures/auth.ts</span>
<span style="color:#ff79c6">import</span> { test <span style="color:#ff79c6">as</span> base } <span style="color:#ff79c6">from</span> <span style="color:#f1fa8c">'@playwright/test'</span>;

<span style="color:#ff79c6">export const</span> test = base.<span style="color:#50fa7b">extend</span>({
  loggedInPage: <span style="color:#ff79c6">async</span> ({ page }, use) => {
    <span style="color:#6272a4">// Setup: fazer login uma vez</span>
    <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">goto</span>(<span style="color:#f1fa8c">'/login'</span>);
    <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'E-mail'</span>).<span style="color:#50fa7b">fill</span>(<span style="color:#f1fa8c">'qa@teste.com'</span>);
    <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByLabel</span>(<span style="color:#f1fa8c">'Senha'</span>).<span style="color:#50fa7b">fill</span>(<span style="color:#f1fa8c">'Senha@123'</span>);
    <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Entrar'</span> }).<span style="color:#50fa7b">click</span>();
    <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">waitForURL</span>(<span style="color:#f1fa8c">'**/dashboard'</span>);

    <span style="color:#ff79c6">await</span> <span style="color:#50fa7b">use</span>(page); <span style="color:#6272a4">// ← entrega a page logada para o teste</span>

    <span style="color:#6272a4">// Teardown (opcional): limpar dados criados pelo teste</span>
  }
});

<span style="color:#6272a4">// tests/pedidos.spec.ts</span>
<span style="color:#ff79c6">import</span> { test } <span style="color:#ff79c6">from</span> <span style="color:#f1fa8c">'../fixtures/auth'</span>;

test(<span style="color:#f1fa8c">'criar pedido'</span>, <span style="color:#ff79c6">async</span> ({ loggedInPage }) => {
  <span style="color:#6272a4">// Já começa logado — sem repetir login em cada teste</span>
  <span style="color:#ff79c6">await</span> loggedInPage.<span style="color:#50fa7b">goto</span>(<span style="color:#f1fa8c">'/pedidos/novo'</span>);
});</pre>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-6-ex1',
        prompt: 'Explique com suas palavras:\n1. Por que cada teste Playwright deve ser independente (não depender de outro teste ter rodado antes)?\n2. Que problemas surgem quando testes compartilham estado (ex: um teste cria um usuário e o próximo espera que ele exista)?\n3. Como uma fixture customizada de "usuário logado" resolve o trade-off entre independência e performance?',
        placeholder: '1. Cada teste deve ser independente porque...\n\n2. Os problemas de estado compartilhado são...\n\n3. A fixture de usuário logado resolve porque...'
      }
    ]
  },

  // 3.7 — Interceptação de Rede e Mocking
  {
    module: 3, lesson: 7,
    title: 'Interceptação de Rede e Mocking de API',
    duration: '14 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Por que interceptar requisições?</h2>
          <p>Às vezes você precisa testar comportamentos que dependem de respostas específicas da API — erros, timeouts, dados específicos. Com <code>page.route()</code>, você intercepta e controla as respostas sem depender do backend real.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// Simular erro 500 da API de pedidos</span>
test(<span style="color:#f1fa8c">'exibe mensagem quando API falha'</span>, <span style="color:#ff79c6">async</span> ({ page }) => {
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">route</span>(<span style="color:#f1fa8c">'**/api/pedidos'</span>, route =>
    route.<span style="color:#50fa7b">fulfill</span>({
      status: <span style="color:#bd93f9">500</span>,
      body: JSON.<span style="color:#50fa7b">stringify</span>({ error: <span style="color:#f1fa8c">'Internal Server Error'</span> })
    })
  );
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">goto</span>(<span style="color:#f1fa8c">'/pedidos'</span>);
  <span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByText</span>(<span style="color:#f1fa8c">'Erro ao carregar pedidos'</span>)).<span style="color:#50fa7b">toBeVisible</span>();
});

<span style="color:#6272a4">// Simular resposta com dados específicos</span>
test(<span style="color:#f1fa8c">'exibe lista de produtos mockada'</span>, <span style="color:#ff79c6">async</span> ({ page }) => {
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">route</span>(<span style="color:#f1fa8c">'**/api/produtos'</span>, route =>
    route.<span style="color:#50fa7b">fulfill</span>({
      status: <span style="color:#bd93f9">200</span>,
      contentType: <span style="color:#f1fa8c">'application/json'</span>,
      body: JSON.<span style="color:#50fa7b">stringify</span>([
        { id: <span style="color:#bd93f9">1</span>, nome: <span style="color:#f1fa8c">'Produto Teste'</span>, preco: <span style="color:#bd93f9">99.90</span> }
      ])
    })
  );
  <span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">goto</span>(<span style="color:#f1fa8c">'/produtos'</span>);
  <span style="color:#ff79c6">await</span> <span style="color:#50fa7b">expect</span>(page.<span style="color:#50fa7b">getByText</span>(<span style="color:#f1fa8c">'Produto Teste'</span>)).<span style="color:#50fa7b">toBeVisible</span>();
});

<span style="color:#6272a4">// Verificar que uma requisição foi feita</span>
test(<span style="color:#f1fa8c">'dispara POST ao salvar'</span>, <span style="color:#ff79c6">async</span> ({ page }) => {
  <span style="color:#ff79c6">const</span> [request] = <span style="color:#ff79c6">await</span> Promise.<span style="color:#50fa7b">all</span>([
    page.<span style="color:#50fa7b">waitForRequest</span>(<span style="color:#f1fa8c">'**/api/salvar'</span>),
    page.<span style="color:#50fa7b">getByRole</span>(<span style="color:#f1fa8c">'button'</span>, { name: <span style="color:#f1fa8c">'Salvar'</span> }).<span style="color:#50fa7b">click</span>()
  ]);
  <span style="color:#50fa7b">expect</span>(request.<span style="color:#50fa7b">method</span>()).<span style="color:#50fa7b">toBe</span>(<span style="color:#f1fa8c">'POST'</span>);
});</pre>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-7-ex1',
        prompt: 'Descreva 3 cenários de teste onde você usaria interceptação de rede (page.route) em vez de depender do backend real. Para cada cenário, explique: o que seria difícil de testar sem o mock e o que o mock permite validar.',
        placeholder: 'Cenário 1: Teste de timeout da API\n→ Sem mock: precisaria de backend lento/instável\n→ Com mock: simulo route com delay ou abort e verifico que o loading state aparece...\n\nCenário 2: ...'
      }
    ]
  },

  // 3.8 — Screenshots, Relatórios e Evidências
  {
    module: 3, lesson: 8,
    title: 'Screenshots, Vídeos e Relatórios',
    duration: '11 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Evidências automáticas em falhas</h2>
          <p>O Playwright pode capturar screenshots, vídeos e traces automaticamente quando um teste falha — sem esforço extra no código de teste.</p>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// playwright.config.ts</span>
<span style="color:#ff79c6">export default</span> <span style="color:#50fa7b">defineConfig</span>({
  use: {
    screenshot: <span style="color:#f1fa8c">'only-on-failure'</span>, <span style="color:#6272a4">// ou 'on'</span>
    video:      <span style="color:#f1fa8c">'retain-on-failure'</span>, <span style="color:#6272a4">// grava vídeo só quando falha</span>
    trace:      <span style="color:#f1fa8c">'on-first-retry'</span>,    <span style="color:#6272a4">// trace no retry</span>
  },
  reporter: [
    [<span style="color:#f1fa8c">'html'</span>],  <span style="color:#6272a4">// relatório HTML navegável</span>
    [<span style="color:#f1fa8c">'list'</span>]   <span style="color:#6272a4">// output no terminal</span>
  ]
});</pre>

          <h3 style="margin-top:1.25rem">Screenshot manual dentro do teste</h3>
          <pre style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.82rem;line-height:1.9;margin:.75rem 0">
<span style="color:#6272a4">// Screenshot da página inteira</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">screenshot</span>({ path: <span style="color:#f1fa8c">'evidencias/checkout.png'</span>, fullPage: <span style="color:#ff79c6">true</span> });

<span style="color:#6272a4">// Screenshot de um elemento específico</span>
<span style="color:#ff79c6">await</span> page.<span style="color:#50fa7b">getByTestId</span>(<span style="color:#f1fa8c">'modal-confirmacao'</span>).<span style="color:#50fa7b">screenshot</span>({
  path: <span style="color:#f1fa8c">'evidencias/modal.png'</span>
});</pre>

          <h3 style="margin-top:1.25rem">Trace Viewer</h3>
          <p>O trace captura cada ação, screenshot de cada passo, network calls e console logs em um arquivo navegável. Para abrir: <code>npx playwright show-trace trace.zip</code>. É a ferramenta mais poderosa para debugar falhas intermitentes.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-8-ex1',
        prompt: 'Um teste falhou em CI às 2h da manhã e você precisa entender o que aconteceu sem conseguir reproduzir localmente. Descreva como você usaria as ferramentas de evidência do Playwright (screenshot, vídeo, trace) para investigar a falha. Quais informações cada uma fornece?',
        placeholder: 'Screenshot: me mostra o estado visual da tela no momento da falha — util para...\n\nVídeo: permite ver o fluxo completo de ações — útil quando...\n\nTrace Viewer: fornece...\n\nMinha estratégia de investigação seria...'
      }
    ]
  },

  // 3.9 — Projeto: Suite E2E Completa
  {
    module: 3, lesson: 9,
    title: 'Projeto: Suite E2E de Login e Cadastro',
    duration: '30 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O projeto do módulo</h2>
          <p>Você vai projetar e escrever uma suite E2E completa para os fluxos de <strong>Login</strong> e <strong>Cadastro</strong> de uma aplicação web, aplicando todos os conceitos do módulo:</p>
          <ul>
            <li>Page Object Model para LoginPage e CadastroPage</li>
            <li>Locators resilientes (getByRole, getByLabel, getByTestId)</li>
            <li>Assertions adequadas para cada validação</li>
            <li>Fixtures para setup (usuário pré-existente)</li>
            <li>Casos positivos e negativos</li>
            <li>Configuração de screenshots em falha</li>
          </ul>

          <h3 style="margin-top:1.25rem">Especificação do sistema</h3>
          <p><strong>Login:</strong> campos e-mail e senha, botão "Entrar", link "Esqueci minha senha". Sucesso → redireciona para /dashboard. Falha → exibe "E-mail ou senha incorretos". Após 5 tentativas → bloqueia por 30 minutos.</p>
          <p><strong>Cadastro:</strong> nome, e-mail, senha, confirmação de senha, checkbox de termos. Sucesso → exibe toast "Verifique seu e-mail" e redireciona para /login. E-mail já cadastrado → "Este e-mail já está em uso".</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-3-9-ex1',
        prompt: 'Escreva a suite E2E completa incluindo:\n1. LoginPage.ts (Page Object com locators e métodos)\n2. CadastroPage.ts (Page Object)\n3. login.spec.ts com mínimo 4 casos de teste (positivo + negativos)\n4. cadastro.spec.ts com mínimo 3 casos de teste\n5. Fixture de usuário existente para os testes de login\n\nUse TypeScript e boas práticas de Playwright.',
        placeholder: "// === LoginPage.ts ===\nimport { Page, Locator } from '@playwright/test';\n\nexport class LoginPage {\n  // ...\n}\n\n// === login.spec.ts ===\nimport { test, expect } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntest.describe('Login', () => {\n  test('login com credenciais válidas', async ({ page }) => {\n    // ...\n  });\n\n  test('senha incorreta exibe erro', async ({ page }) => {\n    // ...\n  });\n\n  // ...\n});"
      }
    ]
  }

];
