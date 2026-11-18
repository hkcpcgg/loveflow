/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/resume.js · v2 · 261118 — [735 · 대표 OK 261118 16:36 「오케이, 좋습니다. 갑시다」 · 743 라]
     「이어서 쓰기」를 두 자리로 나눔.
     ① 맨 위 <div data-lf-resume="top"> — 이 휴대폰이 사랑흐름 여권번호를 기억할 때만 작은 한 줄
        「📖 LF-•••12 · 쓰던 곳으로 이어서 쓰기 ›」 · 처음 온 손님에게는 아무것도 띄우지 않음.
     ② 아래 <div data-lf-resume> — 구매하기 · 선물하기(값 상자) 바로 아래 · 늘 보임 · 상품 색(body.k-map · k-set · k-memoir · k-life / 그 밖은 남색)
        · 왼쪽 펼친 공책이 한 장씩 넘어가는 움직임 · 말 「이미 구매하셨나요? 쓰던 곳으로 갑니다」 / 번호 기억 시 「LF-•••12 · 쓰던 곳으로 바로」.
     · 누르면 /reenter.html(지금 기능 그대로).
   (이전) v1 · 261117 — [710] 상품 설명 맨 위 큰 「이어서 쓰기」 상자 하나.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var CSS = ''
    /* ① 맨 위 작은 한 줄 */
    + '.lfrt{display:flex;align-items:center;justify-content:center;gap:8px;min-height:38px;margin:0 0 14px;padding:6px 14px;box-sizing:border-box;border-radius:19px;background:#fff;border:1px solid var(--rl,#D9CCF5);color:var(--rc,#3D2584);font-size:13.5px;font-weight:700;letter-spacing:-.02em;text-decoration:none;word-break:keep-all;font-family:inherit;transition:transform .12s}'
    + '.lfrt:active{transform:scale(.98)}.lfrt .bk{font-size:16px}.lfrt i{font-style:normal;font-weight:800;color:var(--ra,#8A6FC9)}'
    /* ② 아래 상자 */
    + '.lfrs{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;margin:14px 0 0;padding:12px 14px;border-radius:16px;background:linear-gradient(135deg,var(--c1,#1E4A76),var(--c2,#3B5BA8));color:#fff;text-decoration:none;box-shadow:0 6px 16px rgba(0,0,0,.15);transition:transform .12s;font-family:inherit}'
    + '.lfrs:active{transform:scale(.98)}'
    + '.lfrs .nb{flex:none;width:44px;height:36px;position:relative;perspective:120px}'
    + '.lfrs .nb .l,.lfrs .nb .r,.lfrs .nb .pg{position:absolute;top:4px;width:20px;height:28px}'
    + '.lfrs .nb .l{left:2px;background:#FFF8EA;border-radius:3px 1px 1px 3px}'
    + '.lfrs .nb .r{right:2px;background:#FFF8EA;border-radius:1px 3px 3px 1px}'
    + '.lfrs .nb .pg{left:22px;background:#F3E6CC;border-radius:1px 3px 3px 1px;transform-origin:left center;animation:lfrsFlip 2.6s ease-in-out infinite}'
    + '.lfrs .nb .l:after,.lfrs .nb .r:after{content:"";position:absolute;left:4px;right:4px;top:8px;height:9px;border-top:1.5px solid #D8C7A3;border-bottom:1.5px solid #D8C7A3}'
    + '@keyframes lfrsFlip{0%,55%{transform:rotateY(0)}80%,100%{transform:rotateY(-170deg)}}'
    + '@media (prefers-reduced-motion:reduce){.lfrs .nb .pg{animation:none}}'
    + '.lfrs b{display:block;font-size:15.5px;font-weight:800;text-align:left;color:#fff}'
    + '.lfrs small{display:block;font-size:12.5px;opacity:.88;margin-top:2px;word-break:keep-all;text-align:left;color:#fff}'
    + '.lfrs .ar{margin-left:auto;flex:none;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.22);display:grid;place-items:center;font-size:20px;font-weight:700}';
  /* 상품 색 — 상품 설명 값 상자(.buy --pc)와 같은 색 */
  var COL = {
    'k-map':    ['#0C4F45', '#1F7A68', '#B9D8CF', '#1F7A68'],
    'k-set':    ['#10274A', '#2B4A80', '#C3CEE3', '#2B4A80'],
    'k-memoir': ['#4F2F14', '#7A4E28', '#E3D0BC', '#7A4E28'],
    'k-life':   ['#45172F', '#7A3358', '#E9C6D7', '#7A3358']
  };
  function pass() {
    var p = '';
    try { p = (sessionStorage.getItem('lf_passport') || localStorage.getItem('lf_passport') || '').trim().toUpperCase(); } catch (e) {}
    return /^LF-[A-Z0-9]{5}$/.test(p) ? p : '';
  }
  function color() {
    var b = document.body ? document.body.className : '';
    for (var k in COL) { if ((' ' + b + ' ').indexOf(' ' + k + ' ') >= 0) { return COL[k]; } }
    return null;
  }
  function run() {
    var els = document.querySelectorAll('[data-lf-resume]');
    if (!els.length) { return; }
    if (!document.getElementById('lfrsCss')) { var st = document.createElement('style'); st.id = 'lfrsCss'; st.textContent = CSS; document.head.appendChild(st); }
    var p = pass(), c = color(), mask = p ? ('LF-•••' + p.slice(-2)) : '';
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (c) { el.style.setProperty('--c1', c[0]); el.style.setProperty('--c2', c[1]); el.style.setProperty('--rl', c[2]); el.style.setProperty('--rc', c[0]); el.style.setProperty('--ra', c[3]); }
      if (el.getAttribute('data-lf-resume') === 'top') {
        el.innerHTML = p ? ('<a class="lfrt" href="/reenter.html"><span class="bk" aria-hidden="true">📖</span>' + mask + ' · 쓰던 곳으로 이어서 쓰기 <i aria-hidden="true">›</i></a>') : '';
      } else {
        el.innerHTML = '<a class="lfrs" href="/reenter.html"><span class="nb" aria-hidden="true"><span class="l"></span><span class="r"></span><span class="pg"></span></span>'
          + '<span><b>이어서 쓰기</b><small>' + (p ? (mask + ' · 쓰던 곳으로 바로') : '이미 구매하셨나요? 쓰던 곳으로 갑니다') + '</small></span><span class="ar" aria-hidden="true">›</span></a>';
      }
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();
