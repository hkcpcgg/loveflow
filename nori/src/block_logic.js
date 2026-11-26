/* ───────── 블록 맞추기 (261126 시안 · 대표 21:31 「둘 다 가보자」 — 끼워 맞추는 재미 · 떨어지는 블록 놀이는 상표 · 생김새 문제로 쓰지 않음) ─────────
   8×8 판 · 아래 조각 셋을 손가락으로 끌어 판에 놓음(또는 조각을 톡 → 판을 톡). 가로든 세로든 한 줄이 꽉 차면 지워짐.
   점수 = 놓은 칸 수 + 지운 줄마다 10점(한 번에 두 줄 넘게 지우면 두 배). 조각 셋을 다 놓으면 새 셋.
   한 차례 = 1분 · 놓을 자리가 없으면 그 자리에서 끝. 나 먼저 · 다음 사장님(친구) · 점수 높은 쪽이 이김(같으면 한 번 더).
   사장님: 한 수에 줄 지우기 · 붙여 놓기를 셈해 고름 · BOSS.blk.err 비율로 아무 자리나 놓음 · 2.4배 빨리 보여 줌(놀이 시간은 같음). 빨간 원 · 빛살 · 테두리 · 음영 없음. */
var BM={N:8, TIME:60, FAST:2.4, CPU_DT:2.4, LINE:10,
  SH:[[[0,0]],[[0,0],[1,0]],[[0,0],[0,1]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]],
      [[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[0,1]],[[0,0],[1,0],[1,1]],[[0,0],[0,1],[1,1]],[[1,0],[0,1],[1,1]],
      [[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[2,0],[0,1]],[[0,0],[1,0],[1,1],[1,2]],[[2,0],[0,1],[1,1],[2,1]],
      [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],[[0,0],[1,0],[2,0],[0,1],[0,2]]],
  W:[6,3,3,4,4,2,2,4,3,3,3,3,2,2,2,2,1,1], COL:['#2F64E0','#F2B32C','#3BA370','#7FA7F0','#8C7B5C']}, Bm={}, bmraf=0;
function bmGeo(){ var bd=$('board'), w=bd.clientWidth, h=bd.clientHeight, trayH=Math.max(84,Math.min(120,h*.27)), top=34, g=Math.floor(Math.min(w-16,h-trayH-top-8)/BM.N), gx=Math.round((w-g*BM.N)/2);
  return {w:w,h:h,top:top,g:g,gx:gx,gy:top,ty:top+g*BM.N+8,th:trayH,ts:Math.max(12,Math.min(22,Math.floor(Math.min((w-24)/3/4.2,(trayH-16)/3.2))))}; }
function bmPick(){ var t=0,i; for(i=0;i<BM.W.length;i++) t+=BM.W[i]; var r=Math.random()*t; for(i=0;i<BM.W.length;i++){ r-=BM.W[i]; if(r<0) return i; } return 0; }
function bmNew(){ Bm.tray=[0,1,2].map(function(){ return {s:bmPick(),c:BM.COL[Math.floor(Math.random()*BM.COL.length)],used:false}; }); }
function bmFits(s,ox,oy){ var c=BM.SH[s]; for(var i=0;i<c.length;i++){ var x=ox+c[i][0], y=oy+c[i][1]; if(x<0||y<0||x>=BM.N||y>=BM.N||Bm.b[y][x]) return false; } return true; }
function bmAny(){ for(var t=0;t<3;t++){ var p=Bm.tray[t]; if(p.used) continue; for(var y=0;y<BM.N;y++) for(var x=0;x<BM.N;x++) if(bmFits(p.s,x,y)) return true; } return false; }
function bmStart(){ Bm={gen:S.gen,who:0,ph:'wait',sc:[0,0],tleft:[BM.TIME,BM.TIME],tip:0,sel:-1,
    err:BOSS.blk?BOSS.blk.err[0]+Math.random()*(BOSS.blk.err[1]-BOSS.blk.err[0]):.32};
  Bm.err*=1-((BOSS.cur||1.5)-1.5)*.2; S.u='점'; S.sc=[0,0];
  var bd=$('board'); bd.classList.add('blk');
  bd.innerHTML='<div class="bmclk" id="bmclk">1:00</div><div id="bmgrid"></div><div id="bmtray"></div><div class="bmghost" id="bmghost"></div>';
  bmBind(bd); vs(null); bmTurn(0);
  try{ var lw=bd.clientWidth, lh=bd.clientHeight; new ResizeObserver(function(){ if(S.over||!Bm.b||(bd.clientWidth===lw&&bd.clientHeight===lh)) return; lw=bd.clientWidth; lh=bd.clientHeight; bmLay(); }).observe(bd); }catch(e){} }
function bmTurn(p){ var g=S.gen; Bm.who=p; Bm.ph='wait'; Bm.sc[p]=0; Bm.tleft[p]=BM.TIME; Bm.sel=-1; vs(p);
  Bm.b=[]; for(var y=0;y<BM.N;y++){ Bm.b.push([]); for(var x=0;x<BM.N;x++) Bm.b[y].push(''); }
  bmNew(); bmLay(); bmClock(); col(p===0?'l':'r',{pw:0,on:true});
  $('act').innerHTML='<div class="bmnote'+(p===1?' b':'')+'">'+(p===0||two()?'조각을 끌어 판에 · 줄이 차면 지워져요':esc(nm(1))+' 차례 · 빨리 보기')+'</div>';
  if(p===1&&two()){ $('say').innerHTML='<b>친구 차례</b> · 폰을 친구에게 넘겨 주세요';
    $('act').innerHTML='<div class="sbrow"><button type="button" class="big" id="bmRdy">친구 · 준비됐어요</button></div>';
    $('bmRdy').addEventListener('click',function(){ $('act').innerHTML='<div class="bmnote b">친구 차례 · 조각을 끌어 판에 놓아요</div>'; bmGo(); }); return; }
  $('say').innerHTML= p===0 ? '<b>내 차례</b> · 조각을 끌어 판에 놓아요' : '<em>'+esc(nm(1))+' 차례</em> · 지켜보세요';
  setTimeout(function(){ if(g===S.gen) bmGo(); },p===0?600:1000); }
function bmGo(){ var g=S.gen; Bm.ph='go'; Bm.last=performance.now(); Bm.cpuAt=Bm.last+600;
  if(Bm.who===0&&Bm.tip<1){ Bm.tip++; var e=document.querySelector('#bmtray .bmp'); if(e) NA.point(e,'끌어서 판에',.5,.5); }
  cancelAnimationFrame(bmraf); (function lp(){ if(g!==S.gen||Bm.ph!=='go') return; var now=performance.now(), cpu=Bm.who===1&&!two(), k=cpu?BM.FAST:1, dt=Math.min(.05,(now-Bm.last)/1000)*k; Bm.last=now;
    Bm.tleft[Bm.who]-=dt; bmClock(); if(Bm.tleft[Bm.who]<=0){ bmEnd('time'); return; }
    if(cpu&&now>=Bm.cpuAt){ Bm.cpuAt=now+BM.CPU_DT*1000/BM.FAST*(.8+Math.random()*.4); bmCpu(); if(Bm.ph!=='go') return; }
    bmraf=requestAnimationFrame(lp); })(); }
function bmClock(){ var t=Math.max(0,Bm.tleft[Bm.who]), s=Math.ceil(t); $('bmclk').textContent=Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }
function bmLay(){ var G=bmGeo(), h='';
  for(var y=0;y<BM.N;y++) for(var x=0;x<BM.N;x++){ var v=Bm.b[y][x]; h+='<i class="bmc'+(v?' on':'')+'" id="bmc'+x+'_'+y+'" style="left:'+(G.gx+x*G.g+1)+'px;top:'+(G.gy+y*G.g+1)+'px;width:'+(G.g-2)+'px;height:'+(G.g-2)+'px'+(v?';background:'+v:'')+'"></i>'; }
  $('bmgrid').innerHTML=h; bmTray(); }
function bmTray(){ var G=bmGeo(), h='', cw=(G.w-16)/3;
  for(var t=0;t<3;t++){ var p=Bm.tray[t]; if(p.used) continue; var c=BM.SH[p.s], mw=0, mh=0; c.forEach(function(q){ mw=Math.max(mw,q[0]+1); mh=Math.max(mh,q[1]+1); });
    var s=G.ts, L=8+cw*t+(cw-mw*s)/2, T=G.ty+(G.th-8-mh*s)/2, inner='';
    c.forEach(function(q){ inner+='<i style="left:'+(q[0]*s+1)+'px;top:'+(q[1]*s+1)+'px;width:'+(s-2)+'px;height:'+(s-2)+'px;background:'+p.c+'"></i>'; });
    h+='<div class="bmp'+(Bm.sel===t?' sel':'')+'" data-t="'+t+'" style="left:'+L+'px;top:'+T+'px;width:'+(mw*s)+'px;height:'+(mh*s)+'px">'+inner+'</div>'; }
  $('bmtray').innerHTML=h; }
function bmMine(){ return Bm.ph==='go'&&(Bm.who===0||two()); }
function bmBind(bd){ var drag=null;
  function cellAt(cx,cy,G){ return {x:Math.floor((cx-G.gx)/G.g), y:Math.floor((cy-G.gy)/G.g)}; }
  function originFor(t,cx,cy,G){ var c=BM.SH[Bm.tray[t].s], mw=0, mh=0; c.forEach(function(q){ mw=Math.max(mw,q[0]+1); mh=Math.max(mh,q[1]+1); });
    return {x:Math.round((cx-G.gx)/G.g-mw/2), y:Math.round((cy-G.gy)/G.g-mh/2)}; }
  function pt(e){ var r=bd.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; }
  bd.addEventListener('pointerdown',function(e){ if(!bmMine()) return; e.preventDefault(); var P=pt(e), G=bmGeo(), pc=e.target.closest('.bmp');
    if(pc){ var t=+pc.getAttribute('data-t'); NA.unpoint(); drag={t:t,x0:P.x,y0:P.y,mv:false}; try{ bd.setPointerCapture(e.pointerId); }catch(x){} return; }
    if(Bm.sel>=0){ var o=originFor(Bm.sel,P.x,P.y,G); if(bmFits(Bm.tray[Bm.sel].s,o.x,o.y)){ bmPlace(Bm.sel,o.x,o.y); } else { snd('miss',.3); } } });
  bd.addEventListener('pointermove',function(e){ if(!drag||!bmMine()) return; var P=pt(e), G=bmGeo(); if(Math.abs(P.x-drag.x0)+Math.abs(P.y-drag.y0)>8) drag.mv=true; if(!drag.mv) return;
    var lift=G.g*1.6, o=originFor(drag.t,P.x,P.y-lift,G); drag.o=o; bmGhost(drag.t,o,P.x,P.y-lift,G); });
  function up(e){ if(!drag) return; var d=drag; drag=null; bmGhostOff(); if(!bmMine()) return;
    if(!d.mv){ Bm.sel=Bm.sel===d.t?-1:d.t; bmTray(); if(Bm.sel>=0) $('say').innerHTML='<b>조각 고름</b> · 놓을 자리를 톡'; return; }
    if(d.o&&bmFits(Bm.tray[d.t].s,d.o.x,d.o.y)) bmPlace(d.t,d.o.x,d.o.y); else snd('miss',.3); }
  bd.addEventListener('pointerup',up); bd.addEventListener('pointercancel',up); bd.style.touchAction='none'; }
function bmGhost(t,o,cx,cy,G){ var p=Bm.tray[t], c=BM.SH[p.s], ok=bmFits(p.s,o.x,o.y), gh=$('bmghost'), h='';
  [].forEach.call(document.querySelectorAll('#bmgrid .bmc.pv,#bmgrid .bmc.bad'),function(e){ e.classList.remove('pv','bad'); });
  c.forEach(function(q){ var e=$('bmc'+(o.x+q[0])+'_'+(o.y+q[1])); if(e) e.classList.add(ok?'pv':'bad'); });
  var mw=0, mh=0; c.forEach(function(q){ mw=Math.max(mw,q[0]+1); mh=Math.max(mh,q[1]+1); }); var s=G.g*.9;
  c.forEach(function(q){ h+='<i style="left:'+(q[0]*s+1)+'px;top:'+(q[1]*s+1)+'px;width:'+(s-2)+'px;height:'+(s-2)+'px;background:'+p.c+'"></i>'; });
  gh.innerHTML=h; gh.style.width=(mw*s)+'px'; gh.style.height=(mh*s)+'px'; gh.style.transform='translate('+(cx-mw*s/2)+'px,'+(cy-mh*s/2)+'px)'; gh.classList.add('on');
  var pc=document.querySelector('#bmtray .bmp[data-t="'+t+'"]'); if(pc) pc.style.opacity='.25'; }
function bmGhostOff(){ var gh=$('bmghost'); if(gh){ gh.classList.remove('on'); gh.innerHTML=''; } [].forEach.call(document.querySelectorAll('#bmgrid .bmc.pv,#bmgrid .bmc.bad'),function(e){ e.classList.remove('pv','bad'); }); [].forEach.call(document.querySelectorAll('#bmtray .bmp'),function(e){ e.style.opacity=''; }); }
function bmPlace(t,ox,oy){ var g=S.gen, p=Bm.tray[t], c=BM.SH[p.s], me=Bm.who; p.used=true; Bm.sel=-1;
  c.forEach(function(q){ Bm.b[oy+q[1]][ox+q[0]]=p.c; });
  var rows=[], cols=[], x, y; for(y=0;y<BM.N;y++){ var f=true; for(x=0;x<BM.N;x++) if(!Bm.b[y][x]){ f=false; break; } if(f) rows.push(y); }
  for(x=0;x<BM.N;x++){ var f2=true; for(y=0;y<BM.N;y++) if(!Bm.b[y][x]){ f2=false; break; } if(f2) cols.push(x); }
  var n=rows.length+cols.length, gain=c.length+n*BM.LINE*(n>=2?2:1);
  rows.forEach(function(r){ for(var i=0;i<BM.N;i++) Bm.b[r][i]=''; }); cols.forEach(function(cc){ for(var i=0;i<BM.N;i++) Bm.b[i][cc]=''; });
  Bm.sc[me]+=gain; S.sc=[Bm.sc[0],Bm.sc[1]]; vs(me); col(me===0?'l':'r',{pw:Math.min(1,Bm.sc[me]/250),on:true});
  var loud=me===0||two();
  if(n){ var flash=[]; rows.forEach(function(r){ for(var i=0;i<BM.N;i++) flash.push(i+'_'+r); }); cols.forEach(function(cc){ for(var i=0;i<BM.N;i++) flash.push(cc+'_'+i); });
    bmLay(); flash.forEach(function(k){ var e=$('bmc'+k); if(e) e.classList.add('pop'); }); snd('flip',loud?.55:.3); fx(n>=2?n+'줄!':'한 줄!',n>=2?52:44); }
  else { bmLay(); snd('putt',loud?.3:.15); }
  if(loud) $('say').innerHTML='<b>+'+gain+'점</b>'+(n?' · '+n+'줄 지움':'')+' · 지금 '+Bm.sc[me]+'점';
  if(Bm.tray.every(function(q){ return q.used; })){ bmNew(); bmTray(); }
  if(!bmAny()) bmEnd('stuck'); }
/* 사장님: 놓을 수 있는 자리마다 (지우는 줄 × 100 + 맞닿는 변 수)로 셈해 가장 좋은 수 · err 비율로 아무 자리 */
function bmCpu(){ var best=null, all=[];
  for(var t=0;t<3;t++){ var p=Bm.tray[t]; if(p.used) continue; var c=BM.SH[p.s];
    for(var oy=0;oy<BM.N;oy++) for(var ox=0;ox<BM.N;ox++){ if(!bmFits(p.s,ox,oy)) continue; var sc=0, set={};
      c.forEach(function(q){ set[(ox+q[0])+'_'+(oy+q[1])]=1; });
      c.forEach(function(q){ var x=ox+q[0], y=oy+q[1]; [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){ var a=x+d[0], b=y+d[1]; if(a<0||b<0||a>=BM.N||b>=BM.N||Bm.b[b][a]) sc++; }); });
      for(var y=0;y<BM.N;y++){ var f=true; for(var x=0;x<BM.N;x++) if(!Bm.b[y][x]&&!set[x+'_'+y]){ f=false; break; } if(f) sc+=100; }
      for(var x2=0;x2<BM.N;x2++){ var f2=true; for(var y2=0;y2<BM.N;y2++) if(!Bm.b[y2][x2]&&!set[x2+'_'+y2]){ f2=false; break; } if(f2) sc+=100; }
      sc+=c.length*.5+Math.random()*.5; var mv={t:t,x:ox,y:oy,sc:sc}; all.push(mv); if(!best||sc>best.sc) best=mv; } }
  if(!best){ bmEnd('stuck'); return; }
  var m=Math.random()<Bm.err?all[Math.floor(Math.random()*all.length)]:best; bmPlace(m.t,m.x,m.y); }
