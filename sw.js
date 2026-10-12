/* SwipeJoy service worker: opens offline after the first visit. Bump CACHE to force an update. */
const CACHE = 'swipejoy-v5';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/htm@3.1.1/dist/htm.umd.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(CDN.map(async (url) => { const r = await fetch(url, { mode: 'cors' }); if (r.ok) await cache.put(url, r); }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Pages: try the network first so updates arrive, fall back to the saved copy offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }
  // Everything else (scripts, fonts, icons): saved copy first, then network, saving what we fetch.
  event.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) { const cache = await caches.open(CACHE); cache.put(req, res.clone()); }
      return res;
    } catch (e) {
      return hit || Response.error();
    }
  })());
});
