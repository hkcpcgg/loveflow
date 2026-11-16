/* 사랑흐름 우리 이야기 · sw.js · v6 · 261116 · [우리이야기] S6 분리 — 우리 이야기는 https://uriyagi.kr/ 로 옮김. 옛 주소 /rec/ 에 남은 서비스워커가 옛 화면을 계속 보여 주지 않도록: 남겨 둔 것을 모두 지우고 스스로 물러난 뒤 열린 창을 새로 엶(→ 넘기는 문 → uriyagi.kr). 이 파일은 지우지 않음(옛 휴대폰이 받아 가야 함). */
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })
    .then(function () { return self.registration.unregister(); })
    .then(function () { return self.clients.matchAll({ type: 'window' }); })
    .then(function (cs) { cs.forEach(function (c) { try { c.navigate(c.url); } catch (e) {} }); })
    .catch(function () {}));
});
self.addEventListener('fetch', function () { /* 가로채지 않음 — 그대로 망으로 */ });
