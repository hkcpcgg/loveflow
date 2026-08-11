/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/enter.js · v9 · 260811 — ★부품이 길 셋 알약 줄 안으로 들어가 앉던 것 해소(대표 지적 260811). 공유 원을 알약 줄 오른쪽 끝에 붙이려고 길 셋을 「가로 한 줄(.lff-wayrow)」로 감싸는데, 그 감싼 줄이 먼저 만들어지면 부품이 그 줄 ★안에 끼어들었습니다. 셋이 폭을 나눠 가져 여권칸이 186~234px 로 눌리고, 길 셋은 오른쪽에서 두 줄로 접히고, 공유 원은 세로로 길어진 줄 한가운데에 떴습니다. 화면마다 알약 글자 수가 달라 남는 폭도 달라져 본문이 좌우로 흔들렸습니다. 여덟 화면에서 실측(index 는 붙는 차례가 매번 달라 깨졌다 말았다 하는 경합이었습니다). [고침] ①감싼 줄이 있으면 그 줄 ★위에 놓습니다. ②길 셋도 자리표도 없는 화면(편지)에서 body 끝에 떨어져 오른쪽에 낑기던 것 — 저작권 덩어리 앞에 놓습니다. [무손] 조회 GAS 주소·DEST·VERB·NAME·발권 지켜보기·CSS·자리표 규칙·문구 전부 한 글자도 안 건드렸습니다. — v8 · 260810 — ★「사랑흐름 여권 찾기」가 화면에서 아예 안 보이던 것 해소 — 원인이 둘이었습니다. [원인①] ☰ 드로어 메뉴에도 같은 글자가 있는데 부품이 그걸 중복으로 보고 자기 줄을 감춰습니다. 드로어는 항상 숨어 있는 메뉴라 화면에 보이는 것과 다릅니다. 이제 ★눈에 보이고 ☰ 메뉴·드로어 밖에 있는 링크만 중복으로 칩니다 (드로어는 화면 밖으로 밀려만 있어 숨음 판정에 안 잡힙니다). [원인②] 더 큰 것은 CSS 였습니다 — 부품이 자리표(inslot) 안에 들어가면 표제 두 줄과 찾기 줄을 한 묶음으로 display:none 했습니다. 표제가 두 번 보이던 것을 막으려다 찾기 줄까지 만 사람을 잔은 것입니다. 이제 표제 두 줄만 감추고 찾기 줄은 번호칸 밑에 작게 남깁니다. — v7 · 260810 — ★번호를 넣었는데 아무 것도 안 나오던 것 해소(대표 지적). [원인] 번호를 넣으면 0.45초 기다렸다 바깥 조회를 다녀오고, 그 답이 와야만 문이 섬습니다. 답이 안 오면 문도 안내도 오류도 없이 조용히 끝났습니다. [고침] ①번호 모양만 맞으면 ★그 자리에 바로 문을 세웁니다(basic). 조회는 뒤에서 돌고, 답이 오면 그때 정확한 문으로 바꿉니다. ②조회가 막혀도 문은 열려 있습니다 — 지도·편지는 「번호가 있으면 역다」가 확정 원칙입니다. ③번호를 ★기기의 기억에서도 찾습니다(지금까지 주소와 그 창의 기억만 봤습니다). ④화면에 들어오자마자 아는 번호가 있으면 첫 문을 먼저 세웁니다. ★화면은 이제 꿀리표를 모릅니다 — /lf/pass.js 가 이 부품을 불러오고, 판 번호는 pass.js 의 PART_V 한 글자입니다. [무손] 조회 GAS 주소·DEST·VERB·NAME·발권 지켜보기·CSS·자리표 규칙 전부. — ★고르는 자리인지 알 수 없던 것 해소(대표 지적). ①위에 안내 한 줄 「어느 여행을 이어가시겠어요?」를 세웁니다 — 아래 상자가 고르는 자리라는 것을 먼저 말합니다. ②고르는 자리는 ★흰 바탕 + 테두리 + 또렷한 화살표(▾)로, 누르는 버튼은 채워진 색으로 갈랐습니다. 지금까지 셋 다 연한 파랑이라 버튼 셋으로 보였습니다. 글자도 16px 로 키웠습니다. ③「LF-XXXXX 여권으로 보고 계십니다」가 안내문보다 크고 진해 제목처럼 보이던 것 — 작고 옅게 낮춰 뒤로 물렸습니다. ④버튼에 옅은 그림자를 넣어 눌리는 것임을 보탰습니다. ★한 파일만 고치면 열세 화면이 함께 바뀝니다. 화면에서 부를 때 꼬리표를 v6 으로 올리십시오. — ★사이트 밖(편지 GAS 웹앱)에서도 쓰도록. GAS 는 script.google.com 에서 iframe 안으로 돌기 때문에 상대주소가 안 통하고 부모 창을 움직여야 합니다. 주소 판별(inGas)로 그때만 절대주소(www.loveflow.ai.kr)를 붙이고 window.top 을 움직입니다. 사이트 안에서는 지금까지와 똑같이 동작합니다. 쇼룸·여권 찾기도 같은 길을 씁니다. ★화면에서 부를 때 꼬리표를 v5 로 올리십시오. — ★비켜 가는 곳을 reenter 하나로 줄입니다(대표 지적). v3 까지는 홈·입장·지도 답하는 중·편지 쓰는 중·자서전 쓰는 중 다섯을 비켜 갔는데, 오늘 목적이 「어느 화면에서든 지난 작업을 이어가고 결과를 볼 수 있게」였습니다. 전부 엽니다. 쓰던 중인 화면에서도 답이 날아가지 않도록 부품은 언제나 길 셋 위(화면 맨 아래)에 놓입니다. 자리표(lfEnterSlot)를 둔 화면에서는 그 자리에 들어가고 표제·찾기 링크를 감춥니다. ★화면에서 부를 때 /lf/enter.js?v=4 로 꼬리표를 붙이십시오 — 안 붙이면 옛 판이 캐시로 잡힙니다. — ★자리표에 확실히 붙게 + 표제 중복 제거(대표 지적). ①화면이 <div id="lfEnterSlot"> 를 두면 반드시 그 안에 들어가고, 그때는 부품의 표제 두 줄과 찾기 링크를 감춥니다 — 그 화면이 이미 「여기서 여권을 넣으세요」라고 말한 자리이므로 한 화면에 표제가 둘이 되지 않게. ②자리표도 길 셋도 아직 없으면 0.25초 뒤 한 번 더 붙여 봅니다(화면이 늦게 그리는 경우). ③★화면에서 부를 때 /lf/enter.js?v=3 처럼 꼬리표를 붙이십시오 — 안 붙이면 옛 판이 캐시로 잡혀 엉뚱한 자리에 붙습니다. — ①안 까는 곳에 홈(/)과 입장(/enter) 추가. 홈은 처음 오신 분이 대부분이고, 입장은 발권 직후라 이미 손에 여권이 있습니다. ②조회가 돌면 「LF-XXXXX 여권으로 보고 계십니다」를 띄웁니다 — 어느 여권인지 안 보이던 것. ③화면이 <div id="lfEnterSlot"></div> 를 두면 그 자리에 들어갑니다(gate 처럼 자리가 정해진 화면용). ④화면에 이미 「사랑흐름 여권 찾기」가 있으면 부품 것은 감춥니다 — 두 번 보이던 것. ⑤★발권 지켜보기 — gate 에서 여권이 나오면 그 번호를 받아 곧바로 이어 갑니다. issue() 는 절대보존이라 한 글자도 건드리지 않고 부품이 지켜보기만 합니다(2초 간격·최대 1분).
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
    /* ★260804 대표 확정 — 어느 화면에서든 지난 작업을 이어가고 결과를 볼 수 있어야 합니다.
       비켜 가는 곳은 reenter 하나뿐입니다(그 화면이 이미 통째로 입구라 두 벌이 됩니다).
       쓰던 중인 화면에서도 답이 날아가지 않도록, 부품은 언제나 길 셋 위(화면 맨 아래)에 놓입니다. */
    if (p.indexOf('/reenter') === 0) { return true; }
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
    if (!v) { try { v = localStorage.getItem('lf_passport') || ''; } catch (e) {} }   /* [260810] ★기기의 기억 */
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
      + '.lfent .lfe-lead{margin-top:14px;font-size:12.5px;font-weight:700;color:#7A8794;letter-spacing:-.2px}'
      /* 고르는 자리 = 흰 바탕에 테두리 + 화살표. 누르는 자리(버튼)와 눈으로 갈립니다. */
      + '.lfent .lfe-sel{width:100%;height:52px;margin-top:6px;border:1.5px solid #C7D5E2;border-radius:14px;'
      + 'background-color:#fff;color:#1E4A76;font-size:16px;font-weight:800;font-family:inherit;'
      + 'padding:0 42px 0 16px;outline:none;-webkit-appearance:none;appearance:none;box-sizing:border-box;'
      + 'background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'9\'%3E%3Cpath d=\'M1 1.5l6 6 6-6\' fill=\'none\' stroke=\'%231E4A76\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E");'
      + 'background-repeat:no-repeat;background-position:right 16px center}'
      + '.lfent .lfe-sel:focus{border-color:#1E4A76}'
      + '.lfent .lfe-btns{display:flex;flex-direction:column;gap:9px;margin-top:10px}'
      + '.lfent .lfe-b{width:100%;min-height:50px;padding:12px 14px;border-radius:14px;border:none;cursor:pointer;'
      + 'font-family:inherit;font-size:15px;font-weight:800;letter-spacing:-.3px;line-height:1.4;background:#1E4A76;color:#fff}'
      + '.lfent .lfe-b.sub{background:#F7FAFD;color:#1E4A76;border:1.5px solid #D8E2EC}'
      + '.lfent .lfe-b.look{background:#FBEFD5;color:#8A6D28;border:1.5px solid #E6C97A}'
      + '.lfent .lfe-b:active{opacity:.6}'
      + '.lfent .lfe-pp{text-align:center;font-size:11.5px;font-weight:500;color:#9AA5B1;margin-top:10px;letter-spacing:.3px}'
      + '.lfent .lfe-n{margin-top:9px;font-size:12.5px;line-height:1.65;color:#7A8794;text-align:center}'
      + '.lfent .lfe-n b{color:#1E4A76}'
      + '.lfent .lfe-find{display:block;text-align:center;margin-top:10px;font-size:12px;color:#8A6D28;'
      + 'text-decoration:underline;cursor:pointer}'
      + '.lfent .lfe-box{display:none}'
      + '.lfent.inslot{margin-top:2px}'
      /* [260810] ★찾기 줄(.lfe-find)을 이 묶음에서 빼냅니다.
         260804에 표제가 두 번 보이던 것을 막으려고 셀을 묶었는데,
         번호를 잃으신 분이 볼 「여권 찾기」까지 같이 사라졌습니다.
         표제 두 줄만 감추고 찾기 줄은 번호칸 밑에 작게 남깁니다. */
      + '.lfent.inslot .lfe-h,.lfent.inslot .lfe-s{display:none}'
      + '.lfent.inslot .lfe-find{margin-top:8px}'
      + '.lfent .lfe-btns .lfe-b{box-shadow:0 2px 8px rgba(30,74,118,.14)}'
      + '@media print{.lfent{display:none !important}}';
    document.head.appendChild(s);
  }

  function html() {
    return '<div class="lfe-h">여권으로 문을 엽니다</div>'
      + '<div class="lfe-s">받으신 <b>사랑흐름 여권번호</b>를 넣어 주세요.<br>지난 여행이 그대로 이어집니다.</div>'
      + '<input class="lfe-in" id="lfeIn" placeholder="LF-XXXXX" inputmode="text" autocomplete="off">'
      + '<a class="lfe-find" id="lfeFind">번호가 기억나지 않으시면 · 사랑흐름 여권 찾기 &rarr;</a>'
      + '<div class="lfe-box" id="lfeBox">'
      +   '<div class="lfe-pp" id="lfePp"></div>'
      +   '<div class="lfe-lead">어느 여행을 이어가시겠어요?</div>'
      +   '<select class="lfe-sel" id="lfeSel">'
      +     '<option value="map">마음 여행지도</option>'
      +     '<option value="letter">마음 여행편지</option>'
      +     '<option value="memoir">한 편의 기록</option>'
      +   '</select>'
      +   '<div class="lfe-btns" id="lfeBtns"></div>'
      +   '<div class="lfe-n" id="lfeNote"></div>'
      + '</div>';
  }

  /* 사이트 밖(GAS 웹앱)에서 불릴 때는 상대주소가 안 통하고, iframe 안이라 부모 창을 움직여야 합니다. */
  var HOME = 'https://www.loveflow.ai.kr';
  function abs(u) { return (u.charAt(0) === '/') ? (HOME + u) : u; }
  function inGas() { return location.hostname.indexOf('script.google') >= 0; }
  function go(url) {
    if (PP) { url += (url.indexOf('?') > -1 ? '&' : '?') + 'id=' + encodeURIComponent(PP); }
    if (inGas()) { url = abs(url); }
    try {
      if (window.top && window.top !== window) { window.top.location.href = url; return; }
    } catch (e) {}
    location.href = url;
  }
  window.lfeGo = go;
  window.lfeShowroom = function () {
    var u = inGas() ? abs(SHOWROOM) : SHOWROOM;
    try { if (window.top && window.top !== window) { window.top.location.href = u; return; } } catch (e) {}
    location.href = u;
  };

  function go2(url) {
    var u = inGas() ? abs(url) : url;
    try { if (window.top && window.top !== window) { window.top.location.href = u; return; } } catch (e) {}
    location.href = u;
  }
  function btn(cls, label, onclick) {
    return '<button type="button" class="lfe-b ' + cls + '" onclick="' + onclick + '">' + label + '</button>';
  }

  /* [260810] ★기본 문 — 번호 모양만 맞으면 바깥에 묻기 전에 먼저 문을 엽니다.
     지도·편지는 「번호가 있으면 역다」가 확정 원칙이라, 조회를 기다리게 하지 않습니다.
     조회가 돌아오면 paint() 가 정확한 문으로 바꿉니다. */
  function basic() {
    var box = document.getElementById('lfeBox');
    var btns = document.getElementById('lfeBtns');
    var note = document.getElementById('lfeNote');
    var sel = document.getElementById('lfeSel');
    if (!box || !btns || !note || !sel || !PP) { return; }
    box.style.display = 'block';
    var pel = document.getElementById('lfePp');
    if (pel) { pel.textContent = PP + ' 여권으로 보고 계십니다'; }
    var k = sel.value || here() || 'map';
    var d = DEST[k], v = VERB[k];
    if (!d || !v) { return; }
    btns.innerHTML = btn('', v.cont, "lfeGo('" + d.cont + "')");
    note.innerHTML = '바로 이어가실 수 있어요.';
  }

  function paint() {
    var box = document.getElementById('lfeBox');
    var btns = document.getElementById('lfeBtns');
    var note = document.getElementById('lfeNote');
    var sel = document.getElementById('lfeSel');
    if (!box || !btns || !note || !sel) { return; }

    if (!DATA) {
      if (PP) { basic(); return; }                                  /* [260810] ★조회 전·조회 실패에도 문은 열려 있습니다 */
      box.style.display = 'none'; btns.innerHTML = ''; note.innerHTML = ''; return;
    }
    box.style.display = 'block';
    var pel = document.getElementById('lfePp');
    if (pel) { pel.textContent = PP ? (PP + ' 여권으로 보고 계십니다') : ''; }

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
    sc.onerror = function () { try { delete window[cb]; } catch (e) {} basic(); };   /* [260810] ★문은 그대로 */
    document.body.appendChild(sc);
  }

  function watch() {
    var el = document.getElementById('lfeIn'); if (!el) { return; }
    var v = (el.value || '').trim().toUpperCase();
    if (!/^LF[ML]?-[A-Z0-9]{4,}$/.test(v)) { PP = ''; DATA = null; paint(); return; }
    if (v === PP && DATA) { return; }
    if (v !== PP) { PP = v; DATA = null; basic(); }   /* [260810] ★넣는 순간 문이 섭니다 */
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

    /* 화면이 자리표를 두었으면 반드시 그 자리에. 자리표가 있는 화면은
       그 화면이 이미 「여기서 여권을 넣으세요」라고 말한 자리이므로
       부품의 표제 두 줄과 찾기 링크를 감춥니다(한 화면에 표제가 둘이 되지 않게). */
    var slot = document.getElementById('lfEnterSlot');
    var way = document.getElementById('lfway');
    var foot = document.getElementById('lfFoot');

    /* ★[v9 · 260811] 길 셋이 공유 원과 함께 「가로 한 줄(.lff-wayrow)」로 감싸져 있으면,
       그 줄 ★안에 들어가면 안 됩니다. 줄 안은 알약과 공유가 나란히 서는 자리라,
       부품이 끼어들면 셋이 폭을 나눠 갖습니다 — 여권칸이 234px 로 눌리고
       길 셋은 오른쪽에서 두 줄로 접히고 공유 원은 줄 한가운데 뜹니다.
       감싼 줄이 있으면 ★그 줄 위에 놓습니다. */
    var anchor = way;
    if (way && way.parentNode && way.parentNode.className
        && String(way.parentNode.className).indexOf('lff-wayrow') > -1) {
      anchor = way.parentNode;
    }

    /* ★[v9] 길 셋도 자리표도 없는 화면(편지처럼 길을 일부러 안 까는 곳)에서
       지금까지는 body 끝에 떨어져 오른쪽에 세로로 낑겼습니다.
       저작권 덩어리를 찾아 그 앞에 놓습니다. */
    var tail = foot || document.querySelector('.lf-foot') || document.querySelector('.legal')
            || document.querySelector('.glegal') || document.querySelector('.foot')
            || document.querySelector('footer');

    if (slot) { host.className = 'lfent inslot'; slot.appendChild(host); }
    else if (anchor && anchor.parentNode) { anchor.parentNode.insertBefore(host, anchor); }
    else if (tail && tail.parentNode && tail.parentNode !== document.documentElement) {
      tail.parentNode.insertBefore(host, tail);
    }
    else { document.body.appendChild(host); }

    css();

    var input = document.getElementById('lfeIn');
    if (input) {
      input.addEventListener('input', watch);
      var k = known();
      if (k) { input.value = k; PP = k; setTimeout(function(){ basic(); lookup(k); }, 0); }   /* [260810] ★첫 문 */
    }
    var find = document.getElementById('lfeFind');
    if (find) {
      /* 화면에 이미 「사랑흐름 여권 찾기」가 있으면 두 번 보이지 않게 감춥니다 */
      /* [260810] ★☰ 드로어처럼 숨어 있는 메뉴는 중복으로 치지 않습니다.
         지금까지는 드로어에 「사랑흐름 여권 찾기」가 있다는 이유로 자기 줄을 감춰,
         번호를 잃으신 분이 화면 어디에서도 찾기 길을 볼 수 없었습니다. */
      var dup = null;
      var cands = document.querySelectorAll('a[href="/find/"], a[href="/find"]');
      for (var ci = 0; ci < cands.length; ci++) {
        var c = cands[ci];
        if (c === find) { continue; }
        if (c.offsetParent === null) { continue; }              /* 안 보이면 없는 셈 */
        try {
          /* ☰ 메뉴·드로어·상단바 안에 있는 것은 화면에 드러난 것이 아닙니다.
             드로어는 화면 밖으로 밀려만 있어서 숨음 판정에 안 잡힙니다. */
          if (c.closest && c.closest('.lf-menu, #drawer, .drawer, nav, .gnav, .lf-nav')) { continue; }
        } catch (e) {}
        dup = c; break;
      }
      if (dup) { find.style.display = 'none'; }
      else { find.onclick = function () { go2('/find/'); }; }
    }
    var sel = document.getElementById('lfeSel');
    if (sel) { sel.onchange = paint; }

    sweep();
    setTimeout(sweep, 400);
    setTimeout(sweep, 1200);

    /* ★발권 지켜보기 — gate 에서 여권이 나오면 그 번호를 받아 그대로 이어 갑니다.
       issue() 는 절대보존 대상이라 한 글자도 건드리지 않고, 여기서 지켜보기만 합니다. */
    var tries = 0;
    var eye = setInterval(function () {
      tries += 1;
      if (tries > 30) { clearInterval(eye); return; }
      var got = '';
      try { got = window.lfIssuedPassport || sessionStorage.getItem('lf_passport') || ''; } catch (e) {}
      got = String(got).trim().toUpperCase();
      if (!got || got === PP) { return; }
      var box2 = document.getElementById('lfeIn');
      if (box2 && !(box2.value || '').trim()) { box2.value = got; }
      clearInterval(eye);
      lookup(got);
    }, 2000);

    paint();
    watch();
  }

  function start() {
    /* 자리표가 아직 안 그려졌을 수 있습니다. 있으면 그때 붙입니다. */
    if (!document.getElementById('lfEnterSlot') && !document.getElementById('lfway')) {
      setTimeout(function () { boot(); }, 250);
      return;
    }
    boot();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); }
  else { start(); }
})();
