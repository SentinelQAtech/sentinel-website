'use strict';

// ─── QA column detection ─────────────────────────────────────
const QA_COLUMNS_EXACT = ['ready qa', 'testing qa'];

function isQAColumn(title) {
  const t = (title || '').toLowerCase().trim();
  return QA_COLUMNS_EXACT.some(k => t.includes(k));
}

// ─── Priority extraction ──────────────────────────────────────

function extractPriority(cardEl) {
  const candidates = cardEl.querySelectorAll('[data-testid*="priority"], img[alt], svg[aria-label]');
  for (const el of candidates) {
    const text = (el.getAttribute('alt') || el.getAttribute('aria-label') || el.getAttribute('title') || '').toLowerCase();
    if (!text) continue;
    if (text.includes('critical') || text.includes('blocker'))  return 'Critical';
    if (text.includes('high')     || text.includes('major'))    return 'High';
    if (text.includes('medium')   || text.includes('normal'))   return 'Medium';
    if (text.includes('low')      || text.includes('minor'))    return 'Low';
  }
  return 'Unknown';
}

// ─── Issue key extraction ─────────────────────────────────────

function extractIssueKey(cardEl) {
  const links = cardEl.querySelectorAll('a[href*="/browse/"]');
  for (const a of links) {
    const m = a.href.match(/\/browse\/([A-Z][A-Z0-9]*-\d+)/i);
    if (m) return m[1].toUpperCase();
    const text = (a.textContent || '').trim();
    if (/^[A-Z][A-Z0-9]*-\d+$/i.test(text)) return text.toUpperCase();
  }
  const all = cardEl.querySelectorAll('span, a, div, p');
  for (const el of all) {
    const text = (el.textContent || '').trim();
    if (/^[A-Z][A-Z0-9]*-\d+$/.test(text)) return text;
  }
  return '';
}

// ─── Title extraction ─────────────────────────────────────────

function extractTitle(cardEl, issueKey) {
  const summaryEl = cardEl.querySelector(
    '[data-testid*="summary"], [data-testid*="title"], [class*="Summary"], [class*="summary"]'
  );
  if (summaryEl) {
    const text = summaryEl.textContent?.trim();
    if (text && text !== issueKey && text.length > 3) return text;
  }
  const clone = cardEl.cloneNode(true);
  clone.querySelectorAll([
    'a[href*="/browse/"]', 'svg', 'img',
    '[class*="avatar"]', '[class*="Avatar"]',
    '[class*="badge"]', '[class*="time"]',
    '[class*="estimate"]', '[data-testid*="priority"]',
  ].join(', ')).forEach(el => el.remove());
  return (clone.textContent?.replace(/\s+/g, ' ').trim() ?? '').substring(0, 150).trim();
}

// ─── Label/Epic extraction ────────────────────────────────────

function extractLabels(cardEl) {
  return Array.from(cardEl.querySelectorAll(
    '[class*="tag"], [class*="Tag"], [class*="label"], [class*="Label"], [class*="epic"], [class*="Epic"], [class*="lozenge"]'
  ))
    .map(el => el.textContent?.trim())
    .filter(t => t && t.length > 0 && t.length < 80);
}

// ─── Assignee extraction ──────────────────────────────────────

function extractAssignee(cardEl) {
  const img = cardEl.querySelector('[class*="avatar"] img, [class*="Avatar"] img');
  if (img) return img.getAttribute('alt') || img.getAttribute('aria-label') || '';
  return cardEl.querySelector('[class*="avatar"], [class*="Avatar"]')?.textContent?.trim() ?? '';
}

// ─── Sprint detection ─────────────────────────────────────────

function detectSprintFromPage() {
  const bc = document.querySelector('[class*="breadcrumb"], nav');
  if (bc) {
    const m = (bc.textContent ?? '').match(/Sprint\s+\d+/i);
    if (m) return m[0];
  }
  return '';
}

// ─── QA category from column name ────────────────────────────

function columnToCategory(status) {
  const s = status.toLowerCase();
  if (s.includes('ready'))   return 'Ready for QA';
  if (s.includes('testing') || s.includes('in test') || s.includes('in qa')) return 'In Testing';
  if (s.includes('review'))  return 'Review';
  if (s.includes('blocked')) return 'Blocked';
  if (s.includes('done'))    return 'Done';
  return 'Other';
}

// ─── Card boundary detection ──────────────────────────────────
// Walks UP from a browse link to find the smallest ancestor that
// contains only that one issue key (= the card element).

function findCardBoundary(link) {
  let el = link.parentElement;
  for (let depth = 0; depth < 15 && el; depth++) {
    const parent = el.parentElement;
    if (!parent || parent === document.body) break;
    const keysInParent = new Set(
      Array.from(parent.querySelectorAll('a[href*="/browse/"]'))
        .map(a => { const m = a.href.match(/\/browse\/([A-Z][A-Z0-9]*-\d+)/i); return m?.[1]?.toUpperCase(); })
        .filter(Boolean)
    );
    if (keysInParent.size > 1) break; // parent contains multiple cards → el is the card
    el = parent;
  }
  return el ?? link;
}

// ─── QA header elements ───────────────────────────────────────
// Returns the most specific DOM elements whose text matches a QA
// column name. Sticky headers stay visible during board scroll.

function findQAHeaderElements() {
  const candidates = Array.from(document.querySelectorAll('*')).filter(el => {
    if (el.children.length > 8) return false;
    const text = (el.textContent || '').trim();
    return text.length > 0 && text.length < 80 && isQAColumn(text);
  });
  // Keep innermost: remove elements that contain another candidate
  return candidates.filter(el =>
    !candidates.some(other => other !== el && el.contains(other))
  );
}

