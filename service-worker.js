// self.addEventListener("install", (event) => {
//   console.log("Service Worker installed");
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     fetch(event.request).catch(() => caches.match(event.request))
//   );
// });

const CACHE_VERSION = "v1";
const CACHE_NAME = `guessing-game-${CACHE_VERSION}`;

const PRECACHE = [
  "/",
  "/index.html",
  "/styles/style.css",
  "/styles/animation.css",
  "/script/app.js",
  "/script/index.js",
  "/script/sound.js",
  "/manifest.json",
  "/sounds/btn.mp3",
  "/sounds/btnFail.mp3",
  "/sounds/btnSuccess.mp3",
  "/sounds/play.mp3",
  "/sounds/reset.mp3",
  "/public/icons/icon-192.png",
  "/public/icons/icon512_maskable.png",
  "/public/icons/icon512_rounded.png",
  "/public/imgs/6188621.png",
];

// Provisioning: atomic. If any single asset 404s, install fails and the old SW stays active.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

// Evict stale cache generations
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Audio/video: browsers send Range requests, which the Cache API handles badly.
  // Serve a sliced response from the cached full body.
  if (request.headers.has("range")) {
    event.respondWith(handleRange(request));
    return;
  }

  // Cache-first, network fallback, and opportunistically cache new same-origin GETs
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (res.ok && new URL(request.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match("/index.html")); // offline navigation fallback
    }),
  );
});

async function handleRange(request) {
  const cached = await caches.match(request.url);
  if (!cached) return fetch(request);

  const buf = await cached.arrayBuffer();
  const m = /bytes=(\d+)-(\d*)/.exec(request.headers.get("range"));
  const start = Number(m[1]);
  const end = m[2] ? Number(m[2]) : buf.byteLength - 1;

  return new Response(buf.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": cached.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`,
      "Content-Length": end - start + 1,
      "Accept-Ranges": "bytes",
    },
  });
}
