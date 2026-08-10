/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/pass.js · v1 · 260810 — ★사랑흐름 문지기(신설).

   [왜 만들었나]
   여권번호를 찾고·심고·문을 열지 말지 판정하는 코드가 화면마다 따로
   복사돼 있었습니다(지도 · 지도 결과 · 편지 · 게이트 · 입구 부품).
   그래서 한 곳을 고치면 나머지가 남았고, 같은 구멍을 여러 번 팠습니다.
   이 파일 하나로 모읍니다.

   [하는 일 — 이 다섯]
     ① 번호 찾기   주소(?id=) → 그 창의 기억 → 기기의 기억, 이 순서
     ② 번호 심기   찾으면 세 곳 모두에 다시 심습니다(다음 화면이 또 묻지 않게)
     ③ 문 판정     번호가 없으면 게이트로 돌려보냅니다(부르는 화면만)
     ④ 링크 잇기   화면 안 모든 링크에 번호를 붙입니다(☰ 메뉴 포함)
     ⑤ 부품 부르기 문 그리는 부품(/lf/enter.js)을 늘 최신 판으로 불러옵니다

   [쓰는 법]
     · 모든 화면 — <head> 안, 되도록 맨 위:
         <script src="/lf/pass.js"></script>
     · 잠긴 화면(지도 · 지도 결과 · 편지)은 바로 다음 줄에 한 줄 더:
         <script>LFPass.guard();</script>

   [화면은 꼬리표를 몰라도 됩니다]
   문 그리는 부품을 새로 고치면 아래 PART_V 한 글자만 올립니다.
   화면 파일은 다시 건드리지 않습니다 — 260804 에 열두 화면의 꼬리표를
   빠뜨려 옛 부품이 계속 돌던 일이 다시 나지 않게.

   [원칙 — 문 여는 판정]
     · 지도 · 편지 = 번호가 있으면 엽니다(바깥 조회가 막혀도 안 세웁니다)
     · 자서전 = 대장을 확인하고 엽니다(그 판정은 자서전 화면이 그대로 합니다)

   ※ 이 파일은 시트에 한 글자도 쓰지 않습니다. 발권·결제와도 무관합니다.
   © 2026 사랑흐름·LFRI™. 무단복제·상업적이용 금지.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 문 그리는 부품 판 번호 — 부품을 고치면 여기만 올립니다 */
  var PART_V = '7';

  var GATE = '/gate.html';
  var RE   = /^LF[ML]?-[A-Za-z0-9]{3,}$/;

  function clean(v) {
    v = String(v || '').trim().toUpperCase();
    return RE.test(v) ? v : '';
  }

  /* ── ① 번호 찾기 ── */
  function fromUrl() {
    try {
      var m = location.search.match(/[?&]id=(LF[ML]?-[A-Za-z0-9]+)/i);
      return m ? clean(m[1]) : '';
    } catch (e) { return ''; }
  }
  function fromSession() {
    try { return clean(sessionStorage.getItem('lf_passport')); } catch (e) { return ''; }
  }
  function fromDevice() {
    try { return clean(localStorage.getItem('lf_passport')); } catch (e) { return ''; }
  }

  /* ── ② 번호 심기 — 세 곳 모두에 ── */
  function seal(v) {
    var pp = clean(v);
    if (!pp) { return ''; }
    try { sessionStorage.setItem('lf_passport', pp); } catch (e) {}
    try { localStorage.setItem('lf_passport', pp); } catch (e) {}
    try { sessionStorage.setItem('lf_unlock', '1'); } catch (e) {}
    window.lfPassport = pp;
    return pp;
  }

  function no() {
    var pp = fromUrl() || fromSession() || fromDevice();
    if (pp) { seal(pp); }
    return pp;
  }

  /* ── ③ 문 판정 — 번호가 없으면 게이트로 ── */
  function guard() {
    var pp = no();
    if (pp) { return pp; }
    try {
      if (window.top === window.self && /^https?:/.test(location.protocol)) {
        location.replace(GATE);
      }
    } catch (e) {}
    return '';
  }

  /* ── ④ 링크 잇기 ── */
  /* 번호를 실어야 하는 목적지. 게이트·여권 찾기·진열·쇼룸은 뺍니다
     — 그 화면들은 번호가 없는 분이 가는 곳입니다. */
  var NEEDS = [
    '/journey/', '/journey/index.html', '/journey/result.html',
    '/l/', '/l/index.html', '/letter/', '/letter/index.html',
    '/reenter.html', '/enter.html',
    '/memoir/ask.html', '/memoir/book.html', '/memoir/ritual.html'
  ];
  function needsId(u) {
    if (!u || u.charAt(0) !== '/') { return false; }
    var p = u.split('?')[0].split('#')[0];
    for (var i = 0; i < NEEDS.length; i++) { if (p === NEEDS[i]) { return true; } }
    return false;
  }
  function link() {
    var pp = window.lfPassport || no();
    if (!pp) { return; }
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; i++) {
      var h = a[i].getAttribute('href');
      if (!needsId(h) || h.indexOf('id=') > -1) { continue; }
      a[i].setAttribute('href', h + (h.indexOf('?') > -1 ? '&' : '?') + 'id=' + encodeURIComponent(pp));
    }
  }

  /* ── ⑤ 문 그리는 부품 부르기 ── */
  function part() {
    try {
      if (document.querySelector('script[src*="/lf/enter.js"]')) { return; }
      var s = document.createElement('script');
      s.src = '/lf/enter.js?v=' + PART_V;
      s.defer = true;
      (document.body || document.head).appendChild(s);
    } catch (e) {}
  }

  window.LFPass = {
    no: no, seal: seal, guard: guard, link: link,
    fromDevice: fromDevice, RE: RE, PART_V: PART_V
  };

  function start() {
    link();
    part();
    /* 화면이 늦게 그리는 경우 한 번 더 */
    setTimeout(link, 400);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
