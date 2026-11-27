/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/pay-one.js · v3 · 261127 · [사랑흐름 총괄 68번 · 대표 OK 12:50] 결제 창으로 가기 직전에 마음 카드 서버(12 버전 a=pend)에 「이 주문번호 = 이 장들」을 맡김 › 손님이 돌아오지 못해도 서버가 5분 안에 「유료」로 붙임. 맡기기가 늦거나 안 돼도 결제는 그대로 이어짐(8초 기다림). 그 밖 v2 그대로.
   (이전) lf/pay-one.js · v2 · 261125 · [착수 차례 5-2 유료 기능 잠금] render 에 note(넣은 유료 기능 · 결제하지 않으면 어떻게 보이는지) 한 줄. 그 밖 v1 그대로.
   (이전) lf/pay-one.js · v1 · 261125 · [착수 차례 5-1 손님 결제 화면 잇기]
   마음 카드 · 디지털 포스터를 다 만든 화면에 붙는 「유료 결제」 상자 하나.

   ─ 판매 스위치 ─ 값은 결제 서버(유료여행지도 tossConfirm v6 · op=price)가 서버 보관함 CARD_PRICE · POSTER_PRICE 를 읽어 알려 줌.
                  값이 0(넣지 않음)이면 상자를 아예 그리지 않음 = 지금처럼 무료로만 보임.
   ─ 흐름 ─ 동의 한 줄 › 「결제 창으로 잠시 이동해요」 양해 › 토스 결제 창(주문번호 LF-CARD-12자리 · LF-POSTER-12자리)
           › 돌아오면 결제 서버 tossConfirm 승인 › 마음 카드 서버 a=pay(장마다 「유료」) › 「유료 카드가 됐어요」
   ─ 근거 ─ 승인 줄에 들어온 길 · 안내자(ORG-…)를 함께 적음(외부 안내자 수수료 근거) · 손님 연락처는 받지 않음.
   ─ 쓰는 법 ─
       LFPayOne.render(상자, { kind:'card'|'poster', ver:'3-7', items:[{id,k}], name:'마음 카드 3장', back:'/card/make.html',
                               extra:{…돌아와서 쓸 것}, beforeLeave:function(done){ done(true); } })
       LFPayOne.resume('card', function(r){ r.state = 'paid' | 'fail' | 'linkfail' · r.pend = 떠나기 전 적어 둔 것 })
   [원칙] 백틱 금지 · 문자열 연결(+)만
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var PAY = 'https://script.google.com/macros/s/AKfycbxLIG_LRAZD3AMJH26gPhefdkwLbXmA5ip_UurBfQ-53bxgq2T63dSre6YO9j4hxBZM1A/exec';
  var CARD = 'https://script.google.com/macros/s/AKfycby0RS9OH3NeQI3uuG7HemoGfcNOA_LK0cdpGfvrreP-FaS3837qQ5O4R194R42PYzC7/exec';
  var CK = 'live_ck_nRQoOaPz8LEovWPx0WGN3y47BMw6';
  var PEND = 'lfPayPend', PAID = 'lfPaidIds';
  var WORD = { card: { n: '마음 카드', one: '장', up: '유료 카드', sample: '/card/sample.html', same: '보낸 주소는 그대로예요.' },
               poster: { n: '디지털 포스터', one: '장', up: '유료 포스터', sample: '', same: '주소와 QR은 그대로예요.' } };
  var WAYS = { invite: '초대장', guide: '안내 받아보기', partner: '안내자', org: '기관', ad: '광고', direct: '직접' };

  function ls(k, v){ try{ if (v === undefined) { return localStorage.getItem(k) || ''; } if (v === '') { localStorage.removeItem(k); } else { localStorage.setItem(k, v); } }catch(e){ return ''; } }
  function esc(x){ return String(x == null ? '' : x).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function won(n){ return Number(n || 0).toLocaleString('ko-KR') + '원'; }

  /* 들어온 길 · 안내자 — lf/way.js · pay.html lfOrg 와 같은 기억 자리(lf_way · lf_org)를 씀. 이 화면 주소에 꼬리표가 있으면 새로 적음 */
  (function pick(){
    try{
      var q = new URLSearchParams(location.search), now = (new Date()).getTime();
      var w = (q.get('way') || '').toLowerCase();
      if (w) { localStorage.setItem('lf_way', (WAYS[w] || '그 밖') + '|' + now); }
      else if (q.get('utm_source') || q.get('utm_medium')) { localStorage.setItem('lf_way', '광고|' + now); }
      var o = /^ORG-[A-Za-z0-9]+$/i.exec(q.get('lf') || '');
      if (o) { localStorage.setItem('lf_org', o[0].toUpperCase() + '|' + now); }
    }catch(e){}
  })();
  function org(){ var v = ls('lf_org').split('|')[0] || ''; return /^ORG-[A-Za-z0-9]+$/i.test(v) ? v.toUpperCase() : ''; }
  function way(){
    var raw = ls('lf_way'), a = raw.split('|');
    if (raw && (new Date()).getTime() - Number(a[1] || 0) <= 30 * 24 * 3600 * 1000 && a[0]) { return a[0]; }
    return org() ? '안내자' : '직접';
  }

  function jsonp(base, params, done){
    var cb = 'lfpo' + Date.now() + Math.floor(Math.random() * 1000), fin = false, sc = document.createElement('script');
    var tm = setTimeout(function(){ if (fin) { return; } fin = true; cl(); done(null); }, 25000);
    function cl(){ try{ delete window[cb]; }catch(e){ window[cb] = undefined; } if (sc.parentNode) { sc.parentNode.removeChild(sc); } }
    window[cb] = function(r){ if (fin) { return; } fin = true; clearTimeout(tm); cl(); done(r); };
    var u = base + '?callback=' + cb;
    for (var k in params) { if (params[k] !== '' && params[k] != null) { u += '&' + k + '=' + encodeURIComponent(params[k]); } }
    sc.src = u; sc.onerror = function(){ if (fin) { return; } fin = true; clearTimeout(tm); cl(); done(null); };
    document.body.appendChild(sc);
  }

  /* 값 묻기 — 10분 기억 · 서버가 답하지 않으면 0(상자 안 그림) */
  function price(kind, cb){
    try{ var c = JSON.parse(sessionStorage.getItem('lfPayPrice') || 'null'); if (c && Date.now() - c.at < 600000) { return cb(Number(c[kind]) || 0); } }catch(e){}
    jsonp(PAY, { action: 'tossConfirm', op: 'price' }, function(r){
      if (!r || r.status !== 'ok') { return cb(0); }
      try{ sessionStorage.setItem('lfPayPrice', JSON.stringify({ at: Date.now(), card: Number(r.card) || 0, poster: Number(r.poster) || 0 })); }catch(e){}
      cb(Number(r[kind]) || 0);
    });
  }

  function paidIds(){ try{ return JSON.parse(ls(PAID) || '{}'); }catch(e){ return {}; } }
  function markPaid(items, oid){ var o = paidIds(); items.forEach(function(x){ o[x.id] = oid; }); ls(PAID, JSON.stringify(o)); }
  function oid(kind){
    var s = '', ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', a = new Uint8Array(12);
    try{ crypto.getRandomValues(a); }catch(e){ for (var j = 0; j < 12; j++) { a[j] = Math.floor(Math.random() * 256); } }
    for (var i = 0; i < 12; i++) { s += ch.charAt(a[i] % ch.length); }
    return 'LF-' + kind.toUpperCase() + '-' + s;
  }

  var CSS = '.lfpo{background:#fff;border:1px solid #E4E0D8;border-radius:16px;padding:16px 16px 14px;margin:14px 0;text-align:left;color:#1D2433}'
    + '.lfpo h4{margin:0 0 4px;font-size:16px;font-weight:800}'
    + '.lfpo .sum{font-size:15px;margin:2px 0 6px}.lfpo .sum b{font-size:18px}'
    + '.lfpo .cmp{display:inline-block;font-size:13px;color:#1B2C47;text-decoration:underline;margin-bottom:8px}'
    + '.lfpo label{display:flex;gap:8px;align-items:flex-start;font-size:14px;line-height:1.5;cursor:pointer;min-height:44px;padding-top:6px}'
    + '.lfpo label input{width:20px;height:20px;flex:0 0 20px;margin:1px 0 0;accent-color:#1B2C47}'
    + '.lfpo .s{font-size:12.5px;color:#667085;line-height:1.6;margin:2px 0 10px}.lfpo .s a{color:#667085}'
    + '.lfpo button.go{width:100%;min-height:50px;border:0;border-radius:14px;background:#1B2C47;color:#fff;font:inherit;font-weight:800;font-size:16px;cursor:pointer}'
    + '.lfpo button.go:disabled{opacity:.5;cursor:default}'
    + '.lfpo.ok{text-align:center}.lfpo.ok h4{color:#1B2C47}.lfpo .msg{font-size:14px;color:#667085;line-height:1.6;margin:4px 0 0}'
    + '.lfpo-lv{position:fixed;inset:0;z-index:3000;background:rgba(15,20,30,.55);display:none;align-items:flex-end;justify-content:center}'
    + '.lfpo-lv.on{display:flex}'
    + '.lfpo-lv .bx{width:100%;max-width:480px;background:#fff;border-radius:20px 20px 0 0;padding:22px 20px 26px;text-align:center;color:#1D2433}'
    + '.lfpo-lv h3{font-size:17px;margin:0 0 8px}.lfpo-lv p{font-size:14px;color:#667085;line-height:1.7;margin:0 0 16px}'
    + '.lfpo-lv .row{display:flex;gap:8px}.lfpo-lv .row button{flex:1;border:0;border-radius:14px;padding:14px;font:inherit;font-weight:800;font-size:15px;cursor:pointer;min-height:48px}'
    + '.lfpo-lv .no{background:#F1EEE8;color:#1D2433}.lfpo-lv .yes{background:#1B2C47;color:#fff}';
  function css(){ if (document.getElementById('lfpoCss')) { return; } var s = document.createElement('style'); s.id = 'lfpoCss'; s.textContent = CSS; document.head.appendChild(s); }

  function toss(cb, fail){
    if (window.TossPayments) { return cb(); }
    var sc = document.createElement('script'); sc.src = 'https://js.tosspayments.com/v2/standard';
    sc.onload = cb; sc.onerror = fail; document.head.appendChild(sc);
  }

  /* 결제 창으로 가기 전 양해 */
  function leave(go, W){
    css();
    var lv = document.getElementById('lfpoLv');
    if (!lv) {
      lv = document.createElement('div'); lv.className = 'lfpo-lv'; lv.id = 'lfpoLv';
      lv.innerHTML = '<div class="bx"><h3>결제 창으로 잠시 이동해요</h3><p id="lfpoLvP"></p><div class="row"><button type="button" class="no" id="lfpoNo">취소</button><button type="button" class="yes" id="lfpoGo">결제하러 가기</button></div></div>';
      document.body.appendChild(lv);
    }
    document.getElementById('lfpoLvP').innerHTML = '카드 결제는 토스 결제 창에서 해요.<br>만든 ' + W.n + '는 그대로 있어요.<br>결제를 마치시면 이 자리로 돌아와요.';
    lv.classList.add('on');
    var g = document.getElementById('lfpoGo');
    g.disabled = false; g.textContent = '결제하러 가기';
    document.getElementById('lfpoNo').onclick = function(){ lv.classList.remove('on'); };
    g.onclick = function(){ g.disabled = true; g.textContent = '결제 창을 여는 중이에요…'; go(function(){ g.disabled = false; g.textContent = '결제하러 가기'; lv.classList.remove('on'); }); };
    return lv;
  }

  function render(el, o){
    if (!el) { return; }
    css();
    var W = WORD[o.kind] || WORD.card, items = (o.items || []).filter(function(x){ return x && x.id && x.k; });
    var P = paidIds(), left = items.filter(function(x){ return !P[x.id]; });
    if (!items.length) { el.innerHTML = ''; return; }
    if (!left.length) {
      el.innerHTML = '<div class="lfpo ok"><h4>✓ ' + W.up + '예요</h4><p class="msg">결제가 끝났어요. ' + W.same + '</p></div>';
      return;
    }
    price(o.kind, function(n){
      if (!(n > 0)) { el.innerHTML = ''; return; }   /* 판매 스위치 꺼짐 — 아무것도 안 보임 */
      var nm = o.name || (W.n + ' ' + left.length + W.one);
      el.innerHTML = '<div class="lfpo"><h4>' + W.up + '로 보내기</h4>'
        + '<div class="sum">' + esc(nm) + ' · <b>' + won(n) + '</b></div>'
        + (o.note ? '<p class="s" style="margin:0 0 6px;color:#1D2433">' + esc(o.note) + '</p>' : '')
        + (W.sample ? '<a class="cmp" href="' + W.sample + '" target="_blank" rel="noopener">무료 · 유료 비교 보기 ›</a>' : '')
        + '<label><input type="checkbox" class="ag"> 결제 내용을 확인했고 결제에 동의해요</label>'
        + '<p class="s">디지털 콘텐츠 · 만든 날부터 1년 보관 · 환불은 <a href="/trust.html#refund" target="_blank" rel="noopener">환불정책</a>을 따라요</p>'
        + '<button type="button" class="go">결제하기</button></div>';
      var ag = el.querySelector('.ag'), bt = el.querySelector('.go');
      ag.onchange = function(){ var t = el.querySelector('.msg'); if (t) { t.textContent = ''; } };
      bt.onclick = function(){
        if (!ag.checked) { ag.focus(); tip(el, '결제 내용을 확인하고 동의에 체크해 주세요'); return; }
        leave(function(back){
          var before = o.beforeLeave || function(d){ d(true); };
          before(function(ok){
            if (!ok) { back(); tip(el, '만든 내용을 담아 두지 못했어요. 잠시 뒤 다시 해 주세요'); return; }
            var id = oid(o.kind);
            var pend = { kind: o.kind, ver: o.ver || '', oid: id, amount: n, items: left, extra: o.extra || null, at: Date.now() };
            ls(PEND, JSON.stringify(pend));
            var to = location.origin + (o.back || location.pathname);
            to += (to.indexOf('?') < 0 ? '?' : '&');
            pendAhead(pend, function(){ toss(function(){
              try{
                window.TossPayments(CK).payment({ customerKey: 'LFC-' + id.slice(-12) }).requestPayment({
                  method: 'CARD', amount: { currency: 'KRW', value: n }, orderId: id,
                  orderName: '사랑흐름 ' + W.n + (o.kind === 'card' && left.length > 1 ? ' ' + left.length + '장' : ''),
                  successUrl: to + 'cpay=1', failUrl: to + 'cpay=0',
                  card: { useEscrow: false, flowMode: 'DEFAULT' }
                })['catch'](function(){ back(); });
              }catch(e){ back(); tip(el, '결제 창을 열지 못했어요'); }
            }, function(){ back(); tip(el, '결제 창을 불러오지 못했어요'); }); });
          });
        }, W);
      };
    });
  }

  function tip(el, m){
    var t = el.querySelector('.msg');
    if (!t) { t = document.createElement('p'); t.className = 'msg'; (el.querySelector('.lfpo') || el).appendChild(t); }
    t.textContent = m;
  }

  /* v3 결제 창 가기 전 맡기기 — 서버가 「이 주문번호 = 이 장들」을 알아 두면 창을 닫아도 붙일 수 있음 · 늦거나 안 돼도 결제는 이어감 */
  function pendAhead(pend, go){
    var done = false, tm = setTimeout(function(){ if (!done) { done = true; go(); } }, 8000);
    function fin(){ if (done) { return; } done = true; clearTimeout(tm); go(); }
    var body = { a: 'pend', kind: pend.kind, orderId: pend.oid };
    if (pend.kind === 'card') { body.items = pend.items; } else { body.id = pend.items[0].id; body.k = pend.items[0].k; }
    try{
      fetch(CARD, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
        .then(function(){ fin(); })['catch'](function(){ fin(); });
    }catch(e){ fin(); }
  }

  /* 카드 서버에 「유료」 잇기 */
  function link(pend, cb){
    var body = { a: 'pay', kind: pend.kind, orderId: pend.oid };
    if (pend.kind === 'card') { body.items = pend.items; } else { body.id = pend.items[0].id; body.k = pend.items[0].k; }
    fetch(CARD, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d && d.ok) { markPaid(pend.items, pend.oid); ls(PEND, ''); return cb({ state: 'paid', pend: pend }); }
        cb({ state: 'linkfail', pend: pend, code: d && d.code || '' });
      })['catch'](function(){ cb({ state: 'linkfail', pend: pend, code: 'net' }); });
  }

  /* 결제 서버 승인 — 돈이 실제로 나가는 단계. 답이 없으면 주문을 남겨 두고 다음에 이 화면을 열 때 다시 물음(같은 주문은 두 번 나가지 않음) */
  function confirm(pend, cb){
    jsonp(PAY, { action: 'tossConfirm', paymentKey: pend.pk, orderId: pend.oid, amount: pend.am,
                 ag: (pend.kind === 'card' ? 'c' : 'p') + (pend.ver || '0-0') + '.1', way: way(), org: org() }, function(r){
      if (!r) { return cb({ state: 'fail', pend: pend, wait: true, msg: '결제 확인이 늦어지고 있어요. 잠시 뒤 이 화면을 다시 열면 이어서 확인해요.' }); }
      if (r.status !== 'ok') { ls(PEND, ''); return cb({ state: 'fail', pend: pend, msg: r.msg || '결제가 끝나지 않았어요. 카드에서 돈은 나가지 않았어요.' }); }
      pend.confirmed = true; ls(PEND, JSON.stringify(pend));
      link(pend, cb);
    });
  }

  /* 토스에서 돌아왔을 때 — 주소의 cpay · paymentKey · orderId · amount */
  function resume(kind, cb){
    var q = new URLSearchParams(location.search), c = q.get('cpay');
    var pend = null; try{ pend = JSON.parse(ls(PEND) || 'null'); }catch(e){ pend = null; }
    if (!c) {
      /* 지난번에 승인 · 「유료」 잇기가 못 끝난 채 남은 것 — 이어서 */
      if (pend && pend.kind === kind && pend.confirmed) { return link(pend, cb); }
      if (pend && pend.kind === kind && pend.pk) { return confirm(pend, cb); }
      return;
    }
    try{ history.replaceState(null, '', location.pathname); }catch(e){}
    if (c !== '1') { if (pend && pend.kind === kind) { ls(PEND, ''); } return cb({ state: 'fail', pend: pend, msg: '결제가 끝나지 않았어요. 카드에서 돈은 나가지 않았어요.' }); }
    if (!pend || pend.kind !== kind) { return cb({ state: 'fail', msg: '결제 정보를 찾지 못했어요. 카드에서 돈이 나갔다면 카카오톡으로 알려 주세요.' }); }
    var id = q.get('orderId') || '';
    if (id !== pend.oid) { return cb({ state: 'fail', pend: pend, msg: '결제 정보가 맞지 않아요. 카카오톡으로 알려 주세요.' }); }
    pend.pk = q.get('paymentKey') || ''; pend.am = Number(q.get('amount') || 0);
    ls(PEND, JSON.stringify(pend));
    confirm(pend, cb);
  }

  window.LFPayOne = { render: render, resume: resume, relink: link, price: price, paidIds: paidIds, pending: function(){ try{ return JSON.parse(ls(PEND) || 'null'); }catch(e){ return null; } } };
})();
