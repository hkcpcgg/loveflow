/* ★ 현재 버전 ▶ lf/pub.js · v1 · 261113 · [572 보기는 서버에 묻지 않게] 우리 이야기 공개 목록 시트(사랑흐름 계정 · 링크가 있는 모든 사용자 읽기만)를 구글 시트 공개 읽기(gviz)로 받음 — 서버(3~5초) 대신 0.3초
 *  LFPub.get(열쇠, cb)      — 'plaza' · 'g:초대열쇠' · 'c:공동체번호' → 서버가 써 둔 그대로(없거나 늦으면 null → 부르는 쪽이 서버로)
 *  LFPub.plaza(p, cb)        — 서버 recPlaza 와 같은 꼴로(n · from · rnd · tier) · 섞기 규칙은 서버 recPlazaTier_ · recShuffle_ 를 그대로 옮김(①Code v63~)
 *  시트 번호는 서버 recPing 의 pub · 바뀌면 여기만 고침
 *  © 2026 사랑흐름 · LFRI™. 무단 복제 · 배포 · 상업적 이용 금지. */
(function () {
  if (window.LFPub) { return; }
  var SID = '1vGOfMMbQPciv3T-uIpr0VEpV_qDHcIiAGCAXiDTi_9A', WAIT = 3500, KEEP = 60000, MEM = {};
  var OFF = false; try { OFF = /[?&]pub=0/.test(location.search) || sessionStorage.getItem('lf_pub_off') === '1'; } catch (e) { }
  function get(key, cb) {
    if (OFF || !SID || !window.fetch) { cb(null); return; }
    var m = MEM[key]; if (m && Date.now() - m.at < KEEP) { cb(m.d); return; }
    var done = false; function fin(d) { if (done) { return; } done = true; if (d) { MEM[key] = { at: Date.now(), d: d }; } cb(d); }
    var u = 'https://docs.google.com/spreadsheets/d/' + SID + '/gviz/tq?tqx=out:json&headers=1&tq=' + encodeURIComponent("select * where A='" + String(key).replace(/'/g, '') + "'") + '&t=' + Math.floor(Date.now() / 30000);
    try {
      fetch(u).then(function (r) { return r.text(); }).then(function (tx) {
        var j = JSON.parse(tx.slice(tx.indexOf('{'), tx.lastIndexOf('}') + 1)), row = j && j.status === 'ok' && j.table && j.table.rows && j.table.rows[0];
        if (!row) { fin(null); return; }
        var s = ''; for (var i = 2; i < row.c.length; i++) { s += (row.c[i] && row.c[i].v) || ''; }
        var d = s ? JSON.parse(s) : null; fin(d && d.status === 'ok' ? d : null);
      }).catch(function () { fin(null); });
    } catch (e) { fin(null); }
    setTimeout(function () { fin(null); }, WAIT);
  }
  /* ── 서버 ①Code recShuffle_ · recPlazaTier_ 그대로 ── */
  var RECENT_D = 30;
  function shuffle(a, seed) {
    var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul ? Math.imul(h, 16777619) : (h * 16777619) | 0; }
    function rnd() { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000003) / 1000003; }
    var b = a.slice(); for (var j = b.length - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)), t = b[j]; b[j] = b[k]; b[k] = t; }
    for (var m = 1; m < b.length; m++) { if (b[m].c === b[m - 1].c) { for (var q = m + 1; q < b.length; q++) { if (b[q].c !== b[m - 1].c) { var tt = b[m]; b[m] = b[q]; b[q] = tt; break; } } } }
    return b;
  }
  function tier(o, rnd) {
    var rooms = o.rooms || [], pool = (o.items || []).slice(), seen = {}, by = {}, keys = [];
    rooms.forEach(function (r, i) { if (r.cover) { var cv = {}; for (var k in r.cover) { cv[k] = r.cover[k]; } cv.c = i; pool.push(cv); } });
    pool.forEach(function (x) { if (!x || seen[x.id]) { return; } seen[x.id] = 1; var c = String(x.c); if (!by[c]) { by[c] = []; keys.push(c); } by[c].push(x); });
    var real = [], sm = [];
    keys.forEach(function (c) {
      var l = by[c], nw = l.filter(function (x) { return x.d !== undefined && x.d <= RECENT_D; }), ol = l.filter(function (x) { return !(x.d !== undefined && x.d <= RECENT_D); });
      var q = { c: c, l: shuffle(nw, rnd + 'n' + c).concat(shuffle(ol, rnd + 'o' + c)) };
      (/^\(견본\)/.test(String((rooms[c] || {}).name || '')) ? sm : real).push(q);
    });
    function robin(qs, k, sd) {
      var out = [], last = null, round = 0;
      while (true) {
        var live = qs.filter(function (q) { return q.l.length; }); if (!live.length) { break; }
        var ord = shuffle(live, sd + 'r' + (round++));
        if (ord.length > 1 && ord[0].c === last) { var t0 = ord[0]; ord[0] = ord[1]; ord[1] = t0; }
        ord.forEach(function (q) { var x = q.l.shift(), y = {}; for (var f in x) { y[f] = x[f]; } y.k = k; out.push(y); last = q.c; });
      }
      return out;
    }
    if (real.length >= 3) { return robin(real, 1, rnd).concat(robin(sm, 3, rnd + 's')); }
    return robin(real.concat(sm), 1, rnd);
  }
  var TIERED = {};
  function plaza(p, cb) {
    get('plaza', function (o) {
      if (!o || !o.items) { cb(null); return; }
      var from = Math.max(0, parseInt(p.from, 10) || 0), n = Math.min(48, Math.max(1, parseInt(p.n, 10) || 24)), all = o.items;
      var rnd = String(p.rnd || '').replace(/[^a-z0-9]/gi, '').slice(0, 16);
      if (rnd) { var tk = rnd + '@' + o.at; all = TIERED[tk] || (TIERED[tk] = tier(o, rnd)); }
      var page = all.slice(from, from + n);
      var res = { status: 'ok', items: page, total: all.length, more: from + n < all.length ? 1 : 0, next: from + page.length, pub: 1 };
      if (rnd) { res.rnd = rnd; } if (rnd && String(p.tier) === '1') { res.tier = 1; }
      if (!from) { res.rooms = o.rooms; }
      cb(JSON.parse(JSON.stringify(res)));
    });
  }
  /* 손님(열쇠 없음) 방 첫 화면 — 서버 recHome lite pick 과 같은 꼴 · main=1 이면 마당 줄의 main 초대 열쇠로 */
  function home(p, cb) {
    if (p.k || p.ks || String(p.lite) !== '1') { cb(null); return; }
    function byG(g) { if (!/^[a-f0-9]{32}$/.test(g || '')) { cb(null); return; } get('g:' + g, function (d) { cb(d ? JSON.parse(JSON.stringify(d)) : null); }); }
    if (String(p.main) === '1') { get('plaza', function (o) { byG(o && o.main); }); return; }
    if (p.c && !p.g) { get('c:' + String(p.c).replace(/[^A-Za-z0-9-]/g, ''), function (d) { cb(d ? JSON.parse(JSON.stringify(d)) : null); }); return; }
    if (p.g) { byG(String(p.g).toLowerCase()); return; }
    cb(null);
  }
  window.LFPub = { get: get, plaza: plaza, home: home, sid: SID };
})();
