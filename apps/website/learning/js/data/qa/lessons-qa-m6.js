// Sentinel Learning — QA M6: Estratégia & Métricas
window.QA_M6 = [

  // ─── 6.1 ───────────────────────────────────────────────
  {
    module: 6, lesson: 1,
    title: 'Estratégia de Teste — Pensando antes de executar',
    tag: 'Estratégia', duration: '22 min', xp: 110,
    sections: [
      { type: 'text', content: `
        <h2>O que é uma estratégia de teste</h2>
        <p>Estratégia de teste é o plano de <em>como</em> você vai garantir a qualidade de um produto. Não é uma lista de casos de teste — é uma decisão de o que testar, em qual profundidade, com quais ferramentas, em qual ordem e com qual critério de aceite.</p>
        <p>Um QA sem estratégia testa aleatoriamente, perde tempo em áreas de baixo risco e deixa áreas críticas descobertas.</p>

        <h2>Pirâmide de testes</h2>
        <pre><code class="language-text">           /\\
          /E2E\\           poucos, lentos, alto valor
         /──────\\
        / Integração \\    moderados, cobrem contratos
       /──────────────\\
      /    Unit Tests   \\  muitos, rápidos, isolados
     /──────────────────\\</code></pre>
        <p>A pirâmide sugere: invista mais em testes unitários (baratos e rápidos), menos em E2E (caros e lentos). Na prática, o mix depende do tipo de produto — uma API-heavy pode ter a pirâmide invertida nos testes de integração.</p>

        <h2>Análise de risco como base da estratégia</h2>
        <p>Nem tudo precisa ser testado com a mesma profundidade. Priorize pelo cruzamento de:</p>
        <pre><code class="language-text">Risco = Probabilidade de falha × Impacto da falha

Alto impacto + alta prob  → teste extensivo, automação obrigatória
Alto impacto + baixa prob → smoke test, caso de borda coberto
Baixo impacto + alta prob → pode ser corrigido em produção
Baixo impacto + baixa prob → menor prioridade, doc é suficiente</code></pre>

        <h2>Fatores que aumentam o risco</h2>
        <ul>
          <li>Código novo ou recém refatorado</li>
          <li>Integração com sistemas externos (payment, auth)</li>
          <li>Fluxos que envolvem dinheiro ou dados sensíveis</li>
          <li>Features usadas pela maioria dos usuários</li>
          <li>Código sem cobertura de testes existente</li>
          <li>Prazo curto (menos tempo de review)</li>
        </ul>

        <h2>Critérios de aceite bem definidos</h2>
        <p>Antes de testar, você precisa saber o que é "passou". Critérios de aceite mal definidos geram discussões intermináveis sobre se algo é bug ou comportamento esperado.</p>
        <pre><code class="language-text">// Ruim:
"O checkout deve funcionar corretamente"

// Bom (Given/When/Then):
Dado que o usuário tem itens no carrinho e está autenticado
Quando ele confirma o pedido com cartão válido
Então ele recebe um email de confirmação em até 30s
E o estoque é decrementado imediatamente
E o pedido aparece em "Meus pedidos" com status "Confirmado"</code></pre>

        <div class="callout callout-cyan">
          <strong>QA estratégico:</strong> O QA deve estar na definição dos critérios de aceite, não só na execução dos testes. Quanto antes os problemas de especificação forem identificados, mais barato é corrigi-los.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-6-1-ex1',
        prompt: 'Você está num sprint com as seguintes features: (A) novo fluxo de pagamento PIX, (B) mudança de cor do botão de CTA, (C) refatoração do módulo de autenticação, (D) nova página de FAQ. Aplique a análise de risco e defina a profundidade de teste para cada uma. Justifique.',
        placeholder: 'Sua análise de risco aqui...' }
    ]
  },

  // ─── 6.2 ───────────────────────────────────────────────
  {
    module: 6, lesson: 2,
    title: 'Métricas de Qualidade',
    tag: 'Métricas', duration: '24 min', xp: 120,
    sections: [
      { type: 'text', content: `
        <h2>Por que métricas importam</h2>
        <p>Sem métricas, qualidade é uma percepção subjetiva. Com métricas, você consegue argumentar, decidir e melhorar com base em dados. Um QA que apresenta dados convence liderança; um QA que apresenta opinião raramente consegue recursos.</p>

        <h2>Métricas de produto</h2>
        <pre><code class="language-text">Defect Density
  Fórmula: bugs / tamanho do módulo (KLOC ou pontos de função)
  Uso: identifica módulos com alta concentração de problemas

Escape Rate (Taxa de Escape)
  Fórmula: bugs em produção / total de bugs encontrados
  Meta: < 10%
  Uso: mede a eficácia do QA em encontrar bugs antes do usuário

Severity Distribution
  % de bugs críticos vs altos vs médios vs baixos
  Uso: tendência de bugs graves aumentando = sinal de alerta

Test Effectiveness
  Fórmula: bugs encontrados por testes / bugs totais
  Uso: valida se os testes estão encontrando os bugs certos</code></pre>

        <h2>Métricas de processo</h2>
        <pre><code class="language-text">Test Coverage
  % de requisitos cobertos por casos de teste
  % de código coberto por testes unitários (code coverage)

Test Pass Rate
  % de casos de teste que passaram no ciclo
  Meta: > 95% (o resto é bug ou flaky)

Defect Resolution Time
  Tempo médio do bug ser aberto até ser corrigido
  Separe por severidade: críticos devem ser resolvidos em horas

Automation Rate
  % de casos de teste automatizados vs total
  Meta varia: 60-80% é considerado saudável para a maioria dos produtos

Flakiness Rate
  % de runs de CI com falha por flakiness
  Meta: < 5%</code></pre>

        <h2>Métricas de estabilidade em produção</h2>
        <pre><code class="language-text">MTTR — Mean Time to Recovery
  Tempo médio para recuperar de um incidente
  QA contribui com testes de rollback e smoke pós-deploy

MTTD — Mean Time to Detect
  Tempo entre o bug existir e ser detectado
  Testes automatizados reduzem o MTTD drasticamente

Error Rate
  % de requests com erro (5xx) em produção
  Monitorado via Datadog, New Relic, Sentry</code></pre>

        <h2>Apresentando métricas para liderança</h2>
        <pre><code class="language-text">// Ruim — dado isolado:
"Encontramos 47 bugs esse sprint"

// Bom — contexto + tendência + impacto:
"Escape rate caiu de 18% para 6% após implementarmos
testes E2E no pipeline. O tempo médio de detecção de bugs
críticos caiu de 3 dias para 4 horas."</code></pre>

        <div class="callout callout-purple">
          <strong>Armadilha de métricas:</strong> Cobertura de código não é qualidade. 100% de code coverage com testes que não verificam comportamento real é pior que 60% de coverage bem focado em fluxos críticos.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-6-2-ex1',
        prompt: 'Você precisa apresentar ao CTO o estado atual de qualidade do produto. Você tem esses dados: 12 bugs em produção no último mês (3 críticos, 5 altos, 4 médios), 200 casos de teste dos quais 140 são automatizados, escape rate de 22%, MTTD médio de 2 dias. Escreva o resumo executivo que você apresentaria — com interpretação dos dados, tendência e 2 ações prioritárias.',
        placeholder: 'Seu resumo aqui...' }
    ]
  },

  // ─── 6.3 ───────────────────────────────────────────────
  {
    module: 6, lesson: 3,
    title: 'Plano de Teste — Como estruturar',
    tag: 'Artefato', duration: '26 min', xp: 130,
    sections: [
      { type: 'text', content: `
        <h2>O que é um plano de teste</h2>
        <p>O plano de teste é o documento que define <em>o que</em> será testado, <em>como</em>, <em>quando</em>, por <em>quem</em> e com quais <em>recursos</em>. É o contrato de qualidade entre QA, desenvolvimento e produto.</p>

        <h2>Estrutura de um plano de teste</h2>
        <pre><code class="language-text">1. ESCOPO
   O que está incluído no teste
   O que está explicitamente fora do escopo

2. OBJETIVOS
   O que queremos validar com esses testes
   Critérios de aceite de entrada (para começar a testar)
   Critérios de aceite de saída (para encerrar o ciclo)

3. ABORDAGEM
   Tipos de teste: funcional, regressão, exploratório, performance
   Ferramentas: Playwright, Postman, Newman, etc.
   Ambientes: staging, homologação, produção

4. RECURSOS
   QA responsável
   Acesso necessário (ambientes, massa de dados, credenciais)
   Dependências externas (APIs de terceiro, integrações)

5. CRONOGRAMA
   Data de início dos testes
   Data de encerramento
   Ciclos planejados

6. RISCOS
   Riscos que podem impedir a execução
   Mitigação para cada risco

7. CRITÉRIOS DE BLOQUEIO (Entry/Exit)
   Entry: pré-condições para começar a testar
   Exit: quando o ciclo está concluído e pode ir para produção</code></pre>

        <h2>Critérios de entrada e saída</h2>
        <pre><code class="language-text">ENTRY CRITERIA (para iniciar o ciclo de testes)
  ✅ Código deployado em ambiente de staging
  ✅ Migrations aplicadas
  ✅ Dados de teste configurados
  ✅ Credenciais de acesso disponíveis
  ✅ Critérios de aceite definidos e aprovados

EXIT CRITERIA (para declarar o ciclo encerrado)
  ✅ 100% dos casos de teste de alta prioridade executados
  ✅ 0 bugs críticos em aberto
  ✅ 0 bugs altos em aberto sem workaround documentado
  ✅ Smoke tests passando
  ✅ Approval do product manager para bugs médios/baixos em aberto</code></pre>

        <h2>Plano ágil vs plano waterfall</h2>
        <pre><code class="language-text">Waterfall: plano detalhado antes de qualquer desenvolvimento
  + Mais completo
  - Fica desatualizado rapidamente

Ágil: plano por sprint/feature, atualizado continuamente
  + Reflete a realidade do desenvolvimento
  + Se integra ao backlog e Definition of Done
  - Requer QA próximo do time e atualização constante</code></pre>

        <div class="callout callout-cyan">
          <strong>Definition of Done com QA:</strong> Em times ágeis, adicione ao DoD: "Casos de teste criados", "Automação implementada", "Sem bugs críticos abertos". Isso torna qualidade responsabilidade do time, não só do QA.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-6-3-ex1',
        prompt: 'Escreva um plano de teste resumido para a seguinte feature: "Implementar autenticação de dois fatores (2FA) via SMS no fluxo de login". Cubra: escopo, tipos de teste, riscos identificados, critérios de entrada e saída, e os 5 casos de teste mais críticos.',
        placeholder: 'Seu plano aqui...' }
    ]
  },

  // ─── 6.4 ───────────────────────────────────────────────
  {
    module: 6, lesson: 4,
    title: 'Teste Exploratório com Método',
    tag: 'Técnica', duration: '20 min', xp: 110,
    sections: [
      { type: 'text', content: `
        <h2>O que é teste exploratório</h2>
        <p>Teste exploratório é aprendizado, design e execução de testes simultâneos. O QA usa sua experiência, intuição e conhecimento do sistema para descobrir bugs que casos de teste pré-definidos não cobririam.</p>
        <p>Não é teste aleatório — é teste <em>guiado por charter</em>.</p>

        <h2>Charter de teste exploratório</h2>
        <pre><code class="language-text">Explore: [área do sistema]
With:    [recursos/dados/condições]
To find: [tipo de problema]

Exemplo:
Explore: Módulo de pagamento
With:    Usuários com cartões internacionais, diferentes moedas, VPN ativa
To find: Falhas de validação, erros de conversão, problemas de timeout</code></pre>

        <h2>Sessão de teste exploratório (SBET)</h2>
        <pre><code class="language-text">Duração típica: 60-90 minutos sem interrupção

Estrutura da sessão:
  1. Charter (5 min)      → definir o objetivo
  2. Exploração (70%)     → executar e anotar
  3. Análise (20%)        → identificar bugs e padrões
  4. Report (10%)         → documenter achados

Durante a exploração, anote:
  - O que você testou
  - O que funcionou
  - O que quebrou
  - Perguntas que surgiram
  - Áreas que precisam de mais investigação</code></pre>

        <h2>Técnicas de heurística</h2>
        <pre><code class="language-text">CRUD     → Create, Read, Update, Delete de cada entidade
SFDIPOT  → Structure, Function, Data, Interfaces, Platform, Operations, Time
RCRCRC   → Consistent, Reversible, Clean, Correct, Cheap

Limites clássicos:
  Valores de borda: 0, 1, -1, máximo, máximo+1
  Strings especiais: "", " ", null, undefined, "null"
  Caracteres: ñ, ç, á, 漢字, emoji (🎉), SQL injection, XSS
  Tamanhos: campo vazio, tamanho máximo, tamanho máximo+1
  Concorrência: duas abas, dois usuários simultâneos</code></pre>

        <h2>Quando usar teste exploratório</h2>
        <ul>
          <li>Features novas sem especificação detalhada</li>
          <li>Após uma mudança de implementação não planejada</li>
          <li>Antes de uma release importante (sanity check)</li>
          <li>Em áreas com histórico de bugs</li>
          <li>Para complementar testes baseados em casos de teste fixos</li>
        </ul>

        <div class="callout callout-purple">
          <strong>Automatização não substitui exploração:</strong> Testes automatizados verificam o que você já sabe. Teste exploratório encontra o que você ainda não sabe. Os dois são complementares — um QA maduro usa ambos.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-6-4-ex1',
        prompt: 'Escreva 3 charters de teste exploratório para um sistema de gerenciamento de tarefas (to-do list) com funcionalidades de: criar tarefas com prazo, atribuir para membros da equipe, e filtrar por status. Para cada charter, indique a área, as condições especiais e o tipo de problema que você está procurando.',
        placeholder: 'Seus charters aqui...' }
    ]
  },

  // ─── 6.5 ───────────────────────────────────────────────
  {
    module: 6, lesson: 5,
    title: 'Qualidade como Cultura',
    tag: 'Cultura', duration: '20 min', xp: 120,
    sections: [
      { type: 'text', content: `
        <h2>QA não é um departamento, é uma cultura</h2>
        <p>Times de alta performance não têm qualidade "garantida pelo QA no final". A qualidade é responsabilidade de todos — dev escreve código testável, produto define critérios claros, QA previne ao invés de detectar.</p>

        <h2>Shift Left — testando mais cedo</h2>
        <pre><code class="language-text">Shift Left = mover a qualidade para a esquerda no ciclo

Tradicional:
  Código → Review → QA → Deploy → Produção

Shift Left:
  Requisitos → QA reviews spec → Dev escreve testes antes
     → Code review com QA → Automação no CI → Deploy

Quanto mais cedo você encontra o bug, mais barato é corrigi-lo:
  Req: $1
  Design: $5
  Código: $10
  QA: $50
  Produção: $500+</code></pre>

        <h2>Práticas de qualidade no dia a dia do time</h2>
        <pre><code class="language-text">✅ Three Amigos Meeting
   Dev + QA + PO discutem a feature antes de codar
   QA levanta edge cases, PO valida critérios, dev identifica riscos técnicos

✅ Definition of Ready (DoR)
   Feature só entra no sprint se critérios de aceite estão definidos
   QA participa da validação do DoR

✅ Definition of Done (DoD) com qualidade
   Código testado, revisado, com automação e sem bugs críticos abertos

✅ Bug Bash
   Sessão de teste exploratório com todo o time antes de release major

✅ Postmortem de incidente
   Após bug em produção, time analisa: como escapou? O que melhorar?</code></pre>

        <h2>Como QA influencia sem ser gatekeeper</h2>
        <p>O papel de "portão de qualidade" que aprova ou reprova builds é ultrapassado. O QA moderno:</p>
        <ul>
          <li>Cria sistemas que detectam problemas automaticamente</li>
          <li>Educa o time sobre boas práticas de qualidade</li>
          <li>Participa do design de features para torná-las testáveis</li>
          <li>Transforma conhecimento tácito de bugs em testes automatizados</li>
          <li>Usa dados para priorizar esforço de qualidade onde o risco é maior</li>
        </ul>

        <h2>Construindo uma cultura de qualidade</h2>
        <pre><code class="language-text">1. Visibilidade: dashboards de qualidade acessíveis a todos
2. Responsabilidade compartilhada: bugs não são "culpa do QA"
3. Feedback rápido: CI que avisa em minutos, não horas
4. Aprendizado: postmortems sem culpa, foco em processo
5. Automação progressiva: cubra um fluxo por sprint, nunca pare</code></pre>

        <div class="callout callout-cyan">
          <strong>Sua missão como QA senior:</strong> Construir sistemas e cultura que tornem a qualidade inevitável — não uma etapa final que depende de você pessoalmente. O melhor QA é aquele que torna o time inteiro melhor em qualidade.
        </div>
      ` },
      { type: 'write-exercise', id: 'qa-6-5-ex1',
        prompt: 'Você entrou num time onde: não há testes automatizados, bugs críticos chegam em produção toda semana, devs acham que qualidade é "problema do QA", e não existe DoD. Você tem 3 meses e nenhum orçamento extra. Qual é o seu plano para transformar a cultura de qualidade desse time? Seja realista, pragmático e priorize as ações por impacto.',
        placeholder: 'Seu plano de transformação aqui...' }
    ]
  }

];
