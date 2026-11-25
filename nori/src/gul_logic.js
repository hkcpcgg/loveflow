/* ───────── 굴렁쇠 (261125 시안 · 학교 놀이 뒤로 뺀 것 첫째) ─────────
   골목길에서 쇠 테를 채로 밀며 굴리기. 「밀기!」를 누를 때마다 굴렁쇠가 빨라지고, 가만두면 점점 느려짐.
   위 속도 띠의 초록 칸 안에 속도를 붙잡아 두어야 함 — 너무 느리면 「쓰러졌다!」 · 너무 세게 밀면 「달아났다!」 → 차례 끝.
   골목 안쪽으로 갈수록 초록 칸이 좁아지고 빨리 느려짐. 60m 골목 끝까지 · 더 멀리(둘 다 끝이면 더 빨리) 간 쪽이 이김.
   나 먼저 · 다음 사장님(친구). 사장님: BOSS.gul 10m 마다 실수 없이 지나는 비율(판마다 컨디션). */
var GR={GOAL:60, VMAX:5.6, IMP:.62, SLOW:.8, FAST:.6, SEG:10}, Gr={}, grraf=0;
function grLo(d){ return 1.7+.6*Math.min(1,d/GR.GOAL); }
function grHi(d){ return 4.3-.6*Math.min(1,d/GR.GOAL); }
function grDec(d){ return .85+.5*Math.min(1,d/GR.GOAL); }
function grGeo(){ var bd=$('board'), w=bd.clientWidth, h=bd.clientHeight, gy=h-30, R=Math.max(26,Math.min(48,(gy-60)*.24)), fh=Math.min(130,(gy-56)*.72);
  return {w:w,h:h,gy:gy,R:R,fh:fh,hx:w*.58,px:w/11}; }
function grFig(c){ return '<svg viewBox="-20 -6 40 92" aria-hidden="true"><path d="M-4 52L-10 84M4 52L9 82" stroke="#F0C79A" stroke-width="5" stroke-linecap="round"/><path d="M-10 84h-6M9 82h6" stroke="#3B3229" stroke-width="5" stroke-linecap="round"/><rect x="-9" y="38" width="18" height="16" rx="4" fill="#2A3A66"/><rect x="-8" y="14" width="16" height="27" rx="6" fill="'+c+'"/><path d="M-6 19l-7 14" stroke="#F0C79A" stroke-width="4" stroke-linecap="round"/><circle cx="1" cy="4" r="8" fill="#F6C99B"/><path d="M-7 0q8-10 16 0" fill="#3B3229"/></svg>'; }
function grStart(){ Gr={gen:S.gen,who:0,ph:'wait',d:[0,0],tm:[0,0],v:0,ang:0,ts:0,tf:0,tip:0,fail:'',cpu:null,last:0,cond:BOSS.cur||1.5};
  S.u='m'; S.sc=[0,0];
  var bd=$('board'); bd.classList.add('gul');
  bd.innerHTML='<div class="grlane" id="grlane"><i class="grok" id="grok"></i><i class="grv" id="grv"></i></div><div class="grtag" id="grtag"></div><div class="grcnt" id="grcnt"></div>'
    +'<div id="grposts"></div><div class="grgr" id="grgr"></div>'
    +'<div class="grk" id="grK">'+grFig('#2F64E0')+'</div>'
    +'<svg class="grsv" id="grsv"><line id="grst" stroke="#7A5A24" stroke-width="3.5" stroke-linecap="round"/><g id="grho"><circle id="grc" fill="none" stroke="#6E7680" stroke-width="5"/><circle id="grdot" r="3.5" fill="#6E7680"/></g></svg>';
  $('act').innerHTML='<button type="button" class="big grgo" id="grGo" disabled>밀기!</button>';
  $('grGo').addEventListener('pointerdown',function(e){ e.preventDefault(); grTap(); });
  grLay(); vs(0); grTurn(0); }
