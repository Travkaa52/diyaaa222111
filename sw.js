// =====================================================
//  DIIA PWA — Service Worker v2.0
//  Стратегія: Cache First для ресурсів, Network First для HTML
// =====================================================

const CACHE_NAME    = 'diia-v2';
const RUNTIME_CACHE = 'diia-runtime-v2';

// Всі ресурси що кешуються при встановленні SW
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './values.js',
  './main.js',
  './1.png',
  './sig.png',
  './sign.png',
  './biometrics.png',
  // assets
  './assets/anime.js',
  './assets/favicon.png',
  './assets/manifest.json',
  './assets/e-Ukraine-Regular.woff',
  './assets/logo.mp4',
  './assets/background_gradient.mp4',
  // іконки
  './assets/arrow.svg',
  './assets/docin.svg',
  './assets/qr.svg',
  './assets/uasign.svg',
  './assets/diya.svg',
  './assets/qr-code.png',
  './assets/free-icon-barcode-7797192.png',
  './assets/copy.png',
  './assets/delete.png',
  './assets/dots.png',
  './assets/star.png',
  './assets/question.png',
  './assets/exchange.png',
  './assets/document.png',
  './assets/news.png',
  './assets/user.png',
  './assets/circle.png',
  './assets/search.png',
  './assets/light.png',
  './assets/aod.jpg',
  './assets/ing.jpg',
  './assets/gerb.png',
  './assets/settings.png',
  './assets/key.png',
  './assets/email.png',
  './assets/smartphone.png',
  './assets/chat.png',
  './assets/ask.png',
  './assets/folders.png',
  './assets/refresh.png',
  './assets/alert.png',
  './assets/thunder.png',
  './assets/helmet.png',
  './assets/house.png',
  './assets/car.png',
  './assets/idea.png',
  './assets/box.png',
  './assets/case.png',
  './assets/charity.png',
  './assets/verdict.png',
  './assets/repair.png',
  './assets/osela.png',
  './assets/dovidka.png',
  './assets/controller.png',
  './assets/covid.png',
  './assets/addDocument.png',
  './assets/swapDocument.png',
  './assets/vitag.png',
  './assets/photo_passport.jpg',
  './assets/1.jpg',
  './assets/2.jpg',
  './assets/3.jpg',
  // access
  './access/192x192.png',
];

// CDN ресурси — кешуємо після першого завантаження
const CDN_ORIGINS = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
];

// ── INSTALL ────────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Кешуємо по одному щоб не зупинити встановлення якщо файлу немає
      return Promise.allSettled(
        PRECACHE_ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Не вдалося закешувати:', url, err.message);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ───────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => {
            console.log('[SW] Видалено старий кеш:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ──────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ігноруємо не-GET та Telegram API запити
  if (url.hostname === 'script.google.com') return;
  if (request.method !== 'GET') return;
  if (url.hostname === 'api.telegram.org') return;
  if (url.hostname === 'ipinfo.io') return;

  // CDN — Stale While Revalidate (повертаємо кеш + оновлюємо фоново)
  if (CDN_ORIGINS.some(origin => url.hostname.includes(origin))) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  // HTML-сторінки — Network First (завжди свіжа версія якщо є мережа)
  if (request.destination === 'document' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Решта (JS, CSS, зображення, відео) — Cache First
  event.respondWith(cacheFirst(request));
});

// ── СТРАТЕГІЇ ──────────────────────────────────────────────────────────────────

/** Cache First: спершу кеш, потім мережа */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Офлайн — ресурс недоступний', { status: 503 });
  }
}

/** Network First: спершу мережа, при помилці — кеш */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Офлайн-fallback
    const fallback = await caches.match('./index.html');
    return fallback || new Response('Офлайн', { status: 503 });
  }
}

/** Stale While Revalidate: повертаємо кеш відразу + оновлюємо фоново */
async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || fetchPromise;
}

// ── PUSH NOTIFICATIONS (заготовка) ────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Дія', {
    body:    data.body    || '',
    icon:    './assets/favicon.png',
    badge:   './access/192x192.png',
    vibrate: [100, 50, 100],
    data:    { url: data.url || './' },
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// ── BACKGROUND SYNC (заготовка для відправки даних офлайн) ────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

async function syncUserData() {
  // Тут можна відправити накопичені офлайн-дії
  console.log('[SW] Background sync виконано');
}
