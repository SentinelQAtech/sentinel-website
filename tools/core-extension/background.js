'use strict';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Sentinel QA Sync] Extension installed v1.1.0');
});

// Keep service worker alive during popup messaging
chrome.runtime.onMessage.addListener((_msg, _sender, sendResponse) => {
  sendResponse({ ok: true });
  return true;
});

// Auto-inject bridge into Sentinel QA Importer pages when pending cards exist.
// This fires when any tab finishes loading — if the URL contains "qa-importer"
// and there are cards stored locally, the bridge is injected to deliver them.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  const url = tab.url ?? '';
  if (!url.includes('qa-importer')) return;

  try {
    const { sentinelPendingCards } = await chrome.storage.local.get('sentinelPendingCards');
    if (!Array.isArray(sentinelPendingCards) || sentinelPendingCards.length === 0) return;

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['qa-bridge.js'],
    });
  } catch (err) {
    console.warn('[Sentinel QA Sync] Bridge injection failed:', err.message);
  }
});
