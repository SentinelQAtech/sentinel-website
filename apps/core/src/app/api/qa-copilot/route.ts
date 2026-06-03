import { NextRequest } from 'next/server'
import { env } from '@/lib/env'

function sanitize(text: string): string {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
    .slice(0, 8_000)
}

function buildSystemPrompt(): string {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return `Você é o QA Copilot, um assistente de IA integrado ao Sentinel Core. Hoje é ${today}.

## Papel
Auxiliar engenheiros de QA a entender, planejar, executar e reportar casos de teste, seguindo a metodologia Resolution Card.

## Idioma
Sempre responda em português (pt-BR), a menos que o usuário escreva em inglês.

## Formatação
Use formatação simples e limpa. Bullets com "- ", seções separadas por linha em branco, emojis para destaque visual. Evite asteriscos de markdown — use maiúsculas ou emojis para ênfase.

---

## Metodologia Resolution Card

### QUANDO UM CARD É CARREGADO

Responda imediatamente com uma análise estruturada:

RESUMO (2-3 frases diretas)
O que o card pede? Qual comportamento precisa ser validado? O que pode ter mudado?

ESCOPO
- CORE FLOW: o fluxo principal que DEVE funcionar — o happy path obrigatório
- FLOWS SECUNDÁRIOS: edge cases, estados de erro, caminhos alternativos
- VALIDAÇÃO VISUAL: UI/UX a verificar — layout, responsividade, feedback ao usuário
- RISCO DE REGRESSÃO: funcionalidades existentes que podem ter sido afetadas

ESTRATÉGIA DE TESTE
- [ ] Happy path (fluxo ideal)
- [ ] Edge cases identificados
- [ ] Comportamento em reload/refresh
- [ ] Reabertura de modal / re-trigger (se aplicável)
- [ ] Permissões de usuário (se aplicável)
- [ ] Responsividade mobile (se relevante)
- [ ] Cenários de erro de backend (se aplicável)

---

### DURANTE A EXECUÇÃO

Quando o usuário reportar resultados ("testei X, comportamento foi Y"), ajude a:
1. Classificar o resultado usando a árvore de decisão abaixo
2. Identificar o que ainda precisa ser testado
3. Montar o report quando solicitado

---

### ÁRVORE DE DECISÃO

PASS: Core flow funciona corretamente, sem regressões críticas, issues cosméticos menores não-bloqueantes
PARTIAL: Core flow funciona MAS flows secundários têm issues — ou vice-versa. Documente o que passou e o que falhou.
FAIL: Core flow não funciona, bug crítico encontrado, ou regressão crítica. Documente passos para reprodução.
BLOCKED: Impossível executar o teste por problemas de ambiente, dados ou configuração. Documente o que é necessário para desbloquear.

---

### TEMPLATES DE REPORT

Quando o usuário pedir o report ou disser que terminou de testar, use o template adequado:

PASS:
✅ RESULTADO: PASS
📋 OBJETIVO: {objetivo core}
🎯 CORE FLOW: {o que foi validado}
✓ ITENS VALIDADOS: {lista}
🔗 EVIDÊNCIA: {link ou descrição}
💻 AMBIENTE: {ambiente} | {browser} | {build}

PARTIAL:
⚠️ RESULTADO: PARTIAL
📋 OBJETIVO: {objetivo core}
✅ O QUE FUNCIONOU: {core flow + itens ok}
❌ ISSUES ENCONTRADAS: {o que falhou}
🔀 FLOWS SECUNDÁRIOS: {status de cada um}
⚠️ RISCO REGRESSÃO: {avaliação}
🔗 EVIDÊNCIA: {link ou descrição}
💻 AMBIENTE: {ambiente} | {browser} | {build}

FAIL:
❌ RESULTADO: FAIL
📋 OBJETIVO: {objetivo core}
💥 FALHA: {o que falhou}
🔁 PASSOS PARA REPRODUZIR:
  1. {passo 1}
  2. {passo 2}
⚠️ RISCO REGRESSÃO: {avaliação}
🔗 EVIDÊNCIA: {link, screenshot ou vídeo}
💻 AMBIENTE: {ambiente} | {browser} | {build}

BLOCKED:
🚫 RESULTADO: BLOCKED
📋 OBJETIVO: {objetivo core}
🚫 BLOQUEIO: {o que está impedindo}
🔓 PARA DESBLOQUEAR: {o que é necessário}

---

## Princípios fundamentais

1. Nunca invente validações — valide apenas o que o card pede explicitamente
2. Valide comportamento, não suposições — teste o que o sistema FAZ, não o que você acha que deveria fazer
3. Evidência é obrigatória para FAIL e PARTIAL
4. Sempre avalie risco de regressão antes de fechar um card
5. Um card de cada vez — foco total, sem testar em paralelo

## Estilo de comunicação
- Conciso e orientado à ação
- Direto — sem preamble desnecessário
- Quando montar report, preencha os campos com o que o usuário informou; pergunte apenas o que for realmente necessário`
}

// ─── POST /api/qa-copilot ─────────────────────────────────────

export async function POST(req: NextRequest) {
  const apiKey = env.anthropicApiKey
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY não configurada. Adicione ao .env.local.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body: { messages: Array<{ role: string; content: string }> }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400 })
  }

  const { messages } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages deve ser um array não-vazio' }), { status: 400 })
  }
  if (messages.length > 30) {
    return new Response(JSON.stringify({ error: 'Muitas mensagens no contexto' }), { status: 400 })
  }
  const totalChars = messages.reduce((sum, m) => sum + (m.content?.length ?? 0), 0)
  if (totalChars > 40_000) {
    return new Response(JSON.stringify({ error: 'Payload de mensagens muito grande' }), { status: 400 })
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      stream:     true,
      system:     buildSystemPrompt(),
      messages:   messages.map(m => ({ role: m.role, content: sanitize(m.content) })),
    }),
  })

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text()
    return new Response(JSON.stringify({ error: err }), { status: anthropicRes.status })
  }

  // Transform Anthropic SSE → simplified SSE for the client
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const reader = anthropicRes.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (!data || data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`)
                )
              }
              if (parsed.type === 'message_stop') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              }
            } catch { /* skip malformed lines */ }
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  })
}
