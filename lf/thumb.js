/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/thumb.js · v1 · 261111 — ★[공사 칸 ⑥ 입구 · 대표 OK 18:36 · 599 · 598 · 579]
     상품 그림 · 상품 색 · [구매하기] [🎁 선물하기] 짝을 한 곳에서 — 메인 · 상품 설명 · 상품 목록 · 결제 · 사랑흐름 여권 화면이 함께 씀.
     · 그림 = 선 아이콘(지도 · 봉투 · 책 — 만든 사람만 알아봄 · 대표 18:23) 대신 그 상품의 실제 결과물 견본을 작게:
       마음 여행지도 = 「다섯 갈래 마음 흐름」 결과 카드 · 마음여행 = 편지지 · 한 편의 기록 = 자서전 표지 견본(/memoir/samples/cover.png)
       · 두 분의 여정 = 셋을 한 칸에.
     · 색 = 결제 화면(pay v14-38)에 정해 둔 상품 색 계열 그대로 · 골드 · 로즈는 「흔한 금 · 분홍 단색 금지」(261022)라 같은 계열을 짙게.
     · 🎁 선물하기 단추 색 = 상품 넷과 겹치지 않는 자수정 보라 하나.
   쓰는 법: <span data-lf-thumb="map"></span> 를 두면 그림이 채워짐 · LFThumb.pair('map') → 단추 짝 HTML(item 이 없으면 목록 · 선물하기 화면으로).
   ★window 에 이미 있는 이름은 덮어쓰지 않음(595).
   ═══════════════════════════════════════════════════════════════ */