// ─── Board scroll container ───────────────────────────────────

function findBoardScrollContainer(headerEl) {
  let el = headerEl.parentElement;
  for (let i = 0; i < 20 && el && el !== document.body; i++) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay')
        && el.scrollHeight > el.clientHeight + 20) {
      return el;
    }
    el = el.parentElement;
  }
  return document.scrollingElement || document.documentElement;
}

// ─── Main extractor ───────────────────────────────────────────
// Uses spatial alignment: QA column headers (sticky) stay fixed at
// the same X position. Browse links horizontally aligned with a QA
// header belong to that column — regardless of DOM structure.
// Scrolls the board incrementally from top to bottom, collecting
// newly visible cards at each position.

async function extractQACards() {
  const sprint  = detectSprintFromPage();
  const results = new Map(); // issueKey → result (deduplication)

  // ── Phase 1: Find QA column headers ──────────────────────────
  const rawHeaders = findQAHeaderElements();

  // Keep only visible headers (sticky headers always have a rect)
  const qaHeaders = rawHeaders.map(el => {
    const rect = el.getBoundingClientRect();
    const columnTitle = (el.textContent || '').trim().replace(/\s*\d+\s*$/, '').trim();
    return { el, columnTitle, rect };
  }).filter(h => h.rect.width > 0 && isQAColumn(h.columnTitle));

  // Deduplicate by column title (keep first occurrence)
  const seenTitles = new Set();
  const uniqueHeaders = qaHeaders.filter(h => {
    if (seenTitles.has(h.columnTitle.toLowerCase())) return false;
    seenTitles.add(h.columnTitle.toLowerCase());
    return true;
  });

  console.log(`[Sentinel] QA headers: ${uniqueHeaders.map(h => `"${h.columnTitle}" x=[${Math.round(h.rect.left)}-${Math.round(h.rect.right)}]`).join(', ')}`);

  if (uniqueHeaders.length === 0) {
    console.log('[Sentinel] No visible QA headers — aborting');
    return [];
  }

  // ── Phase 2: Find board scroll container ─────────────────────
  const boardScroll = findBoardScrollContainer(uniqueHeaders[0].el);
  const origTop     = boardScroll.scrollTop;
  console.log(`[Sentinel] Board scroll: scrollHeight=${boardScroll.scrollHeight} clientHeight=${boardScroll.clientHeight}`);

  // ── Phase 3: Scroll from top, collect cards at each step ─────
  boardScroll.scrollTop = 0;
  boardScroll.dispatchEvent(new Event('scroll', { bubbles: true }));
  await new Promise(r => setTimeout(r, 400));

  const MAX_STEPS   = 30;
  let   prevScrollTop = -1;

  for (let step = 0; step < MAX_STEPS; step++) {
    // Update header rects (sticky headers: X stays fixed; refresh in case of layout change)
    uniqueHeaders.forEach(h => { h.rect = h.el.getBoundingClientRect(); });

    // Collect all browse links currently in the DOM
    const allLinks = Array.from(document.querySelectorAll('a[href*="/browse/"]'));

    for (const header of uniqueHeaders) {
      const { columnTitle, rect: hr } = header;
      if (hr.width === 0) continue;

      allLinks.forEach(link => {
        const m = link.href.match(/\/browse\/([A-Z][A-Z0-9]*-\d+)/i);
        if (!m) return;
        const key = m[1].toUpperCase();
        if (results.has(key)) return; // already captured

        // Spatial check: link's horizontal center must fall within header's X range
        const lr       = link.getBoundingClientRect();
        const lCenter  = (lr.left + lr.right) / 2;
        if (lCenter < hr.left || lCenter > hr.right) return;

        // Find card element and extract data
        const card     = findCardBoundary(link);
        const issueKey = key;
        const title    = extractTitle(card, issueKey);

        results.set(key, {
          issueKey,
          title:      title || issueKey,
          status:     columnTitle,
          priority:   extractPriority(card),
          sprint,
          client:     '',
          project:    '',
          assignee:   extractAssignee(card).trim(),
          type:       'QA Testing',
          link:       `${location.origin}/browse/${issueKey}`,
          notes:      extractLabels(card).join(' · ') || '',
          qaCategory: columnToCategory(columnTitle),
          source:     'extension',
        });
      });
    }

    console.log(`[Sentinel] Step ${step + 1}: scrollTop=${boardScroll.scrollTop} collected=${results.size}`);

    // Stop if we can't scroll further
    if (boardScroll.scrollTop === prevScrollTop) break;
    prevScrollTop = boardScroll.scrollTop;

    // Scroll down by ~60% of visible height to stay within the card render window
    const step_px = Math.max(Math.round(boardScroll.clientHeight * 0.6), 150);
    boardScroll.scrollTop += step_px;
    boardScroll.dispatchEvent(new Event('scroll', { bubbles: true }));
    await new Promise(r => setTimeout(r, 350));
  }

  // ── Phase 4: Restore scroll position ─────────────────────────
  boardScroll.scrollTop = origTop;
  boardScroll.dispatchEvent(new Event('scroll', { bubbles: true }));

  console.log(`[Sentinel] Done. Total QA cards: ${results.size}`);
  return [...results.values()];
}

// ─── Message listener ─────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'EXTRACT_QA_CARDS') {
    extractQACards()
      .then(cards => sendResponse({ success: true, cards, pageTitle: document.title }))
      .catch(err  => sendResponse({ success: false, error: err.message, cards: [] }));
    return true;
  }
  if (message.type === 'PING') {
    sendResponse({ alive: true, url: location.href });
    return true;
  }
});
