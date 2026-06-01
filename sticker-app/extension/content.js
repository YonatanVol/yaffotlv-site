// Runs on tiktok.com. Watches for sticker images loaded from TikTok's sticker
// CDN (the comment-reply sticker drawer) and stores their URLs in session
// storage so the popup can offer them for import.
//
// TikTok sticker assets are served from hostnames matching the pattern
// *-stickers.tiktokcdn.com (e.g. p16-stickers.tiktokcdn.com).
// We only collect those URLs — other TikTok CDN images are ignored.

const STICKER_CDN = /[\w-]+-stickers\.tiktokcdn\.com/;

// Deduplicated set of sticker URLs found during this page session.
const seen = new Set();

function harvest() {
  let added = 0;
  for (const img of document.querySelectorAll("img")) {
    const src = img.src;
    if (src && STICKER_CDN.test(src) && !seen.has(src)) {
      seen.add(src);
      added++;
    }
  }
  if (added > 0) {
    chrome.storage.session.set({ stickers: [...seen], ts: Date.now() });
  }
}

// Harvest whenever new DOM nodes appear (covers lazy-loaded sticker drawers).
new MutationObserver(harvest).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// Also harvest on src attribute changes.
new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === "attributes" && m.attributeName === "src") {
      harvest();
    }
  }
}).observe(document.documentElement, {
  attributes: true,
  subtree: true,
  attributeFilter: ["src"],
});

harvest();
