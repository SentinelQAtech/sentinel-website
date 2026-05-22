// Sentinel Learning — Módulo 3: DOM & Eventos

(function () {
  window.M3 = [

    // ─── 3.1 ────────────────────────────────────────────────────────────────
    {
      id: '3.1', module: 3, index: 1,
      title: 'O que é o DOM',
      duration: 14,
      sections: [
        { type: 'h2', text: 'Do código ao que você vê na tela' },
        { type: 'p', html: 'Quando o browser carrega uma página HTML, ele lê o arquivo e constrói uma representação em memória de todos os elementos — parágrafos, botões, imagens, divs. Essa representação se chama <strong>DOM</strong>: Document Object Model.' },
        { type: 'p', html: 'O DOM é uma árvore de objetos. Cada tag HTML vira um <strong>nó</strong> (node). O JavaScript acessa e manipula esses nós em tempo real — sem precisar recarregar a página.' },
        { type: 'callout', html: '<strong>Analogia:</strong> o HTML é o projeto arquitetônico da casa. O DOM é a casa construída. O JS é o morador que move os móveis, pinta as paredes e abre as janelas — sem demolir e reconstruir.' },
        { type: 'h2', text: 'A estrutura em árvore' },
        { type: 'code', lang: 'HTML', raw: '<!-- HTML -->\n<html>\n  <head>\n    <title>Minha Página</title>\n  </head>\n  <body>\n    <h1>Olá Mundo</h1>\n    <p>Parágrafo com <strong>negrito</strong></p>\n    <ul>\n      <li>Item 1</li>\n      <li>Item 2</li>\n    </ul>\n  </body>\n</html>' },
        { type: 'p', html: 'No DOM, essa estrutura vira: <code>document</code> → <code>html</code> → <code>head</code> / <code>body</code> → filhos de cada um. Tudo que você vê na tela tem um equivalente no DOM.' },
        { type: 'h2', text: 'O objeto document' },
        { type: 'p', html: '<code>document</code> é o ponto de entrada do DOM. É o objeto raiz que representa a página inteira. A partir dele você busca elementos, cria novos nós e modifica o que já existe.' },
        { type: 'code', lang: 'JavaScript', raw: 'console.log(document)              // a página inteira\nconsole.log(document.title)        // "Minha Página"\nconsole.log(document.body)         // o elemento <body>\nconsole.log(document.body.children) // HTMLCollection dos filhos do body' },
        { type: 'callout', html: 'O <code>document</code> já está disponível globalmente — você não precisa importar nada. É um dos objetos que o browser entrega automaticamente para o JavaScript da página.' },
      ]
    },

    // ─── 3.2 ────────────────────────────────────────────────────────────────
    {
      id: '3.2', module: 3, index: 2,
      title: 'Selecionando Elementos',
      duration: 18,
      sections: [
        { type: 'h2', text: 'Os métodos de seleção' },
        { type: 'p', html: 'Para manipular um elemento, você precisa primeiro encontrá-lo. O JavaScript oferece vários métodos de seleção — cada um com suas características:' },
        { type: 'code', lang: 'JavaScript', raw: '// Seleciona pelo id (retorna 1 elemento ou null)\nconst titulo = document.getElementById("meu-titulo")\n\n// Seleciona pelo seletor CSS (retorna o primeiro encontrado)\nconst btn = document.querySelector(".btn-primary")\nconst input = document.querySelector("input[type=email]")\n\n// Seleciona todos que correspondem (NodeList)\nconst itens = document.querySelectorAll("li")\nconst cards = document.querySelectorAll(".card")\n\nconsole.log(itens.length)  // quantos elementos foram encontrados' },
        { type: 'h2', text: 'querySelector vs querySelectorAll' },
        { type: 'p', html: '<code>querySelector</code> retorna o <strong>primeiro</strong> elemento que bate com o seletor CSS, ou <code>null</code> se não encontrar. <code>querySelectorAll</code> retorna uma <strong>NodeList</strong> com todos os elementos — mesmo que vazia.' },
        { type: 'code', lang: 'JavaScript', raw: '// Seletores CSS funcionam aqui — os mesmos do seu CSS\ndocument.querySelector("#app")           // por id\ndocument.querySelector(".container")     // por classe\ndocument.querySelector("header nav a")   // descendente\ndocument.querySelector("input:focus")    // pseudo-classe\ndocument.querySelector("[data-id=\'42\']") // por atributo' },
        { type: 'h2', text: 'Verificando se o elemento existe' },
        { type: 'p', html: 'Sempre que você usa <code>querySelector</code>, pode receber <code>null</code>. Tentar acessar uma propriedade de <code>null</code> gera erro. A proteção é simples:' },
        { type: 'code', lang: 'JavaScript', raw: 'const modal = document.querySelector(".modal")\n\nif (modal) {\n  modal.classList.add("open")   // só executa se modal existir\n}\n\n// Alternativa com optional chaining (moderno)\nmodal?.classList.add("open")' },
        { type: 'h2', text: 'Percorrendo uma NodeList' },
        { type: 'code', lang: 'JavaScript', raw: 'const itens = document.querySelectorAll("li")\n\n// forEach — o mais comum\nitens.forEach(function(item) {\n  console.log(item.textContent)\n})\n\n// for...of — também funciona\nfor (const item of itens) {\n  item.classList.add("ativo")\n}' },
        { type: 'exercise',
          title: 'Selecionando elementos reais',
          desc: 'Dado este HTML, selecione e acesse elementos usando querySelector.',
          steps: [
            'Cole esse HTML num arquivo .html e abra no browser',
            'No console, selecione o h1 pelo id e imprima seu textContent',
            'Use querySelectorAll para pegar todos os li e imprima quantos são',
            'Selecione o botão pela classe e imprima seu textContent'
          ],
          solution: '// HTML de referência:\n// <h1 id="titulo">Lista de Tarefas</h1>\n// <ul>\n//   <li>Estudar JS</li>\n//   <li>Treinar DOM</li>\n//   <li>Fazer projeto</li>\n// </ul>\n// <button class="btn-add">Adicionar</button>\n\nconst titulo = document.getElementById("titulo")\nconsole.log(titulo.textContent)  // "Lista de Tarefas"\n\nconst itens = document.querySelectorAll("li")\nconsole.log(itens.length)  // 3\n\nconst btn = document.querySelector(".btn-add")\nconsole.log(btn.textContent)  // "Adicionar"' },
      ]
    },

    // ─── 3.3 ────────────────────────────────────────────────────────────────
    {
      id: '3.3', module: 3, index: 3,
      title: 'Manipulando Conteúdo e Estilos',
      duration: 20,
      sections: [
        { type: 'h2', text: 'Lendo e alterando texto' },
        { type: 'code', lang: 'JavaScript', raw: 'const titulo = document.querySelector("h1")\n\n// Lendo o texto\nconsole.log(titulo.textContent)    // texto puro (sem HTML)\nconsole.log(titulo.innerHTML)      // texto + HTML interno\n\n// Alterando\ntitulo.textContent = "Novo título"       // mais seguro\ntitulo.innerHTML = "Título em <strong>negrito</strong>"  // interpreta HTML' },
        { type: 'callout', html: '<strong>textContent vs innerHTML:</strong> prefira <code>textContent</code> quando você quer apenas texto — é mais rápido e mais seguro (não interpreta scripts maliciosos). Use <code>innerHTML</code> só quando precisar inserir HTML real.' },
        { type: 'h2', text: 'Manipulando classes — classList' },
        { type: 'p', html: '<code>classList</code> é a forma correta de adicionar, remover e verificar classes CSS. Evite usar <code>element.className</code> — você pode sobrescrever classes existentes.' },
        { type: 'code', lang: 'JavaScript', raw: 'const card = document.querySelector(".card")\n\ncard.classList.add("ativo")          // adiciona classe\ncard.classList.remove("oculto")      // remove classe\ncard.classList.toggle("expandido")   // adiciona se não tem, remove se tem\ncard.classList.contains("ativo")     // true ou false\n\n// Múltiplas de uma vez\ncard.classList.add("fadeIn", "visivel")' },
        { type: 'h2', text: 'Manipulando atributos' },
        { type: 'code', lang: 'JavaScript', raw: 'const link = document.querySelector("a")\nconst img  = document.querySelector("img")\nconst input = document.querySelector("input")\n\n// getAttribute / setAttribute\nconsole.log(link.getAttribute("href"))      // lê o atributo\nlink.setAttribute("href", "https://novo.com")  // altera\nlink.removeAttribute("target")               // remove\n\n// Atalhos para atributos comuns\nconsole.log(img.src)         // mesmo que getAttribute("src")\nconsole.log(input.value)     // valor atual do campo\nconsole.log(input.disabled)  // true ou false' },
        { type: 'h2', text: 'Manipulando estilos inline' },
        { type: 'code', lang: 'JavaScript', raw: 'const box = document.querySelector(".box")\n\n// Alterar estilo direto (camelCase)\nbox.style.backgroundColor = "#1a1a2e"\nbox.style.fontSize = "18px"\nbox.style.display = "none"    // ocultar\nbox.style.display = ""        // restaurar (remove o inline)\n\n// Ler um estilo computado (o real, incluindo CSS externo)\nconst estilos = getComputedStyle(box)\nconsole.log(estilos.color)  // "rgb(255, 255, 255)"' },
        { type: 'callout', html: '<strong>Preferência:</strong> manipule visual via classes CSS sempre que possível. Estilos inline têm alta especificidade, dificultam manutenção e poluem o HTML. Reserve <code>style</code> para valores dinâmicos que vêm de cálculo (ex: posição de um drag, altura em pixels).' },
        { type: 'exercise',
          title: 'Toggle de modo escuro',
          desc: 'Crie um botão que alterna entre modo claro e escuro adicionando/removendo uma classe no body.',
          steps: [
            'Crie um HTML com um <body>, um <button id="toggle-tema"> e um <p> com texto',
            'No CSS, defina .dark { background: #111; color: #fff; }',
            'No JS, selecione o botão',
            'Adicione um evento de clique que use classList.toggle("dark") no document.body',
            'Atualize o texto do botão para "Modo Claro" ou "Modo Escuro" conforme o estado'
          ],
          solution: 'const btn = document.getElementById("toggle-tema")\n\nbtn.addEventListener("click", function() {\n  document.body.classList.toggle("dark")\n  \n  const ativo = document.body.classList.contains("dark")\n  btn.textContent = ativo ? "☀️ Modo Claro" : "🌙 Modo Escuro"\n})' },
      ]
    },

    // ─── 3.4 ────────────────────────────────────────────────────────────────
    {
      id: '3.4', module: 3, index: 4,
      title: 'Criando e Removendo Elementos',
      duration: 20,
      sections: [
        { type: 'h2', text: 'Criando elementos do zero' },
        { type: 'code', lang: 'JavaScript', raw: '// 1. Criar o elemento\nconst novoItem = document.createElement("li")\n\n// 2. Configurar\nnovoItem.textContent = "Nova tarefa"\nnovoItem.classList.add("tarefa")\nnovoItem.setAttribute("data-id", "42")\n\n// 3. Inserir no DOM\nconst lista = document.querySelector("ul")\nlista.appendChild(novoItem)        // adiciona no final\nlista.prepend(novoItem)            // adiciona no início\nlista.insertBefore(novoItem, lista.firstChild)  // antes de um elemento' },
        { type: 'h2', text: 'Métodos modernos de inserção' },
        { type: 'code', lang: 'JavaScript', raw: 'const lista = document.querySelector("ul")\nconst item = document.createElement("li")\nitem.textContent = "Novo item"\n\n// insertAdjacentElement — controle total da posição\nlista.insertAdjacentElement("beforebegin", item)  // antes da lista\nlista.insertAdjacentElement("afterbegin", item)   // primeiro filho\nlista.insertAdjacentElement("beforeend", item)    // último filho\nlista.insertAdjacentElement("afterend", item)     // depois da lista\n\n// innerHTML — criação em bloco (cuidado: apaga o que havia)\nlista.innerHTML = `\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n`' },
        { type: 'h2', text: 'Clonando elementos' },
        { type: 'code', lang: 'JavaScript', raw: 'const card = document.querySelector(".card")\n\n// cloneNode(true) — clona o elemento E todos os filhos\nconst clone = card.cloneNode(true)\nclone.querySelector(".titulo").textContent = "Novo card"\ndocument.querySelector(".grid").appendChild(clone)' },
        { type: 'h2', text: 'Removendo elementos' },
        { type: 'code', lang: 'JavaScript', raw: 'const item = document.querySelector("li.concluido")\n\n// Método moderno — remove diretamente\nitem.remove()\n\n// Método antigo — via pai\nitem.parentNode.removeChild(item)\n\n// Limpar todos os filhos de um elemento\nconst lista = document.querySelector("ul")\nlista.innerHTML = ""   // apaga tudo\n// ou, mais performático:\nwhile (lista.firstChild) {\n  lista.removeChild(lista.firstChild)\n}' },
        { type: 'exercise',
          title: 'Construindo uma lista dinâmica',
          desc: 'Crie uma lista onde o usuário digita um item e o JavaScript o adiciona ao DOM.',
          steps: [
            'Crie um HTML: <input id="input-item">, <button id="btn-add">, <ul id="lista">',
            'No JS, selecione os três elementos',
            'Ao clicar no botão: crie um <li> com o valor do input, adicione na lista',
            'Limpe o input depois de adicionar',
            'Bonus: se o input estiver vazio, não adicione nada'
          ],
          solution: 'const input = document.getElementById("input-item")\nconst btn   = document.getElementById("btn-add")\nconst lista = document.getElementById("lista")\n\nbtn.addEventListener("click", function() {\n  const texto = input.value.trim()\n  if (!texto) return\n\n  const item = document.createElement("li")\n  item.textContent = texto\n  lista.appendChild(item)\n\n  input.value = ""\n  input.focus()\n})' },
      ]
    },

    // ─── 3.5 ────────────────────────────────────────────────────────────────
    {
      id: '3.5', module: 3, index: 5,
      title: 'Eventos — addEventListener',
      duration: 22,
      sections: [
        { type: 'h2', text: 'O que é um evento' },
        { type: 'p', html: 'Um <strong>evento</strong> é qualquer coisa que acontece no browser: o usuário clica, digita, move o mouse, a página termina de carregar, um elemento ganha foco. O JavaScript "escuta" esses eventos e executa código em resposta.' },
        { type: 'code', lang: 'JavaScript', raw: 'const btn = document.querySelector("button")\n\n// Sintaxe: elemento.addEventListener(tipo, handler)\nbtn.addEventListener("click", function() {\n  console.log("Botão clicado!")\n})\n\n// Com arrow function\nbtn.addEventListener("click", () => {\n  console.log("Também funciona assim")\n})' },
        { type: 'h2', text: 'O objeto event' },
        { type: 'p', html: 'Todo handler recebe automaticamente um objeto <code>event</code> (convencionalmente chamado de <code>e</code> ou <code>evt</code>). Ele contém informações sobre o que aconteceu:' },
        { type: 'code', lang: 'JavaScript', raw: 'document.addEventListener("click", function(event) {\n  console.log(event.type)      // "click"\n  console.log(event.target)    // o elemento que foi clicado\n  console.log(event.clientX)   // posição X do mouse\n  console.log(event.clientY)   // posição Y do mouse\n  console.log(event.timeStamp) // quando aconteceu\n})\n\ndocument.addEventListener("keydown", function(event) {\n  console.log(event.key)      // "Enter", "a", "ArrowUp"...\n  console.log(event.code)     // "KeyA", "Enter", "ArrowUp"\n  console.log(event.ctrlKey)  // true se Ctrl estava pressionado\n})' },
        { type: 'h2', text: 'Eventos comuns' },
        { type: 'code', lang: 'JavaScript', raw: '// Mouse\nbtn.addEventListener("click", handler)        // clique\nbtn.addEventListener("dblclick", handler)     // duplo clique\nbtn.addEventListener("mouseenter", handler)   // mouse entrou\nbtn.addEventListener("mouseleave", handler)   // mouse saiu\n\n// Teclado\ninput.addEventListener("keydown", handler)    // tecla pressionada\ninput.addEventListener("keyup", handler)      // tecla solta\ninput.addEventListener("input", handler)      // valor mudou\n\n// Formulário\nform.addEventListener("submit", handler)      // formulário enviado\ninput.addEventListener("focus", handler)      // elemento focado\ninput.addEventListener("blur", handler)       // elemento perdeu foco\n\n// Documento\ndocument.addEventListener("DOMContentLoaded", handler)  // DOM pronto\nwindow.addEventListener("load", handler)      // tudo carregado (imgs, css)\nwindow.addEventListener("resize", handler)    // janela redimensionada\nwindow.addEventListener("scroll", handler)    // página rolada' },
        { type: 'h2', text: 'Removendo event listeners' },
        { type: 'code', lang: 'JavaScript', raw: '// Para remover, a função precisa ter um nome\nfunction aoClicar() {\n  console.log("clicou")\n}\n\nbtn.addEventListener("click", aoClicar)\n\n// Depois de um tempo, remove o listener\nsetTimeout(function() {\n  btn.removeEventListener("click", aoClicar)\n  console.log("Listener removido")\n}, 5000)' },
        { type: 'exercise',
          title: 'Contador interativo',
          desc: 'Crie um contador com botões de incrementar e decrementar.',
          steps: [
            'HTML: <span id="valor">0</span>, <button id="menos">-</button>, <button id="mais">+</button>',
            'JS: selecione os elementos e crie uma variável contador = 0',
            'Clique em + incrementa, clique em - decrementa',
            'Atualize o textContent do span a cada clique',
            'Bonus: não deixe o contador ir abaixo de 0'
          ],
          solution: 'const span  = document.getElementById("valor")\nconst btnMenos = document.getElementById("menos")\nconst btnMais  = document.getElementById("mais")\n\nlet contador = 0\n\nbtnMais.addEventListener("click", function() {\n  contador++\n  span.textContent = contador\n})\n\nbtnMenos.addEventListener("click", function() {\n  if (contador > 0) {\n    contador--\n    span.textContent = contador\n  }\n})' },
      ]
    },

    // ─── 3.6 ────────────────────────────────────────────────────────────────
    {
      id: '3.6', module: 3, index: 6,
      title: 'Eventos de Formulário',
      duration: 22,
      sections: [
        { type: 'h2', text: 'Capturando o submit' },
        { type: 'p', html: 'Por padrão, um formulário enviado recarrega a página. Em aplicações modernas, usamos JavaScript para interceptar o envio, validar e processar os dados sem sair da página.' },
        { type: 'code', lang: 'JavaScript', raw: 'const form = document.querySelector("form")\n\nform.addEventListener("submit", function(event) {\n  event.preventDefault()   // ESSENCIAL: cancela o reload da página\n  \n  // Agora você controla o que fazer com os dados\n  const dados = new FormData(form)\n  console.log(dados.get("email"))\n  console.log(dados.get("senha"))\n})' },
        { type: 'h2', text: 'Lendo valores dos campos' },
        { type: 'code', lang: 'JavaScript', raw: '// Tipos de input e como ler seus valores\nconst texto   = document.querySelector("input[type=text]").value\nconst email   = document.querySelector("input[type=email]").value\nconst numero  = document.querySelector("input[type=number]").valueAsNumber\n\n// Checkbox\nconst aceito  = document.querySelector("input[type=checkbox]").checked  // true/false\n\n// Radio — qual está selecionado\nconst sexo    = document.querySelector("input[name=sexo]:checked")?.value\n\n// Select\nconst plano   = document.querySelector("select#plano").value\n\n// Textarea\nconst msg     = document.querySelector("textarea").value' },
        { type: 'h2', text: 'Validação no cliente' },
        { type: 'code', lang: 'JavaScript', raw: 'function validarEmail(email) {\n  return email.includes("@") && email.includes(".")\n}\n\nfunction validarSenha(senha) {\n  return senha.length >= 8\n}\n\nform.addEventListener("submit", function(event) {\n  event.preventDefault()\n  \n  const email = document.getElementById("email").value.trim()\n  const senha = document.getElementById("senha").value\n  \n  const erros = []\n  \n  if (!email) erros.push("Email é obrigatório")\n  else if (!validarEmail(email)) erros.push("Email inválido")\n  \n  if (!senha) erros.push("Senha é obrigatória")\n  else if (!validarSenha(senha)) erros.push("Senha precisa ter 8+ caracteres")\n  \n  if (erros.length > 0) {\n    mostrarErros(erros)\n    return\n  }\n  \n  // Tudo válido — prosseguir\n  console.log("Dados válidos!", { email, senha })\n})\n\nfunction mostrarErros(erros) {\n  const lista = document.getElementById("erros")\n  lista.innerHTML = erros.map(e => `<li>${e}</li>`).join("")\n}' },
        { type: 'h2', text: 'Feedback em tempo real com o evento input' },
        { type: 'code', lang: 'JavaScript', raw: 'const senhaInput = document.getElementById("senha")\nconst forcaTexto = document.getElementById("forca-senha")\n\nsenhaInput.addEventListener("input", function() {\n  const senha = this.value\n  let forca = "Fraca"\n  let cor = "#e74c3c"\n  \n  if (senha.length >= 8) { forca = "Média"; cor = "#f39c12" }\n  if (senha.length >= 12 && /[A-Z]/.test(senha) && /[0-9]/.test(senha)) {\n    forca = "Forte"; cor = "#27ae60"\n  }\n  \n  forcaTexto.textContent = `Senha: ${forca}`\n  forcaTexto.style.color = cor\n})' },
        { type: 'exercise',
          title: 'Formulário de cadastro com validação',
          desc: 'Crie um formulário com nome, email e senha. Valide e exiba mensagens de erro.',
          steps: [
            'HTML: form com inputs de nome, email, senha e um botão de cadastrar',
            'Capture o submit com event.preventDefault()',
            'Valide: nome não vazio, email com @, senha com 8+ caracteres',
            'Se houver erros, exiba abaixo do form',
            'Se tudo válido, exiba mensagem de sucesso e limpe o form'
          ],
          solution: 'const form = document.getElementById("form-cadastro")\nconst mensagem = document.getElementById("mensagem")\n\nform.addEventListener("submit", function(e) {\n  e.preventDefault()\n  \n  const nome  = document.getElementById("nome").value.trim()\n  const email = document.getElementById("email").value.trim()\n  const senha = document.getElementById("senha").value\n  \n  const erros = []\n  if (!nome)               erros.push("Nome obrigatório")\n  if (!email.includes("@")) erros.push("Email inválido")\n  if (senha.length < 8)    erros.push("Senha precisa ter 8+ caracteres")\n  \n  if (erros.length > 0) {\n    mensagem.innerHTML = erros.map(e => `<p style="color:red">${e}</p>`).join("")\n    return\n  }\n  \n  mensagem.innerHTML = `<p style="color:green">Cadastro realizado! Bem-vindo, ${nome}!</p>`\n  form.reset()\n})' },
      ]
    },

    // ─── 3.7 ────────────────────────────────────────────────────────────────
    {
      id: '3.7', module: 3, index: 7,
      title: 'Delegação de Eventos',
      duration: 18,
      sections: [
        { type: 'h2', text: 'O problema com listas dinâmicas' },
        { type: 'p', html: 'Imagine que você adiciona um listener de clique em cada item de uma lista. Depois, o usuário adiciona novos itens — eles <strong>não têm listener</strong>, porque foram criados depois. A solução é delegação de eventos.' },
        { type: 'h2', text: 'Bubbling — propagação de eventos' },
        { type: 'p', html: 'Quando você clica num elemento, o evento "sobe" pelo DOM: o evento dispara no elemento clicado, depois no pai, depois no avô, até chegar no <code>document</code>. Esse mecanismo se chama <strong>bubbling</strong>.' },
        { type: 'code', lang: 'JavaScript', raw: '// O evento de clique num <li> sobe até o <ul>\n// Então colocamos o listener no <ul>\nconst lista = document.getElementById("lista")\n\nlista.addEventListener("click", function(event) {\n  // event.target = o elemento que foi realmente clicado\n  console.log(event.target)\n  \n  // Verifica se foi um li que foi clicado\n  if (event.target.tagName === "LI") {\n    event.target.classList.toggle("concluido")\n  }\n})' },
        { type: 'h2', text: 'Delegação com closest' },
        { type: 'p', html: 'Quando o <li> tem elementos filhos (como um botão de deletar), o <code>event.target</code> pode ser o botão interno. O método <code>closest</code> sobe pelo DOM e retorna o ancestral mais próximo que bate com o seletor:' },
        { type: 'code', lang: 'JavaScript', raw: '// HTML:\n// <ul id="lista">\n//   <li data-id="1">\n//     <span>Tarefa 1</span>\n//     <button class="btn-deletar">×</button>\n//   </li>\n// </ul>\n\nconst lista = document.getElementById("lista")\n\nlista.addEventListener("click", function(event) {\n  // Verificar se clicou no botão de deletar\n  if (event.target.closest(".btn-deletar")) {\n    const item = event.target.closest("li")\n    item.remove()\n    return\n  }\n  \n  // Verificar se clicou no li (ou dentro dele)\n  const item = event.target.closest("li")\n  if (item) {\n    item.classList.toggle("concluido")\n  }\n})' },
        { type: 'h2', text: 'Parando a propagação' },
        { type: 'code', lang: 'JavaScript', raw: '// event.stopPropagation() impede que o evento suba\ndocumento.addEventListener("click", function() {\n  fecharMenu()\n})\n\nmenu.addEventListener("click", function(event) {\n  event.stopPropagation()  // clicar no menu não fecha o menu\n})' },
        { type: 'exercise',
          title: 'Lista com ações delegadas',
          desc: 'Crie uma lista de tarefas onde clicar na tarefa a marca como concluída e um botão × a remove — usando delegação de eventos.',
          steps: [
            'HTML: <ul id="lista"> com 3 <li>, cada um com texto e <button class="deletar">×</button>',
            'CSS: li.concluido com text-decoration: line-through e opacity: 0.5',
            'JS: adicione UM listener no <ul>',
            'Se clicou no botão .deletar: remova o <li>',
            'Se clicou no <li>: toggle da classe "concluido"'
          ],
          solution: 'const lista = document.getElementById("lista")\n\nlista.addEventListener("click", function(event) {\n  if (event.target.classList.contains("deletar")) {\n    event.target.closest("li").remove()\n    return\n  }\n  \n  const item = event.target.closest("li")\n  if (item) {\n    item.classList.toggle("concluido")\n  }\n})' },
      ]
    },

    // ─── 3.8 ────────────────────────────────────────────────────────────────
    {
      id: '3.8', module: 3, index: 8,
      title: 'localStorage — Dados no Browser',
      duration: 18,
      sections: [
        { type: 'h2', text: 'Persistindo dados sem servidor' },
        { type: 'p', html: 'O <code>localStorage</code> permite salvar dados diretamente no browser do usuário. Os dados persistem mesmo após fechar o browser — até que sejam deletados explicitamente. Ideal para preferências, carrinho de compras, rascunhos e estado de UI.' },
        { type: 'code', lang: 'JavaScript', raw: '// Salvar\nlocalStorage.setItem("nome", "Raphael")\nlocalStorage.setItem("tema", "dark")\n\n// Ler\nconst nome = localStorage.getItem("nome")    // "Raphael"\nconst tema = localStorage.getItem("tema")    // "dark"\nconst inexistente = localStorage.getItem("xyz")  // null\n\n// Remover uma chave\nlocalStorage.removeItem("tema")\n\n// Limpar tudo\nlocalStorage.clear()' },
        { type: 'h2', text: 'Salvando objetos com JSON' },
        { type: 'p', html: 'O localStorage só aceita strings. Para salvar objetos e arrays, use <code>JSON.stringify</code> ao salvar e <code>JSON.parse</code> ao ler:' },
        { type: 'code', lang: 'JavaScript', raw: 'const tarefas = [\n  { id: 1, texto: "Estudar DOM", feita: false },\n  { id: 2, texto: "Fazer projeto", feita: true }\n]\n\n// Salvar array\nlocalStorage.setItem("tarefas", JSON.stringify(tarefas))\n\n// Ler array\nconst salvas = JSON.parse(localStorage.getItem("tarefas"))\nconsole.log(salvas)   // array de objetos de volta\nconsole.log(salvas[0].texto)  // "Estudar DOM"\n\n// Padrão seguro: retornar array vazio se não existir\nconst tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || []' },
        { type: 'h2', text: 'Padrão de uso — carregar e salvar' },
        { type: 'code', lang: 'JavaScript', raw: '// Carregar ao iniciar a página\nlet tarefas = JSON.parse(localStorage.getItem("tarefas")) || []\nrenderizarLista(tarefas)\n\n// Salvar sempre que os dados mudam\nfunction salvar() {\n  localStorage.setItem("tarefas", JSON.stringify(tarefas))\n}\n\nfunction adicionarTarefa(texto) {\n  const nova = { id: Date.now(), texto, feita: false }\n  tarefas.push(nova)\n  salvar()          // persiste\n  renderizarLista(tarefas)  // atualiza UI\n}\n\nfunction removerTarefa(id) {\n  tarefas = tarefas.filter(t => t.id !== id)\n  salvar()          // persiste\n  renderizarLista(tarefas)  // atualiza UI\n}' },
        { type: 'callout', html: '<strong>Limitações:</strong> localStorage guarda até ~5MB. Só strings. Síncrono (pode bloquear em grandes volumes). Não compartilha entre abas em modo privado. Não use para dados sensíveis — é acessível via JS e inspecionável no DevTools.' },
        { type: 'exercise',
          title: 'Preferências persistentes',
          desc: 'Crie um toggle de tema que lembra a preferência do usuário ao recarregar a página.',
          steps: [
            'HTML: <button id="toggle"> e <body>',
            'Ao clicar: toggle classe "dark" no body, salvar preferência no localStorage',
            'Ao carregar a página: ler o localStorage e aplicar o tema salvo',
            'O botão deve mostrar o estado atual ("Modo Escuro" / "Modo Claro")'
          ],
          solution: '// Ao carregar a página\nconst temaSalvo = localStorage.getItem("tema")\nif (temaSalvo === "dark") {\n  document.body.classList.add("dark")\n}\n\nconst btn = document.getElementById("toggle")\n\nfunction atualizarBotao() {\n  const ativo = document.body.classList.contains("dark")\n  btn.textContent = ativo ? "☀️ Modo Claro" : "🌙 Modo Escuro"\n}\n\natualizarBotao()  // estado inicial\n\nbtn.addEventListener("click", function() {\n  document.body.classList.toggle("dark")\n  const tema = document.body.classList.contains("dark") ? "dark" : "light"\n  localStorage.setItem("tema", tema)\n  atualizarBotao()\n})' },
      ]
    },

    // ─── 3.9 ────────────────────────────────────────────────────────────────
    {
      id: '3.9', module: 3, index: 9,
      title: 'Projeto — Lista de Tarefas Completa',
      duration: 45,
      sections: [
        { type: 'h2', text: 'O projeto do módulo' },
        { type: 'p', html: 'Você vai construir uma <strong>lista de tarefas completa</strong> usando tudo que aprendeu neste módulo: seleção de elementos, manipulação do DOM, eventos, delegação e localStorage. É o projeto clássico do dev frontend — mas feito com qualidade.' },
        { type: 'h2', text: 'Funcionalidades' },
        { type: 'code', lang: 'text', raw: '✅ Adicionar tarefa (input + botão ou Enter)\n✅ Marcar como concluída (click no item)\n✅ Remover tarefa (botão ×)\n✅ Filtrar: Todas / Ativas / Concluídas\n✅ Contador de tarefas pendentes\n✅ Persistência no localStorage (recarregar mantém dados)\n✅ Empty state quando a lista está vazia' },
        { type: 'h2', text: 'Estrutura HTML base' },
        { type: 'code', lang: 'HTML', raw: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>To-Do App</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="app">\n    <h1>Minhas Tarefas</h1>\n    \n    <div class="input-area">\n      <input type="text" id="input-tarefa" placeholder="Nova tarefa...">\n      <button id="btn-adicionar">Adicionar</button>\n    </div>\n    \n    <div class="filtros">\n      <button class="filtro ativo" data-filtro="todas">Todas</button>\n      <button class="filtro" data-filtro="ativas">Ativas</button>\n      <button class="filtro" data-filtro="concluidas">Concluídas</button>\n    </div>\n    \n    <ul id="lista-tarefas"></ul>\n    \n    <p id="contador">0 tarefas pendentes</p>\n  </div>\n  <script src="app.js"></script>\n</body>\n</html>' },
        { type: 'h2', text: 'JavaScript completo' },
        { type: 'code', lang: 'JavaScript', raw: '// Estado da aplicação\nlet tarefas = JSON.parse(localStorage.getItem("tarefas")) || []\nlet filtroAtual = "todas"\n\n// Elementos\nconst inputTarefa  = document.getElementById("input-tarefa")\nconst btnAdicionar = document.getElementById("btn-adicionar")\nconst lista        = document.getElementById("lista-tarefas")\nconst contador     = document.getElementById("contador")\n\n// ─── Salvar no localStorage ───────────────────────────\nfunction salvar() {\n  localStorage.setItem("tarefas", JSON.stringify(tarefas))\n}\n\n// ─── Renderizar a lista ───────────────────────────────\nfunction render() {\n  const visiveis = tarefas.filter(function(t) {\n    if (filtroAtual === "ativas")    return !t.feita\n    if (filtroAtual === "concluidas") return t.feita\n    return true\n  })\n\n  if (visiveis.length === 0) {\n    lista.innerHTML = `<li class="empty">Nenhuma tarefa aqui ✓</li>`\n  } else {\n    lista.innerHTML = visiveis.map(function(t) {\n      return `\n        <li class="tarefa ${t.feita ? "concluida" : ""}" data-id="${t.id}">\n          <span>${t.texto}</span>\n          <button class="btn-deletar" aria-label="Remover">×</button>\n        </li>\n      `\n    }).join("")\n  }\n\n  const pendentes = tarefas.filter(t => !t.feita).length\n  contador.textContent = `${pendentes} tarefa${pendentes !== 1 ? "s" : ""} pendente${pendentes !== 1 ? "s" : ""}`\n}\n\n// ─── Adicionar tarefa ─────────────────────────────────\nfunction adicionar() {\n  const texto = inputTarefa.value.trim()\n  if (!texto) return\n\n  tarefas.push({ id: Date.now(), texto, feita: false })\n  salvar()\n  render()\n  inputTarefa.value = ""\n  inputTarefa.focus()\n}\n\nbtnAdicionar.addEventListener("click", adicionar)\ninputTarefa.addEventListener("keydown", function(e) {\n  if (e.key === "Enter") adicionar()\n})\n\n// ─── Ações na lista (delegação) ──────────────────────\nlista.addEventListener("click", function(event) {\n  if (event.target.classList.contains("btn-deletar")) {\n    const id = Number(event.target.closest("li").dataset.id)\n    tarefas = tarefas.filter(t => t.id !== id)\n    salvar()\n    render()\n    return\n  }\n\n  const item = event.target.closest("li[data-id]")\n  if (item) {\n    const id = Number(item.dataset.id)\n    const tarefa = tarefas.find(t => t.id === id)\n    if (tarefa) {\n      tarefa.feita = !tarefa.feita\n      salvar()\n      render()\n    }\n  }\n})\n\n// ─── Filtros ──────────────────────────────────────────\ndocument.querySelectorAll(".filtro").forEach(function(btn) {\n  btn.addEventListener("click", function() {\n    document.querySelectorAll(".filtro").forEach(b => b.classList.remove("ativo"))\n    btn.classList.add("ativo")\n    filtroAtual = btn.dataset.filtro\n    render()\n  })\n})\n\n// ─── Iniciar ──────────────────────────────────────────\nrender()' },
        { type: 'exercise',
          title: 'Construa e expanda',
          desc: 'Construa o projeto, faça funcionar e depois adicione pelo menos uma melhoria.',
          steps: [
            'Crie os arquivos index.html, style.css e app.js e monte o projeto completo',
            'Teste todas as funcionalidades: adicionar, marcar, remover, filtrar, recarregar',
            'Escolha UMA melhoria: botão "Limpar concluídas", reordenação por drag, edição inline, ou prioridade (baixa/média/alta)',
            'Implemente a melhoria escolhida'
          ],
          solution: '// Melhoria sugerida: botão "Limpar concluídas"\n// Adicione ao HTML:\n// <button id="limpar-concluidas">Limpar concluídas</button>\n\ndocument.getElementById("limpar-concluidas").addEventListener("click", function() {\n  tarefas = tarefas.filter(t => !t.feita)\n  salvar()\n  render()\n})' },
      ]
    },

  ]
})()
