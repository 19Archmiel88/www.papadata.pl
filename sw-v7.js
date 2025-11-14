/* =====================================================================
   PapaData – Service Worker v7 (offline + SWR + preload + fallbacks)
   ===================================================================== */

const SW_VERSION = 'v7';
const CACHE_PREFIX = 'papadata-cache';
const CACHE_NAME = `${CACHE_PREFIX}-${SW_VERSION}`;
const ORIGIN = self.location.origin;

// uaktualniaj to pole przy deployu, żeby bustować zasoby
const ASSET_VERSION = 'ppd-2025-11-13-1';

/** Statyczne zasoby do pre-cache (same-origin). */
const ASSETS = [
  'index.html',
  `style.css?v=${ASSET_VERSION}`,
  `js/script.js?v=${ASSET_VERSION}`,
  `manifest.json?v=${ASSET_VERSION}`,
  // core imagery
  'images/PapaData.png',
  'images/Grafika_1.png',
  'images/Grafika_2.png',
  'images/Grafika_3.png',
  'images/Grafika_4.png',
  'images/Grafika_5.png',
  // icons
  'images/icons/papadata-192.png',
  'images/icons/papadata-256.png',
  'images/icons/papadata-384.png',
  'images/icons/papadata-512.png',
  'images/icons/papadata-maskable.png',
  'images/icons/shortcut-services.png',
  'images/icons/shortcut-integrations.png',
  'images/icons/shortcut-contact.png',
  // screenshots (for PWA metadata)
  'images/screenshots/home-dark.png',
  'images/screenshots/services.png'
];

/** Którym plikom wolno ignorować query przy dopasowaniu w cache. */
const IGNORE_QUERY_FOR = new Set([
  '/style.css',
  '/js/script.js',
  '/manifest.json'
]);

/** Minimalny placeholder SVG dla obrazów offline. */
const OFFLINE_IMG_SVG =
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%230A0F1C'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%231BA6F2' font-family='system-ui,Arial' font-size='18'>Offline image</text></svg>`;

/** Prosty fallback HTML, gdy nie ma indexu. */
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

/** Normalizacja żądania do klucza cache (ignorujemy query dla znanych plików). */
function cacheKeyFor(request) {
  try {
    const url = new URL(request.url);
    if (url.origin !== ORIGIN) return request; // trzymamy tylko same-origin

    if (IGNORE_QUERY_FOR.has(url.pathname)) {
      // zbij query → klucz bez ?v=...
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

/** Czy żądanie to nawigacja (HTML). */
function isHtmlRequest(req) {
  return req.mode === 'navigate' ||
         (req.headers.get('accept') || '').includes('text/html');
}

/** Szybkie sprawdzenie, czy to obraz. */
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
      // ciche – offline first install bez paniki
    }
  })());
});

/* ----------------------------- Activate ----------------------------- */

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // usuń stare cache z tym prefiksem
    const names = await caches.keys();
    await Promise.all(
      names.map((name) =>
        name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
          ? caches.delete(name)
          : Promise.resolve()
      )
    );

    // Włącz Navigation Preload, jeśli dostępne
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

  // tylko GET + same-origin obsługujemy; reszta leci do sieci
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== ORIGIN) return;

  // Nawigacje HTML – network-first z navigation preload i fallbackiem
  if (isHtmlRequest(req)) {
    event.respondWith((async () => {
      try {
        // ucieczka: preload, gdy włączone
        const preload = await event.preloadResponse;
        const network = preload || await fetch(req, { cache: 'no-store' });

        // zaktualizuj cache index.html w tle
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

  // Statyki (CSS/JS/manifest) – stale-while-revalidate
  if (IGNORE_QUERY_FOR.has(url.pathname) || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.json')) {
    event.respondWith((async () => {
      const key = cacheKeyFor(req);
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(key);
      const fetchAndUpdate = fetch(req).then((res) => {
        if (res && res.ok) cache.put(key, res.clone());
        return res;
      }).catch(() => null);

      // zwróć szybko cache, a w tle aktualizuj
      return cached || (await fetchAndUpdate) || cached || new Response('', { status: 504 });
    })());
    return;
  }

  // Obrazy – cache-first z rewalidacją i fallbackiem SVG
  if (isImageRequest(req)) {
    event.respondWith((async () => {
      const key = cacheKeyFor(req);
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(key);
      if (cached) {
        // rewalidacja w tle
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

  // Domyślnie – cache-first, a jak się nie uda: sieć, potem cache
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
      // ostatecznie: może coś w cache bez normalizacji?
      return (await cache.match(req)) || new Response('', { status: 504 });
    }
  })());
});
