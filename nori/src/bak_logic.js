/* ───────── 박 터뜨리기 · 오재미 · 청군 백군 (261125 시안 · 학교 놀이 순서 2번) ─────────
   「준비…」 「시작!」 → 던지기 단추를 누르고 있으면 옆 기둥 힘이 오르내림(1.1초에 한 번 오르고 내림) · 떼면 그 힘으로 던짐.
   초록 칸(.64~.84) 안이면 박에 맞음 · 모자라면 아래로 · 넘치면 위로. 박을 여섯 번 맞히면 쩍 · 먼저 터뜨리는 쪽이 이김.
   결과는 손님 손 그대로(049) — 사장님은 BOSS.bak.t 초마다 한 번 던지고 BOSS.bak.hit 비율로 맞힘(판마다 그 안에서).
   친구와: 폰 하나에 단추 둘(왼쪽 = 나 · 오른쪽 = 친구) · 둘이 함께 던짐. */
var BK={NEED:6, Z:[.64,.84], PER:1100}, Bk={}, braf=0;
function bkGeo(){ var bd=$('board'), w=bd.clientWidth, h=bd.clientHeight, gy=h*.74, by=Math.max(58,h*.24), r=Math.max(24,Math.min(38,w*.11,h*.095));
  return {w:w,h:h,gy:gy,by:by,r:r,x:[w*.3,w*.7]}; }
function bkBall(p){ var c=p===0?'#2F64E0':'#8C7B5C', r=30;
  var cr=['M-4 -28L2 -16L-3 -6','M-3 -6L6 2L2 12','M2 12L-5 20L-1 29','M-16 -20L-8 -12','M14 -18L7 -8','M-20 6L-10 4'];
  return '<div><svg width="68" height="68" viewBox="-34 -34 68 68" aria-hidden="true">'
    +'<g class="hl"><path d="M0 -'+r+'A'+r+' '+r+' 0 0 0 0 '+r+'Z" fill="#F7EFDD"/><path d="M0 -10H-'+(r-1)+'v9H0z" fill="'+c+'"/></g>'
    +'<g class="hr"><path d="M0 -'+r+'A'+r+' '+r+' 0 0 1 0 '+r+'Z" fill="#F2E8D2"/><path d="M0 -10H'+(r-1)+'v9H0z" fill="'+c+'"/></g>'
    +cr.map(function(d,i){ return '<path class="cr" data-i="'+i+'" d="'+d+'" stroke="#6B5A42" stroke-width="1.8" stroke-linecap="round" fill="none"/>'; }).join('')
    +'</svg></div>'; }
function bkStart(){ Bk={gen:S.gen,ph:'set',hits:[0,0],hold:[0,0],pw:[0,0],fly:[0,0],btn:[null,null],cpuNext:0,
    hit:BOSS.bak?BOSS.bak.hit[0]+Math.random()*(BOSS.bak.hit[1]-BOSS.bak.hit[0]):.5, tip:0};
  S.u='번'; S.sc=[0,0];
  var bd=$('board'); bd.classList.add('bak');
  bd.innerHTML='<div class="rnflag" id="rnflag"></div><div id="bktr"></div>'
    +'<div class="bkb" id="bkA">'+bkBall(0)+'</div><div class="bkb" id="bkB">'+bkBall(1)+'</div>'
    +'<div class="bkban a" id="bnA">청군 만세</div><div class="bkban b" id="bnB">백군 만세</div>';
  var f=two();
  $('act').innerHTML= f ? '<div class="throw two"><button type="button" data-p="0" disabled>꾹 눌렀다 떼기<small>나 · 청군</small></button><button type="button" class="b" data-p="1" disabled>꾹 눌렀다 떼기<small>친구 · 백군</small></button></div>'
    : '<div class="throw"><button type="button" data-p="0" disabled>꾹 눌렀다 떼면 던지기<small>초록 칸에서 떼요</small></button></div>';
  [].forEach.call($('act').querySelectorAll('.throw button'),function(btn){ var p=+btn.getAttribute('data-p'); Bk.btn[p]=btn;
    btn.addEventListener('pointerdown',function(e){ e.preventDefault(); try{ btn.setPointerCapture(e.pointerId); }catch(x){} bkDown(p); });
    ['pointerup','pointercancel'].forEach(function(ev){ btn.addEventListener(ev,function(e){ e.preventDefault(); bkUp(p); }); });
    btn.addEventListener('contextmenu',function(e){ e.preventDefault(); }); });
  bkLay(); vs(null); bkSet(); }
