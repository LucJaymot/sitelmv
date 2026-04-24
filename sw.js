const CACHE_NAME = 'lavemavoiture-v1';
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';

const PRECACHE_URLS = [
  '/index.html',
  '/images/logo.svg',
  '/assets/css/main.css',
  '/assets/js/main.js',
  FONT_CSS
];

function isStaticAsset(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  const host = url.hostname;
  if (host === 'fonts.googleapis.com' || host === 'fonts.gstatic.com') return true;
  const ext = (url.pathname.split('.').pop() || '').toLowerCase();
  return ['css', 'js', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'otf'].includes(ext);
}

function isIndexNavigation(request) {
  if (request.mode !== 'navigate') return false;
  const path = new URL(request.url).pathname;
  return path === '/' || path === '/index.html' || path.endsWith('/index.html');
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await fetch(request);
    if (res && res.ok) {
      cache.put(request, res.clone());
    }
    return res;
  } catch (e) {
    let cached = await cache.match(request);
    if (!cached) {
      cached = await cache.match('/index.html');
    }
    if (cached) return cached;
    throw e;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res && res.ok) {
    cache.put(request, res.clone());
  }
  return res;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isIndexNavigation(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(
      cacheFirst(request).catch(() => fetch(request))
    );
    return;
  }
});
