import { NextRequest } from 'next/server'
import { env } from '@/lib/env'

function sanitize(text: string): string {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
    .slice(0, 8_000)
}

// ─── System prompt ────────────────────────────────────────────

function buildSystemPrompt(context: Record<string, unknown>): string {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return `You are Sentinel AI, the operational intelligence layer of the Sentinel Project Manager.

Today is ${today}.

## Your Role
You are a QA & productivity assistant for a software QA engineer. You understand daily workflow, QA priorities, sprint goals, and help execute the workday more efficiently.

## Behavior
- Be concise, practical, and action-oriented
- Respond in the same language as the user (Portuguese or English)
- Use markdown formatting: lists, **bold**, \`code\`, headers
- Skip unnecessary preamble — get straight to the insight or action
- Think like an operations copilot: prioritize, organize, execute
- Never be generic — always ground answers in the Sentinel context provided

## Current Sentinel Context
${JSON.stringify(context, null, 2)}

## Capabilities
- Analyze QA items, identify priorities, generate test plans
- Summarize Daily tasks and suggest execution order
- Generate test scenarios, regression checklists, bug descriptions
- Identify blockers and sprint risks
- Create meeting summaries and daily reports
- Organize workday by urgency and importance`
}

// ─── POST /api/sentinel-ai ────────────────────────────────────

export async function POST(req: NextRequest) {
  const apiKey = env.anthropicApiKey
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured. Add it to .env.local.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body: { messages: Array<{ role: string; content: string }>; context?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { messages, context = {} } = body

  // ── Input validation ───────────────────────────────────────────
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages must be a non-empty array' }), { status: 400 })
  }
  if (messages.length > 20) {
    return new Response(JSON.stringify({ error: 'Too many messages in context' }), { status: 400 })
  }
  const totalChars = messages.reduce((sum, m) => sum + (m.content?.length ?? 0), 0)
  if (totalChars > 40_000) {
    return new Response(JSON.stringify({ error: 'Message payload too large' }), { status: 400 })
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':          apiKey,
      'anthropic-version':  '2023-06-01',
      'content-type':       'application/json',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      stream:     true,
      system:     buildSystemPrompt(context),
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
