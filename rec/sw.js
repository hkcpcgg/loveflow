/* 사랑흐름 우리 이야기 · sw.js · v2 · 261012 · [대표 OK 261012 16:34 「쭉」 · 335]
   다시 오는 분은 화면 파일(우리 이야기 화면 · 설정 · 꾸밈)을 이 기기에 남겨 둔 것으로 바로 열고, 뒤에서 새것을 받아 둠(다음에 열 때 새것).
   서버(구글) 요청 · 사진 · 다른 페이지는 가로채지 않음. 처음 오는 분은 지금과 같음.
   (이전) v1 · 261011 — 바탕화면 두기(309) · 담아 두지 않고 그대로 넘김 */
var SHELL = 'lf-rec-shell-v2';
function isShell(u) {
  if (u.origin !== self.location.origin) { return false; }
  if (u.pathname === '/rec/' || u.pathname === '/rec/index.html') { return true; }
  return /^\/lf\/(config|flow|frame)\.js$/.test(u.pathname);
}
function keyOf(u) { return (u.pathname === '/rec/' || u.pathname === '/rec/index.html') ? '/rec/' : u.pathname + u.search; }
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^lf-rec-shell-/.test(k) && k !== SHELL; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') { return; }
  var u; try { u = new URL(r.url); } catch (x) { return; }
  if (!isShell(u)) { return; }
  var k = keyOf(u);
  e.respondWith(caches.open(SHELL).then(function (c) {
    return c.match(k).then(function (hit) {
      var net = fetch(r.mode === 'navigate' ? '/rec/' : r, { cache: 'no-cache' }).then(function (res) { if (res && res.ok && res.type === 'basic') { c.put(k, res.clone()); } return res; });
      if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
      return net;
    });
  }));
});
