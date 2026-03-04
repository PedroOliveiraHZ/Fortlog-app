const CACHE_NAME = "fortlog-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/logo.png",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {

  // 🔥 1) Nunca interceptar POST, PUT, DELETE etc
  if (event.request.method !== "GET") {
    return;
  }

  // 🔥 2) Nunca interceptar API
  if (event.request.url.includes("/api/")) {
    return;
  }

  // 🔥 3) Só fazer cache de navegação e arquivos estáticos
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // fallback opcional se quiser
        return caches.match("/index.html");
      })
  );
});
