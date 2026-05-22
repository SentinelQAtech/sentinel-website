// Sentinel Learning — Git & GitHub
// window.SL_GIT

(function () {
  'use strict';

  var COURSE = {
    id: 'git-github',
    slug: 'git-github',
    title: 'Git & GitHub',
    subtitle: 'Controle de versão na prática',
    description: 'Workflows com Git, pull requests, branches, merge, rebase, GitHub Actions e colaboração em times.',
    category: 'DevOps',
    level: 'Iniciante',
    estimatedHours: 20,
    totalModules: 4,
    totalLessons: 20,
    status: 'available',
    tags: ['git', 'github', 'version control', 'devops'],
    storageKey: null,

    getLessonContent: function (moduleNum, lessonIndex) {
      var mod = COURSE.modules[moduleNum - 1];
      if (!mod || !mod.lessons) return null;
      return mod.lessons[lessonIndex] || null;
    },

    modules: [
      {
        id: 'M1', title: 'Git Fundamentos',
        description: 'Entender o modelo mental do Git e comandos essenciais do dia a dia.',
        status: 'available',
        lessons: [
          {
            id: 'git.1.1', title: 'O que é controle de versão?', description: 'Por que o Git existe e o problema que ele resolve.', duration: '8 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O problema antes do Git' },
              { type: 'p', html: 'Imagine salvar arquivos como <code>projeto-final.zip</code>, <code>projeto-final-v2.zip</code>, <code>projeto-final-AGORA-VAI.zip</code>. Impossível saber o que mudou, quando, e por quê. Com um time de 5 pessoas, vira caos.' },
              { type: 'h2', text: 'O que o Git resolve?' },
              { type: 'p', html: 'Git é um <strong>sistema de controle de versão distribuído</strong>. Ele registra cada mudança no projeto com autor, data e descrição. Você consegue: ver todo o histórico, voltar para qualquer ponto no tempo, trabalhar em paralelo com outras pessoas sem sobrescrever o trabalho de ninguém.' },
              { type: 'callout', html: '<strong>Distribuído</strong> significa que cada desenvolvedor tem uma cópia completa do repositório localmente — você pode trabalhar offline e sincronizar quando tiver conexão.' },
            ]
          },
          {
            id: 'git.1.2', title: 'Instalação e configuração', description: 'Instalar Git e configurar identidade.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Instalando o Git' },
              { type: 'code', lang: 'bash', raw: '# Windows: baixar em git-scm.com/download/win\n# macOS:\nbrew install git\n\n# Linux (Ubuntu/Debian):\nsudo apt update && sudo apt install git\n\n# Verificar instalação:\ngit --version  # → git version 2.43.0' },
              { type: 'h2', text: 'Configuração inicial — obrigatória' },
              { type: 'code', lang: 'bash', raw: '# Sua identidade (aparece em todos os commits)\ngit config --global user.name "Raphael Castilho"\ngit config --global user.email "raphael@email.com"\n\n# Editor padrão (para mensagens de merge, rebase)\ngit config --global core.editor "code --wait"  # VS Code\n\n# Alias úteis:\ngit config --global alias.st "status"\ngit config --global alias.lg "log --oneline --graph --all"\n\n# Ver todas as configurações:\ngit config --list' },
              { type: 'callout', html: '<strong>--global</strong> aplica a configuração para todos os repositórios do seu usuário. Use <strong>--local</strong> (sem o global) para configurar só o repositório atual — útil quando você tem emails diferentes para trabalho e projetos pessoais.' },
            ]
          },
          {
            id: 'git.1.3', title: 'O modelo mental do Git', description: 'Working directory, staging area, local repo e remote.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'As 4 zonas do Git' },
              { type: 'p', html: 'Entender essas zonas é a chave para nunca mais se perder no Git:' },
              { type: 'code', lang: 'text', raw: '┌────────────────┐  git add   ┌─────────────┐  git commit  ┌──────────────┐  git push  ┌────────────┐\n│ Working        │ ─────────► │   Staging   │ ────────────► │  Local Repo  │ ──────────► │   Remote   │\n│ Directory      │            │   (Index)   │              │   (.git/)    │            │  (GitHub)  │\n│ (seus arquivos)│ ◄───────── │             │ ◄──────────── │              │ ◄───────── │            │\n└────────────────┘  git checkout  └─────────────┘  git reset   └──────────────┘  git fetch │            │\n                                                                                            └────────────┘' },
              { type: 'p', html: '<strong>Working Directory:</strong> seus arquivos locais, do jeito que você vê no explorador.<br><strong>Staging Area:</strong> mudanças que você preparou para o próximo commit.<br><strong>Local Repo:</strong> todos os commits salvos localmente.<br><strong>Remote:</strong> o repositório no GitHub — compartilhado com o time.' },
              { type: 'callout', html: '<strong>Staging é um diferencial do Git:</strong> você escolhe exatamente quais mudanças vão para cada commit. Um commit = uma unidade lógica de trabalho, não "tudo que eu salvei desde ontem".' },
            ]
          },
          {
            id: 'git.1.4', title: 'Commits: add, commit, log', description: 'Criar histórico limpo com mensagens profissionais.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O fluxo básico de commit' },
              { type: 'code', lang: 'bash', raw: '# 1. Ver o estado atual:\ngit status\n\n# 2. Ver as mudanças em detalhe:\ngit diff\n\n# 3. Preparar arquivos para o commit:\ngit add arquivo.txt          # arquivo específico\ngit add src/                 # pasta inteira\ngit add -p                   # interativo — escolhe trecho por trecho\n\n# 4. Commitar com mensagem:\ngit commit -m "feat: adicionar validação de CPF no cadastro"\n\n# 5. Ver o histórico:\ngit log --oneline\ngit log --oneline --graph --all  # com branches' },
              { type: 'h2', text: 'Conventional Commits — padrão profissional' },
              { type: 'code', lang: 'text', raw: 'Formato: <tipo>(<escopo>): <descrição curta>\n\nfeat: adicionar campo de telefone no cadastro\nfix: corrigir cálculo de frete para endereços internacionais\ndocs: atualizar README com instruções de setup\ntest: adicionar testes para validação de CPF\nrefactor: extrair lógica de auth para AuthService\nchore: atualizar dependências para versão segura\n\n# ✅ Boas mensagens (começam com verbo no imperativo):\nfeat: implementar login via Google\nfix: resolver erro 500 no checkout com cartão Amex\n\n# ❌ Mensagens ruins:\natualizações\nfixes\nwip\narquivos alterados' },
              { type: 'callout', html: '<strong>Por que mensagens boas importam?</strong> Em 6 meses, você vai usar <code>git log</code> para entender por que algo mudou. Uma mensagem ruim é tempo perdido investigando. Uma boa mensagem é documentação gratuita.' },
            ]
          },
          {
            id: 'git.1.5', title: 'Desfazendo mudanças', description: 'reset, restore e revert — quando usar cada um.', duration: '12 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Desfazer mudanças em diferentes zonas' },
              { type: 'code', lang: 'bash', raw: '# ─── Working Directory (ainda não fez add) ───\n# Descartar mudança em um arquivo:\ngit restore arquivo.txt\n\n# Descartar TUDO (cuidado! sem volta):\ngit restore .\n\n# ─── Staging Area (fez add, não fez commit) ───\n# Tirar arquivo do staging (sem perder a mudança):\ngit restore --staged arquivo.txt\n\n# ─── Commits locais (ainda não fez push) ───\n# Desfazer último commit, voltar as mudanças para staging:\ngit reset --soft HEAD~1\n\n# Desfazer último commit, voltar para working directory:\ngit reset HEAD~1\n\n# Desfazer último commit E PERDER AS MUDANÇAS (cuidado!):\ngit reset --hard HEAD~1\n\n# ─── Commits já publicados (git push feito) ───\n# NUNCA use reset em commits públicos!\n# Use revert — cria um novo commit desfazendo:\ngit revert abc123   # reverte o commit abc123' },
              { type: 'callout', html: '<strong>Regra de ouro:</strong> <code>reset --hard</code> em commits já publicados vai criar conflito para todos no time. Para desfazer código público, sempre use <code>git revert</code> — ele cria um novo commit com a reversão, sem reescrever o histórico.' },
            ]
          },
        ]
      },

      {
        id: 'M2', title: 'Branches & Merge',
        description: 'Trabalhar com branches para colaborar sem quebrar o código principal.',
        status: 'available',
        lessons: [
          {
            id: 'git.2.1', title: 'O que são branches?', description: 'Como Git armazena branches e por que usá-las.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Branches — linhas paralelas de desenvolvimento' },
              { type: 'p', html: 'Uma branch é simplesmente um <strong>ponteiro para um commit</strong>. Criar uma branch não copia o código — é baratíssimo. Você desenvolve em isolamento e integra quando estiver pronto.' },
              { type: 'code', lang: 'text', raw: 'main     → A → B → C → D\n                  ↑\nfeature  → E → F   (branch criada a partir de C)' },
              { type: 'p', html: 'A branch <strong>main</strong> (ou master) é a versão principal. Cada feature ou fix é desenvolvida em sua própria branch, sem afetar o trabalho dos outros.' },
              { type: 'callout', html: '<strong>Nunca desenvolva diretamente na main!</strong> Em times, a main tem proteções: revisão obrigatória, testes passando. Sempre crie uma branch para seu trabalho.' },
            ]
          },
          {
            id: 'git.2.2', title: 'Criar, mudar e deletar branches', description: 'Comandos de branch no dia a dia.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Gerenciando branches' },
              { type: 'code', lang: 'bash', raw: '# Ver branches existentes (* = branch atual):\ngit branch\ngit branch -a   # inclui branches remotas\n\n# Criar nova branch:\ngit branch feature/login-google\n\n# Criar e mudar de uma vez (preferível):\ngit switch -c feature/login-google\n# ou (equivalente, mais antigo):\ngit checkout -b feature/login-google\n\n# Mudar para uma branch existente:\ngit switch main\ngit switch develop\n\n# Renomear branch atual:\ngit branch -m feature/login  feature/login-google\n\n# Deletar branch (após o merge):\ngit branch -d feature/login-google         # seguro (recusa se não mergeou)\ngit branch -D feature/login-google         # forçado (cuidado!)\n\n# Deletar branch remota:\ngit push origin --delete feature/login-google' },
              { type: 'callout', html: '<strong>Nomenclatura de branches:</strong> <code>feature/nome-da-feature</code>, <code>fix/descricao-do-bug</code>, <code>hotfix/issue-critico</code>, <code>release/1.2.0</code>. Prefixos ajudam o time a entender o propósito de cada branch.' },
            ]
          },
          {
            id: 'git.2.3', title: 'Merge: fast-forward e 3-way', description: 'Como o Git combina históricos.', duration: '14 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Tipos de merge' },
              { type: 'code', lang: 'bash', raw: '# Fast-forward merge — sem conflito, sem divergência\n# Acontece quando a branch base não avançou desde o branching:\n#\n# main:    A → B\n# feature:         C → D\n# resultado: A → B → C → D  (histórico linear, sem commit de merge)\n\ngit switch main\ngit merge feature/minha-feature\n# → Fast-forward\n\n# 3-way merge — quando ambas as branches evoluíram:\n# main:    A → B → E\n# feature:     C → D\n# resultado: A → B → C → D → E → M  (M = merge commit)\n\ngit merge feature/minha-feature\n# → Merge commit created\n\n# Forçar sempre um merge commit (para manter histórico claro):\ngit merge --no-ff feature/minha-feature' },
              { type: 'callout', html: '<strong>--no-ff (no fast-forward):</strong> muitos times preferem sempre criar um merge commit, mesmo quando não é necessário. Isso preserva no histórico que aquele conjunto de commits veio de uma branch de feature.' },
            ]
          },
          {
            id: 'git.2.4', title: 'Resolvendo conflitos', description: 'Identificar e resolver merge conflicts com confiança.', duration: '15 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Quando acontece um conflito?' },
              { type: 'p', html: 'Conflito acontece quando <strong>duas branches modificaram a mesma linha</strong> do mesmo arquivo. Git não sabe qual versão manter — você precisa decidir.' },
              { type: 'code', lang: 'text', raw: '# O arquivo em conflito ficará assim:\n<<<<<<< HEAD (sua branch atual)\nconst mensagem = "Bem-vindo!";\n=======\nconst mensagem = "Olá, usuário!";\n>>>>>>> feature/saudacao\n\n# Você precisa:\n# 1. Escolher uma versão, ou\n# 2. Combinar as duas manualmente\n# 3. Remover os marcadores <<<, ===, >>>' },
              { type: 'code', lang: 'bash', raw: '# Fluxo de resolução de conflito:\ngit merge feature/saudacao\n# → CONFLICT: Merge conflict in src/messages.ts\n# → Automatic merge failed; fix conflicts and commit\n\n# 1. Ver quais arquivos têm conflito:\ngit status\n# → both modified: src/messages.ts\n\n# 2. Editar o arquivo e resolver manualmente\n# (VS Code tem um bom diff visual com "Accept Current/Incoming/Both")\n\n# 3. Após resolver:\ngit add src/messages.ts\ngit commit -m "merge: integrar branch feature/saudacao"\n\n# Se quiser cancelar o merge:\ngit merge --abort' },
            ]
          },
          {
            id: 'git.2.5', title: 'Rebase interativo', description: 'Reescrever histórico com squash e reorder.', duration: '15 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Para que serve o rebase?' },
              { type: 'p', html: 'Rebase <strong>reaplica seus commits em cima de outra branch</strong>, criando um histórico linear. Em vez de um merge commit, parece que você desenvolveu após os commits da main.' },
              { type: 'code', lang: 'bash', raw: '# Situação: main avançou, sua feature está "pra trás"\n# main:    A → B → C → D (novo)\n# feature:         E → F\n#\n# Com rebase:\n# main:    A → B → C → D\n# feature:                 E\' → F\'  (replicado após D)\n\ngit switch feature/minha-feature\ngit rebase main\n\n# Rebase interativo — reorganizar commits antes de um PR:\ngit rebase -i HEAD~3  # editar os últimos 3 commits\n# Opções:\n# pick  = manter o commit\n# squash = juntar com o anterior\n# fixup  = juntar sem incluir a mensagem\n# reword = manter mas editar a mensagem\n# drop   = remover o commit' },
              { type: 'callout', html: '<strong>Nunca rebase branches públicas:</strong> rebase reescreve o histórico — cria novos SHAs para os commits. Se outros colaboradores já têm os commits originais, vira um desastre. Use rebase apenas em branches locais ou feature branches pessoais.' },
            ]
          },
        ]
      },

      {
        id: 'M3', title: 'GitHub & Pull Requests',
        description: 'Colaborar com times usando GitHub, PRs e code reviews.',
        status: 'available',
        lessons: [
          {
            id: 'git.3.1', title: 'GitHub — repositórios remotos', description: 'Push, pull, fetch e o fluxo com remotes.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Conectando ao GitHub' },
              { type: 'code', lang: 'bash', raw: '# 1. Criar repositório no github.com primeiro, então:\ngit remote add origin https://github.com/seu-usuario/meu-repo.git\n\n# Verificar remote configurado:\ngit remote -v\n\n# Subir branch pela primeira vez:\ngit push -u origin main\n# -u = --set-upstream (vincula branch local → remota)\n\n# Após o -u, push simples:\ngit push\n\n# Baixar mudanças:\ngit pull           # = fetch + merge\ngit fetch          # só baixa, não aplica\ngit pull --rebase  # = fetch + rebase (histórico linear)' },
              { type: 'h2', text: 'Clonar um repositório existente' },
              { type: 'code', lang: 'bash', raw: '# Clonar = baixar o repo completo:\ngit clone https://github.com/usuario/repo.git\n\n# Clonar em uma pasta com nome específico:\ngit clone https://github.com/usuario/repo.git meu-projeto\n\n# Após clonar, o remote "origin" já está configurado automaticamente' },
            ]
          },
          {
            id: 'git.3.2', title: 'Abrindo um Pull Request', description: 'Criar PRs descritivos para revisão de código.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O fluxo de um Pull Request' },
              { type: 'p', html: 'Um Pull Request (PR) é uma proposta para integrar mudanças de uma branch para outra. É o ponto central de revisão de código, discussão e CI.' },
              { type: 'code', lang: 'bash', raw: '# 1. Criar branch e desenvolver:\ngit switch -c feature/adicionar-filtros\n# ... commits ...\n\n# 2. Subir para o GitHub:\ngit push -u origin feature/adicionar-filtros\n\n# 3. GitHub vai sugerir abrir um PR — clique no link\n# Ou vá em github.com → Pull Requests → New Pull Request' },
              { type: 'p', html: 'Um bom PR tem: <strong>título descritivo</strong> (ex: "feat: adicionar filtros por data na listagem de pedidos"), <strong>descrição</strong> explicando o que e por quê, <strong>screenshots</strong> se há mudanças visuais, e <strong>checklist</strong> de testes.' },
              { type: 'callout', html: '<strong>PRs pequenos são melhores:</strong> um PR com 50 linhas é revisado em 10 minutos. Um PR com 1000 linhas dura horas — e o revisor vai se cansar e aprovar sem revisar tudo.' },
            ]
          },
          {
            id: 'git.3.3', title: 'Code Review — como revisar e ser revisado', description: 'Boas práticas de code review.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'O que revisar em um PR?' },
              { type: 'p', html: 'Code review não é apenas caçar bugs. É verificar: lógica correta, edge cases cobertos, código legível, sem duplicação, testes adequados, sem regressões.' },
              { type: 'h2', text: 'Como dar feedback construtivo' },
              { type: 'code', lang: 'text', raw: '# ❌ Feedback vago ou agressivo:\n"Isso está errado"\n"Por que você fez assim?"\n\n# ✅ Feedback específico e construtivo:\n"Essa função pode retornar undefined se \'id\' for null.\n Sugiro adicionar: if (!id) return null;"\n\n"Nit: variável \'x\' poderia ter nome mais descritivo —\n o que ela representa?"\n\n"Aqui poderia usar Array.find() ao invés do for loop.\n Ficaria mais legível: users.find(u => u.id === userId)"\n\n# Prefixos úteis:\n# Nit: = pequeno detalhe, não bloqueia\n# Suggestion: = sugestão, você decide\n# Blocker: = precisa corrigir antes de mergear' },
            ]
          },
          {
            id: 'git.3.4', title: 'GitHub Flow', description: 'O workflow padrão para times ágeis.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'GitHub Flow — simples e eficaz' },
              { type: 'code', lang: 'text', raw: '1. main está sempre deployável\n\n2. Criar branch a partir da main:\n   git switch -c feature/nome-da-feature\n\n3. Fazer commits na branch\n\n4. Abrir Pull Request para main\n\n5. Discutir e revisar\n\n6. Merge na main → deploy automático\n\n7. Deletar a branch' },
              { type: 'p', html: 'GitHub Flow funciona bem para equipes que fazem <strong>continuous delivery</strong> — deploy a cada PR mergeado. É simples de entender e força PRs pequenos e frequentes.' },
              { type: 'callout', html: '<strong>Gitflow vs GitHub Flow:</strong> Gitflow (com branches develop, release, hotfix) é mais complexo e adequado para software com ciclos de release definidos (apps mobile, bibliotecas). GitHub Flow é ideal para SaaS e desenvolvimento web.' },
            ]
          },
          {
            id: 'git.3.5', title: 'Issues, Milestones e Projects', description: 'Rastrear trabalho no GitHub.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Issues — rastreando bugs e tarefas' },
              { type: 'p', html: 'Issues são o tracker de tarefas integrado do GitHub. Use para: reportar bugs, propor features, documentar decisões. Cada issue tem: título, descrição, labels, assignee e milestone.' },
              { type: 'code', lang: 'text', raw: '# Vincular um commit a uma issue:\ngit commit -m "fix: corrigir cálculo de desconto\n\nCloses #42"\n# "Closes #42" fecha a issue automaticamente quando o PR mergear\n\n# Outras keywords:\n# Fixes #42   Resolves #42   Closes #42\n# (todas fecham a issue no merge)' },
              { type: 'h2', text: 'GitHub Projects — kanban integrado' },
              { type: 'p', html: 'GitHub Projects é um board kanban que integra issues e PRs. Você consegue visualizar o trabalho em andamento, priorizar e rastrear progresso por sprint ou milestone — sem precisar de ferramentas externas para projetos pequenos.' },
            ]
          },
        ]
      },

      {
        id: 'M4', title: 'GitHub Actions',
        description: 'Automação de CI/CD diretamente no GitHub.',
        status: 'available',
        lessons: [
          {
            id: 'git.4.1', title: 'O que é GitHub Actions?', description: 'CI/CD integrado ao GitHub.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'GitHub Actions — automação sem servidor' },
              { type: 'p', html: 'GitHub Actions permite executar scripts automaticamente em resposta a eventos no repositório: push, PR, issue, schedule. É onde você configura CI/CD, lint, testes automáticos e deploys.' },
              { type: 'code', lang: 'text', raw: 'Terminologia:\n\n• Workflow   = arquivo YAML em .github/workflows/\n• Job        = conjunto de steps que roda em uma máquina\n• Step       = comando ou action a executar\n• Action     = unidade reutilizável (ex: actions/checkout)\n• Runner     = a máquina virtual que executa o job\n              (ubuntu-latest, windows-latest, macos-latest)' },
              { type: 'callout', html: '<strong>GitHub Actions é gratuito</strong> para repositórios públicos. Para privados, há um limite mensal de minutos (depende do plano). Runners Linux custam menos minutos que Windows ou macOS.' },
            ]
          },
          {
            id: 'git.4.2', title: 'Seu primeiro workflow', description: 'Criar um workflow de CI que roda testes.', duration: '14 min', xp: 75, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Workflow básico de CI' },
              { type: 'code', lang: 'yaml', raw: '# .github/workflows/ci.yml\nname: CI\n\n# Quando executar:\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n\n    steps:\n      # 1. Clonar o repositório\n      - uses: actions/checkout@v4\n\n      # 2. Configurar Node.js\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: \'npm\'    # cacheia node_modules entre runs\n\n      # 3. Instalar dependências\n      - run: npm ci        # mais seguro que npm install em CI\n\n      # 4. Lint\n      - run: npm run lint\n\n      # 5. Testes\n      - run: npm test' },
              { type: 'callout', html: '<strong>npm ci vs npm install:</strong> <code>npm ci</code> instala as dependências exatamente como estão no <code>package-lock.json</code> e falha se houver divergência. É mais rápido, determinístico e ideal para CI.' },
            ]
          },
          {
            id: 'git.4.3', title: 'Secrets e variáveis de ambiente', description: 'Gerenciar segredos no CI sem expor credenciais.', duration: '12 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Secrets no GitHub Actions' },
              { type: 'p', html: 'Nunca coloque senhas, tokens ou API keys no código ou nos workflows. Use GitHub Secrets — eles são criptografados e não aparecem nos logs.' },
              { type: 'code', lang: 'yaml', raw: '# Configurar em: Settings → Secrets and variables → Actions\n# Então usar no workflow:\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Deploy para produção\n        env:\n          API_KEY:     ${{ secrets.PRODUCTION_API_KEY }}\n          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}\n        run: |\n          echo "API_KEY=$API_KEY" >> .env\n          npm run deploy\n\n      # Variáveis de ambiente não-secretas:\n      - name: Build\n        env:\n          NODE_ENV: production\n          API_URL:  ${{ vars.PROD_API_URL }}   # "vars" é público\n        run: npm run build' },
            ]
          },
          {
            id: 'git.4.4', title: 'Protegendo a branch main', description: 'Branch protection rules e required checks.', duration: '10 min', xp: 50, type: 'lesson', status: 'available',
            sections: [
              { type: 'h2', text: 'Branch Protection Rules' },
              { type: 'p', html: 'Configure em: <strong>Settings → Branches → Add branch protection rule</strong>. Aplique à branch <code>main</code>.' },
              { type: 'code', lang: 'text', raw: 'Regras recomendadas para main:\n\n✅ Require a pull request before merging\n   → Ninguém pode fazer push direto na main\n\n✅ Require approvals: 1 (ou 2 para times maiores)\n   → PR precisa de aprovação antes de mergear\n\n✅ Require status checks to pass before merging\n   → CI deve passar (testes, lint) antes do merge\n   → Selecione os jobs específicos que devem passar\n\n✅ Require branches to be up to date\n   → Branch deve estar atualizada com main antes do merge\n\n✅ Do not allow bypassing the above settings\n   → Nem admins podem burlar as regras' },
              { type: 'callout', html: '<strong>Branch protection é proteção coletiva:</strong> evita deploys acidentais, garante revisão de todo código e mantém o CI sempre verde. É uma das primeiras configurações que um time sério deve fazer.' },
            ]
          },
          {
            id: 'git.4.5', title: 'Projeto: Deploy automático com GitHub Actions', description: 'Pipeline completo: teste → build → deploy.', duration: '16 min', xp: 100, type: 'project', status: 'available',
            sections: [
              { type: 'h2', text: 'Pipeline completo de CI/CD' },
              { type: 'code', lang: 'yaml', raw: '# .github/workflows/deploy.yml\nname: Deploy\n\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20, cache: \'npm\' }\n      - run: npm ci\n      - run: npm test\n\n  deploy:\n    needs: test          # só executa se "test" passar\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20, cache: \'npm\' }\n      - run: npm ci\n      - run: npm run build\n      - name: Deploy para Vercel\n        env:\n          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}\n        run: npx vercel --prod --token=$VERCEL_TOKEN' },
              { type: 'exercise', title: 'Configure seu pipeline', desc: 'Configure CI/CD no seu repositório do GitHub.', steps: ['Crie o arquivo .github/workflows/ci.yml', 'Configure para rodar em push na main e em PRs', 'Adicione steps de install, lint e test', 'Configure branch protection na main exigindo CI verde', 'Faça um PR e veja o CI rodando automaticamente'], starterCode: '# .github/workflows/ci.yml\nname: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      # TODO: adicionar steps', solution: '# Veja o workflow completo na documentação do GitHub Actions:\n# docs.github.com/actions' },
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

  window.SL_GIT = COURSE;
})();
