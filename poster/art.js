/* /poster/art.js · v1 · 261124 — 디지털 포스터 갈래 여덟(이름 · 갈래 칸 이름 · 바탕 색 · 준비 그림)
   갈래 이름 · 칸 이름 = GPT 사전 조율 회신(261124) 2장 · 6장. 그림은 사랑흐름이 그린 SVG(사진 아님).
   쓰는 곳: /poster/index.html(보는 화면) · /poster/make.html(만드는 화면). */
(function (w) {
  var G = '#F2DDAA';
  function note(x, y, flag, cls) {
    return '<g class="' + (cls || '') + '"><ellipse cx="' + x + '" cy="' + y + '" rx="7.5" ry="5.6" transform="rotate(-22 ' + x + ' ' + y + ')" fill="' + G + '"/>'
      + '<line x1="' + (x + 6.6) + '" y1="' + (y - 1.5) + '" x2="' + (x + 6.6) + '" y2="' + (y - 34) + '" stroke="' + G + '" stroke-width="2.2"/>'
      + (flag ? '<path d="M' + (x + 6.6) + ' ' + (y - 34) + ' q12 8 7 22" fill="none" stroke="' + G + '" stroke-width="2.4"/>' : '') + '</g>';
  }
  function beam(x1, y1, x2, y2, cls) {
    function h(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="7.5" ry="5.6" transform="rotate(-22 ' + x + ' ' + y + ')" fill="' + G + '"/><line x1="' + (x + 6.6) + '" y1="' + (y - 1.5) + '" x2="' + (x + 6.6) + '" y2="' + (y - 32) + '" stroke="' + G + '" stroke-width="2.2"/>'; }
    return '<g class="' + (cls || '') + '">' + h(x1, y1) + h(x2, y2) + '<line x1="' + (x1 + 6.6) + '" y1="' + (y1 - 32) + '" x2="' + (x2 + 6.6) + '" y2="' + (y2 - 32) + '" stroke="' + G + '" stroke-width="5"/></g>';
  }
  function star(x, y, r, c, cls) { return '<path class="' + (cls || '') + '" d="M' + x + ' ' + (y - r) + 'l' + (r * .32) + ' ' + (r * .68) + ' ' + (r * .68) + ' ' + (r * .32) + '-' + (r * .68) + ' ' + (r * .32) + '-' + (r * .32) + ' ' + (r * .68) + '-' + (r * .32) + '-' + (r * .68) + '-' + (r * .68) + '-' + (r * .32) + ' ' + (r * .68) + '-' + (r * .32) + 'z" fill="' + c + '"/>'; }
  function svg(body) { return '<svg viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + body + '</svg>'; }

  var ART = {
    perform: function () {
      var s = '<defs><radialGradient id="pspot" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="#FFE9B8" stop-opacity=".55"/><stop offset=".6" stop-color="#FFE9B8" stop-opacity=".08"/><stop offset="1" stop-color="#FFE9B8" stop-opacity="0"/></radialGradient></defs><rect width="400" height="230" fill="url(#pspot)"/>';
      [[60, 30], [100, 60], [320, 36], [345, 76], [150, 22], [262, 18]].forEach(function (p, i) { s += star(p[0], p[1], 5, '#FFE2A0', i % 2 ? 'tw' : 'tw2'); });
      for (var i = 0; i < 5; i++) { var y = 92 + i * 10; s += '<path d="M-10 ' + (y + 18) + ' C 90 ' + (y - 22) + ', 180 ' + (y + 40) + ', 270 ' + (y + 2) + ' S 380 ' + (y - 26) + ', 420 ' + (y - 6) + '" fill="none" stroke="#E7CF9A" stroke-opacity=".55" stroke-width="1.3"/>'; }
      s += note(78, 128, true, 'fl') + beam(130, 124, 162, 112, 'fl2') + note(214, 140, false, 'fl3') + note(252, 116, true, 'fl') + beam(296, 104, 326, 96, 'fl2');
      s += '<g transform="translate(0,196)"><rect width="400" height="34" fill="#F7F2E6"/>';
      for (var k = 0; k <= 20; k++) { s += '<line x1="' + (k * 20) + '" y1="0" x2="' + (k * 20) + '" y2="34" stroke="#C9BFAE"/>'; }
      [1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19].forEach(function (k) { s += '<rect x="' + (k * 20 - 6) + '" y="0" width="12" height="20" rx="1.5" fill="#1B2533"/>'; });
      return svg(s + '</g>');
    },
    shop: function () {
      var s = '<path d="M-5 18 Q 100 62 205 22 T 410 26" fill="none" stroke="#7A3520" stroke-width="1.5"/>';
      var cols = ['#D9534F', '#F0AD4E', '#5B9BD5', '#6AB187', '#C9A96E', '#E37BA8'];
      for (var i = 0; i < 12; i++) { var x = 8 + i * 34, y = 18 + (i < 6 ? i * 3.2 : (11 - i) * 3.2); s += '<path d="M' + x + ' ' + y + ' l22 0 l-11 24z" fill="' + cols[i % 6] + '"/>'; }
      s += '<g transform="translate(110,74)"><rect x="0" y="36" width="180" height="96" rx="6" fill="#FFF8EE"/>'
        + '<path d="M-10 36 h200 l-12 -34 h-176z" fill="#C0473A"/>';
      for (var j = 0; j < 6; j++) { s += '<path d="M' + (2 + j * 33) + ' 2 h16 l6 34 h-28z" fill="#FFF3E2"/>'; }
      s += '<rect x="22" y="62" width="58" height="70" rx="4" fill="#E9B98A"/><rect x="100" y="60" width="62" height="40" rx="4" fill="#BFD9E8"/>'
        + '<circle cx="70" cy="98" r="3" fill="#7A3520"/></g>'
        + '<g class="fl" transform="translate(300,140)"><rect width="56" height="46" rx="5" fill="#D9534F"/><rect x="23" width="10" height="46" fill="#F7D774"/><rect y="16" width="56" height="9" fill="#F7D774"/>'
        + '<path d="M28 0 q-16 -18 -22 -6 q-2 10 22 6 q16 -18 22 -6 q2 10 -22 6" fill="#F7D774"/></g>';
      s += star(60, 120, 7, '#C9A96E', 'tw') + star(84, 170, 5, '#C9A96E', 'tw2');
      return svg(s);
    },
    class: function () {
      var s = '<circle cx="320" cy="60" r="70" fill="#fff" fill-opacity=".35"/><circle cx="70" cy="190" r="60" fill="#fff" fill-opacity=".3"/>';
      s += '<g transform="translate(120,74)"><path d="M0 18 Q 40 0 80 18 V 128 Q 40 110 0 128z" fill="#FFFFFF"/><path d="M160 18 Q 120 0 80 18 V 128 Q 120 110 160 128z" fill="#F6FBF8"/>'
        + '<path d="M80 18 V128" stroke="#9CC5B0" stroke-width="2"/>';
      for (var i = 0; i < 4; i++) { s += '<line x1="14" y1="' + (40 + i * 18) + '" x2="66" y2="' + (34 + i * 18) + '" stroke="#BFDCCD" stroke-width="4" stroke-linecap="round"/><line x1="94" y1="' + (34 + i * 18) + '" x2="146" y2="' + (40 + i * 18) + '" stroke="#BFDCCD" stroke-width="4" stroke-linecap="round"/>'; }
      s += '</g><g class="fl" transform="translate(196,14)"><circle cx="0" cy="22" r="20" fill="#F7D774"/><rect x="-8" y="40" width="16" height="12" rx="3" fill="#14593A"/>'
        + '<path d="M-30 22 h-10 M30 22 h10 M0 -8 v-8 M-22 0 l-7 -7 M22 0 l7 -7" stroke="#C9A96E" stroke-width="3" stroke-linecap="round"/></g>'
        + '<g transform="translate(300,120) rotate(35)"><rect width="16" height="84" rx="3" fill="#F0AD4E"/><path d="M0 84 l8 18 8 -18z" fill="#F3D2A8"/><rect width="16" height="12" rx="3" fill="#E37BA8"/></g>';
      return svg(s);
    },
    meet: function () {
      var s = '<circle cx="200" cy="250" r="190" fill="#fff" fill-opacity=".18"/>';
      s += '<g transform="translate(200,170)"><ellipse rx="140" ry="34" fill="#8E5A3C"/><ellipse rx="132" ry="28" fill="#A86E4B"/></g>';
      var people = [[100, 108, '#F0AD4E'], [160, 90, '#5B9BD5'], [240, 90, '#6AB187'], [300, 108, '#E37BA8']];
      people.forEach(function (p, i) { s += '<g class="' + (i % 2 ? 'fl2' : 'fl') + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="16" fill="#F3D2A8"/><path d="M' + (p[0] - 24) + ' ' + (p[1] + 52) + ' q24 -44 48 0z" fill="' + p[2] + '"/></g>'; });
      s += '<g transform="translate(150,154)"><rect width="18" height="20" rx="4" fill="#fff"/><path d="M18 5 q8 0 8 6 q0 6 -8 6" fill="none" stroke="#fff" stroke-width="3"/></g>'
        + '<g transform="translate(232,154)"><rect width="18" height="20" rx="4" fill="#fff"/><path d="M18 5 q8 0 8 6 q0 6 -8 6" fill="none" stroke="#fff" stroke-width="3"/></g>';
      s += '<path class="st" d="M159 150 q-4 -8 0 -16" stroke="#fff" stroke-width="2" fill="none"/><path class="st2" d="M241 150 q-4 -8 0 -16" stroke="#fff" stroke-width="2" fill="none"/>';
      s += star(60, 40, 7, '#F7D774', 'tw') + star(340, 46, 6, '#F7D774', 'tw2') + star(200, 30, 5, '#F7D774', 'tw');
      return svg(s);
    },
    market: function () {
      var s = '<rect y="170" width="400" height="60" fill="#B5835A" fill-opacity=".35"/>';
      s += '<g transform="translate(60,40)"><rect x="6" y="40" width="268" height="100" fill="#FFF8EE"/>';
      for (var i = 0; i < 7; i++) { s += '<path d="M' + (i * 40) + ' 40 q20 22 40 0" fill="' + (i % 2 ? '#3E8E5C' : '#FFFFFF') + '"/><rect x="' + (i * 40) + '" y="0" width="40" height="40" fill="' + (i % 2 ? '#3E8E5C' : '#FFFFFF') + '"/>'; }
      s += '<rect x="0" y="-6" width="280" height="8" rx="3" fill="#2E6B46"/></g>';
      var baskets = [[90, 150, '#D9534F'], [160, 150, '#F0AD4E'], [230, 150, '#6AB187'], [300, 150, '#8A6FC9']];
      baskets.forEach(function (b, i) {
        s += '<g class="' + (i % 2 ? 'fl2' : 'fl') + '">';
        for (var k = 0; k < 3; k++) { s += '<circle cx="' + (b[0] - 12 + k * 12) + '" cy="' + (b[1] - 8 - (k === 1 ? 6 : 0)) + '" r="9" fill="' + b[2] + '"/>'; }
        s += '<path d="M' + (b[0] - 28) + ' ' + b[1] + ' h56 l-8 26 h-40z" fill="#C8783A"/></g>';
      });
      return svg(s);
    },
    exhibit: function () {
      var s = '<rect y="186" width="400" height="44" fill="#000" fill-opacity=".08"/>';
      [[150, 60, 100, 120, '#BFD9E8', '#6A93B5'], [40, 80, 80, 90, '#F3D2A8', '#C9A96E'], [280, 80, 80, 90, '#E3F1EA', '#6AB187']].forEach(function (f) {
        s += '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + f[3] + '" fill="#C9A96E"/><rect x="' + (f[0] + 8) + '" y="' + (f[1] + 8) + '" width="' + (f[2] - 16) + '" height="' + (f[3] - 16) + '" fill="' + f[4] + '"/>'
          + '<path d="M' + (f[0] + 8) + ' ' + (f[1] + f[3] - 8) + ' l' + ((f[2] - 16) * .4) + ' -' + ((f[3] - 16) * .5) + ' l' + ((f[2] - 16) * .25) + ' ' + ((f[3] - 16) * .25) + ' l' + ((f[2] - 16) * .35) + ' -' + ((f[3] - 16) * .35) + ' v' + ((f[3] - 16) * .6) + 'z" fill="' + f[5] + '"/>'
          + '<circle cx="' + (f[0] + f[2] - 22) + '" cy="' + (f[1] + 24) + '" r="7" fill="#F7D774"/>';
      });
      s += '<path d="M200 0 L130 200 H270z" fill="#FFF3D1" fill-opacity=".25"/>';
      s += star(30, 40, 6, '#C9A96E', 'tw') + star(370, 36, 6, '#C9A96E', 'tw2');
      return svg(s);
    },
    recruit: function () {
      var s = '<circle cx="200" cy="130" r="100" fill="#fff" fill-opacity=".28"/>';
      var ppl = [[120, '#F0AD4E', 'fl', 0], [200, '#1E4A76', 'fl2', 1], [280, '#6AB187', 'fl3', 0]];
      ppl.forEach(function (q) {
        var x = q[0];
        s += '<g class="' + q[2] + '"><circle cx="' + x + '" cy="112" r="20" fill="#F3D2A8"/>'
          + '<path d="M' + (x - 34) + ' 206 q0 -62 34 -62 q34 0 34 62z" fill="' + q[1] + '"/>'
          + (q[3] ? '<path d="M' + (x + 22) + ' 158 l20 -46" stroke="' + q[1] + '" stroke-width="14" stroke-linecap="round"/><circle cx="' + (x + 43) + '" cy="106" r="9" fill="#F3D2A8"/>' : '')
          + '</g>';
      });
      s += '<g class="fl" transform="translate(330,64)"><circle r="22" fill="#C9A96E"/><path d="M-10 0 h20 M0 -10 v20" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>';
      s += '<g class="fl2" transform="translate(64,74)"><circle r="16" fill="#fff"/><path d="M-6 0 h12 M0 -6 v12" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/></g>';
      return svg(s);
    },
    notice: function () {
      var s = '<g transform="translate(70,46)"><rect width="190" height="140" rx="10" fill="#FFFFFF"/><rect width="190" height="30" rx="10" fill="#1E4A76"/><rect y="20" width="190" height="10" fill="#1E4A76"/>'
        + '<circle cx="20" cy="15" r="5" fill="#C9A96E"/>';
      for (var i = 0; i < 4; i++) { s += '<rect x="18" y="' + (48 + i * 22) + '" width="' + (i === 3 ? 90 : 150) + '" height="8" rx="4" fill="#D9E2EC"/>'; }
      s += '</g><g class="fl" transform="translate(270,80)"><path d="M0 30 L60 0 V100 L0 70z" fill="#C9A96E"/><rect x="-24" y="30" width="26" height="40" rx="6" fill="#B08D52"/>'
        + '<path d="M8 70 l6 34 h14 l-8 -32" fill="#B08D52"/></g>'
        + '<path class="tw" d="M350 60 q14 -10 22 -26" stroke="#C9A96E" stroke-width="4" fill="none" stroke-linecap="round"/><path class="tw2" d="M352 130 q16 8 26 24" stroke="#C9A96E" stroke-width="4" fill="none" stroke-linecap="round"/>'
        + '<path class="tw" d="M356 96 h26" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/>';
      return svg(s);
    }
  };

  var KINDS = [
    { k: 'perform', t: '공연·발표', ic: '🎻', ex: '음악회 · 발표회 · 학교 공연', more: '공연 순서', ph: '한 줄에 하나씩 · 예: 주민 합창단' },
    { k: 'shop', t: '가게 행사·소식', ic: '🛍️', ex: '개업 · 기념일 · 할인 · 새 상품', more: '행사 혜택', ph: '한 줄에 하나씩 · 예: 시식 빵 나눔' },
    { k: 'class', t: '강좌·교육', ic: '📚', ex: '강좌 · 교실 · 특강 · 체험 수업', more: '교육 내용', ph: '한 줄에 하나씩 · 예: 사진 보내기' },
    { k: 'meet', t: '모임·초대', ic: '☕', ex: '동창회 · 종친회 · 향우회 · 주민 모임', more: '준비 사항', ph: '한 줄에 하나씩 · 예: 회비 2만 원' },
    { k: 'market', t: '장터·판매', ic: '🧺', ex: '바자회 · 플리마켓 · 농산물 판매', more: '판매 품목', ph: '한 줄에 하나씩 · 예: 햅쌀 · 김장 배추' },
    { k: 'exhibit', t: '전시·체험', ic: '🖼️', ex: '작품 전시 · 체험 행사', more: '전시 · 체험 내용', ph: '한 줄에 하나씩 · 예: 회원 사진 40점' },
    { k: 'recruit', t: '참여자 모집', ic: '🙋', ex: '회원 · 봉사자 · 수강생 모집', more: '모집 내용', ph: '한 줄에 하나씩 · 예: 모집 인원 20명' },
    { k: 'notice', t: '소식·안내', ic: '📢', ex: '이용 안내 · 운영 변경 · 설명회', more: '안내 내용', ph: '한 줄에 하나씩 · 예: 12월부터 토요일 휴관' }
  ];

  w.LFPoster = {
    VER: '1',
    KINDS: KINDS,
    kind: function (k) { for (var i = 0; i < KINDS.length; i++) { if (KINDS[i].k === k) { return KINDS[i]; } } return KINDS[0]; },
    art: function (k) { return (ART[k] || ART.perform)(); },
    API: 'https://script.google.com/macros/s/AKfycby0RS9OH3NeQI3uuG7HemoGfcNOA_LK0cdpGfvrreP-FaS3837qQ5O4R194R42PYzC7/exec',
    SITE: 'https://www.loveflow.ai.kr/poster/',
    /* 날짜 보기: 2026-12-20 › 12.20 · 「12월 20일 토요일」 */
    dShort: function (d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? (+m[2]) + '.' + m[3] : ''; },
    dLong: function (d) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); if (!m) { return ''; }
      var dt = new Date(+m[1], +m[2] - 1, +m[3]);
      return (+m[2]) + '월 ' + (+m[3]) + '일 ' + '일월화수목금토'.charAt(dt.getDay()) + '요일';
    },
    /* 행사가 지났나: 끝 날짜(없으면 날짜) 다음 날부터 「지난 행사」 */
    past: function (p) {
      var d = p.dateEnd || p.date; var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); if (!m) { return false; }
      var end = new Date(+m[1], +m[2] - 1, +m[3] + 1);
      return Date.now() >= end.getTime();
    },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  };
  /* 포스터 한 장 그리기 (보는 화면 · 만드는 화면 미리보기가 같은 것을 씀)
     p = 포스터 값 · o = { photo: 사진 주소, qr: QR svg 글, sample: 견본 표시 } */
  w.LFPoster.render = function (p, o) {
    o = o || {}; var L = w.LFPoster, e = L.esc, K = L.kind(p.kind);
    var art = '';
    if (p.art === 'my') { art = '<div class="pa pa-photo">' + (o.photo ? '<img src="' + e(o.photo) + '" alt="">' : '<div class="pa-wait">사진을 불러오고 있어요</div>') + '</div>'; }
    else if (/^pick-/.test(p.art || '')) { art = '<div class="pa">' + L.art(p.art.slice(5)) + '</div>'; }
    var rows = '';
    function row(k, v) { if (v) { rows += '<div class="pr"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>'; } }
    if (!p.date) { row('시간', e(p.time)); }   /* 날짜가 있으면 날짜 · 요일 · 시간은 위 큰 날짜 칸 한 곳에만 */
    row('장소', e(p.place) + (p.addr ? '<small>' + e(p.addr) + '</small>' : ''));
    row('참여 대상', e(p.who));
    row('신청 방법', e(p.apply));
    var more = (p.more || '').split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 8);
    var big = '';
    if (p.date) {
      var wd = L.dLong(p.date).replace(/^.*일 /, ''), wd2 = p.dateEnd ? L.dLong(p.dateEnd).replace(/^.*일 /, '') : '';
      big = '<div class="pd"><span class="d">' + L.dShort(p.date) + (p.dateEnd ? '<i>~' + L.dShort(p.dateEnd) + '</i>' : '') + '</span>'
        + '<span class="w"><b>' + (wd2 ? wd.charAt(0) + ' ~ ' + wd2.charAt(0) : wd) + '</b>' + e(p.time || '') + '</span></div>';
    }
    return '<section class="poster t-' + e(K.k) + (art ? '' : ' no-art') + '" aria-label="포스터">'
      + '<div class="pframe"></div><div class="ribbon" aria-hidden="true">지난 행사</div>' + art
      + '<div class="pb">'
      + '<div class="pe">' + K.ic + ' ' + e(K.t) + (p.host ? ' · ' + e(p.host) : '') + '</div>'
      + '<h1 class="pt">' + e(p.title || '제목') + '</h1>'
      + (p.intro ? '<p class="ps">' + e(p.intro) + '</p>' : '')
      + big
      + (more.length ? '<div class="pm"><div class="pm-t">' + e(K.more) + '</div>' + more.map(function (x) { return '<span>' + e(x) + '</span>'; }).join('') + '</div>' : '')
      + (rows ? '<div class="pi">' + rows + '</div>' : '')
      + '<div class="pq">' + (o.qr ? '<div class="qr">' + o.qr + '</div>' : '')
      + '<div class="qt"><b>' + e(p.host || '사랑흐름 디지털 포스터') + '</b><span>' + (o.qr ? 'QR을 스캔하면 이 포스터가 열려요' : '만들기를 마치면 이 자리에 QR이 들어가요') + '</span></div></div>'
      + '<div class="pmark"><img src="/logo-96.png" alt="">사랑흐름 디지털 포스터' + (o.sample ? ' · 미리보기' : '') + '</div>'
      + '</div></section>';
  };
  w.LFPoster.qr = function (url, cell) {
    try { var q = qrcode(0, 'M'); q.addData(url); q.make(); return q.createSvgTag({ cellSize: cell || 3, margin: 0, scalable: true }); } catch (err) { return ''; }
  };
})(window);
