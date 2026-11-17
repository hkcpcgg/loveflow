/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/resume.js · v1 · 261117 — [710 · 대표 지시 261117 13:24 「상품마다 들어가면 이어서 쓰기를 붙여 놔야지」]
     「이어서 쓰기」 줄 하나를 상품 설명 화면(마음 여행지도 · 마음여행 · 한 편의 기록 · 두 분의 여정) · 자서전 소개에 붙임.
     · 모양 · 말은 메인(index v77 · 704)의 「이어서 쓰기」 줄과 같음 → /reenter.html(사랑흐름 여권번호로 쓰던 곳으로).
     · 이 휴대폰이 기억하는 여권번호가 있으면 「LF-•••12 · 쓰던 곳으로 바로」.
     · 쓰는 법: 화면에 <div data-lf-resume></div> 을 두고 <script src="/lf/resume.js?v=1"></script>. 모양(CSS)은 이 부품이 스스로 붙임.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var CSS = ''
    + '.lfrs{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;margin:0 0 18px;padding:13px 14px;border:1.5px solid #C9A96E;background:linear-gradient(135deg,#FFFBF2,#FBF1DD);border-radius:16px;text-decoration:none;color:inherit;transition:transform .12s;font-family:inherit}'
    + '.lfrs:active{transform:scale(.98)}'
    + '.lfrs .ri{flex:none;width:42px;height:42px;border-radius:12px;background:#1E4A76;display:grid;place-items:center}'
    + '.lfrs .ri svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'
    + '.lfrs b{display:block;color:#1E4A76;font-size:16px;font-weight:800;text-align:left}'
    + '.lfrs small{display:block;color:#9a7a3a;font-size:13px;margin-top:2px;word-break:keep-all;text-align:left}'
    + '.lfrs .ar{margin-left:auto;flex:none;width:36px;height:36px;border-radius:50%;background:#1E4A76;color:#fff;display:grid;place-items:center;font-size:20px;font-weight:700}';
  function sub() {
    var p = '';
    try { p = (sessionStorage.getItem('lf_passport') || localStorage.getItem('lf_passport') || '').trim().toUpperCase(); } catch (e) {}
    return /^LF-[A-Z0-9]{5}$/.test(p) ? ('LF-•••' + p.slice(-2) + ' · 쓰던 곳으로 바로') : '구매하신 여행 · 사랑흐름 여권번호로 쓰던 곳으로';
  }
  function run() {
    var els = document.querySelectorAll('[data-lf-resume]');
    if (!els.length) { return; }
    if (!document.getElementById('lfrsCss')) { var st = document.createElement('style'); st.id = 'lfrsCss'; st.textContent = CSS; document.head.appendChild(st); }
    for (var i = 0; i < els.length; i++) {
      els[i].innerHTML = '<a class="lfrs" href="/reenter.html"><span class="ri"><svg viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2z"/><path d="M8 7h6M8 10.5h6"/><path d="M16 21l2-3 2 3"/></svg></span>'
        + '<span><b>이어서 쓰기</b><small>' + sub() + '</small></span><span class="ar" aria-hidden="true">›</span></a>';
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();
