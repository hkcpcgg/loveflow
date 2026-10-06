/* ═══════════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/flow.js · v2 · 261006 · [대표 ok 261006 17:15] ★LFFlow.wave(el) · LFFlow.after(단추) — 작은 기다림 물결(관심 · 연결 · 온기 · 표현 · 회복 · 사랑흐름). class="lf-wave" 칸은 저절로 붙음. 결제 · 발권 · 접수 · 그림 · 결과 불러오기 기다림에.
   (이전) v1 · 261006 · [홍보 자료실 → 화면 · 대표 위임 261006 17:08]
   사랑흐름 흐름 그림을 화면에 심는 부품 둘.
     LFFlow.strip(el)  — 홈 맨 위 띠: 나 → 그 사람 → 더 깊은 나 → 우리 → 마을 → 사랑흐름 (물결이 지나가며 마디가 피어남)
     LFFlow.vine(el)   — 둘러보기 · 예매하기: 열 가지가 한 덩굴에 · 어디서 시작해도 불이 옆으로 번짐 · 알을 누르면 그 곳으로
   원본 그림: /promo/flow.html (「흐르는 길」 · 「어디서 시작해도」)
   보일 때만 움직임 · 움직임 줄이기 설정이면 다 핀 모습으로 멈춤 · 바깥 글꼴 · 라이브러리 없음.
   ═══════════════════════════════════════════════════════════════════ */
