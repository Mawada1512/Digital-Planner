const CACHE_NAME = "digital-planner-v3";
const urlsToCache = [
  "/index.html",
  "/style.css",
  "/script.js",

  // الأيقونات
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",

  // الصور
  "/assets/images/G-bg.jpg",
  "/assets/images/F-bg.jpg",
  "/assets/images/M-bg.jpg",
  "/assets/images/offline.png",
];

// ===== Install =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ===== Activate =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

// ===== Fetch =====
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request)
        .then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
        .catch(() => {
          if (event.request.destination === "image") {
            return caches.match("/assets/images/offline.png");
          }
        });
    })
  );
});
