/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/dk.js · v1 · 261010 · ★기기 열쇠(자서전 서버 v47 · 유료여행지도 v13-3 · 63차)
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
  var HOSTS = [MEM.split('/exec')[0], 'https://script.google.com/macros/s/AKfycbxLIG_LRAZD3AMJH26gPhefdkwLbXmA5ip_UurBfQ-53bxgq2T63dSre6YO9j4hxBZM1A'];
  var RE = /^LF[ML]?-[A-Z0-9]{4,8}$/;
  var pend = {}, waits = {};

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
  function jsonp(params, done) {
    var cb = 'lfdk' + Date.now() + Math.floor(Math.random() * 1000), s = document.createElement('script'), fin = false;
    window[cb] = function (d) { fin = true; try { delete window[cb]; } catch (e) { } if (s.parentNode) { s.parentNode.removeChild(s); } done(d || {}); };
    var q = []; for (var k in params) { if (params[k] != null && params[k] !== '') { q.push(k + '=' + encodeURIComponent(params[k])); } }
    s.setAttribute('data-lfdk', '1');
    RAW_SRC.set.call(s, MEM + '?' + q.join('&') + '&callback=' + cb + '&t=' + Date.now());
    s.onerror = function () { if (!fin) { fin = true; done({ status: 'err' }); } };
    (document.head || document.documentElement).appendChild(s);
    setTimeout(function () { if (!fin) { fin = true; try { delete window[cb]; } catch (e) { } done({ status: 'err', reason: 'TIMEOUT' }); } }, 9000);
  }

  /* 처음 기기 등록 — 번호마다 한 번 · 끝나면 기다리던 요청을 보냄 */
  function claim(pp, cb) {
    if (!pp) { cb && cb(); return; }
    if (key(pp)) { cb && cb(); return; }
    (waits[pp] = waits[pp] || []).push(cb || function () { });
    if (pend[pp]) { return; }
    pend[pp] = 1;
    var tried = ls('lf_dk_try_' + pp);
    if (tried && (Date.now() - Number(tried)) < 30000) { setTimeout(function () { flush(pp); }, 0); return; }
    ls('lf_dk_try_' + pp, String(Date.now()));
    jsonp({ action: 'devClaim', passport: pp }, function (d) {
      if (d.status === 'ok' && d.dk) { ls('lf_dk_' + pp, d.dk); ls('lf_dk_role_' + pp, d.role || ''); }
      if (d.status === 'ok' && d.role) { ls('lf_dk_role_' + pp, d.role); }
      if (d.status === 'owned') { ls('lf_dk_owned_' + pp, '1'); if (d.mode === '막음') { banner(pp); } }
      if (d.mode) { ls('lf_dk_mode', d.mode); }
      flush(pp);
    });
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
      if (!ours(url) || !o || typeof o.body !== 'string') { return rawFetch.apply(this, arguments); }
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