(function(){
  var NS = 'http://www.w3.org/2000/svg';
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var C = { green:'#2E8B57', leaf:'#5FA14A', mustard:'#C9B43A', orange:'#E8771E', ink:'#2E2A24', sub:'#6B6357', line:'#E6DCCB', empty:'#CDBBE3', bg:'#FFFDF8' };
  function el(t, a, p){ var e = document.createElementNS(NS, t); for (var k in a) { e.setAttribute(k, a[k]); } if (p) { p.appendChild(e); } return e; }
  function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }
  function ease(t){ t = clamp(t, 0, 1); return t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2; }
  function pop(t){ t = clamp(t, 0, 1); return t < .6 ? 1.18*ease(t/.6) : 1.18 - 0.18*ease((t - .6)/.4); }
  function waveD(x0, x1, y, amp, per, ph){ var d = ''; for (var x = x0; x <= x1; x += 6) { d += (x === x0 ? 'M' : 'L') + x.toFixed(1) + ' ' + (y + amp*Math.sin((x/per)*Math.PI*2 + ph)).toFixed(1) + ' '; } return d; }
  var uid = 0;
  function band(svg){
    var id = 'lffB' + (++uid), d = el('defs', {}, svg), g = el('linearGradient', { id:id, x1:0, x2:1, y1:0, y2:0 }, d);
    [['0', C.green], ['.35', C.leaf], ['.7', C.mustard], ['1', C.orange]].forEach(function(s){ el('stop', { offset:s[0], 'stop-color':s[1] }, g); });
    return 'url(#' + id + ')';
  }
  /* 돌리기: 보일 때만 · 화면에 들어오면 처음부터 */
  function run(host, len, draw, reset){
    var t0 = 0, vis = true, raf = 0;
    if (RM) { draw(len * 0.9); return; }
    function tick(now){
      if (!t0) { t0 = now; }
      var t = (now - t0)/1000;
      if (t > len) { t0 = now; t = 0; if (reset) { reset(); } }
      draw(t);
      raf = vis ? requestAnimationFrame(tick) : 0;
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(es){
        es.forEach(function(e){
          if (e.isIntersecting && !vis) { vis = true; t0 = 0; if (reset) { reset(); } raf = requestAnimationFrame(tick); }
          else if (!e.isIntersecting) { vis = false; }
        });
      }).observe(host);
    }
    draw(0); raf = requestAnimationFrame(tick);
  }

  /* ── 홈 맨 위 띠 ── */
  function strip(host){
    if (!host) { return; }
    var svg = el('svg', { viewBox:'0 0 600 150', role:'img', 'aria-label':'나, 그 사람, 더 깊은 나, 우리, 마을이 물결을 따라 이어져 사랑흐름이 됩니다', style:'width:100%;height:100%;display:block;overflow:visible' }, null);
    host.appendChild(svg);
    var bd = band(svg), base = waveD(20, 580, 66, 22, 280, 0.5);
    el('path', { d:base, fill:'none', stroke:C.line, 'stroke-width':6, 'stroke-linecap':'round' }, svg);
    var flow = el('path', { d:base, fill:'none', stroke:bd, 'stroke-width':6, 'stroke-linecap':'round' }, svg);
    var L = flow.getTotalLength ? flow.getTotalLength() : 600; flow.setAttribute('stroke-dasharray', L);
    var S = ['나', '그 사람', '더 깊은 나', '우리', '마을', '사랑흐름'], xs = [52, 151, 250, 349, 448, 547];
    var col = [C.green, C.leaf, C.mustard, '#D9952C', C.orange, '#B8471A'], N = [];
    S.forEach(function(nm, i){
      var x = xs[i], y = 66 + 22*Math.sin((x/280)*Math.PI*2 + 0.5), last = i === 5, r = last ? 29 : 23;
      var c = el('circle', { cx:x, cy:y, r:r, fill:C.bg, stroke:C.empty, 'stroke-width':1.6 }, svg);
      var lab = el('text', { x:x, y:y + r + 24, 'text-anchor':'middle', 'font-size':last ? 21 : 19, 'font-weight':last ? 800 : 700, fill:last ? C.orange : C.sub, 'font-family':'"Noto Sans KR",sans-serif' }, svg);
      lab.textContent = nm;
      var dot = el('circle', { cx:x, cy:y, r:last ? 7 : 5, fill:C.empty }, svg);
      N.push({ c:c, dot:dot, lab:lab, at:(x - 20)/560, r:r, col:col[i], last:last });
    });
    run(host, 9, function(t){
      var p = ease(t/5.6); flow.setAttribute('stroke-dashoffset', (L*(1 - p)).toFixed(1));
      svg.style.opacity = t > 8.4 ? 1 - (t - 8.4)/0.6 : 1;
      N.forEach(function(n){
        var k = p >= n.at, s = k ? pop((p - n.at)*6) : 1;
        n.c.setAttribute('r', (n.r*s).toFixed(2));
        n.c.setAttribute('fill', k ? n.col : C.bg); n.c.setAttribute('stroke', k ? '#fff' : C.empty);
        n.dot.setAttribute('fill', k ? '#fff' : C.empty); n.dot.setAttribute('opacity', k ? .9 : 1);
      });
    });
  }

  /* ── 열 가지 한 덩굴 ── */
  var ITEMS = [
    ['마음', '한마디', '/hanmadi/'], ['마음', '도화지', '/draw/'], ['관계', '나침반', '/compass.html'], ['마음', '여행지도', '/pay.html?item=map'], ['마음여행', '', '/pay.html?item=set'],
    ['한 편의', '기록', '/pay.html?item=memoir'], ['두 분의', '여정', '/pay.html?item=life'], ['미리 써 보는', '나의 자서전', '/youth/'], ['추억록', '', '/memoir/'], ['공동체', '변천사', '/proposal.html']
  ];
  var HUES = ['#2E8B57', '#3F975A', '#5FA14A', '#8FA840', '#B5AE3B', '#C9B43A', '#D8A033', '#E08A28', '#E8771E', '#7A45B5'];
  function vine(host, o){
    if (!host) { return; }
    o = o || {};
    var svg = el('svg', { viewBox:'0 0 600 520', role:'group', 'aria-label':'사랑흐름 열 가지 — 어디서 시작해도 이어집니다', style:'width:100%;height:auto;display:block' }, null);
    host.appendChild(svg);
    var head = el('text', { x:300, y:48, 'text-anchor':'middle', 'font-size':27, 'font-weight':700, fill:C.ink, 'font-family':'"Noto Serif KR",serif' }, svg);
    head.textContent = o.title || '어디서 시작해도, 이어집니다';
    var xs = [96, 198, 300, 402, 504], pts = [], i;
    for (i = 0; i < 5; i++) { pts.push([xs[i], 175 + (i % 2 ? 18 : -18)]); }
    for (i = 4; i >= 0; i--) { pts.push([xs[i], 365 + (i % 2 ? -18 : 18)]); }
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      if (i === 5) { d += ' C ' + (a[0] + 90) + ' ' + a[1] + ', ' + (b[0] + 90) + ' ' + b[1] + ', ' + b[0] + ' ' + b[1]; }
      else { d += ' Q ' + ((a[0] + b[0])/2) + ' ' + ((a[1] + b[1])/2 + (i % 2 ? -30 : 30)) + ' ' + b[0] + ' ' + b[1]; }
    }
    el('path', { d:d, fill:'none', stroke:'#7a5a32', 'stroke-width':6, 'stroke-linecap':'round', opacity:.85 }, svg);
    var N = pts.map(function(p, i){
      var it = ITEMS[i], g = el('a', { href:it[2], 'aria-label':(it[0] + ' ' + it[1]).trim() }, svg);
      g.style.cursor = 'pointer';
      var glow = el('circle', { cx:p[0], cy:p[1], r:50, fill:HUES[i], opacity:0 }, g);
      var c = el('circle', { cx:p[0], cy:p[1], r:42, fill:C.bg, stroke:C.empty, 'stroke-width':2, 'stroke-dasharray':'4 5' }, g);
      var two = it[1] !== '';
      var t1 = el('text', { x:p[0], y:p[1] + (two ? -3 : 5), 'text-anchor':'middle', 'font-size':it[0].length > 4 ? 12.5 : 15, fill:C.sub, 'font-family':'"Noto Sans KR",sans-serif', 'font-weight':500 }, g); t1.textContent = it[0];
      var t2 = el('text', { x:p[0], y:p[1] + 16, 'text-anchor':'middle', 'font-size':it[1].length > 4 ? 12.5 : 15, fill:C.sub, 'font-family':'"Noto Sans KR",sans-serif', 'font-weight':500 }, g); t2.textContent = it[1];
      return { c:c, glow:glow, t1:t1, t2:t2, i:i };
    });
    /* 사랑흐름 표 */
    var bg = el('g', {}, svg);
    el('image', { href:'/lf/emblem.png', x:206, y:452, width:56, height:41 }, bg);
    var bt = el('text', { x:270, y:482, 'font-size':26, 'font-weight':800, fill:C.orange, 'font-family':'"Noto Sans KR",sans-serif' }, bg); bt.textContent = '사랑흐름';
    var be = el('text', { x:272, y:500, 'font-size':8.5, 'letter-spacing':3, fill:C.orange, opacity:.85, 'font-family':'"Noto Sans KR",sans-serif' }, bg); be.textContent = 'LOVE FLOW';
    var start = 4;
    run(host, 8.5, function(t){
      N.forEach(function(n){
        var at = 0.6 + Math.abs(n.i - start)*0.42, tt = t - at, on = tt >= 0;
        n.c.setAttribute('fill', on ? HUES[n.i] : C.bg); n.c.setAttribute('stroke', on ? '#fff' : C.empty); n.c.setAttribute('stroke-dasharray', on ? '0' : '4 5');
        n.c.setAttribute('r', (42*(on ? pop(tt*2) : 1)).toFixed(2));
        n.t1.setAttribute('fill', on ? '#fff' : C.sub); n.t2.setAttribute('fill', on ? '#fff' : C.sub);
        n.glow.setAttribute('opacity', n.i === start ? (0.25 + 0.2*Math.sin(t*4)) : 0);
      });
    }, function(){ start = Math.floor(Math.random()*10); });
  }

  /* ── 작은 기다림 물결 (글이 흐르는 띠) ── */
  function wave(host){
    if (!host || host.getAttribute('data-lfw')) { return host; }
    host.setAttribute('data-lfw', '1');
    host.style.width = host.style.width || '100%'; host.style.maxWidth = host.style.maxWidth || '300px';
    host.style.margin = host.style.margin || '10px auto 0'; host.style.display = 'block';
    var svg = el('svg', { viewBox:'0 0 300 46', 'aria-hidden':'true', style:'width:100%;height:auto;display:block;overflow:hidden' }, null);
    host.appendChild(svg);
    var bd = band(svg), id = 'lffW' + (++uid);
    var ln = el('path', { fill:'none', stroke:bd, 'stroke-width':2.6, 'stroke-linecap':'round' }, svg);
    var tp = el('path', { id:id, fill:'none', stroke:'none' }, svg);
    var tx = el('text', { 'font-size':12, fill:C.sub, 'font-family':'"Noto Sans KR",sans-serif' }, svg);
    var tpp = el('textPath', { href:'#' + id }, tx);
    for (var r = 0; r < 4; r++) {
      el('tspan', {}, tpp).textContent = '관심 · 연결 · 온기 · 표현 · 회복 · ';
      var b = el('tspan', { fill:C.orange, 'font-weight':700, 'font-size':13.5 }, tpp); b.textContent = '사랑흐름';
      el('tspan', {}, tpp).textContent = ' · ';
    }
    var seg = 0, t0 = 0;
    function tick(now){
      if (!host.isConnected) { return; }
      if (!t0) { t0 = now; }
      var t = (now - t0)/1000, ph = RM ? 0 : -t*1.6;
      ln.setAttribute('d', waveD(-10, 310, 34, 6, 160, ph));
      tp.setAttribute('d', waveD(-10, 1400, 24, 6, 160, ph));
      if (!seg) { try { seg = tx.getComputedTextLength()/4; } catch (e) { seg = 300; } }
      tpp.setAttribute('startOffset', (-(RM ? 0 : (t*34) % (seg || 300))).toFixed(1));
      if (!RM) { requestAnimationFrame(tick); }
    }
    requestAnimationFrame(tick);
    return host;
  }
  /* 단추 · 글 바로 아래에 물결 하나 — 돌려받은 것의 remove() 로 걷음 */
  function after(ref){
    if (!ref || !ref.parentNode) { return null; }
    var d = document.createElement('div'); d.className = 'lf-wave';
    ref.parentNode.insertBefore(d, ref.nextSibling); wave(d);
    return { remove:function(){ if (d.parentNode) { d.parentNode.removeChild(d); } } };
  }
  function auto(){ var a = document.querySelectorAll('.lf-wave'); for (var i = 0; i < a.length; i++) { wave(a[i]); } }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', auto); } else { auto(); }

  window.LFFlow = { strip:strip, vine:vine, wave:wave, after:after };
})();
