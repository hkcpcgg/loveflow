/* ═══════════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/frame.js · v6 · 261005 · [칸 27-4 · 화면 안 「‹ 이전」] 차례가 있는 화면(발권 · 입금 정보 · 이름 남기기 · 동의 · 입장)에서 옛 위 띠의 「‹」가 사라져 뒤로 갈 길이 휴대폰 뒤로 단추뿐이던 것 — <body data-lf-back="/돌아갈곳"> 이 있으면 위 띠 바로 아래에 작은 「‹ 이전」 줄을 깜(앞 화면이 사이트 안이면 그리로, 아니면 적어 둔 곳으로).
   (이전) v5 · 261005 · [칸 27-4 · 대표 결정 261005 00:35] 아래 띠 「제휴」 셋 → 둘 — 「안내자 · 제휴 신청」(/partner.html · 안내자 되기와 사업 제휴를 한 화면으로) · 「기관 · 단체」(/proposal.html). ☰ 카드 이름도 「안내자 · 제휴 신청」.
   (이전) v4 · 261004 · [칸 27-4 · 나머지 화면에 틀 붙이기] 옛 상단바 한 종류 더 감춤(.lf-nav · #lfBackdrop — 발권 · 입금 정보 등 21곳이 쓰던 것) · 화면 이름을 .lf-nav .loc 에서도 읽음 · ★첫 주소(/)는 안내 홈 — 마음 한마디 길을 /hanmadi/ 로(아래 띠 맛보기 · ☰), / 에서는 아래 띠 불 안 켬 · ★위 띠 오른쪽 자리(data-lfx-top) — 화면이 꼭 위에 두어야 하는 단추(마음 한마디 소리 켜고 끄기 등)를 ☰ 왼쪽으로 옮겨 붙임(제목 가운데는 그대로).
   (이전) v3 · 261004 · [칸 27-3] 알맹이 부품 lf/look.css 를 함께 붙임(화면에 따로 안 적어도 됨).
   (이전) v2 · 261004 · [칸 27-2 · 대표 실폰 확인 지적] ★떠 있는 「안내 받아보기」 단추(#lfgBub) · 옛 공유 동그라미(↗)를 붙인 화면에서 감춤 — 안내 받기는 아래 띠 「둘러보기」에, 공유는 ☰ 메뉴 「공유하기」로.
   (이전) v1 · 261004 · [자서전 공사 칸 27-2 · 화면 틀 공용 부품]
   사랑흐름 화면 틀 — 위 띠 · ☰ 메뉴 · 아래 길목 띠(다섯 묶음) · 올라오는 판.
   이 한 파일만 고치면 붙인 화면이 함께 바뀝니다(기준서 「칸27_화면틀_기준서_261004」).

   [쓰는 법] 화면 </body> 바로 앞에 한 줄
       <script src="/lf/frame.js?v=1"></script>
     · 화면 이름: <body data-lf-title="내 이야기 목록"> 가 있으면 그것,
       없으면 옛 상단바의 가운데 글(.gnav .lc · #loc), 그것도 없으면 <title> 앞부분.
     · 붙이면 그 화면의 옛 상단바(.gnav · .topbar) · 옛 메뉴(.gdrawer · .drawer · #lfMenu)
       · 옛 길 셋(.lfway)은 감춥니다(지우지 않음 — 되돌리기 쉽게).
   [틀] 위 띠(딥네이비 · 왼쪽 로고 = 홈 · 화면 이름 · ☰)
        아래 띠(딥네이비 · 같은 크기 동그라미 다섯 · 누르면 그 묶음 칸이 아래에서 올라옴)
        · 글 쓰는 칸을 누르면(자판) 아래 띠가 숨음 · 인쇄 때 위아래 띠 빠짐
   [색] 딥네이비 = 틀 · 누르는 곳 / 골드 = 소중한 것 / 오렌지(살구) = 지금 여기 · 새것
   [원칙] 백틱 금지 · 문자열 연결(+)만 · 아이콘은 모두 동그라미 · 이모지 대신 선 아이콘
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  if (window.LFFrame) { return; }

  var C = { navy: '#1E4A76', gold: '#C9A96E', peach: '#E59273', cream: '#FFFCF7', sand: '#F4EEE4' };

  /* ── 선 아이콘 한 벌 (24 상자) ── */
  var IC = {
    pass:   '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 16h6"/>',
    find:   '<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',
    mem:    '<path d="M5 4h10a2 2 0 012 2v14H7a2 2 0 01-2-2z"/><path d="M8 8h6M8 11h6"/><path d="M19 7l2 2-6 6-2 .5.5-2z"/>',
    spark:  '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    word:   '<path d="M4 5h16v11H9l-5 4z"/>',
    draw:   '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L11 11l-2.5 4.5L13 13z"/>',
    ticket: '<path d="M4 8a2 2 0 002-2h12a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 000-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
    map:    '<path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/>',
    letter: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    two:    '<circle cx="8.5" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><path d="M3.5 19c0-2.5 2.2-4.2 5-4.2s5 1.7 5 4.2"/><path d="M14.6 15.1c2.4.2 4.4 1.8 4.4 3.9"/>',
    group:  '<circle cx="12" cy="8" r="3"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/>',
    show:   '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/>',
    chat:   '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    hand:   '<path d="M3 12l4-4 4 2 3-2 7 5-4 4-3-1-3 3-3-1-3-3z"/><path d="M11 10l3 3"/>',
    build:  '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
    menu:   '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x:      '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  function svg(k, s) {
    return '<svg viewBox="0 0 24 24" width="' + (s || 18) + '" height="' + (s || 18) + '" fill="none" stroke="currentColor" '
      + 'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || '') + '</svg>';
  }

  /* ── 길목 다섯 묶음 · 그 안의 칸 ── */
  var GROUPS = [
    { k: 'mine', t: '내 여행', ic: 'pass', c: '#C9A96E', items: [
      { t: '마음 여행여권으로 입장', s: '쓰던 곳으로 바로', ic: 'pass', c: '#C9A96E', u: '/reenter.html' },
      { t: '사랑흐름 여권 찾기', s: '번호가 기억나지 않을 때', ic: 'find', c: '#7F97B2', u: '/find/' },
      { t: '내 기록 보기', s: '쓴 글 · 완성된 기록', ic: 'mem', c: '#C0872E', u: '/memoir/home.html' }
    ] },
    { k: 'taste', t: '맛보기', ic: 'spark', c: '#8A6FC9', sub: '무료로 해 보기', items: [
      { t: '마음 한마디', s: '오늘 마음을 한마디로', ic: 'word', c: '#E59273', u: '/hanmadi/' },
      { t: '삐뚤빼뚤 마음 도화지', s: '손가락으로 그려 보내기', ic: 'draw', c: '#8A6FC9', u: '/draw/' },
      { t: '관계 나침반', s: '무료로 먼저 해 보기', ic: 'compass', c: '#1D9E75', u: '/compass.html' }
    ] },
    { k: 'buy', t: '예매하기', ic: 'ticket', c: '#E58A5F', items: [
      { t: '마음여행', s: '여행지도와 편지', ic: 'letter', c: '#1E4A76', u: '/pay.html?item=set' },
      { t: '한 편의 기록', s: '나의 이야기를 한 편씩', ic: 'mem', c: '#C0872E', u: '/pay.html?item=memoir' },
      { t: '두 분의 여정', s: '지도 · 편지 · 기록까지', ic: 'two', c: '#C25B7C', u: '/pay.html?item=life' },
      { t: '마음 여행지도', s: '나를 먼저 돌아보기', ic: 'map', c: '#1D9E75', u: '/pay.html?item=map' },
      { t: '단체 · 기관', s: '여럿이 함께 떠나기', ic: 'group', c: '#5C7FA6', u: '/proposal.html' }
    ] },
    { k: 'look', t: '둘러보기', ic: 'show', c: '#C25B7C', items: [
      { t: '여행의 기록', s: '먼저 다녀간 분들의 이야기', ic: 'show', c: '#C25B7C', u: '/showroom.html' },
      { t: '자서전 소개', s: '한 편의 기록이 무엇인지', ic: 'mem', c: '#C0872E', u: '/memoir/' },
      { t: '안내 받기', s: '전화로 차근차근 안내해 드려요', ic: 'chat', c: '#1D9E75', u: '/guide/?ask=1', ask: 1 }
    ] },
    { k: 'partner', t: '제휴', ic: 'hand', c: '#5C7FA6', items: [
      { t: '안내자 · 제휴 신청', s: '안내자로 함께하기 · 사업으로 제휴하기', ic: 'hand', c: '#5C7FA6', u: '/partner.html' },
      { t: '기관 · 단체', s: '복지 · 교육 · 공공 프로그램 제안', ic: 'build', c: '#1E4A76', u: '/proposal.html' }
    ] }
  ];

  /* 지금 화면이 어느 묶음인지 */
  function groupOfPath(p) {
    p = p || location.pathname;
    if (/^\/(memoir\/(home|ask|sign|book|ritual|friends|invite)|reenter|find|enter|gate|apply|youth)/.test(p)) { return 'mine'; }
    if (/^\/(hanmadi|draw|compass|free)/.test(p)) { return 'taste'; }   /* ★v4 첫 주소(/)는 안내 홈 — 어느 묶음에도 불 안 켬 */
    if (/^\/(pay|showcase)/.test(p)) { return 'buy'; }
    if (/^\/(showroom|memoir\/?$|memoir\/index|guide)/.test(p)) { return 'look'; }
    if (/^\/(partner|proposal)/.test(p)) { return 'partner'; }
    return '';
  }

  var CSS = ''
    + ':root{--lf-navy:' + C.navy + ';--lf-gold:' + C.gold + ';--lf-peach:' + C.peach + ';--lf-cream:' + C.cream + ';--lf-sand:' + C.sand + '}'
    /* 옛 틀 감춤 (붙인 화면만) */
    + 'html.lfx .gnav,html.lfx .topbar,html.lfx .gdrawer,html.lfx .drawer,html.lfx #lfMenu,html.lfx .lf-backdrop,html.lfx .lfway,html.lfx #lfway,html.lfx .lf-nav,html.lfx #lfBackdrop{display:none!important}'
    + 'html.lfx body{padding-top:52px!important;padding-bottom:calc(72px + env(safe-area-inset-bottom))!important}'
    /* 위 띠 */
    + '.lfx-top{position:fixed;top:0;left:0;right:0;z-index:1500;height:52px;display:flex;align-items:center;justify-content:space-between;gap:8px;'
    +   'padding:0 10px;background:var(--lf-navy);color:#fff;box-sizing:border-box;font-family:inherit}'
    + '.lfx-logo{width:36px;height:36px;border-radius:50%;background:#fff;display:grid;place-items:center;border:0;padding:0;cursor:pointer;flex:0 0 36px;overflow:hidden}'
    + '.lfx-logo img{width:28px;height:28px;object-fit:contain;display:block}'
    + '.lfx-title{flex:1;text-align:center;font-size:15.5px;font-weight:800;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.lfx-slot{position:absolute;right:54px;top:50%;transform:translateY(-50%);display:flex;gap:6px}'
    + '.lfx-slot>*{width:32px!important;height:32px!important;border-radius:50%!important;border:0!important;background:rgba(255,255,255,.12)!important;color:#fff!important;display:grid!important;place-items:center;padding:0!important;cursor:pointer;font-size:14px}'
    + '.lfx-top.has-slot .lfx-title{padding:0 38px}'
    + '.lfx-burger{width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;display:grid;place-items:center;cursor:pointer;flex:0 0 36px}'
    /* 아래 길목 띠 */
    + '.lfx-tab{position:fixed;left:0;right:0;bottom:0;z-index:1500;background:var(--lf-navy);display:flex;justify-content:space-around;align-items:center;'
    +   'height:64px;padding:0 4px env(safe-area-inset-bottom);box-sizing:content-box;transition:transform .18s}'
    + '.lfx-tab.hide{transform:translateY(110%)}'
    + '.lfx-tab button{flex:1;max-width:84px;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:0;color:#DCE6F1;font:inherit;font-size:10.5px;cursor:pointer;padding:6px 0}'
    + '.lfx-tab i{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;color:#fff;font-style:normal}'
    + '.lfx-tab button.on{color:#fff;font-weight:800}.lfx-tab button.on i{box-shadow:0 0 0 2px #fff}'
    /* 가림막 · 올라오는 판 */
    + '.lfx-dim{position:fixed;inset:0;z-index:1600;background:rgba(30,40,55,.38);opacity:0;visibility:hidden;transition:.2s}'
    + '.lfx-dim.on{opacity:1;visibility:visible}'
    + '.lfx-sheet{position:fixed;left:0;right:0;bottom:0;z-index:1700;max-width:560px;margin:0 auto;background:#fff;border-radius:22px 22px 0 0;'
    +   'padding:10px 16px calc(14px + env(safe-area-inset-bottom));box-shadow:0 -8px 24px rgba(0,0,0,.18);transform:translateY(105%);transition:transform .22s;font-family:inherit;box-sizing:border-box}'
    + '.lfx-sheet.on{transform:none}'
    + '.lfx-grab{width:40px;height:4px;border-radius:2px;background:#DDD6CB;margin:0 auto 10px}'
    + '.lfx-sh-t{display:flex;align-items:center;gap:10px;font-weight:900;font-size:16px;color:var(--lf-navy);margin-bottom:6px}'
    + '.lfx-sh-t small{font-weight:500;font-size:12px;color:#8a7a68}'
    + '.lfx-it{display:flex;align-items:center;gap:12px;width:100%;padding:11px 4px;border:0;border-top:1px solid #F3EADF;background:none;text-align:left;cursor:pointer;font:inherit;color:#2E3A46}'
    + '.lfx-it b{display:block;font-size:15px}.lfx-it small{display:block;font-size:12px;color:#8a7a68}'
    + '.lfx-ci{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;color:#fff;flex:0 0 34px}'
    + '.lfx-it.now{background:#FBF1E6;border-radius:12px}'
    /* ☰ 메뉴 */
    + '.lfx-menu{position:fixed;top:0;right:0;z-index:1700;width:84%;max-width:330px;height:100%;background:#fff;box-shadow:-8px 0 30px rgba(0,0,0,.18);'
    +   'transform:translateX(102%);transition:transform .24s;overflow-y:auto;padding:14px 14px 24px;box-sizing:border-box;font-family:inherit}'
    + '.lfx-menu.on{transform:none}'
    + '.lfx-mh{display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:17px;color:var(--lf-navy);margin:2px 2px 10px}'
    + '.lfx-mh button{width:34px;height:34px;border-radius:50%;border:0;background:#F4EEE4;color:var(--lf-navy);display:grid;place-items:center;cursor:pointer}'
    + '.lfx-grp{font-size:11.5px;font-weight:800;color:#8a7a68;margin:12px 4px 2px}'
    + '.lfx-mi{display:flex;align-items:center;gap:10px;width:100%;padding:8px 6px;border:0;border-radius:12px;background:none;cursor:pointer;font:inherit;font-size:14.5px;color:#2E3A46;text-align:left}'
    + '.lfx-mi.gold{background:#FBF5E8;font-weight:800}'
    + '.lfx-mi.now{background:#FBF1E6}.lfx-mi.now:after{content:"지금 여기";margin-left:auto;font-size:10.5px;color:#B4583A;background:#FCE7DE;border-radius:8px;padding:0 6px}'
    + '.lfx-two{display:grid;grid-template-columns:1fr 1fr;gap:2px}'
    + '.lfx-opp{margin-top:14px;border-radius:18px;padding:10px;background:linear-gradient(135deg,#FFF1E6,#FCE7EF)}'
    + '.lfx-ot{font-size:12px;font-weight:900;color:#B4583A;margin:0 2px 8px}'
    + '.lfx-big{display:flex;align-items:center;gap:10px;width:100%;border:0;border-radius:14px;padding:12px;color:#fff;margin-bottom:8px;cursor:pointer;font:inherit;text-align:left;box-shadow:0 4px 12px rgba(120,60,40,.18)}'
    + '.lfx-big i{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.22);flex:0 0 38px;font-style:normal}'
    + '.lfx-big b{display:block;font-size:15.5px}.lfx-big small{font-size:11.5px;opacity:.92}'
    + '.lfx-b1{background:linear-gradient(135deg,#E8875F,#D9663F)}'
    + '.lfx-b2{background:linear-gradient(135deg,#C25B7C,#A84466)}'
    + '.lfx-b3{background:linear-gradient(135deg,#1E4A76,#2C6399);box-shadow:inset 0 0 0 1.5px #C9A96E,0 4px 12px rgba(30,74,118,.2)}'
    + '.lfx-b3 i{background:#C9A96E;color:#1E4A76}'
    + '.lfx-restart{display:block;margin:10px 4px 0 auto;border:0;background:none;color:#8a7a68;font:inherit;font-size:12px;cursor:pointer}'
    + 'html.lfx #lfgBub,html.lfx .lff-share,html.lfx .lffsw,html.lfx .lff-sb{display:none!important}'
    + '.lfx-back{position:fixed;top:52px;left:0;right:0;z-index:1400;height:34px;display:flex;align-items:center;padding:0 12px;box-sizing:border-box;background:rgba(255,252,247,.94);border-bottom:1px solid rgba(234,223,207,.8)}'
    + 'html.lfx-hasback body{padding-top:86px!important}'
    + '.lfx-back button{border:0;background:none;color:var(--lf-navy);font:inherit;font-size:14.5px;font-weight:700;padding:4px 2px;cursor:pointer}'
    + '@media print{.lfx-back,.lfx-top,.lfx-tab,.lfx-sheet,.lfx-dim,.lfx-menu{display:none!important}html.lfx body{padding-bottom:0}}';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function titleOf() {
    var b = document.body && document.body.getAttribute('data-lf-title');
    if (b) { return b; }
    var el = document.querySelector('.gnav .lc, .gnav .loc, .lf-nav .loc, #loc, .topbar .ttl, .topbar .title');
    var t = el ? (el.textContent || '').trim() : '';
    if (t) { return t; }
    t = (document.title || '').replace(/^사랑흐름\s*[·|]\s*/, '').replace(/\s*[·|]\s*사랑흐름.*$/, '');
    return t || '사랑흐름';
  }

  var STATE = { open: '' };

  function go(u, ask) {
    if (ask && window.LFG && typeof window.LFG.open === 'function') { closeAll(); window.LFG.open('아래 띠'); return; }
    location.href = u;
  }

  function closeAll() {
    var ids = ['lfxDim', 'lfxSheet', 'lfxMenu'];
    for (var i = 0; i < ids.length; i++) { var e = document.getElementById(ids[i]); if (e) { e.classList.remove('on'); } }
    var bs = document.querySelectorAll('.lfx-tab button');
    var cur = groupOfPath();
    for (var j = 0; j < bs.length; j++) { bs[j].classList.toggle('on', bs[j].getAttribute('data-k') === cur); }
    STATE.open = '';
  }

  function openSheet(k) {
    if (STATE.open === k) { closeAll(); return; }
    var g = null;
    for (var i = 0; i < GROUPS.length; i++) { if (GROUPS[i].k === k) { g = GROUPS[i]; } }
    if (!g) { return; }
    var here = location.pathname + location.search;
    var h = '<div class="lfx-grab"></div>'
      + '<div class="lfx-sh-t"><span class="lfx-ci" style="background:' + g.c + '">' + svg(g.ic, 17) + '</span>'
      + esc(g.t) + (g.sub ? ' <small>' + esc(g.sub) + '</small>' : '') + '</div>';
    for (var j = 0; j < g.items.length; j++) {
      var it = g.items[j];
      var now = (it.u.split('?')[0] === location.pathname) && (!/\?/.test(it.u) || here.indexOf(it.u) >= 0);
      h += '<button class="lfx-it' + (now ? ' now' : '') + '" data-u="' + esc(it.u) + '"' + (it.ask ? ' data-ask="1"' : '') + '>'
        + '<span class="lfx-ci" style="background:' + it.c + '">' + svg(it.ic, 17) + '</span>'
        + '<span><b>' + esc(it.t) + '</b><small>' + esc(it.s) + '</small></span></button>';
    }
    var sh = document.getElementById('lfxSheet');
    sh.innerHTML = h;
    var bs = sh.querySelectorAll('.lfx-it');
    for (var b = 0; b < bs.length; b++) {
      bs[b].onclick = function () { go(this.getAttribute('data-u'), this.getAttribute('data-ask') === '1'); };
    }
    var tb = document.querySelectorAll('.lfx-tab button');
    for (var t = 0; t < tb.length; t++) { tb[t].classList.toggle('on', tb[t].getAttribute('data-k') === k); }
    document.getElementById('lfxMenu').classList.remove('on');
    document.getElementById('lfxDim').classList.add('on');
    sh.classList.add('on');
    STATE.open = k;
  }

  function menuHtml() {
    var p = location.pathname;
    function mi(t, ic, c, u, cls) {
      var now = (u === p) || (u !== '/' && u.length > 1 && p.indexOf(u.replace(/index\.html$/, '')) === 0 && u.slice(-1) === '/');
      return '<button class="lfx-mi' + (cls ? ' ' + cls : '') + (now ? ' now' : '') + '" data-u="' + u + '">'
        + '<span class="lfx-ci" style="background:' + c + ';width:30px;height:30px;flex-basis:30px">' + svg(ic, 16) + '</span>' + t + '</button>';
    }
    return ''
      + '<div class="lfx-mh"><span>사랑흐름</span><button data-x="1" aria-label="닫기">' + svg('x', 16) + '</button></div>'
      + mi('마음 여행여권으로 입장', 'pass', '#C9A96E', '/reenter.html', 'gold')
      + mi('사랑흐름 여권 찾기', 'find', '#7F97B2', '/find/')
      + '<div class="lfx-grp">여행</div>'
      + '<div class="lfx-two">'
      +   mi('마음 한마디', 'word', '#E59273', '/hanmadi/')
      +   mi('마음 도화지', 'draw', '#8A6FC9', '/draw/')
      +   mi('여행지도', 'map', '#1D9E75', '/journey/')
      +   mi('편지', 'letter', '#1E4A76', '/l/')
      + '</div>'
      + mi('자서전', 'mem', '#C0872E', '/memoir/')
      + '<div class="lfx-opp"><div class="lfx-ot">새 여행 · 함께하기</div>'
      +   '<button class="lfx-big lfx-b1" data-u="/showcase.html"><i>' + svg('ticket', 20) + '</i><span><b>예매하기</b><small>마음여행 · 한 편의 기록 · 두 분의 여정</small></span></button>'
      +   '<button class="lfx-big lfx-b2" data-u="/showroom.html"><i>' + svg('show', 20) + '</i><span><b>여행의 기록</b><small>먼저 다녀간 분들의 이야기</small></span></button>'
      +   '<button class="lfx-big lfx-b3" data-u="/partner.html"><i>' + svg('hand', 20) + '</i><span><b>안내자 · 제휴 신청</b><small>안내자로 · 사업으로 함께하기</small></span></button>'
      + '</div>'
      + '<div style="display:flex;justify-content:space-between;margin-top:10px"><button class="lfx-restart" style="margin:0" data-share="1">공유하기</button><button class="lfx-restart" style="margin:0" data-restart="1">다시 시작</button></div>';
  }

  function share() {
    var H = 'https://www.loveflow.ai.kr';
    try {
      if (navigator.share) { navigator.share({ title: '사랑흐름', text: '가장 소중한 사람을 더 알아가는 시간, 사랑흐름', url: H })['catch'](function () {}); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(H).then(function () { alert('주소를 복사했어요'); }, function () {}); return; }
    } catch (e) {}
    prompt('주소를 복사해 주세요', H);
  }

  function openMenu() {
    var m = document.getElementById('lfxMenu');
    if (m.classList.contains('on')) { closeAll(); return; }
    closeAll();
    document.getElementById('lfxDim').classList.add('on');
    m.classList.add('on');
  }

  function wireMenu(m) {
    var bs = m.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) {
      bs[i].onclick = function () {
        if (this.getAttribute('data-x')) { closeAll(); return; }
        if (this.getAttribute('data-restart')) { location.reload(); return; }
        if (this.getAttribute('data-share')) { share(); return; }
        var u = this.getAttribute('data-u'); if (u) { go(u); }
      };
    }
  }

  function build() {
    if (document.getElementById('lfxTop')) { return; }
    document.documentElement.classList.add('lfx');
    if (!document.getElementById('lfLookCss')) {
      var lk = document.createElement('link'); lk.id = 'lfLookCss'; lk.rel = 'stylesheet'; lk.href = '/lf/look.css?v=1';
      (document.head || document.documentElement).appendChild(lk);
    }
    var st = document.createElement('style'); st.id = 'lfxCss'; st.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(st);

    var top = document.createElement('div');
    top.className = 'lfx-top'; top.id = 'lfxTop';
    top.innerHTML = '<button class="lfx-logo" aria-label="사랑흐름 첫 화면"><img src="/logo.png" alt=""></button>'
      + '<div class="lfx-title">' + esc(titleOf()) + '</div>'
      + '<button class="lfx-burger" aria-label="메뉴">' + svg('menu', 18) + '</button>';
    document.body.insertBefore(top, document.body.firstChild);
    /* ★v6 화면 안 「‹ 이전」 */
    var bk = document.body.getAttribute('data-lf-back');
    if (bk) {
      var bb = document.createElement('div'); bb.className = 'lfx-back';
      bb.innerHTML = '<button type="button" aria-label="이전 화면으로">‹ 이전</button>';
      top.parentNode.insertBefore(bb, top.nextSibling); document.documentElement.classList.add('lfx-hasback');
      bb.firstChild.onclick = function () {
        var r = document.referrer || '';
        if (r.indexOf(location.origin) === 0 && history.length > 1) { history.back(); } else { location.href = bk; }
      };
    }
    top.querySelector('.lfx-logo').onclick = function () { location.href = '/'; };
    top.querySelector('.lfx-burger').onclick = openMenu;
    /* ★v4 위 띠 오른쪽 자리 — <button data-lfx-top> 를 ☰ 왼쪽으로 옮김 */
    var slots = document.querySelectorAll('[data-lfx-top]');
    if (slots.length) {
      var sl = document.createElement('div'); sl.className = 'lfx-slot';
      for (var q = 0; q < slots.length; q++) { sl.appendChild(slots[q]); }
      top.appendChild(sl); top.className += ' has-slot';
    }

    var dim = document.createElement('div'); dim.className = 'lfx-dim'; dim.id = 'lfxDim'; dim.onclick = closeAll;
    var sh = document.createElement('div'); sh.className = 'lfx-sheet'; sh.id = 'lfxSheet'; sh.setAttribute('role', 'dialog');
    var m = document.createElement('nav'); m.className = 'lfx-menu'; m.id = 'lfxMenu'; m.setAttribute('aria-label', '사이트 메뉴');
    m.innerHTML = menuHtml(); wireMenu(m);

    var tab = document.createElement('nav'); tab.className = 'lfx-tab'; tab.id = 'lfxTab'; tab.setAttribute('aria-label', '사랑흐름 길목');
    var cur = groupOfPath(), th = '';
    for (var i = 0; i < GROUPS.length; i++) {
      var g = GROUPS[i];
      th += '<button data-k="' + g.k + '"' + (g.k === cur ? ' class="on"' : '') + '><i style="background:' + g.c + '">' + svg(g.ic, 18) + '</i>' + esc(g.t) + '</button>';
    }
    tab.innerHTML = th;
    var tbs = tab.querySelectorAll('button');
    for (var j = 0; j < tbs.length; j++) { tbs[j].onclick = function () { openSheet(this.getAttribute('data-k')); }; }

    document.body.appendChild(dim); document.body.appendChild(sh); document.body.appendChild(m); document.body.appendChild(tab);

    /* 글 쓰는 칸을 누르면 아래 띠를 숨김 (자판) */
    function typing(e) {
      var t = e.target; if (!t || !t.tagName) { return false; }
      var n = t.tagName.toLowerCase();
      if (n === 'textarea' || n === 'select') { return true; }
      if (n === 'input') { return !/^(button|submit|checkbox|radio|file|range|color|reset|image)$/i.test(t.type || ''); }
      return !!t.isContentEditable;
    }
    document.addEventListener('focusin', function (e) { if (typing(e)) { tab.classList.add('hide'); } });
    document.addEventListener('focusout', function (e) { if (typing(e)) { setTimeout(function () { tab.classList.remove('hide'); }, 120); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); } });
  }

  window.LFFrame = { open: openSheet, menu: openMenu, close: closeAll, groups: GROUPS, version: 'v3' };

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', build); } else { build(); }
})();
