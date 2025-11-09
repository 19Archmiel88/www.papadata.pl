const CACHE_NAME = 'papadata-cache-v7';
const ORIGIN = self.location.origin;
const ASSET_VERSION = 'ppd-2025-11-08-2';
const ASSETS = [
  'index.html',
  `style.css?v=${ASSET_VERSION}`,
  `js/script.js?v=${ASSET_VERSION}`,
  `manifest.json?v=${ASSET_VERSION}`,
  'images/PapaData-192.png',
  'images/PapaData.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const isHTML =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
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

  if (req.method !== 'GET' || url.origin !== ORIGIN) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req)
          .then((netRes) => {
            if (netRes && netRes.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, netRes.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(req)
        .then((netRes) => {
          if (netRes && netRes.ok) {
            const clone = netRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return netRes;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return cache.match(req);
        });
    })
  );
});