function bkLay(){ var G=bkGeo(), tr=$('bktr'); if(!tr) return;
  var fl='<svg viewBox="0 0 360 22" preserveAspectRatio="none"><path d="M0 3Q180 14 360 3" stroke="#8C7B5C" stroke-width="1" fill="none"/>', cs=['#C9B48A','#9DB0C9','#D9C9A8','#B8C4A6','#D4B8A8'];
  for(var i=0;i<18;i++){ var x=8+i*19.5, yy=3+11*(1-Math.pow((x-180)/180,2))*.98; fl+='<path d="M'+(x-6)+' '+yy+'L'+(x+6)+' '+yy+'L'+x+' '+(yy+9)+'Z" fill="'+cs[i%cs.length]+'"/>'; }
  $('rnflag').innerHTML=fl+'</svg>';
  var h='';
  for(var p=0;p<2;p++){ var x=G.x[p], c=p===0?'a':'b';
    h+='<div class="bkp" style="left:'+x+'px;top:'+(G.by-G.r-14)+'px;height:'+(G.gy-G.by+G.r+14)+'px"></div>'
      +'<div class="bkhits '+c+'" id="bh'+p+'" style="left:'+x+'px;top:'+(G.by+G.r+10)+'px">'+new Array(BK.NEED+1).join('<i></i>')+'</div>'
      +'<div class="bkpile '+c+'" style="left:'+x+'px;top:'+(G.gy+8)+'px"><i></i><i></i><i></i></div>'
      +'<div class="bklab '+c+'" style="left:'+x+'px;top:'+(G.gy+26)+'px">'+(p===0?'청군 · 나':'백군 · '+esc(two()?'친구':nm(1)))+'</div>'; }
  tr.innerHTML=h;
  var sc=(G.r*2)/60;
  [['bkA',0],['bkB',1]].forEach(function(z){ var e=$(z[0]); e.style.left=G.x[z[1]]+'px'; e.style.top=G.by+'px'; e.querySelector('svg').style.transform='scale('+sc+')'; });
  [['bnA',0],['bnB',1]].forEach(function(z){ var e=$(z[0]); e.style.left=G.x[z[1]]+'px'; e.style.top=(G.by+G.r*.4)+'px'; });
  bkPaint(); }
function bkPaint(){ for(var p=0;p<2;p++){ var n=Bk.hits[p], b=$(p===0?'bkA':'bkB'); if(!b) continue;
    [].forEach.call(b.querySelectorAll('.cr'),function(c){ c.style.opacity=(+c.getAttribute('data-i'))<n?1:0; });
    var hb=$('bh'+p); if(hb) [].forEach.call(hb.querySelectorAll('i'),function(i,j){ i.classList.toggle('on',j<n); }); }
  S.sc=[Bk.hits[0],Bk.hits[1]]; vs(null); }
function bkSet(){ var g=S.gen; Bk.ph='set'; col('l',{pw:0,on:true,good:BK.Z}); col('r',{pw:0,on:true,good:two()?BK.Z:null}); if(window.noriSide) noriSide(null,'');
  $('say').innerHTML='<b>준비…</b> · 박을 바라보세요'; snd('stone',.4);
  setTimeout(function(){ if(g!==S.gen) return; bkGo(); },1300+Math.random()*700); }
