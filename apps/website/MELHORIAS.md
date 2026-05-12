# Melhorias — Sentinel Tech - QA (site institucional)

> Análise realizada em 2026-05-08. Arquivos: `index.html`, `assets/css/style.css`, `assets/js/main.js`.

---

## 🔴 Críticas (bugs, quebras, segurança)

- [x] **Nenhum `<h1>` na página — falha de SEO e acessibilidade**
  - 📍 Onde: `index.html:87` → `<h2 class="hero-title">Modern QA built on...`
  - ❌ Problema: toda página deve ter exatamente um `<h1>`. O título principal da hero usa `<h2>`, e nenhum outro elemento usa `<h1>`. Google usa o h1 como sinal primário de relevância da página. Leitores de tela anunciam a estrutura de headings para navegação — sem h1, a hierarquia começa em h2.
  - ✅ Solução: trocar a tag do título da hero de `<h2>` para `<h1>`. O CSS usa classe `.hero-title`, não tag selector — nenhum estilo quebra.
    ```html
    <h1 class="hero-title">
      Modern QA built on <span class="gradient-text">quality, security,</span> and confidence.
    </h1>
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: alto

- [ ] **Formulário de contato mostra `alert()` — inaceitável para site B2B**
  - 📍 Onde: `assets/js/main.js:118-124` → bloco de validação e submit
  - ❌ Problema: validação usa `alert("Please fill in all fields.")` e o placeholder de envio usa outro `alert()`. Um site que vende QA profissional para empresas não pode ter um formulário que abre pop-ups de browser dos anos 90. Bloqueia a UI, não diz *qual* campo está errado, e o "sucesso" é falso (nada é enviado).
  - ✅ Solução em duas etapas:
    1. **Validação inline** — substituir o `alert` por mensagens de erro embaixo de cada campo:
    ```js
    function showError(input, msg) {
      const group = input.closest(".form-group");
      let err = group.querySelector(".field-error");
      if (!err) { err = document.createElement("p"); err.className = "field-error"; group.append(err); }
      err.textContent = msg;
      input.setAttribute("aria-invalid", "true");
    }
    ```
    2. **Integração real** — conectar ao Formspree (gratuito, sem backend):
    ```html
    <form action="https://formspree.io/f/SEU_ID" method="POST">
    ```
    Ou manter o JS e usar a Fetch API com o Formspree endpoint.
  - ⏱️ Esforço: médio
  - 🎯 Impacto: alto

- [x] **Links do footer LinkedIn e GitHub são `href="#"` — destino inválido**
  - 📍 Onde: `index.html:471-472`
  - ❌ Problema: cliente clica em "LinkedIn" e a página rola para o topo. Para um site de empresa, isso é constrangedor — especialmente no primeiro contato com um cliente em potencial.
  - ✅ Solução: substituir pelo URL real de cada rede:
    ```html
    <a href="https://www.linkedin.com/company/sentinel-tech-qa/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
    <a href="https://github.com/SentinelTechQa" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a>
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: alto

---

## 🟠 Importantes (UX, acessibilidade, performance, conteúdo)

- [x] **Conteúdo placeholder visível ao público — Cases e Blog** *(tag trocada para "Case Study"; descrições meta removidas dos blogs)*
  - 📍 Onde: `index.html:322-338` (Cases) e `index.html:392-413` (Blog)
  - ❌ Problema: os cards de Cases têm a tag "Sample Project" e texto genérico ("Testing flow focused on product browsing..."). Os cards de Blog têm descrições que *descrevem o propósito do artigo* em vez de ser o conteúdo ("A content direction designed to build authority, educate clients..."). Qualquer visitante técnico percebe que é placeholder — o oposto de inspirar confiança em uma empresa de QA.
  - ✅ Solução: ou preencher com conteúdo real, ou remover as seções até ter conteúdo. Se optar por manter, substituir "Sample Project" por "Case Study" e remover as descrições meta ("designed to build authority").
  - ⏱️ Esforço: baixo (para remover/ajustar tags e texto), alto (para conteúdo real)
  - 🎯 Impacto: alto

- [x] **Team card "Training QA" com "T" de placeholder** *(card removido — ficou Antonio + Rapha)*
  - 📍 Onde: `index.html:371-378`
  - ❌ Problema: o terceiro membro da equipe é "Training QA / QA Trainee" com avatar cinza e letra "T" — placeholder evidente. Clientes procuram saber com quem vão trabalhar. Um slot vazio comunica que a empresa está incompleta.
  - ✅ Solução: ou substituir pelo nome real do trainee quando houver, ou remover o card até ter um membro real. Reduzir para 2 cards (Antônio + Rapha) é mais profissional que exibir um placeholder.
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: alto

