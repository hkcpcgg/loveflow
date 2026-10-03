/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ memoir/kit.js · v4 · 261003 — ★[대표 시험 261003] ①금빛 줄기가 너무 빠름 — 한 바퀴 3.2초 → 4.8초(속도 3분의 1 줄임) · 속 채움도 같은 박자.
     ②「사랑흐름 · LOVE FLOW」 글자가 흐르지 않음 — SVG 자체 움직임(animate)을 화면에 붙인 뒤 값을 바꾸면 크롬에서 안 도는 일이 있었습니다.
     화면이 직접 한 칸씩 밀어 주는 방식으로 바꿈(초당 23 · 오른쪽). [무손] 모양 · 문구 · 단계 표시 · 쓰는 법.
   ── 이전 ── v3 · 261003 — ★[자서전 공사 24-6 · 대표 결정 261003] ⑤ LFM.wait — 기다리는 화면.
     서버를 기다리는 동안 빈 화면 대신 금빛 줄기가 흘러와 하트를 돌고 속이 금빛으로 차오르며(C-1),
     그 아래 물결 위로 「사랑흐름 · LOVE FLOW」가 같은 방향(오른쪽)으로 흐릅니다(②). 아래에 단계 표시 —
     실제로 끝난 순서대로 ✓. 15초가 넘으면 「연결이 느려요」 한 줄. 0.3초 안에 끝나면 아예 안 뜹니다(깜빡임 없음).
     쓰는 법: LFM.wait.show({title, sub, steps:[…]}) · LFM.wait.step(n) · LFM.wait.done()
     상단바(z 1000)는 그대로 보이고, 잠금·안내 창(z 300)이 이 위에 뜹니다(이 판 z 150).
   ── 이전 ── v2 · 261002 — ★[자서전 공사 14-6 시험 중 발견] 동의 확인을 5초만 기다리고 그냥 들여보내던 것을 15초로 늘립니다.
     처음 부르는 서버(구글 스크립트)는 깨어나는 데 5초를 넘기는 일이 잦아, 동의 기록이 없는 기관 번호(LF-WAU6D)가
     동의 화면을 건너뛰고 들어갔습니다(서버 답은 needConsent:true 로 맞았음 · 261002 실측). 그 밖 한 글자도 안 바꿨습니다.
   ── 이전 ── v1 · 261002 — ★새 부품 (자서전 공사 칸 12)
   자서전 화면 넷(ritual · ask · sign · book)이 함께 쓰는 작은 도구 한 벌.
     ① LFM.story(s)      서버가 주는 「여섯째 자리 · …」를 화면에는 「여섯째 이야기 · …」로
                         (대표 결정 261002 (가) 1안 — 「자리」는 손님 화면에 내지 않음.
                          서버·대장의 이름은 그대로 둡니다 — 거기서 바꾸면 지난 기록과 짝이 끊김)
     ② LFM.HONOR         호칭 「선생님」 — 한 곳에만 둡니다(청소년 경로를 열 때 여기만 바꿈)
     ③ LFM.title(...)    결과물 제목 두 갈래 (대표 결정 261002)
                         여덟 이야기를 다 마치면 「○○○ 선생님의 삶의 여정」
                         아니면 「○○○ 선생님의 기록」 + 「여덟 이야기 가운데 세 번째 이야기까지」
     ④ LFM.consent(pp, go)  동의 기록이 없는 사랑흐름 여권번호면 /consent.html 을 먼저(개2)
                         여권조회(ZJ9X) 답 needConsent 가 true 일 때만. 조회가 15초 넘게 늦거나 실패하면 그냥 go()
   [원칙] 백틱 금지 · 문자열 연결(+)만
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var HAVE_GAS = 'https://script.google.com/macros/s/AKfycbyTroJxyBICtL516b6l9KQ45eQRSaKspj35IXOKET2sHvbS_pAlH2gxM9mvBsVsZJ9X/exec';
  var NTH = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟'];
  var HONOR = '선생님';

  function story(s){
    return String(s == null ? '' : s).replace(/(첫|둘|셋|넷|다섯|여섯|일곱|여덟)째 자리/g, '$1째 이야기');
  }
  function nth(n){
    n = parseInt(n, 10);
    if (isNaN(n) || n < 1) { n = 1; }
    if (n > 8) { n = 8; }
    return NTH[n - 1] + ' 번째';
  }
  /* name · 마친 이야기 수 · 여덟 이야기를 다 마쳤나 → { who, whoHtml, sub, journey } */
  function title(name, doneCount, isJourney){
    var n = parseInt(doneCount, 10);
    if (isNaN(n) || n < 1) { n = 1; }
    var journey = !!isJourney || n >= 8;
    var head = (name ? name + ' ' : '') + HONOR + '의';
    var tail = journey ? '삶의 여정' : '기록';
    return {
      journey: journey,
      who: head + ' ' + tail,
      whoHtml: head + '<br>' + tail,
      sub: journey ? '' : ('여덟 이야기 가운데 ' + nth(n) + ' 이야기까지')
    };
  }

  function consent(pp, go){
    pp = String(pp || '').trim().toUpperCase();
    if (!/^LF[ML]?-[A-Z0-9]{4,8}$/.test(pp)) { go(); return; }
    try { if (sessionStorage.getItem('lf_consent_' + pp) === '1') { go(); return; } } catch (e) {}
    var cb = 'lfmcons_' + Date.now() + '_' + Math.floor(Math.random() * 1e6), done = false;
    function fin(){ if (done) { return; } done = true; try { delete window[cb]; } catch (e) {} go(); }
    window[cb] = function(res){
      if (done) { return; }
      if (res && res.ok && res.needConsent === true) {
        done = true;
        location.href = '/consent.html?id=' + encodeURIComponent(pp) + '&next=' + encodeURIComponent(location.pathname + location.search);
        return;
      }
      if (res && res.ok && res.needConsent === false) {
        try { sessionStorage.setItem('lf_consent_' + pp, '1'); } catch (e) {}
      }
      fin();
    };
    var s = document.createElement('script');
    s.src = HAVE_GAS + '?action=have&id=' + encodeURIComponent(pp) + '&callback=' + cb;
    s.onerror = fin;
    setTimeout(fin, 15000);   /* ★v2 5초 → 15초 — 서버가 깨어날 시간 */
    (document.head || document.body).appendChild(s);
  }


  /* ═══ ⑤ LFM.wait — 기다리는 화면 (v3) ═══ */
  var W = { el:null, t0:0, timer:null, slow:null, on:false, steps:[], cur:0 };
  var HEART = 'M75 64 C 70 48, 52 41, 42 52 C 30 66, 44 84, 75 104 C 106 84, 120 66, 108 52 C 98 41, 80 48, 75 64 Z';
  var FLOW  = 'M4 96 C 24 80, 40 112, 60 92 C 64 88, 68 80, 75 64 C 70 48, 52 41, 42 52 C 30 66, 44 84, 75 104 C 106 84, 120 66, 108 52 C 98 41, 80 48, 75 64 C 82 80, 86 88, 90 92 C 110 112, 126 80, 146 96';
  var WAVE  = 'M-300 30 C -262 10, -225 50, -188 30 S -112 10, -75 30 S 0 50, 38 30 S 112 10, 150 30 S 225 50, 262 30 S 338 10, 375 30 S 450 50, 488 30 S 562 10, 600 30';
  var WORD  = '사랑흐름  ·  LOVE FLOW  ·  ';
  function wCss(){
    if (document.getElementById('lfwCss')) { return; }
    var c = document.createElement('style'); c.id = 'lfwCss';
    c.textContent =
      '#lfw{position:fixed;inset:0;z-index:150;background:rgba(253,251,245,.97);display:flex;align-items:center;justify-content:center;padding:70px 20px 30px;box-sizing:border-box;opacity:0;transition:opacity .35s}'
    + '#lfw.on{opacity:1}'
    + '#lfw .lfw-in{width:100%;max-width:340px;text-align:center;display:flex;flex-direction:column;align-items:center}'
    + '#lfw svg.lfw-h{width:200px;height:170px;overflow:visible}'
    + '#lfw svg.lfw-w{width:100%;height:60px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)}'
    + '#lfw .lfw-ghost{fill:none;stroke:#e2cf9a;stroke-width:1.5;stroke-linecap:round}'
    + '#lfw .lfw-flow{fill:none;stroke:#a9832e;stroke-width:3.5;stroke-linecap:round;stroke-dasharray:60 520;animation:lfwRun 4.8s linear infinite}'
    + '#lfw .lfw-fill{opacity:0;transform-box:fill-box;transform-origin:center;animation:lfwFill 4.8s ease-in-out infinite}'
    + '#lfw .lfw-wt{font-family:"Noto Serif KR",serif;font-size:15px;letter-spacing:.14em;fill:#a9832e}'
    + '#lfw .lfw-msg{font-family:"Noto Serif KR",serif;font-size:18px;color:#163a5e;margin:10px 0 4px;line-height:1.5;word-break:keep-all}'
    + '#lfw .lfw-sub{font-size:14px;color:#8a8070;line-height:1.55;margin-bottom:18px;word-break:keep-all}'
    + '#lfw ol{list-style:none;padding:0;margin:0;text-align:left;width:100%;display:grid;gap:10px}'
    + '#lfw li{display:flex;gap:10px;align-items:center;font-size:15px;color:#a39a89}'
    + '#lfw li i{width:21px;height:21px;border-radius:50%;border:1.5px solid #e2cf9a;flex:none;display:grid;place-items:center;font-style:normal;font-size:12px;color:#fff;box-sizing:border-box}'
    + '#lfw li.ok{color:#2b2b2b}#lfw li.ok i{background:#c9a24a;border-color:#c9a24a}'
    + '#lfw li.now{color:#163a5e;font-weight:700}#lfw li.now i{border-color:#c9a24a;animation:lfwPulse 1.2s ease-in-out infinite}'
    + '#lfw .lfw-slow{margin-top:16px;font-size:13.5px;color:#8a8070;display:none}'
    + '@keyframes lfwRun{0%{stroke-dashoffset:60}100%{stroke-dashoffset:-520}}'
    + '@keyframes lfwFill{0%,38%{opacity:0;transform:scale(.92)}60%{opacity:1;transform:scale(1)}85%{opacity:1}100%{opacity:0}}'
    + '@keyframes lfwPulse{50%{box-shadow:0 0 0 5px rgba(201,162,74,.25)}}'
    + '@media (prefers-reduced-motion: reduce){#lfw .lfw-flow,#lfw .lfw-fill,#lfw li.now i{animation:none}#lfw .lfw-fill{opacity:1}}';
    (document.head || document.body).appendChild(c);
  }
  function wEsc(x){ return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function wPaintSteps(){
    if (!W.el) { return; }
    var ol = W.el.querySelector('ol'); if (!ol) { return; }
    var h = '';
    for (var i = 0; i < W.steps.length; i++) {
      var c = (i < W.cur) ? 'ok' : (i === W.cur ? 'now' : '');
      h += '<li class="' + c + '"><i>' + (i < W.cur ? '&#10003;' : '') + '</i>' + wEsc(W.steps[i]) + '</li>';
    }
    ol.innerHTML = h;
  }
  function wBuild(o){
    wCss();
    var d = document.createElement('div'); d.id = 'lfw'; d.setAttribute('role', 'status'); d.setAttribute('aria-live', 'polite');
    d.innerHTML =
      '<div class="lfw-in">'
    + '<svg class="lfw-h" viewBox="0 0 150 130" aria-hidden="true"><defs><linearGradient id="lfwG" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#f3e2a8"/><stop offset=".55" stop-color="#d9b45c"/><stop offset="1" stop-color="#b8913a"/></linearGradient></defs>'
    + '<path class="lfw-fill" fill="url(#lfwG)" d="' + HEART + '"/><path class="lfw-ghost" d="' + FLOW + '"/><path class="lfw-flow" d="' + FLOW + '"/></svg>'
    + '<svg class="lfw-w" viewBox="0 0 300 50" aria-hidden="true"><path id="lfwP" d="' + WAVE + '" fill="none" stroke="#e2cf9a" stroke-width="1"/>'
    + '<text class="lfw-wt"><textPath href="#lfwP" startOffset="0">' + WORD + WORD + WORD + WORD + WORD + WORD
    + '</textPath></text></svg>'
    + '<div class="lfw-msg">' + wEsc(o.title || '잠시만 기다려 주세요') + '</div>'
    + '<div class="lfw-sub">' + wEsc(o.sub || '') + '</div>'
    + '<ol></ol>'
    + '<div class="lfw-slow">연결이 느려요. 조금만 더 기다려 주세요.</div>'
    + '</div>';
    document.body.appendChild(d);
    W.el = d;
    wPaintSteps();
    wRun(d);
    requestAnimationFrame(function(){ if (W.el) { W.el.className = 'on'; } });
  }
  /* ★v4 글자 흐름 — 브라우저마다 SVG 자체 움직임이 안 도는 일이 있어 화면이 직접 한 칸씩 밀어 줍니다.
     위 금빛 줄기와 같은 방향(오른쪽) · 초당 23 단위 · 한 묶음 길이마다 처음으로 이어 붙음 */
  function wRun(d){
    var tp = d.querySelector('textPath'), t = d.querySelector('.lfw-wt'), unit = 0, x = 0, last = 0;
    if (!tp || !t || !window.requestAnimationFrame) { return; }
    function tick(now){
      if (W.el !== d) { return; }
      if (!unit) { try { unit = t.getComputedTextLength() / 6; } catch (e) { unit = 0; } x = 0; }
      if (unit > 0) {
        var dt = last ? Math.min((now - last) / 1000, 0.1) : 0; last = now;
        x = (x + 23 * dt) % unit;
        tp.setAttribute('startOffset', String(-2 * unit + x));
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var wait = {
    show: function(o){
      o = o || {};
      wait.done(true);
      W.on = true; W.steps = o.steps || []; W.cur = 0;
      W.timer = setTimeout(function(){ W.timer = null; if (W.on && document.body) { wBuild(o); } }, 300);
      W.slow = setTimeout(function(){ var s = W.el && W.el.querySelector('.lfw-slow'); if (s) { s.style.display = 'block'; } }, 15000);
    },
    step: function(n){
      if (!W.on) { return; }
      n = parseInt(n, 10); if (isNaN(n) || n <= W.cur) { return; }
      W.cur = Math.min(n, W.steps.length); wPaintSteps();
    },
    say: function(title, sub){
      if (!W.el) { return; }
      var m = W.el.querySelector('.lfw-msg'), b = W.el.querySelector('.lfw-sub');
      if (m && title) { m.textContent = title; } if (b && sub != null) { b.textContent = sub; }
    },
    done: function(quiet){
      W.on = false;
      if (W.timer) { clearTimeout(W.timer); W.timer = null; }
      if (W.slow) { clearTimeout(W.slow); W.slow = null; }
      var el = W.el; W.el = null;
      if (!el) { return; }
      if (quiet) { try { el.parentNode.removeChild(el); } catch (e) {} return; }
      W.cur = W.steps.length;
      el.className = '';
      setTimeout(function(){ try { el.parentNode.removeChild(el); } catch (e) {} }, 380);
    }
  };

  window.LFM = { story:story, nth:nth, title:title, consent:consent, wait:wait, HONOR:HONOR };
})();