function grLay(){ var G=grGeo(); if(!$('grsv')) return;
  $('grgr').style.top=G.gy+'px'; var k=$('grK'); k.style.height=G.fh+'px'; k.style.width=(G.fh*40/92)+'px'; k.style.top=(G.gy-G.fh)+'px'; k.style.left=(G.hx-G.R*1.6-G.fh*40/92)+'px';
  var s=$('grsv'); s.setAttribute('width',G.w); s.setAttribute('height',G.h); grDraw(); }
function grDraw(){ var G=grGeo(), p=Gr.who, d=Gr.d[p], cy=G.gy-G.R-2.5, tilt=0;
  if(Gr.ph==='fall') tilt=Gr.fail==='slow'?70:0; else if(Gr.v<grLo(d)) tilt=Math.min(14,Gr.ts*18); else if(Gr.v>grHi(d)) tilt=-Math.min(8,Gr.tf*12);
  var hx=G.hx+(Gr.ph==='fall'&&Gr.fail==='fast'?Math.min(G.w,(performance.now()-Gr.ft)*.5):0);
  $('grho').setAttribute('transform','translate('+hx+' '+cy+') rotate('+tilt+' 0 '+G.R+')');
  $('grc').setAttribute('r',G.R); var a=Gr.ang*Math.PI/180; $('grdot').setAttribute('cx',(G.R*Math.cos(a)).toFixed(1)); $('grdot').setAttribute('cy',(G.R*Math.sin(a)).toFixed(1));
  var kx=G.hx-G.R*1.6-G.fh*40/92*.3, ky=G.gy-G.fh*.63;
  var st=$('grst'); st.setAttribute('x1',kx); st.setAttribute('y1',ky); st.setAttribute('x2',G.hx-G.R*.72); st.setAttribute('y2',cy+G.R*.35); st.style.opacity=Gr.ph==='fall'&&Gr.fail==='fast'?.25:1;
  /* 거리 말뚝: 10m 마다 · 내 자리(d)를 기준으로 흘러감 */
  var h=''; for(var m=0;m<=GR.GOAL;m+=GR.SEG){ var x=G.hx+(m-d)*G.px; if(x<-30||x>G.w+30) continue;
    h+='<i class="grp'+(m===GR.GOAL?' end':'')+'" style="left:'+x.toFixed(1)+'px;top:'+(G.gy-38)+'px"></i><b class="grpn" style="left:'+x.toFixed(1)+'px;top:'+(G.gy+4)+'px">'+(m===GR.GOAL?'골목 끝':m+'m')+'</b>'; }
  $('grposts').innerHTML=h;
  var lo=grLo(d)/GR.VMAX*100, hi=grHi(d)/GR.VMAX*100; $('grok').style.left=lo+'%'; $('grok').style.width=(hi-lo)+'%';
  var vv=$('grv'); vv.style.left=Math.min(100,Gr.v/GR.VMAX*100)+'%'; vv.classList.toggle('out',Gr.ph==='go'&&(Gr.v<grLo(d)||Gr.v>grHi(d)));
  $('grtag').textContent=d.toFixed(1)+'m'; }
function grWho(){ return Gr.who===0?'나':(two()?'친구':nm(1)); }
function grTurn(p){ var g=S.gen; Gr.who=p; Gr.ph='wait'; Gr.v=0; Gr.ts=0; Gr.tf=0; Gr.fail=''; $('grGo').disabled=true; $('grGo').classList.toggle('b',p===1);
  $('grK').innerHTML=grFig(p===0?'#2F64E0':'#8C7B5C'); vs(p); col(p===0?'l':'r',{pw:Gr.d[p]/GR.GOAL}); grDraw();
  if(p===1&&two()){ $('say').innerHTML='<b>친구 차례</b> · 폰을 친구에게 넘겨 주세요';
    $('act').innerHTML='<div class="sbrow"><button type="button" class="big" id="grRdy">친구 · 준비됐어요</button></div>';
    $('grRdy').addEventListener('click',function(){ $('act').innerHTML='<button type="button" class="big grgo b" id="grGo" disabled>밀기!<small>친구</small></button>'; $('grGo').addEventListener('pointerdown',function(e){ e.preventDefault(); grTap(); }); grGoNow(); }); return; }
  $('say').innerHTML= p===0 ? '<b>내 차례</b> · 바늘이 초록 칸 안에 있게 「밀기!」' : '<em>'+esc(nm(1))+' 차례</em> · 지켜보세요';
  setTimeout(function(){ if(g===S.gen) grGoNow(); },p===0?700:1200); }