function bkGo(){ var g=S.gen; Bk.ph='go'; Bk.cpuNext=performance.now()+bkCpuGap()+400; snd('slap',.9); fx('시작!',60);
  $('say').innerHTML='<b>꾹 눌렀다가</b> 힘이 <b style="color:#2E9E4F">초록 칸</b>에 오면 떼요';
  [].forEach.call($('act').querySelectorAll('button'),function(b){ b.disabled=false; });
  if(Bk.tip<1){ Bk.tip++; NA.point(Bk.btn[0],'꾹 눌렀다 떼기',.5,.4); }
  cancelAnimationFrame(braf); (function lp(){ if(g!==S.gen||Bk.ph!=='go') return; var now=performance.now();
    for(var p=0;p<2;p++){ if(Bk.hold[p]){ var ph=((now-Bk.hold[p])/BK.PER)%1; Bk.pw[p]=ph<.5?ph*2:2-ph*2; col(p===0?'l':'r',{pw:Bk.pw[p]}); } }
    if(!two()&&now>=Bk.cpuNext&&!Bk.fly[1]){ bkCpu(); Bk.cpuNext=now+bkCpuGap(); }
    braf=requestAnimationFrame(lp); })(); }
function bkCpuGap(){ var t=BOSS.bak?BOSS.bak.t:[1.15,1.5]; return (t[0]+Math.random()*(t[1]-t[0]))*1000; }
function bkCpu(){ var hit=Math.random()<Bk.hit, pw= hit ? BK.Z[0]+Math.random()*(BK.Z[1]-BK.Z[0]) : (Math.random()<.55 ? .25+Math.random()*.35 : .87+Math.random()*.12);
  col('r',{pw:pw}); setTimeout(function(){ if(Bk.ph==='go') col('r',{pw:0}); },350); bkThrow(1,pw); }
function bkDown(p){ if(S.over||Bk.ph!=='go'||Bk.fly[p]||Bk.hold[p]) return; if(p===1&&!two()) return; NA.unpoint(); Bk.hold[p]=performance.now(); Bk.pw[p]=0; if(Bk.btn[p]) Bk.btn[p].classList.add('hold'); }
function bkUp(p){ if(!Bk.hold[p]) return; Bk.hold[p]=0; if(Bk.btn[p]) Bk.btn[p].classList.remove('hold'); if(Bk.ph!=='go') return;
  var pw=Bk.pw[p]; setTimeout(function(){ if(Bk.ph==='go') col(p===0?'l':'r',{pw:0}); },350); bkThrow(p,pw); }
/* 던지기: 장대 아래 오재미 더미에서 박 쪽으로 포물선 · 맞으면 박에서 튕겨 떨어짐 */
function bkThrow(p,pw){ var g=S.gen, G=bkGeo(), bd=$('board'), x0=G.x[p]+(p===0?-26:26), y0=G.gy+4, hit=pw>=BK.Z[0]&&pw<=BK.Z[1], short=pw<BK.Z[0];
  var tx=G.x[p]+(p===0?-4:4), ty= hit ? G.by : (short ? G.by+(G.gy-G.by)*(1-pw/BK.Z[0])*.85+G.r : G.by-G.r-14-(pw-BK.Z[1])*120);
  var bag=document.createElement('div'); bag.className='bkbag '+(p===0?'a':'b'); bd.appendChild(bag); Bk.fly[p]=1;
  var t0=performance.now(), D=short?420:470;
  if(p===0||two()) snd('flick',.35);
  (function an(){ if(g!==S.gen){ bag.remove(); return; } var k=Math.min(1,(performance.now()-t0)/D), x=x0+(tx-x0)*k, y=y0+(ty-y0)*(1-Math.pow(1-k,2));
    if(!hit&&!short) { x=x0+(tx-x0)*k; }
    bag.style.transform='translate('+x+'px,'+y+'px) rotate('+(k*300)+'deg)';
    if(k<1){ requestAnimationFrame(an); return; }
    /* 내려오기 */
    var t1=performance.now(), yE=G.gy+6, xE=x+(p===0?-18:18)*(hit?1:.4);
    (function dn(){ if(g!==S.gen){ bag.remove(); return; } var q=Math.min(1,(performance.now()-t1)/380);
      bag.style.transform='translate('+(x+(xE-x)*q)+'px,'+(y+(yE-y)*q*q)+'px) rotate('+(300+q*200)+'deg)';
      if(q<1){ requestAnimationFrame(dn); return; } bag.style.opacity='.0'; setTimeout(function(){ bag.remove(); },50); })();
    Bk.fly[p]=0; bkLand(p,hit,short,x,y); })(); }
