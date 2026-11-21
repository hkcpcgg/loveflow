/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/step.js · v1 · 261121 · [855 · 이사회 108차 · 대표 「진도 쭉쭉」 261121 16:47]
   단계별 익명 숫자 — 손님이 어느 단계까지 왔다가 어디서 멈추는지만 셉니다.
   + 누가 · 무엇을 썼는지는 보내지 않음(이름 · 연락처 · 적은 글 · 여권번호 없음).
   + 이미 메인 · 결제 화면에 있는 구글 애널리틱스(G-DWCSSE71NS)에 「lf_step」 이벤트로 남김 — 서버 파일 · 시트 없음.
   + 단계: home(첫 화면) · era_story(그 시절 이야기) · person(사람 고름) · way_h/c/d(세 길) ·
           item_map/set/memoir/life(상품 설명) · try_map · try_voice(써 보기) · price_map/…(값 칸이 화면에 보임) ·
           pay(결제 화면) · purchase(결제 끝 — pay.html 에 이미 있음)
   + 숫자 보는 길: 클로드 이사가 대표님 크롬으로 애널리틱스를 열어 단계표로 뽑아 드림.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var ID = 'G-DWCSSE71NS', sent = {};
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', ID);
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    (document.head || document.documentElement).appendChild(s);
  }
  function step(name, once) {
    if (!name) { return; }
    if (once !== false) { if (sent[name]) { return; } sent[name] = 1; }
    try { window.gtag('event', 'lf_step', { step: name }); } catch (e) {}
  }
  window.LFStep = step;

  var p = location.pathname.replace(/index\.html$/, '');
  var m = p.match(/^\/item\/(map|set|memoir|life)\/?$/);
  function onReady(f) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', f); } else { f(); } }
  onReady(function () {
    if (p === '/' ) { step('home'); }
    else if (m) { step('item_' + m[1]); }
    else if (/^\/pay(\.html)?$/.test(p)) { step('pay'); }
    /* 값 칸이 화면에 들어오면 한 번 */
    var buy = document.querySelector('.buy');
    if (m && buy && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { step('price_' + m[1]); io.disconnect(); } }); }, { threshold: 0.4 });
      io.observe(buy);
    }
    /* 써 보기 */
    var tb = document.getElementById('tB2'); if (tb) { tb.addEventListener('click', function () { step('try_map'); }); }
    var vg = document.getElementById('vGo'); if (vg) { vg.addEventListener('click', function () { step('try_voice'); }); }
    /* 메인 — 그 시절 · 사람 · 세 길 */
    var card = document.getElementById('card');
    if (card && 'MutationObserver' in window) {
      new MutationObserver(function () { if (card.querySelector('h3')) { step('era_story'); } }).observe(card, { childList: true, subtree: true });
    }
    var ks = document.getElementById('ks'); if (ks) { ks.addEventListener('click', function () { setTimeout(function () { if (document.querySelector('#ks .sel')) { step('person'); } }, 60); }); }
    [].forEach.call(document.querySelectorAll('#nways .way'), function (b) { b.addEventListener('click', function () { step('way_' + b.getAttribute('data-w')); }); });
  });
})();
