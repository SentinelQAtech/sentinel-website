(function initThemeToggle() {
  const STORAGE_KEY = "sentinel_site_theme";
  const toggle = document.getElementById("themeToggle");

  if (!toggle) return;

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme, shouldSave) {
    const isLight = theme === "light";
    document.documentElement.toggleAttribute("data-theme", isLight);
    if (isLight) {
      document.documentElement.setAttribute("data-theme", "light");
    }

    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");

    if (shouldSave) {
      if (isLight) {
        localStorage.setItem(STORAGE_KEY, "light");
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  applyTheme(currentTheme(), false);

  toggle.addEventListener("click", function () {
    applyTheme(currentTheme() === "light" ? "dark" : "light", true);
  });
})();

(function initLanguageSwitch() {
  const STORAGE_KEY = "sentinel_site_language";
  const switcher = document.getElementById("languageSwitch");
  const toggle = document.getElementById("languageToggle");
  const code = document.getElementById("languageCode");
  const menu = document.getElementById("languageMenu");
  const options = menu ? menu.querySelectorAll("[data-lang-option]") : [];

  if (!switcher || !toggle || !code || !menu || !options.length) return;

  const copy = {
    "en-US": {
      code: "EN",
      htmlLang: "en",
      languageLabel: "Change language",
      languageExpanded: "Close language menu",
      nav: ["Services", "Engagement", "Platform", "Process", "Contact", "Core"],
      hero: {
        eyebrow: "QA & Test Engineering",
        title: "Quality engineering that makes releases safer.",
        subtitle: "Quality You Can Trust.",
        text: "Sentinel Tech - QA helps digital teams reduce production risk through structured manual testing, automation, API validation, performance checks, and operational QA routines.",
        primary: "Talk to Sentinel",
        secondary: "View services",
        proof: ["Manual QA", "Automation", "API Testing", "Release Gates"],
        signalLabel: "Release confidence",
        signalTitle: "QA Gate Active",
        metrics: [
          ["Manual", "Exploratory, regression, smoke"],
          ["Automation", "Playwright, Cypress, Selenium"],
          ["API & Performance", "Postman, JMeter, stability checks"],
        ],
      },
      proof: [
        ["Risk-first QA", "Coverage is planned around business impact, critical flows, and release timing."],
        ["Clear execution", "Every test cycle produces actionable status, evidence, and next-step visibility."],
        ["Operational maturity", "Sentinel Core keeps routines, bugs, dailies, reports, and QA imports connected."],
      ],
      services: {
        eyebrow: "Services",
        title: "QA coverage for modern digital products.",
        text: "A focused quality layer that gives teams clarity before production and confidence at release.",
        cards: [
          ["Manual Testing", "Functional, regression, smoke, exploratory, usability, and responsive validation."],
          ["Automation Testing", "Reliable test automation with Playwright, Cypress, and Selenium for critical flows."],
          ["API Testing", "Endpoint validation, contract checks, payload review, and integration confidence."],
          ["Performance Testing", "Load, stress, and baseline analysis to identify bottlenecks before users do."],
          ["Web & Mobile Testing", "Cross-browser, device, and user journey validation for consistent product experience."],
          ["QA Operations", "Structured routines, quality gates, bug visibility, and release-readiness workflows."],
        ],
      },
      engagement: {
        eyebrow: "Engagement",
        title: "Flexible QA support for each stage of the product.",
        text: "Sentinel adapts to audits, continuous QA operations, and focused automation sprints without adding process noise.",
        cards: [
          ["Quality Audit", "Find release risks before they become incidents.", "Short diagnostic cycle focused on critical flows, bug patterns, and QA gaps."],
          ["QA Operations", "Continuous quality support for active teams.", "Recurring routines for boards, dailies, bug triage, validation, and reports."],
          ["Automation Sprint", "Build practical test automation around key journeys.", "Focused implementation of stable automation for smoke and regression coverage."],
        ],
      },
      platform: {
        eyebrow: "Internal platform",
        title: "Sentinel Core keeps our QA operations connected.",
        text: "A private operational layer for projects, bugs, dailies, QA evidence, and team knowledge. Clients see the result: cleaner execution and steadier releases.",
        button: "Open Sentinel Core",
        cards: [
          ["Core", "Internal QA Operations", "Projects, boards, bugs, clients, daily routines, reports, and notifications."],
          ["Learning", "Team enablement", "Internal standards, QA references, and onboarding knowledge."],
          ["Extension", "QA data capture", "Fast import flow for cards, test notes, and operational QA context."],
        ],
      },
      process: {
        eyebrow: "Process",
        title: "Simple, technical, and accountable.",
        cards: [
          ["Discover", "Understand product, risks, environments, and release goals."],
          ["Validate", "Run targeted manual, API, regression, and automation checks."],
          ["Report", "Deliver clear bug details, status visibility, and practical recommendations."],
          ["Improve", "Strengthen coverage, routines, and quality gates over time."],
        ],
      },
      contact: {
        eyebrow: "Contact",
        title: "Ready to build more confidence into your releases?",
        text: "Tell us about your product, team, and current quality challenges. We will help you shape a practical QA plan.",
        mapTitle: "What we can map first",
        mapText: "Critical flows, current bug process, release routine, automation opportunity, and QA priorities.",
        name: "Name",
        namePlaceholder: "Your name",
        email: "Work email",
        emailPlaceholder: "you@company.com",
        message: "Project context",
        messagePlaceholder: "Tell us what you need to validate.",
        submit: "Send message",
      },
      form: {
        nameError: "Please enter your name.",
        emailError: "Please enter a valid work email.",
        messageError: "Please describe your project context.",
        sending: "Sending...",
        success: "Message sent! We will be in touch within 1 business day.",
        failure: "Something went wrong. Email us at contato@sentinelqa.tech",
        network: "Network error. Check your connection and try again.",
      },
      footer: "All rights reserved.",
    },
    "pt-BR": {
      code: "PT",
      htmlLang: "pt-BR",
      languageLabel: "Alterar idioma",
      languageExpanded: "Fechar menu de idioma",
      nav: ["Serviços", "Atuação", "Plataforma", "Processo", "Contato", "Core"],
      hero: {
        eyebrow: "QA & Engenharia de Testes",
        title: "Engenharia de qualidade que torna releases mais seguros.",
        subtitle: "Qualidade em que você pode confiar.",
        text: "A Sentinel Tech - QA ajuda times digitais a reduzir risco em produção com testes manuais estruturados, automação, validação de APIs, checagens de performance e rotinas operacionais de QA.",
        primary: "Fale com a Sentinel",
        secondary: "Ver serviços",
        proof: ["QA Manual", "Automação", "Teste de API", "Release Gates"],
        signalLabel: "Confiança no release",
        signalTitle: "QA Gate Ativo",
        metrics: [
          ["Manual", "Exploratório, regressão, smoke"],
          ["Automação", "Playwright, Cypress, Selenium"],
          ["API & Performance", "Postman, JMeter, checagens de estabilidade"],
        ],
      },
      proof: [
        ["QA orientado a risco", "A cobertura é planejada com base em impacto de negócio, fluxos críticos e timing de release."],
        ["Execução clara", "Cada ciclo de testes gera status acionável, evidências e visibilidade dos próximos passos."],
        ["Maturidade operacional", "O Sentinel Core mantém rotinas, bugs, dailies, relatórios e importações de QA conectados."],
      ],
      services: {
        eyebrow: "Serviços",
        title: "Cobertura de QA para produtos digitais modernos.",
        text: "Uma camada de qualidade focada que traz clareza antes da produção e confiança no release.",
        cards: [
          ["Testes Manuais", "Validação funcional, regressão, smoke, exploratória, usabilidade e responsividade."],
          ["Testes Automatizados", "Automação confiável com Playwright, Cypress e Selenium para fluxos críticos."],
          ["Testes de API", "Validação de endpoints, contratos, payloads e confiança em integrações."],
          ["Testes de Performance", "Análise de carga, stress e baseline para identificar gargalos antes dos usuários."],
          ["Testes Web & Mobile", "Validação cross-browser, dispositivos e jornadas para uma experiência consistente."],
          ["Operações de QA", "Rotinas estruturadas, quality gates, visibilidade de bugs e fluxos de prontidão para release."],
        ],
      },
      engagement: {
        eyebrow: "Atuação",
        title: "Suporte flexível de QA para cada fase do produto.",
        text: "A Sentinel se adapta a auditorias, operação contínua de QA e sprints de automação sem adicionar ruído ao processo.",
        cards: [
          ["Auditoria de Qualidade", "Encontre riscos de release antes que virem incidentes.", "Ciclo diagnóstico curto focado em fluxos críticos, padrões de bugs e lacunas de QA."],
          ["Operações de QA", "Suporte contínuo de qualidade para times ativos.", "Rotinas recorrentes para boards, dailies, triagem de bugs, validação e relatórios."],
          ["Sprint de Automação", "Crie automação prática ao redor das jornadas-chave.", "Implementação focada de automação estável para cobertura de smoke e regressão."],
        ],
      },
      platform: {
        eyebrow: "Plataforma interna",
        title: "O Sentinel Core mantém nossa operação de QA conectada.",
        text: "Uma camada operacional privada para projetos, bugs, dailies, evidências de QA e conhecimento do time. O cliente vê o resultado: execução mais limpa e releases mais estáveis.",
        button: "Abrir Sentinel Core",
        cards: [
          ["Core", "Operações internas de QA", "Projetos, boards, bugs, clientes, rotinas diárias, relatórios e notificações."],
          ["Learning", "Capacitação do time", "Padrões internos, referências de QA e conhecimento de onboarding."],
          ["Extension", "Captura de dados de QA", "Fluxo rápido de importação para cards, notas de teste e contexto operacional de QA."],
        ],
      },
      process: {
        eyebrow: "Processo",
        title: "Simples, técnico e responsável.",
        cards: [
          ["Descobrir", "Entender produto, riscos, ambientes e objetivos de release."],
          ["Validar", "Executar checagens direcionadas manuais, API, regressão e automação."],
          ["Reportar", "Entregar detalhes claros de bugs, visibilidade de status e recomendações práticas."],
          ["Evoluir", "Fortalecer cobertura, rotinas e quality gates ao longo do tempo."],
        ],
      },
      contact: {
        eyebrow: "Contato",
        title: "Pronto para colocar mais confiança nos seus releases?",
        text: "Conte sobre seu produto, time e desafios atuais de qualidade. Vamos ajudar você a estruturar um plano prático de QA.",
        mapTitle: "O que podemos mapear primeiro",
        mapText: "Fluxos críticos, processo atual de bugs, rotina de release, oportunidade de automação e prioridades de QA.",
        name: "Nome",
        namePlaceholder: "Seu nome",
        email: "Email profissional",
        emailPlaceholder: "voce@empresa.com",
        message: "Contexto do projeto",
        messagePlaceholder: "Conte o que você precisa validar.",
        submit: "Enviar mensagem",
      },
      form: {
        nameError: "Informe seu nome.",
        emailError: "Informe um email profissional válido.",
        messageError: "Descreva o contexto do projeto.",
        sending: "Enviando...",
        success: "Mensagem enviada! Entraremos em contato em até 1 dia útil.",
        failure: "Algo deu errado. Envie um email para contato@sentinelqa.tech",
        network: "Erro de conexão. Verifique sua internet e tente novamente.",
      },
      footer: "Todos os direitos reservados.",
    },
    es: {
      code: "ES",
      htmlLang: "es",
      languageLabel: "Cambiar idioma",
      languageExpanded: "Cerrar menú de idioma",
      nav: ["Servicios", "Modelo", "Plataforma", "Proceso", "Contacto", "Core"],
      hero: {
        eyebrow: "QA & Ingeniería de Pruebas",
        title: "Ingeniería de calidad que hace los releases más seguros.",
        subtitle: "Calidad en la que puedes confiar.",
        text: "Sentinel Tech - QA ayuda a equipos digitales a reducir riesgo en producción con pruebas manuales estructuradas, automatización, validación de APIs, checks de performance y rutinas operativas de QA.",
        primary: "Hablar con Sentinel",
        secondary: "Ver servicios",
        proof: ["QA Manual", "Automatización", "Pruebas API", "Release Gates"],
        signalLabel: "Confianza en el release",
        signalTitle: "QA Gate Activo",
        metrics: [
          ["Manual", "Exploratorio, regresión, smoke"],
          ["Automatización", "Playwright, Cypress, Selenium"],
          ["API & Performance", "Postman, JMeter, checks de estabilidad"],
        ],
      },
      proof: [
        ["QA basado en riesgo", "La cobertura se planifica según impacto de negocio, flujos críticos y timing de release."],
        ["Ejecución clara", "Cada ciclo de pruebas genera estado accionable, evidencias y visibilidad de próximos pasos."],
        ["Madurez operativa", "Sentinel Core mantiene rutinas, bugs, dailies, reportes e importaciones de QA conectados."],
      ],
      services: {
        eyebrow: "Servicios",
        title: "Cobertura de QA para productos digitales modernos.",
        text: "Una capa de calidad enfocada que aporta claridad antes de producción y confianza en el release.",
        cards: [
          ["Pruebas Manuales", "Validación funcional, regresión, smoke, exploratoria, usabilidad y responsividad."],
          ["Pruebas Automatizadas", "Automatización confiable con Playwright, Cypress y Selenium para flujos críticos."],
          ["Pruebas de API", "Validación de endpoints, contratos, payloads y confianza en integraciones."],
          ["Pruebas de Performance", "Análisis de carga, stress y baseline para identificar cuellos de botella antes que los usuarios."],
          ["Pruebas Web & Mobile", "Validación cross-browser, dispositivos y journeys para una experiencia consistente."],
          ["Operaciones de QA", "Rutinas estructuradas, quality gates, visibilidad de bugs y workflows de preparación de release."],
        ],
      },
      engagement: {
        eyebrow: "Modelo",
        title: "Soporte flexible de QA para cada etapa del producto.",
        text: "Sentinel se adapta a auditorías, operación continua de QA y sprints de automatización sin añadir ruido al proceso.",
        cards: [
          ["Auditoría de Calidad", "Encuentra riesgos de release antes de que se vuelvan incidentes.", "Ciclo diagnóstico corto enfocado en flujos críticos, patrones de bugs y brechas de QA."],
          ["Operaciones de QA", "Soporte continuo de calidad para equipos activos.", "Rutinas recurrentes para boards, dailies, triage de bugs, validación y reportes."],
          ["Sprint de Automatización", "Construye automatización práctica alrededor de journeys clave.", "Implementación enfocada de automatización estable para cobertura smoke y regresión."],
        ],
      },
      platform: {
        eyebrow: "Plataforma interna",
        title: "Sentinel Core mantiene conectada nuestra operación de QA.",
        text: "Una capa operativa privada para proyectos, bugs, dailies, evidencias de QA y conocimiento del equipo. El cliente ve el resultado: ejecución más limpia y releases más estables.",
        button: "Abrir Sentinel Core",
        cards: [
          ["Core", "Operaciones internas de QA", "Proyectos, boards, bugs, clientes, rutinas diarias, reportes y notificaciones."],
          ["Learning", "Habilitación del equipo", "Estándares internos, referencias de QA y conocimiento de onboarding."],
          ["Extension", "Captura de datos de QA", "Flujo rápido de importación para cards, notas de prueba y contexto operativo de QA."],
        ],
      },
      process: {
        eyebrow: "Proceso",
        title: "Simple, técnico y responsable.",
        cards: [
          ["Descubrir", "Entender producto, riesgos, ambientes y objetivos de release."],
          ["Validar", "Ejecutar checks dirigidos manuales, API, regresión y automatización."],
          ["Reportar", "Entregar detalles claros de bugs, visibilidad de estado y recomendaciones prácticas."],
          ["Mejorar", "Fortalecer cobertura, rutinas y quality gates con el tiempo."],
        ],
      },
      contact: {
        eyebrow: "Contacto",
        title: "¿Listo para construir más confianza en tus releases?",
        text: "Cuéntanos sobre tu producto, equipo y desafíos actuales de calidad. Te ayudaremos a formar un plan práctico de QA.",
        mapTitle: "Lo que podemos mapear primero",
        mapText: "Flujos críticos, proceso actual de bugs, rutina de release, oportunidad de automatización y prioridades de QA.",
        name: "Nombre",
        namePlaceholder: "Tu nombre",
        email: "Email profesional",
        emailPlaceholder: "tu@empresa.com",
        message: "Contexto del proyecto",
        messagePlaceholder: "Cuéntanos qué necesitas validar.",
        submit: "Enviar mensaje",
      },
      form: {
        nameError: "Ingresa tu nombre.",
        emailError: "Ingresa un email profesional válido.",
        messageError: "Describe el contexto del proyecto.",
        sending: "Enviando...",
        success: "Mensaje enviado. Te contactaremos dentro de 1 día hábil.",
        failure: "Algo salió mal. Escríbenos a contato@sentinelqa.tech",
        network: "Error de conexión. Revisa tu conexión e inténtalo otra vez.",
      },
      footer: "Todos los derechos reservados.",
    },
  };

  const selectors = {
    nav: ".nav a",
    heroProof: ".hero-proof span",
    heroMetrics: ".hero-metrics a",
    proofCards: ".proof-card",
    serviceCards: ".service-card",
    engagementCards: ".engagement-card",
    platformCards: ".panel-row",
    processCards: ".process-step",
  };

  function text(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function placeholder(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("placeholder", value);
  }

  function applyLanguage(lang, shouldSave) {
    const t = copy[lang] || copy["en-US"];
    document.documentElement.lang = t.htmlLang;
    code.textContent = t.code;
    toggle.setAttribute("aria-label", t.languageLabel);
    toggle.setAttribute("aria-expanded", "false");
    switcher.classList.remove("active");

    document.querySelectorAll(selectors.nav).forEach(function (el, index) {
      if (t.nav[index]) el.textContent = t.nav[index];
    });

    text(".hero .eyebrow", t.hero.eyebrow);
    text(".hero h1", t.hero.title);
    text(".hero-subtitle", t.hero.subtitle);
    text(".hero-text", t.hero.text);
    text(".hero-actions .btn-primary", t.hero.primary);
    text(".hero-actions .btn-secondary", t.hero.secondary);
    document.querySelectorAll(selectors.heroProof).forEach(function (el, index) {
      if (t.hero.proof[index]) el.textContent = t.hero.proof[index];
    });
    text(".signal-card span", t.hero.signalLabel);
    text(".signal-card strong", t.hero.signalTitle);
    document.querySelectorAll(selectors.heroMetrics).forEach(function (item, index) {
      const values = t.hero.metrics[index];
      if (!values) return;
      const title = item.querySelector("strong");
      const body = item.querySelector("span");
      if (title) title.textContent = values[0];
      if (body) body.textContent = values[1];
    });

    document.querySelectorAll(selectors.proofCards).forEach(function (card, index) {
      const values = t.proof[index];
      if (!values) return;
      const title = card.querySelector("strong");
      const body = card.querySelector("p");
      if (title) title.textContent = values[0];
      if (body) body.textContent = values[1];
    });

    text("#services .section-head .eyebrow", t.services.eyebrow);
    text("#services .section-head h2", t.services.title);
    text("#services .section-head p", t.services.text);
    document.querySelectorAll(selectors.serviceCards).forEach(function (card, index) {
      const values = t.services.cards[index];
      if (!values) return;
      const title = card.querySelector("h3");
      const body = card.querySelector("p");
      if (title) title.textContent = values[0];
      if (body) body.textContent = values[1];
    });

    text("#engagement .eyebrow", t.engagement.eyebrow);
    text("#engagement h2", t.engagement.title);
    text("#engagement .section-head p", t.engagement.text);
    document.querySelectorAll(selectors.engagementCards).forEach(function (card, index) {
      const values = t.engagement.cards[index];
      if (!values) return;
      const label = card.querySelector("span");
      const title = card.querySelector("h3");
      const body = card.querySelector("p");
      if (label) label.textContent = values[0];
      if (title) title.textContent = values[1];
      if (body) body.textContent = values[2];
    });

    text("#platform .eyebrow", t.platform.eyebrow);
    text("#platform h2", t.platform.title);
    text("#platform .platform-copy p", t.platform.text);
    text("#platform .btn", t.platform.button);
    document.querySelectorAll(selectors.platformCards).forEach(function (card, index) {
      const values = t.platform.cards[index];
      if (!values) return;
      const label = card.querySelector("span");
      const title = card.querySelector("strong");
      const body = card.querySelector("p");
      if (label) label.textContent = values[0];
      if (title) title.textContent = values[1];
      if (body) body.textContent = values[2];
    });

    text("#process .eyebrow", t.process.eyebrow);
    text("#process h2", t.process.title);
    document.querySelectorAll(selectors.processCards).forEach(function (card, index) {
      const values = t.process.cards[index];
      if (!values) return;
      const title = card.querySelector("h3");
      const body = card.querySelector("p");
      if (title) title.textContent = values[0];
      if (body) body.textContent = values[1];
    });

    text("#contact .eyebrow", t.contact.eyebrow);
    text("#contact h2", t.contact.title);
    text("#contact .contact-copy > p", t.contact.text);
    text(".contact-summary strong", t.contact.mapTitle);
    text(".contact-summary span", t.contact.mapText);
    text("label[for='name']", t.contact.name);
    text("label[for='email']", t.contact.email);
    text("label[for='message']", t.contact.message);
    placeholder("#name", t.contact.namePlaceholder);
    placeholder("#email", t.contact.emailPlaceholder);
    placeholder("#message", t.contact.messagePlaceholder);
    text("#contactForm button[type='submit']", t.contact.submit);
    updateCopyright(t);

    options.forEach(function (option) {
      option.classList.toggle("active", option.getAttribute("data-lang-option") === lang);
    });

    window.sentinelLanguage = { current: lang, copy: t };

    if (shouldSave) localStorage.setItem(STORAGE_KEY, lang);
  }

  function updateCopyright(t) {
    const footer = document.querySelector(".footer-copy");
    if (footer) {
      footer.textContent = `\u00A9 ${new Date().getFullYear()} Sentinel Tech - QA. ${t.footer}`;
    }
  }

  toggle.addEventListener("click", function () {
    const isOpen = switcher.classList.toggle("active");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? copy[getLanguage()].languageExpanded : copy[getLanguage()].languageLabel);
  });

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      applyLanguage(option.getAttribute("data-lang-option"), true);
    });
  });

  document.addEventListener("click", function (event) {
    if (!switcher.contains(event.target)) {
      switcher.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", copy[getLanguage()].languageLabel);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      switcher.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", copy[getLanguage()].languageLabel);
    }
  });

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return copy[saved] ? saved : "en-US";
  }

  applyLanguage(getLanguage(), false);
})();

