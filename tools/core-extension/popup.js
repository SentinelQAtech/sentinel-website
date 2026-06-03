'use strict';

// ─── DOM helpers ──────────────────────────────────────────────

const $ = id => document.getElementById(id);

// ─── Page routing ─────────────────────────────────────────────

let currentPage = null;
let deepImportCancelled = false;

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
  const dot     = $('page-dot');
  const status  = $('page-status-text');
  const btn     = $('btn-sync');
  const deepBtn = $('btn-deep-sync');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const isJira  = /atlassian\.net|jira\.com/.test(tab.url ?? '');
    const isBoard = /\/jira\/software\/.+\/board|\/secure\/RapidBoard/.test(tab.url ?? '');

    if (!isJira) {
      dot.className = 'dot dot-gray';
      status.textContent = 'Não é uma página Jira';
      btn.disabled = true;
      deepBtn.disabled = true;
      $('btn-sync-label').textContent = 'Abra um board Jira primeiro';
      $('btn-deep-sync-label').textContent = 'Abra um board Jira primeiro';
      return;
    }

    if (!isBoard) {
      dot.className = 'dot dot-yellow';
      status.textContent = tab.title?.substring(0, 40) ?? 'Página Jira — abra um board';
      btn.disabled = true;
      deepBtn.disabled = true;
      $('btn-sync-label').textContent = 'Navegue até o board Jira';
      $('btn-deep-sync-label').textContent = 'Navegue até o board Jira';
      return;
    }

    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
      dot.className = 'dot dot-green';
      status.textContent = tab.title?.substring(0, 40) ?? 'Board Jira detectado';
      btn.disabled = false;
      deepBtn.disabled = false;
      $('btn-sync-label').textContent = 'Sincronizar cards QA';
      $('btn-deep-sync-label').textContent = 'Import profundo';
    } catch {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js'],
      });
      dot.className = 'dot dot-green';
      status.textContent = tab.title?.substring(0, 40) ?? 'Board pronto';
      btn.disabled = false;
      deepBtn.disabled = false;
      $('btn-sync-label').textContent = 'Sincronizar cards QA';
      $('btn-deep-sync-label').textContent = 'Import profundo';
    }
  } catch {
    dot.className = 'dot dot-gray';
    status.textContent = 'Erro ao verificar página';
    btn.disabled = true;
    deepBtn.disabled = true;
  }
}

// ─── Sync logic ───────────────────────────────────────────────

async function extractBoardCards() {
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

  return extraction.cards ?? [];
}