- [x] **Blog "Read more →" são `<span>` — parecem links mas não funcionam** *(spans removidos enquanto não há artigos reais)*
  - 📍 Onde: `index.html:396, 403, 410` → `<span class="blog-read">Read more →</span>`
  - ❌ Problema: visualmente parece um link clicável (cor roxa, hover muda de cor via CSS). Mas é um `<span>` sem href. Usuário de teclado nunca consegue focar. Usuário de mouse clica e nada acontece. Quebra a expectativa de interação.
  - ✅ Solução: trocar para `<a>` com href real quando o artigo existir, ou remover o elemento por enquanto:
    ```html
    <!-- Com artigo real -->
    <a href="/blog/test-automation-from-scratch" class="blog-read">Read more →</a>
    <!-- Sem artigo -->
    <!-- remover o span -->
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: médio

- [x] **Sem Open Graph e Twitter Card — link sem preview em redes sociais**
  - 📍 Onde: `index.html:3-23` → seção `<head>`, ausente
  - ❌ Problema: ao compartilhar o link no LinkedIn ou WhatsApp (canal principal de prospecção B2B), nenhum preview aparece. Para um site de empresa, isso é marketing perdido.
  - ✅ Solução:
    ```html
    <meta property="og:title" content="Sentinel Tech - QA | Quality You Can Trust." />
    <meta property="og:description" content="Manual, automation, performance, API, web, and mobile testing for companies that need reliable software." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://sentinel-tech-qa.vercel.app" />
    <meta property="og:image" content="https://sentinel-tech-qa.vercel.app/assets/logo/banner - removebg.png" />
    <meta name="twitter:card" content="summary_large_image" />
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: alto

- [x] **Script carregado sem `defer`**
  - 📍 Onde: `index.html:479` → `<script src="assets/js/main.js"></script>`
  - ❌ Problema: mesmo estando no final do body (o que mitiga parcialmente), adicionar `defer` é a prática correta e melhora pontuação no Lighthouse.
  - ✅ Solução: `<script src="assets/js/main.js" defer></script>`
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: baixo

