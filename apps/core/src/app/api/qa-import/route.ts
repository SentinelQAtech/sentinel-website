import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// Persistent queue backed by Supabase.
// Requires a `qa_sync_queue` table — run this once in Supabase:
//
//   create table if not exists qa_sync_queue (
//     id bigint generated always as identity primary key,
//     item jsonb not null,
//     source text default 'extension',
//     received_at timestamptz default now()
//   );
//   alter table qa_sync_queue disable row level security;
// ─────────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

// ─── Token guard ─────────────────────────────────────────────

function authorized(req: NextRequest): boolean {
  const envToken = process.env.QA_SYNC_TOKEN
  if (!envToken) return true
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

  const items = Array.isArray(body?.items) ? body.items.slice(0, 100) : []
  if (items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400, headers: CORS })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503, headers: CORS })
  }

  const rows = items.map(item => ({
    item:   item,
    source: body.source ?? 'extension',
  }))

  const { error } = await supabase.from('qa_sync_queue').insert(rows)

  if (error) {
    console.error('[QA Import POST]', error)
    return NextResponse.json({ error: 'Failed to store items' }, { status: 500, headers: CORS })
  }

  return NextResponse.json(
    { success: true, received: rows.length },
    { headers: CORS }
  )
}

// ─── GET /api/qa-import ──────────────────────────────────────
// Called by the Sentinel QA Importer page to pull pending items.
// Items are consumed (deleted) after being read.

export async function GET(_req: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ items: [], count: 0, error: 'Storage not configured' }, { headers: CORS })
  }

  const { data, error } = await supabase
    .from('qa_sync_queue')
    .select('id, item, source, received_at')
    .order('received_at', { ascending: true })
    .limit(300)

  if (error) {
    console.error('[QA Import GET]', error)
    return NextResponse.json({ error: 'Failed to read queue' }, { status: 500, headers: CORS })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ items: [], count: 0 }, { headers: CORS })
  }

  // Delete consumed rows
  const ids = data.map(r => r.id)
  await supabase.from('qa_sync_queue').delete().in('id', ids)

  const items = data.map(r => ({ ...r.item, source: r.source, receivedAt: r.received_at }))

  return NextResponse.json(
    { items, count: items.length },
    { headers: CORS }
  )
}
