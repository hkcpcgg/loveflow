/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf-foot.js · v4 · 261024 · [칸 7-나 428 · 443] 공통 위 띠(lf/frame.js)가 없는 화면(kit · 표지 등)을 본부에서 같은 창으로 열었을 때 맨 위 「⌂ 본부로」 띠 · 푸터 무손
   (이전) lf-foot.js · v3 · 261023 · [할일 395 · 토스 카드사 심사 「하단 사업자 정보」]
   ★사업자 정보 두 줄을 글자로 넣음(그림 아님 · 결제 화면 showcase · pay 와 공용 푸터를 쓰는 모든 화면)
     상호 · 대표자 · 사업자등록번호 · 통신판매업신고번호 · 사업장 주소 · 유선번호 · 이메일 · 개인정보보호책임자
     ★주소 · 상호는 사업자등록증과 글자 하나까지 같아야 함 — 바뀌면 아래 BIZ 한 곳만 고침
   (이전) v2 · 261004 · [자서전 공사 칸 27-2 · 대표 결정]
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

  /* ★v3 사업자 정보 — 사업자등록증과 똑같이 */
  var BIZ = {
    name: "사랑흐름", ceo: "황규찬", no: "285-17-02228", sale: "제2025-경기파주-1747호",
    addr: "경기도 파주시 매봉길 17-13", tel: "070-4158-7786", mail: "hkcpcgg@gmail.com", privacy: "유상열"
  };

  var CSS = ""
    + ".lfft{text-align:center;padding:12px 8px 14px;margin:18px 0 0;border-top:1px solid #EFE7DA;font-family:inherit;color:#9d8f80}"
    + ".lfft-links{font-size:10.5px;line-height:1.8}"
    + ".lfft-links a{color:#9d8f80;text-decoration:none;cursor:pointer;margin:0 5px;white-space:nowrap}"
    + ".lfft-links a:hover{text-decoration:underline}"
    + ".lfft-c{font-size:10px;line-height:1.7;letter-spacing:.01em}"
    + ".lfft-biz{font-size:10.5px;line-height:1.75;margin:6px 0 4px;word-break:keep-all}"
    + ".lfft-biz span{white-space:nowrap}"
    + ".lfft-biz a{color:#9d8f80;text-decoration:none}";

  var HTML = ""
    + '<div class="lfft">'
    +   '<div class="lfft-links">'
    +     '<a href="/about.html">소개</a>'
    +     '<a href="/trust.html#terms">이용약관</a>'
    +     '<a href="/trust.html#privacy">개인정보</a>'
    +     '<a href="/trust.html#refund">환불정책</a>'
    +     '<a href="' + KAKAO + '" target="_blank" rel="noopener">문의</a>'
    +   '</div>'
    +   '<div class="lfft-biz">'
    +     '<span>상호 ' + BIZ.name + '</span> &middot; <span>대표자 ' + BIZ.ceo + '</span> &middot; <span>사업자등록번호 ' + BIZ.no + '</span><br>'
    +     '<span>통신판매업신고 ' + BIZ.sale + '</span> &middot; <span>개인정보보호책임자 ' + BIZ.privacy + '</span><br>'
    +     '<span>' + BIZ.addr + '</span><br><span>전화 <a href="tel:' + BIZ.tel.replace(/-/g, '') + '">' + BIZ.tel + '</a></span> &middot; <span><a href="mailto:' + BIZ.mail + '">' + BIZ.mail + '</a></span>'
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

  function hqBack() {   /* ★v4 본부에서 연 화면 · 공통 위 띠가 없을 때만 */
    try {
      if (sessionStorage.getItem("lf_from_hq") !== "1" || /[?&](hq|door)=1/.test(location.search)) { return; }
      if (document.getElementById("lfHqPill") || document.getElementById("lfHqBack") || document.getElementById("lfxTop")) { return; }
      var b = document.createElement("div"); b.id = "lfHqBack";
      b.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;justify-content:center;padding:8px 12px;background:#26215C";
      b.innerHTML = '<a href="/rec/?hq=1" style="display:inline-flex;align-items:center;gap:6px;color:#fff;text-decoration:none;font:700 14px/1.2 \'Noto Sans KR\',sans-serif;border:1.5px solid #AFA9EC;border-radius:999px;padding:7px 18px">⌂ 본부로</a>';
      document.body.insertBefore(b, document.body.firstChild);
      var bp = parseFloat(getComputedStyle(document.body).paddingTop) || 0; document.body.style.paddingTop = (bp + 52) + "px";
    } catch (e) {}
  }
  function start() { paint(); setTimeout(hqBack, 400); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

})();
