/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf-foot.js · v2 · 261004 · [자서전 공사 칸 27-2 · 대표 결정]
   ★네 줄 → 두 줄(점 없이 · 한 색 · 가운데 · 글자 한 단계 작게).
     첫 줄 링크 다섯: 소개 · 이용약관 · 개인정보 · 환불정책 · 문의(카카오톡으로 열림)
     둘째 줄: © 2026 LoveFlow 사랑흐름 · LFRI™ All rights reserved.
   ★「안내자 · 제휴」는 ☰ 메뉴 · 아래 띠 「제휴」로 옮김.
   ★「무단복제 · 상업적 이용 금지」 · 영문 경고 두 줄은 이용약관 제5조(지식재산권) 안으로 옮김(trust v9) — 지우지 않음.
   (이전) v1 · 260728 — 링크 여섯 + 저작권 한글 한 줄 + 영문 두 줄
   [쓰는 법] 화면 하단에 <div id="lfFoot"></div> + <script src="/lf-foot.js" defer></script>
   [고칠 때] 이 파일 하나만 고치면 전 화면이 함께 바뀝니다. [클래스] 전부 lfft- 로 시작.
   © 2026 LoveFlow 사랑흐름 · LFRI™ All rights reserved.
   ═══════════════════════════════════════════════════════════════ */
(function () {

  var KAKAO = "http://pf.kakao.com/_ExndxfX/chat";

  var CSS = ""
    + ".lfft{text-align:center;padding:12px 8px 14px;margin:18px 0 0;border-top:1px solid #EFE7DA;font-family:inherit;color:#9d8f80}"
    + ".lfft-links{font-size:10.5px;line-height:1.8}"
    + ".lfft-links a{color:#9d8f80;text-decoration:none;cursor:pointer;margin:0 5px;white-space:nowrap}"
    + ".lfft-links a:hover{text-decoration:underline}"
    + ".lfft-c{font-size:10px;line-height:1.7;letter-spacing:.01em}";

  var HTML = ""
    + '<div class="lfft">'
    +   '<div class="lfft-links">'
    +     '<a href="/about.html">소개</a>'
    +     '<a href="/trust.html#terms">이용약관</a>'
    +     '<a href="/trust.html#privacy">개인정보</a>'
    +     '<a href="/trust.html#refund">환불정책</a>'
    +     '<a href="' + KAKAO + '" target="_blank" rel="noopener">문의</a>'
    +   '</div>'
    +   '<div class="lfft-c">&copy; 2026 LoveFlow 사랑흐름 &middot; LFRI&trade; All rights reserved.</div>'
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
