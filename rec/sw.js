/* 사랑흐름 우리 이야기 · sw.js · v3 · 261015 · [대표 OK 261015 22:35 · 375 · 화면 rec v62 와 짝]
   다시 오는 분은 화면 파일(우리 이야기 화면 · 설정 · 꾸밈)을 이 기기에 남겨 둔 것으로 바로 열고, 뒤에서 새것을 받아 둠.
   ★v3 받아 온 우리 이야기 화면(/rec/)이 남겨 둔 것과 다르면 열린 화면에 「새 화면」을 알림 → 화면이 첫 화면 · 광장에서 한 번 바꿔 엶.
   서버(구글) 요청 · 사진 · 다른 페이지는 가로채지 않음. 처음 오는 분은 지금과 같음.
   (이전) v2 · 261012 — 남겨 둔 것으로 먼저 열기(335) · 새것은 다음에 열 때. v1 · 261011 — 바탕화면 두기(309) */
var SHELL = 'lf-rec-shell-v2';   /* 이름은 그대로 — 바꾸면 남겨 둔 것을 지워 처음 오는 분처럼 느려짐 */
function isShell(u) {
  if (u.origin !== self.location.origin) { return false; }
  if (u.pathname === '/rec/' || u.pathname === '/rec/index.html') { return true; }
  return /^\/lf\/(config|flow|frame)\.js$/.test(u.pathname);
}
function keyOf(u) { return (u.pathname === '/rec/' || u.pathname === '/rec/index.html') ? '/rec/' : u.pathname + u.search; }
function tell() {
  return self.clients.matchAll({ type: 'window' }).then(function (cs) { cs.forEach(function (c) { try { c.postMessage({ t: 'lf-new' }); } catch (x) { } }); });
}
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^lf-rec-shell-/.test(k) && k !== SHELL; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') { return; }
  var u; try { u = new URL(r.url); } catch (x) { return; }
  if (!isShell(u)) { return; }
  var k = keyOf(u), page = (k === '/rec/');
  e.respondWith(caches.open(SHELL).then(function (c) {
    return c.match(k).then(function (hit) {
      var old = (hit && page) ? hit.clone() : null;   /* 화면에 넘기기 전에 견줄 몫을 따로 떠 둠 */
      var net = fetch(r.mode === 'navigate' ? '/rec/' : r, { cache: 'no-cache' }).then(function (res) {
        if (!res || !res.ok || res.type !== 'basic') { return res; }
        if (!old) { c.put(k, res.clone()); return res; }
        /* ★v3 화면 파일이면 남겨 둔 것과 견줌 — 다르면 담고 알림 */
        var copy = res.clone();
        return Promise.all([copy.text(), old.text()]).then(function (t) {
          if (t[0] && t[0] !== t[1]) {
            return c.put(k, new Response(t[0], { headers: copy.headers })).then(tell);
          }
        }).then(function () { return res; }, function () { return res; });
      });
      if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
      return net;
    });
  }));
});
