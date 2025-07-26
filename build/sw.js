const CACHE_NAME = 'meet-app-v1';
const BASE_PATH = '/meet/';

// Define specific assets to cache (no wildcards allowed)
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'vite.svg',
  // External resources
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache core files first
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Fetch event (updated for GitHub Pages)
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Only handle requests for our domain and proper base path
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
              return caches.match(BASE_PATH + 'index.html');
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