function grGoNow(){ var g=S.gen, p=Gr.who, cs=['하나','둘','굴려!'];
  cs.forEach(function(c,i){ setTimeout(function(){ if(g!==S.gen) return; var e=$('grcnt'); e.textContent=c; e.classList.remove('on'); void e.offsetWidth; e.classList.add('on'); snd('stone',.25); },i*520); });
  setTimeout(function(){ if(g!==S.gen) return; Gr.ph='go'; Gr.v=2.6; Gr.last=performance.now(); Gr.t0=Gr.last; snd('clack',.35);
    if(p===0||two()){ $('grGo').disabled=false; $('say').innerHTML='<b>'+esc(grWho())+'</b> · 바늘이 초록 칸 안에 있게 「밀기!」'; if(p===0&&Gr.tip<1){ Gr.tip++; NA.point($('grGo'),'느려지면 톡',.5,.4); } }
    else { $('say').innerHTML='<em>'+esc(nm(1))+'</em> 굴리는 중'; grCpuPlan(); }
    cancelAnimationFrame(grraf); grraf=requestAnimationFrame(grLoop); },cs.length*520); }
function grLoop(){ if(Gr.gen!==S.gen||Gr.ph!=='go') return;
  var t=performance.now(), dt=Math.min(.05,(t-Gr.last)/1000), p=Gr.who, d=Gr.d[p], G=grGeo(); Gr.last=t;
  Gr.v=Math.max(0,Gr.v-grDec(d)*dt); Gr.d[p]=Math.min(GR.GOAL,d+Gr.v*dt); Gr.ang=(Gr.ang+Gr.v*dt*G.px/G.R*180/Math.PI)%360;
  if(p===1&&!two()) grCpuStep();
  if(Gr.v<grLo(Gr.d[p])){ Gr.ts+=dt; } else Gr.ts=0;
  if(Gr.v>grHi(Gr.d[p])){ Gr.tf+=dt; } else Gr.tf=0;
  S.sc=[Math.floor(Gr.d[0]),Math.floor(Gr.d[1])]; col(p===0?'l':'r',{pw:Gr.d[p]/GR.GOAL}); if(t-(Gr.vt||0)>200){ Gr.vt=t; vs(p); }
  grDraw();
  if(Gr.d[p]>=GR.GOAL){ grGoal(); return; }
  if(Gr.ts>GR.SLOW){ grFall('slow'); return; }
  if(Gr.tf>GR.FAST){ grFall('fast'); return; }
  grraf=requestAnimationFrame(grLoop); }
function grTap(){ if(S.over||Gr.ph!=='go') return; if(Gr.who===1&&!two()) return; NA.unpoint(); grPush(); }
function grPush(){ Gr.v=Math.min(GR.VMAX,Gr.v+GR.IMP); snd('clack',Gr.who===0||two()?.4:.22);
  var k=$('grK'); k.classList.remove('push'); void k.offsetWidth; k.classList.add('push'); }
/* 사장님: 10m 마다 BOSS.gul[칸] 비율로 실수 없이 지남 · 실수할 칸에서는 그 칸 어딘가부터 밀기를 멈추거나(쓰러짐) 거푸 밈(달아남) */
function grCpuPlan(){ var B=BOSS.gul||[.99,.97,.95,.92,.88,.84], adj=1+(Gr.cond-1.5)*.04, at=-1;
  for(var i=0;i<B.length;i++){ if(Math.random()>=Math.min(.999,B[i]*adj)){ at=i*GR.SEG+Math.random()*GR.SEG; break; } }
  Gr.cpu={at:at,mode:Math.random()<.55?'slow':'fast',next:0,tw:0}; }
