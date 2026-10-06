const SCOPE = new URL(self.registration.scope);
const PREFIX = `reboot:${SCOPE.pathname}:`;
const CACHE = `${PREFIX}2.0.1`;
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './favicon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== SCOPE.origin ||
      !url.pathname.startsWith(SCOPE.pathname) || url.pathname.includes('/api/')) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then(cache =>
      cache.match(new URL('./index.html', SCOPE).href)
    )));
    return;
  }
  // Cache only shipped assets; never store error pages or arbitrary API responses.
  if (ASSETS.some(asset => new URL(asset, SCOPE).href === url.href)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request)).then(cached =>
      cached || fetch(event.request)
    ));
  }
});
