// Sentinel Learning — QA Engineering: Módulo 2 — Testes Manuais & Bug Reports

window.QA_M2 = [

  // 2.1 — Design de Casos de Teste
  {
    module: 2, lesson: 1,
    title: 'Design de Casos de Teste',
    duration: '14 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O que é um Caso de Teste?</h2>
          <p>Um caso de teste (test case) é um conjunto documentado de condições, passos e critérios que define como verificar se uma funcionalidade se comporta como esperado.</p>
          <p>Um bom caso de teste deve ser:</p>
          <ul>
            <li><strong>Específico:</strong> testa uma única condição por vez</li>
            <li><strong>Reproduzível:</strong> qualquer pessoa consegue executar e obter o mesmo resultado</li>
            <li><strong>Independente:</strong> não depende da execução de outro caso</li>
            <li><strong>Rastreável:</strong> ligado a um requisito ou critério de aceite</li>
            <li><strong>Verificável:</strong> tem resultado esperado claro e objetivo</li>
          </ul>
          <h3 style="margin-top:1.25rem">Estrutura de um caso de teste</h3>
          <table style="width:100%;border-collapse:collapse;font-size:.85rem;margin:.75rem 0">
            <thead><tr style="border-bottom:1px solid rgba(255,255,255,.1)">
              <th style="padding:.5rem;text-align:left;color:var(--text-secondary)">Campo</th>
              <th style="padding:.5rem;text-align:left;color:var(--text-secondary)">Descrição</th>
            </tr></thead>
            <tbody>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)"><td style="padding:.5rem">ID</td><td style="padding:.5rem">Identificador único (ex: TC-001)</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)"><td style="padding:.5rem">Título</td><td style="padding:.5rem">Descrição objetiva do que está sendo testado</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)"><td style="padding:.5rem">Pré-condição</td><td style="padding:.5rem">Estado necessário antes de executar</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)"><td style="padding:.5rem">Massa de dados</td><td style="padding:.5rem">Dados de entrada utilizados</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)"><td style="padding:.5rem">Passos</td><td style="padding:.5rem">Ações numeradas e detalhadas</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)"><td style="padding:.5rem">Resultado esperado</td><td style="padding:.5rem">O que deve acontecer se o sistema funcionar corretamente</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.05)"><td style="padding:.5rem">Resultado obtido</td><td style="padding:.5rem">Preenchido na execução</td></tr>
              <tr><td style="padding:.5rem">Status</td><td style="padding:.5rem">Passou / Falhou / Bloqueado / N/A</td></tr>
            </tbody>
          </table>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Exemplo de caso de teste</h2>
          <pre style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-size:.82rem;line-height:1.9;margin:.75rem 0">
ID: TC-042
Título: Login com e-mail e senha válidos
Pré-condição: Usuário cadastrado com e-mail "qa@teste.com" e senha "Senha@123"
Massa de dados: e-mail: qa@teste.com | senha: Senha@123

Passos:
  1. Acessar a URL /login
  2. Inserir e-mail: qa@teste.com
  3. Inserir senha: Senha@123
  4. Clicar no botão "Entrar"

Resultado esperado:
  - Usuário é redirecionado para /dashboard
  - Header exibe "Bem-vindo, QA User"
  - Token de sessão é criado (verificar cookie)

