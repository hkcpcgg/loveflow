/* 사랑흐름 · sw.js · v1 · 261105 · [533 · 대표 OK 261105 11:28] 바탕화면 바로가기(홈 화면에 추가)를 위한 최소 일꾼.
   화면을 남겨 두지 않음(늘 새로 받음) · 화면 열기(navigate)만 그대로 받아 줌 · 서버(구글) 요청 · 사진 · 그 밖은 가로채지 않음.
   /rec/ 는 따로 있는 /rec/sw.js 가 맡음(더 좁은 자리가 먼저). */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode !== 'navigate') { return; }
  e.respondWith(fetch(e.request));
});
