'use strict';

// ─── DOM helpers ──────────────────────────────────────────────

const $ = id => document.getElementById(id);

// ─── Page routing ─────────────────────────────────────────────

let currentPage = null;

function showPage(name) {
  ['settings', 'sync', 'result'].forEach(p => {
    $(`page-${p}`).classList.toggle('hidden', p !== name);
  });
  currentPage = name;
}

// ─── Settings persistence ─────────────────────────────────────

async function loadSettings() {
  return chrome.storage.sync.get({ sentinelUrl: '', syncToken: '' });
}

async function saveSettings(url, token) {
  await chrome.storage.sync.set({ sentinelUrl: url, syncToken: token });
}

// ─── Page detection ───────────────────────────────────────────

async function checkCurrentPage() {
  const dot    = $('page-dot');
  const status = $('page-status-text');
  const btn    = $('btn-sync');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const isJira  = /atlassian\.net|jira\.com/.test(tab.url ?? '');
    const isBoard = /\/jira\/software\/.+\/board|\/secure\/RapidBoard/.test(tab.url ?? '');

    if (!isJira) {
      dot.className = 'dot dot-gray';
      status.textContent = 'Não é uma página Jira';
      btn.disabled = true;
      $('btn-sync-label').textContent = 'Abra um board Jira primeiro';
      return;
    }

    if (!isBoard) {
      dot.className = 'dot dot-yellow';
      status.textContent = tab.title?.substring(0, 40) ?? 'Página Jira — abra um board';
      btn.disabled = true;
      $('btn-sync-label').textContent = 'Navegue até o board Jira';
      return;
    }

    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
      dot.className = 'dot dot-green';
      status.textContent = tab.title?.substring(0, 40) ?? 'Board Jira detectado';
      btn.disabled = false;
      $('btn-sync-label').textContent = 'Sincronizar cards QA';
    } catch {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js'],
      });
      dot.className = 'dot dot-green';
      status.textContent = tab.title?.substring(0, 40) ?? 'Board pronto';
      btn.disabled = false;
      $('btn-sync-label').textContent = 'Sincronizar cards QA';
    }
  } catch {
    dot.className = 'dot dot-gray';
    status.textContent = 'Erro ao verificar página';
    btn.disabled = true;
  }
}

// ─── Sync logic ───────────────────────────────────────────────

async function syncQACards() {
  const btn     = $('btn-sync');
  const spinner = document.createElement('span');
  spinner.className = 'spinner';

  btn.disabled = true;
  btn.innerHTML = '';
  btn.appendChild(spinner);
  btn.appendChild(document.createTextNode(' Capturando cards...'));

  try {
    // Always load fresh from storage to avoid stale-closure issues
    const { sentinelUrl, syncToken } = await loadSettings();

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('Nenhuma aba ativa encontrada.');

    let extraction;
    try {
      extraction = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_QA_CARDS' });
    } catch {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content-script.js'] });
      await new Promise(r => setTimeout(r, 300));
      extraction = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_QA_CARDS' });
    }

    if (!extraction?.success) {
      throw new Error(extraction?.error ?? 'Falha ao extrair cards do board.');
    }

    const { cards } = extraction;

    if (!cards || cards.length === 0) {
      showResult({
        success: false,
        count: 0,
        message: 'Nenhum card QA encontrado neste board.\nVerifique se há colunas "Ready QA" ou "Testing QA" visíveis.',
      });
      return;
    }

    // Store locally first — this is the primary delivery mechanism (serverless-safe)
    await chrome.storage.local.set({ sentinelPendingCards: cards });

    // POST to Sentinel API as secondary (works for local dev; may lose data on Vercel)
    if (sentinelUrl) {
      btn.childNodes[1].textContent = ` Enviando ${cards.length} cards...`;

      const apiUrl  = sentinelUrl.replace(/\/$/, '') + '/api/qa-import';
      const headers = { 'Content-Type': 'application/json' };
      if (syncToken) headers['x-sync-token'] = syncToken;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ items: cards, source: 'extension' }),
        });
        if (!response.ok) console.warn(`[Sentinel] API returned ${response.status}`);
      } catch (fetchErr) {
        console.warn('[Sentinel] API POST failed (cards saved locally):', fetchErr.message);
      }
    }

    showResult({
      success: true,
      count: cards.length,
      message: `${cards.length} cards capturados e prontos para importação.\nAbra o QA Importer para carregá-los.`,
    });

  } catch (err) {
    showResult({ success: false, count: 0, message: err.message });
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/>
        <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>
      </svg>
      <span id="btn-sync-label">Sincronizar cards QA</span>`;
  }
}

// ─── Result display ───────────────────────────────────────────

function showResult({ success, count, message }) {
  const card = $('result-card');
  card.className = `result-card ${success ? 'success' : 'error'}`;
  $('result-icon').textContent  = success ? '✅' : '❌';
  $('result-title').textContent = success ? 'Cards capturados!' : 'Falha na captura';
  $('result-count').textContent = success ? count : '—';
  $('result-count').style.color = success ? '#10b981' : '#ef4444';
  $('result-sub').textContent   = message ?? '';
  showPage('result');
}

// ─── Init ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Always load fresh — never rely on captured closures
  let { sentinelUrl, syncToken } = await loadSettings();

  const refreshDisplayUrl = () => {
    $('display-url').textContent = sentinelUrl || '—';
  };

  // ── Settings page ──
  $('btn-save').addEventListener('click', async () => {
    const url   = $('input-url').value.trim();
    const token = $('input-token').value.trim();
    if (!url) { $('input-url').focus(); return; }
    await saveSettings(url, token);
    sentinelUrl = url;   // update in-scope vars
    syncToken   = token;
    refreshDisplayUrl();
    showPage('sync');
    checkCurrentPage();
  });

  $('btn-cancel-settings').addEventListener('click', () => {
    if (currentPage === 'settings' && sentinelUrl) showPage('sync');
  });

  $('btn-toggle-settings').addEventListener('click', async () => {
    if (currentPage === 'settings') {
      if (sentinelUrl) showPage('sync');
    } else {
      // Load fresh before opening settings
      const fresh = await loadSettings();
      $('input-url').value   = fresh.sentinelUrl;
      $('input-token').value = fresh.syncToken;
      showPage('settings');
    }
  });

  // ── Sync page ──
  $('btn-sync').addEventListener('click', syncQACards);

  // ── Result page ──
  $('btn-open-sentinel').addEventListener('click', async () => {
    const { sentinelUrl: url } = await loadSettings();
    if (url) chrome.tabs.create({ url: url.replace(/\/$/, '') + '/qa-importer' });
  });

  $('btn-sync-again').addEventListener('click', () => {
    showPage('sync');
    checkCurrentPage();
  });

  // ── Initial routing ──
  refreshDisplayUrl();
  if (!sentinelUrl) {
    showPage('settings');
  } else {
    showPage('sync');
    checkCurrentPage();
  }
});