function bmEnd(why){ var g=S.gen, p=Bm.who; Bm.ph='end'; cancelAnimationFrame(bmraf); NA.unpoint(); bmGhostOff();
  fx(why==='time'?'1분 끝!':'자리가 없어요',why==='time'?44:32); if(why==='stuck') snd('thud',.4);
  $('say').innerHTML='<b>'+(p===0?'내':esc(p===1&&two()?'친구':nm(1)))+' 차례 끝</b> · <b>'+Bm.sc[p]+'점</b>'+(why==='stuck'?' · 놓을 자리가 없어요':'');
  setTimeout(function(){ if(g!==S.gen) return; if(p===0){ bmTurn(1); return; } bmResult(); },1500); }
function bmResult(){ var g=S.gen, a=Bm.sc[0], b=Bm.sc[1];
  if(a===b){ fx('비겼다!',44); $('say').innerHTML='<b>똑같은 점수</b> · 한 번 더!'; setTimeout(function(){ if(g===S.gen) bmTurn(0); },1600); return; }
  var meWin=a>b, o=two()?'친구':nm(1), det='나 '+a+'점 · '+o+' '+b+'점';
  $('say').innerHTML=(meWin?'<b>내가 더 높이!</b>':'<em>'+esc(o)+' 더 높이</em>')+' · '+det; finish(meWin,a,b,det); }
window.addEventListener('resize',function(){ if($('bmgrid')&&!S.over&&Bm.b) bmLay(); });
