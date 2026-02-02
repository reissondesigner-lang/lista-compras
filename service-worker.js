self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('lista-compras-cache').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
});