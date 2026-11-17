/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/dk.js · v4 · 261117 · [707 · 대표 OK 261117 12:00] ★처음 기기 등록 답이 9초를 넘겨 오면 버리던 것 — 서버는 열쇠를 만들었는데 휴대폰에 저장되지 않아 그 뒤 모든 요청이 「열쇠 없음」(접근 기록 261109 15:47 · 261117 09:02 · LF-WJ7ZV — 기기 열쇠 「마지막 사용」 = 만든 때). 늦게 온 등록 답도 받아 열쇠를 저장함. [무손] 그 밖 v3 전부.
   (이전) lf/dk.js · v3 · 261115 · [553 · 대표 OK 22:05] ★카톡 안에서 열린 화면이 곧 바깥 브라우저로 넘어가는데(frame.js) 그 사이 카톡 안 화면이 먼저 「본인 기기」로 등록돼 버려, 정작 쓰는 크롬 · 사파리는 열쇠가 없던 것(접근 기록 261109 · LF-5YHF9 · LF-WJ7ZV) — 카톡 안에서는 화면이 다 열린 뒤 넘어가는지 보고, 넘어가는 화면이면 등록하지 않음. [무손] 그 밖 전부.
   (이전) lf/dk.js · v2 · 261010 · ★편지 서버(…LjdA · v38)도 지켜봄 · 몸통 없는 fetch(주소에 번호)에도 열쇠를 실음(편지 getLetter)
   이전 ▶ lf/dk.js · v1 · 261010 · ★기기 열쇠(자서전 서버 v47 · 유료여행지도 v13-3 · 63차)
   · 사랑흐름 여권번호로 부르는 자서전 · 여행지도 서버 요청에 이 휴대폰의 기기 열쇠(dk)를 저절로 실음.
     화면마다 고치지 않음 — script src · fetch 를 이 파일이 지켜봄. 화면 파일은 이 줄 하나만 더함.
   · 처음 여는 휴대폰이면 서버에 등록을 청함(devClaim) — 등록이 끝날 때까지 그 번호 요청을 잠시 기다리게 함(최대 8초).
   · 다른 휴대폰에 등록된 번호면, 서버가 「막음」 단계일 때만 화면 아래에 「휴대폰 등록」 안내를 띄움.
   · 열쇠는 이 휴대폰 localStorage 에만(lf_dk_번호). 서버에는 지문만 남음.
   [붙이는 자리] 다른 스크립트보다 먼저 — <script src="/lf/dk.js?v=1"></script>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  if (window.LFDK) { return; }
  var MEM = 'https://script.google.com/macros/s/AKfycbxJSELNi3T6YXJP5qGuGcMAFPZBXsUOejNFNFLw0RDWX0qFJlOtVhV38QXWCTKTv6yA/exec';
  var HOSTS = [MEM.split('/exec')[0], 'https://script.google.com/macros/s/AKfycbxLIG_LRAZD3AMJH26gPhefdkwLbXmA5ip_UurBfQ-53bxgq2T63dSre6YO9j4hxBZM1A',
    'https://script.google.com/macros/s/AKfycbxmIVu6EWwIHK8pmaQnrzZMg_r2XiytvrkohHMJDR2lBscC3OPUAZr6qmEOn6DTLjdA'];   /* ★v2 편지 서버 */
  var RE = /^LF[ML]?-[A-Z0-9]{4,8}$/;
  var pend = {}, waits = {};
  var KK = /KAKAOTALK/i.test(navigator.userAgent || '');   /* ★v3 */

  function clean(v) { v = String(v == null ? '' : v).trim().toUpperCase(); return RE.test(v) ? v : ''; }
  function ls(k, v) { try { if (v === undefined) { return localStorage.getItem(k); } if (v === null) { localStorage.removeItem(k); } else { localStorage.setItem(k, v); } } catch (e) { } return null; }
  function key(pp) { return ls('lf_dk_' + pp) || ''; }
  function ours(u) { u = String(u || ''); for (var i = 0; i < HOSTS.length; i++) { if (u.indexOf(HOSTS[i]) === 0) { return true; } } return false; }
  function ppOfUrl(u) {
    var m = /[?&](passport|id)=([^&#]*)/.exec(u);
    return m ? clean(decodeURIComponent(m[2])) : '';
  }
  function addDk(u, pp) { var k = key(pp); if (!k || /[?&]dk=/.test(u)) { return u; } return u + (u.indexOf('?') > -1 ? '&' : '?') + 'dk=' + k; }

  /* 서버 부르기(이 파일 것은 지켜보지 않음) */
  function jsonp(params, done, late) {
    var cb = 'lfdk' + Date.now() + Math.floor(Math.random() * 1000), s = document.createElement('script'), fin = false;
    window[cb] = function (d) { fin = true; try { delete window[cb]; } catch (e) { } if (s.parentNode) { s.parentNode.removeChild(s); } done(d || {}); };
    var q = []; for (var k in params) { if (params[k] != null && params[k] !== '') { q.push(k + '=' + encodeURIComponent(params[k])); } }
    s.setAttribute('data-lfdk', '1');
    RAW_SRC.set.call(s, MEM + '?' + q.join('&') + '&callback=' + cb + '&t=' + Date.now());
    s.onerror = function () { if (!fin) { fin = true; done({ status: 'err' }); } };
    (document.head || document.documentElement).appendChild(s);
    setTimeout(function () {
      if (fin) { return; }
      fin = true;
      /* ★v4 늦은 답 — 기다리던 요청은 먼저 보내되, 나중에 온 답도 버리지 않고 late 로 받음(최대 2분) */
      if (late) {
        window[cb] = function (d) { try { delete window[cb]; } catch (e) { } if (s.parentNode) { s.parentNode.removeChild(s); } late(d || {}); };
        setTimeout(function () { try { delete window[cb]; } catch (e) { } }, 120000);
      } else { try { delete window[cb]; } catch (e) { } }
      done({ status: 'err', reason: 'TIMEOUT' });
    }, 9000);
  }

  /* 처음 기기 등록 — 번호마다 한 번 · 끝나면 기다리던 요청을 보냄 */
  function claim(pp, cb) {
    if (!pp) { cb && cb(); return; }
    if (key(pp)) { cb && cb(); return; }
    /* ★v3 카톡 안 — 화면이 다 열린 뒤(frame.js 가 바깥으로 넘길지 정한 뒤) 다시 봄 · 넘어가는 화면이면 등록하지 않음 */
    if (KK && document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { claim(pp, cb); }); return; }
    if (window.__lfOut) { cb && cb(); return; }
    (waits[pp] = waits[pp] || []).push(cb || function () { });
    if (pend[pp]) { return; }
    pend[pp] = 1;
    var tried = ls('lf_dk_try_' + pp);
    if (tried && (Date.now() - Number(tried)) < 30000) { setTimeout(function () { flush(pp); }, 0); return; }
    ls('lf_dk_try_' + pp, String(Date.now()));
    function got(d) {
      if (d.status === 'ok' && d.dk) { ls('lf_dk_' + pp, d.dk); ls('lf_dk_role_' + pp, d.role || ''); ls('lf_dk_owned_' + pp, null); }
      if (d.status === 'ok' && d.role) { ls('lf_dk_role_' + pp, d.role); }
      if (d.status === 'owned' && !key(pp)) { ls('lf_dk_owned_' + pp, '1'); if (d.mode === '막음') { banner(pp); } }
      if (d.mode) { ls('lf_dk_mode', d.mode); }
    }
    jsonp({ action: 'devClaim', passport: pp }, function (d) { got(d); flush(pp); }, got);   /* ★v4 늦은 답도 got */
  }
  function flush(pp) { var w = waits[pp] || []; waits[pp] = []; pend[pp] = 0; for (var i = 0; i < w.length; i++) { try { w[i](); } catch (e) { } } }

  /* ── script src 지켜보기 ── */
  var RAW_SRC = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
  Object.defineProperty(HTMLScriptElement.prototype, 'src', {
    configurable: true, enumerable: RAW_SRC.enumerable,
    get: function () { return RAW_SRC.get.call(this); },
    set: function (u) {
      var el = this;
      if (el.getAttribute('data-lfdk') || !ours(u)) { return RAW_SRC.set.call(el, u); }
      var pp = ppOfUrl(u);
      if (!pp || key(pp) || /action=dev/.test(u)) { return RAW_SRC.set.call(el, addDk(u, pp)); }
      var gone = false, t = setTimeout(function () { if (!gone) { gone = true; RAW_SRC.set.call(el, addDk(u, pp)); } }, 8000);
      claim(pp, function () { if (!gone) { gone = true; clearTimeout(t); RAW_SRC.set.call(el, addDk(u, pp)); } });
    }
  });
  var rawSetAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (n, v) {
    if (this.tagName === 'SCRIPT' && String(n).toLowerCase() === 'src' && !this.getAttribute('data-lfdk') && ours(v)) { this.src = v; return; }
    return rawSetAttr.apply(this, arguments);
  };

  /* ── fetch 지켜보기 — 몸통(JSON)에 dk 를 넣음 ── */
  if (window.fetch) {
    var rawFetch = window.fetch;
    window.fetch = function (u, o) {
      var url = (typeof u === 'string') ? u : (u && u.url) || '';
      if (!ours(url)) { return rawFetch.apply(this, arguments); }
      if (typeof u === 'string' && (!o || o.body == null)) {   /* ★v2 몸통 없는 요청 — 주소의 번호를 보고 주소에 열쇠를 붙임 */
        var qp = ppOfUrl(url), me = this;
        if (!qp) { return rawFetch.apply(this, arguments); }
        if (key(qp)) { return rawFetch.call(this, addDk(u, qp), o); }
        return new Promise(function (res, rej) {
          var gone2 = false, t2 = setTimeout(function () { if (!gone2) { gone2 = true; rawFetch.call(me, addDk(u, qp), o).then(res, rej); } }, 8000);
          claim(qp, function () { if (!gone2) { gone2 = true; clearTimeout(t2); rawFetch.call(me, addDk(u, qp), o).then(res, rej); } });
        });
      }
      if (!o || typeof o.body !== 'string') { return rawFetch.apply(this, arguments); }
      var b; try { b = JSON.parse(o.body); } catch (e) { return rawFetch.apply(this, arguments); }
      var pp = clean(b.passport) || clean(b.meta && b.meta.passport) || clean(b.row && b.row['여권번호']) || ppOfUrl(url);
      if (!pp) { return rawFetch.apply(this, arguments); }
      var self = this;
      function go() { var k = key(pp); if (k && !b.dk) { b.dk = k; o.body = JSON.stringify(b); } return rawFetch.call(self, u, o); }
      if (key(pp)) { return go(); }
      return new Promise(function (res, rej) {
        var gone = false, t = setTimeout(function () { if (!gone) { gone = true; go().then(res, rej); } }, 8000);
        claim(pp, function () { if (!gone) { gone = true; clearTimeout(t); go().then(res, rej); } });
      });
    };
  }

  /* ── 막음 단계 · 다른 휴대폰 — 아래에 작은 안내 ── */
  function banner(pp) {
    if (/\/lf\/device\.html/.test(location.pathname)) { return; }
    function put() {
      if (document.getElementById('lfdkBar')) { return; }
      var d = document.createElement('div'); d.id = 'lfdkBar';
      d.setAttribute('style', 'position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:3000;background:#1E2A44;color:#fff;border-radius:14px;padding:13px 14px;box-shadow:0 8px 24px rgba(0,0,0,.25);font:14px/1.55 system-ui,"Noto Sans KR",sans-serif;display:flex;gap:10px;align-items:center');
      d.innerHTML = '<span style="flex:1">이 사랑흐름 여권은 다른 휴대폰에 등록되어 있습니다.</span>'
        + '<a href="/lf/device.html?pp=' + encodeURIComponent(pp) + '&back=' + encodeURIComponent(location.pathname + location.search) + '" style="flex:0 0 auto;background:#F2A65A;color:#1E2A44;font-weight:800;text-decoration:none;border-radius:10px;padding:9px 12px">이 휴대폰 등록</a>';
      document.body.appendChild(d);
    }
    if (document.body) { put(); } else { document.addEventListener('DOMContentLoaded', put); }
  }

  /* ── 들어올 때 — 지금 화면의 번호로 미리 등록 ── */
  function ppNow() {
    var q = /[?&](id|passport|pp)=([^&#]*)/.exec(location.search), v = q ? clean(decodeURIComponent(q[2])) : '';
    if (!v) { try { v = clean(sessionStorage.getItem('lf_passport')); } catch (e) { } }
    if (!v) { v = clean(ls('lf_passport')); }
    return v;
  }
  var now = ppNow();
  if (now && !key(now) && !/\/lf\/device\.html/.test(location.pathname)) { claim(now); }
  else if (now && ls('lf_dk_owned_' + now) && ls('lf_dk_mode') === '막음' && !key(now)) { banner(now); }

  window.LFDK = { key: key, claim: claim, clean: clean, call: jsonp, server: MEM, now: ppNow,
    save: function (pp, dk, role) { ls('lf_dk_' + pp, dk); ls('lf_dk_role_' + pp, role || ''); ls('lf_dk_owned_' + pp, null); },
    role: function (pp) { return ls('lf_dk_role_' + pp) || ''; } };
})();
