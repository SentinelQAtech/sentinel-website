// Sentinel Learning — QA Engineering: Módulo 1 — Fundamentos de QA

window.QA_M1 = [

  // ─────────────────────────────────────────────
  // 1.1 — O que é Qualidade de Software?
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 1,
    title: 'O que é Qualidade de Software?',
    duration: '12 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O que é Qualidade de Software?</h2>
          <p>Qualidade de software é a capacidade de um sistema atender às necessidades e expectativas dos seus usuários — de forma consistente, segura e dentro dos critérios definidos.</p>
          <p>Mas qualidade não é um estado binário. É um espectro que envolve:</p>
          <ul>
            <li><strong>Funcionalidade:</strong> o software faz o que promete?</li>
            <li><strong>Confiabilidade:</strong> ele funciona sem falhar?</li>
            <li><strong>Usabilidade:</strong> o usuário consegue usar?</li>
            <li><strong>Performance:</strong> ele responde rápido?</li>
            <li><strong>Segurança:</strong> protege dados e acessos?</li>
            <li><strong>Manutenibilidade:</strong> é fácil de evoluir?</li>
          </ul>
          <p>O papel do QA é garantir que o software entregue ao usuário tenha o nível de qualidade acordado — antes de chegar em produção.</p>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Por que QA existe?</h2>
          <p>Bugs custam caro. Quanto mais tarde um bug é encontrado, mais caro ele se torna:</p>
          <ul>
            <li>Em desenvolvimento: custo baixo — o dev corrige na hora</li>
            <li>Em testes: custo médio — requer ciclo de correção</li>
            <li>Em produção: custo alto — usuários afetados, reputação, rollbacks</li>
            <li>Pós-incidente: custo altíssimo — perda de dados, clientes, processos</li>
          </ul>
          <p>O QA atua para detectar problemas o mais cedo possível no ciclo de desenvolvimento — e idealmente, para <strong>prevenir</strong> que eles aconteçam.</p>
          <blockquote style="border-left:3px solid var(--cyan);padding-left:1rem;margin-top:1rem;color:var(--text-secondary)">
            "Teste não aumenta qualidade. Ele a mede. Quem aumenta qualidade é o processo." — Deming
          </blockquote>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-1-ex1',
        prompt: 'Pense em um app ou site que você usa. Descreva 2 critérios de qualidade que ele deve ter e por quê eles são importantes para o usuário final.',
        placeholder: 'Ex: O app de banco deve ter alta disponibilidade (99,9%+) porque o usuário pode precisar fazer uma transferência urgente a qualquer hora...'
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 1.2 — Tipos de Teste
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 2,
    title: 'Tipos de Teste',
    duration: '14 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O universo dos tipos de teste</h2>
          <p>Testes de software são categorizados por objetivo, escopo e abordagem. Entender as diferenças é fundamental para montar uma estratégia eficaz.</p>

          <h3 style="margin-top:1.25rem">Por nível (escopo)</h3>
          <ul>
            <li><strong>Unitário:</strong> testa uma única função ou componente isolado</li>
            <li><strong>Integração:</strong> testa a comunicação entre componentes</li>
            <li><strong>Sistema (E2E):</strong> testa o fluxo completo como um usuário real</li>
            <li><strong>Aceitação (UAT):</strong> valida se o sistema atende ao requisito de negócio</li>
          </ul>

          <h3 style="margin-top:1.25rem">Por abordagem</h3>
          <ul>
            <li><strong>Caixa-branca:</strong> tester tem acesso ao código, testa lógica interna</li>
            <li><strong>Caixa-preta:</strong> tester só vê entradas e saídas, sem acesso ao código</li>
            <li><strong>Caixa-cinza:</strong> mix — tester conhece parte da estrutura interna</li>
          </ul>

          <h3 style="margin-top:1.25rem">Por objetivo</h3>
          <ul>
            <li><strong>Funcional:</strong> verifica se o sistema faz o que deve</li>
            <li><strong>Não-funcional:</strong> performance, segurança, usabilidade, escalabilidade</li>
            <li><strong>Regressão:</strong> garante que algo antigo não quebrou</li>
            <li><strong>Smoke:</strong> valida rapidamente se o build está "vivo"</li>
            <li><strong>Sanidade:</strong> foco rápido em uma área específica após uma mudança</li>
            <li><strong>Exploratório:</strong> sem roteiro fixo — o tester explora para encontrar bugs inesperados</li>
          </ul>
        `
      },
      {
        type: 'text',
        content: `
          <h2>A Pirâmide de Testes</h2>
          <p>A pirâmide de testes é um modelo que orienta a distribuição ideal de esforço entre os tipos:</p>
          <pre style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.85rem;line-height:1.8;margin:.75rem 0">
        ▲
       /E2E\\       ← poucos, lentos, caros
      /─────\\
     / Integ. \\    ← quantidade média
    /──────────\\
   /  Unitários  \\ ← muitos, rápidos, baratos
  /──────────────\\</pre>
          <p>Na base: muitos testes unitários (rápidos, baratos, precisos). No topo: poucos testes E2E (lentos, caros, mas validam o fluxo real). O equilíbrio entre eles define a eficiência da sua estratégia de QA.</p>
          <p>Projetos sem pirâmide costumam ter o chamado <em>sorvete invertido</em>: muitos E2E frágeis e poucos unitários — resultado: suite lenta, flaky e cara de manter.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-2-ex1',
        prompt: 'Dado um e-commerce (cadastro, login, busca, carrinho, pagamento), liste pelo menos 3 tipos de teste diferentes que você aplicaria e justifique por que cada um é necessário neste contexto.',
        placeholder: 'Tipo: Smoke Test — motivo: verificar rapidamente se o deploy não quebrou o login antes de rodar a suite completa...'
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 1.3 — O Papel do QA no Time
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 3,
    title: 'O Papel do QA no Time',
    duration: '11 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>QA no ciclo de desenvolvimento</h2>
          <p>O QA moderno não é só quem "clica no botão no final do sprint". Ele participa de todo o ciclo:</p>
          <ul>
            <li><strong>Planejamento:</strong> revisa requisitos, aponta ambiguidades, define critérios de aceite</li>
            <li><strong>Refinamento:</strong> questiona fluxos incompletos, sugere cenários, estima riscos</li>
            <li><strong>Desenvolvimento:</strong> acompanha, tira dúvidas, cria massa de dados</li>
            <li><strong>Revisão de código:</strong> olha para testabilidade, acessibilidade, edge cases</li>
            <li><strong>Testes:</strong> executa, automatiza, registra bugs, valida correções</li>
            <li><strong>Release:</strong> valida smoke, acompanha deploys, monitora pós-release</li>
          </ul>

          <h3 style="margin-top:1.25rem">Shift Left</h3>
          <p><strong>Shift Left</strong> é a prática de mover os testes para o início do processo — quanto mais cedo você detecta um bug, mais barato é corrigi-lo. O QA que só testa no fim está gerenciando risco tarde demais.</p>

          <h3 style="margin-top:1.25rem">QA vs Dev</h3>
          <p>O papel do QA não é ser inimigo do dev — é ser parceiro. O dev constrói, o QA questiona. Juntos, entregam um produto mais confiável. Um bom QA faz o dev ser melhor, e vice-versa.</p>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Hard skills e soft skills do QA</h2>
          <h3>Hard skills</h3>
          <ul>
            <li>Análise e design de testes</li>
            <li>Automação (Playwright, Cypress, Selenium)</li>
            <li>Testes de API (Postman, REST Assured)</li>
            <li>Performance (k6, JMeter, Gatling)</li>
            <li>SQL e manipulação de dados</li>
            <li>Git, CI/CD, pipelines</li>
            <li>Leitura de logs e métricas</li>
          </ul>
          <h3 style="margin-top:1rem">Soft skills</h3>
          <ul>
            <li>Pensamento crítico — questionar tudo</li>
            <li>Comunicação clara — escrever bugs que desenvolvem entendem</li>
            <li>Curiosidade — explorar além do caminho feliz</li>
            <li>Empatia com o usuário</li>
            <li>Organização — gerenciar casos de teste, prioridades, evidências</li>
          </ul>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-3-ex1',
        prompt: 'Descreva como você atuaria como QA em um refinamento de uma story: "Como usuário, quero redefinir minha senha por e-mail". Quais perguntas faria, quais riscos apontaria e quais critérios de aceite sugeriria?',
        placeholder: 'Perguntas: O link de redefinição expira? Em quanto tempo? Pode ser usado mais de uma vez?...'
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 1.4 — Mindset de QA
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 4,
    title: 'Mindset de QA',
    duration: '10 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Como pensa um QA sênior?</h2>
          <p>A mentalidade do QA é fundamentalmente diferente da do desenvolvedor. O dev pensa em "como construir isso para funcionar". O QA pensa em "como isso pode falhar?".</p>

          <h3 style="margin-top:1.25rem">Princípios do mindset QA</h3>
          <ul>
            <li><strong>Destruir antes do usuário:</strong> seja o primeiro a encontrar o bug — antes de chegar em produção</li>
            <li><strong>Caminhos alternativos:</strong> o caminho feliz raramente quebra. Os alternativos, sim</li>
            <li><strong>Pensar como o usuário real:</strong> o usuário não lê o manual, não segue o fluxo previsto</li>
            <li><strong>Questionar requisitos:</strong> "o que acontece se o campo for vazio?", "e se o usuário der F5?"</li>
            <li><strong>Zero tolerância a ambiguidade:</strong> se o requisito é vago, o bug já está implícito</li>
            <li><strong>Evidência e rastreabilidade:</strong> qualquer achado precisa ser reproduzível e documentado</li>
          </ul>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Técnicas de pensamento QA</h2>
          <h3>Partição de equivalência</h3>
          <p>Agrupe entradas com comportamento igual. Ex: campo de idade (0-17: menor, 18-99: adulto, 100+: inválido). Teste um representante de cada grupo.</p>

          <h3 style="margin-top:1rem">Análise de valor-limite</h3>
          <p>Bugs se escondem nos limites. Se um campo aceita 1–100, teste 0, 1, 2, 99, 100, 101. Os extremos são os mais propensos a falhar.</p>

          <h3 style="margin-top:1rem">Tabela de decisão</h3>
          <p>Para regras de negócio complexas com múltiplas condições, crie uma tabela com todas as combinações possíveis de entrada/saída. Garante cobertura total das regras.</p>

          <h3 style="margin-top:1rem">Teste exploratório</h3>
          <p>Sem roteiro fixo. O QA usa conhecimento, intuição e criatividade para explorar o sistema. Muito eficaz para encontrar bugs que testes roteirizados não encontram.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-4-ex1',
        prompt: 'Aplique análise de valor-limite em um campo de cupom de desconto que aceita apenas códigos com 6 a 12 caracteres alfanuméricos. Liste os valores que você testaria e por quê.',
        placeholder: 'Testaria: "" (vazio), "ABC12" (5 chars - abaixo do limite), "ABC123" (6 chars - limite inferior)...'
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 1.5 — Critérios de Aceite
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 5,
    title: 'Critérios de Aceite e User Stories',
    duration: '13 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>User Stories e Critérios de Aceite</h2>
          <p>Uma <strong>User Story</strong> descreve uma funcionalidade do ponto de vista do usuário:</p>
          <blockquote style="border-left:3px solid var(--purple);padding-left:1rem;margin:.75rem 0;color:var(--text-secondary)">
            Como [tipo de usuário], quero [funcionalidade], para [benefício].
          </blockquote>
          <p>Os <strong>Critérios de Aceite (AC)</strong> definem quando essa story está "pronta" — são as condições objetivas que o sistema deve satisfazer. Sem ACs claros, não há como testar e não há como saber quando terminar.</p>

          <h3 style="margin-top:1.25rem">Formato BDD (Gherkin)</h3>
          <p>O formato mais usado para ACs no contexto de QA automatizado:</p>
          <pre style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-family:var(--font-code);font-size:.85rem;line-height:1.8;margin:.75rem 0">
Cenário: Login com credenciais válidas
  Dado que o usuário está na página de login
  Quando ele insere e-mail e senha corretos
  E clica em "Entrar"
  Então ele é redirecionado ao dashboard
  E vê a mensagem "Bem-vindo, [nome]"

Cenário: Login com senha inválida
  Dado que o usuário está na página de login
  Quando ele insere uma senha incorreta
  E clica em "Entrar"
  Então ele permanece na página de login
  E vê a mensagem "E-mail ou senha incorretos"</pre>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Boas práticas para Critérios de Aceite</h2>
          <ul>
            <li><strong>Específicos:</strong> "deve exibir mensagem X" — não "deve mostrar erro"</li>
            <li><strong>Mensuráveis:</strong> "resposta em até 2s" — não "rápido"</li>
            <li><strong>Testáveis:</strong> se não dá pra testar, não é um critério</li>
            <li><strong>Cobrir fluxos alternativos:</strong> não só o caminho feliz</li>
            <li><strong>Sem ambiguidade:</strong> dev e QA devem interpretar igual</li>
          </ul>

          <h3 style="margin-top:1.25rem">Sinais de ACs ruins</h3>
          <ul>
            <li>"Deve funcionar corretamente" — o que é correto?</li>
            <li>"Interface amigável" — amigável para quem?</li>
            <li>"Rápido e performático" — qual número?</li>
            <li>Ausência de cenários negativos</li>
            <li>Ausência de regras de validação</li>
          </ul>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-5-ex1',
        prompt: 'Escreva pelo menos 3 Critérios de Aceite no formato BDD (Dado/Quando/Então) para a seguinte story: "Como usuário, quero fazer login com e-mail e senha para acessar minha conta."',
        placeholder: 'Cenário: Login com credenciais válidas\n  Dado que estou na página de login\n  Quando insiro email válido e senha correta\n  Então...'
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 1.6 — Processo de Testes
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 6,
    title: 'Processo de Testes na Prática',
    duration: '12 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O processo de testes passo a passo</h2>
          <p>Um processo de testes estruturado aumenta a cobertura, reduz retrabalho e gera rastreabilidade. As etapas principais:</p>

          <ol style="display:flex;flex-direction:column;gap:.75rem;margin-top:.75rem">
            <li>
              <strong>1. Análise de requisitos</strong><br>
              Entenda o que deve ser construído. Identifique ambiguidades. Levante perguntas.
            </li>
            <li>
              <strong>2. Planejamento de testes</strong><br>
              Defina escopo, abordagem, ferramentas, recursos, riscos e cronograma.
            </li>
            <li>
              <strong>3. Design de casos de teste</strong><br>
              Crie os test cases baseados nos ACs, cenários positivos, negativos e edge cases.
            </li>
            <li>
              <strong>4. Preparação do ambiente</strong><br>
              Configure o ambiente de testes, prepare massa de dados, verifique dependências.
            </li>
            <li>
              <strong>5. Execução</strong><br>
              Execute os testes (manuais e/ou automatizados), registre resultados, abra bugs.
            </li>
            <li>
              <strong>6. Reporte e acompanhamento</strong><br>
              Documente bugs com evidências. Acompanhe correções. Re-teste.
            </li>
            <li>
              <strong>7. Encerramento</strong><br>
              Relatório final: o que foi testado, cobertura, bugs abertos/fechados, riscos residuais.
            </li>
          </ol>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-6-ex1',
        prompt: 'Você recebeu uma nova feature para testar: "Carrinho de compras — adicionar e remover itens". Descreva o seu processo de testes do início ao fim, com pelo menos 4 etapas detalhadas.',
        placeholder: '1. Análise: Lerei os ACs e perguntarei ao PO sobre o comportamento quando o carrinho está vazio...'
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 1.7 — Riscos em QA
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 7,
    title: 'Análise de Risco em QA',
    duration: '11 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Por que analisar riscos?</h2>
          <p>Tempo de teste é sempre escasso. Você nunca vai testar tudo — então precisa testar o que importa mais. Análise de risco orienta onde concentrar esforço.</p>

          <h3 style="margin-top:1.25rem">Dimensões de risco</h3>
          <ul>
            <li><strong>Probabilidade:</strong> qual a chance de este cenário falhar?</li>
            <li><strong>Impacto:</strong> se falhar, qual o dano? (usuários afetados, dados perdidos, reputação)</li>
            <li><strong>Prioridade = Probabilidade × Impacto</strong></li>
          </ul>

          <h3 style="margin-top:1.25rem">Fontes de risco em software</h3>
          <ul>
            <li>Requisitos vagos ou incompletos</li>
            <li>Código novo e não testado</li>
            <li>Integrações com sistemas externos</li>
            <li>Código legado sem testes</li>
            <li>Mudanças de última hora</li>
            <li>Dependências de terceiros (APIs, libs)</li>
            <li>Ambientes de teste diferentes de produção</li>
            <li>Fluxos com dados financeiros ou sensíveis</li>
          </ul>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Matriz de Risco</h2>
          <p>Uma forma prática de priorizar o que testar:</p>
          <table style="width:100%;border-collapse:collapse;margin:.75rem 0;font-size:.85rem">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,.1)">
                <th style="padding:.5rem;text-align:left;color:var(--text-secondary)">Área</th>
                <th style="padding:.5rem;text-align:center;color:var(--text-secondary)">Probabilidade</th>
                <th style="padding:.5rem;text-align:center;color:var(--text-secondary)">Impacto</th>
                <th style="padding:.5rem;text-align:center;color:var(--text-secondary)">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)">
                <td style="padding:.5rem">Pagamento</td>
                <td style="padding:.5rem;text-align:center">Média</td>
                <td style="padding:.5rem;text-align:center">Alta</td>
                <td style="padding:.5rem;text-align:center;color:#ff6b6b">Crítica</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)">
                <td style="padding:.5rem">Login</td>
                <td style="padding:.5rem;text-align:center">Baixa</td>
                <td style="padding:.5rem;text-align:center">Alta</td>
                <td style="padding:.5rem;text-align:center;color:#ff9f43">Alta</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)">
                <td style="padding:.5rem">Perfil do usuário</td>
                <td style="padding:.5rem;text-align:center">Média</td>
                <td style="padding:.5rem;text-align:center">Baixa</td>
                <td style="padding:.5rem;text-align:center;color:#ffd32a">Média</td>
              </tr>
              <tr>
                <td style="padding:.5rem">Alterar idioma</td>
                <td style="padding:.5rem;text-align:center">Baixa</td>
                <td style="padding:.5rem;text-align:center">Baixa</td>
                <td style="padding:.5rem;text-align:center;color:var(--cyan)">Baixa</td>
              </tr>
            </tbody>
          </table>
          <p>Use esta lógica para priorizar seu backlog de testes e comunicar riscos para o time.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-7-ex1',
        prompt: 'Você está testando um app de delivery. Crie uma mini matriz de risco com 4 áreas do sistema, atribuindo probabilidade de falha, impacto e prioridade de teste para cada uma. Justifique.',
        placeholder: 'Área: Rastreamento do pedido — Probabilidade: Alta (integração com GPS de terceiro) — Impacto: Alto — Prioridade: Crítica — Justificativa: ...'
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 1.8 — Projeto: Plano de Testes
  // ─────────────────────────────────────────────
  {
    module: 1, lesson: 8,
    title: 'Projeto: Monte um Plano de Testes',
    duration: '20 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O que é um Plano de Testes?</h2>
          <p>Um Plano de Testes (Test Plan) é o documento que descreve o que, como, quando, quem e onde vai testar. Ele é o contrato de qualidade de um projeto.</p>

          <h3 style="margin-top:1.25rem">Estrutura de um Test Plan</h3>
          <ol style="display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem">
            <li><strong>Objetivo:</strong> o que este plano cobre?</li>
            <li><strong>Escopo:</strong> o que está IN e OUT of scope?</li>
            <li><strong>Abordagem:</strong> quais tipos de teste serão usados?</li>
            <li><strong>Recursos:</strong> quem testa? Quais ferramentas?</li>
            <li><strong>Cronograma:</strong> quando cada etapa acontece?</li>
            <li><strong>Critérios de entrada:</strong> quando o teste começa?</li>
            <li><strong>Critérios de saída:</strong> quando consideramos pronto?</li>
            <li><strong>Riscos:</strong> quais riscos identificamos?</li>
            <li><strong>Entregáveis:</strong> o que será produzido? (casos de teste, relatórios, automação)</li>
          </ol>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Contexto do Projeto</h2>
          <p>Você foi designado como QA de uma nova feature: <strong>Sistema de Avaliações de Produtos</strong> em um e-commerce.</p>
          <p>A feature permite que usuários autenticados avaliem produtos com nota (1-5 estrelas) e comentário (máx 500 caracteres). Usuários não-autenticados podem ver as avaliações mas não podem avaliar. Um produto só pode ser avaliado por usuários que o compraram. Cada usuário pode avaliar cada produto apenas uma vez, mas pode editar sua avaliação.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-1-8-ex1',
        prompt: 'Com base no contexto acima, escreva um Plano de Testes resumido cobrindo: Objetivo, Escopo (IN/OUT), Abordagem de teste, pelo menos 5 riscos identificados, e Critérios de saída.',
        placeholder: 'PLANO DE TESTES — Sistema de Avaliações\n\nObjetivo: Garantir que o sistema de avaliações...\n\nEscopo IN: Criação de avaliação, edição, visualização...\nEscopo OUT: ...\n\nAbordagem: Testes funcionais manuais + automação E2E nos fluxos críticos...\n\nRiscos:\n1. Usuário não-comprador conseguir avaliar — impacto alto...\n\nCritérios de saída: ...'
      }
    ]
  }

];