Status: [ ] Passou  [ ] Falhou  [ ] Bloqueado</pre>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-1-ex1',
        prompt: 'Escreva um caso de teste completo (ID, título, pré-condição, massa de dados, passos, resultado esperado) para o seguinte cenário: "Login com senha inválida — o sistema deve bloquear o acesso e exibir mensagem de erro."',
        placeholder: 'ID: TC-043\nTítulo: Login com senha inválida\nPré-condição: ...\nMassa de dados: ...\nPassos:\n  1. ...\nResultado esperado: ...'
      }
    ]
  },

  // 2.2 — Estratégias de Teste Manual
  {
    module: 2, lesson: 2,
    title: 'Estratégias de Teste Manual',
    duration: '12 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Quando o teste manual é insubstituível</h2>
          <p>Automação resolve repetição. Teste manual resolve cognição. Existem situações onde o olhar humano e a intuição do tester são insubstituíveis:</p>
          <ul>
            <li><strong>Teste exploratório:</strong> descobrir bugs inesperados sem roteiro fixo</li>
            <li><strong>Usabilidade:</strong> avaliar se a interface faz sentido para um humano</li>
            <li><strong>Testes visuais:</strong> layout, alinhamento, responsividade</li>
            <li><strong>Fluxos novos:</strong> antes de haver automação para a feature</li>
            <li><strong>Validação de UX/UI com stakeholders:</strong> demonstrações e walkthroughs</li>
          </ul>

          <h3 style="margin-top:1.25rem">Técnicas de teste manual</h3>
          <h4 style="margin:.75rem 0 .4rem;color:var(--cyan)">Teste Exploratório</h4>
          <p>Sem script. O tester explora o sistema livremente com objetivo definido (uma funcionalidade, um fluxo, uma suspeita). Usa conhecimento, intuição e criatividade. Registra o que testa e o que encontra. Time-boxed: 30-60 minutos por sessão.</p>

          <h4 style="margin:.75rem 0 .4rem;color:var(--cyan)">Baseado em Checklists</h4>
          <p>Lista de itens a verificar sem passos detalhados. Ágil e bom para regressão rápida. Ex: "□ Login funciona □ Logout funciona □ Sessão expira após inatividade".</p>

          <h4 style="margin:.75rem 0 .4rem;color:var(--cyan)">Baseado em Scripts (Test Cases)</h4>
          <p>Casos de teste detalhados com passos, dados e resultado esperado. Ideal para fluxos críticos onde a cobertura precisa ser documentada e auditável.</p>

          <h4 style="margin:.75rem 0 .4rem;color:var(--cyan)">Ad-hoc</h4>
          <p>Totalmente informal, sem planejamento. Útil para uma verificação rápida ou quando o tempo é escasso. Não substitui outros tipos.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-2-ex1',
        prompt: 'Você tem 30 minutos para testar a feature de "Filtro de produtos por categoria" em um e-commerce. Descreva sua sessão de teste exploratório: qual é o charter (objetivo), o que você exploraria, quais riscos observaria e que tipos de evidências coletaria.',
        placeholder: 'Charter: Explorar o filtro de produtos por categoria para encontrar comportamentos inesperados...\nÁreas de foco: ...\nRiscos observados: ...\nEvidências: ...'
      }
    ]
  },

  // 2.3 — Escrita de Bug Reports de Qualidade
  {
    module: 2, lesson: 3,
    title: 'Escrita de Bug Reports de Qualidade',
    duration: '15 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O que faz um bug report ser bom?</h2>
          <p>Um bug report ruim desperdiça tempo do dev, do QA e do time. Um bom bug report permite que o dev reproduza, entenda e corrija o problema na primeira tentativa.</p>
          <p>Um bug report de qualidade tem:</p>
          <ul>
            <li><strong>Título objetivo:</strong> descreve o problema, não o sintoma genérico. "Botão Salvar não funciona" é ruim. "Botão Salvar no formulário de Perfil não dispara requisição ao clicar — resposta HTTP 0" é bom.</li>
            <li><strong>Ambiente completo:</strong> browser, versão, OS, ambiente (staging/prod), data/hora</li>
            <li><strong>Pré-condições claras:</strong> o estado exato do sistema antes de reproduzir</li>
            <li><strong>Passos reproduzíveis:</strong> qualquer pessoa segue e vê o mesmo bug</li>
            <li><strong>Resultado atual x esperado:</strong> a diferença entre o que acontece e o que deveria</li>
            <li><strong>Evidências:</strong> print, vídeo, log, request/response da API</li>
            <li><strong>Severidade e prioridade:</strong> classificadas corretamente</li>
            <li><strong>Frequência:</strong> sempre reproduz? Intermitente? Uma vez?</li>
          </ul>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Severidade vs Prioridade</h2>
          <p>São conceitos diferentes e frequentemente confundidos:</p>
          <ul>
            <li><strong>Severidade:</strong> impacto técnico do bug no sistema. Definida pelo QA.</li>
            <li><strong>Prioridade:</strong> urgência de correção para o negócio. Definida pelo PO/PM com input do QA.</li>
          </ul>
          <p>Exemplos de combinações:</p>
          <ul>
            <li>Bug visual no botão de logout — <em>severidade baixa</em>, <em>prioridade baixa</em></li>
            <li>Crash no checkout — <em>severidade crítica</em>, <em>prioridade crítica</em></li>
            <li>Typo no nome da empresa na home — <em>severidade baixa</em>, <em>prioridade alta</em> (visibilidade de marca)</li>
            <li>Cálculo errado de desconto em edge case raro — <em>severidade alta</em>, <em>prioridade média</em></li>
          </ul>
          <h3 style="margin-top:1.25rem">Escala de Severidade</h3>
          <ul>
            <li><strong style="color:#ff5555">Crítica:</strong> sistema inacessível, perda de dados, falha de segurança</li>
            <li><strong style="color:#ff9f43">Alta:</strong> funcionalidade principal quebrada, sem workaround</li>
            <li><strong style="color:#ffd32a">Média:</strong> funcionalidade afetada mas há workaround</li>
            <li><strong style="color:var(--cyan)">Baixa:</strong> cosmético, não afeta funcionamento</li>
          </ul>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-3-ex1',
        prompt: 'Escreva um bug report completo para o seguinte cenário encontrado durante testes: "Ao tentar redefinir a senha, o link enviado por e-mail expira instantaneamente — ao clicar, a página exibe Erro 410 (Gone) mesmo que o link tenha acabado de ser gerado."',
        placeholder: 'Título: Link de redefinição de senha expira imediatamente após geração\nSeveridade: ...\nPrioridade: ...\nAmbiente: ...\nPré-condição: ...\nPassos para reproduzir:\n  1. ...\nResultado atual: ...\nResultado esperado: ...\nFrequência: ...\nImpacto: ...\nPossível causa raiz: ...'
      }
    ]
  },

  // 2.4 — Coleta de Evidências
  {
    module: 2, lesson: 4,
    title: 'Coleta e Gestão de Evidências',
    duration: '11 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Por que evidências importam?</h2>
          <p>Evidências transformam um relato em prova. Sem evidências, um bug é uma opinião. Com evidências, é um fato documentado que o dev pode investigar e o time pode auditar.</p>
          <p>Evidências servem para:</p>
          <ul>
            <li>Provar que o bug existe e é reproduzível</li>
            <li>Contextualizar o estado do sistema no momento da falha</li>
            <li>Eliminar ambiguidade ("mas na minha máquina funciona")</li>
            <li>Documentar o comportamento antes de uma correção</li>
            <li>Auditoria e compliance em sistemas regulados</li>
          </ul>

          <h3 style="margin-top:1.25rem">Tipos de evidência</h3>
          <ul>
            <li><strong>Screenshot:</strong> estado visual da tela. Sempre anote o que está errado — círculos, setas, anotações.</li>
            <li><strong>Vídeo:</strong> fluxo completo de reprodução. Ideal para bugs intermitentes ou com múltiplos passos.</li>
            <li><strong>Request/Response HTTP:</strong> capturado via DevTools (Network tab). Essencial para bugs de API.</li>
            <li><strong>Console logs:</strong> erros JavaScript, warnings, stack traces.</li>
            <li><strong>Logs de servidor:</strong> quando tiver acesso — erros de backend, exceptions.</li>
            <li><strong>Dados de banco:</strong> estado antes e depois, para bugs de persistência.</li>
          </ul>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Como capturar evidências de API no DevTools</h2>
          <p>Abrir DevTools (F12) → aba <strong>Network</strong>. Reproduzir o bug. Identificar a requisição problemática. Clicar nela e capturar:</p>
          <ul>
            <li><strong>Request URL:</strong> endpoint chamado</li>
            <li><strong>Request Method:</strong> GET, POST, PUT, DELETE...</li>
            <li><strong>Request Headers:</strong> Authorization, Content-Type...</li>
            <li><strong>Request Body (Payload):</strong> dados enviados</li>
            <li><strong>Status Code:</strong> 200, 400, 401, 403, 404, 500...</li>
            <li><strong>Response Body:</strong> mensagem de erro, dados retornados</li>
          </ul>
          <p>Dica: clique com o botão direito na requisição → "Copy as cURL" para compartilhar uma reprodução exata da chamada com o dev.</p>
          <p>Sempre mascare dados sensíveis (tokens, senhas, dados pessoais) antes de colar evidências em tickets ou e-mails.</p>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-4-ex1',
        prompt: 'Você encontrou um bug: ao clicar em "Finalizar pedido", a tela trava por 30 segundos e depois exibe "Erro interno. Tente novamente." Descreva quais evidências você coletaria, de qual forma e onde as armazenaria/organizaria.',
        placeholder: 'Evidências que coletaria:\n1. Vídeo da tela mostrando o comportamento completo (travamento + mensagem de erro)\n2. ...\n\nComo coletaria: ...\nOnde armazenaria: ...'
      }
    ]
  },

  // 2.5 — Gestão de Defeitos
  {
    module: 2, lesson: 5,
    title: 'Gestão de Defeitos no Ciclo de Vida',
    duration: '12 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O ciclo de vida de um defeito</h2>
          <p>Um bug não nasce, vai para o dev e morre. Ele tem um ciclo de vida que o time precisa gerenciar ativamente.</p>
          <pre style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1.25rem;font-size:.82rem;line-height:2;margin:.75rem 0">
Novo → Triagem → Em análise → Em correção → Aguardando QA
                                                      ↓
                                              Reaberto ← Falhou no re-test
                                                      ↓
                                              Fechado ← Passou no re-test</pre>

          <h3 style="margin-top:1rem">Estados e responsabilidades</h3>
          <ul>
            <li><strong>Novo:</strong> QA registrou, aguarda triagem</li>
            <li><strong>Triagem:</strong> PO/tech lead avalia severidade, prioridade, sprint</li>
            <li><strong>Em análise:</strong> dev investiga causa raiz</li>
            <li><strong>Em correção:</strong> dev codificando a correção</li>
            <li><strong>Aguardando QA:</strong> correção em staging, QA precisa re-testar</li>
            <li><strong>Fechado:</strong> QA validou — bug corrigido</li>
            <li><strong>Reaberto:</strong> correção não funcionou — volta ao dev com evidências novas</li>
            <li><strong>Não será corrigido (Won't Fix):</strong> aceite de risco consciente pelo time</li>
            <li><strong>Duplicado:</strong> já existe ticket para o mesmo problema</li>
          </ul>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-5-ex1',
        prompt: 'Um bug que você reportou voltou como "Não consegui reproduzir" do desenvolvedor. O que você faz? Descreva seu processo de investigação e comunicação para resolver essa situação sem conflito.',
        placeholder: 'Passo 1: Verifico se o bug ainda acontece no meu ambiente seguindo exatamente os mesmos passos do ticket...\nPasso 2: ...\nComunicação: ...'
      }
    ]
  },

  // 2.6 — Teste de Regressão Manual
  {
    module: 2, lesson: 6,
    title: 'Teste de Regressão Manual',
    duration: '11 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O que é Regressão e por que ela importa?</h2>
          <p>Regressão é quando uma mudança no código quebra algo que funcionava antes. Isso acontece porque software tem dependências — alterar uma parte pode afetar outras indiretamente.</p>
          <p>Teste de regressão é a execução de testes em áreas não diretamente modificadas para garantir que o novo deploy não quebrou o que já funcionava.</p>

          <h3 style="margin-top:1.25rem">Estratégia de Regressão Manual</h3>
          <ul>
            <li><strong>Smoke Test:</strong> verificação mínima de que o build está "vivo" — login, página inicial, funções críticas. 5-15 minutos. Executado em todo deploy.</li>
            <li><strong>Sanidade (Sanity):</strong> foco na área modificada + vizinhança direta. 15-30 minutos. Executado após uma correção específica.</li>
            <li><strong>Regressão completa:</strong> todos os casos críticos. Executado em releases maiores. Pode levar horas — por isso é boa candidata à automação.</li>
          </ul>

          <h3 style="margin-top:1.25rem">Como priorizar o que regredir manualmente</h3>
          <ul>
            <li>Fluxos de maior impacto no negócio (checkout, login, dados do usuário)</li>
            <li>Áreas alteradas pelo deploy atual</li>
            <li>Bugs anteriores que já voltaram (histórico de regressão)</li>
            <li>Integrações com sistemas externos</li>
          </ul>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-6-ex1',
        prompt: 'Você vai fazer o Smoke Test de um e-commerce após um deploy que alterou apenas o módulo de pagamento. Monte um Smoke Test com no máximo 10 verificações. Justifique por que cada item está na lista.',
        placeholder: 'Smoke Test — Deploy: Módulo de Pagamento\n\n1. [Verificação] → [Motivo de incluir no smoke]\n2. ...'
      }
    ]
  },

  // 2.7 — Testes de Interface e UX
  {
    module: 2, lesson: 7,
    title: 'Testes de Interface, Acessibilidade e UX',
    duration: '13 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>Testar além da funcionalidade</h2>
          <p>Uma feature pode funcionar tecnicamente e ainda assim ser inutilizável. O QA que só valida "funciona/não funciona" deixa bugs de UX e acessibilidade escaparem para produção.</p>

          <h3 style="margin-top:1.25rem">Checklist de UI</h3>
          <ul>
            <li>Layout desktop, tablet e mobile (responsividade)</li>
            <li>Alinhamento e espaçamento consistentes</li>
            <li>Overflow de texto em campos longos</li>
            <li>Imagens carregando e com proporção correta</li>
            <li>Hover states, active states, focus states visíveis</li>
            <li>Mensagens de erro com visual adequado</li>
            <li>Loading states (skeleton, spinner)</li>
            <li>Estados vazios (empty state)</li>
            <li>Contraste de cores (WCAG AA: 4.5:1 para texto normal)</li>
          </ul>

          <h3 style="margin-top:1.25rem">Checklist de Acessibilidade básica</h3>
          <ul>
            <li>Navegação por teclado (Tab, Enter, Esc) funciona em todos os elementos interativos</li>
            <li>Foco visível ao navegar com teclado</li>
            <li>Imagens têm atributo <code>alt</code> descritivo</li>
            <li>Campos de formulário têm <code>label</code> associado</li>
            <li>Botões têm texto ou <code>aria-label</code> descritivo</li>
            <li>Erros de formulário são anunciados para leitores de tela</li>
            <li>Contraste mínimo atendido</li>
          </ul>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-7-ex1',
        prompt: 'Escolha um formulário de qualquer site ou app que você usa. Aplique o checklist de UI e acessibilidade desta aula e registre pelo menos 3 problemas que encontrar (ou se não encontrar, documente que passou em cada item).',
        placeholder: 'Site/App escolhido: ...\n\nProblemas encontrados:\n1. [Item] — [O que encontrei] — [Severidade]\n2. ...\n3. ...'
      }
    ]
  },

  // 2.8 — Projeto: Suite de Testes Manuais
  {
    module: 2, lesson: 8,
    title: 'Projeto: Suite de Testes Manuais Completa',
    duration: '25 min',
    sections: [
      {
        type: 'text',
        content: `
          <h2>O desafio</h2>
          <p>Você é o QA responsável por testar a feature de <strong>Cadastro de Usuário</strong> de uma plataforma SaaS B2B. A feature permite que novos usuários se registrem com:</p>
          <ul>
            <li>Nome completo (obrigatório, 2-80 caracteres)</li>
            <li>E-mail corporativo (obrigatório, deve ter domínio da empresa — não aceita gmail, hotmail, etc.)</li>
            <li>Senha (obrigatório, mínimo 8 caracteres, ao menos 1 maiúscula, 1 número, 1 caractere especial)</li>
            <li>Confirmação de senha (deve ser idêntica)</li>
            <li>Aceite dos Termos de Uso (obrigatório)</li>
          </ul>
          <p>Após o cadastro bem-sucedido, o usuário recebe um e-mail de confirmação e a conta fica pendente de aprovação pelo admin da empresa.</p>
        `
      },
      {
        type: 'text',
        content: `
          <h2>Entregáveis do projeto</h2>
          <p>Você deve produzir:</p>
          <ol style="display:flex;flex-direction:column;gap:.5rem;margin:.75rem 0">
            <li><strong>Suite de Test Cases:</strong> mínimo 8 casos cobrindo fluxo feliz, validações, edge cases e cenários negativos</li>
            <li><strong>Análise de risco:</strong> 3 maiores riscos desta feature e como você os mitigaria</li>
            <li><strong>Checklist de regressão:</strong> 5 itens para o smoke test desta feature</li>
          </ol>
        `
      },
      {
        type: 'write-exercise',
        id: 'qa-2-8-ex1',
        prompt: 'Produza a suite completa de Test Cases (mínimo 8), a análise de risco e o checklist de smoke test para a feature de Cadastro de Usuário descrita acima.',
        placeholder: '=== SUITE DE TEST CASES ===\n\nTC-001 — Cadastro com dados válidos\nPré-condição: ...\nMassa: nome="João da Silva", email="joao@empresa.com", senha="Senha@123"\nPassos:\n  1. Acessar /cadastro\n  2. ...\nResultado esperado: ...\n\nTC-002 — ...\n\n=== ANÁLISE DE RISCO ===\n\nRisco 1: ...\n\n=== SMOKE TEST ===\n\n□ ...'
      }
    ]
  }

];
