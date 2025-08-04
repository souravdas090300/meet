const CACHE_NAME = 'meet-app-v1';

// Define specific assets to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // These will be dynamically added after build
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache basic files - assets will be cached on demand
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json'
        ]).catch((error) => {
          console.error('Failed to cache some resources:', error);
          // Continue with installation even if some resources fail
          return Promise.resolve();
        });
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to install service worker:', error);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Only handle requests for our domain
  if (requestUrl.origin !== location.origin) {
    return; // Let browser handle external requests
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        // Network fallback with caching
        return fetch(event.request)
          .then(response => {
            // Only cache successful responses for same-origin requests
            if (response && response.status === 200 && response.url.startsWith(location.origin)) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  // Cache the new response
                  cache.put(event.request, responseToCache);
                  console.log('Cached new resource:', event.request.url);
                });
            }
            return response;
          })
          .catch(() => {
            console.log('Network failed for:', event.request.url);
            // Offline fallback - return index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // For other requests, try to find a cached version
            return caches.match(event.request);
          });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Only handle requests for our domain
  if (requestUrl.origin !== location.origin) {
    return; // Let browser handle external requests
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        // Network fallback with caching
        return fetch(event.request)
          .then(response => {
            // Only cache successful responses
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  // Cache the new response
                  cache.put(event.request, responseToCache);
                  console.log('Cached new resource:', event.request.url);
                });
            }
            return response;
          })
          .catch(() => {
            console.log('Network failed for:', event.request.url);
            // Offline fallback - return index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // For other requests, try to find a cached version
            return caches.match(event.request);
          });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});