(function initMobileNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navMenu");

  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    var firstLink = nav.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    nav.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.focus();
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

  document.addEventListener("click", function (e) {
    if (
      toggle.getAttribute("aria-expanded") === "true" &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
})();

(function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0 }
  );

  elements.forEach((element) => observer.observe(element));
})();

(function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();

(function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !status || !submitBtn) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    clearFieldErrors(form);
    status.textContent = "";
    status.className = "form-status";

    let hasError = false;
    if (!name) {
      showFieldError(form, "name", i18nFormCopy().nameError);
      hasError = true;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(form, "email", i18nFormCopy().emailError);
      hasError = true;
    }
    if (!message) {
      showFieldError(form, "message", i18nFormCopy().messageError);
      hasError = true;
    }
    if (hasError) return;

    submitBtn.disabled = true;
    submitBtn.textContent = i18nFormCopy().sending;

    try {
      const response = await fetch("https://formspree.io/f/mvzyajaa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, message: message }),
      });

      if (response.ok) {
        form.reset();
        status.textContent = i18nFormCopy().success;
        status.className = "form-status form-status--success";
      } else {
        status.textContent = i18nFormCopy().failure;
        status.className = "form-status form-status--error";
      }
    } catch (_) {
      status.textContent = i18nFormCopy().network;
      status.className = "form-status form-status--error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = i18nContactCopy().submit;
    }
  });

  function i18nFormCopy() {
    return window.sentinelLanguage && window.sentinelLanguage.copy
      ? window.sentinelLanguage.copy.form
      : {
          nameError: "Please enter your name.",
          emailError: "Please enter a valid work email.",
          messageError: "Please describe your project context.",
          sending: "Sending...",
          success: "Message sent! We will be in touch within 1 business day.",
          failure: "Something went wrong. Email us at contato@sentinelqa.tech",
          network: "Network error. Check your connection and try again.",
        };
  }

  function i18nContactCopy() {
    return window.sentinelLanguage && window.sentinelLanguage.copy
      ? window.sentinelLanguage.copy.contact
      : { submit: "Send message" };
  }

  function showFieldError(form, fieldId, message) {
    const field = form.querySelector("#" + fieldId);
    if (!field) return;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", fieldId + "-error");
    const errorEl = document.createElement("span");
    errorEl.id = fieldId + "-error";
    errorEl.className = "field-error";
    errorEl.setAttribute("role", "alert");
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
    field.focus();
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".field-error").forEach(function (el) { el.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
    });
  }
})();

(function initCopyright() {
  const copy = document.querySelector(".footer-copy");
  if (copy) {
    const suffix = window.sentinelLanguage && window.sentinelLanguage.copy
      ? window.sentinelLanguage.copy.footer
      : "All rights reserved.";
    copy.textContent = `\u00A9 ${new Date().getFullYear()} Sentinel Tech - QA. ${suffix}`;
  }
})();
