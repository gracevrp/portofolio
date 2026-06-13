// Service worker sederhana: simpan offline.html saat pertama kali situs dibuka,
// lalu sajikan halaman itu ketika navigasi gagal karena tidak ada koneksi.

const CACHE = 'portfolio-offline-v1';
const OFFLINE_URL = '/portofolio/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // bersihkan cache versi lama bila ada
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // hanya tangani navigasi halaman (bukan gambar/css/js)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.open(CACHE).then((cache) => cache.match(OFFLINE_URL))
      )
    );
  }
});
