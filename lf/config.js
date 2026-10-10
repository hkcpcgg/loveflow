/* ═══════════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/config.js · v5 · 261010 · [대표 261010 16:16 OK] 이름표 오기 바로잡음 — …LjdA 는 발권이 아니라 편지 서버: ticket → letter(주소 값은 그대로 · gas.ticket 을 읽는 화면 없음 확인)
   (이전) lf/config.js · v4 · 261009 · [64차 · 대표 261009 14:03] 우리 이야기 서버 이사 — gas.rec = 새 서버(loveflow.ai.kr@gmail.com 계정 · 우리 이야기 서버 v1)
   (이전) lf/config.js · v3 · 261009 · [대표 261009 09:00 「메인 배너 먼저 걸어라」] homeRec = 공동체 기록 테스트 모임 기본 초대 열쇠
   (이전) lf/config.js · v2 · 261008 · [대표 261008 17:13 카카오 JavaScript 키 · 17:00 메인 「우리 기록 · 준비 중」]
   (이전) v1 · 261008 · [대표 261008 13:04 「config.js 반영」 · 작업기준_261008_1310 이슈 178]
   사랑흐름 서버 주소를 적는 단 한 곳. 서버를 옮기면 이 파일의 주소만 고칩니다.
   [쓰는 법] 화면에서 <script src="/lf/config.js?v=1"></script> 를 먼저 붙이고 LF_CONFIG.gas.이름 으로 읽음.
   [되돌리기] rec 줄을 지우면 /rec/ 는 memoir(옛 서버)로 돌아감.
   [지금 읽는 화면] /rec/ (우리 이야기 v30 — gas.rec, 없으면 gas.memoir) — 나머지 37곳은 그 화면을 고칠 때마다 차례로 옮김.
   [원칙] 백틱 금지 · 문자열 연결(+)만.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  var C = window.LF_CONFIG || {};
  C.gas = {
    memoir: 'https://script.google.com/macros/s/AKfycbxJSELNi3T6YXJP5qGuGcMAFPZBXsUOejNFNFLw0RDWX0qFJlOtVhV38QXWCTKTv6yA/exec',  /* 자서전 서버(…v6yA · 개인 계정) */
    rec:    'https://script.google.com/macros/s/AKfycbyxGWMrhY9Ffihk56ve-8s_S87fdkg_WEMpJO7q3FZRkdlBZWwkWo8m2Gs-fBbrhoVMOg/exec',  /* ★v4 우리 이야기 서버 v1(사랑흐름 계정 · 261009 이사) */
    letter: 'https://script.google.com/macros/s/AKfycbxmIVu6EWwIHK8pmaQnrzZMg_r2XiytvrkohHMJDR2lBscC3OPUAZr6qmEOn6DTLjdA/exec',  /* ★v5 편지 서버(…LjdA) — v4까지 「ticket · 발권」으로 잘못 적힘 */
    board:  'https://script.google.com/macros/s/AKfycbxaUOkw181xKRNJj4kxVd31PXL8cEQW4e0B6D2alEw-s_jTrPQhNku2jUeGY-TjuXZNzw/exec',  /* 게시판 서버(…ZNzw) */
    map:    'https://script.google.com/macros/s/AKfycbxLIG_LRAZD3AMJH26gPhefdkwLbXmA5ip_UurBfQ-53bxgq2T63dSre6YO9j4hxBZM1A/exec',  /* 유료여행지도 서버(…M1A) */
    lookup: 'https://script.google.com/macros/s/AKfycbyTroJxyBICtL516b6l9KQ45eQRSaKspj35IXOKET2sHvbS_pAlH2gxM9mvBsVsZJ9X/exec'   /* 조회 서버(…ZJ9X) */
  };
  C.site = 'https://www.loveflow.ai.kr';
  C.kakaoJs = '0c7493c2a8668712a43ccb9cf17387c8';   /* 카카오 JavaScript 키(사랑흐름 앱 1483391 · 공개용 · 등록한 도메인에서만 작동) — 카톡으로 보내기 */
  C.homeRec = 'b0e2c6fda2f2440db72c984099df7595';   /* 메인 「우리 기록 · 준비 중」이 여는 시험 모임의 초대 열쇠(32자) — 비면 메인 줄 숨김. 초대 링크를 「새로 만들기」 하면 여기도 고침 */
  window.LF_CONFIG = C;
})();
