/* ───────── 공 굴리기 · 운동회 큰 공 (261125 시안 · 학교 놀이 뒤로 뺀 것 둘째) ─────────
   청군 · 백군이 제 줄에서 큰 공을 밀어 30m 결승까지. 「탕!」 뒤 ◀ · ▶ 를 누를 때마다 공을 한 번 밀어 1m 앞으로.
   울퉁불퉁한 운동장이라 공이 저절로 옆으로 쏠림 — ◀ 는 왼쪽으로 · ▶ 는 오른쪽으로 밀며 앞으로. 쏠린 반대쪽을 눌러 줄 안에 붙잡아 둠.
   공이 가운데서 벗어날수록 한 번에 덜 나감(줄에 닿으면 0.55m). 공이 줄 밖으로 나가면 「줄 밖!」 0.9초 멈춤 · 가운데로 다시. 「탕!」 전에 누름 = 부정 출발(처음부터 다시 · 벌 없음).
   먼저 결승에 닿는 쪽이 이김. 사장님: BOSS.ball.r 1초에 미는 횟수 · BOSS.ball.ok 맞는 쪽을 누르는 비율(판마다 그 안에서 하나).
   친구와: 폰 하나에 단추 넷(왼쪽 둘 = 나 · 오른쪽 둘 = 친구) · 둘이 함께 누름. */
var BL={NEED:30, SHIFT:.12, KICK:.6, DAMP:.35, STUN:900}, Bl={}, blraf=0;
function blGeo(){ var bd=$('board'), w=bd.clientWidth, h=bd.clientHeight, L=Math.max(36,w*.1), R=w-Math.max(36,w*.1), lw=(R-L)/2, r=Math.max(18,Math.min(30,lw*.26)), fin=58;
  return {w:w,h:h,L:L,R:R,lw:lw,r:r,fin:fin,y0:h-8-r*2.55,y1:fin+r*.95}; }
function blBall(c,seam,id){ return '<svg viewBox="-50 -50 100 100" aria-hidden="true"><defs><clipPath id="'+id+'c"><circle r="47"/></clipPath></defs><circle r="47" fill="'+c+'"/><g clip-path="url(#'+id+'c)"><g id="'+id+'s" fill="'+seam+'"><rect x="-50" y="-62" width="100" height="10"/><rect x="-50" y="-6" width="100" height="10"/><rect x="-50" y="50" width="100" height="10"/></g></g></svg>'; }
function blKid(band){ return '<svg viewBox="-20 -4 40 46" aria-hidden="true"><path d="M-9 10L-13 -1M9 10L13 -1" stroke="#F0C79A" stroke-width="5" stroke-linecap="round"/><rect x="-10" y="8" width="20" height="18" rx="6" fill="#FBF8F1"/><circle cx="0" cy="13" r="7.5" fill="#3B3229"/><path d="M-7.5 11h15" stroke="'+band+'" stroke-width="3.5"/><rect x="-9" y="25" width="18" height="8" rx="3" fill="#2A3A66"/><path d="M-5 33v8M5 33v8" stroke="#F0C79A" stroke-width="5" stroke-linecap="round"/></svg>'; }
function blStart(){ Bl={gen:S.gen,pos:[0,0],shown:[0,0],x:[0,0],vx:[0,0],gv:[0,0],gt:[0,0],roll:[0,0],stun:[0,0],ph:'set',t0:0,fs:0,tip:0,last:0,end:false,
    cpuRate:BOSS.ball?BOSS.ball.r[0]+Math.random()*(BOSS.ball.r[1]-BOSS.ball.r[0]):4.8, cpuOk:BOSS.ball?BOSS.ball.ok[0]+Math.random()*(BOSS.ball.ok[1]-BOSS.ball.ok[0]):.9, cpuNext:0};
  var adj=1+((BOSS.cur||1.5)-1.5)*.06; Bl.cpuRate*=adj; S.u='m'; S.sc=[0,0];
  var bd=$('board'); bd.classList.add('ball');
  bd.innerHTML='<div class="blclk" id="blclk">0.00초</div><div id="bltr"></div>'
    +'<div class="blk" id="blKA">'+blKid('#2F64E0')+'</div><div class="blk" id="blKB">'+blKid('#FFFFFF')+'</div>'
    +'<div class="blb" id="blA">'+blBall('#2F64E0','rgba(255,255,255,.55)','blA')+'</div><div class="blb" id="blB">'+blBall('#FBF8F1','#D9C9A8','blB')+'</div>';
  var f=two();
  $('act').innerHTML= f ? '<div class="feet four"><button type="button" data-p="0" data-s="-1">◀<small>나</small></button><button type="button" data-p="0" data-s="1">▶<small>나</small></button><button type="button" class="b" data-p="1" data-s="-1">◀<small>친구</small></button><button type="button" class="b" data-p="1" data-s="1">▶<small>친구</small></button></div>'
    : '<div class="feet"><button type="button" data-p="0" data-s="-1">◀ 왼쪽</button><button type="button" data-p="0" data-s="1">오른쪽 ▶</button></div>';
  [].forEach.call($('act').querySelectorAll('.feet button'),function(btn){ btn.addEventListener('pointerdown',function(e){ e.preventDefault(); blTap(+btn.getAttribute('data-p'),+btn.getAttribute('data-s'),btn); }); });
  blLay(); vs(null); blSet(); }
