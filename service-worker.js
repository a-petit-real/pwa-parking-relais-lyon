const CACHE = "pwa-parking-relais-v1";

self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(["/", "/index.html", "/manifest.json"])
    )
  );
});

self.addEventListener("fetch", evt => {
  evt.respondWith(
    fetch(evt.request).catch(() => caches.match(evt.request))
  );
});