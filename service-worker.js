const CACHE_VERSION = 'v2'; // Increment this version number for updates
const CACHE_NAME = `mushroom-grow-log-${CACHE_VERSION}`;
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: Cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching new files");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate new service worker immediately
});

// Activate: Remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Take control of all pages
});

// Fetch: Serve from cache first, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
