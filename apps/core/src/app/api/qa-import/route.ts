import { NextRequest, NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────
// In-memory store for extension-submitted QA items.
//
// ✅ Works for self-hosted (Node.js persistent server).
// ⚠️  For Vercel (serverless), replace with:
//     import { kv } from '@vercel/kv'
//     or any Redis / database client.
// ─────────────────────────────────────────────────────────────

const g = globalThis as typeof globalThis & {
  _sentinelQAPending?: object[]
}

function store(): object[] {
  if (!g._sentinelQAPending) g._sentinelQAPending = []
  return g._sentinelQAPending
}

// ─── Token guard ─────────────────────────────────────────────
// Set QA_SYNC_TOKEN in your .env to require a token.
// Leave unset for open access (use behind auth middleware).

function authorized(req: NextRequest): boolean {
  const envToken = process.env.QA_SYNC_TOKEN
  if (!envToken) return true  // No token configured → open
  const header = req.headers.get('x-sync-token')
  const param  = req.nextUrl.searchParams.get('token')
  return header === envToken || param === envToken
}

// ─── CORS (Chrome Extension calls from chrome-extension:// origin)

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-sync-token',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

// ─── POST /api/qa-import ─────────────────────────────────────
// Called by the Chrome Extension after capturing board cards.

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  }

  let body: { items?: object[]; source?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const items = Array.isArray(body?.items) ? body.items : []
  if (items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400, headers: CORS })
  }

  const pending = store()

  // Stamp each item with receivedAt and source
  const stamped = items.slice(0, 100).map((item: object) => ({
    ...(item as object),
    source:     body.source ?? 'extension',
    receivedAt: new Date().toISOString(),
  }))

  pending.push(...stamped)

  // Keep max 300 items to avoid unbounded memory
  if (pending.length > 300) pending.splice(0, pending.length - 300)

  return NextResponse.json(
    { success: true, received: stamped.length, total: pending.length },
    { headers: CORS }
  )
}

// ─── GET /api/qa-import ──────────────────────────────────────
// Called by the Sentinel QA Importer page to pull pending items.
// Items are consumed (cleared) after being read.

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  }

  const pending = store()
  const items   = [...pending]
  pending.length = 0   // consume + clear

  return NextResponse.json(
    { items, count: items.length },
    { headers: CORS }
  )
}
