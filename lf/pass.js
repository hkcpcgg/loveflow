/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/pass.js · v3 · 260811 — ★화면 안에 이미 확정돼 있던 「앞으로」가 안 보이던 것 해소(대표 지적 260811). 열두 화면이 각자 열두 줄짜리 목적지표(LF_NEXT)를 갖고 있는데 문지기는 자기 짧은 표만 보고 길을 깔아, 파는 곳·기관 신청·입장·다시 입장·여권 찾기·여행지도 결과·편지 입구 일곱 곳이 뒤로·홈 둘로 줄어 있었습니다. [고침] ①문지기 표에 없으면 ★화면 표를 빌려 씁니다 — 모양은 표준 알약 26px 그대로입니다(화면 손에 통째로 맡기면 여행지도 결과에서 옛 세로 카드 88px 판이 되살아납니다). ②자기 표가 없는 두 곳(꾸러미 한 장·삐뚤빼뚤 마음 도화지)에 앞으로 갈 곳을 실었습니다 — 문구는 이미 쓰던 것 그대로입니다. [무손] 여권 찾기·잠금·링크에 번호 싣기·부품 판번호(PART_V)·로고 대체글자·알약 생김새 전부 미변경. — v2 · 260810 — ★길 셋 깔기 + 로고 대체글자 통일 추가. 대표 확정 260810 「어느 창에서 시작해도 홈으로 가고 바로 앞으로 갈 수 있어야 한다」. 아홉 화면에 길이 없어 손님이 갇힐 수 있었습니다. (PART_V 8) — ★사랑흐름 문지기(신설).

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
  var PART_V = '8';

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


  /* ══════════════════════════════════════════════════════════════
     ⑥ 길 셋 깔기 — ← 뒤로 · ⌂ 홈 · → 앞으로   [260810 대표 확정]
     ──────────────────────────────────────────────────────────────
     「어느 창에서 시작해도 홈으로 가고 바로 앞으로 갈 수 있어야 한다」.
     재보니 아홉 화면에 이 길이 아예 없었습니다(소개·신뢰·우주·제안서·
     안내자 넷·키트). 들어오신 손님이 갇힙니다.

     규칙 셋
       ① 이미 길이 있으면 손대지 않습니다 — 두 벌이 되면 더 나쁩니다
       ② 답을 적는 화면(여행지도·편지)은 비켜 갑니다
          — 「앞으로」를 누르면 쓰시던 답이 날아갑니다(확정 설계)
       ③ 「앞으로」 갈 곳을 모르면 두 개만 깝니다(뒤로·홈)
          — 억지로 만들어 엉뚱한 데로 보내지 않습니다

     모양은 열아홉 화면이 쓰는 표준 그대로입니다(새로 지은 것 없음).
     ══════════════════════════════════════════════════════════════ */

  /* 앞으로 갈 곳 — 화면별. 없는 화면은 뒤로·홈 둘만 깝니다. */
  var NEXT = {
    '/about.html':         { u:'/showroom.html', t:'여행의 기록 보러 가기' },
    '/trust.html':         { u:'/showroom.html', t:'여행의 기록 보러 가기' },
    '/universe.html':      { u:'/showroom.html', t:'여행의 기록 보러 가기' },
    '/proposal.html':      { u:'/partner.html',  t:'사랑흐름 여행 안내자' },
    '/partner.html':       { u:'/partner-apply.html', t:'안내자 신청하기' },
    '/partner-creed.html': { u:'/partner-apply.html', t:'안내자 신청하기' },
    '/partner-link.html':  { u:'/partner.html',  t:'사랑흐름 여행 안내자' },
    '/kit/index.html':     { u:'/showcase.html', t:'마음 여행 예매하기' },
    '/kit/':               { u:'/showcase.html', t:'마음 여행 예매하기' },
    '/kit/onepager.html':  { u:'/showcase.html', t:'마음 여행 예매하기' },
    '/draw/':              { u:'/showroom.html', t:'앞으로' },
    '/draw/index.html':    { u:'/showroom.html', t:'앞으로' }
  };

  /* 길을 깔지 않는 화면 — 답을 적는 자리 */
  function skipWay() {
    var p = location.pathname;
    if (p.indexOf('/journey/') === 0 && p.indexOf('result') < 0) { return true; }
    if (p.indexOf('/letter/') === 0) { return true; }
    return false;
  }

  function wayCss() {
    if (document.getElementById('lfwayCss')) { return; }
    var s = document.createElement('style');
    s.id = 'lfwayCss';
    s.textContent =
      '.lfway{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;'
    + 'max-width:420px;margin:20px auto 10px;padding:0 16px;box-sizing:border-box}'
    + '.lfway a{display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 11px;'
    + 'border:1px solid #E6E1D8;border-radius:13px;background:#fff;'
    + 'text-decoration:none;cursor:pointer;transition:.15s}'
    + '.lfway a:active{opacity:.55}'
    + '.lfway .ic{font-size:11px;color:#94A0AE;line-height:1}'
    + '.lfway .tt{font-size:10.5px;font-weight:500;color:#7A8794;letter-spacing:-.2px}'
    + '@media print{.lfway{display:none}}';
    document.head.appendChild(s);
  }

  function way() {
    try {
      if (document.getElementById('lfway')) { return; }        /* 이미 있음 */
      if (document.querySelector('.lfway, .ways, .wayrow')) { return; }

      if (skipWay()) { return; }

      var p = location.pathname;
      var n = NEXT[p] || NEXT[p.replace(/index\.html$/, '')];

      /* ★[v3 · 260811] 문지기 표에 없으면 ★화면이 가진 목적지표(LF_NEXT)를 빌려 씁니다.
         모양은 문지기의 표준 알약(26px) 그대로입니다 — 화면 손에 통째로 맡기면
         여행지도 결과에서 옛 세로 카드(88px) 판이 되살아납니다. 목적지만 빌립니다. */
      if (!n) {
        try {
          var mine = window.LF_NEXT
                   ? (window.LF_NEXT[p] || window.LF_NEXT[p.replace(/index\.html$/, '')])
                   : null;
          if (mine && mine.t && mine.k && typeof window.lfGo === 'function') {
            /* ★문구는 그 화면이 원래 쓰던 「앞으로」 그대로 둡니다.
               목적지 이름으로 바꾸는 것은 대표 확정 사항이라 손대지 않습니다. */
            n = { k: mine.k, t: '앞으로' };
          }
        } catch (e) {}
      }

      var h = '<div class="lfway" id="lfway">';
      h += '<a onclick="history.back()"><span class="ic">←</span><span class="tt">뒤로</span></a>';
      h += '<a href="/"><span class="ic">⌂</span><span class="tt">홈</span></a>';
      if (n) {
        if (n.u) {
          h += '<a href="' + n.u + '"><span class="ic">→</span><span class="tt">' + n.t + '</span></a>';
        } else {
          h += '<a onclick="lfGo(\'' + n.k + '\')"><span class="ic">→</span><span class="tt">' + n.t + '</span></a>';
        }
      }
      h += '</div>';

      /* 저작권 문구를 품은 덩어리 앞에 답니다 — 푸터 클래스가 화면마다 제각각입니다 */
      var foot = document.querySelector('.lf-foot') || document.querySelector('#lfFoot')
              || document.querySelector('.foot') || document.querySelector('footer')
              || document.querySelector('.glegal') || document.querySelector('.legal');
      if (!foot) {
        var all = document.body.querySelectorAll('div');
        for (var i = all.length - 1; i >= 0; i--) {
          var x = all[i].textContent || '';
          if (x.indexOf('\u00a9 2026') > -1 && x.length < 400) { foot = all[i]; break; }
        }
      }
      wayCss();
      if (foot && foot.parentNode && foot.parentNode !== document.documentElement) {
        foot.insertAdjacentHTML('beforebegin', h);
      } else {
        document.body.insertAdjacentHTML('beforeend', h);
      }
    } catch (e) {}
  }

  /* ⑦ 로고 옆 대체글자를 「사랑흐름 홈」으로 통일합니다.
     화면마다 달라(사랑흐름 / 사랑흐름 마음 여행여권 / 아예 없음),
     그림이 안 뜨면 옆 글자와 겹쳐 두 번 나온 것처럼 보였습니다. */
  function logoAlt() {
    try {
      var im = document.querySelectorAll('img[src*="logo.png"]');
      for (var i = 0; i < im.length; i++) { im[i].setAttribute('alt', '\uc0ac\ub791\ud750\ub984 \ud648'); }
    } catch (e) {}
  }

  window.LFPass = {
    no: no, seal: seal, guard: guard, link: link, way: way,
    fromDevice: fromDevice, RE: RE, PART_V: PART_V
  };

  function start() {
    link();
    logoAlt();
    part();
    way();
    setTimeout(way, 600);   /* 늦게 그리는 화면 대비 — 이미 있으면 비켜 갑니다 */
    /* 화면이 늦게 그리는 경우 한 번 더 */
    setTimeout(link, 400);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
