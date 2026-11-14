/* 사랑흐름 우리 이야기 · sw.js · v4 · 261114 · ★v4 남겨 둔 화면이 없을 때(처음 · 지운 뒤) 휴대폰 신호가 잠깐 끊기면 실패를 그대로 넘겨 「사이트에 연결할 수 없음 · ERR_FAILED」가 뜨던 것 → 1.5초 뒤 한 번 더 받고, 그래도 안 되면 「연결이 잠시 고르지 않습니다」(3초마다 다시 엶)
   (이전) v3 · 261015 · [대표 OK 261015 22:35 · 375 · 화면 rec v62 와 짝]
   다시 오는 분은 화면 파일(우리 이야기 화면 · 설정 · 꾸밈)을 이 기기에 남겨 둔 것으로 바로 열고, 뒤에서 새것을 받아 둠.
   ★v3 받아 온 우리 이야기 화면(/rec/)이 남겨 둔 것과 다르면 열린 화면에 「새 화면」을 알림 → 화면이 첫 화면 · 광장에서 한 번 바꿔 엶.
   서버(구글) 요청 · 사진 · 다른 페이지는 가로채지 않음. 처음 오는 분은 지금과 같음.
   (이전) v2 · 261012 — 남겨 둔 것으로 먼저 열기(335) · 새것은 다음에 열 때. v1 · 261011 — 바탕화면 두기(309) */
var OFF = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>우리 이야기 · 사랑흐름</title>' +
  '<style>body{margin:0;font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;background:#FFFBF4;color:#1F3A5F;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center}' +
  'b{display:block;font-size:20px;margin-bottom:8px}p{color:#666;font-size:15px;margin:0 0 18px}button{border:0;border-radius:12px;background:#1F3A5F;color:#fff;font-size:16px;padding:12px 26px}</style></head>' +
  '<body><div><b>연결이 잠시 고르지 않습니다</b><p>곧 다시 엽니다</p><button onclick="location.reload()">다시 열기</button></div>' +
  '<script>setTimeout(function(){location.reload()},3000)</script></body></html>';
function offPage() { return new Response(OFF, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }); }
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
      if (r.mode !== 'navigate') { return net; }
      return net.catch(function () { return new Promise(function (ok) { setTimeout(ok, 1500); }).then(function () { return fetch('/rec/' + u.search, { cache: 'no-cache' }); }).catch(offPage); });   /* ★v4 */
    });
  }));
});
