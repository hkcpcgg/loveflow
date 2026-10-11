/* 사랑흐름 우리 이야기 · 바탕화면 두기(309) · 261011 — 담아 두지 않고 그대로 넘김(화면은 늘 새것) */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode !== 'navigate') { return; }
  e.respondWith(fetch(e.request));
});