(function () {
  if (window.LFThumb) { return; }
  var C = {
    map:    { a: '#1E8C76', b: '#0C4F45', name: '마음 여행지도' },
    set:    { a: '#24508A', b: '#10274A', name: '마음여행' },
    memoir: { a: '#9A6334', b: '#4F2F14', name: '한 편의 기록' },
    life:   { a: '#8E3B62', b: '#45172F', name: '두 분의 여정' },
    letter: { a: '#24508A', b: '#10274A', name: '마음 여행편지' },
    gift:   { a: '#6A4BD6', b: '#2C1F78' }
  };
  var css = ''
    + '.lfth{box-sizing:border-box;container-type:size;display:block;width:100%;height:100%;position:relative;overflow:hidden;border-radius:inherit;text-align:left;line-height:1.2}'
    + '.lfth *{box-sizing:border-box}.lfth-map{background:#fff;padding:12% 11%;display:flex;flex-direction:column;justify-content:center;gap:8%;box-shadow:inset 0 0 0 1px #DDE7E3}'
    + '.lfth-map .t{font-size:10px;font-weight:800;color:#0C4F45;text-align:center;letter-spacing:-.03em;line-height:1.25;word-break:keep-all}'
    + '.lfth-map i{display:block;height:6px;border-radius:3px;background:#E9EFEC;overflow:hidden}.lfth-map i b{display:block;height:100%;background:linear-gradient(90deg,#1E8C76,#0C4F45)}'
    + '.lfth-set{background:#F5ECD8;padding:13% 11%;font-size:9.5px;line-height:1.75;color:#4A3E2C;font-family:"Noto Serif KR",serif;box-shadow:inset 0 0 0 1px #E7DCC4}'
    + '.lfth-set .to{display:block;font-weight:800;color:#10274A;font-size:10px;margin-bottom:3px;word-break:keep-all}.lfth-set u{display:block;height:1px;background:#D9C9A6;margin:6px 0;text-decoration:none}'
    + '.lfth-memoir{background:#fff url(/memoir/samples/cover.png) center/cover no-repeat;box-shadow:inset 0 0 0 1px #E7DCC4}'
    + '.lfth-life{background:linear-gradient(160deg,#8E3B62,#45172F);display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;padding:7%}'
    + '.lfth-life>span{display:block;height:100%;min-height:0;border-radius:5px;overflow:hidden;position:relative}.lfth-life>span:last-child{grid-column:1/-1}'
    + '.lfth-life .lfth-map{gap:6%;padding:8%}.lfth-life .lfth-map .t{font-size:7px}.lfth-life .lfth-map i{height:3px}.lfth-life .lfth-set{font-size:6.5px;padding:8%}.lfth-life .lfth-set .to{font-size:7px}'
    /* 단추 짝 */
    + '.lfbg-t{text-align:center;font-size:13.5px;font-weight:700;color:#4B3A9C;margin:12px 0 8px}'
    + '.lfbg{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
    + '.lfbg a,.lfbg button{box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:5px;min-height:48px;border-radius:13px;padding:10px 4px;font:inherit;font-size:15.5px;font-weight:800;text-decoration:none;white-space:nowrap;cursor:pointer;transition:transform .12s}'
    + '.lfbg a:active,.lfbg button:active{transform:scale(.97)}'
    + '.lfbg .lfb-buy{background:#fff;border:1.5px solid var(--lfpc,#1E4A76);color:var(--lfpc,#1E4A76)}'
    + '.lfbg .lfb-gift{background:linear-gradient(135deg,#6A4BD6,#2C1F78);border:1.5px solid #2C1F78;color:#fff;box-shadow:0 3px 10px rgba(74,50,190,.25)}'
    + '@container (max-width:64px){.lfth-map .t,.lfth-set .tx{display:none}.lfth-map{gap:12%}.lfth-set .to{font-size:7px;line-height:1.3}}'   /* 작은 칸 — 글 빼고 막대 · 줄만 */
    + '@media (max-width:340px){.lfbg a,.lfbg button{font-size:14.5px}}';
  function addCss() {
    if (document.getElementById('lfThumbCss')) { return; }
    var st = document.createElement('style'); st.id = 'lfThumbCss'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }
  function map() {
    return '<span class="lfth lfth-map" aria-hidden="true"><span class="t">다섯 갈래 마음 흐름</span>'
      + '<i><b style="width:72%"></b></i><i><b style="width:60%"></b></i><i><b style="width:81%"></b></i><i><b style="width:67%"></b></i><i><b style="width:54%"></b></i></span>';
  }
  function set() { return '<span class="lfth lfth-set" aria-hidden="true"><span class="to">사랑하는 엄마에게</span><span class="tx">엄마,<br>그동안 한 번도</span><u></u><u></u><u></u></span>'; }
  function memoir() { return '<span class="lfth lfth-memoir" aria-hidden="true"></span>'; }
  function html(k) {
    if (k === 'map') { return map(); }
    if (k === 'set' || k === 'letter') { return set(); }
    if (k === 'memoir') { return memoir(); }
    if (k === 'life') { return '<span class="lfth lfth-life" aria-hidden="true"><span>' + map() + '</span><span>' + set() + '</span><span>' + memoir() + '</span></span>'; }
    return '';
  }
  function fill(root) {
    addCss();
    var els = (root || document).querySelectorAll('[data-lf-thumb]');
    for (var i = 0; i < els.length; i++) { if (!els[i].getAttribute('data-done')) { els[i].innerHTML = html(els[i].getAttribute('data-lf-thumb')); els[i].setAttribute('data-done', '1'); } }
  }
  /* [구매하기] [🎁 선물하기] — k 가 있으면 그 상품 결제 · 없으면 구매하기 = 상품 목록 · 선물하기 = 선물하기 화면(상품은 거기서 고름) */
  function pair(k, title) {
    addCss();
    var c = C[k] || null, item = (k === 'letter') ? 'set' : k;
    var buy = k ? '/pay.html?item=' + item : '/travel/';
    var gift = '/pay.html?' + (k ? 'item=' + item + '&' : '') + 'mode=gift';
    return (title === false ? '' : '<div class="lfbg-t">' + (title || '소중한 분께 마음을 담아 선물하세요') + '</div>')
      + '<div class="lfbg"' + (c ? ' style="--lfpc:' + c.b + '"' : '') + '><a class="lfb-buy" href="' + buy + '">구매하기</a><a class="lfb-gift" href="' + gift + '">🎁 선물하기</a></div>';
  }
  window.LFThumb = { color: C, html: html, fill: fill, pair: pair, css: addCss };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { fill(); }); } else { fill(); }
})();
