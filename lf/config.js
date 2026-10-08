/* ═══════════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/config.js · v1 · 261008 · [대표 261008 13:04 「config.js 반영」 · 작업기준_261008_1310 이슈 178]
   사랑흐름 서버 주소를 적는 단 한 곳. 서버를 옮기면 이 파일의 주소만 고칩니다.
   [쓰는 법] 화면에서 <script src="/lf/config.js?v=1"></script> 를 먼저 붙이고 LF_CONFIG.gas.이름 으로 읽음.
   [지금 읽는 화면] /rec/ (우리 기록 v22) — 나머지 37곳은 그 화면을 고칠 때마다 차례로 옮김.
   [원칙] 백틱 금지 · 문자열 연결(+)만.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  var C = window.LF_CONFIG || {};
  C.gas = {
    memoir: 'https://script.google.com/macros/s/AKfycbxJSELNi3T6YXJP5qGuGcMAFPZBXsUOejNFNFLw0RDWX0qFJlOtVhV38QXWCTKTv6yA/exec',  /* 자서전 서버(우리 기록 rec* 포함) */
    ticket: 'https://script.google.com/macros/s/AKfycbxmIVu6EWwIHK8pmaQnrzZMg_r2XiytvrkohHMJDR2lBscC3OPUAZr6qmEOn6DTLjdA/exec',  /* 발권 서버(…LjdA) */
    board:  'https://script.google.com/macros/s/AKfycbxaUOkw181xKRNJj4kxVd31PXL8cEQW4e0B6D2alEw-s_jTrPQhNku2jUeGY-TjuXZNzw/exec',  /* 게시판 서버(…ZNzw) */
    map:    'https://script.google.com/macros/s/AKfycbxLIG_LRAZD3AMJH26gPhefdkwLbXmA5ip_UurBfQ-53bxgq2T63dSre6YO9j4hxBZM1A/exec',  /* 유료여행지도 서버(…M1A) */
    lookup: 'https://script.google.com/macros/s/AKfycbyTroJxyBICtL516b6l9KQ45eQRSaKspj35IXOKET2sHvbS_pAlH2gxM9mvBsVsZJ9X/exec'   /* 조회 서버(…ZJ9X) */
  };
  C.site = 'https://www.loveflow.ai.kr';
  window.LF_CONFIG = C;
})();
