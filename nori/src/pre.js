/* 그때 그 놀이 · 디자인 A 공통 (261122 v1) — 첫 화면과 놀이가 같이 씀
   NA.sndBtn(자리)  오른쪽 위 「🔈 소리」 → 소리 설정 창(효과음 · 말로 내기 · 모두 끄기 — 구령 소리는 261123 뺌)
   NA.pre({...})    시작 전 창 「무엇을 걸까요?」(벌칙 · 누구랑)
   NA.point(el,글) 반투명 손가락(선 없음) · NA.mic(말 알아듣기) · NA.toast · (구령 소리 NA.speak · NA.beat 는 261123 대표 결정으로 꺼 둠)
   ★첫째 원칙: 테두리 · 음영 없음 · 빨간 방사형 · 빨간 원 금지 */
window.NA=(function(){
  var d=document, $=function(id){ return d.getElementById(id); };
  var OPT={sfx:true,voice:false,mic:false};
  try{ var o=JSON.parse(localStorage.getItem('nori-opt')||'null'); if(o){ OPT.sfx=o.sfx!==false; OPT.voice=!!o.voice; OPT.mic=!!o.mic; } else if(window.SND&&SND.isOn){ OPT.sfx=SND.isOn(); } }catch(e){}
  OPT.voice=false; OPT.mic=false; /* 구령 소리 · 말로 내기 뺌 (대표 261123) — 효과음만. 🔈 단추가 바로 켜기 · 끄기 */
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  function keep(){ try{ localStorage.setItem('nori-opt',JSON.stringify(OPT)); }catch(e){} try{ if(window.SND&&SND.set&&SND.isOn()!==OPT.sfx){ SND.set(OPT.sfx); } }catch(e){} }
  keep();
  var BETS={ttak:{i:'👉',n:'딱밤 3대',s:'이마에 딱!'},kkul:{i:'✊',n:'꿀밤 3대',s:'머리에 콩!'},indian:{i:'🙌',n:'인디언밥',s:'등짝 따다닥 밥!'},none:{i:'🎁',n:'선물만',s:'벌칙 없이'}};
  var css=d.createElement('style');
  css.textContent=''
   +'.na-snd{height:34px;border:0;border-radius:999px;background:rgba(255,255,255,.5);color:#1C1D21;display:flex;align-items:center;gap:3px;padding:0 10px 0 8px;cursor:pointer;font:inherit}'
   +'.na-snd svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.na-snd small{font:700 11.5px "Noto Sans KR",sans-serif;opacity:.6}.na-snd.off svg .w{display:none}.na-snd.off svg .x{display:inline}.na-snd svg .x{display:none}'
   +'.na-dim{position:fixed;inset:0;z-index:70;background:rgba(28,29,33,.3);display:none}.na-dim.on{display:block}'
   +'.na-sh{position:fixed;left:0;right:0;bottom:0;margin:0 auto;max-width:480px;max-height:92vh;overflow:auto;z-index:71;background:#fff;border-radius:24px 24px 0 0;padding:16px 14px calc(14px + env(safe-area-inset-bottom,0px));transform:translateY(105%);visibility:hidden;transition:transform .22s ease,visibility 0s .22s;font-family:"Noto Sans KR",system-ui,sans-serif;color:#1C1D21;box-sizing:border-box}'
   +'.na-sh.on{transform:none;visibility:visible;transition:transform .22s ease}.na-sh *{box-sizing:border-box}'
   +'.na-sh h3{margin:0 0 2px;text-align:center;font-size:17px;font-weight:900}.na-sh .sub{text-align:center;font-size:12px;color:#7A6E55;margin:0 0 12px}'
   +'.na-sh button{font-family:inherit;-webkit-tap-highlight-color:transparent}'
   +'.na-bets{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
   +'.na-bets button{border:0;border-radius:14px;background:#F6F1E6;padding:10px 8px;text-align:center;font-weight:800;font-size:13.5px;color:#1C1D21;cursor:pointer}'
   +'.na-bets button i{display:block;font-style:normal;font-size:26px;line-height:1.2}.na-bets button small{display:block;font-size:11px;color:#7A6E55;font-weight:700}'
   +'.na-bets button.on{background:#2F64E0;color:#fff}.na-bets button.on small{color:#fff;opacity:.85}'
   +'.na-bets .real{grid-column:1/-1;background:#FFE9A6;display:flex;align-items:center;justify-content:center;gap:8px;animation:naWob 2.4s ease-in-out infinite}.na-bets .real i{display:inline;font-size:22px;animation:naBoom 1.2s ease-in-out infinite}.na-bets .real small{display:inline}'
   +'.na-bets .real.nope{animation:naNope .5s ease}'
   +'@keyframes naWob{0%,80%,100%{transform:rotate(0)}85%{transform:rotate(-4deg)}90%{transform:rotate(4deg)}95%{transform:rotate(-2deg)}}@keyframes naBoom{50%{transform:scale(1.3)}}'
   +'@keyframes naNope{0%,100%{transform:translateX(0)}20%{transform:translateX(-12px) rotate(-3deg)}40%{transform:translateX(10px) rotate(3deg)}60%{transform:translateX(-7px)}80%{transform:translateX(4px)}}'
   +'.na-who{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}'
   +'.na-who button{border:0;border-radius:12px;background:#F6F1E6;padding:11px 6px;font-weight:800;font-size:13px;color:#1C1D21;cursor:pointer;line-height:1.3}.na-who button small{display:block;font-size:10.5px;font-weight:700;color:#7A6E55}.na-who button.on{background:#2F64E0;color:#fff}.na-who button.on small{color:#fff;opacity:.85}'
   +'.na-go{display:flex;align-items:center;justify-content:center;border:0;width:100%;border-radius:14px;min-height:50px;background:#FFC21A;color:#1C1D21;font-weight:900;font-size:17px;cursor:pointer}'
   +'.na-go.soft{background:#F6F1E6;font-size:14.5px;font-weight:800;margin-top:10px}'
   +'.na-opts{display:flex;flex-direction:column;gap:6px}'
   +'.na-set{display:flex;align-items:center;gap:10px;padding:9px 10px;border:0;border-radius:14px;background:#F6F1E6;text-align:left;color:#1C1D21;cursor:pointer;width:100%}'
   +'.na-set .em{width:34px;height:34px;border-radius:11px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none}'
   +'.na-set .tx b{display:block;font-size:14px}.na-set .tx small{display:block;font-size:11.5px;color:#7A6E55;line-height:1.4}'
   +'.na-set .sw{margin-left:auto;width:44px;height:26px;border-radius:13px;background:#D9D4CA;position:relative;flex:none;transition:background .2s}.na-set .sw::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .2s}'
   +'.na-set.on .sw{background:#2F64E0}.na-set.on .sw::after{left:21px}'
   +'.na-ptr{position:fixed;z-index:65;pointer-events:none;display:none;flex-direction:column;align-items:center;gap:2px}.na-ptr.on{display:flex}.na-ptr.up{flex-direction:column-reverse}'
   +'.na-ptr .f{position:relative;width:40px;height:52px;animation:naTap .9s ease-in-out infinite}.na-ptr .f svg{display:block}.na-ptr.up .f{animation:naTapDn .9s ease-in-out infinite}'
   +'.na-ptr .f svg path{fill:rgba(60,56,48,.30);stroke:none}'
   +'.na-ptr .rip{position:absolute;left:8px;top:-4px;width:20px;height:20px;border-radius:50%;background:rgba(60,56,48,.18);animation:naRip .9s ease-out infinite}'
   +'.na-ptr b{background:#FFF1C7;color:#6A4D00;border-radius:999px;padding:4px 10px;font:800 12.5px "Noto Sans KR",sans-serif;white-space:nowrap}'
   +'@keyframes naTap{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes naTapDn{0%,100%{transform:rotate(180deg) translateY(0)}50%{transform:rotate(180deg) translateY(-10px)}}@keyframes naRip{0%{transform:scale(.3);opacity:1}100%{transform:scale(1.6);opacity:0}}'
   +'.na-toast{position:fixed;left:50%;top:44%;transform:translate(-50%,-50%);background:rgba(28,29,33,.88);color:#fff;border-radius:14px;padding:12px 16px;font:800 14.5px/1.5 "Noto Sans KR",sans-serif;text-align:center;z-index:80;opacity:0;pointer-events:none;transition:opacity .2s;width:min(84vw,360px)}.na-toast.on{opacity:1}';
  d.head.appendChild(css);
  function el(h){ var t=d.createElement('div'); t.innerHTML=h; return t.firstChild; }
  var tt=null, tto=0;
  function toast(t){ if(!tt){ tt=el('<div class="na-toast" role="status" aria-live="polite"></div>'); d.body.appendChild(tt); } tt.innerHTML=t; tt.classList.add('on'); clearTimeout(tto); tto=setTimeout(function(){ tt.classList.remove('on'); },2300); }
  /* ── 창 둘(소리 · 시작 전) ── */
  var dim=null, cur=null, onClose=null;
  function sheet(h){ if(!dim){ dim=el('<div class="na-dim"></div>'); d.body.appendChild(dim); dim.addEventListener('click',function(){ close(true); }); } var s=el('<div class="na-sh" role="dialog">'+h+'</div>'); d.body.appendChild(s); return s; }
  function open(s,oc){ if(cur&&cur!==s){ cur.classList.remove('on'); } cur=s; onClose=oc||null; dim.classList.add('on'); s.classList.add('on'); }
  function close(byDim){ if(cur){ cur.classList.remove('on'); } cur=null; if(dim) dim.classList.remove('on'); var f=onClose; onClose=null; if(byDim&&f){ f(); } }
  /* 소리 설정 */
  var ss=null, btns=[];
  function muted(){ return !OPT.sfx; }
  function paint(){ if(ss){ [].forEach.call(ss.querySelectorAll('[data-o]'),function(b){ var k=b.getAttribute('data-o'); b.classList.toggle('on', k==='mute'?muted():!!OPT[k]); b.setAttribute('aria-pressed',b.classList.contains('on')?'true':'false'); }); }
    btns.forEach(function(b){ b.classList.toggle('off',muted()); }); }
  function soundSheet(){ if(!ss){ ss=sheet('<h3>소리</h3><p class="sub">식사 중이면 「모두 끄기」를 켜 주세요</p><div class="na-opts">'
      +'<button type="button" class="na-set" data-o="sfx"><span class="em">🔔</span><span class="tx"><b>효과음</b><small>딱! 짝! 콩! 소리</small></span><span class="sw"></span></button>'
      +'<button type="button" class="na-set" data-o="mic"><span class="em">🎤</span><span class="tx"><b>말로 내기</b><small>「보!」 하고 외쳐서 내요 (마이크)</small></span><span class="sw"></span></button>'
      +'<button type="button" class="na-set" data-o="mute"><span class="em">🤫</span><span class="tx"><b>모두 끄기</b><small>소리도 마이크도 모두 꺼요</small></span><span class="sw"></span></button>'
      +'</div><button type="button" class="na-go soft" data-x="1">닫기</button>');
      ss.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; if(b.getAttribute('data-x')){ close(); return; }
        var k=b.getAttribute('data-o'); if(!k) return;
        if(k==='mute'){ if(muted()){ OPT.sfx=true; } else { OPT.sfx=false; OPT.voice=false; OPT.mic=false; try{ speechSynthesis.cancel(); }catch(x){} } }
        else { OPT[k]=!OPT[k]; }
        if(k==='mic'&&OPT.mic&&!SR){ OPT.mic=false; toast('이 브라우저는 「말로 내기」를 못 해요<br>크롬이나 사파리에서 열어 주세요'); }
        keep(); paint();
        if(k==='sfx'&&OPT.sfx&&window.SND){ SND.stone(.7); } if(k==='voice'&&OPT.voice){ beat(); speak('보'); }
        try{ window.dispatchEvent(new Event('na-opt')); }catch(x){} }); }
    paint(); open(ss); }
  function sndBtn(parent){ var b=el('<button type="button" class="na-snd" aria-label="소리 설정"><svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="w" d="M17 9a4 4 0 0 1 0 6"/><path class="x" d="M17 10l4 4M21 10l-4 4"/></svg><small>소리</small></button>');
    b.addEventListener('click',function(e){ e.stopPropagation(); OPT.sfx=!OPT.sfx; keep(); paint(); b.querySelector('small').textContent=OPT.sfx?'소리':'꺼짐'; if(OPT.sfx&&window.SND){ try{ SND.stone(.7); }catch(x){} } toast(OPT.sfx?'🔈 소리를 켰어요':'🔇 소리를 껐어요'); });
    parent.appendChild(b); btns.push(b); paint(); b.querySelector('small').textContent=OPT.sfx?'소리':'꺼짐';
    d.addEventListener('pointerdown',function(){ if(OPT.sfx&&window.SND){ try{ SND.set(true); }catch(x){} } },{once:true}); return b; }
  /* 시작 전: 무엇을 걸까요? */
  var ps=null, P=null, BET='ttak', WHO='cpu';
  try{ BET=localStorage.getItem('nori-bet')||'ttak'; if(!BETS[BET]) BET='ttak'; }catch(e){}
  function pre(o){ P=o||{}; if(!ps){ ps=sheet('<h3>무엇을 걸까요?</h3><p class="sub" id="naPreSub">진 쪽이 맞아요 · 이기면 선물도!</p><div class="na-bets" id="naBets">'
      +['ttak','kkul','indian','none'].map(function(k){ var B=BETS[k]; return '<button type="button" data-b="'+k+'"><i>'+B.i+'</i>'+B.n+'<small>'+B.s+'</small></button>'; }).join('')
      +'<button type="button" data-b="real" class="real"><i>💥</i>진짜 때리기<small>매장에서 직접!</small></button></div>'
      +'<div class="na-who" id="naWho"><button type="button" data-w="cpu"><span class="pn"></span>과<small>이 가게 사장님과 한 판</small></button><button type="button" data-w="two">친구와 폰 하나로<small>번갈아 합니다</small></button></div>'
      +'<button type="button" class="na-go" id="naGo">시작!</button>');
      ps.querySelector('#naBets').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return;
        if(b.getAttribute('data-b')==='real'){ b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); try{ SND.thud(.7); }catch(x){} var sm=b.querySelector('small'); if(!sm._o) sm._o=sm.textContent; sm.textContent='화면에선 안 돼요 😆 사장님께 직접!'; clearTimeout(sm._t); sm._t=setTimeout(function(){ sm.textContent=sm._o; },2000); return; }
        BET=b.getAttribute('data-b'); try{ localStorage.setItem('nori-bet',BET); }catch(x){} paintPre(); try{ SND.clack(.35); }catch(x){} });
      ps.querySelector('#naWho').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; WHO=b.getAttribute('data-w'); paintPre(); });
      ps.querySelector('#naGo').addEventListener('click',function(){ close(); var f=P.onGo; if(f) f(BET,WHO); }); }
    if(P.who===false){ WHO='cpu'; } else if(P.whoDefault){ WHO=P.whoDefault; }
    ps.querySelector('#naWho').style.display=P.who===false?'none':'';
    [].forEach.call(ps.querySelectorAll('.pn'),function(e){ e.textContent=P.opp||'다복 사장님'; });
    paintPre(); open(ps,P.onCancel); }
  function paintPre(){ [].forEach.call(ps.querySelectorAll('[data-b]'),function(b){ b.classList.toggle('on',b.getAttribute('data-b')===BET); });
    [].forEach.call(ps.querySelectorAll('[data-w]'),function(b){ b.classList.toggle('on',b.getAttribute('data-w')===WHO); });
    ps.querySelector('#naPreSub').textContent= WHO==='two' ? '진 친구가 맞아요 · 이기면 선물도!' : '진 쪽이 맞아요 · 이기면 선물도!'; }
  /* 반투명 손가락 */
  var pt=null;
  function point(e2,text,fx,fy){ if(!pt){ pt=el('<div class="na-ptr" aria-hidden="true"><span class="f"><svg viewBox="0 0 40 52" width="40" height="52"><path d="M14 8A3.5 3.5 0 0 1 21 8V21A3.5 3.5 0 0 1 28 21V24A3.5 3.5 0 0 1 35 24V33C35 42 29 49 21 49H19C14 49 11 47 8 43L3 35A3.3 3.3 0 0 1 8 31L14 35Z"/></svg><i class="rip"></i></span><b></b></div>'); d.body.appendChild(pt); }
    if(!e2){ pt.classList.remove('on'); return; } var r=e2.getBoundingClientRect(), H=innerHeight, Wd=innerWidth; if(!r.width){ pt.classList.remove('on'); return; }
    pt.querySelector('b').textContent=text||'여길 누르세요'; var low=r.top>H*.55; pt.classList.toggle('up',low); pt.classList.add('on');
    var w=pt.offsetWidth, hh=pt.offsetHeight; pt.style.left=Math.max(4,Math.min(Wd-w-4,r.left+r.width*(fx==null?.5:fx)-w/2))+'px';
    pt.style.top=(low?(r.top-hh+14):(r.top+r.height*(fy==null?.6:fy)))+'px'; }
  function unpoint(){ if(pt) pt.classList.remove('on'); }
  /* 구령: 기계음 · 가장 낮게 · 낮은 「솔」 박자 (나중에 사장님 녹음으로 바꿀 자리: NA.voiceFile) */
  var AC=null; function ac(){ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); }catch(e){} return AC; }
  function tone(f,dur,vol){ var c=ac(); if(!c) return; var t=c.currentTime, g=c.createGain(), o=c.createOscillator(); g.gain.setValueAtTime(vol||.5,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); o.type='triangle'; o.frequency.setValueAtTime(f,t); o.frequency.exponentialRampToValueAtTime(f*.6,t+dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur); }
  function beat(){ return; if(!OPT.voice) return; tone(196,.2,.55); tone(98,.22,.5); }
  function speak(t){ if(!OPT.voice||!window.speechSynthesis) return; try{ var u=new SpeechSynthesisUtterance(String(t).replace(/[!·]/g,'')); u.lang='ko-KR'; u.pitch=.2; u.rate=1.15; var v=speechSynthesis.getVoices().filter(function(x){ return /ko/i.test(x.lang); }); if(v.length) u.voice=v[0]; speechSynthesis.speak(u); }catch(e){} }
  function vib(p){ if(!OPT.sfx) return; try{ navigator.vibrate&&navigator.vibrate(p); }catch(e){} }
  /* 말 알아듣기: re 의 몇째 묶음이 맞았는지 → map */
  function mic(re,map,cb,interim){ if(!SR){ cb(null); return; } var rec, fin=false, to=0; function end(k){ if(fin) return; fin=true; clearTimeout(to); try{ rec.abort(); }catch(e){} cb(k); }
    try{ rec=new SR(); rec.lang='ko-KR'; rec.interimResults=true; rec.maxAlternatives=5; rec.continuous=false; }catch(e){ cb(null); return; }
    rec.onresult=function(ev){ var txt=''; for(var i=0;i<ev.results.length;i++){ for(var j=0;j<ev.results[i].length;j++){ txt+=' '+ev.results[i][j].transcript; } } if(interim) interim(ev.results[ev.results.length-1][0].transcript);
      re.lastIndex=0; var m, last=null; while((m=re.exec(txt))){ for(var g=1;g<m.length;g++){ if(m[g]){ last=g-1; break; } } } if(last!=null) end(map[last]); };
    rec.onerror=function(ev){ if(ev.error==='not-allowed'||ev.error==='service-not-allowed'){ toast('🎤 마이크가 막혀 있어요<br>주소창의 마이크 허락을 켜 주세요'); } end(null); };
    rec.onend=function(){ setTimeout(function(){ end(null); },300); };
    to=setTimeout(function(){ end(null); },4000); try{ rec.start(); }catch(e){ end(null); } }
  window.addEventListener('keydown',function(e){ if(e.key==='Escape'&&cur){ close(true); } });
  return {OPT:OPT, SR:SR, BETS:BETS, bet:function(){ return BET; }, who:function(){ return WHO; }, betName:function(k){ var B=BETS[k||BET]; return B?B.i+' '+B.n:''; },
    sndBtn:sndBtn, soundSheet:soundSheet, pre:pre, close:close, point:point, unpoint:unpoint, toast:toast, speak:speak, beat:beat, vib:vib, mic:mic, ac:ac,
    micOn:function(){ return !!(OPT.mic&&SR); }};
})();
