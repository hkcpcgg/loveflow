/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/canceled.js · v1 · 261027 · [본부 ③ 칸 2 · 대표 OK 261027 13:05] ★새 부품 — 결제가 취소된 사랑흐름 여권 안내 판.
     · 서버가 「만료」로 답한 여권(주문대장 상태가 「만료」로 시작 — 칸 1 결제 지킴이가 결제취소를 잡으면 이렇게 바뀜)을
       손님이 열면 화면 위에 이 판 하나를 띄웁니다. 「번호를 찾지 못했어요」 · 「새로고침하세요」 같은 틀린 길 안내를 대신합니다.
     · 「만료」가 되는 길은 결제취소와 옛 시험 여권 넷(439)뿐이고 1년 이용기간은 막지 않으므로(261001) 「만료」 = 이 안내.
     · 부르는 곳: lf/enter.js(입구 번호 칸 · 닫기 있음) · reenter.html(닫기 있음) · journey/result.html · journey/index.html(닫기 없음).
     · 전화는 하단 정보(lf-foot.js BIZ.tel)와 같은 번호 — 바뀌면 두 곳 함께.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var TEL = '070-4158-7786';

  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function css() {
    if (document.getElementById('lfcxCss')) { return; }
    var st = document.createElement('style');
    st.id = 'lfcxCss';
    st.textContent =
      '#lfcx{position:fixed;inset:0;z-index:2147483000;background:rgba(18,28,44,.55);display:flex;align-items:center;justify-content:center;padding:20px}' +
      '#lfcx .cx{width:100%;max-width:340px;background:#fff;border-radius:22px;padding:28px 22px 22px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.25);font-family:-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;animation:lfcxIn .25s ease-out}' +
      '#lfcx .ic{width:58px;height:58px;margin:0 auto;border-radius:50%;background:#EEF2F8;display:flex;align-items:center;justify-content:center;font-size:28px}' +
      '#lfcx .t{font-size:17px;font-weight:800;color:#1E4A76;margin:14px 0 6px;word-break:keep-all}' +
      '#lfcx .pp{font-family:"Courier New",monospace;font-size:14px;color:#7A8794;letter-spacing:.05em}' +
      '#lfcx .s{font-size:14px;line-height:1.7;color:#4A5563;margin:14px 0 4px}' +
      '#lfcx .tel{display:inline-block;font-size:17px;font-weight:800;color:#1E4A76;text-decoration:none;margin-bottom:16px;user-select:all}' +
      '#lfcx .b{display:block;width:100%;padding:14px;border-radius:24px;font-size:15px;font-weight:700;border:0;cursor:pointer}' +
      '#lfcx .b.home{background:#1E4A76;color:#fff}' +
      '#lfcx .b.close{background:#F4F6F9;color:#1E4A76;margin-top:8px}' +
      '#lfcx .b:focus-visible{outline:3px solid #9FB6D3;outline-offset:2px}' +
      '@keyframes lfcxIn{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}' +
      '@media (prefers-reduced-motion:reduce){#lfcx .cx{animation:none}}';
    document.head.appendChild(st);
  }

  /* pp = 여권번호 · opts.closable = 닫고 그 화면을 계속 볼 수 있는가(입구 화면) */
  window.lfCanceled = function (pp, opts) {
    opts = opts || {};
    function draw() {
      css();
      var old = document.getElementById('lfcx'); if (old) { old.parentNode.removeChild(old); }
      var d = document.createElement('div');
      d.id = 'lfcx';
      d.setAttribute('role', 'dialog');
      d.setAttribute('aria-modal', 'true');
      d.innerHTML =
        '<div class="cx">' +
          '<div class="ic">🔒</div>' +
          '<div class="t">결제가 취소된 사랑흐름 여권입니다</div>' +
          (pp ? '<div class="pp">' + esc(pp) + '</div>' : '') +
          '<div class="s">궁금하신 점은 연락 주세요.</div>' +
          '<a class="tel" href="tel:' + TEL.replace(/-/g, '') + '">' + TEL + '</a>' +
          '<button type="button" class="b home" id="lfcxHome">⌂ 홈으로</button>' +
          (opts.closable ? '<button type="button" class="b close" id="lfcxClose">닫기</button>' : '') +
        '</div>';
      document.body.appendChild(d);
      document.getElementById('lfcxHome').onclick = function () { location.href = '/'; };
      var c = document.getElementById('lfcxClose');
      if (c) { c.onclick = function () { if (d.parentNode) { d.parentNode.removeChild(d); } }; }
      try { document.getElementById('lfcxHome').focus(); } catch (e) {}
    }
    if (document.body) { draw(); } else { document.addEventListener('DOMContentLoaded', draw); }
  };
})();