function blLay(){ var G=blGeo(), tr=$('bltr'); if(!tr) return; var m=(G.L+G.R)/2, top=G.fin, bot=G.h-6, h='';
  h+='<i class="blv" style="left:'+(G.L-1.5)+'px;top:'+top+'px;height:'+(bot-top)+'px"></i><i class="blv" style="left:'+(m-1.5)+'px;top:'+top+'px;height:'+(bot-top)+'px"></i><i class="blv" style="left:'+(G.R-1.5)+'px;top:'+top+'px;height:'+(bot-top)+'px"></i>';
  h+='<i class="blfin" style="left:'+G.L+'px;width:'+(G.R-G.L)+'px;top:'+(top-3)+'px"></i>';
  for(var k=10;k<BL.NEED;k+=10){ var y=G.y0-(G.y0-G.y1)*k/BL.NEED; h+='<i class="blt" style="left:'+G.L+'px;width:'+(G.R-G.L)+'px;top:'+y+'px"></i><b class="blm s" style="left:'+(G.R+4)+'px;top:'+(y-7)+'px">'+k+'m</b>'; }
  h+='<i class="blt st" style="left:'+G.L+'px;width:'+(G.R-G.L)+'px;top:'+(G.y0+G.r+2)+'px"></i>';
  h+='<b class="bllab a" style="left:'+(G.L+G.lw/2)+'px;top:'+(top-27)+'px">청군 · 나</b><b class="bllab b" style="left:'+(m+G.lw/2)+'px;top:'+(top-27)+'px">백군 · '+(two()?'친구':'사장님')+'</b>';
  tr.innerHTML=h;
  ['blA','blB'].forEach(function(k){ var e=$(k); e.style.width=e.style.height=(G.r*2)+'px'; });
  ['blKA','blKB'].forEach(function(k){ var e=$(k); e.style.width=(G.r*1.3)+'px'; e.style.height=(G.r*1.3*46/40)+'px'; });
  blDraw(); }
function blDraw(){ var G=blGeo(); if(!$('blA')) return; var half=G.lw/2-G.r;
  for(var p=0;p<2;p++){ var cx=G.L+G.lw*(p+.5)+Math.max(-1.25,Math.min(1.25,Bl.x[p]))*half, cy=G.y0-(G.y0-G.y1)*Math.min(1,Bl.shown[p]/BL.NEED);
    var b=$(p===0?'blA':'blB'), k=$(p===0?'blKA':'blKB'), kw=G.r*1.3;
    b.style.transform='translate('+(cx-G.r).toFixed(1)+'px,'+(cy-G.r).toFixed(1)+'px)';
    k.style.transform='translate('+(cx-kw/2-Math.max(-1,Math.min(1,Bl.x[p]))*G.r*.25).toFixed(1)+'px,'+(cy+G.r*.86).toFixed(1)+'px)';
    var s=$(p===0?'blAs':'blBs'); if(s) s.setAttribute('transform','translate(0 '+((Bl.roll[p]%56)).toFixed(1)+')'); } }
