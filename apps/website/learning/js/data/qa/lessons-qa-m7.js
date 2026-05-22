// Sentinel Learning — QA M7: QA no Mercado
window.QA_M7 = [

  // ─── 7.1 ───────────────────────────────────────────────
  {
    module: 7, lesson: 1,
    title: 'O Mercado de QA em 2025',
    tag: 'Carreira', duration: '18 min', xp: 100,
    sections: [
      { type: 'text', content: `
        <h2>O estado atual do mercado de QA</h2>
        <p>A demanda por QA Engineers cresceu significativamente com a digitalização acelerada. Mas o perfil que o mercado busca mudou: de "testador manual" para <strong>QA Engineer</strong> — alguém que escreve código, configura pipelines e pensa estrategicamente em qualidade.</p>

        <h2>Os perfis de QA mais demandados</h2>
        <pre><code class="language-text">QA Engineer (Automation)
  → Playwright, Cypress, Selenium
  → TypeScript/JavaScript ou Python/Java
  → CI/CD, GitHub Actions
  → Salário BR: R$ 5.000 – R$ 12.000
  → Remoto internacional: $40k – $80k/ano

SDET (Software Development Engineer in Test)
  → Código de produção E testes
  → Frameworks próprios de teste
  → Mais dev do que QA tradicional
  → Salário: R$ 10.000 – R$ 20.000+

QA Lead / QA Manager
  → Estratégia, métricas, gestão de time
  → Comunicação com stakeholders
  → Salário: R$ 12.000 – R$ 25.000+

QA Engineer (API / Performance)
  → Postman, K6, Gatling, JMeter
  → Sistemas distribuídos, microserviços</code></pre>

        <h2>Stack mais pedida nas vagas (2025)</h2>
        <pre><code class="language-text">Automação:     Playwright ★★★★★  Cypress ★★★★  Selenium ★★★
Linguagem:     TypeScript ★★★★★  Python ★★★★  Java ★★★
API Testing:   Postman ★★★★★  Rest Assured ★★★
CI/CD:         GitHub Actions ★★★★★  Jenkins ★★★
Tracking:      Jira ★★★★★  Linear ★★★  Azure DevOps ★★★
Performance:   K6 ★★★  JMeter ★★  Gatling ★★
Containers:    Docker ★★★  básico</code></pre>

        <h2>O que diferencia candidatos</h2>
        <ul>
          <li>Portfólio com testes reais no GitHub</li>
          <li>Capacidade de explicar estratégia, não só execução</li>
          <li>Conhecimento de CI/CD na prática</li>
          <li>Comunicação clara de bugs e riscos</li>
          <li>Mentalidade de produto, não só de teste</li>
        </ul>

        <div class="callout callout-cyan">
          <strong>Oportunidade real:</strong> No Brasil, ainda há poucos QAs com automação sólida em Playwright + TypeScript + CI/CD. Dominar essa stack coloca você no top 10% do mercado nacional e abre portas para remote internacional.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-7-1-ex1',
        prompt: 'Pesquise (ou baseie-se no que sabe) 3 vagas de QA Engineer que te interessam. Para cada uma, liste: os requisitos técnicos pedidos, os diferenciais desejados, e o quanto você já atende cada requisito. Isso vai revelar seus gaps de aprendizado.',
        placeholder: 'Sua análise de vagas aqui...' }
    ]
  },

  // ─── 7.2 ───────────────────────────────────────────────
  {
    module: 7, lesson: 2,
    title: 'Construindo seu Portfólio de QA',
    tag: 'Portfólio', duration: '26 min', xp: 130,
    sections: [
      { type: 'text', content: `
        <h2>Por que portfólio importa em QA</h2>
        <p>QA é uma área onde "diz que sabe" não convence — o recrutador quer ver evidências. Um portfólio bem construído substitui anos de experiência formal e abre portas para posições remotas e internacionais.</p>

        <h2>O que colocar no portfólio</h2>

        <h3>1. Suite de testes E2E com Playwright</h3>
        <pre><code class="language-text">Projeto ideal:
  ├── tests/
  │   ├── auth/
  │   │   ├── login.spec.ts
  │   │   └── logout.spec.ts
  │   ├── checkout/
  │   │   ├── happy-path.spec.ts
  │   │   └── payment-errors.spec.ts
  │   └── api/
  │       └── users.spec.ts
  ├── pages/
  │   ├── LoginPage.ts       (Page Objects)
  │   └── CheckoutPage.ts
  ├── fixtures/
  │   └── test-data.ts
  ├── playwright.config.ts
  ├── .github/
  │   └── workflows/qa.yml   (CI configurado!)
  └── README.md              (documentado)</code></pre>

        <h3>2. Coleção de testes de API no Postman</h3>
        <p>Exporte como JSON, versione no GitHub, documente no README. Mostre que você testou cenários positivos, negativos, autenticação e contrato.</p>

        <h3>3. Bug reports de sistemas reais</h3>
        <p>Use aplicações públicas (Swag Labs, The Internet, JSONPlaceholder) para criar bug reports profissionais com evidências (screenshots, gravação de tela).</p>

        <h3>4. Plano de teste documentado</h3>
        <p>Crie um plano de teste para uma feature fictícia ou de um projeto open source. Mostra raciocínio estratégico.</p>

        <h2>README que impressiona</h2>
        <pre><code class="language-markdown"># Suite QA — [Nome do Projeto]

## Sobre
Suite de testes E2E cobrindo os fluxos críticos de [o que o sistema faz].

## Stack
- Playwright + TypeScript
- Page Object Model
- CI/CD via GitHub Actions

## Como rodar
\`\`\`bash
npm install
npx playwright install
npx playwright test
\`\`\`

## Cobertura
- ✅ Login / Logout
- ✅ Cadastro com validações
- ✅ Checkout — fluxo completo
- ✅ API — CRUD de usuários

## Resultados
Ver [último relatório](link-do-artifact)
</code></pre>

        <h2>Onde hospedar</h2>
        <pre><code class="language-text">GitHub         → código + README + CI configurado (obrigatório)
LinkedIn       → projetos e posts sobre QA (visibilidade)
Portfolio site → opcional, mas diferencia
Medium/Dev.to  → artigos técnicos (autoridade)</code></pre>

        <div class="callout callout-purple">
          <strong>Erro comum:</strong> Portfólio com prints de certificados e nenhum código. Recrutador técnico quer ver repositório funcionando, CI verde, testes bem escritos. Certificado é complemento, não substituto.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-7-2-ex1',
        prompt: 'Descreva o projeto de portfólio que você vai criar para demonstrar suas habilidades de QA: qual sistema vai testar (pode ser público como Swag Labs, GitHub, etc.), quais tipos de teste vai implementar, qual a estrutura do repositório, e como vai documentar para um recrutador entender rapidamente.',
        placeholder: 'Seu plano de portfólio aqui...' }
    ]
  },

  // ─── 7.3 ───────────────────────────────────────────────
  {
    module: 7, lesson: 3,
    title: 'Entrevistas técnicas de QA',
    tag: 'Carreira', duration: '28 min', xp: 140,
    sections: [
      { type: 'text', content: `
        <h2>Como funcionam as entrevistas de QA</h2>
        <p>Entrevistas de QA Engineer costumam ter 3 a 4 etapas: triagem de RH, entrevista técnica (behavioral + teoria), desafio técnico prático e entrevista final com o time.</p>

        <h2>Perguntas mais comuns — com respostas de qualidade</h2>

        <h3>"Qual a diferença entre bug e defeito?"</h3>
        <pre><code class="language-text">Resposta mediana: "Bug é um erro no código, defeito é quando
o comportamento difere do esperado."

Resposta sênior: "Na prática uso os termos de forma intercambiável,
mas formalmente: defeito é qualquer desvio em relação ao
requisito (pode ser no código, na doc, no processo). Bug é o
defeito encontrado durante execução. O que importa é: está
documentado de forma reproduzível, com impacto claro, e
priorizado para o time agir."</code></pre>

        <h3>"Como você priorizaria bugs?"</h3>
        <pre><code class="language-text">Resposta esperada:
Severidade × Impacto no usuário × Risco de negócio.

Específico: críticos (sistema inacessível, perda de dados,
segurança) vão para hotfix imediato. Altos bloqueiam a release.
Médios entram no próximo sprint. Baixos ficam no backlog.

Mas a prioridade é uma negociação com produto — QA avalia
severidade, produto avalia prioridade de negócio.</code></pre>

        <h3>"Me dê exemplos de como você usou Playwright"</h3>
        <pre><code class="language-text">Use o modelo STAR:
Situação: "Tínhamos fluxo de checkout com 0% de automação,
bugs chegavam em produção toda semana."

Tarefa: "Fiquei responsável por automatizar os fluxos críticos."

Ação: "Estruturei uma suite com Page Objects, fixtures para
dados de teste, e integrei ao CI no GitHub Actions.
Cubri happy path, erros de cartão, e estoque zerado."

Resultado: "Em 2 sprints, 3 bugs críticos foram detectados
pelo CI antes do deploy. Escape rate caiu de 20% para 5%."</code></pre>

        <h2>Desafio técnico típico</h2>
        <pre><code class="language-text">Cenário comum:
"Automatize o fluxo de login e criação de conta no site X"

O que avaliam:
  ✓ Estrutura do código (Page Objects, fixtures)
  ✓ Seletores estáveis (getByRole, getByLabel — não XPath)
  ✓ Assertions corretas e descritivas
  ✓ Tratamento de estados (loading, erro, sucesso)
  ✓ README explicando como rodar
  ✓ CI configurado (diferencial)</code></pre>

        <h2>Perguntas que VOCÊ deve fazer</h2>
        <pre><code class="language-text">✓ "Qual é o maior desafio de qualidade que o time enfrenta hoje?"
✓ "Como é o processo de QA no ciclo de desenvolvimento?"
✓ "Qual a proporção devs/QAs e como colaboram?"
✓ "Existe CI/CD? Os testes bloqueiam o deploy?"
✓ "Como são tratados bugs encontrados em produção?"</code></pre>

        <div class="callout callout-cyan">
          <strong>Sinal de empresa saudável:</strong> QA envolvido desde a spec, testes no CI, postmortems sem culpa, métricas acompanhadas. Fuja de empresas onde QA só testa no final e deploy é manual.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-7-3-ex1',
        prompt: 'Prepare sua resposta para: "Me conte sobre um bug crítico que você encontrou ou resolveu. Como identificou, reportou e qual foi o impacto?" Se não tem experiência real ainda, crie um cenário realista baseado no que aprendeu no curso. Use o modelo STAR (Situação, Tarefa, Ação, Resultado).',
        placeholder: 'Sua resposta em STAR aqui...' }
    ]
  },

  // ─── 7.4 ───────────────────────────────────────────────
  {
    module: 7, lesson: 4,
    title: 'Certificações e Aprendizado Contínuo',
    tag: 'Carreira', duration: '18 min', xp: 100,
    sections: [
      { type: 'text', content: `
        <h2>Certificações que valem a pena</h2>

        <h3>CTFL — ISTQB Foundation Level</h3>
        <p>A certificação mais reconhecida internacionalmente em QA. Cobre fundamentos de teoria de testes. Exigida em alguns processos seletivos, especialmente em empresas de outsourcing e consultoria. Custo: ~$300 USD. Vale fazer depois que você tiver a base prática.</p>

        <h3>CTAL — ISTQB Advanced Level</h3>
        <p>Para QA Lead / Test Manager. Três especializações: Test Analyst, Technical Test Analyst, Test Manager. Requer experiência e a CTFL como pré-requisito.</p>

        <h3>Playwright e Cypress (certificações da plataforma)</h3>
        <p>Menos reconhecidas que ISTQB, mas demonstram conhecimento técnico específico. Úteis para posições que listam explicitamente a ferramenta.</p>

        <h2>Plataformas de aprendizado</h2>
        <pre><code class="language-text">Técnico / Prático:
  → Playwright Docs (playwright.dev)   — referência oficial
  → Udemy — cursos de automação
  → Test Automation University (gratuito) — Applitools
  → Execute Automation (YouTube)

Teoria / Estratégia:
  → ISTQB syllabus (gratuito em PDF)
  → Ministry of Testing
  → "Agile Testing" — Lisa Crispin & Janet Gregory (livro)

Prática:
  → Swag Labs (saucedemo.com)    — app de prática
  → The Internet (herokuapp.com) — app de prática
  → JSONPlaceholder              — API de prática
  → Trello / GitHub Issues       — sistemas reais</code></pre>

        <h2>Comunidades e networking</h2>
        <pre><code class="language-text">BR:
  → QA Brasil (grupos no Slack, LinkedIn)
  → Testing Days Brasil (evento)
  → SoftExpert Community

Internacional:
  → Ministry of Testing (comunidade global)
  → TestingConferences.com
  → r/QualityAssurance no Reddit</code></pre>

        <h2>Rotina de aprendizado para QA</h2>
        <pre><code class="language-text">Diário:
  → 30 min de código: avance num projeto de portfólio
  → Ler um artigo ou assistir um vídeo curto

Semanal:
  → Contribua com algo no GitHub
  → Poste no LinkedIn sobre algo que aprendeu

Mensal:
  → Revise seu portfólio e atualize
  → Participe de um evento ou meetup online</code></pre>

        <div class="callout callout-purple">
          <strong>Prioritize prática:</strong> Um repositório com Playwright + CI + Page Objects + README bem documentado vale mais que 5 certificados sem código. Faça ambos, mas nessa ordem.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-7-4-ex1',
        prompt: 'Monte seu plano de desenvolvimento profissional para os próximos 3 meses: o que você vai estudar, o que vai construir para o portfólio, quais comunidades vai participar, e qual é o seu objetivo concreto ao final desse período (tipo de vaga, nível, empresa). Seja específico com datas e entregas.',
        placeholder: 'Seu PDI aqui...' }
    ]
  },

  // ─── 7.5 ───────────────────────────────────────────────
  {
    module: 7, lesson: 5,
    title: 'Projeto Final — Sua Suite Completa de QA',
    tag: 'Projeto Final', duration: '60 min', xp: 300,
    sections: [
      { type: 'text', content: `
        <h2>Projeto final do curso</h2>
        <p>Este é o ponto de chegada do curso de QA Engineering. Você vai planejar e documentar uma suite completa de qualidade — juntando tudo que aprendeu nos 7 módulos.</p>

        <h2>O que entregar</h2>
        <p>Escolha um sistema para testar. Pode ser:</p>
        <ul>
          <li><strong>Swag Labs</strong> (saucedemo.com) — e-commerce de prática</li>
          <li><strong>JSONPlaceholder</strong> — API pública</li>
          <li><strong>Um projeto seu</strong> ou open source</li>
        </ul>

        <h2>Estrutura da entrega</h2>

        <h3>1. Plano de Teste</h3>
        <pre><code class="language-text">- Escopo (o que será testado)
- Tipos de teste (manual, automatizado, API, exploratório)
- Ferramentas escolhidas e justificativa
- Critérios de entrada e saída
- Riscos e mitigação</code></pre>

        <h3>2. Suite de Testes Manuais</h3>
        <pre><code class="language-text">- Mínimo 10 casos de teste (formato: ID, título, passos, resultado esperado)
- Cobrindo fluxo principal + 3 cenários negativos + 2 edge cases</code></pre>

        <h3>3. Automação com Playwright</h3>
        <pre><code class="language-text">- Mínimo 5 testes E2E automatizados
- Page Objects implementados
- CI configurado (GitHub Actions)</code></pre>

        <h3>4. Testes de API</h3>
        <pre><code class="language-text">- Coleção Postman exportada
- Mínimo 8 requests com assertions
- Cenários positivos e negativos</code></pre>

        <h3>5. Bug Reports</h3>
        <pre><code class="language-text">- 2 bug reports no formato profissional
- Com passos reproduzíveis, resultado atual vs esperado</code></pre>

        <h3>6. Métricas e Cobertura</h3>
        <pre><code class="language-text">- Resumo: quantos fluxos testados, % automatizado
- Riscos não cobertos e justificativa
- Próximos passos sugeridos</code></pre>

        <h2>Referências dos módulos anteriores</h2>
        <pre><code class="language-text">M1 → Fundamentos: pirâmide, tipos de teste, critérios de aceite
M2 → Casos de teste, bug reports no formato correto
M3 → Playwright: Page Objects, fixtures, CI
M4 → Postman: coleção, assertions, contrato
M5 → GitHub Actions: pipeline, artifacts, notificações
M6 → Plano de teste, análise de risco, métricas
M7 → Portfólio: README, documentação para recrutadores</code></pre>

        <div class="callout callout-cyan">
          <strong>Parabéns por chegar até aqui.</strong> Você passou por fundamentos, testes manuais, automação com Playwright, testes de API, CI/CD, estratégia e mercado. O próximo passo é construir — abra o repositório, escolha o sistema e comece. A prática é o que transforma conhecimento em habilidade.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-7-5-ex1',
        prompt: 'Escreva o README inicial do seu projeto final de QA. Inclua: nome do projeto, o sistema escolhido para testar, a stack de ferramentas, o que será coberto (lista de fluxos e tipos de teste), como rodar localmente, e como rodar no CI. Escreva como se fosse publicar no GitHub hoje.',
        placeholder: 'Seu README aqui...' }
    ]
  }

];
