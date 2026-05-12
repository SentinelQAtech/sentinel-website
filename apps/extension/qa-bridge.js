'use strict';

// Injected into the Sentinel QA Importer page by the background service worker
// whenever pending cards exist in chrome.storage.local.
// Dispatches a CustomEvent that the React component listens to.

(async () => {
  try {
    const { sentinelPendingCards } = await chrome.storage.local.get('sentinelPendingCards');
    const cards = Array.isArray(sentinelPendingCards) ? sentinelPendingCards : [];

    window.dispatchEvent(new CustomEvent('sentinel-qa-sync', {
      detail: { cards, count: cards.length, source: 'extension' },
    }));

    if (cards.length > 0) {
      await chrome.storage.local.remove('sentinelPendingCards');
    }
  } catch (err) {
    console.error('[Sentinel Bridge]', err);
  }
})();
