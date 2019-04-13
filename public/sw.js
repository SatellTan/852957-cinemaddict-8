self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(`STATIC_MOOWLE_V1.0`)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./statistic.html`,
        `./film-details.html`,
        `./css/main.css`,
        `./css/normalize.css`,
      ]);
    });
  evt.waitUntil(openCache);
});

self.addEventListener(`activate`, () => {
  console.log(`sw activated`);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => response ? response : fetch(evt.request))
      .catch((err) => console.error({err}))
  );
});
