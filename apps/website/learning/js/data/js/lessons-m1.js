// Sentinel Learning — Conteúdo do Módulo 1: Fundamentos

(function () {
  window.M1 = [
    // ─── AULA 1.1 — Lógica de Programação ───────────────────────────────
    {
      id: '1.1', module: 1, index: 1,
      title: 'Lógica de Programação',
      duration: 12,
      sections: [
        { type: 'h2', text: 'O que é programação?' },
        { type: 'p', html: 'Programação é o ato de dar <strong>instruções precisas</strong> a um computador para que ele resolva um problema. O computador não pensa. Ele segue ordens. Sua função como programador é dar as ordens certas, na ordem certa.' },
        { type: 'callout', html: '<strong>Analogia:</strong> pense em uma receita de bolo. Você lista os ingredientes e os passos. O computador lê sua receita e executa cada passo exatamente como você escreveu — sem criatividade, sem intuição.' },
        { type: 'h2', text: 'O que é um algoritmo?' },
        { type: 'p', html: 'Um <strong>algoritmo</strong> é uma sequência finita de passos para resolver um problema específico. Antes de escrever qualquer código, você pensa no algoritmo.' },
        { type: 'callout', html: 'Exemplo — Como fazer café:<br>1. Ferver a água<br>2. Colocar o pó no coador<br>3. Passar a água quente<br>4. Servir na xícara<br><br>Isso é um algoritmo. Simples, direto, executável.' },
        { type: 'h2', text: 'Variáveis — guardando informação' },
        { type: 'p', html: 'Uma <strong>variável</strong> é como uma caixa com um nome. Você guarda um valor dentro dela e pode usar esse valor depois, quantas vezes quiser. Em JavaScript, usamos <code>let</code> ou <code>const</code>:' },
        { type: 'code', lang: 'JavaScript', raw: 'let nome = "Raphael"\nlet idade = 25\nlet estudando = true\n\nconsole.log(nome)       // Raphael\nconsole.log(idade)      // 25\nconsole.log(estudando)  // true' },
        { type: 'h2', text: 'Tipos de dados básicos' },
        { type: 'p', html: 'Cada variável tem um <strong>tipo</strong> — o tipo de informação que ela carrega.' },
        { type: 'code', lang: 'JavaScript', raw: '// String — texto (sempre entre aspas)\nlet cidade = "São Paulo"\n\n// Number — número (sem aspas)\nlet ano = 2025\nlet altura = 1.75\n\n// Boolean — verdadeiro ou falso\nlet logado = false\nlet aprovado = true' },
        { type: 'callout', html: '<strong>Regra de ouro:</strong> se tem aspas, é texto. Se não tem aspas, é número ou boolean.' },
        { type: 'exercise',
          title: 'Suas primeiras variáveis',
          desc: 'Edite o código abaixo com seus próprios dados e clique em Executar para ver o resultado.',
          steps: ['Troque o valor de `nome` pelo seu nome', 'Troque o valor de `idade` pela sua idade', 'Mantenha `aprendendo` como `true`', 'Clique em ▶ Executar e veja o output'],
          starterCode: 'let nome = "SeuNome"\nlet idade = 0\nlet aprendendo = true\n\nconsole.log(nome)\nconsole.log(idade)\nconsole.log(aprendendo)',
          solution: 'let nome = "Raphael"\nlet idade = 25\nlet aprendendo = true\n\nconsole.log(nome)\nconsole.log(idade)\nconsole.log(aprendendo)' },
      ]
    },

    // ─── AULA 1.2 — Variáveis e Tipos de Dados ──────────────────────────
    {
      id: '1.2', module: 1, index: 2,
      title: 'Variáveis e Tipos de Dados',
      duration: 15,
      sections: [
        { type: 'h2', text: 'let, const e var' },
        { type: 'p', html: 'Existem três formas de declarar variáveis em JavaScript. Na prática moderna, você vai usar quase sempre <code>const</code> e <code>let</code>.' },
        { type: 'code', lang: 'JavaScript', raw: '// const — valor que não muda (use por padrão)\nconst PI = 3.14159\nconst nome = "Raphael"\n\n// let — valor que pode mudar\nlet pontos = 0\npontos = 10  // ok, podemos reatribuir\n\n// var — antigo, evite usar\nvar x = 1   // funciona, mas tem comportamento problemático' },
        { type: 'callout', html: '<strong>Regra prática:</strong> comece sempre com <code>const</code>. Se precisar mudar o valor depois, troque para <code>let</code>. Nunca use <code>var</code>.' },
        { type: 'h2', text: 'Os 5 tipos primitivos' },
        { type: 'code', lang: 'JavaScript', raw: '// 1. String — texto\nconst mensagem = "Olá, mundo!"\nconst nome = \'Raphael\'        // aspas simples também funciona\n\n// 2. Number — qualquer número\nconst idade = 25\nconst preco = 9.99\n\n// 3. Boolean — verdadeiro ou falso\nconst ativo = true\nconst deletado = false\n\n// 4. undefined — variável sem valor\nlet semValor\nconsole.log(semValor)  // undefined\n\n// 5. null — ausência intencional de valor\nconst resposta = null' },
        { type: 'h2', text: 'O operador typeof' },
        { type: 'p', html: '<code>typeof</code> diz qual é o tipo de qualquer valor. Útil para debugar.' },
        { type: 'code', lang: 'JavaScript', raw: 'console.log(typeof "Raphael")   // "string"\nconsole.log(typeof 25)          // "number"\nconsole.log(typeof true)        // "boolean"\nconsole.log(typeof undefined)   // "undefined"\nconsole.log(typeof null)        // "object" <- bug histórico do JS' },
        { type: 'h2', text: 'Regras de nomenclatura' },
        { type: 'p', html: 'JavaScript usa <strong>camelCase</strong>: primeira palavra em minúsculo, próximas com maiúscula inicial.' },
        { type: 'code', lang: 'JavaScript', raw: '// correto — camelCase\nconst nomeCompleto = "Raphael Castilho"\nconst totalDeItens = 10\nlet estaLogado = false\n\n// evitar\nconst nome_completo = "..."   // snake_case (Python style)\nconst NomeCompleto = "..."    // PascalCase (reservado para classes)' },
        { type: 'exercise',
          title: 'Explorar tipos',
          desc: 'Complete o código abaixo: preencha os valores e reatribua a variável idade com +1.',
          steps: ['Preencha `nomeCompleto` com seu nome', 'Defina `idade` e na linha seguinte some +1', 'Execute e observe o typeof de cada variável'],
          starterCode: 'const nomeCompleto = ""\n\nlet idade = 0\nidade = idade + 1\nconsole.log("Idade:", idade)\n\nconsole.log(typeof nomeCompleto)  // "string"\nconsole.log(typeof idade)         // "number"\nconsole.log(typeof true)          // "boolean"\nconsole.log(typeof undefined)     // "undefined"\nconsole.log(typeof null)          // "object"',
          solution: 'const nomeCompleto = "Raphael Castilho"\n\nlet idade = 25\nidade = idade + 1\nconsole.log(idade)  // 26\n\nconst texto = "string"\nconst numero = 42\nconst booleano = true\nlet semDefinir\nconst nulo = null\n\nconsole.log(typeof texto)      // "string"\nconsole.log(typeof numero)     // "number"\nconsole.log(typeof booleano)   // "boolean"\nconsole.log(typeof semDefinir) // "undefined"\nconsole.log(typeof nulo)       // "object"' },
      ]
    },

    // ─── AULA 1.3 — Condicionais ─────────────────────────────────────────
    {
      id: '1.3', module: 1, index: 3,
      title: 'Condicionais (if / else)',
      duration: 14,
      sections: [
        { type: 'h2', text: 'Tomando decisões no código' },
        { type: 'p', html: 'Condicionais permitem que o programa <strong>tome decisões</strong> baseadas em uma condição. Se a condição for verdadeira, executa um bloco. Senão, executa outro.' },
        { type: 'code', lang: 'JavaScript', raw: 'const hora = 9\n\nif (hora < 12) {\n  console.log("Bom dia!")\n} else if (hora < 18) {\n  console.log("Boa tarde!")\n} else {\n  console.log("Boa noite!")\n}\n// resultado: "Bom dia!"' },
        { type: 'h2', text: 'Operadores de comparação' },
        { type: 'code', lang: 'JavaScript', raw: 'console.log(10 === 10)   // true  — igual (valor e tipo)\nconsole.log(10 !== 5)    // true  — diferente\nconsole.log(10 > 5)      // true  — maior que\nconsole.log(10 < 5)      // false — menor que\nconsole.log(10 >= 10)    // true  — maior ou igual\n\n// Atenção: == vs ===\nconsole.log(1 == "1")    // true  — perigoso!\nconsole.log(1 === "1")   // false — use sempre ===' },
        { type: 'callout', html: '<strong>Regra:</strong> use sempre <code>===</code> e <code>!==</code>. O <code>==</code> faz conversões implícitas que causam bugs difíceis de achar.' },
        { type: 'h2', text: 'Operadores lógicos' },
        { type: 'code', lang: 'JavaScript', raw: 'const idade = 20\nconst temDocumento = true\n\n// && — E (ambas precisam ser verdadeiras)\nif (idade >= 18 && temDocumento) {\n  console.log("Pode entrar")\n}\n\n// || — OU (pelo menos uma precisa ser verdadeira)\nconst ehAdmin = false\nconst ehModerador = true\nif (ehAdmin || ehModerador) {\n  console.log("Acesso liberado")\n}\n\n// ! — NÃO (inverte)\nconst bloqueado = false\nif (!bloqueado) {\n  console.log("Usuário ativo")\n}' },
        { type: 'h2', text: 'Operador ternário' },
        { type: 'p', html: 'Uma forma curta de escrever um if/else simples. Use quando a condição é simples e cabe em uma linha.' },
        { type: 'code', lang: 'JavaScript', raw: 'const idade = 20\n\n// if/else tradicional\nlet status\nif (idade >= 18) {\n  status = "adulto"\n} else {\n  status = "menor"\n}\n\n// ternário — mesmo resultado, uma linha\nconst status2 = idade >= 18 ? "adulto" : "menor"\nconsole.log(status2)  // "adulto"' },
        { type: 'exercise',
          title: 'Classificar temperatura',
          desc: 'Complete as mensagens dentro do if/else e teste com diferentes valores de temp.',
          steps: ['Preencha as strings dentro de cada `console.log`', 'Teste com temp = 10, temp = 20, temp = 35', 'Troque `const` por `let` para reatribuir e testar vários valores'],
          starterCode: 'const temp = 28\n\nif (temp < 15) {\n  console.log("Frio — ...")\n} else if (temp >= 15 && temp <= 25) {\n  console.log("Agradável — ...")\n} else {\n  console.log("Quente — ...")\n}',
          solution: 'const temp = 28\n\nif (temp < 15) {\n  console.log("Frio — pegue um casaco")\n} else if (temp >= 15 && temp <= 25) {\n  console.log("Agradável — dia perfeito")\n} else {\n  console.log("Quente — beba água")\n}' },
      ]
    },

    // ─── AULA 1.4 — Loops ────────────────────────────────────────────────
    {
      id: '1.4', module: 1, index: 4,
      title: 'Loops (for / while)',
      duration: 16,
      sections: [
        { type: 'h2', text: 'O que é um loop?' },
        { type: 'p', html: 'Um loop (laço) repete um bloco de código várias vezes, enquanto uma condição for verdadeira. Sem loops, você teria que escrever o mesmo código centenas de vezes.' },
        { type: 'h2', text: 'O loop for' },
        { type: 'p', html: 'O <code>for</code> é ideal quando você sabe <strong>quantas vezes</strong> quer repetir.' },
        { type: 'code', lang: 'JavaScript', raw: '// for (início; condição; incremento)\nfor (let i = 1; i <= 5; i++) {\n  console.log(i)\n}\n// 1, 2, 3, 4, 5\n\n// Somando números de 1 a 10\nlet soma = 0\nfor (let i = 1; i <= 10; i++) {\n  soma = soma + i\n}\nconsole.log(soma)  // 55' },
        { type: 'callout', html: '<strong>i++</strong> é o mesmo que <code>i = i + 1</code>. É um atalho muito comum em loops. <strong>i--</strong> é <code>i = i - 1</code>.' },
        { type: 'h2', text: 'O loop while' },
        { type: 'code', lang: 'JavaScript', raw: 'let contador = 0\n\nwhile (contador < 5) {\n  console.log("Contando:", contador)\n  contador++\n}\n// Contando: 0, 1, 2, 3, 4' },
        { type: 'h2', text: 'break e continue' },
        { type: 'code', lang: 'JavaScript', raw: '// break — sai do loop imediatamente\nfor (let i = 1; i <= 10; i++) {\n  if (i === 5) break\n  console.log(i)\n}\n// 1, 2, 3, 4\n\n// continue — pula para a próxima iteração\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) continue  // pula pares\n  console.log(i)\n}\n// 1, 3, 5, 7, 9' },
        { type: 'exercise',
          title: 'Tabuada e FizzBuzz',
          desc: 'Parte 1 já está pronta. Complete a Parte 2: no FizzBuzz, adicione o caso para múltiplos de 5.',
          steps: ['Execute a Parte 1 para ver a tabuada funcionando', 'Complete o `else if` do FizzBuzz para múltiplos de 5', 'Execute e confira os números de 1 a 20'],
          starterCode: '// Parte 1 — Tabuada do 7\nfor (let i = 1; i <= 10; i++) {\n  console.log("7 x " + i + " = " + (7 * i))\n}\n\n// Parte 2 — FizzBuzz (complete!)\nfor (let i = 1; i <= 20; i++) {\n  if (i % 3 === 0) {\n    console.log("Fizz")\n  } else if (i % 5 === 0) {\n    // escreva aqui\n  } else {\n    console.log(i)\n  }\n}',
          solution: '// Parte 1 — Tabuada do 7\nfor (let i = 1; i <= 10; i++) {\n  console.log("7 x " + i + " = " + (7 * i))\n}\n\n// Parte 2 — FizzBuzz\nfor (let i = 1; i <= 20; i++) {\n  if (i % 3 === 0) {\n    console.log("Fizz")\n  } else if (i % 5 === 0) {\n    console.log("Buzz")\n  } else {\n    console.log(i)\n  }\n}' },
      ]
    },

    // ─── AULA 1.5 — Funções ──────────────────────────────────────────────
    {
      id: '1.5', module: 1, index: 5,
      title: 'Funções',
      duration: 18,
      sections: [
        { type: 'h2', text: 'O que é uma função?' },
        { type: 'p', html: 'Uma função é um <strong>bloco de código com um nome</strong>, que você pode executar quantas vezes quiser. Funções evitam repetição e deixam o código organizado.' },
        { type: 'h2', text: 'Declarando e chamando' },
        { type: 'code', lang: 'JavaScript', raw: '// Declaração\nfunction saudar(nome) {\n  return "Olá, " + nome + "!"\n}\n\n// Chamando\nconsole.log(saudar("Raphael"))  // "Olá, Raphael!"\nconsole.log(saudar("Maria"))    // "Olá, Maria!"\n\n// Múltiplos parâmetros\nfunction somar(a, b) {\n  return a + b\n}\nconsole.log(somar(3, 4))   // 7' },
        { type: 'h2', text: 'Parâmetros padrão' },
        { type: 'code', lang: 'JavaScript', raw: 'function saudar(nome = "visitante") {\n  return "Olá, " + nome + "!"\n}\n\nconsole.log(saudar("Raphael"))  // "Olá, Raphael!"\nconsole.log(saudar())           // "Olá, visitante!"' },
        { type: 'h2', text: 'Arrow functions' },
        { type: 'p', html: 'São uma forma mais curta de escrever funções. Muito usadas no JavaScript moderno.' },
        { type: 'code', lang: 'JavaScript', raw: '// Forma tradicional\nfunction dobrar(n) {\n  return n * 2\n}\n\n// Arrow function equivalente\nconst dobrar = n => n * 2\n\nconsole.log(dobrar(5))  // 10\n\n// Mais exemplos\nconst quadrado = n => n * n\nconst somar = (a, b) => a + b\nconst saudar = nome => "Olá, " + nome' },
        { type: 'callout', html: 'Se a arrow function tem <strong>um parâmetro</strong>, os parênteses são opcionais. Se tem <strong>uma linha de retorno</strong>, você pode omitir <code>return</code> e as chaves.' },
        { type: 'exercise',
          title: 'Mini biblioteca de funções',
          desc: 'Complete as funções abaixo. As duas primeiras são arrow functions de uma linha.',
          steps: ['Complete `dobrar` para retornar o dobro de n', 'Complete `ehPar` para retornar true se n for par (dica: use %)', 'Complete `saudar` para retornar a frase de saudação', 'Teste cada função executando o código'],
          starterCode: 'const dobrar = n => \n\nconst ehPar = n => \n\nfunction saudar(nome, periodo) {\n  periodo = periodo || "dia"\n  // retorne: "Bom dia, Raphael!"\n}\n\nconsole.log(dobrar(7))                    // 14\nconsole.log(ehPar(4))                     // true\nconsole.log(ehPar(7))                     // false\nconsole.log(saudar("Raphael", "dia"))     // "Bom dia, Raphael!"\nconsole.log(saudar("Maria", "tarde"))     // "Bom tarde, Maria!"',
          solution: 'const dobrar = n => n * 2\n\nconst ehPar = n => n % 2 === 0\n\nfunction saudar(nome, periodo) {\n  periodo = periodo || "dia"\n  return "Bom " + periodo + ", " + nome + "!"\n}\n\nconsole.log(dobrar(7))              // 14\nconsole.log(ehPar(4))               // true\nconsole.log(ehPar(7))               // false\nconsole.log(saudar("Raphael", "dia"))  // "Bom dia, Raphael!"\nconsole.log(saudar("Maria", "tarde")) // "Bom tarde, Maria!"' },
      ]
    },

    // ─── AULA 1.6 — Escopo ───────────────────────────────────────────────
    {
      id: '1.6', module: 1, index: 6,
      title: 'Escopo de Variáveis',
      duration: 12,
      sections: [
        { type: 'h2', text: 'O que é escopo?' },
        { type: 'p', html: '<strong>Escopo</strong> define onde uma variável existe e pode ser acessada. Entendê-lo evita muitos bugs.' },
        { type: 'h2', text: 'Escopo global vs. local' },
        { type: 'code', lang: 'JavaScript', raw: 'const nome = "Raphael"  // escopo global\n\nfunction saudar() {\n  const saudacao = "Olá"  // escopo local\n  console.log(saudacao + ", " + nome)  // acessa global: ok\n}\n\nsaudar()  // "Olá, Raphael"\n\nconsole.log(saudacao)  // ReferenceError: não existe fora!' },
        { type: 'callout', html: 'Variáveis dentro de uma função <strong>não existem fora dela</strong>. Mas uma função pode acessar variáveis do escopo externo.' },
        { type: 'h2', text: 'Escopo de bloco (let e const)' },
        { type: 'code', lang: 'JavaScript', raw: '// let e const têm escopo de bloco { }\nif (true) {\n  let x = 10\n  const y = 20\n  console.log(x, y)  // 10 20\n}\nconsole.log(x)  // ReferenceError!\n\n// var NÃO tem escopo de bloco — bug clássico\nif (true) {\n  var z = 99  // vaza para fora!\n}\nconsole.log(z)  // 99 — problemático' },
        { type: 'h2', text: 'Por que let e const existem?' },
        { type: 'code', lang: 'JavaScript', raw: '// Bug clássico com var em loops\nfor (var i = 0; i < 3; i++) {\n  setTimeout(function() { console.log(i) }, 100)\n}\n// Imprime: 3, 3, 3 (errado!)\n\n// Correto com let\nfor (let i = 0; i < 3; i++) {\n  setTimeout(function() { console.log(i) }, 100)\n}\n// Imprime: 0, 1, 2 (correto)' },
        { type: 'exercise',
          title: 'Prever a saída',
          desc: 'Leia o código, tente prever o resultado e então execute para confirmar.',
          steps: ['Leia o código sem executar: o que `console.log(resultado)` vai imprimir?', 'Execute e confirme sua previsão', 'Tente mudar o valor passado para `calcular()` e veja o que muda'],
          starterCode: 'const base = 10\n\nfunction calcular(x) {\n  const resultado = base + x\n  return resultado\n}\n\nconst resultado = calcular(5)\nconsole.log(resultado)\n// O que será impresso?',
          solution: 'const base = 10\n\nfunction calcular(x) {\n  const resultado = base + x  // base do escopo global\n  return resultado\n}\n\nconst resultado = calcular(5)\nconsole.log(resultado)  // 15\n\n// "resultado" dentro da função é DIFERENTE\n// de "resultado" fora. Dois escopos distintos.' },
      ]
    },

    // ─── AULA 1.7 — Exercícios Práticos ──────────────────────────────────
    {
      id: '1.7', module: 1, index: 7,
      title: 'Exercícios Práticos',
      duration: 20,
      sections: [
        { type: 'h2', text: 'Hora de consolidar' },
        { type: 'p', html: 'Esta aula é diferente: são 4 exercícios para consolidar tudo que você aprendeu. Tente resolver cada um <strong>antes</strong> de olhar a solução. É aqui que o aprendizado acontece de verdade.' },
        { type: 'h2', text: 'Exercício 1 — FizzBuzz completo' },
        { type: 'p', html: 'Imprima números de 1 a 30. Múltiplos de 3: "Fizz". Múltiplos de 5: "Buzz". Múltiplos de ambos: "FizzBuzz".' },
        { type: 'code', lang: 'JavaScript', raw: 'for (let i = 1; i <= 30; i++) {\n  if (i % 3 === 0 && i % 5 === 0) {\n    console.log("FizzBuzz")\n  } else if (i % 3 === 0) {\n    console.log("Fizz")\n  } else if (i % 5 === 0) {\n    console.log("Buzz")\n  } else {\n    console.log(i)\n  }\n}' },
        { type: 'h2', text: 'Exercício 2 — Inverter string' },
        { type: 'p', html: 'Crie uma função que recebe uma palavra e retorna ela ao contrário.' },
        { type: 'code', lang: 'JavaScript', raw: 'function inverter(texto) {\n  let resultado = ""\n  for (let i = texto.length - 1; i >= 0; i--) {\n    resultado = resultado + texto[i]\n  }\n  return resultado\n}\n\nconsole.log(inverter("Raphael"))    // "leahpaR"\nconsole.log(inverter("JavaScript")) // "tpircSavaJ"' },
        { type: 'h2', text: 'Exercício 3 — Calcular média' },
        { type: 'code', lang: 'JavaScript', raw: 'function avaliarAluno(n1, n2, n3) {\n  const media = (n1 + n2 + n3) / 3\n  let status\n  if (media >= 6) {\n    status = "Aprovado"\n  } else if (media >= 4) {\n    status = "Recuperação"\n  } else {\n    status = "Reprovado"\n  }\n  return "Média: " + media.toFixed(1) + " — " + status\n}\n\nconsole.log(avaliarAluno(8, 7, 9))  // "Média: 8.0 — Aprovado"\nconsole.log(avaliarAluno(3, 2, 4))  // "Média: 3.0 — Reprovado"' },
        { type: 'h2', text: 'Exercício 4 — Fibonacci' },
        { type: 'p', html: 'Imprima os primeiros N números da sequência. Começa: 0, 1, 1, 2, 3, 5, 8...' },
        { type: 'code', lang: 'JavaScript', raw: 'function fibonacci(n) {\n  let a = 0\n  let b = 1\n  for (let i = 0; i < n; i++) {\n    console.log(a)\n    const proximo = a + b\n    a = b\n    b = proximo\n  }\n}\n\nfibonacci(8)  // 0, 1, 1, 2, 3, 5, 8, 13' },
        { type: 'callout', html: 'Se você conseguiu resolver pelo menos 2 desses 4 exercícios sozinho, você está no caminho certo. Programação é prática — cada tentativa, certa ou errada, te ensina algo.' },
        { type: 'exercise',
          title: 'Desafio bônus — Palíndromo',
          desc: 'Complete a função ehPalindromo usando a função inverter já pronta. Uma palavra é palíndromo se for igual ao contrário.',
          steps: ['A função `inverter` já está implementada', 'Complete `ehPalindromo`: compare a palavra com sua versão invertida', '"arara" → true, "javascript" → false', 'Dica: use `.toLowerCase()` para ignorar maiúsculas'],
          starterCode: 'function inverter(texto) {\n  let resultado = ""\n  for (let i = texto.length - 1; i >= 0; i--) {\n    resultado = resultado + texto[i]\n  }\n  return resultado\n}\n\nfunction ehPalindromo(palavra) {\n  const lower = palavra.toLowerCase()\n  // compare lower com inverter(lower)\n}\n\nconsole.log(ehPalindromo("arara"))      // true\nconsole.log(ehPalindromo("Ovo"))        // true\nconsole.log(ehPalindromo("javascript")) // false',
          solution: 'function inverter(texto) {\n  let resultado = ""\n  for (let i = texto.length - 1; i >= 0; i--) {\n    resultado = resultado + texto[i]\n  }\n  return resultado\n}\n\nfunction ehPalindromo(palavra) {\n  const lower = palavra.toLowerCase()\n  return lower === inverter(lower)\n}\n\nconsole.log(ehPalindromo("arara"))      // true\nconsole.log(ehPalindromo("Ovo"))        // true\nconsole.log(ehPalindromo("javascript")) // false' },
      ]
    },

    // ─── AULA 1.8 — Projeto: Calculadora ─────────────────────────────────
    {
      id: '1.8', module: 1, index: 8,
      title: 'Projeto: Calculadora Simples',
      duration: 30,
      sections: [
        { type: 'h2', text: 'Seu primeiro projeto real' },
        { type: 'p', html: 'Você vai construir uma calculadora com JavaScript puro. Sem interface visual ainda — isso é o Módulo 3. O foco é praticar tudo do M1: variáveis, condicionais, loops e funções.' },
        { type: 'h2', text: 'As operações' },
        { type: 'code', lang: 'JavaScript', raw: 'const somar = (a, b) => a + b\nconst subtrair = (a, b) => a - b\nconst multiplicar = (a, b) => a * b\nconst dividir = (a, b) => {\n  if (b === 0) return "Erro: divisão por zero"\n  return a / b\n}\n\nconsole.log(somar(10, 5))       // 15\nconsole.log(subtrair(10, 5))    // 5\nconsole.log(multiplicar(10, 5)) // 50\nconsole.log(dividir(10, 0))     // "Erro: divisão por zero"' },
        { type: 'h2', text: 'A função principal' },
        { type: 'code', lang: 'JavaScript', raw: 'function calcular(a, operador, b) {\n  switch (operador) {\n    case "+": return somar(a, b)\n    case "-": return subtrair(a, b)\n    case "*": return multiplicar(a, b)\n    case "/": return dividir(a, b)\n    default:  return "Operador inválido: " + operador\n  }\n}\n\nconsole.log(calcular(10, "+", 5))   // 15\nconsole.log(calcular(4,  "*", 4))   // 16\nconsole.log(calcular(15, "/", 3))   // 5\nconsole.log(calcular(10, "^", 2))   // "Operador inválido: ^"' },
        { type: 'h2', text: 'Histórico de operações' },
        { type: 'code', lang: 'JavaScript', raw: 'const historico = []\n\nfunction calcularComHistorico(a, operador, b) {\n  const resultado = calcular(a, operador, b)\n  const registro = a + " " + operador + " " + b + " = " + resultado\n  historico.push(registro)\n  return resultado\n}\n\ncalcularComHistorico(10, "+", 5)\ncalcularComHistorico(20, "*", 3)\ncalcularComHistorico(100, "/", 4)\n\nconsole.log("--- Histórico ---")\nfor (let i = 0; i < historico.length; i++) {\n  console.log(historico[i])\n}\n// 10 + 5 = 15\n// 20 * 3 = 60\n// 100 / 4 = 25' },
        { type: 'callout', html: '<strong>Parabéns!</strong> Você acabou de concluir o Módulo 1. Esta calculadora usa variáveis, funções, condicionais, loops e até um array. No Módulo 3, você vai conectar essa lógica a botões e uma interface real no navegador.' },
        { type: 'exercise',
          title: 'Calculadora científica simples',
          desc: 'A calculadora completa já está pronta. Execute, teste os resultados e depois adicione novos operadores se quiser.',
          steps: ['Execute e confira: 10 % 3 = 1, sqrt(16) = 4, 2^8 = 256', 'Tente adicionar um novo operador ao switch', 'Experimente chamar calcular com operadores inválidos'],
          starterCode: 'function calcular(a, operador, b) {\n  switch (operador) {\n    case "+": return a + b\n    case "-": return a - b\n    case "*": return a * b\n    case "/": return b === 0 ? "Erro: divisão por zero" : a / b\n    case "%": return a % b\n    case "sqrt": return Math.sqrt(a)\n    case "^": return Math.pow(a, b)\n    default: return "Operador inválido: " + operador\n  }\n}\n\nconsole.log(calcular(10, "%", 3))    // 1\nconsole.log(calcular(16, "sqrt", 0)) // 4\nconsole.log(calcular(2, "^", 8))     // 256\nconsole.log(calcular(10, "?", 5))    // operador inválido',
          solution: 'function calcular(a, operador, b) {\n  switch (operador) {\n    case "+":    return a + b\n    case "-":    return a - b\n    case "*":    return a * b\n    case "/":    return b === 0 ? "Erro: divisão por zero" : a / b\n    case "%":    return a % b\n    case "sqrt": return Math.sqrt(a)\n    case "^":    return Math.pow(a, b)\n    default:     return "Operador inválido"\n  }\n}\n\nconsole.log(calcular(10, "%", 3))    // 1\nconsole.log(calcular(16, "sqrt", 0)) // 4\nconsole.log(calcular(2,  "^", 8))    // 256' },
      ]
    },
  ];
})();
