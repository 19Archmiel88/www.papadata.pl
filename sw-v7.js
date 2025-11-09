// sw-v7.js — PapaData SW (bez "body used" błędów)
// Wersja: v7 — 2025-11-08

const CACHE_NAME = 'papadata-cache-v7';
const ORIGIN = self.location.origin;
const ASSETS = [
  'index.html',
  'style.css',
  'js/script.js',
  'images/PapaData.png'
];

/* Install: precache tylko lokalne, GET */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).catch(() => {})
  );
});

/* Activate: usuń stare cache i przejmij kontrolę */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

/* Fetch strategie:
   - HTML: network-first (fallback cache)
   - GET + same-origin assety: cache-first + revalidate
   - wszystko inne: puszczamy do sieci bez cache
*/
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const isHTML =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  /* 1) Dokumenty HTML */
  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // KLON PRZED cache.put — unikamy "body used"
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('index.html', copy)).catch(() => {});
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match('index.html')) || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  /* 2) Tylko GET i ten sam origin — nadają się do cache */
  if (req.method !== 'GET' || url.origin !== ORIGIN) {
    // brak cache — zwykły fetch
    return; // pozwól przeglądarce normalnie obsłużyć
  }

  /* 3) Assety: cache-first + revalidate w tle */
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Odśwież w tle (z KLONEM)
        fetch(req)
          .then((netRes) => {
            if (netRes && netRes.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, netRes.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }
      // Brak w cache → pobierz i zapisz KLON
      return fetch(req)
        .then((netRes) => {
          if (netRes && netRes.ok) {
            const clone = netRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return netRes;
        })
        .catch(async () => {
          // fallback: spróbuj jednak coś z cache (np. po offline)
          const cache = await caches.open(CACHE_NAME);
          return cache.match(req);
        });
    })
  );
});
