/* =====================================================================
   PapaData – Service Worker v7 (offline + SWR + preload + fallbacks)
   Enhanced for version 2025‑11‑14: caches new WebP assets, animated
   logo, playground shortcut and light icon. Preloads key assets for
   faster first paint and shows a custom offline page when HTML
   navigation fails. The Service Worker updates immediately thanks to
   skipWaiting() and cleans up old caches on activation.
   ===================================================================== */

const SW_VERSION = 'v7';
const CACHE_PREFIX = 'papadata-cache';
const CACHE_NAME = `${CACHE_PREFIX}-${SW_VERSION}`;
const ORIGIN = self.location.origin;

// bump this on deploy to bust the cache
const ASSET_VERSION = 'ppd-2025-11-14-1';

/** Static assets to pre-cache (same-origin). */
const ASSETS = [
  'index.html',
  `style.css?v=${ASSET_VERSION}`,
  `js/script.js?v=${ASSET_VERSION}`,
  `manifest.json?v=${ASSET_VERSION}`,
  // core imagery (WebP)
  'images/Grafika_1.webp',
  'images/Grafika_2.webp',
  'images/Grafika_3.webp',
  'images/Grafika_4.webp',
  'images/Grafika_5.webp',
  'images/logo-animated.svg',
  // icons
  'images/icons/papadata-192.png',
  'images/icons/papadata-256.png',
  'images/icons/papadata-384.png',
  'images/icons/papadata-512.png',
  'images/icons/papadata-maskable.png',
  'images/icons/papadata-light-512.png',
  'images/icons/shortcut-services.png',
  'images/icons/shortcut-integrations.png',
  'images/icons/shortcut-contact.png',
  'images/icons/shortcut-playground.png',
  // screenshots (for PWA metadata)
  'images/screenshots/home-dark.png',
  'images/screenshots/services.png'
];

/** Files that may ignore query strings when matching in cache. */
const IGNORE_QUERY_FOR = new Set([
  '/style.css',
  '/js/script.js',
  '/manifest.json'
]);

/** Minimal placeholder SVG for offline images. */
const OFFLINE_IMG_SVG =
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%230A0F1C'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%231BA6F2' font-family='system-ui,Arial' font-size='18'>Offline image</text></svg>`;

/** Simple fallback HTML when index is unavailable. */
function offlineHtml() {
  const html = `
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PapaData – Offline</title>
<style>
  body{margin:0;display:grid;place-items:center;height:100vh;background:#0A0F1C;color:#EAF6FF;font-family:system-ui,Segoe UI,Roboto,Arial}
  .card{max-width:640px;padding:24px;border-radius:14px;background:#111b2c;box-shadow:0 6px 24px rgba(0,0,0,.35);text-align:center}
  h1{margin:0 0 8px;font-size:22px}
  p{opacity:.85}
  a{color:#1BA6F2}
  button{margin-top:12px;background:linear-gradient(90deg,#1BA6F2,#6F6FF2);color:#fff;border:none;border-radius:10px;padding:.7rem 1rem;cursor:pointer}
</style>
<div class="card">
  <h1>Jesteś offline</h1>
  <p>Nie udało się pobrać strony. Spróbuj ponownie, gdy odzyskasz połączenie.</p>
  <button onclick="location.reload()">Odśwież</button>
</div>`;
  return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

/* ----------------------------- Utils ----------------------------- */

/** Normalize request to a cache key (strip query for known files). */
function cacheKeyFor(request) {
  try {
    const url = new URL(request.url);
    if (url.origin !== ORIGIN) return request; // only cache same-origin
    if (IGNORE_QUERY_FOR.has(url.pathname)) {
      // drop query → key without ?v=...
      return new Request(url.origin + url.pathname, {
        method: request.method,
        headers: request.headers,
        mode: request.mode,
        credentials: request.credentials,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        cache: request.cache
      });
    }
  } catch {}
  return request;
}

/** Whether the request is for navigation (HTML). */
function isHtmlRequest(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}

/** Quick check if the request is for an image. */
function isImageRequest(req) {
  const dest = req.destination;
  if (dest === 'image') return true;
  const url = new URL(req.url);
  return /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url.pathname);
}

/* ----------------------------- Install ----------------------------- */

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS);
    } catch (e) {
      // silent – offline first install, no panic
    }
  })());
});

/* ----------------------------- Activate ----------------------------- */

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // remove old caches with this prefix
    const names = await caches.keys();
    await Promise.all(
      names.map((name) =>
        name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
          ? caches.delete(name)
          : Promise.resolve()
      )
    );
    // enable Navigation Preload when available
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch {}
    }
    await self.clients.claim();
  })());
});

/* ----------------------------- Messaging ----------------------------- */

self.addEventListener('message', (event) => {
  const { type } = event.data || {};
  if (type === 'SKIP_WAITING') self.skipWaiting();
  if (type === 'CLEAR_CACHE') {
    event.waitUntil((async () => {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    })());
  }
});

/* ----------------------------- Fetch ----------------------------- */

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // only handle GET + same-origin; others go to network
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== ORIGIN) return;
  // HTML navigations – network-first with navigation preload and fallback
  if (isHtmlRequest(req)) {
    event.respondWith((async () => {
      try {
        // use preload response if available
        const preload = await event.preloadResponse;
        const network = preload || await fetch(req, { cache: 'no-store' });
        // update cached index.html in background
        caches.open(CACHE_NAME)
          .then(c => c.put('index.html', network.clone()))
          .catch(() => {});
        return network;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match('index.html')) || offlineHtml();
      }
    })());
    return;
  }
  // Static files (CSS/JS/manifest) – stale-while-revalidate
  if (IGNORE_QUERY_FOR.has(url.pathname) || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.json')) {
    event.respondWith((async () => {
      const key = cacheKeyFor(req);
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(key);
      const fetchAndUpdate = fetch(req).then((res) => {
        if (res && res.ok) cache.put(key, res.clone());
        return res;
      }).catch(() => null);
      // return cache quickly, update in background
      return cached || (await fetchAndUpdate) || cached || new Response('', { status: 504 });
    })());
    return;
  }
  // Images – cache-first with revalidation and SVG fallback
  if (isImageRequest(req)) {
    event.respondWith((async () => {
      const key = cacheKeyFor(req);
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(key);
      if (cached) {
        // revalidate in background
        fetch(req).then((res) => {
          if (res && res.ok) cache.put(key, res.clone());
        }).catch(() => {});
        return cached;
      }
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(key, res.clone());
        return res;
      } catch {
        return fetch(OFFLINE_IMG_SVG);
      }
    })());
    return;
  }
  // default – cache-first, network fallback
  event.respondWith((async () => {
    const key = cacheKeyFor(req);
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(key);
    if (cached) {
      // background refresh
      fetch(req).then((res) => {
        if (res && res.ok) cache.put(key, res.clone());
      }).catch(() => {});
      return cached;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(key, res.clone());
      return res;
    } catch {
      // last resort: maybe match without normalization
      return (await cache.match(req)) || new Response('', { status: 504 });
    }
  })());
});