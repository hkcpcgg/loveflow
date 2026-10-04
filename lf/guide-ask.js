/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/guide-ask.js · v1 · 261004 — ★새 부품 · 칸 28 「나도 자서전 안내 받아보기」
   대표 결정 261004(카톡 상담 창 같은 작은 창 · 이메일로 가이드북 · 「상담」 말 안 씀) · 35차 결의 3 · 4 · 36차 클로드 답변
     LFG.open(from)    작은 창을 아래에서 올림
     LFG.bubble(from)  화면 오른쪽 아래에 작은 단추 「📖 자서전 안내 받아보기」(인쇄할 때 숨김)
     from = 고맙습니다 화면 · 결과물 · 사이트 · 종이 물음지 · 안내 화면 (온 화면만 적음 — 초대장 열쇠 · 여권번호는 보내지 않음)
   서버: 자서전 서버 v29 guideAsk(POST) → 「사랑흐름 개인정보」 파일 「안내 요청」 탭 · 1년 뒤 지움 · 대표 메일 알림
   [원칙] 백틱 금지 · 문자열 연결(+)만
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var GAS = 'https://script.google.com/macros/s/AKfycbxJSELNi3T6YXJP5qGuGcMAFPZBXsUOejNFNFLw0RDWX0qFJlOtVhV38QXWCTKTv6yA/exec';
  var FROM = '사이트', ST = { need: false };
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function $(i){ return document.getElementById(i); }
  function css(){
    if ($('lfgCss')) { return; }
    var c = document.createElement('style'); c.id = 'lfgCss';
    c.textContent = '#lfgBub{position:fixed;right:14px;bottom:18px;z-index:900;background:#E59273;color:#fff;border:0;border-radius:24px;padding:11px 16px;font:700 15px "Noto Sans KR",system-ui,sans-serif;box-shadow:0 6px 18px rgba(229,146,115,.38);cursor:pointer}'
      + '@media print{#lfgBub,#lfg{display:none!important}}'
      + '#lfg{position:fixed;inset:0;z-index:2600;background:rgba(74,59,46,.42);display:flex;align-items:flex-end;justify-content:center;font-family:"Noto Sans KR",system-ui,sans-serif}'
      + '#lfg .sh{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:#FFFAF4;border-radius:24px 24px 0 0;padding:18px 18px 22px;color:#4a3b2e;box-shadow:0 -8px 30px rgba(0,0,0,.15);animation:lfgUp .28s ease-out}'
      + '@keyframes lfgUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}'
      + '#lfg .grip{width:44px;height:5px;border-radius:3px;background:#E8CDB5;margin:0 auto 10px}'
      + '#lfg h3{font-family:"Noto Serif KR",serif;font-size:20px;color:#5a3e2b;margin:0;text-align:center}'
      + '#lfg .s{font-size:14.5px;color:#8a7a68;text-align:center;margin:4px 0 10px;word-break:keep-all}'
      + '#lfg label.f{display:block;font-size:14px;font-weight:700;color:#5a3e2b;margin:10px 2px 4px}'
      + '#lfg label.f small{font-weight:400;color:#9a8a78}'
      + '#lfg input.t{width:100%;box-sizing:border-box;font:16px "Noto Sans KR",sans-serif;padding:11px 12px;border:1.5px solid #E8CDB5;border-radius:12px;background:#fff;color:#2b2b2b}'
      + '#lfg .need{display:flex;gap:10px;align-items:flex-start;background:#EEF6EF;border-radius:14px;padding:11px 12px;margin-top:12px;cursor:pointer}'
      + '#lfg .need b{display:block;color:#2f6b45;font-size:15.5px}#lfg .need span{font-size:13.5px;color:#4f6b58;word-break:keep-all}'
      + '#lfg input[type=checkbox]{width:21px;height:21px;flex:none;margin-top:2px;accent-color:#E59273}'
      + '#lfg .ag{display:flex;gap:9px;align-items:flex-start;font-size:13.5px;color:#5b4a3a;margin-top:9px;word-break:keep-all;line-height:1.55}'
      + '#lfg .ag em{font-style:normal;font-weight:700;color:#B0412E}'
      + '#lfg .b{display:block;width:100%;padding:14px;border-radius:16px;border:0;background:#E59273;color:#fff;font:700 17px "Noto Sans KR",sans-serif;cursor:pointer;margin-top:14px}'
      + '#lfg .b:disabled{opacity:.5}'
      + '#lfg .x{display:block;margin:10px auto 0;background:none;border:0;color:#9a8a78;text-decoration:underline;font-size:14px;cursor:pointer}'
      + '#lfg .er{color:#B0412E;font-weight:700;font-size:14px;text-align:center;min-height:1em;margin-top:8px}'
      + '#lfg .big{font-size:46px;text-align:center;margin:8px 0}'
      + '#lfg .lk{display:block;text-align:center;margin-top:12px;color:#1E4A76;font-weight:700}';
    document.head.appendChild(c);
  }
  function box(h){
    var o = $('lfg');
    if (!o) { o = document.createElement('div'); o.id = 'lfg'; o.onclick = function(e){ if (e.target === o) { close(); } }; document.body.appendChild(o); }
    o.innerHTML = '<div class="sh"><div class="grip"></div>' + h + '</div>';
  }
  function close(){ var o = $('lfg'); if (o && o.parentNode) { o.parentNode.removeChild(o); } }
  function v(i){ var e = $(i); return e ? String(e.value || '').trim() : ''; }
  function form(){
    var k = { em: v('lfgEm'), nm: v('lfgNm'), ph: v('lfgPh'), rg: v('lfgRg') };
    box('<h3>📖 나도 자서전 안내 받아보기</h3>'
      + '<div class="s">사랑흐름 안내 가이드북을 이메일로 보내 드려요</div>'
      + '<label class="f" for="lfgEm">이메일</label><input class="t" id="lfgEm" type="email" inputmode="email" autocomplete="email" placeholder="예: hong@naver.com" value="' + esc(k.em) + '">'
      + '<label class="f" for="lfgNm">성명 <small>(적지 않으셔도 됩니다)</small></label><input class="t" id="lfgNm" maxlength="20" autocomplete="name" value="' + esc(k.nm) + '">'
      + '<label class="f" for="lfgPh">전화 <small>' + (ST.need ? '(안내자가 연락드려요)' : '(적지 않으셔도 됩니다)') + '</small></label><input class="t" id="lfgPh" type="tel" inputmode="tel" maxlength="20" placeholder="010-0000-0000" value="' + esc(k.ph) + '">'
      + '<label class="need"><input type="checkbox" id="lfgNeed" ' + (ST.need ? 'checked' : '') + ' onchange="LFG._need(this.checked)"><div><b>곁에서 도와주는 안내자가 필요해요</b><span>휴대폰이 어려우셔도 괜찮아요. 사랑흐름 안내자가 찾아가 도와 드려요.</span></div></label>'
      + (ST.need ? '<label class="f" for="lfgRg">사는 곳 <small>(시 · 군)</small></label><input class="t" id="lfgRg" maxlength="30" placeholder="예: 경기 파주시" value="' + esc(k.rg) + '">' : '')
      + '<label class="ag"><input type="checkbox" id="lfgA1"><span><em>(꼭)</em> 가이드북을 보내 드리려고 이메일 · 성명 · 전화를 받습니다. 받은 날부터 1년 뒤 지웁니다.</span></label>'
      + (ST.need ? '<label class="ag"><input type="checkbox" id="lfgA2"><span><em>(꼭)</em> 안내자 연결을 위해 성명 · 전화 · 사는 곳을 그 지역 사랑흐름 안내자에게 전합니다. 연결이 끝나면 안내자는 지웁니다.</span></label>' : '')
      + '<label class="ag"><input type="checkbox" id="lfgA3"><span>(골라도 됩니다) 사랑흐름 새 소식을 이메일로 받겠습니다.</span></label>'
      + '<div class="er" id="lfgEr"></div>'
      + '<button class="b" id="lfgGo" onclick="LFG._send()">안내 받아보기</button>'
      + '<button class="x" onclick="LFG.close()">닫기</button>');
  }
  function need(on){ ST.need = !!on; var y = 0; form(); try { if (on) { $('lfgRg').focus(); } } catch (e) {} }
  function err(t){ var e = $('lfgEr'); if (e) { e.textContent = t; } }
  function send(){
    var em = v('lfgEm'), nm = v('lfgNm'), ph = v('lfgPh'), rg = v('lfgRg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err('이메일을 다시 확인해 주세요.'); return; }
    if (ST.need && ph.replace(/\D/g, '').length < 9) { err('안내자가 연락드릴 전화를 적어 주세요.'); return; }
    if (ST.need && !rg) { err('사는 곳(시 · 군)을 적어 주세요.'); return; }
    if (!$('lfgA1').checked) { err('가이드북을 보내 드리는 데 동의해 주세요.'); return; }
    if (ST.need && !$('lfgA2').checked) { err('안내자 연결에 동의해 주세요.'); return; }
    var b = $('lfgGo'); b.disabled = true; b.textContent = '보내고 있어요…';
    var body = { action: 'guideAsk', email: em, name: nm, phone: ph, need: ST.need ? '1' : '0', region: ST.need ? rg : '', from: FROM,
                 agree: '1', agreeLink: (ST.need && $('lfgA2').checked) ? '1' : '0', agreeNews: $('lfgA3').checked ? '1' : '0' };
    var ok = function(){ done(em); }, bad = function(m){ b.disabled = false; b.textContent = '안내 받아보기'; err(m || '지금은 보낼 수 없어요. 잠시 뒤 다시 눌러 주세요.'); };
    try {
      fetch(GAS, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
        .then(function(r){ return r.json(); })
        .then(function(d){ if (d && d.status === 'ok') { ok(); } else { bad(d && d.msg); } })
        .catch(function(){ bad(); });
    } catch (e) { bad(); }
  }
  function done(em){
    box('<div class="big">🌱</div><h3>고맙습니다</h3>'
      + '<div class="s">가이드북을 <b>' + esc(em) + '</b>로 보내 드릴게요.' + (ST.need ? '<br>그 지역 사랑흐름 안내자가 전화를 드려요.' : '') + '</div>'
      + '<a class="lk" href="/guide/" target="_blank" rel="noopener">지금 바로 안내 보기 →</a>'
      + '<button class="x" onclick="LFG.close()">닫기</button>');
  }
  function open(from){ css(); if (from) { FROM = String(from); } ST.need = false; form(); }
  function bubble(from){
    css(); if (from) { FROM = String(from); }
    if ($('lfgBub')) { return; }
    var go = function(){
      var bt = document.createElement('button'); bt.id = 'lfgBub'; bt.type = 'button'; bt.textContent = '📖 자서전 안내 받아보기';
      bt.onclick = function(){ open(FROM); }; document.body.appendChild(bt);
    };
    if (document.body) { go(); } else { document.addEventListener('DOMContentLoaded', go); }
  }
  window.LFG = { open: open, bubble: bubble, close: close, _need: need, _send: send };
})();
