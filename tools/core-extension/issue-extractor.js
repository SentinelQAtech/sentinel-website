'use strict';

// Read-only Jira issue extractor.
// This script does not click, submit, mutate fields, or call Jira APIs.

const TEXT_LIMIT = 12000;
const COMMENT_LIMIT = 20;
const LINK_LIMIT = 30;

function cleanText(value, limit = TEXT_LIMIT) {
  return (value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .slice(0, limit);
}

/**
 * Convert a DOM element's HTML to structured plain text.
 * Preserves paragraphs, headings, lists (ordered + unordered) and line breaks.
 * Never mutates the original element \u2014 works on a deep clone.
 */
function htmlToText(el, limit = TEXT_LIMIT) {
  if (!el) return '';
  const clone = el.cloneNode(true);

  // <br> \u2192 newline
  clone.querySelectorAll('br').forEach(br => {
    br.replaceWith('\n');
  });

  // Ordered list items: prepend "N. "
  clone.querySelectorAll('ol > li').forEach(li => {
    const parent = li.parentElement;
    const idx = parent ? Array.from(parent.children).indexOf(li) + 1 : 1;
    li.prepend(`\n${idx}. `);
  });

  // Unordered list items: prepend "- "
  clone.querySelectorAll('ul > li').forEach(li => {
    li.prepend('\n- ');
  });

  // Headings: double newline before, single after
  clone.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
    h.prepend('\n\n');
    h.append('\n');
  });

  // Block elements that need a newline before them
  clone.querySelectorAll('p, blockquote, pre, tr').forEach(el => {
    el.prepend('\n');
  });

  return cleanText(clone.textContent || '', limit);
}

function visible(el) {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
}

function uniqueByText(values) {
  const seen = new Set();
  return values.filter(value => {
    const key = typeof value === 'string'
      ? value.toLowerCase()
      : `${value.url || ''}|${value.text || value.body || ''}`.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractIssueKey() {
  const fromUrl = location.href.match(/\/browse\/([A-Z][A-Z0-9]*-\d+)/i);
  if (fromUrl) return fromUrl[1].toUpperCase();
  const fromText = document.body.innerText.match(/\b([A-Z][A-Z0-9]*-\d+)\b/);
  return fromText ? fromText[1].toUpperCase() : '';
}

function extractTitle(issueKey) {
  const selectors = [
    '[data-testid*="summary"]',
    '[data-testid*="issue.views.issue-base.foundation.summary"]',
    'h1',
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = cleanText(el?.textContent || '', 500);
    if (text && text !== issueKey) return text;
  }
  return issueKey;
}

function findFieldByHeading(names) {
  const normalized = names.map(name => name.toLowerCase());
  const candidates = Array.from(document.querySelectorAll('section, div, article')).filter(visible);
  for (const el of candidates) {
    const text = cleanText(el.textContent || '', 5000);
    if (!text) continue;
    const firstLine = text.split('\n')[0].toLowerCase();
    if (normalized.some(name => firstLine === name || firstLine.startsWith(`${name}\n`))) {
      return cleanText(text.replace(/^description\s*/i, '').replace(/^descrição\s*/i, ''));
    }
  }
  return '';
}

function extractDescription() {
  const selectors = [
    '[data-testid*="description"]',
    '[data-testid*="issue.views.field.rich-text.description"]',
    '[aria-label="Description"]',
    '[aria-label="Descrição"]',
  ];
  for (const selector of selectors) {
    const nodes = Array.from(document.querySelectorAll(selector)).filter(visible);
    for (const node of nodes) {
      const text = htmlToText(node);
      if (text && text.length > 20 && !/^description$/i.test(text)) return text;
    }
  }
  return findFieldByHeading(['description', 'descrição']);
}

function extractComments() {
  const selectors = [
    '[data-testid*="comment"]',
    '[aria-label*="Comment"]',
    '[aria-label*="Coment"]',
    '[class*="comment"]',
    '[class*="Comment"]',
  ];
  const comments = [];
  for (const selector of selectors) {
    for (const el of Array.from(document.querySelectorAll(selector)).filter(visible)) {
      const body = htmlToText(el, 4000);
      if (body.length < 8) continue;
      if (/^(add comment|adicionar comentário|comment)$/i.test(body)) continue;
      comments.push({ body });
    }
  }
  return uniqueByText(comments).slice(0, COMMENT_LIMIT);
}

function classifyLink(url, text) {
  const combined = `${url} ${text}`.toLowerCase();
  if (
    combined.includes('github.com') ||
    combined.includes('bitbucket') ||
    combined.includes('gitlab') ||
    combined.includes('pull request') ||
    combined.includes('merge request') ||
    /\bpr[-\s#]?\d+\b/i.test(combined)
  ) return 'pr';
  return 'external';
}

function extractLinks() {
  const links = Array.from(document.querySelectorAll('a[href]'))
    .filter(visible)
    .map(a => ({
      url: a.href,
      text: cleanText(a.textContent || a.getAttribute('aria-label') || a.href, 300),
    }))
    .filter(link => {
      if (!link.url || link.url.startsWith('javascript:')) return false;
      if (link.url.includes('/browse/') && link.url.includes(extractIssueKey())) return false;
      return /^https?:\/\//i.test(link.url);
    });

  const unique = uniqueByText(links).slice(0, LINK_LIMIT);
  return {
    pullRequests: unique.filter(link => classifyLink(link.url, link.text) === 'pr'),
    externalLinks: unique.filter(link => classifyLink(link.url, link.text) !== 'pr'),
  };
}

function extractIssueDetails() {
  const issueKey = extractIssueKey();
  const title = extractTitle(issueKey);
  const description = extractDescription();
  const comments = extractComments();
  const { pullRequests, externalLinks } = extractLinks();

  return {
    issueKey,
    title,
    description,
    comments,
    pullRequests,
    externalLinks,
    lastSyncedAt: new Date().toISOString(),
    importDepth: 'deep',
  };
}

extractIssueDetails();
