// 캐시 이름 설정
const CACHE_NAME = 'githilight-cache-v1';

// 캐싱할 리소스 목록
const urlsToCache = [
  '/',
  '/static/style.css',
  '/static/manifest.json',
  '/static/icons/icon-192x192.png',
  '/static/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시 열림');
        return cache.addAll(urlsToCache);
      })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시된 응답 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크 요청
        return fetch(event.request)
          .then(response => {
            // 유효한 응답인지 확인 (유효하지 않으면 그냥 응답 반환)
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 응답 복제 (응답 스트림은 한 번만 사용 가능하므로)
            const responseToCache = response.clone();
            
            // 응답 캐싱
            caches.open(CACHE_NAME)
              .then(cache => {
                // JSON 데이터나 특정 API 응답은 제외
                if (!event.request.url.includes('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return response;
          });
      })
  );
});

// 캐시 정리 (새 버전 배포 시)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 이전 캐시 삭제
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
