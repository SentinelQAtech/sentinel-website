// Sentinel Learning — Conteúdo do Módulo 2: JavaScript Base

(function () {
  window.M2 = [

    // ─── AULA 2.1 — Arrays: Fundamentos ─────────────────────────────────
    {
      id: '2.1', module: 2, index: 1,
      title: 'Arrays: Fundamentos',
      duration: 15,
      sections: [
        { type: 'h2', text: 'O que é um array?' },
        { type: 'p', html: 'Um <strong>array</strong> é uma lista ordenada de valores. Em vez de criar dez variáveis separadas, você cria uma só que guarda dez itens. Arrays são a estrutura de dados mais usada em JavaScript.' },
        { type: 'code', lang: 'JavaScript', raw: '// Criando arrays\nconst frutas = ["maçã", "banana", "laranja"]\nconst numeros = [1, 2, 3, 4, 5]\nconst misto = [42, "texto", true, null]  // tipos mistos: ok\nconst vazio = []                          // array vazio\n\nconsole.log(frutas)    // ["maçã", "banana", "laranja"]\nconsole.log(numeros)   // [1, 2, 3, 4, 5]' },
        { type: 'h2', text: 'Acessando elementos' },
        { type: 'p', html: 'Arrays usam <strong>índices</strong> começando do zero. O primeiro elemento é índice 0, o segundo é 1, e assim por diante.' },
        { type: 'code', lang: 'JavaScript', raw: 'const frutas = ["maçã", "banana", "laranja"]\n\nconsole.log(frutas[0])   // "maçã"\nconsole.log(frutas[1])   // "banana"\nconsole.log(frutas[2])   // "laranja"\nconsole.log(frutas[9])   // undefined — não existe\n\n// Último elemento\nconst ultimo = frutas[frutas.length - 1]\nconsole.log(ultimo)      // "laranja"' },
        { type: 'callout', html: '<strong>length</strong> retorna o total de elementos. O último índice é sempre <code>length - 1</code>.' },
        { type: 'h2', text: 'Modificando e iterando' },
        { type: 'code', lang: 'JavaScript', raw: 'const notas = [7, 8, 9, 6]\n\n// Alterar um elemento\nnotas[0] = 10\nconsole.log(notas)  // [10, 8, 9, 6]\n\n// Percorrer com for\nfor (let i = 0; i < notas.length; i++) {\n  console.log("Nota " + (i + 1) + ": " + notas[i])\n}\n\n// for...of — mais limpo\nfor (const nota of notas) {\n  console.log(nota)\n}' },
        { type: 'exercise',
          title: 'Sua primeira lista',
          desc: 'Crie um array com 5 itens, acesse elementos por índice e percorra com for...of.',
          steps: ['Crie um array `linguagens` com 5 nomes de linguagens', 'Imprima o primeiro e o último elemento', 'Use `for...of` para imprimir todas', 'Adicione `.length` e imprima o total'],
          solution: 'const linguagens = ["JavaScript", "Python", "Go", "Rust", "TypeScript"]\n\nconsole.log(linguagens[0])                       // "JavaScript"\nconsole.log(linguagens[linguagens.length - 1])    // "TypeScript"\n\nfor (const lang of linguagens) {\n  console.log(lang)\n}\n\nconsole.log("Total:", linguagens.length)          // 5' },
      ]
    },

    // ─── AULA 2.2 — Métodos de Array: Modificar ─────────────────────────
    {
      id: '2.2', module: 2, index: 2,
      title: 'Métodos de Array: Modificar',
      duration: 14,
      sections: [
        { type: 'h2', text: 'Adicionando e removendo' },
        { type: 'p', html: 'JavaScript tem métodos prontos para manipular arrays. Os mais usados para modificar são <code>push</code>, <code>pop</code>, <code>shift</code> e <code>unshift</code>.' },
        { type: 'code', lang: 'JavaScript', raw: 'const lista = ["a", "b", "c"]\n\n// push — adiciona no FINAL\nlista.push("d")\nconsole.log(lista)  // ["a", "b", "c", "d"]\n\n// pop — remove do FINAL e retorna o removido\nconst removido = lista.pop()\nconsole.log(removido)  // "d"\nconsole.log(lista)     // ["a", "b", "c"]\n\n// unshift — adiciona no INÍCIO\nlista.unshift("Z")\nconsole.log(lista)  // ["Z", "a", "b", "c"]\n\n// shift — remove do INÍCIO\nconst primeiro = lista.shift()\nconsole.log(primeiro)  // "Z"\nconsole.log(lista)     // ["a", "b", "c"]' },
        { type: 'callout', html: '<strong>Dica de memória:</strong> push/pop = pilha (último a entrar, primeiro a sair). shift/unshift = fila (primeiro a entrar, primeiro a sair).' },
        { type: 'h2', text: 'splice — poder total' },
        { type: 'p', html: '<code>splice(início, quantos, ...itens)</code> remove, substitui ou insere em qualquer posição.' },
        { type: 'code', lang: 'JavaScript', raw: 'const cores = ["vermelho", "azul", "verde", "amarelo"]\n\n// Remover 1 elemento na posição 1\ncores.splice(1, 1)\nconsole.log(cores)  // ["vermelho", "verde", "amarelo"]\n\n// Inserir sem remover\ncores.splice(1, 0, "roxo")\nconsole.log(cores)  // ["vermelho", "roxo", "verde", "amarelo"]\n\n// Substituir\ncores.splice(2, 1, "ciano")\nconsole.log(cores)  // ["vermelho", "roxo", "ciano", "amarelo"]' },
        { type: 'h2', text: 'indexOf e includes' },
        { type: 'code', lang: 'JavaScript', raw: 'const times = ["Flamengo", "Corinthians", "Palmeiras"]\n\nconsole.log(times.includes("Flamengo"))     // true\nconsole.log(times.includes("Botafogo"))     // false\nconsole.log(times.indexOf("Corinthians"))   // 1\nconsole.log(times.indexOf("Vasco"))         // -1 (não encontrado)' },
        { type: 'exercise',
          title: 'Gerenciar uma lista de compras',
          desc: 'Simule uma lista de compras: adicione, remova e verifique itens.',
          steps: ['Crie `lista` com 3 itens', 'Adicione 2 itens no final com `push`', 'Remova o primeiro item com `shift`', 'Verifique com `includes` se "leite" está na lista', 'Imprima a lista final'],
          solution: 'const lista = ["pão", "manteiga", "café"]\n\nlista.push("leite")\nlista.push("frutas")\n\nlista.shift()  // remove "pão"\n\nconsole.log(lista.includes("leite"))   // true\nconsole.log(lista.includes("pão"))     // false\n\nconsole.log("Lista final:", lista)\nconsole.log("Total de itens:", lista.length)' },
      ]
    },

    // ─── AULA 2.3 — Métodos de Array: Transformar ───────────────────────
    {
      id: '2.3', module: 2, index: 3,
      title: 'Métodos de Array: Transformar',
      duration: 18,
      sections: [
        { type: 'h2', text: 'map — transformar cada elemento' },
        { type: 'p', html: '<code>map</code> cria um <strong>novo array</strong> aplicando uma função em cada elemento. O array original não muda.' },
        { type: 'code', lang: 'JavaScript', raw: 'const numeros = [1, 2, 3, 4, 5]\n\nconst dobrados = numeros.map(n => n * 2)\nconsole.log(dobrados)   // [2, 4, 6, 8, 10]\nconsole.log(numeros)    // [1, 2, 3, 4, 5] — original intacto\n\n// Com strings\nconst nomes = ["raphael", "maria", "joão"]\nconst maiusculos = nomes.map(n => n.toUpperCase())\nconsole.log(maiusculos) // ["RAPHAEL", "MARIA", "JOÃO"]' },
        { type: 'h2', text: 'filter — filtrar elementos' },
        { type: 'p', html: '<code>filter</code> cria um novo array apenas com os elementos para os quais a função retorna <code>true</code>.' },
        { type: 'code', lang: 'JavaScript', raw: 'const idades = [17, 22, 15, 30, 19, 14]\n\nconst maiores = idades.filter(idade => idade >= 18)\nconsole.log(maiores)  // [22, 30, 19]\n\nconst pares = [1, 2, 3, 4, 5, 6].filter(n => n % 2 === 0)\nconsole.log(pares)    // [2, 4, 6]' },
        { type: 'h2', text: 'find e findIndex' },
        { type: 'code', lang: 'JavaScript', raw: 'const produtos = [\n  { nome: "teclado", preco: 150 },\n  { nome: "mouse", preco: 80 },\n  { nome: "monitor", preco: 800 }\n]\n\n// find — retorna o PRIMEIRO elemento que satisfaz\nconst barato = produtos.find(p => p.preco < 100)\nconsole.log(barato)  // { nome: "mouse", preco: 80 }\n\n// findIndex — retorna o ÍNDICE do primeiro\nconst idx = produtos.findIndex(p => p.nome === "monitor")\nconsole.log(idx)     // 2' },
        { type: 'h2', text: 'reduce — acumular' },
        { type: 'p', html: '<code>reduce</code> percorre o array acumulando um valor. É o mais poderoso — e o mais assustador de primeira.' },
        { type: 'code', lang: 'JavaScript', raw: 'const precos = [29.9, 49.9, 15.0, 89.9]\n\n// reduce(função, valorInicial)\nconst total = precos.reduce((acumulador, preco) => acumulador + preco, 0)\nconsole.log(total)  // 184.7\n\n// Contar ocorrências\nconst frutas = ["maçã", "banana", "maçã", "laranja", "banana", "maçã"]\nconst contagem = frutas.reduce((acc, fruta) => {\n  acc[fruta] = (acc[fruta] || 0) + 1\n  return acc\n}, {})\nconsole.log(contagem)  // { maçã: 3, banana: 2, laranja: 1 }' },
        { type: 'callout', html: '<strong>Regra prática:</strong> use <code>map</code> para transformar, <code>filter</code> para filtrar, <code>reduce</code> para calcular. Os três podem ser encadeados.' },
        { type: 'exercise',
          title: 'Pipeline de dados',
          desc: 'Use map e filter encadeados para transformar uma lista de notas.',
          steps: ['Crie `notas = [4, 7, 9, 3, 8, 5, 10, 2]`', 'Use `filter` para pegar só as notas >= 6 (aprovados)', 'Use `map` para formatar cada nota como "Nota: X"', 'Use `reduce` para calcular a média das notas aprovadas'],
          solution: 'const notas = [4, 7, 9, 3, 8, 5, 10, 2]\n\nconst aprovados = notas.filter(n => n >= 6)\nconsole.log("Aprovados:", aprovados)  // [7, 9, 8, 10]\n\nconst formatadas = aprovados.map(n => "Nota: " + n)\nconsole.log(formatadas)\n\nconst media = aprovados.reduce((acc, n) => acc + n, 0) / aprovados.length\nconsole.log("Média dos aprovados:", media.toFixed(2))  // 8.50' },
      ]
    },

    // ─── AULA 2.4 — Objetos: Fundamentos ────────────────────────────────
    {
      id: '2.4', module: 2, index: 4,
      title: 'Objetos: Fundamentos',
      duration: 16,
      sections: [
        { type: 'h2', text: 'O que é um objeto?' },
        { type: 'p', html: 'Um <strong>objeto</strong> agrupa dados relacionados em pares <code>chave: valor</code>. Enquanto arrays são listas ordenadas por índice, objetos são coleções nomeadas — você acessa pelo nome, não pela posição.' },
        { type: 'code', lang: 'JavaScript', raw: '// Criando um objeto\nconst pessoa = {\n  nome: "Raphael",\n  idade: 25,\n  aprendendo: true,\n  linguagem: "JavaScript"\n}\n\nconsole.log(pessoa)' },
        { type: 'h2', text: 'Acessando propriedades' },
        { type: 'code', lang: 'JavaScript', raw: 'const pessoa = { nome: "Raphael", idade: 25 }\n\n// Ponto — mais comum\nconsole.log(pessoa.nome)    // "Raphael"\nconsole.log(pessoa.idade)   // 25\n\n// Colchetes — quando a chave é dinâmica\nconst chave = "nome"\nconsole.log(pessoa[chave])  // "Raphael"\n\n// Propriedade inexistente → undefined\nconsole.log(pessoa.email)   // undefined' },
        { type: 'h2', text: 'Modificando objetos' },
        { type: 'code', lang: 'JavaScript', raw: 'const config = { tema: "escuro", idioma: "pt-BR" }\n\n// Alterar\nconfig.tema = "claro"\n\n// Adicionar nova propriedade\nconfig.versao = "1.0"\n\n// Remover propriedade\ndelete config.idioma\n\nconsole.log(config)  // { tema: "claro", versao: "1.0" }' },
        { type: 'h2', text: 'Métodos — funções dentro de objetos' },
        { type: 'code', lang: 'JavaScript', raw: 'const calculadora = {\n  somar: function(a, b) { return a + b },\n  subtrair: (a, b) => a - b,    // arrow function\n  multiplicar(a, b) { return a * b }  // shorthand\n}\n\nconsole.log(calculadora.somar(10, 5))       // 15\nconsole.log(calculadora.subtrair(10, 5))    // 5\nconsole.log(calculadora.multiplicar(3, 4))  // 12' },
        { type: 'callout', html: '<strong>Arrays vs Objetos:</strong> use array quando a ordem importa e os itens são do mesmo tipo. Use objeto quando os dados têm nomes e significados diferentes.' },
        { type: 'exercise',
          title: 'Objeto usuário',
          desc: 'Crie um objeto representando um usuário e adicione um método que retorna uma apresentação.',
          steps: ['Crie `usuario` com: nome, email, idade, plano ("free" ou "pro")', 'Adicione método `apresentar()` que retorna "Olá, sou [nome] e tenho [idade] anos"', 'Adicione uma nova propriedade `ativo = true`', 'Imprima a apresentação e todas as propriedades'],
          solution: 'const usuario = {\n  nome: "Raphael",\n  email: "raphael@email.com",\n  idade: 25,\n  plano: "pro",\n  apresentar() {\n    return "Olá, sou " + this.nome + " e tenho " + this.idade + " anos"\n  }\n}\n\nusuario.ativo = true\n\nconsole.log(usuario.apresentar())\nconsole.log("Plano:", usuario.plano)\nconsole.log("Ativo:", usuario.ativo)\nconsole.log(usuario)' },
      ]
    },

    // ─── AULA 2.5 — Objetos: Avançado ───────────────────────────────────
    {
      id: '2.5', module: 2, index: 5,
      title: 'Objetos: Avançado',
      duration: 15,
      sections: [
        { type: 'h2', text: 'Object.keys, values, entries' },
        { type: 'p', html: 'Três métodos essenciais para iterar e inspecionar objetos.' },
        { type: 'code', lang: 'JavaScript', raw: 'const produto = { nome: "Teclado", preco: 150, estoque: 23 }\n\nconsole.log(Object.keys(produto))\n// ["nome", "preco", "estoque"]\n\nconsole.log(Object.values(produto))\n// ["Teclado", 150, 23]\n\nconsole.log(Object.entries(produto))\n// [["nome","Teclado"], ["preco",150], ["estoque",23]]\n\n// Iterar com entries\nfor (const [chave, valor] of Object.entries(produto)) {\n  console.log(chave + ": " + valor)\n}' },
        { type: 'h2', text: 'Copiar objetos com spread' },
        { type: 'code', lang: 'JavaScript', raw: 'const original = { nome: "Raphael", nivel: 1 }\n\n// Spread (...) cria uma CÓPIA rasa\nconst copia = { ...original }\ncopia.nivel = 2\n\nconsole.log(original.nivel)  // 1 — original intacto\nconsole.log(copia.nivel)     // 2\n\n// Mesclar objetos\nconst base   = { cor: "azul", tamanho: "M" }\nconst extras = { tamanho: "G", preco: 99 }\nconst final  = { ...base, ...extras }\nconsole.log(final)  // { cor: "azul", tamanho: "G", preco: 99 }' },
        { type: 'h2', text: 'Arrays de objetos' },
        { type: 'p', html: 'O padrão mais comum no desenvolvimento real: uma lista de registros, cada um sendo um objeto.' },
        { type: 'code', lang: 'JavaScript', raw: 'const usuarios = [\n  { id: 1, nome: "Raphael", ativo: true  },\n  { id: 2, nome: "Maria",   ativo: false },\n  { id: 3, nome: "João",    ativo: true  }\n]\n\n// Filtrar ativos\nconst ativos = usuarios.filter(u => u.ativo)\nconsole.log(ativos.length)  // 2\n\n// Extrair só os nomes\nconst nomes = usuarios.map(u => u.nome)\nconsole.log(nomes)  // ["Raphael", "Maria", "João"]\n\n// Encontrar por ID\nconst usuario = usuarios.find(u => u.id === 2)\nconsole.log(usuario.nome)  // "Maria"' },
        { type: 'exercise',
          title: 'Catálogo de produtos',
          desc: 'Trabalhe com um array de objetos usando map, filter e Object.entries.',
          steps: ['Crie array `produtos` com 4 objetos: nome, preco, categoria', 'Filtre só os produtos com preco < 100', 'Use map para criar array com "nome — R$ preco"', 'Use Object.entries para listar chave/valor do primeiro produto'],
          solution: 'const produtos = [\n  { nome: "Mouse", preco: 80, categoria: "periférico" },\n  { nome: "Monitor", preco: 900, categoria: "display" },\n  { nome: "Mousepad", preco: 45, categoria: "periférico" },\n  { nome: "Webcam", preco: 220, categoria: "câmera" }\n]\n\nconst baratos = produtos.filter(p => p.preco < 100)\nconsole.log("Baratos:", baratos.map(p => p.nome))\n\nconst labels = produtos.map(p => p.nome + " — R$ " + p.preco)\nconsole.log(labels)\n\nfor (const [chave, valor] of Object.entries(produtos[0])) {\n  console.log(chave + ": " + valor)\n}' },
      ]
    },

    // ─── AULA 2.6 — Desestruturação e Spread ────────────────────────────
    {
      id: '2.6', module: 2, index: 6,
      title: 'Desestruturação e Spread',
      duration: 15,
      sections: [
        { type: 'h2', text: 'Desestruturação de arrays' },
        { type: 'p', html: '<strong>Desestruturação</strong> é uma forma elegante de extrair valores de arrays e objetos em variáveis.' },
        { type: 'code', lang: 'JavaScript', raw: 'const coordenadas = [10, 20, 30]\n\n// Sem desestruturação (verboso)\nconst x = coordenadas[0]\nconst y = coordenadas[1]\n\n// Com desestruturação\nconst [a, b, c] = coordenadas\nconsole.log(a, b, c)  // 10 20 30\n\n// Pular elementos\nconst [primeiro, , terceiro] = [1, 2, 3]\nconsole.log(primeiro, terceiro)  // 1 3\n\n// Valor padrão\nconst [p = 0, q = 0, r = 0] = [5, 10]\nconsole.log(p, q, r)  // 5 10 0' },
        { type: 'h2', text: 'Desestruturação de objetos' },
        { type: 'code', lang: 'JavaScript', raw: 'const usuario = { nome: "Raphael", idade: 25, cidade: "SP" }\n\n// Extrair propriedades\nconst { nome, idade } = usuario\nconsole.log(nome, idade)  // "Raphael" 25\n\n// Renomear na extração\nconst { nome: nomeUsuario, cidade: local } = usuario\nconsole.log(nomeUsuario, local)  // "Raphael" "SP"\n\n// Com valor padrão\nconst { email = "sem email" } = usuario\nconsole.log(email)  // "sem email"' },
        { type: 'h2', text: 'Spread e Rest' },
        { type: 'code', lang: 'JavaScript', raw: '// SPREAD — expandir\nconst arr1 = [1, 2, 3]\nconst arr2 = [4, 5, 6]\nconst juntos = [...arr1, ...arr2]\nconsole.log(juntos)  // [1, 2, 3, 4, 5, 6]\n\n// REST — capturar o restante\nconst [cabeca, ...cauda] = [10, 20, 30, 40]\nconsole.log(cabeca)  // 10\nconsole.log(cauda)   // [20, 30, 40]\n\n// Em funções\nfunction somar(...numeros) {\n  return numeros.reduce((acc, n) => acc + n, 0)\n}\nconsole.log(somar(1, 2, 3, 4, 5))  // 15' },
        { type: 'callout', html: '<strong>Spread vs Rest:</strong> mesmo símbolo (<code>...</code>), significados opostos. Spread <em>expande</em>. Rest <em>coleta</em>.' },
        { type: 'exercise',
          title: 'Desestruturar dados de uma API',
          desc: 'Pratique desestruturação com um objeto simulando resposta de API.',
          steps: ['Desestruture `nome`, `email` e `plano` do objeto abaixo', 'Use valor padrão para `avatar` (use "sem-avatar.png")', 'Use rest para capturar as `roles` restantes de um array', 'Imprima tudo no console'],
          solution: 'const resposta = {\n  nome: "Raphael",\n  email: "raphael@email.com",\n  plano: "pro",\n  roles: ["admin", "editor", "viewer"]\n}\n\nconst { nome, email, plano, avatar = "sem-avatar.png", roles } = resposta\nconsole.log(nome, email, plano)\nconsole.log("Avatar:", avatar)\n\nconst [primeiraRole, ...outrasRoles] = roles\nconsole.log("Papel principal:", primeiraRole)\nconsole.log("Outros papéis:", outrasRoles)' },
      ]
    },

    // ─── AULA 2.7 — Métodos de String ───────────────────────────────────
    {
      id: '2.7', module: 2, index: 7,
      title: 'Métodos de String',
      duration: 14,
      sections: [
        { type: 'h2', text: 'Strings são objetos' },
        { type: 'p', html: 'Em JavaScript, strings têm dezenas de métodos prontos. Você não precisa decorar todos — aprenda os essenciais e consulte o resto quando precisar.' },
        { type: 'h2', text: 'Busca e verificação' },
        { type: 'code', lang: 'JavaScript', raw: 'const frase = "JavaScript é incrível!"\n\nconsole.log(frase.length)                   // 22\nconsole.log(frase.includes("incrível"))     // true\nconsole.log(frase.startsWith("Java"))       // true\nconsole.log(frase.endsWith("!"))            // true\nconsole.log(frase.indexOf("é"))             // 11\nconsole.log(frase.toUpperCase())            // "JAVASCRIPT É INCRÍVEL!"\nconsole.log(frase.toLowerCase())            // "javascript é incrível!"' },
        { type: 'h2', text: 'Extração e modificação' },
        { type: 'code', lang: 'JavaScript', raw: 'const texto = "  Olá, Mundo!  "\n\n// trim — remove espaços das bordas\nconsole.log(texto.trim())           // "Olá, Mundo!"\n\n// slice — extrai parte da string\nconst codigo = "USER-12345-BR"\nconsole.log(codigo.slice(5, 10))    // "12345"\nconsole.log(codigo.slice(-2))       // "BR"\n\n// replace — substitui\nconst original = "foo bar foo"\nconsole.log(original.replace("foo", "baz"))       // "baz bar foo"\nconsole.log(original.replaceAll("foo", "baz"))    // "baz bar baz"' },
        { type: 'h2', text: 'split e join — entre string e array' },
        { type: 'code', lang: 'JavaScript', raw: '// split — string → array\nconst csv = "Raphael,25,SP,dev"\nconst campos = csv.split(",")\nconsole.log(campos)   // ["Raphael", "25", "SP", "dev"]\n\nconst palavras = "olá mundo".split(" ")\nconsole.log(palavras) // ["olá", "mundo"]\n\n// join — array → string\nconst itens = ["pão", "leite", "café"]\nconsole.log(itens.join(", "))    // "pão, leite, café"\nconsole.log(itens.join(" | "))   // "pão | leite | café"' },
        { type: 'h2', text: 'Template literals — interpolação' },
        { type: 'code', lang: 'JavaScript', raw: 'const nome = "Raphael"\nconst nivel = 7\n\n// Concatenação antiga\nconst msg1 = "Olá, " + nome + "! Seu nível é " + nivel + "."\n\n// Template literal (moderno)\nconst msg2 = `Olá, ${nome}! Seu nível é ${nivel}.`\n\nconsole.log(msg2)  // "Olá, Raphael! Seu nível é 7."\n\n// Expressões dentro\nconst preco = 49.9\nconsole.log(`Total: R$ ${(preco * 1.1).toFixed(2)}`)  // "Total: R$ 54.89"' },
        { type: 'exercise',
          title: 'Processar dados de texto',
          desc: 'Use métodos de string para limpar e formatar dados de entrada.',
          steps: ['Crie `entrada = "  raphael castilho , 25 , SP  "`', 'Use `.trim()` para remover espaços', 'Use `.split(",")` para separar os campos', 'Use `.map(s => s.trim())` para limpar cada campo', 'Imprima com template literal: "Nome: X | Idade: Y | Estado: Z"'],
          solution: 'const entrada = "  raphael castilho , 25 , SP  "\n\nconst campos = entrada.trim().split(",").map(s => s.trim())\nconst [nome, idade, estado] = campos\n\nconst nomeFormatado = nome.split(" ").map(p => p[0].toUpperCase() + p.slice(1)).join(" ")\n\nconsole.log(`Nome: ${nomeFormatado} | Idade: ${idade} | Estado: ${estado}`)' },
      ]
    },

    // ─── AULA 2.8 — Tratamento de Erros ─────────────────────────────────
    {
      id: '2.8', module: 2, index: 8,
      title: 'Tratamento de Erros',
      duration: 14,
      sections: [
        { type: 'h2', text: 'Por que tratar erros?' },
        { type: 'p', html: 'Erros acontecem. Dados inválidos, rede fora do ar, arquivo inexistente — seu código precisa lidar com isso sem travar. JavaScript usa <code>try/catch/finally</code> para isso.' },
        { type: 'h2', text: 'try / catch / finally' },
        { type: 'code', lang: 'JavaScript', raw: 'try {\n  // Código que pode falhar\n  const resultado = JSON.parse("{ inválido }")\n  console.log(resultado)\n} catch (erro) {\n  // Executado se algo der errado\n  console.log("Erro capturado:", erro.message)\n} finally {\n  // Executado SEMPRE — com ou sem erro\n  console.log("Processamento encerrado.")\n}\n// "Erro capturado: Unexpected token..."\n// "Processamento encerrado."' },
        { type: 'h2', text: 'throw — lançar erros próprios' },
        { type: 'code', lang: 'JavaScript', raw: 'function dividir(a, b) {\n  if (b === 0) {\n    throw new Error("Divisão por zero não é permitida")\n  }\n  return a / b\n}\n\ntry {\n  console.log(dividir(10, 2))   // 5\n  console.log(dividir(10, 0))   // lança erro\n} catch (e) {\n  console.log("⚠", e.message)\n}' },
        { type: 'h2', text: 'Tipos de erro' },
        { type: 'code', lang: 'JavaScript', raw: '// ReferenceError — variável não existe\ntry { console.log(xyzNaoExiste) } catch (e) { console.log(e.name) }  // ReferenceError\n\n// TypeError — tipo errado\ntry { null.nome } catch (e) { console.log(e.name) }  // TypeError\n\n// SyntaxError — JSON inválido\ntry { JSON.parse("{ruim}") } catch (e) { console.log(e.name) }  // SyntaxError\n\n// Error customizado\ntry {\n  throw new Error("Algo deu errado")\n} catch (e) {\n  console.log(e.name + ": " + e.message)  // Error: Algo deu errado\n}' },
        { type: 'callout', html: '<strong>Regra:</strong> não use try/catch para controlar fluxo normal. Use para situações genuinamente excepcionais — dados externos, parsing, operações que podem falhar por razões fora do seu controle.' },
        { type: 'exercise',
          title: 'Função robusta de parsing',
          desc: 'Crie uma função que faz parse de JSON com tratamento de erro elegante.',
          steps: ['Crie `parseSeguro(texto)` que tenta fazer JSON.parse', 'Se falhar, retorne `null` e imprima uma mensagem de aviso', 'Teste com JSON válido: `\'{"nome":"Raphael"}\'`', 'Teste com JSON inválido: `"isso não é json"`'],
          solution: 'function parseSeguro(texto) {\n  try {\n    const resultado = JSON.parse(texto)\n    return resultado\n  } catch (e) {\n    console.warn("JSON inválido:", e.message)\n    return null\n  }\n}\n\nconst valido = parseSeguro(\'{"nome":"Raphael","idade":25}\')\nconsole.log(valido)        // { nome: "Raphael", idade: 25 }\nconsole.log(valido.nome)   // "Raphael"\n\nconst invalido = parseSeguro("isso não é json")\nconsole.log(invalido)      // null' },
      ]
    },

    // ─── AULA 2.9 — Exercícios Práticos M2 ──────────────────────────────
    {
      id: '2.9', module: 2, index: 9,
      title: 'Exercícios Práticos M2',
      duration: 25,
      sections: [
        { type: 'h2', text: 'Consolidando o Módulo 2' },
        { type: 'p', html: 'Quatro exercícios que combinam tudo do M2. Tente resolver cada um antes de ver a solução.' },
        { type: 'h2', text: 'Exercício 1 — Agrupar por categoria' },
        { type: 'code', lang: 'JavaScript', raw: 'const itens = [\n  { nome: "Mouse", categoria: "periférico" },\n  { nome: "Monitor", categoria: "display" },\n  { nome: "Teclado", categoria: "periférico" },\n  { nome: "Webcam", categoria: "câmera" },\n  { nome: "Caixas de Som", categoria: "áudio" },\n  { nome: "Headset", categoria: "áudio" }\n]\n\nconst agrupado = itens.reduce((acc, item) => {\n  if (!acc[item.categoria]) acc[item.categoria] = []\n  acc[item.categoria].push(item.nome)\n  return acc\n}, {})\n\nconsole.log(agrupado)\n// { periférico: ["Mouse","Teclado"], display: [...], ... }' },
        { type: 'h2', text: 'Exercício 2 — Pipeline de transformação' },
        { type: 'code', lang: 'JavaScript', raw: 'const vendas = [\n  { produto: "Notebook", valor: 3200, quantidade: 2 },\n  { produto: "Mouse", valor: 80, quantidade: 15 },\n  { produto: "Monitor", valor: 900, quantidade: 5 },\n  { produto: "Teclado", valor: 150, quantidade: 8 }\n]\n\n// Total por produto, só os acima de R$1000 no total\nconst resultado = vendas\n  .map(v => ({ ...v, total: v.valor * v.quantidade }))\n  .filter(v => v.total > 1000)\n  .map(v => `${v.produto}: R$ ${v.total}`)\n\nconsole.log(resultado)' },
        { type: 'h2', text: 'Exercício 3 — Desestruturação em funções' },
        { type: 'code', lang: 'JavaScript', raw: '// Receber objeto e desestruturar no parâmetro\nfunction exibirUsuario({ nome, email, plano = "free", ativo = true }) {\n  const status = ativo ? "ativo" : "inativo"\n  return `[${plano.toUpperCase()}] ${nome} <${email}> — ${status}`\n}\n\nconsole.log(exibirUsuario({\n  nome: "Raphael",\n  email: "raphael@email.com",\n  plano: "pro"\n}))\n\nconsole.log(exibirUsuario({\n  nome: "Maria",\n  email: "maria@email.com",\n  ativo: false\n}))' },
        { type: 'h2', text: 'Exercício 4 — Processar CSV' },
        { type: 'code', lang: 'JavaScript', raw: 'const csv = `nome,idade,cidade\nRaphael,25,São Paulo\nMaria,30,Rio de Janeiro\nJoão,22,Belo Horizonte`\n\nconst linhas = csv.trim().split("\\n")\nconst cabecalho = linhas[0].split(",")\n\nconst registros = linhas.slice(1).map(linha => {\n  const valores = linha.split(",")\n  return cabecalho.reduce((obj, campo, i) => {\n    obj[campo] = valores[i]\n    return obj\n  }, {})\n})\n\nconsole.log(registros)\n// [ {nome:"Raphael",idade:"25",...}, ... ]' },
        { type: 'exercise',
          title: 'Desafio bônus — Estatísticas de notas',
          desc: 'Crie uma função que recebe um array de objetos aluno/nota e retorna estatísticas.',
          steps: ['Calcule a média geral das notas', 'Encontre o aluno com maior nota (`find` + `Math.max`)', 'Separe aprovados (>= 6) e reprovados', 'Retorne um objeto com: media, melhor, aprovados, reprovados'],
          solution: 'const turma = [\n  { nome: "Ana", nota: 8.5 },\n  { nome: "Bruno", nota: 4.0 },\n  { nome: "Carla", nota: 7.2 },\n  { nome: "Diego", nota: 5.5 },\n  { nome: "Eva", nota: 9.1 }\n]\n\nfunction estatisticas(alunos) {\n  const notas = alunos.map(a => a.nota)\n  const media = notas.reduce((acc, n) => acc + n, 0) / notas.length\n  const maiorNota = Math.max(...notas)\n  const melhor = alunos.find(a => a.nota === maiorNota)\n  const aprovados = alunos.filter(a => a.nota >= 6).map(a => a.nome)\n  const reprovados = alunos.filter(a => a.nota < 6).map(a => a.nome)\n  return { media: media.toFixed(2), melhor: melhor.nome, aprovados, reprovados }\n}\n\nconsole.log(estatisticas(turma))' },
      ]
    },

    // ─── AULA 2.10 — Projeto: Lista de Tarefas ──────────────────────────
    {
      id: '2.10', module: 2, index: 10,
      title: 'Projeto: Lista de Tarefas',
      duration: 35,
      sections: [
        { type: 'h2', text: 'O projeto do Módulo 2' },
        { type: 'p', html: 'Você vai construir um sistema completo de lista de tarefas em JavaScript puro. Sem interface visual ainda — foco total na lógica. Este projeto usa tudo do M2: arrays de objetos, map, filter, desestruturação e tratamento de erros.' },
        { type: 'h2', text: 'Estrutura de dados' },
        { type: 'code', lang: 'JavaScript', raw: '// Estado da aplicação\nconst estado = {\n  tarefas: [],\n  proximoId: 1\n}\n\n// Estrutura de uma tarefa\n// { id, titulo, concluida, prioridade, criadaEm }' },
        { type: 'h2', text: 'CRUD — Criar e Ler' },
        { type: 'code', lang: 'JavaScript', raw: 'function adicionarTarefa(titulo, prioridade = "normal") {\n  if (!titulo || titulo.trim() === "") {\n    throw new Error("Título não pode ser vazio")\n  }\n  const tarefa = {\n    id: estado.proximoId++,\n    titulo: titulo.trim(),\n    concluida: false,\n    prioridade,\n    criadaEm: new Date().toLocaleDateString("pt-BR")\n  }\n  estado.tarefas.push(tarefa)\n  return tarefa\n}\n\nfunction listarTarefas(filtro = "todas") {\n  const { tarefas } = estado\n  if (filtro === "pendentes")  return tarefas.filter(t => !t.concluida)\n  if (filtro === "concluidas") return tarefas.filter(t => t.concluida)\n  return tarefas\n}' },
        { type: 'h2', text: 'CRUD — Atualizar e Deletar' },
        { type: 'code', lang: 'JavaScript', raw: 'function concluirTarefa(id) {\n  const tarefa = estado.tarefas.find(t => t.id === id)\n  if (!tarefa) throw new Error("Tarefa #" + id + " não encontrada")\n  tarefa.concluida = true\n  return tarefa\n}\n\nfunction deletarTarefa(id) {\n  const idx = estado.tarefas.findIndex(t => t.id === id)\n  if (idx === -1) throw new Error("Tarefa #" + id + " não encontrada")\n  const [removida] = estado.tarefas.splice(idx, 1)\n  return removida\n}\n\nfunction resumo() {\n  const total = estado.tarefas.length\n  const feitas = estado.tarefas.filter(t => t.concluida).length\n  return `${feitas}/${total} tarefas concluídas`\n}' },
        { type: 'h2', text: 'Testando o sistema' },
        { type: 'code', lang: 'JavaScript', raw: 'adicionarTarefa("Estudar arrays", "alta")\nadicionarTarefa("Praticar filter e map")\nadicionarTarefa("Fazer o projeto M2", "alta")\nadicionarTarefa("Revisar desestruturação")\n\nconsole.log("--- Todas as tarefas ---")\nlistarTarefas().forEach(t => {\n  const status = t.concluida ? "✓" : "○"\n  console.log(`${status} [${t.prioridade}] ${t.titulo}`)\n})\n\nconcluirTarefa(1)\nconcluirTarefa(3)\n\nconsole.log("\\n--- Pendentes ---")\nlistarTarefas("pendentes").forEach(t => console.log("○", t.titulo))\n\nconsole.log("\\n" + resumo())' },
        { type: 'callout', html: '<strong>Parabéns!</strong> Este projeto combina tudo do M2. No Módulo 3, você vai conectar essa lógica ao DOM — botões, inputs e uma interface visual real no navegador.' },
        { type: 'exercise',
          title: 'Adicionar prioridades e busca',
          desc: 'Expanda o sistema com duas novas funcionalidades.',
          steps: ['Crie `buscarTarefas(termo)` que filtra por palavras no título (use `.includes()`)', 'Crie `tarefasPorPrioridade(prioridade)` que filtra por "alta", "normal" ou "baixa"', 'Adicione 5 tarefas de prioridades variadas e teste as duas funções', 'Imprima as tarefas de alta prioridade e o resultado da busca por um termo'],
          solution: 'const estado = { tarefas: [], proximoId: 1 }\n\nfunction adicionarTarefa(titulo, prioridade = "normal") {\n  estado.tarefas.push({ id: estado.proximoId++, titulo, concluida: false, prioridade })\n}\n\nfunction buscarTarefas(termo) {\n  return estado.tarefas.filter(t => t.titulo.toLowerCase().includes(termo.toLowerCase()))\n}\n\nfunction tarefasPorPrioridade(p) {\n  return estado.tarefas.filter(t => t.prioridade === p)\n}\n\nadicionarTarefa("Estudar JavaScript", "alta")\nadicionarTarefa("Fazer exercícios", "alta")\nadicionarTarefa("Ler documentação", "normal")\nadicionarTarefa("Revisar conteúdo", "baixa")\nadicionarTarefa("Praticar projetos", "alta")\n\nconsole.log("Alta prioridade:", tarefasPorPrioridade("alta").map(t => t.titulo))\nconsole.log("Busca por \'exerc\':", buscarTarefas("exerc").map(t => t.titulo))' },
      ]
    },
  ];
})();