async function deliverCards(cards, sentinelUrl, syncToken) {
  await chrome.storage.local.set({ sentinelPendingCards: cards });

  if (!sentinelUrl) return;

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

function setSyncButtonsDisabled(disabled) {
  $('btn-sync').disabled = disabled;
  $('btn-deep-sync').disabled = disabled;
}

async function syncQACards() {
  const btn     = $('btn-sync');
  const spinner = document.createElement('span');
  spinner.className = 'spinner';

  setSyncButtonsDisabled(true);
  btn.innerHTML = '';
  btn.appendChild(spinner);
  btn.appendChild(document.createTextNode(' Capturando cards...'));

  try {
    // Always load fresh from storage to avoid stale-closure issues
    const { sentinelUrl, syncToken } = await loadSettings();

    const cards = await extractBoardCards();

    if (!cards || cards.length === 0) {
      showResult({
        success: false,
        count: 0,
        message: 'Nenhum card QA encontrado neste board.\nVerifique se há colunas "Ready QA" ou "Testing QA" visíveis.',
      });
      return;
    }

    if (sentinelUrl) btn.childNodes[1].textContent = ` Enviando ${cards.length} cards...`;
    await deliverCards(cards, sentinelUrl, syncToken);

    showResult({
      success: true,
      count: cards.length,
      message: `${cards.length} cards capturados e prontos para importação.\nAbra o QA Importer para carregá-los.`,
    });

  } catch (err) {
    showResult({ success: false, count: 0, message: err.message });
  } finally {
    setSyncButtonsDisabled(false);
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/>
        <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>
      </svg>
      <span id="btn-sync-label">Sincronizar cards QA</span>`;
  }
}

// ─── Deep import (read-only) ──────────────────────────────────

function updateDeepProgress(done, total, detail) {
  $('deep-progress').classList.remove('hidden');
  $('deep-progress-count').textContent = `${done}/${total}`;
  $('deep-progress-detail').textContent = detail;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  $('deep-progress-fill').style.width = `${pct}%`;
}

function waitForTabComplete(tabId, timeoutMs = 25000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error('Timeout ao carregar issue.'));
    }, timeoutMs);

    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId !== tabId || changeInfo.status !== 'complete') return;
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    };

    chrome.tabs.onUpdated.addListener(listener);
  });
}

async function enrichCardReadOnly(card) {
  if (!card.link) return { ...card, importDepth: 'deep', deepImportError: 'Card sem link Jira.' };

  let tab;
  try {
    tab = await chrome.tabs.create({ url: card.link, active: false });
    await waitForTabComplete(tab.id);
    await new Promise(r => setTimeout(r, 900));

    const injected = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['issue-extractor.js'],
    });
    const details = injected?.[0]?.result ?? {};

    return {
      ...card,
      ...details,
      title: card.title && card.title !== card.issueKey ? card.title : (details.title || card.title),
      issueKey: card.issueKey || details.issueKey || '',
      importDepth: 'deep',
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      ...card,
      importDepth: 'deep',
      lastSyncedAt: new Date().toISOString(),
      deepImportError: err.message,
    };
  } finally {
    if (tab?.id) {
      try { await chrome.tabs.remove(tab.id); } catch { /* tab already closed */ }
    }
  }
}

async function deepSyncQACards() {
  const btn = $('btn-deep-sync');
  const spinner = document.createElement('span');
  spinner.className = 'spinner';

  deepImportCancelled = false;
  setSyncButtonsDisabled(true);
  btn.innerHTML = '';
  btn.appendChild(spinner);
  btn.appendChild(document.createTextNode(' Preparando import profundo...'));
  updateDeepProgress(0, 0, 'Lendo cards visíveis no board. Nenhuma alteração será feita no Jira.');

  try {
    const { sentinelUrl, syncToken } = await loadSettings();
    const cards = await extractBoardCards();

    if (!cards || cards.length === 0) {
      showResult({
        success: false,
        count: 0,
        message: 'Nenhum card QA encontrado neste board.',
      });
      return;
    }

    const enriched = [];
    for (let i = 0; i < cards.length; i++) {
      if (deepImportCancelled) throw new Error('Import profundo cancelado.');

      const card = cards[i];
      const label = card.issueKey || card.title || `card ${i + 1}`;
      updateDeepProgress(i, cards.length, `Abrindo leitura read-only de ${label}...`);
      const enrichedCard = await enrichCardReadOnly(card);
      enriched.push(enrichedCard);
      updateDeepProgress(i + 1, cards.length, `${label} enriquecido.`);
      await new Promise(r => setTimeout(r, 350));
    }

    updateDeepProgress(cards.length, cards.length, `Enviando ${enriched.length} cards enriquecidos para o Sentinel...`);
    await deliverCards(enriched, sentinelUrl, syncToken);

    showResult({
      success: true,
      count: enriched.length,
      message: `${enriched.length} cards capturados com import profundo.\nDescrição, comentários e links visíveis foram exportados sem alterar o Jira.`,
    });
  } catch (err) {
    showResult({ success: false, count: 0, message: err.message });
  } finally {
    setSyncButtonsDisabled(false);
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>
      </svg>
      <span id="btn-deep-sync-label">Import profundo</span>`;
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
  $('btn-deep-sync').addEventListener('click', deepSyncQACards);
  $('btn-cancel-deep').addEventListener('click', () => {
    deepImportCancelled = true;
    $('deep-progress-detail').textContent = 'Cancelando após o card atual...';
  });

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
