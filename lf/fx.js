/* ★ 현재 버전 ▶ lf/fx.js · v4 · 261122 · [대표 261122 16:14 「오른쪽 바꿀 소리로」 — 견본표 「축하 · 결정 = 결제 완료 · 발급」] 도장(결제 완료 · 발급)이 띵동 대신 「축하」(솔 → 시 → 레 → 가운데 솔)를 냄. [무손] 그 밖 v3 전부.
   (이전) lf/fx.js · v3 · 261122 · [대표 261122 15:40 · 16:06 「낮은음자리 솔 · 모든 음은 중저음 · 볼륨은 중하로 · 놀래지 않게」] 모든 소리를 솔(G) 바탕 중저음으로 — 사인파 + 한 옥타브 아래(낮은 솔) 겹침 · 0.03초에 스며들 듯 켜짐 · 크기 중하(전보다 약 1/3) · 평소 최고음 레 D4(294Hz) · 축하만 가운데 솔 G4(392Hz). 더함: LFFx.cheer()(축하 · 결정) · LFFx.soft(f, …)(화면마다 따로 지은 소리를 중저음으로 접어 냄 — 높은 음은 옥타브씩 내려 D3~D4 안으로) · LFFx.pick(i)(사람 · 칸 고를 때 솔 5음계) · LFFx.off(참/거짓). 쾅(도장)은 낮은 그대로 · 크기만 줄임. [무손] 도장 모양 · 움직임 · 부르는 이름(tick · ding · hop · twinkle · stamp) 그대로.
   (이전) lf/fx.js · v2 · 261121 · [대표 261121 16:56 「재밌게 살짝살짝 · 띵동 · 창의적으로」] LFFx.twinkle()(반짝 — 도미솔도) · LFFx.hop()(톡톡) 더함 — 모두 사랑흐름이 직접 지은 소리(음원 아님).
   (이전) lf/fx.js · v1 · 261118 · [743 다 · 마 · 결제 완료] 손님 화면 공용 소리 · 움직임
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
  var OFF = false;
  try { OFF = localStorage.getItem('lf_snd_off') === '1'; } catch (e) { }
  /* ★v3 한 음 — 사인파 + 한 옥타브 아래(낮은 솔 결) · 0.03초에 스며들 듯 · 크기 중하 */
  var VOL = 0.06;
  function note(f, at, len, vol) {
    if (OFF) { return; }
    var c = ctx(); if (!c) { return; }
    try {
      var t = c.currentTime + (at || 0), g = c.createGain(), o1 = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain();
      o1.type = 'sine'; o1.frequency.value = f;
      o2.type = 'sine'; o2.frequency.value = f / 2; g2.gain.value = 0.5;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || VOL, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 0.5));
      o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(c.destination);
      o1.start(t); o2.start(t); o1.stop(t + (len || 0.5) + 0.05); o2.stop(t + (len || 0.5) + 0.05);
    } catch (e) { }
  }
  /* ★v3 높은 음은 옥타브씩 내려 D3(147)~D4(294) 안으로 — 화면마다 따로 지은 소리도 중저음으로 */
  function fold(f) { f = +f || 196; while (f > 294) { f = f / 2; } while (f < 140) { f = f * 2; } return f; }
  /* 「쾅」 — 낮은 울림 + 짧은 잡음(도장이 종이에 닿는 소리) */
  function thump() {
    if (OFF) { return; }
    var c = ctx(); if (!c) { return; }
    try {
      var t = c.currentTime, g = c.createGain(), o = c.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.22);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.32);
      var n = Math.floor(c.sampleRate * 0.09), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) { d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); }
      var s = c.createBufferSource(), sg = c.createGain(), lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1400; sg.gain.value = 0.18;
      s.buffer = buf; s.connect(lp); lp.connect(sg); sg.connect(c.destination); s.start(t);
    } catch (e) { }
  }
  /* ★v3 솔(G) 바탕 — D3 146.83 · G3 196 · A3 220 · B3 246.94 · D4 293.66 · G4 392 */
  var D3 = 146.83, E3 = 164.81, G3 = 196, A3 = 220, B3 = 246.94, D4 = 293.66, G4 = 392;
  function tick() { note(G3, 0, 0.22); }
  function ding(at) { note(D4, at || 0, 0.5); note(G3, (at || 0) + 0.22, 0.9); }
  function twinkle() { note(G3, 0, 0.4, 0.05); note(B3, 0.1, 0.4, 0.05); note(D4, 0.2, 0.7, 0.05); }
  function hop() { note(D3, 0, 0.14, 0.05); note(G3, 0.1, 0.24); }
  function cheer(at) { at = at || 0; note(G3, at, 0.4, 0.05); note(B3, at + 0.1, 0.4, 0.05); note(D4, at + 0.2, 0.4, 0.05); note(G4, at + 0.32, 0.9, 0.05); }
  var PENT = [D3, E3, G3, A3, B3, D4];
  function pick(i) { note(PENT[Math.abs(i | 0) % PENT.length], 0, 0.5); }
  /* soft(f, at, len) — f 가 하나 또는 [f, f, …] 이면 차례로(0.14초 간격) */
  function soft(f, at, len) { if (Array.isArray(f)) { f.forEach(function (x, k) { note(fold(x), (at || 0) + k * 0.14, len || 0.6); }); return; } note(fold(f), at || 0, len || 0.5); }

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
        cheer(0.65);
      }, 350);
    } catch (e) { }
  }
  window.LFFx = { tick: tick, ding: function () { ding(0); }, stamp: stamp, twinkle: twinkle, hop: hop, cheer: function () { cheer(0); }, pick: pick, soft: soft,
    off: function (v) { OFF = !!v; try { localStorage.setItem('lf_snd_off', OFF ? '1' : '0'); } catch (e) { } return OFF; }, isOff: function () { return OFF; } };
})();