function grCpuStep(){ var c=Gr.cpu, t=performance.now(), d=Gr.d[1]; if(!c) return;
  var lo=grLo(d), hi=grHi(d), mid=(lo+hi)/2;
  if(c.at>=0&&d>=c.at){ if(c.mode==='fast'&&t>c.next){ c.next=t+170; grPush(); } return; }
  if(t<c.next) return;
  if(Gr.v<mid-.18-Math.random()*.25){ if(!c.tw){ c.tw=t+90+Math.random()*120; } if(t>=c.tw){ c.tw=0; c.next=t+260; if(Gr.v+GR.IMP<hi-.05) grPush(); } } }
function grFall(why){ var g=S.gen, p=Gr.who; Gr.ph='fall'; S.sc=[Math.floor(Gr.d[0]),Math.floor(Gr.d[1])]; vs(p); Gr.fail=why; Gr.ft=performance.now(); cancelAnimationFrame(grraf); $('grGo').disabled=true; NA.unpoint();
  Gr.tm[p]=(performance.now()-Gr.t0)/1000; snd(why==='slow'?'fall':'flick',.5); fx(why==='slow'?'쓰러졌다!':'달아났다!',44);
  var t0=performance.now(); (function an(){ if(g!==S.gen) return; grDraw(); if(performance.now()-t0<700) requestAnimationFrame(an); })();
  var m=Gr.d[p].toFixed(1)+'m';
  if(p===0||two()) $('say').innerHTML='<em>'+(two()?grWho()+' ':'')+(why==='slow'?'쓰러졌어요':'달아났어요')+'</em> · '+(why==='slow'?'너무 느렸어요':'너무 세게 밀었어요')+' · '+m;
  else $('say').innerHTML='<b>'+esc(nm(1))+' '+(why==='slow'?'쓰러졌다!':'달아났다!')+'</b> · '+m;
  setTimeout(function(){ if(g===S.gen) grEndTurn(); },1500); }
function grGoal(){ var g=S.gen, p=Gr.who; Gr.ph='end'; cancelAnimationFrame(grraf); $('grGo').disabled=true; NA.unpoint(); Gr.d[p]=GR.GOAL;
  Gr.tm[p]=(performance.now()-Gr.t0)/1000; S.sc=[Math.floor(Gr.d[0]),Math.floor(Gr.d[1])]; vs(p); fx('골목 끝!',44); snd('win');
  $('say').innerHTML='<b>'+esc(p===0?'나':(two()?'친구':nm(1)))+'</b> 골목 끝까지 · '+Gr.tm[p].toFixed(1)+'초';
  setTimeout(function(){ if(g===S.gen) grEndTurn(); },1400); }
function grEndTurn(){ var p=Gr.who; if(p===0){ grTurn(1); return; }
  var a=Gr.d[0], b=Gr.d[1], ta=Gr.tm[0], tb=Gr.tm[1], who1=two()?'친구':nm(1);
  var full=a>=GR.GOAL&&b>=GR.GOAL, same=full?Math.abs(ta-tb)<.05:Math.abs(a-b)<.05;
  if(same){ fx('비겼다!',44); $('say').innerHTML='<b>똑같이</b> 굴렸어요 · 한 번 더!'; var g=S.gen; Gr.d=[0,0]; Gr.tm=[0,0]; setTimeout(function(){ if(g===S.gen) grTurn(0); },1600); return; }
  var meWin=full?ta<tb:a>b, L=function(q){ return Gr.d[q]>=GR.GOAL?'골목 끝 '+Gr.tm[q].toFixed(1)+'초':Gr.d[q].toFixed(1)+'m'; };
  $('say').innerHTML=(meWin?'<b>내가 더 '+(full?'빨리!':'멀리!')+'</b>':'<em>'+esc(who1)+' 더 '+(full?'빨리':'멀리')+'</em>')+' · 나 '+L(0)+' · '+esc(who1)+' '+L(1);
  finish(meWin,Math.floor(a),Math.floor(b),'나 '+L(0)+' · '+who1+' '+L(1)); }
window.addEventListener('resize',function(){ if($('grsv')&&!S.over) grLay(); });
