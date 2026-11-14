/* 사랑흐름 · sw.js · v2 · 261114 · [대표 261114 「사이트에 연결할 수 없음 ERR_FAILED」] 화면 열기(navigate)를 그대로 받아 주던 것이 휴대폰 신호가 잠깐 끊기면 실패를 그대로 넘겨 크롬이 「사이트에 연결할 수 없음 · ERR_FAILED」를 띄움
   → 한 번 더(1.5초 뒤) 받아 보고, 그래도 안 되면 「연결이 잠시 고르지 않습니다」 작은 화면(3초마다 다시 엶 · 「다시 열기」 단추)을 보여 줌. 화면을 남겨 두지 않는 것은 그대로.
   (이전) v1 · 261105 · [533] 바탕화면 바로가기(홈 화면에 추가)를 위한 최소 일꾼 · 화면 열기만 그대로 받아 줌.
   /rec/ 는 따로 있는 /rec/sw.js 가 맡음(더 좁은 자리가 먼저). */
var OFF = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>사랑흐름</title>' +
  '<style>body{margin:0;font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;background:#FFFBF4;color:#1F3A5F;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center}' +
  'b{display:block;font-size:20px;margin-bottom:8px}p{color:#666;font-size:15px;margin:0 0 18px}button{border:0;border-radius:12px;background:#1F3A5F;color:#fff;font-size:16px;padding:12px 26px}</style></head>' +
  '<body><div><b>연결이 잠시 고르지 않습니다</b><p>곧 다시 엽니다</p><button onclick="location.reload()">다시 열기</button></div>' +
  '<script>setTimeout(function(){location.reload()},3000)</script></body></html>';
function offPage() { return new Response(OFF, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }); }
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode !== 'navigate') { return; }
  var r = e.request;
  e.respondWith(fetch(r).catch(function () {
    return new Promise(function (ok) { setTimeout(ok, 1500); }).then(function () { return fetch(r); }).catch(offPage);
  }));
});
