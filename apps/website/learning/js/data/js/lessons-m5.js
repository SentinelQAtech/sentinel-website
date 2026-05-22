// Sentinel Learning — Módulo 5: Git & GitHub

(function () {
  window.M5 = [

    // ─── 5.1 ────────────────────────────────────────────────────────────────
    {
      id: '5.1', module: 5, index: 1,
      title: 'O que é Git e por que usar',
      duration: 16,
      sections: [
        { type: 'h2', text: 'O problema que o Git resolve' },
        { type: 'p', html: 'Sem controle de versão, você tem: <code>projeto_final.zip</code>, <code>projeto_final_v2.zip</code>, <code>projeto_final_ESSE.zip</code>. Sem saber o que mudou, quando e por quê. O <strong>Git</strong> resolve isso rastreando cada mudança, quem fez e quando.' },
        { type: 'callout', html: '<strong>Git</strong> é um sistema de controle de versão distribuído criado por Linus Torvalds em 2005. <strong>GitHub</strong> é uma plataforma online que hospeda repositórios Git. Git é a ferramenta; GitHub é o serviço.' },
        { type: 'h2', text: 'Conceitos fundamentais' },
        { type: 'code', lang: 'text', raw: 'Repository (repo)   → pasta controlada pelo Git\nCommit              → snapshot do projeto num momento\nBranch              → linha paralela de desenvolvimento\nMerge               → juntar duas branches\nClone               → cópia local de um repo remoto\nPush                → enviar commits para o remoto\nPull                → baixar commits do remoto' },
        { type: 'h2', text: 'Os três estados do Git' },
        { type: 'code', lang: 'text', raw: 'Working Directory   → arquivos modificados, não rastreados\nStaging Area        → arquivos preparados para o próximo commit\nRepository          → commits salvos no histórico\n\nFluxo:\n  1. Você edita arquivos     → Working Directory\n  2. git add arquivo         → Staging Area\n  3. git commit -m "msg"     → Repository (histórico)' },
        { type: 'h2', text: 'Configuração inicial' },
        { type: 'code', lang: 'bash', raw: '# Configurar sua identidade (feito uma vez)\ngit config --global user.name "Seu Nome"\ngit config --global user.email "seu@email.com"\n\n# Verificar configuração\ngit config --list' },
      ]
    },

    // ─── 5.2 ────────────────────────────────────────────────────────────────
    {
      id: '5.2', module: 5, index: 2,
      title: 'Comandos Essenciais',
      duration: 22,
      sections: [
        { type: 'h2', text: 'Iniciando e commitando' },
        { type: 'code', lang: 'bash', raw: '# Iniciar repositório na pasta atual\ngit init\n\n# Ver status dos arquivos\ngit status\n\n# Adicionar arquivos ao staging\ngit add index.html          # arquivo específico\ngit add .                   # todos os arquivos modificados\ngit add *.js                # por padrão glob\n\n# Criar um commit\ngit commit -m "feat: adicionar página inicial"\n\n# Ver histórico de commits\ngit log\ngit log --oneline           # resumido\ngit log --oneline --graph   # com gráfico de branches' },
        { type: 'h2', text: 'Branches — trabalhando em paralelo' },
        { type: 'code', lang: 'bash', raw: '# Ver branches existentes\ngit branch\n\n# Criar uma nova branch\ngit branch feature/menu-mobile\n\n# Mudar para uma branch\ngit checkout feature/menu-mobile\n\n# Criar E mudar ao mesmo tempo\ngit checkout -b feature/login\n\n# Juntar uma branch na atual (merge)\ngit checkout main\ngit merge feature/login\n\n# Deletar branch após merge\ngit branch -d feature/login' },
        { type: 'h2', text: 'Desfazendo coisas' },
        { type: 'code', lang: 'bash', raw: '# Descartar mudanças em um arquivo (cuidado — irreversível)\ngit checkout -- arquivo.js\n\n# Remover arquivo do staging (mas mantém as mudanças)\ngit restore --staged arquivo.js\n\n# Desfazer o último commit (mas mantém as mudanças no working dir)\ngit reset HEAD~1\n\n# Ver o que mudou\ngit diff                    # mudanças no working dir\ngit diff --staged           # mudanças no staging' },
        { type: 'callout', html: '<strong>Convenção de mensagens de commit:</strong> use o formato <code>tipo: descrição</code>. Tipos comuns: <code>feat</code> (nova funcionalidade), <code>fix</code> (correção), <code>style</code> (visual), <code>refactor</code>, <code>docs</code>, <code>test</code>. Ex: <code>feat: adicionar autenticação com Google</code>' },
        { type: 'exercise',
          title: 'Primeiro fluxo Git',
          desc: 'Crie um repositório, faça commits em uma feature branch e mergue na main.',
          steps: [
            'Crie uma pasta "meu-projeto", entre nela e rode git init',
            'Crie um index.html com conteúdo básico e faça o primeiro commit',
            'Crie uma branch "feature/sobre" e adicione uma página sobre.html',
            'Faça commit na feature branch',
            'Volte para main e faça merge da feature branch'
          ],
          solution: 'mkdir meu-projeto && cd meu-projeto\ngit init\n\necho "<!DOCTYPE html><html><body><h1>Olá</h1></body></html>" > index.html\ngit add index.html\ngit commit -m "feat: criar página inicial"\n\ngit checkout -b feature/sobre\necho "<!DOCTYPE html><html><body><h1>Sobre</h1></body></html>" > sobre.html\ngit add sobre.html\ngit commit -m "feat: adicionar página sobre"\n\ngit checkout main\ngit merge feature/sobre\ngit log --oneline' },
      ]
    },

    // ─── 5.3 ────────────────────────────────────────────────────────────────
    {
      id: '5.3', module: 5, index: 3,
      title: 'GitHub — Repositórios Remotos',
      duration: 22,
      sections: [
        { type: 'h2', text: 'Conectando local ao GitHub' },
        { type: 'code', lang: 'bash', raw: '# 1. Crie um repositório no GitHub (botão New)\n# 2. Conecte o repo local ao remoto\ngit remote add origin https://github.com/usuario/repo.git\n\n# 3. Enviar commits para o GitHub\ngit push -u origin main    # -u = define upstream (só na primeira vez)\n\n# Próximos pushes:\ngit push\n\n# Baixar atualizações do remoto\ngit pull\n\n# Clonar um repositório existente\ngit clone https://github.com/usuario/repo.git' },
        { type: 'h2', text: 'Fluxo de trabalho profissional' },
        { type: 'code', lang: 'bash', raw: '# Fluxo padrão de feature:\n\n# 1. Atualizar a main local\ngit checkout main\ngit pull\n\n# 2. Criar branch para a feature\ngit checkout -b feature/nova-funcionalidade\n\n# 3. Desenvolver, commitar\ngit add .\ngit commit -m "feat: implementar nova funcionalidade"\n\n# 4. Enviar a branch para o GitHub\ngit push -u origin feature/nova-funcionalidade\n\n# 5. Abrir Pull Request no GitHub\n# 6. Code review, ajustes, aprovação\n# 7. Merge no GitHub\n\n# 8. Limpar local\ngit checkout main\ngit pull\ngit branch -d feature/nova-funcionalidade' },
        { type: 'h2', text: 'Pull Request — colaboração profissional' },
        { type: 'p', html: 'Um <strong>Pull Request</strong> (PR) é a forma de propor mudanças num projeto. Em vez de dar push direto na main, você cria uma branch, abre um PR e pede revisão. O PR tem: título, descrição do que mudou, por quê e como testar.' },
        { type: 'h2', text: '.gitignore — o que não versionar' },
        { type: 'code', lang: 'text', raw: '# .gitignore — arquivos/pastas para o Git ignorar\nnode_modules/    # dependências (regeneráveis via npm install)\n.env             # variáveis de ambiente e segredos\ndist/            # arquivos de build\n*.log            # logs\n.DS_Store        # arquivos do macOS\n.idea/           # configurações de IDE' },
        { type: 'callout', html: 'NUNCA comite o arquivo <code>.env</code> — ele contém senhas, API keys e segredos. Adicione sempre no <code>.gitignore</code>. Crie um <code>.env.example</code> com as chaves (sem os valores) para documentar o que é necessário.' },
        { type: 'exercise',
          title: 'Publicar projeto no GitHub',
          desc: 'Envie o projeto da lista de tarefas (módulo 3) para o GitHub.',
          steps: [
            'Crie um repositório público no GitHub chamado "todo-app"',
            'Dentro do projeto da lista de tarefas, rode git init e faça o primeiro commit',
            'Conecte ao remote e faça push (git push -u origin main)',
            'Crie uma branch "feature/localStorage", adicione a persistência, commit e push',
            'Abra um Pull Request no GitHub comparando a branch com a main'
          ],
          solution: 'git init\ngit add .\ngit commit -m "feat: criar app de lista de tarefas"\n\ngit remote add origin https://github.com/SEU_USUARIO/todo-app.git\ngit push -u origin main\n\ngit checkout -b feature/localStorage\n# ... adicione a persistência no código ...\ngit add .\ngit commit -m "feat: adicionar persistência com localStorage"\ngit push -u origin feature/localStorage\n\n# Agora vá ao GitHub e abra o Pull Request' },
      ]
    },

    // ─── 5.4 ────────────────────────────────────────────────────────────────
    {
      id: '5.4', module: 5, index: 4,
      title: 'Resolvendo Conflitos',
      duration: 18,
      sections: [
        { type: 'h2', text: 'Quando conflitos acontecem' },
        { type: 'p', html: 'Um conflito acontece quando duas branches modificaram a <strong>mesma parte</strong> de um arquivo. O Git não sabe qual versão manter — você precisa decidir.' },
        { type: 'code', lang: 'text', raw: '// Como um conflito aparece no arquivo:\n<<<<<<< HEAD          ← sua versão (branch atual)\nbgcolor = "azul"\n=======               ← separador\nbgcolor = "verde"\n>>>>>>> feature/cor   ← versão que está vindo' },
        { type: 'code', lang: 'bash', raw: '# Quando git merge gera conflito:\n$ git merge feature/cor\nCONFLICT (content): Merge conflict in style.css\nAutomatic merge failed; fix conflicts and then commit the result.\n\n# 1. Abra os arquivos com conflito e resolva manualmente\n# 2. Depois de resolver:\ngit add style.css\ngit commit -m "fix: resolver conflito na cor do fundo"\n\n# Alternativa: abortar o merge e recomeçar\ngit merge --abort' },
        { type: 'h2', text: 'Estratégias para reduzir conflitos' },
        { type: 'code', lang: 'bash', raw: '# Atualizar sua branch com a main frequentemente\ngit checkout feature/minha-funcionalidade\ngit merge main         # traz atualizações da main para sua branch\n# OU\ngit rebase main        # reaplica seus commits em cima da main atual\n\n# Fazer commits pequenos e frequentes\n# Dividir trabalho para não editar os mesmos arquivos' },
        { type: 'exercise',
          title: 'Simulando e resolvendo um conflito',
          desc: 'Crie intencionalmente um conflito e resolva.',
          steps: [
            'Crie um repo com um arquivo style.css contendo: body { color: red; }',
            'Crie uma branch "cor-azul" e mude para body { color: blue; }',
            'Volte para main e mude para body { color: green; }',
            'Tente fazer merge da branch "cor-azul" na main — haverá conflito',
            'Resolva o conflito manualmente escolhendo a cor que quiser e faça o commit'
          ],
          solution: 'git init && echo "body { color: red; }" > style.css\ngit add . && git commit -m "estilos iniciais"\n\ngit checkout -b cor-azul\necho "body { color: blue; }" > style.css\ngit add . && git commit -m "mudar para azul"\n\ngit checkout main\necho "body { color: green; }" > style.css\ngit add . && git commit -m "mudar para verde"\n\ngit merge cor-azul\n# Conflito! Edite style.css, escolha uma cor, remova os marcadores\ngit add style.css\ngit commit -m "resolver conflito de cor"' },
      ]
    },

    // ─── 5.5 ────────────────────────────────────────────────────────────────
    {
      id: '5.5', module: 5, index: 5,
      title: 'GitHub Pages e Colaboração Open Source',
      duration: 18,
      sections: [
        { type: 'h2', text: 'Publicando no GitHub Pages' },
        { type: 'p', html: 'O <strong>GitHub Pages</strong> hospeda sites estáticos diretamente do seu repositório — gratuitamente. Ideal para portfólios, projetos de HTML/CSS/JS e documentação.' },
        { type: 'code', lang: 'bash', raw: '# 1. Certifique que seu projeto está no GitHub\n# 2. No repositório: Settings → Pages\n# 3. Source: "Deploy from a branch"\n# 4. Branch: main / root\n# 5. Salvar\n# Seu site estará em: https://usuario.github.io/nome-do-repo' },
        { type: 'callout', html: '<strong>Dica:</strong> se o repositório se chamar <code>usuario.github.io</code> (exatamente), a URL será <code>https://usuario.github.io</code> — sem sufixo. Use isso para seu portfólio principal.' },
        { type: 'h2', text: 'Contribuindo para projetos open source' },
        { type: 'code', lang: 'bash', raw: '# 1. Fork — crie uma cópia do repo na sua conta (botão no GitHub)\n\n# 2. Clone o SEU fork\ngit clone https://github.com/SEU_USUARIO/projeto-original.git\n\n# 3. Adicione o repo original como "upstream"\ngit remote add upstream https://github.com/AUTOR/projeto-original.git\n\n# 4. Crie uma branch para sua contribuição\ngit checkout -b fix/corrigir-typo\n\n# 5. Faça as mudanças, commit e push para o SEU fork\ngit push origin fix/corrigir-typo\n\n# 6. Abra um PR do seu fork para o repo original\n\n# 7. Manter seu fork atualizado com o original:\ngit fetch upstream\ngit checkout main\ngit merge upstream/main' },
        { type: 'h2', text: 'README bem feito' },
        { type: 'code', lang: 'markdown', raw: '# Nome do Projeto\n\nDescrição em uma linha do que o projeto faz.\n\n## Demo\n\n[Ver online](https://usuario.github.io/projeto)\n\n## Funcionalidades\n\n- ✅ Feature 1\n- ✅ Feature 2\n\n## Como rodar\n\n```bash\ngit clone https://github.com/usuario/projeto.git\ncd projeto\nnpm install\nnpm start\n```\n\n## Tecnologias\n\n- HTML, CSS, JavaScript\n- Fetch API\n- localStorage\n\n## Licença\n\nMIT' },
        { type: 'exercise',
          title: 'Publicar no GitHub Pages',
          desc: 'Publique um dos seus projetos no GitHub Pages e adicione um README completo.',
          steps: [
            'Escolha o projeto da calculadora, clima ou lista de tarefas',
            'Certifique que está no GitHub com um README básico',
            'Ative o GitHub Pages nas configurações do repositório',
            'Atualize o README com: descrição, link da demo, funcionalidades e como rodar',
            'Compartilhe o link — é o início do seu portfólio'
          ],
          solution: '# Feito diretamente no GitHub:\n# Settings → Pages → Deploy from branch → main → Save\n# URL: https://SEU_USUARIO.github.io/NOME_DO_REPO\n\n# No README.md:\n# [![Demo](badge)](https://SEU_USUARIO.github.io/NOME_DO_REPO)' },
      ]
    },

    // ─── 5.6 / 5.7 ──────────────────────────────────────────────────────────
    {
      id: '5.6', module: 5, index: 6,
      title: 'Git no Dia a Dia — Dicas Profissionais',
      duration: 16,
      sections: [
        { type: 'h2', text: 'Comandos que você vai usar todo dia' },
        { type: 'code', lang: 'bash', raw: '# Guardar mudanças temporariamente (sem commitar)\ngit stash              # guarda o estado atual\ngit stash pop          # restaura o que foi guardado\ngit stash list         # lista os stashes\n\n# Copiar um commit específico para outra branch\ngit cherry-pick abc1234\n\n# Ver quem mudou cada linha de um arquivo\ngit blame arquivo.js\n\n# Buscar um commit que introduziu um bug (bisect)\ngit bisect start\ngit bisect bad         # commit atual tem o bug\ngit bisect good v1.0   # essa versão estava ok\n# Git divide e conquista — você testa cada versão e diz good/bad\ngit bisect reset       # terminar' },
        { type: 'h2', text: 'Aliases úteis' },
        { type: 'code', lang: 'bash', raw: '# Configure atalhos para comandos longos\ngit config --global alias.st "status"\ngit config --global alias.co "checkout"\ngit config --global alias.lg "log --oneline --graph --all"\ngit config --global alias.undo "reset HEAD~1"\n\n# Usar:\ngit st\ngit lg' },
        { type: 'h2', text: 'Boas práticas de commit' },
        { type: 'code', lang: 'text', raw: '✅ Commits pequenos e focados (uma mudança por commit)\n✅ Mensagem no imperativo: "adicionar feature", não "adicionou feature"\n✅ Prefixo de tipo: feat, fix, docs, style, refactor, test\n✅ Nunca commitar: .env, node_modules, credenciais\n✅ Commitar frequentemente — você pode desfazer, não pode recuperar\n✅ Testar antes de commitar — não commite código que quebra a build' },
        { type: 'exercise',
          title: 'Simular fluxo profissional',
          desc: 'Pratique o fluxo completo: branch → commits → push → PR simulado.',
          steps: [
            'No repositório do projeto da lista de tarefas, crie uma branch "feature/filtros"',
            'Adicione 3 commits pequenos: (1) HTML dos botões de filtro, (2) CSS dos filtros, (3) JavaScript da lógica de filtro',
            'Use git stash para pausar o trabalho, veja o estado da main, depois stash pop para continuar',
            'Faça push da branch e descreva como seria seu PR (título, descrição, como testar)'
          ],
          solution: 'git checkout -b feature/filtros\n\n# Commit 1: HTML\n# edite index.html\ngit add index.html\ngit commit -m "feat: adicionar botões de filtro no HTML"\n\n# Commit 2: CSS\n# edite style.css\ngit add style.css\ngit commit -m "style: estilizar botões de filtro"\n\n# Commit 3: JS\n# edite app.js\ngit add app.js\ngit commit -m "feat: implementar lógica de filtro (todas/ativas/concluídas)"\n\ngit push -u origin feature/filtros\n\n# PR: "feat: adicionar filtros na lista de tarefas\n# Adiciona 3 filtros (Todas, Ativas, Concluídas) para segmentar as tarefas.\n# Como testar: criar algumas tarefas, marcar algumas como concluídas\n# e testar cada filtro."' },
      ]
    },

    // ─── 5.7 ────────────────────────────────────────────────────────────────
    {
      id: '5.7', module: 5, index: 7,
      title: 'Projeto — Histórico de um Projeto Real',
      duration: 30,
      sections: [
        { type: 'h2', text: 'Consolidando Git na prática' },
        { type: 'p', html: 'Neste projeto você vai organizar o histórico Git de um dos seus projetos anteriores — seguindo as boas práticas profissionais que aprendeu. O objetivo é ter um repositório GitHub que qualquer dev consiga entender, clonar e rodar.' },
        { type: 'h2', text: 'Checklist do repositório profissional' },
        { type: 'code', lang: 'text', raw: '✅ README.md completo (descrição, demo, como rodar, stack)\n✅ .gitignore configurado\n✅ Histórico de commits limpo e descritivo\n✅ Branches nomeadas corretamente (feature/, fix/, docs/)\n✅ Sem arquivos sensíveis (.env, senhas)\n✅ GitHub Pages ativo (se projeto web)\n✅ Tags de versão para releases importantes (git tag v1.0)' },
        { type: 'h2', text: 'Criando tags de versão' },
        { type: 'code', lang: 'bash', raw: '# Criar uma tag no commit atual\ngit tag v1.0\ngit tag v1.0 -m "Versão 1.0 — funcionalidades básicas completas"\n\n# Listar tags\ngit tag\n\n# Enviar tags para o GitHub\ngit push origin --tags\n\n# No GitHub, vá em Releases para ver as tags e criar release notes' },
        { type: 'h2', text: 'GitHub Profile README' },
        { type: 'p', html: 'O GitHub permite criar um repositório com o mesmo nome do seu usuário — o README.md desse repositório aparece no seu perfil. É seu cartão de visita para recrutadores.' },
        { type: 'code', lang: 'markdown', raw: '# Raphael Castilho\n\nDesenvolvedor Front-end e QA Engineer em formação.\n\n## Tecnologias\n\n![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)\n![HTML](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white)\n![CSS](https://img.shields.io/badge/-CSS3-1572B6?logo=css3)\n\n## Projetos em destaque\n\n- [Lista de Tarefas](link) — DOM, eventos, localStorage\n- [App de Clima](link) — Fetch API, async/await\n- [Dashboard Financeiro](link) — gerenciamento de estado\n\n## Onde me encontrar\n\n[![LinkedIn](badge)](link) [![GitHub](badge)](link)' },
        { type: 'exercise',
          title: 'Perfil GitHub profissional',
          desc: 'Configure seu perfil GitHub com README, projetos publicados e primeiras contribuições.',
          steps: [
            'Crie o repositório especial usuario/usuario.github.io com seu README de perfil',
            'Publique pelo menos 2 dos projetos deste curso com GitHub Pages ativo',
            'Cada repositório deve ter README com descrição e link da demo',
            'Adicione uma tag v1.0 no commit mais recente de cada projeto',
            'Opcional: contribua com um projeto open source — mesmo uma correção de typo conta'
          ],
          solution: '# Criar o repo especial de perfil:\n# github.com/new → nome = SEU_USUARIO\n# Marcar "Add README"\n# Editar com suas informações\n\n# Para cada projeto:\ngit tag v1.0 -m "versão 1.0 completa"\ngit push origin --tags\n\n# GitHub → repositório → Releases → Create a release\n# Selecione a tag v1.0 e descreva o que a versão inclui' },
      ]
    },

  ]
})()
