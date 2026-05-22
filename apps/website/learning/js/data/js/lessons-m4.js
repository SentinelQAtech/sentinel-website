// Sentinel Learning — Módulo 4: Projetos Reais

(function () {
  window.M4 = [

    // ─── 4.1 ────────────────────────────────────────────────────────────────
    {
      id: '4.1', module: 4, index: 1,
      title: 'Projeto 1 — Calculadora',
      duration: 50,
      sections: [
        { type: 'h2', text: 'O que você vai construir' },
        { type: 'p', html: 'Uma calculadora completa com operações básicas (soma, subtração, multiplicação, divisão), teclado funcional, histórico de operação e suporte a atalhos de teclado. O foco deste projeto é <strong>gerenciar estado</strong> e <strong>separar lógica de interface</strong>.' },
        { type: 'h2', text: 'Estrutura do projeto' },
        { type: 'code', lang: 'text', raw: 'calculadora/\n  index.html\n  style.css\n  app.js\n\nFuncionalidades:\n  ✅ Dígitos 0-9\n  ✅ Operadores: + - × ÷\n  ✅ Ponto decimal\n  ✅ Igual (=) e limpar (C)\n  ✅ Display com operação atual visível\n  ✅ Atalhos de teclado\n  ✅ Tratamento de divisão por zero\n  ✅ Encadeamento de operações' },
        { type: 'h2', text: 'HTML da calculadora' },
        { type: 'code', lang: 'HTML', raw: '<div class="calc">\n  <div class="display">\n    <div class="historico" id="historico"></div>\n    <div class="atual" id="atual">0</div>\n  </div>\n  <div class="teclado">\n    <button class="btn-limpar" data-acao="limpar">C</button>\n    <button data-acao="plusminus">±</button>\n    <button data-acao="porcento">%</button>\n    <button class="btn-op" data-acao="dividir">÷</button>\n\n    <button data-num="7">7</button>\n    <button data-num="8">8</button>\n    <button data-num="9">9</button>\n    <button class="btn-op" data-acao="multiplicar">×</button>\n\n    <button data-num="4">4</button>\n    <button data-num="5">5</button>\n    <button data-num="6">6</button>\n    <button class="btn-op" data-acao="subtrair">-</button>\n\n    <button data-num="1">1</button>\n    <button data-num="2">2</button>\n    <button data-num="3">3</button>\n    <button class="btn-op" data-acao="somar">+</button>\n\n    <button class="btn-zero" data-num="0">0</button>\n    <button data-acao="decimal">,</button>\n    <button class="btn-igual" data-acao="igual">=</button>\n  </div>\n</div>' },
        { type: 'h2', text: 'JavaScript — gerenciando estado' },
        { type: 'code', lang: 'JavaScript', raw: '// Estado da calculadora\nlet estado = {\n  atual: "0",       // número sendo digitado\n  anterior: null,   // número anterior\n  operacao: null,   // operação pendente\n  resetar: false    // flag: próximo dígito reinicia o display\n}\n\nconst displayAtual  = document.getElementById("atual")\nconst displayHistorico = document.getElementById("historico")\n\nfunction atualizarDisplay() {\n  displayAtual.textContent = estado.atual\n}\n\nfunction digitarNumero(num) {\n  if (estado.resetar) {\n    estado.atual = String(num)\n    estado.resetar = false\n  } else {\n    estado.atual = estado.atual === "0" ? String(num) : estado.atual + num\n  }\n  atualizarDisplay()\n}\n\nfunction definirOperacao(op) {\n  if (estado.operacao !== null) calcular()  // encadear ops\n  estado.anterior = parseFloat(estado.atual)\n  estado.operacao = op\n  estado.resetar = true\n  displayHistorico.textContent = `${estado.anterior} ${op}`\n}\n\nconst ops = {\n  "+": (a, b) => a + b,\n  "-": (a, b) => a - b,\n  "×": (a, b) => a * b,\n  "÷": (a, b) => b === 0 ? "Erro" : a / b\n}\n\nfunction calcular() {\n  if (estado.operacao === null || estado.anterior === null) return\n  \n  const b = parseFloat(estado.atual)\n  const resultado = ops[estado.operacao](estado.anterior, b)\n  \n  displayHistorico.textContent = `${estado.anterior} ${estado.operacao} ${b} =`\n  estado.atual = resultado === "Erro" ? "Erro" : String(parseFloat(resultado.toFixed(10)))\n  estado.anterior = null\n  estado.operacao = null\n  estado.resetar = true\n  atualizarDisplay()\n}\n\nfunction limpar() {\n  estado = { atual: "0", anterior: null, operacao: null, resetar: false }\n  displayHistorico.textContent = ""\n  atualizarDisplay()\n}\n\n// Event delegation no teclado\ndocument.querySelector(".teclado").addEventListener("click", function(e) {\n  const btn = e.target.closest("button")\n  if (!btn) return\n  \n  if (btn.dataset.num !== undefined) { digitarNumero(btn.dataset.num); return }\n  \n  const acoes = {\n    somar:      () => definirOperacao("+"),\n    subtrair:   () => definirOperacao("-"),\n    multiplicar:() => definirOperacao("×"),\n    dividir:    () => definirOperacao("÷"),\n    igual:      () => calcular(),\n    limpar:     () => limpar(),\n    decimal:    () => { if (!estado.atual.includes(".")) { estado.atual += "."; atualizarDisplay() } },\n    porcento:   () => { estado.atual = String(parseFloat(estado.atual) / 100); atualizarDisplay() },\n    plusminus:  () => { estado.atual = String(parseFloat(estado.atual) * -1); atualizarDisplay() }\n  }\n  \n  if (acoes[btn.dataset.acao]) acoes[btn.dataset.acao]()\n})\n\n// Atalhos de teclado\ndocument.addEventListener("keydown", function(e) {\n  if (e.key >= "0" && e.key <= "9") digitarNumero(e.key)\n  else if (e.key === "+") definirOperacao("+")\n  else if (e.key === "-") definirOperacao("-")\n  else if (e.key === "*") definirOperacao("×")\n  else if (e.key === "/") { e.preventDefault(); definirOperacao("÷") }\n  else if (e.key === "Enter" || e.key === "=") calcular()\n  else if (e.key === "Escape") limpar()\n  else if (e.key === ".") document.querySelector("[data-acao=decimal]").click()\n})' },
        { type: 'exercise',
          title: 'Construa a calculadora',
          desc: 'Implemente o projeto completo e adicione pelo menos uma funcionalidade extra.',
          steps: [
            'Monte o HTML e o CSS da calculadora',
            'Implemente o estado e as funções de JavaScript',
            'Teste todas as operações, incluindo encadeamento e divisão por zero',
            'Adicione atalhos de teclado',
            'Bonus: adicione histórico de operações anteriores (lista abaixo da calculadora)'
          ],
          solution: '// Consulte o código completo acima.\n// Bonus — histórico de operações:\nconst historico = []\n\nfunction calcular() {\n  // ... lógica existente ...\n  historico.unshift(`${estado.anterior} ${estado.operacao} ${b} = ${resultado}`)\n  renderizarHistorico()\n}\n\nfunction renderizarHistorico() {\n  const lista = document.getElementById("lista-historico")\n  lista.innerHTML = historico.slice(0, 5)\n    .map(item => `<li>${item}</li>`).join("")\n}' },
      ]
    },

    // ─── 4.2 ────────────────────────────────────────────────────────────────
    {
      id: '4.2', module: 4, index: 2,
      title: 'Projeto 2 — App de Clima com API',
      duration: 55,
      sections: [
        { type: 'h2', text: 'O que você vai construir' },
        { type: 'p', html: 'Um app de clima que busca dados reais de uma API pública, exibe temperatura, condições e ícone do tempo para qualquer cidade. Este projeto introduz <strong>fetch</strong>, <strong>async/await</strong> e <strong>tratamento de erros assíncronos</strong>.' },
        { type: 'h2', text: 'Conceito fundamental — fetch e async/await' },
        { type: 'code', lang: 'JavaScript', raw: '// fetch retorna uma Promise — você "aguarda" o resultado\nasync function buscarClima(cidade) {\n  try {\n    // 1. Fazer a requisição\n    const resposta = await fetch(\n      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=SUA_CHAVE&units=metric&lang=pt_br`\n    )\n    \n    // 2. Verificar se deu certo\n    if (!resposta.ok) {\n      throw new Error("Cidade não encontrada")\n    }\n    \n    // 3. Converter para JSON\n    const dados = await resposta.json()\n    \n    return dados\n    \n  } catch (erro) {\n    throw erro  // propagar para quem chamou lidar\n  }\n}' },
        { type: 'callout', html: '<strong>API Key:</strong> Para usar a OpenWeatherMap, crie uma conta gratuita em openweathermap.org e gere uma API key. O plano gratuito dá 60 chamadas/minuto — mais que suficiente para desenvolvimento.' },
        { type: 'h2', text: 'Estrutura do HTML' },
        { type: 'code', lang: 'HTML', raw: '<div class="weather-app">\n  <div class="search">\n    <input type="text" id="cidade" placeholder="Nome da cidade...">\n    <button id="buscar">Buscar</button>\n  </div>\n  \n  <div id="resultado" class="oculto">\n    <div class="cidade-nome" id="nome-cidade"></div>\n    <img id="icone-clima" alt="Ícone do clima">\n    <div class="temperatura" id="temperatura"></div>\n    <div class="descricao" id="descricao"></div>\n    <div class="detalhes">\n      <span>Umidade: <strong id="umidade"></strong></span>\n      <span>Vento: <strong id="vento"></strong></span>\n    </div>\n  </div>\n  \n  <div id="erro" class="oculto"></div>\n  <div id="loading" class="oculto">Buscando...</div>\n</div>' },
        { type: 'h2', text: 'JavaScript completo' },
        { type: 'code', lang: 'JavaScript', raw: 'const API_KEY = "sua_chave_aqui"  // substitua pela sua chave\n\nconst inputCidade = document.getElementById("cidade")\nconst btnBuscar   = document.getElementById("buscar")\nconst resultado   = document.getElementById("resultado")\nconst erroDiv     = document.getElementById("erro")\nconst loadingDiv  = document.getElementById("loading")\n\nasync function buscarClima(cidade) {\n  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${API_KEY}&units=metric&lang=pt_br`\n  const res = await fetch(url)\n  if (!res.ok) throw new Error(res.status === 404 ? "Cidade não encontrada" : "Erro ao buscar dados")\n  return res.json()\n}\n\nfunction exibirClima(dados) {\n  document.getElementById("nome-cidade").textContent  = `${dados.name}, ${dados.sys.country}`\n  document.getElementById("temperatura").textContent = `${Math.round(dados.main.temp)}°C`\n  document.getElementById("descricao").textContent   = dados.weather[0].description\n  document.getElementById("umidade").textContent     = `${dados.main.humidity}%`\n  document.getElementById("vento").textContent       = `${Math.round(dados.wind.speed * 3.6)} km/h`\n  \n  const icone = document.getElementById("icone-clima")\n  icone.src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`\n  icone.alt = dados.weather[0].description\n  \n  resultado.classList.remove("oculto")\n  erroDiv.classList.add("oculto")\n}\n\nasync function pesquisar() {\n  const cidade = inputCidade.value.trim()\n  if (!cidade) return\n  \n  loadingDiv.classList.remove("oculto")\n  resultado.classList.add("oculto")\n  erroDiv.classList.add("oculto")\n  \n  try {\n    const dados = await buscarClima(cidade)\n    exibirClima(dados)\n  } catch (erro) {\n    erroDiv.textContent = erro.message\n    erroDiv.classList.remove("oculto")\n  } finally {\n    loadingDiv.classList.add("oculto")\n  }\n}\n\nbtnBuscar.addEventListener("click", pesquisar)\ninputCidade.addEventListener("keydown", e => { if (e.key === "Enter") pesquisar() })\n\n// Carregar cidade padrão\ninputCidade.value = "São Paulo"\npesquisar()' },
        { type: 'exercise',
          title: 'Construa o app de clima',
          desc: 'Monte o projeto completo com sua API key e adicione uma melhoria.',
          steps: [
            'Crie uma conta gratuita na OpenWeatherMap e gere sua API key',
            'Monte o HTML, CSS e JavaScript do app',
            'Teste com diferentes cidades e valide o tratamento de erro (cidade inexistente)',
            'Adicione uma melhoria: geolocalização automática (navigator.geolocation) OU histórico das últimas 5 cidades buscadas'
          ],
          solution: '// Bonus — geolocalização automática:\nwindow.addEventListener("load", function() {\n  if (!navigator.geolocation) return\n  \n  navigator.geolocation.getCurrentPosition(\n    async function(pos) {\n      const { latitude, longitude } = pos.coords\n      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt_br`\n      \n      try {\n        const res = await fetch(url)\n        const dados = await res.json()\n        inputCidade.value = dados.name\n        exibirClima(dados)\n      } catch (e) { /* silencioso — fallback para busca manual */ }\n    },\n    function() { /* usuário negou permissão — ok */ }\n  )\n})' },
      ]
    },

    // ─── 4.3 ────────────────────────────────────────────────────────────────
    {
      id: '4.3', module: 4, index: 3,
      title: 'Projeto 3 — Dashboard de Finanças',
      duration: 60,
      sections: [
        { type: 'h2', text: 'O que você vai construir' },
        { type: 'p', html: 'Um dashboard de controle financeiro pessoal: adicione receitas e despesas, veja o saldo atual, filtre por categoria e veja um resumo visual. Este projeto consolida <strong>tudo do módulo</strong>: DOM, eventos, localStorage, delegação e gerenciamento de estado complexo.' },
        { type: 'h2', text: 'Funcionalidades' },
        { type: 'code', lang: 'text', raw: '✅ Adicionar transação (descrição, valor, tipo, categoria)\n✅ Listar transações com tipo visual diferente (entrada/saída)\n✅ Saldo total, total de entradas e total de saídas\n✅ Remover transação\n✅ Filtrar por tipo ou categoria\n✅ Persistência no localStorage\n✅ Resumo por categoria' },
        { type: 'h2', text: 'Modelo de dados' },
        { type: 'code', lang: 'JavaScript', raw: '// Cada transação tem essa forma:\nconst transacao = {\n  id: Date.now(),\n  descricao: "Salário",\n  valor: 5000,          // sempre positivo\n  tipo: "entrada",      // "entrada" ou "saida"\n  categoria: "Trabalho",\n  data: "2026-05-16"\n}\n\n// Estado global\nlet transacoes = JSON.parse(localStorage.getItem("financas")) || []\nlet filtroTipo = "todos"\nlet filtroCategoria = "todas"' },
        { type: 'h2', text: 'Cálculos e resumo' },
        { type: 'code', lang: 'JavaScript', raw: 'function calcularResumo() {\n  const entradas = transacoes\n    .filter(t => t.tipo === "entrada")\n    .reduce((acc, t) => acc + t.valor, 0)\n  \n  const saidas = transacoes\n    .filter(t => t.tipo === "saida")\n    .reduce((acc, t) => acc + t.valor, 0)\n  \n  const saldo = entradas - saidas\n  \n  return { entradas, saidas, saldo }\n}\n\nfunction formatarMoeda(valor) {\n  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })\n}\n\nfunction atualizarResumo() {\n  const { entradas, saidas, saldo } = calcularResumo()\n  \n  document.getElementById("saldo").textContent   = formatarMoeda(saldo)\n  document.getElementById("entradas").textContent = formatarMoeda(entradas)\n  document.getElementById("saidas").textContent   = formatarMoeda(saidas)\n  \n  const saldoEl = document.getElementById("saldo")\n  saldoEl.className = saldo >= 0 ? "positivo" : "negativo"\n}' },
        { type: 'h2', text: 'Renderizar transações com filtro' },
        { type: 'code', lang: 'JavaScript', raw: 'function render() {\n  let visiveis = transacoes\n  \n  if (filtroTipo !== "todos") {\n    visiveis = visiveis.filter(t => t.tipo === filtroTipo)\n  }\n  if (filtroCategoria !== "todas") {\n    visiveis = visiveis.filter(t => t.categoria === filtroCategoria)\n  }\n  \n  const lista = document.getElementById("lista-transacoes")\n  \n  if (visiveis.length === 0) {\n    lista.innerHTML = `<p class="empty">Nenhuma transação encontrada.</p>`\n  } else {\n    lista.innerHTML = visiveis.map(t => `\n      <div class="transacao ${t.tipo}" data-id="${t.id}">\n        <div class="info">\n          <span class="descricao">${t.descricao}</span>\n          <span class="categoria">${t.categoria}</span>\n          <span class="data">${t.data}</span>\n        </div>\n        <span class="valor ${t.tipo}">\n          ${t.tipo === "entrada" ? "+" : "-"} ${formatarMoeda(t.valor)}\n        </span>\n        <button class="btn-remover" data-id="${t.id}">×</button>\n      </div>\n    `).join("")\n  }\n  \n  atualizarResumo()\n}' },
        { type: 'h2', text: 'Adicionar e remover' },
        { type: 'code', lang: 'JavaScript', raw: 'const form = document.getElementById("form-transacao")\n\nform.addEventListener("submit", function(e) {\n  e.preventDefault()\n  \n  const descricao  = document.getElementById("descricao").value.trim()\n  const valor      = parseFloat(document.getElementById("valor").value)\n  const tipo       = document.getElementById("tipo").value\n  const categoria  = document.getElementById("categoria").value\n  \n  if (!descricao || isNaN(valor) || valor <= 0) return\n  \n  transacoes.unshift({\n    id: Date.now(),\n    descricao, valor, tipo, categoria,\n    data: new Date().toLocaleDateString("pt-BR")\n  })\n  \n  salvar()\n  render()\n  form.reset()\n})\n\n// Remover via delegação\ndocument.getElementById("lista-transacoes").addEventListener("click", function(e) {\n  if (e.target.classList.contains("btn-remover")) {\n    const id = Number(e.target.dataset.id)\n    transacoes = transacoes.filter(t => t.id !== id)\n    salvar()\n    render()\n  }\n})\n\nfunction salvar() {\n  localStorage.setItem("financas", JSON.stringify(transacoes))\n}\n\n// Iniciar\nrender()' },
        { type: 'exercise',
          title: 'Construa o dashboard financeiro',
          desc: 'Monte o projeto completo. É o maior do módulo — reserve tempo para isso.',
          steps: [
            'Monte o HTML com formulário (campos: descrição, valor, tipo, categoria), área de resumo e lista',
            'Implemente o JavaScript completo: adicionar, remover, calcular, renderizar',
            'Garanta a persistência no localStorage',
            'Adicione pelo menos um filtro (por tipo ou categoria)',
            'Bonus: adicione um gráfico de pizza simples por categoria usando CSS gradients ou a biblioteca Chart.js via CDN'
          ],
          solution: '// Projeto completo baseado no código acima.\n// Bonus — resumo por categoria:\nfunction resumoPorCategoria() {\n  const categorias = {}\n  \n  transacoes\n    .filter(t => t.tipo === "saida")\n    .forEach(t => {\n      categorias[t.categoria] = (categorias[t.categoria] || 0) + t.valor\n    })\n  \n  const lista = document.getElementById("resumo-categorias")\n  lista.innerHTML = Object.entries(categorias)\n    .sort((a, b) => b[1] - a[1])\n    .map(([cat, val]) => `\n      <div class="cat-item">\n        <span>${cat}</span>\n        <span>${formatarMoeda(val)}</span>\n      </div>\n    `).join("")\n}' },
      ]
    },

  ]
})()
