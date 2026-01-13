/**
 * 커뮤(Commu) Service Worker
 * PWA 오프라인 지원 및 캐싱 전략
 */

const CACHE_NAME = 'commu-cache-v1';
const OFFLINE_URL = '/offline';

// 캐시할 정적 자원 목록
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 캐시 우선 자원 (이미지, 폰트 등)
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:woff|woff2|ttf|otf)$/,
  /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
];

// 네트워크 우선 자원 (API 등)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/_next\/data\//,
];

/**
 * Service Worker 설치
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 정적 자원 캐싱 중...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // 즉시 활성화
  self.skipWaiting();
});

/**
 * Service Worker 활성화
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] 이전 캐시 삭제:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // 모든 클라이언트 제어
  self.clients.claim();
});

/**
 * Fetch 이벤트 처리
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 같은 origin의 요청만 처리
  if (url.origin !== location.origin && !isCrossOriginAllowed(url)) {
    return;
  }

  // GET 요청만 캐싱
  if (request.method !== 'GET') {
    return;
  }

  // 캐싱 전략 선택
  if (isNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else if (isCacheFirst(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

/**
 * 네트워크 우선 전략 (API 등)
 */
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
    if (cached) {
      return cached;
    }
    // 오프라인 폴백
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    throw new Error('Network error');
  }
}

/**
 * 캐시 우선 전략 (이미지, 폰트 등)
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // 오프라인 시 빈 응답
    return new Response(null, { status: 404 });
  }
}

/**
 * Stale While Revalidate 전략 (HTML 등)
 */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, clone);
      });
    }
    return response;
  }).catch(() => {
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return cached;
  });

  return cached || fetchPromise;
}

/**
 * 네트워크 우선 패턴 확인
 */
function isNetworkFirst(pathname) {
  return NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * 캐시 우선 패턴 확인
 */
function isCacheFirst(pathname) {
  return CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Cross-origin 허용 여부 확인
 */
function isCrossOriginAllowed(url) {
  const allowedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];
  return allowedOrigins.some((origin) => url.href.startsWith(origin));
}

/**
 * 푸시 알림 수신
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || '새로운 알림이 있습니다',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '커뮤', options)
  );
});

/**
 * 알림 클릭 처리
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // 이미 열린 창이 있으면 포커스
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // 없으면 새 창 열기
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

/**
 * 백그라운드 동기화
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

/**
 * 오프라인 게시글 동기화
 */
async function syncPosts() {
  // IndexedDB에서 오프라인 작성 게시글 가져와서 서버에 전송
  console.log('[SW] 오프라인 게시글 동기화');
}

console.log('[SW] Service Worker 로드됨');