function blSet(){ var g=S.gen, id=++Bl.fs; Bl.ph='set'; Bl.pos=[0,0]; Bl.shown=[0,0]; Bl.x=[0,0]; Bl.vx=[0,0]; Bl.gv=[0,0]; Bl.gt=[0,0]; Bl.stun=[0,0]; S.sc=[0,0]; vs(null); $('blclk').textContent='0.00초'; blDraw();
  ['blA','blB'].forEach(function(k){ $(k).classList.remove('out','won'); }); col('l',{pw:0,on:true,good:null}); col('r',{pw:0,on:true,good:null}); if(window.noriSide) noriSide(null,'');
  [].forEach.call($('act').querySelectorAll('button'),function(b){ b.disabled=false; });
  $('say').innerHTML='<b>제자리에…</b>'; snd('stone',.4);
  setTimeout(function(){ if(g!==S.gen||id!==Bl.fs) return; $('say').innerHTML='<b>준비…</b> · 「탕!」 소리가 나면 밀어요';
    setTimeout(function(){ if(g!==S.gen||id!==Bl.fs||Bl.ph!=='set') return; blGo(); },1100+Math.random()*1300); },900); }
function blGust(p,now){ Bl.gv[p]=(Math.random()<.5?-1:1)*(1.5+Math.random()*.9)*(1+.35*Math.min(1,Bl.pos[p]/BL.NEED)); Bl.gt[p]=now+1000+Math.random()*1000; }
function blGo(){ var g=S.gen; Bl.ph='go'; Bl.t0=performance.now(); Bl.last=Bl.t0; Bl.cpuNext=Bl.t0+(220+Math.random()*140); blGust(0,Bl.t0); blGust(1,Bl.t0);
  snd('slap',.95); fx('탕!',64); $('say').innerHTML='<b>밀어요!</b> · 공이 쏠린 <b>반대쪽</b>을 톡톡';
  if(Bl.tip<1&&!two()){ Bl.tip++; NA.point($('act').querySelector('.feet button'),'쏠린 반대쪽을 톡',.5,.4); }
  cancelAnimationFrame(blraf); (function lp(){ if(g!==S.gen||Bl.ph!=='go') return; var now=performance.now(), dt=Math.min(.05,(now-Bl.last)/1000); Bl.last=now;
    if(!two()) while(now>=Bl.cpuNext&&Bl.ph==='go'){ blCpu(now); Bl.cpuNext+=1000/Bl.cpuRate*(.85+Math.random()*.3); }
    for(var p=0;p<2&&Bl.ph==='go';p++){ if(now<Bl.stun[p]) continue;
      if(now>=Bl.gt[p]) blGust(p,now);
      var spd=Math.max(0,Bl.pos[p]-Bl.shown[p]);
      Bl.vx[p]+=(Bl.gv[p]-Bl.vx[p])*Math.min(1,dt*2.5); Bl.x[p]+=Bl.vx[p]*dt*(.45+Math.min(1,spd*1.2)*.75);
      if(Math.abs(Bl.x[p])>1) blOut(p,now); }
    for(var q=0;q<2;q++){ var d=(Bl.pos[q]-Bl.shown[q])*.3; Bl.shown[q]+=d; Bl.roll[q]+=d*60; }
    $('blclk').textContent=((now-Bl.t0)/1000).toFixed(2)+'초'; blDraw(); if(Bl.ph==='go') blraf=requestAnimationFrame(lp); })(); }
function blOut(p,now){ var g=S.gen; Bl.stun[p]=now+BL.STUN; Bl.x[p]=Bl.x[p]>0?1.2:-1.2; Bl.vx[p]=0; var b=$(p===0?'blA':'blB'); b.classList.add('out');
  if(p===0||two()){ snd('thud',.5); $('say').innerHTML='<em>'+(two()?(p===0?'청군 ':'백군 '):'')+'줄 밖!</em> · 공을 가운데로 다시 · 쏠린 <b>반대쪽</b>을 눌러요'; }
  setTimeout(function(){ if(g!==S.gen||Bl.ph!=='go') return; Bl.x[p]=0; Bl.vx[p]=0; Bl.gt[p]=0; b.classList.remove('out'); if(p===0||two()) $('say').innerHTML='<b>다시 밀어요!</b> · 쏠린 반대쪽을 톡톡'; },BL.STUN); }
