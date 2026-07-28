/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf-foot.js · v1 · 260728
   사랑흐름 공용 하단 줄 부품 — 전 화면이 이 한 파일을 씁니다.

   [쓰는 법] 화면 하단에 아래 두 줄만 둡니다.
     <div id="lfFoot"></div>
     <script src="/lf-foot.js" defer></script>

   [담긴 것] 네 층
     1) 링크 여섯 — 소개 · 이용약관 · 개인정보 · 환불정책 · 카카오톡 문의 · 안내자·제휴
     2) 저작권 한글 한 줄
     3) 저작권 영문 두 줄
     ※ 「홈으로」는 두지 않습니다. 모든 화면 상단바 로고가 홈입니다(260706 확정).

   [고칠 때] 이 파일 하나만 고치면 전 화면이 함께 바뀝니다.
   [클래스] 전부 lfft- 로 시작합니다. 기존 화면 CSS와 겹치지 않습니다.

   © 2026 사랑흐름·LFRI™. 무단복제·상업적이용 금지.
   Unauthorized use strictly prohibited. Violators subject to civil and criminal penalties.
   ═══════════════════════════════════════════════════════════════ */
(function () {

  var KAKAO = "http://pf.kakao.com/_ExndxfX/chat";

  var CSS = ""
    + ".lfft{text-align:center;padding:14px 8px 16px;margin:18px 0 0;font-family:inherit}"
    + ".lfft-links{display:flex;flex-wrap:wrap;justify-content:center;gap:5px 5px}"
    + ".lfft-links a{font-size:10.5px;font-weight:700;color:#1E4A76;text-decoration:none;cursor:pointer;white-space:nowrap;margin:0;padding:0;display:inline;border:0;background:none}"
    + ".lfft-links a:hover{text-decoration:underline}"
    + ".lfft-kr{font-size:9.5px;color:#7d7a70;line-height:1.6;margin-top:10px}"
    + ".lfft-en{font-size:8px;color:#a5a096;line-height:1.55;margin-top:2px}";

  var HTML = ""
    + '<div class="lfft">'
    +   '<div class="lfft-links">'
    +     '<a href="/about.html">소개</a>'
    +     '<a href="/trust.html#terms">이용약관</a>'
    +     '<a href="/trust.html#privacy">개인정보</a>'
    +     '<a href="/trust.html#refund">환불정책</a>'
    +     '<a href="' + KAKAO + '" target="_blank" rel="noopener">카카오톡 문의</a>'
    +     '<a href="/partner.html">안내자·제휴</a>'
    +   '</div>'
    +   '<div class="lfft-kr">&copy; 2026 사랑흐름 &middot; LFRI&trade;. 무단복제 &middot; 상업적 이용 금지.</div>'
    +   '<div class="lfft-en">Unauthorized use strictly prohibited.<br>Violators subject to civil and criminal penalties.</div>'
    + '</div>';

  function css() {
    if (document.getElementById("lfftCss")) { return; }
    var st = document.createElement("style");
    st.id = "lfftCss";
    st.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(st);
  }

  function paint() {
    css();
    var hosts = document.querySelectorAll("#lfFoot, .lf-foot");
    for (var i = 0; i < hosts.length; i++) {
      if (hosts[i].getAttribute("data-lfft") === "1") { continue; }
      hosts[i].innerHTML = HTML;
      hosts[i].setAttribute("data-lfft", "1");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paint);
  } else {
    paint();
  }

})();
