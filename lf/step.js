/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/step.js · v4 · 261122 · [대표 261122 16:06 「소리 중저음 · 볼륨 중하」] 소리 부품 lf/fx.js ?v=2 → ?v=3. 그 밖 무손.
   (이전) lf/step.js · v3 · 261121 · [883 · 110차 GPT 6-5] 방문 통계에 주소 꼬리(?id=여권번호 · 주문번호 · 결제 키 · 선물 열쇠)가 가던 것 — page_location · page_referrer 를 경로만으로. 그 밖 무손.
   (이전) lf/step.js · v2 · 261121 · [대표 261121 16:56 「재밌게 살짝살짝 · 띵동 · 창의적으로」] 소리 포인트 더함(사랑흐름이 지은 소리 lf/fx.js v2 · 음원 아님) — 고를 때 「톡」 · 그 시절 이야기가 펼쳐질 때 「반짝」 · 세 길 · 다음 단계 「톡톡」 · 써 보기 카드가 열릴 때 「띵동」 · 말이 글로 처음 나타날 때 「반짝」 · 나침반 결과 「띵동」 · 관계 나침반에도 붙임(compass · compass_result).
   (이전) lf/step.js · v1 · 261121 · [855 · 이사회 108차 · 대표 「진도 쭉쭉」 261121 16:47]
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
    window.gtag('js', new Date()); window.gtag('config', ID, { page_location: location.origin + location.pathname, page_referrer: String(document.referrer || '').split('?')[0] });   /* ★v3 883 주소 꼬리 안 보냄 */
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
    /* 관계 나침반 — 결과가 열리면 한 번 */
    var sr = document.getElementById('s_result');
    if (sr && 'MutationObserver' in window) {
      new MutationObserver(function () { if (sr.classList.contains('active')) { step('compass_result'); fx('ding'); } }).observe(sr, { attributes: true, attributeFilter: ['class'] });
    }
    if (/^\/compass(\.html)?$/.test(p)) { step('compass'); }

    /* ── ★v2 소리 포인트(대표 261121 16:56 「재밌게 살짝살짝 · 띵동」) — 사랑흐름이 지은 소리만(lf/fx.js) · 손님이 한 번 누른 뒤에만 남 ── */
    function on(sel, ev, f) { [].forEach.call(document.querySelectorAll(sel), function (el) { el.addEventListener(ev, f); }); }
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('#pls .pl, #decs .chip, #tWho button, .chips button, .opt, .rel-btn') : null;
      if (t) { fx('tick'); }
    }, true);
    on('#nways .way, #tA2', 'click', function () { fx('hop'); });
    on('#tB2', 'click', function () { setTimeout(function () { fx('ding'); }, 120); });
    on('#vGo', 'click', function () { fx('tick'); });
    if (card && 'MutationObserver' in window) {
      var last = '';
      new MutationObserver(function () { var h = card.querySelector('h3'); if (h && h.textContent !== last) { last = h.textContent; fx('twinkle'); } }).observe(card, { childList: true, subtree: true });
    }
    var vo = document.getElementById('vOut');
    if (vo && 'MutationObserver' in window) {
      var said = false;
      new MutationObserver(function () { if (!said && vo.textContent.trim()) { said = true; fx('twinkle'); } }).observe(vo, { childList: true, characterData: true, subtree: true });
    }
  });

  /* 소리 부품이 없으면 불러 둠 · 🔇(lf_mute) 이면 내지 않음 */
  function fx(k) {
    try { if (localStorage.getItem('lf_mute') === '1') { return; } } catch (e) {}
    if (window.LFFx && window.LFFx[k]) { try { window.LFFx[k](); } catch (e) {} return; }
  }
  if (!window.LFFx) { var f = document.createElement('script'); f.src = '/lf/fx.js?v=3'; f.defer = true; (document.head || document.documentElement).appendChild(f); }
})();