function bkLand(p,hit,short,x,y){ if(Bk.ph!=='go') return; var bd=$('board'), mine=(p===0||two());
  function pop(t,c){ var e=document.createElement('div'); e.className='bkpop'; e.textContent=t; e.style.left=x+'px'; e.style.top=(y-10)+'px'; e.style.color=c; bd.appendChild(e); setTimeout(function(){ e.remove(); },750); }
  if(!hit){ if(mine){ snd('miss',.3); pop(short?'모자라요':'넘쳤어요','#7A6E55'); if(p===0&&!two()) $('say').innerHTML=short?'<em>힘이 모자라요</em> · 조금 더 기다렸다 떼요':'<em>너무 셌어요</em> · 초록 칸에서 떼요'; } return; }
  Bk.hits[p]++; var b=$(p===0?'bkA':'bkB'); b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); snd('thud',mine?.55:.3);
  if(mine) pop('퉁!',p===0?'#2F64E0':'#6B5A42');
  if(p===0&&!two()) $('say').innerHTML='<b>맞았다!</b> · '+Bk.hits[0]+'번 · '+(BK.NEED-Bk.hits[0])+'번 더';
  bkPaint(); if(Bk.hits[p]>=BK.NEED) bkEnd(p); }
function bkEnd(w){ var g=S.gen; Bk.ph='end'; cancelAnimationFrame(braf); Bk.hold=[0,0];
  [].forEach.call($('act').querySelectorAll('button'),function(b){ b.disabled=true; b.classList.remove('hold'); }); col('l',{pw:0,good:null}); col('r',{pw:0,good:null});
  var b=$(w===0?'bkA':'bkB'); b.classList.add('open'); $('bh'+w).classList.add('gone'); $(w===0?'bnA':'bnB').classList.add('on'); snd('slap',.8); snd('flip',.6);
  var G=bkGeo(), bd=$('board'), cs=['#2F64E0','#FFC21A','#2E9E4F','#9DB0C9','#F7EFDD','#C9B48A'];
  for(var i=0;i<26;i++){ var c=document.createElement('i'); c.className='bkcf'; c.style.left=G.x[w]+'px'; c.style.top=G.by+'px'; c.style.background=cs[i%cs.length];
    c.style.setProperty('--dx',((Math.random()*2-1)*G.w*.28)+'px'); c.style.setProperty('--dy',(G.h*.25+Math.random()*G.h*.35)+'px'); c.style.animationDelay=(Math.random()*.25)+'s'; bd.appendChild(c); }
  var meWin=w===0; fx(meWin?(two()?'청군 이겼다!':'박 터졌다!'):(two()?'백군 이겼다!':'졌다…'),meWin?44:38);
  $('say').innerHTML=(w===0?'<b>청군</b>':'<em>백군</em>')+' 박이 먼저 쩍! · '+Bk.hits[0]+' 대 '+Bk.hits[1];
  setTimeout(function(){ if(g===S.gen) finish(meWin,Bk.hits[0],Bk.hits[1],(w===0?'나':(two()?'친구':nm(1)))+' 먼저 박 터뜨림 · '+Bk.hits[0]+'번 대 '+Bk.hits[1]+'번'); },1700); }
window.addEventListener('resize',function(){ if($('bktr')&&!S.over) bkLay(); });
