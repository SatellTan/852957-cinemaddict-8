self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(`STATIC_MOOWLE_V1.0`)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./film-details.html`,
        `./bundle.js`,
        `./css/main.css`,
        `./css/normalize.css`,
        `./images/icon-favorite.svg`,
        `./images/icon-watched.svg`,
        `./images/icon-watchlist.svg`,
        `./images/posters/accused.jpg`,
        `./images/posters/blackmail.jpg`,
        `./images/posters/blue-blazes.jpg`,
        `./images/posters/fuga-da-new-york.jpg`,
        `./images/posters/moonrise.jpg`,
        `./images/posters/three-friends.jpg`,
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
