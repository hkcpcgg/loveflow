/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/enter.js · v1 · 260804
   사랑흐름 공용 입구 부품 — 전 화면이 이 한 파일을 씁니다.

   [쓰는 법] 화면 하단에 아래 한 줄만 둡니다.
     <script src="/lf/enter.js" defer></script>
   자리는 부품이 스스로 찾습니다(길 셋 위 → 없으면 푸터 위).

   [하는 일]
     ① 사랑흐름 여권번호 한 칸
     ② 번호를 넣으면 조회 GAS(읽기 전용)에 「무엇을 가졌나」를 묻습니다
     ③ 가진 것만 「이어 하기 · 보기」로 엽니다
     ④ 아직 없는 상품은 결제로 밀지 않고 「여행의 기록」(쇼룸)으로 안내합니다
        — 260804 대표 확정

   [문구 기준]
     · 260711 대표 확정 — 여권이라고 내 정보처럼 보이지 않게. 「사랑흐름」을 꼭 붙인다.
     · 260716 대표 확정 — 「여권으로 문을 엽니다」 / 「받으신 사랑흐름 여권번호를 넣어 주세요.」
     · 「자리」·「여행권」은 안쪽 말이라 손님 화면에 꺼내지 않습니다.

   [안 까는 곳] 여행지도 질문 중 · 편지 쓰는 중 · 자서전 질문 중 · reenter(그 화면이 이미 입구)

   ※ 이 부품은 시트에 한 글자도 쓰지 않습니다. 읽기만 합니다.
   © 2026 사랑흐름·LFRI™. 무단복제·상업적이용 금지.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GAS = 'https://script.google.com/macros/s/AKfycbyTroJxyBICtL516b6l9KQ45eQRSaKspj35IXOKET2sHvbS_pAlH2gxM9mvBsVsZJ9X/exec';
  var SHOWROOM = '/showroom.html';

  var NAME = { map: '마음 여행지도', letter: '마음 여행편지', memoir: '한 편의 기록' };
  var DEST = {
    map:    { cont: '/journey/',        read: '/journey/' },
    letter: { cont: '/l/',              read: '/l/' },
    memoir: { cont: '/memoir/ask.html', read: '/memoir/book.html' }
  };
  var VERB = {
    map:    { cont: '내 여행지도 이어가기',   read: '내 여행지도 펼쳐 보기',   start: '여행지도 펼치러 가기' },
    letter: { cont: '쓰시던 편지 이어 쓰기',  read: '내 편지 읽어 보기',       start: '편지 쓰러 가기' },
    memoir: { cont: '쓰시던 이야기 이어 쓰기', read: '지금까지 쓴 이야기 보기', start: '첫 이야기 쓰러 가기' }
  };

  var DATA = null, PP = '', TIMER = null;

  /* ── 안 까는 곳 ── */
  function skip() {
    var p = location.pathname;
    if (p.indexOf('/reenter') === 0) { return true; }
    if (p.indexOf('/journey/') === 0 && p.indexOf('result') < 0) { return true; }
    if (p.indexOf('/letter/') === 0) { return true; }
    if (p.indexOf('/memoir/ask') === 0) { return true; }
    return false;
  }

  /* ── 그 화면의 상품을 먼저 골라 둡니다 ── */
  function here() {
    var p = location.pathname;
    if (p.indexOf('/memoir') === 0) { return 'memoir'; }
    if (p.indexOf('/l/') === 0 || p.indexOf('/letter') === 0) { return 'letter'; }
    if (p.indexOf('/journey') === 0) { return 'map'; }
    return '';
  }

  /* ── 주소나 세션에 여권번호가 있으면 미리 채웁니다 ── */
  function known() {
    var v = '';
    try {
      var m = location.search.match(/[?&]id=(LF[ML]?-[A-Za-z0-9]+)/i);
      if (m) { v = m[1]; }
    } catch (e) {}
    if (!v) { try { v = sessionStorage.getItem('lf_passport') || ''; } catch (e) {} }
    return String(v).trim().toUpperCase();
  }

  function css() {
    var s = document.createElement('style');
    s.textContent =
      '.lfent{max-width:420px;margin:22px auto 6px;padding:0 16px;box-sizing:border-box}'
      + '.lfent .lfe-h{text-align:center;font-size:14.5px;font-weight:800;color:#1E4A76;letter-spacing:-.3px}'
      + '.lfent .lfe-s{text-align:center;font-size:12.5px;line-height:1.65;color:#7A8794;margin:5px 0 11px}'
      + '.lfent .lfe-s b{color:#1E4A76}'
      + '.lfent .lfe-in{width:100%;height:50px;border:1.5px solid #D8E2EC;border-radius:14px;background:#FFFCFA;'
      + 'font-size:19px;font-weight:800;letter-spacing:2px;text-align:center;color:#1E4A76;'
      + 'text-transform:uppercase;font-family:inherit;outline:none;box-sizing:border-box}'
      + '.lfent .lfe-in:focus{border-color:#1E4A76}'
      + '.lfent .lfe-in::placeholder{color:#C9CFD6;letter-spacing:1px;font-size:16px}'
      + '.lfent .lfe-sel{width:100%;height:50px;margin-top:10px;border:1.5px solid #D8E2EC;border-radius:14px;'
      + 'background:#F7FAFD;color:#1E4A76;font-size:15px;font-weight:700;font-family:inherit;padding:0 14px;'
      + 'outline:none;-webkit-appearance:none;appearance:none;box-sizing:border-box}'
      + '.lfent .lfe-btns{display:flex;flex-direction:column;gap:9px;margin-top:10px}'
      + '.lfent .lfe-b{width:100%;min-height:50px;padding:12px 14px;border-radius:14px;border:none;cursor:pointer;'
      + 'font-family:inherit;font-size:15px;font-weight:800;letter-spacing:-.3px;line-height:1.4;background:#1E4A76;color:#fff}'
      + '.lfent .lfe-b.sub{background:#F7FAFD;color:#1E4A76;border:1.5px solid #D8E2EC}'
      + '.lfent .lfe-b.look{background:#FBEFD5;color:#8A6D28;border:1.5px solid #E6C97A}'
      + '.lfent .lfe-b:active{opacity:.6}'
      + '.lfent .lfe-n{margin-top:9px;font-size:12.5px;line-height:1.65;color:#7A8794;text-align:center}'
      + '.lfent .lfe-n b{color:#1E4A76}'
      + '.lfent .lfe-find{display:block;text-align:center;margin-top:10px;font-size:12px;color:#8A6D28;'
      + 'text-decoration:underline;cursor:pointer}'
      + '.lfent .lfe-box{display:none}'
      + '@media print{.lfent{display:none !important}}';
    document.head.appendChild(s);
  }

  function html() {
    return '<div class="lfe-h">여권으로 문을 엽니다</div>'
      + '<div class="lfe-s">받으신 <b>사랑흐름 여권번호</b>를 넣어 주세요.<br>지난 여행이 그대로 이어집니다.</div>'
      + '<input class="lfe-in" id="lfeIn" placeholder="LF-XXXXX" inputmode="text" autocomplete="off">'
      + '<a class="lfe-find" id="lfeFind">번호가 기억나지 않으시면 · 사랑흐름 여권 찾기 &rarr;</a>'
      + '<div class="lfe-box" id="lfeBox">'
      +   '<select class="lfe-sel" id="lfeSel">'
      +     '<option value="map">마음 여행지도</option>'
      +     '<option value="letter">마음 여행편지</option>'
      +     '<option value="memoir">한 편의 기록</option>'
      +   '</select>'
      +   '<div class="lfe-btns" id="lfeBtns"></div>'
      +   '<div class="lfe-n" id="lfeNote"></div>'
      + '</div>';
  }

  function go(url) {
    if (PP) { url += (url.indexOf('?') > -1 ? '&' : '?') + 'id=' + encodeURIComponent(PP); }
    location.href = url;
  }
  window.lfeGo = go;
  window.lfeShowroom = function () { location.href = SHOWROOM; };

  function btn(cls, label, onclick) {
    return '<button type="button" class="lfe-b ' + cls + '" onclick="' + onclick + '">' + label + '</button>';
  }

  function paint() {
    var box = document.getElementById('lfeBox');
    var btns = document.getElementById('lfeBtns');
    var note = document.getElementById('lfeNote');
    var sel = document.getElementById('lfeSel');
    if (!box || !btns || !note || !sel) { return; }

    if (!DATA) { box.style.display = 'none'; btns.innerHTML = ''; note.innerHTML = ''; return; }
    box.style.display = 'block';

    var k = sel.value, s = DATA[k] || {}, nm = NAME[k], d = DEST[k], v = VERB[k];
    var h = '', n = '';

    if (!s.owned) {
      btns.innerHTML = btn('look', '어떤 것인지 보러 가기', 'lfeShowroom()');
      note.innerHTML = '이 여권에는 아직 <b>' + nm + '</b>이(가) 없어요.<br>어떤 것인지 먼저 보고 오세요.';
      return;
    }

    if (k === 'memoir') {
      if (s.writing > 0) { h += btn('', v.cont, "lfeGo('" + d.cont + "')"); }
      if (s.done > 0)    { h += btn(s.writing > 0 ? 'sub' : '', v.read, "lfeGo('" + d.read + "')"); }
      if (s.writing === 0 && s.done === 0) { h += btn('', v.start, "lfeGo('" + d.cont + "')"); }
      else if (s.left > 0 && s.writing === 0) { h += btn('sub', '다음 이야기 쓰러 가기', "lfeGo('" + d.cont + "')"); }

      if (s.done > 0 && s.left > 0) { n = '<b>' + s.done + '편</b>을 마치셨어요. <b>' + s.left + '편</b> 더 쓰실 수 있어요.'; }
      else if (s.done > 0)          { n = '<b>' + s.done + '편</b>을 마치셨어요.'; }
      else if (s.writing > 0)       { n = '쓰시던 이야기가 있어요. 이어서 쓰실 수 있어요.'; }
      else if (s.left > 0)          { n = '<b>' + s.left + '편</b>을 쓰실 수 있어요.'; }
    } else if (s.done) {
      h = btn('', v.read, "lfeGo('" + d.read + "')");
      if (k === 'letter') { h += btn('sub', v.cont, "lfeGo('" + d.cont + "')"); }
      n = '마치신 ' + nm + '이(가) 있어요.';
    } else {
      h = btn('', v.start, "lfeGo('" + d.cont + "')");
      n = '아직 떠나지 않으셨어요. 지금 시작하실 수 있어요.';
    }

    btns.innerHTML = h; note.innerHTML = n;
  }

  /* 하다 만 것이 있으면 그것을, 없으면 이 화면 상품을 먼저 고릅니다 */
  function pick() {
    var d = DATA; if (!d) { return here() || 'map'; }
    if (d.memoir && d.memoir.owned && d.memoir.writing > 0) { return 'memoir'; }
    var h = here();
    if (h && d[h] && d[h].owned) { return h; }
    if (d.memoir && d.memoir.owned) { return 'memoir'; }
    if (d.letter && d.letter.owned) { return 'letter'; }
    return 'map';
  }

  function lookup(pp) {
    PP = pp;
    var cb = 'lfecb_' + Date.now();
    window[cb] = function (res) {
      try { delete window[cb]; } catch (e) { window[cb] = undefined; }
      if (!res || !res.ok) { return; }
      DATA = res;
      var sel = document.getElementById('lfeSel');
      if (sel) { sel.value = pick(); }
      paint();
    };
    var sc = document.createElement('script');
    sc.src = GAS + '?action=have&id=' + encodeURIComponent(pp) + '&callback=' + cb;
    sc.onerror = function () { try { delete window[cb]; } catch (e) {} };
    document.body.appendChild(sc);
  }

  function watch() {
    var el = document.getElementById('lfeIn'); if (!el) { return; }
    var v = (el.value || '').trim().toUpperCase();
    if (!/^LF[ML]?-[A-Z0-9]{4,}$/.test(v)) { DATA = null; paint(); return; }
    if (v === PP && DATA) { return; }
    if (TIMER) { clearTimeout(TIMER); }
    TIMER = setTimeout(function () { lookup(v); }, 450);
  }

  /* 옛 이어가기 부품이 그린 칸은 걷어냅니다 — 같은 일을 두 벌 보이지 않게 */
  function sweep() {
    var old = document.getElementById('lfres');
    if (old && old.parentNode) { old.parentNode.removeChild(old); }
  }

  function boot() {
    if (skip()) { return; }
    if (document.getElementById('lfeIn')) { return; }

    var host = document.createElement('div');
    host.className = 'lfent';
    host.id = 'lfEnter';
    host.innerHTML = html();

    var way = document.getElementById('lfway');
    var foot = document.getElementById('lfFoot');
    if (way && way.parentNode) { way.parentNode.insertBefore(host, way); }
    else if (foot && foot.parentNode) { foot.parentNode.insertBefore(host, foot); }
    else { document.body.appendChild(host); }

    css();

    var input = document.getElementById('lfeIn');
    if (input) {
      input.addEventListener('input', watch);
      var k = known();
      if (k) { input.value = k; }
    }
    var find = document.getElementById('lfeFind');
    if (find) { find.onclick = function () { location.href = '/find/'; }; }
    var sel = document.getElementById('lfeSel');
    if (sel) { sel.onchange = paint; }

    sweep();
    setTimeout(sweep, 400);
    setTimeout(sweep, 1200);

    paint();
    watch();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }
})();