- [x] **`scroll-behavior: smooth` sem `prefers-reduced-motion`**
  - 📍 Onde: `assets/css/style.css:69`
  - ❌ Problema: usuários com vestibular disorders ou epilepsia podem ter configurado o sistema para reduzir motion. O scroll suave não respeita essa preferência.
  - ✅ Solução:
    ```css
    /* remover: html { scroll-behavior: smooth; } */
    @media (prefers-reduced-motion: no-preference) {
      html { scroll-behavior: smooth; }
    }
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: médio

- [x] **Animação `.reveal` não respeita `prefers-reduced-motion`**
  - 📍 Onde: `assets/css/style.css:266-275`
  - ❌ Problema: o scroll reveal (opacity 0 → 1, translateY) pode causar desconforto para usuários sensíveis a movimento.
  - ✅ Solução:
    ```css
    @media (prefers-reduced-motion: reduce) {
      .reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: médio

---

## 🟡 Recomendadas (refatoração, organização, boas práticas)

- [x] **Imagens do logo sem `width`/`height` declarados — causa CLS**
  - 📍 Onde: `index.html:36-40` (header logo) e `index.html:467` (footer logo)
  - ❌ Problema: o browser não reserva espaço antes de carregar as imagens, causando layout shift. Afeta Core Web Vitals (CLS).
  - ✅ Solução: adicionar dimensões proporcionais. O CSS já limita via `height: 72px; max-width: 200px`, então pode adicionar `width` e `height` nativos:
    ```html
    <img src="assets/logo/logo_main.png" alt="Sentinel Tech - QA" class="logo-image" width="200" height="72" />
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: médio

- [x] **`outline: none` nos inputs sem respeitar `prefers-reduced-motion`** *(trocado para `:focus-visible` com outline contextual)*
  - 📍 Onde: `assets/css/style.css:795` → `.contact-form input, .contact-form textarea { outline: none; }`
  - ❌ Problema: o outline nativo é removido, mas há um `:focus` customizado com `box-shadow` (linha 803-808) — tecnicamente ok. Porém, melhor usar `:focus-visible` para distinguir foco de teclado (onde o ring é importante) de foco por clique (onde pode ser suprimido).
  - ✅ Solução:
    ```css
    .contact-form input,
    .contact-form textarea {
      /* remover outline: none */
    }
    .contact-form input:focus-visible,
    .contact-form textarea:focus-visible {
      border-color: rgba(108, 43, 217, 0.50);
      box-shadow: 0 0 0 3px rgba(108, 43, 217, 0.10);
      background: rgba(255, 255, 255, 0.05);
    }
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: baixo

- [x] **`progress-bar` sem label acessível conectando ao título**
  - 📍 Onde: `index.html:139-147`
  - ❌ Problema: `role="progressbar" aria-valuenow="86"` — o `86%` não tem contexto para leitores de tela. Qual métrica é 86%? Falta `aria-label` ou `aria-labelledby`.
  - ✅ Solução:
    ```html
    <div class="progress-bar" role="progressbar" aria-valuenow="86" aria-valuemin="0" aria-valuemax="100" aria-label="Testing coverage mindset: 86%">
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: baixo

- [ ] **Formulário de contato sem feedback de estado de envio (loading/sucesso/erro)**
  - 📍 Onde: `assets/js/main.js:106-127`
  - ❌ Problema: além do `alert()`, quando integrar com Formspree/EmailJS, o usuário vai precisar de: estado de loading no botão ("Sending..."), mensagem de sucesso inline, mensagem de erro caso falhe a requisição.
  - ✅ Solução: adicionar estados ao botão e à form:
    ```js
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = "Sending...";
    btn.disabled = true;
    // após sucesso:
    form.innerHTML = '<p class="form-success">Message sent! We\'ll be in touch soon.</p>';
    ```
  - ⏱️ Esforço: médio
  - 🎯 Impacto: alto

---

## 🟢 Polimento (consistência visual, microinterações)

- [x] **Menu mobile sem transição de entrada**
  - 📍 Onde: `assets/css/style.css:894-913` → `.nav { display: none } / .nav.active { display: flex }`
  - ❌ Problema: o menu mobile aparece/desaparece abruptamente. O resto do site tem transições suaves em tudo — esse gap é perceptível.
  - ✅ Solução: usar `opacity` + `pointer-events` em vez de `display: none`:
    ```css
    @media (max-width: 860px) {
      .nav {
        /* ... existente ... */
        display: flex; /* manter flex, sempre renderizado */
        opacity: 0;
        pointer-events: none;
        transform: translateY(-8px);
        transition: opacity 250ms ease, transform 250ms ease;
      }
      .nav.active {
        opacity: 1;
        pointer-events: all;
        transform: translateY(0);
      }
    }
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: médio

- [x] **Copyright hardcoded — ficará desatualizado**
  - 📍 Onde: `index.html:468` → `&copy; 2026 Sentinel Tech - QA. All rights reserved.`
  - ❌ Problema: em 2027 ficará desatualizado automaticamente.
  - ✅ Solução: dinamizar via JS (adicionar uma linha ao final de `main.js`):
    ```js
    document.querySelector(".footer-copy").textContent =
      `© ${new Date().getFullYear()} Sentinel Tech - QA. All rights reserved.`;
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: baixo

- [x] **Nav links sem foco visível para navegação por teclado**
  - 📍 Onde: `assets/css/style.css:322-342` → `.nav a` só tem `:hover` e `.active`
  - ❌ Problema: os links do formulário têm foco visual customizado. Os links da nav dependem do outline padrão do browser, que pode ser inconsistente entre browsers.
  - ✅ Solução:
    ```css
    .nav a:focus-visible,
    .btn:focus-visible {
      outline: 2px solid var(--primary-mid);
      outline-offset: 4px;
      border-radius: 4px;
    }
    ```
  - ⏱️ Esforço: baixo
  - 🎯 Impacto: baixo

---

## ✅ O que está muito bem (pontos fortes)

- **JavaScript excelente**: 4 IIFEs isoladas, null guards em todos os seletores, IntersectionObserver para scroll reveal e active nav (sem scroll events — correto e performático), fallback para browsers sem suporte. É o JS mais limpo dos projetos analisados até agora.
- **CSS design tokens muito bem estruturado**: 14 variáveis com nomenclatura semântica (`--t-80`, `--border-subtle`, `--shadow-card-hover`). Facilita manutenção e onboarding de outro dev. Comentado em 18 seções nomeadas.
- **Acessibilidade acima da média**: `aria-label` na nav, `aria-expanded` no hamburger, `aria-controls`, `aria-hidden` nos decorativos, `role="progressbar"` com `aria-valuenow/min/max`, labels associados via `for`/`id` nos campos. Nível de atenção a a11y raro em projetos HTML/CSS/JS puros.
- **`scroll-behavior: smooth` no `html` (e não no `*`)**: diferente do Portfolio, aqui está correto — só falta o `prefers-reduced-motion`.
- **Container com `min()`**: `width: min(100% - 2.5rem, var(--container))` é técnica moderna e elimina a necessidade de media query só para padding lateral.
- **`backdrop-filter` com `-webkit-` prefix**: cobertura de browser correta.
- **Scrollbar customizada com `scrollbar-width: thin`** (Firefox) **+ `::-webkit-scrollbar`** (Chrome/Safari): implementação dual completa.
- **Semântica HTML impecável**: `<header>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<nav>` todos no lugar certo.
