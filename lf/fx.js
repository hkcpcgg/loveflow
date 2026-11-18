/* ★ 현재 버전 ▶ lf/fx.js · v1 · 261118 · [743 다 · 마 · 결제 완료] 손님 화면 공용 소리 · 움직임
   LFFx.tick()          — 칩을 누를 때 「톡」(또렷하게 · 두 겹 소리)
   LFFx.ding()          — 「띵동」(높은 음 → 낮은 음)
   LFFx.stamp(el, a, b, opt) — el 위에 도장을 「쾅」 찍고 띵동 · a = 윗줄(예: 결제 완료) · b = 아랫줄(예: 날짜)
                          opt.inline = true 면 오른쪽 위가 아니라 el 맨 끝 가운데에 찍음(글을 가리지 않게)
   ★소리는 손님이 화면을 한 번이라도 누른 뒤에만 납니다(휴대폰 브라우저 규칙) — 못 내면 조용히 넘어가고 움직임만 보입니다.
   © 2026 사랑흐름 · LFRI™. 무단 복제 · 배포 · 상업적 이용 금지. */
(function () {
  if (window.LFFx) { return; }
  var ac = null;
  function ctx() {
    try {
      if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (!C) { return null; } ac = new C(); }
      if (ac.state === 'suspended') { ac.resume(); }
      return ac;
    } catch (e) { return null; }
  }
  /* 한 음 — 세모파 + 한 옥타브 위 사인파를 겹쳐 휴대폰 스피커에서도 또렷하게 */
  function note(f, at, len, vol) {
    var c = ctx(); if (!c) { return; }
    try {
      var t = c.currentTime + (at || 0), g = c.createGain(), o1 = c.createOscillator(), o2 = c.createOscillator();
      o1.type = 'triangle'; o1.frequency.value = f;
      o2.type = 'sine'; o2.frequency.value = f * 2.003;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 0.5));
      o1.connect(g); o2.connect(g); g.connect(c.destination);
      o1.start(t); o2.start(t); o1.stop(t + (len || 0.5) + 0.05); o2.stop(t + (len || 0.5) + 0.05);
    } catch (e) { }
  }
  /* 「쾅」 — 낮은 울림 + 짧은 잡음(도장이 종이에 닿는 소리) */
  function thump() {
    var c = ctx(); if (!c) { return; }
    try {
      var t = c.currentTime, g = c.createGain(), o = c.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.22);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.55, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.32);
      var n = Math.floor(c.sampleRate * 0.09), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) { d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); }
      var s = c.createBufferSource(), sg = c.createGain(), lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1400; sg.gain.value = 0.35;
      s.buffer = buf; s.connect(lp); lp.connect(sg); sg.connect(c.destination); s.start(t);
    } catch (e) { }
  }
  function tick() { note(1046.5, 0, 0.2, 0.22); }
  function ding(at) { note(1318.5, at || 0, 0.55, 0.2); note(1046.5, (at || 0) + 0.2, 0.8, 0.2); }

  var css = false;
  function addCss() {
    if (css) { return; } css = true;
    var st = document.createElement('style');
    st.textContent = ''
      + '.lffx-host{position:relative}'
      + '.lffx-stamp{position:absolute;right:10px;top:10px;z-index:5;width:86px;height:86px;border-radius:50%;'
      + 'border:3px solid #8E2F4F;color:#8E2F4F;background:rgba(255,255,255,.88);display:flex;flex-direction:column;'
      + 'align-items:center;justify-content:center;font-weight:900;line-height:1.15;text-align:center;pointer-events:none;'
      + 'box-shadow:inset 0 0 0 3px rgba(255,255,255,.9),inset 0 0 0 4.5px #8E2F4F;transform:rotate(-14deg);'
      + 'animation:lffxStamp .5s cubic-bezier(.3,1.4,.5,1) both}'
      + '.lffx-stamp.in{position:relative;right:auto;top:auto;width:76px;height:76px;margin:8px auto 0}'
      + '.lffx-stamp.in .b{font-size:8.5px;letter-spacing:0}.lffx-stamp.in .a{font-size:13px}'
      + '.lffx-stamp .a{font-size:14px;letter-spacing:.04em}'
      + '.lffx-stamp .b{font-size:10px;letter-spacing:.02em;margin-top:2px;opacity:.85}'
      + '.lffx-stamp .h{font-size:16px;margin-bottom:1px}'
      + '@keyframes lffxStamp{0%{transform:scale(2.6) rotate(-30deg);opacity:0}55%{transform:scale(.92) rotate(-12deg);opacity:1}'
      + '75%{transform:scale(1.04) rotate(-15deg)}100%{transform:scale(1) rotate(-14deg);opacity:1}}'
      + '.lffx-shake{animation:lffxShake .32s ease .26s}'
      + '@keyframes lffxShake{0%,100%{transform:none}25%{transform:translateY(2px)}50%{transform:translateY(-1px)}75%{transform:translateY(1px)}}'
      + '@media (prefers-reduced-motion:reduce){.lffx-stamp{animation:none}.lffx-shake{animation:none}}';
    document.head.appendChild(st);
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function stamp(el, a, b, opt) {
    if (!el) { return; }
    try {
      addCss();
      var old = el.querySelector('.lffx-stamp'); if (old) { old.parentNode.removeChild(old); }
      if (getComputedStyle(el).position === 'static') { el.classList.add('lffx-host'); }
      var s = document.createElement('div'); s.className = 'lffx-stamp' + (opt && opt.inline ? ' in' : '');
      s.innerHTML = '<span class="h">♥</span><span class="a">' + esc(a) + '</span>' + (b ? '<span class="b">' + esc(b) + '</span>' : '');
      setTimeout(function () {
        el.appendChild(s);
        setTimeout(function () { thump(); el.classList.remove('lffx-shake'); void el.offsetWidth; el.classList.add('lffx-shake'); }, 260);
        ding(0.65);
      }, 350);
    } catch (e) { }
  }
  window.LFFx = { tick: tick, ding: function () { ding(0); }, stamp: stamp };
})();
