/* /lf/photo-pick.js · v1 · 261125 — 사진 올리는 칸을 누르면 「사진 찍기 · 앨범에서 고르기」를 먼저 물음
   까닭: 안드로이드 새 사진 고르기 창은 앨범만 열리고 카메라가 없음(대표 261124 19:39 「직접 찍어 올리는 기능이 빠졌다」).
   아이폰은 기본 메뉴에 「사진 찍기 · 사진 보관함」이 이미 있어 이 판을 띄우지 않음.
   쓰는 법: <script src="/lf/photo-pick.js?v=1"></script> 뒤 LFPhotoPick.wrap(input 요소). 그 칸의 onchange 는 그대로 씀. */
(function (w, d) {
  var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var sheet = null, cur = null;
  function css() {
    if (d.getElementById('lfppCss')) { return; }
    var s = d.createElement('style'); s.id = 'lfppCss';
    s.textContent = '.lfpp-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1800;display:none;align-items:flex-end;justify-content:center}'
      + '.lfpp-bg.on{display:flex}.lfpp{background:#fff;width:100%;max-width:500px;border-radius:20px 20px 0 0;padding:20px 20px calc(24px + env(safe-area-inset-bottom));font-family:"Noto Sans KR",sans-serif}'
      + '.lfpp h3{font-size:17px;color:#2E3A46;margin:0 0 12px}.lfpp button{display:flex;align-items:center;gap:10px;width:100%;min-height:54px;border:1.5px solid #D9E2EC;border-radius:12px;background:#fff;'
      + 'font:600 16px "Noto Sans KR",sans-serif;color:#1E4A76;padding:0 16px;margin-bottom:10px;cursor:pointer}.lfpp button.x{justify-content:center;color:#4A525C;border-color:#EDE5D8;margin:4px 0 0}';
    d.head.appendChild(s);
  }
  function build() {
    if (sheet) { return; }
    css();
    sheet = d.createElement('div'); sheet.className = 'lfpp-bg';
    sheet.innerHTML = '<div class="lfpp" role="dialog" aria-modal="true"><h3>사진 넣기</h3>'
      + '<button type="button" data-m="cam">📷 사진 찍기</button><button type="button" data-m="alb">🖼️ 앨범에서 고르기</button>'
      + '<button type="button" class="x" data-m="no">취소</button></div>';
    sheet.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('button') : null;
      if (ev.target === sheet) { close(); return; }
      if (!b || !cur) { return; }
      var m = b.getAttribute('data-m'), inp = cur; close();
      if (m === 'no') { return; }
      if (m === 'cam') { inp.setAttribute('capture', 'environment'); } else { inp.removeAttribute('capture'); }
      inp.__lfppGo = true; inp.click(); inp.__lfppGo = false;
    });
    d.body.appendChild(sheet);
  }
  function close() { if (sheet) { sheet.classList.remove('on'); } }
  w.LFPhotoPick = {
    VER: '1',
    wrap: function (inp) {
      if (!inp || IOS || inp.__lfpp) { return; }
      inp.__lfpp = true;
      var orig = inp.click;
      inp.click = function () {
        if (inp.__lfppGo) { return orig.call(inp); }
        build(); cur = inp; sheet.classList.add('on');
      };
    }
  };
})(window, document);