function blTap(p,s,btn){ if(S.over||Bl.ph==='end') return; if(p===1&&!two()) return; if(btn){ btn.classList.add('hit'); setTimeout(function(){ btn.classList.remove('hit'); },70); }
  if(Bl.ph==='set'){ Bl.ph='fs'; NA.unpoint(); var g=S.gen; fx('부정 출발!',34); snd('miss',.6); $('say').innerHTML='<em>'+(p===0?(two()?'청군 ':''):'백군 ')+'부정 출발!</em> · 「탕!」을 듣고 다시';
    setTimeout(function(){ if(g===S.gen) blSet(); },1500); return; }
  if(Bl.ph!=='go') return; NA.unpoint(); var now=performance.now(); if(now<Bl.stun[p]) return; blPush(p,s,now); }
function blPush(p,s,now){ if(Bl.ph!=='go') return; Bl.pos[p]+=1-.45*Math.min(1,Math.abs(Bl.x[p])); Bl.x[p]+=s*BL.SHIFT; Bl.vx[p]=Bl.vx[p]*BL.DAMP+s*BL.KICK; if(p===0||two()) snd('thud',.22);
  var k=$(p===0?'blKA':'blKB'); k.classList.remove('push'); void k.offsetWidth; k.classList.add('push');
  col(p===0?'l':'r',{pw:Math.min(1,Bl.pos[p]/BL.NEED),on:true}); S.sc=[Math.floor(Math.min(BL.NEED,Bl.pos[0])),Math.floor(Math.min(BL.NEED,Bl.pos[1]))]; vs(null);
  if(Math.abs(Bl.x[p])>1){ blOut(p,now); return; }
  if(Bl.pos[p]>=BL.NEED) blEnd(p,now); }
/* 사장님: 1초에 cpuRate 번 · 공이 갈 자리(지금 + 쏠림)를 보고 반대쪽을 cpuOk 비율로 맞게 누름 · 줄 밖이면 쉼 */
function blCpu(now){ if(now<Bl.stun[1]) return; var xp=Bl.x[1]+Bl.vx[1]*.25, s=xp>0?-1:1; if(Math.abs(xp)<.08) s=Math.random()<.5?-1:1; if(Math.random()>Bl.cpuOk) s=-s; blPush(1,s,now); }
function blEnd(w,now){ var g=S.gen; Bl.ph='end'; cancelAnimationFrame(blraf); var t=((now-Bl.t0)/1000), m=[Math.floor(Math.min(BL.NEED,Bl.pos[0])),Math.floor(Math.min(BL.NEED,Bl.pos[1]))];
  Bl.shown=[Bl.pos[0],Bl.pos[1]]; blDraw(); $('blclk').textContent=t.toFixed(2)+'초'; [].forEach.call($('act').querySelectorAll('button'),function(b){ b.disabled=true; }); NA.unpoint();
  $(w===0?'blA':'blB').classList.add('won');
  var meWin=w===0; fx(meWin?(two()?'청군 이겼다!':'1등!'):(two()?'백군 이겼다!':'졌다…'),meWin?54:38);
  $('say').innerHTML=(w===0?'<b>청군</b>':'<em>백군</em>')+' 먼저 결승! · '+t.toFixed(2)+'초';
  S.sc=[m[0],m[1]]; vs(null); setTimeout(function(){ if(g===S.gen) finish(meWin,m[0],m[1],(w===0?'나':(two()?'친구':nm(1)))+' 먼저 결승 · '+t.toFixed(2)+'초 · '+m[0]+'m 대 '+m[1]+'m'); },1300); }
window.addEventListener('resize',function(){ if($('bltr')&&!S.over) blLay(); });
