/* ───────── 칠교놀이 (261126 시안 · 대표 21:31 「둘 다 가보자」 — 끼워 맞추는 재미를 우리 옛 조각 맞추기로) ─────────
   큰 세모 둘 · 가운데 세모 하나 · 작은 세모 둘 · 네모 하나 · 기운 네모 하나 = 일곱 조각. 위 그림자 모양을 일곱 조각으로 빈틈없이 채움.
   조각을 끌면 칸에 착 붙고 · 톡 누르면 오른쪽으로 90도 · 「뒤집기」는 고른 조각을 좌우로 뒤집음. 「도움」은 조각 하나를 제자리에 놓아 줌(15초 더함).
   모양은 6가지(쉬움 셋 · 어려움 셋) — 판마다 하나 · 정해 둔 풀이는 풀이기로 확인했고 · 다른 방법으로 채워도 맞음(칸 하나하나 비교).
   한 차례 = 3분. 나 먼저 · 다음 사장님(친구) 같은 모양 · 빨리 맞춘 쪽이 이김. 못 맞추면 3분+.
   사장님: BOSS.chil.t[쉬움 · 어려움] 걸리는 초(판마다 그 안에서 하나) · 조각이 하나씩 제자리로 가는 것을 6배 빨리 보여 줌. 빨간 원 · 빛살 · 테두리 · 음영 없음. */
var CG={TIME:180, HINT:15, FAST:6, PZ:[{"n":"네모","w":4,"h":4,"p":[[[0,0],[4,0],[2,2]],[[0,4],[0,0],[2,2]],[[2,4],[0,4],[1,3]],[[1,3],[2,2],[3,3],[2,4]],[[3,1],[3,3],[2,2]],[[4,4],[4,2],[2,4]],[[3,3],[4,2],[4,0],[3,1]]],"lv":0},{"n":"큰 세모","w":8,"h":4,"p":[[[0,4],[4,4],[2,2]],[[4,4],[4,0],[2,2]],[[4,4],[4,2],[6,4]],[[4,2],[5,3],[6,2],[5,1]],[[4,0],[4,2],[5,1]],[[5,3],[6,4],[8,4],[7,3]],[[5,3],[7,3],[6,2]]],"lv":0},{"n":"기운 네모","w":8,"h":4,"p":[[[4,4],[0,4],[2,2]],[[4,0],[4,4],[2,2]],[[4,0],[4,2],[6,0]],[[4,2],[5,1],[6,2],[5,3]],[[4,4],[4,2],[5,3]],[[5,1],[6,0],[8,0],[7,1]],[[5,1],[7,1],[6,2]]],"lv":0},{"n":"돛단배","w":6,"h":5,"p":[[[3,4],[3,2],[4,3]],[[3,4],[4,3],[6,3],[5,4]],[[3,4],[5,4],[4,5]],[[3,2],[4,1],[5,2],[4,3]],[[4,5],[0,5],[2,3]],[[3,0],[3,4],[1,2]],[[0,3],[0,5],[2,3]]],"lv":1},{"n":"오리","w":7,"h":6,"p":[[[5,3],[5,5],[4,4]],[[3,3],[4,2],[5,3],[4,4]],[[7,3],[6,2],[4,2],[5,3]],[[6,2],[4,2],[5,1]],[[6,6],[2,6],[4,4]],[[0,4],[4,4],[2,6]],[[6,0],[4,0],[6,2]]],"lv":1},{"n":"나무","w":5,"h":8,"p":[[[3,1],[1,1],[2,0]],[[0,1],[4,1],[2,3]],[[3,2],[3,6],[1,4]],[[3,3],[3,5],[5,3]],[[2,5],[3,6],[3,8],[2,7]],[[0,3],[1,2],[2,3],[1,4]],[[2,0],[4,0],[3,1]]],"lv":1}],
  P:{B:[[0,0],[4,0],[2,2]],M:[[4,4],[4,2],[2,4]],S:[[4,0],[4,2],[3,1]],Q:[[2,2],[3,1],[4,2],[3,3]],L:[[0,4],[1,3],[3,3],[2,4]]},
  KS:['B','B','M','S','S','Q','L'], COL:['#2F64E0','#7FA7F0','#3BA370','#F2B32C','#E0A040','#8C7B5C','#5BB5C8']}, Cg={}, cgraf=0, CGO={};
var CGQ=[[.5,.2],[.8,.5],[.5,.8],[.2,.5]];
function cgIn(x,y,pl){ var c=false; for(var i=0,j=pl.length-1;i<pl.length;j=i++){ var a=pl[i], b=pl[j]; if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]) c=!c; } return c; }
function cgCells(pl){ var xs=pl.map(function(p){return p[0];}), ys=pl.map(function(p){return p[1];}), o=[];
  for(var x=Math.floor(Math.min.apply(null,xs))-1;x<=Math.max.apply(null,xs);x++) for(var y=Math.floor(Math.min.apply(null,ys))-1;y<=Math.max.apply(null,ys);y++) for(var q=0;q<4;q++) if(cgIn(x+CGQ[q][0],y+CGQ[q][1],pl)) o.push([x,y,q]);
  return o; }
function cgKey(cs){ return cs.map(function(c){ return c[0]+','+c[1]+','+c[2]; }).sort().join(' '); }
(function(){ ['B','M','S','Q','L'].forEach(function(k){ var L=[], seen={};
  (k==='L'?[0,1]:[0]).forEach(function(f){ for(var r=0;r<4;r++){ var pl=CG.P[k].map(function(p){ return [f?-p[0]:p[0],p[1]]; }); for(var i=0;i<r;i++) pl=pl.map(function(p){ return [-p[1],p[0]]; });
    var cs=cgCells(pl), mx=Math.min.apply(null,cs.map(function(c){return c[0];})), my=Math.min.apply(null,cs.map(function(c){return c[1];}));
    cs=cs.map(function(c){ return [c[0]-mx,c[1]-my,c[2]]; }); pl=pl.map(function(p){ return [p[0]-mx,p[1]-my]; }); var key=cgKey(cs);
    if(seen[key]==null){ seen[key]=L.length; L.push({r:r,f:f,pl:pl,cs:cs,key:key}); } } });
  L.forEach(function(o){ var rp=o.pl.map(function(p){ return [-p[1],p[0]]; }), fp=o.pl.map(function(p){ return [-p[0],p[1]]; });
    function find(pl){ var cs=cgCells(pl), mx=Math.min.apply(null,cs.map(function(c){return c[0];})), my=Math.min.apply(null,cs.map(function(c){return c[1];})); return seen[cgKey(cs.map(function(c){ return [c[0]-mx,c[1]-my,c[2]]; }))]; }
    o.rot=find(rp); o.flip=find(fp); });
  CGO[k]=L; }); })();
function cgGeo(){ var bd=$('board'), w=bd.clientWidth, h=bd.clientHeight, z=Cg.pz||CG.PZ[0], top=34, u=Math.floor(Math.min((w-12)/Math.max(11,z.w+1),(h-top-6)/(z.h+5.6)));
  var BW=Math.floor((w-8)/u); return {w:w,h:h,u:u,top:top,ox:Math.round((w-BW*u)/2),BW:BW,tx:Math.floor((BW-z.w)/2),ty:0,tray:z.h+1}; }
function cgPcs(i){ var p=Cg.pc[i], o=CGO[p.k][p.o]; return o.cs.map(function(c){ return [c[0]+p.x,c[1]+p.y,c[2]]; }); }
function cgTarget(){ var z=Cg.pz, G=cgGeo(), m={}; z.p.forEach(function(pl){ cgCells(pl).forEach(function(c){ m[(c[0]+G.tx)+','+(c[1]+G.ty)+','+c[2]]=1; }); }); return m; }
function cgSol(){ var z=Cg.pz, G=cgGeo(); return z.p.map(function(pl){ var cs=cgCells(pl), key=null, k0=null, o0=null, dx=0, dy=0;
  var mx=Math.min.apply(null,cs.map(function(c){return c[0];})), my=Math.min.apply(null,cs.map(function(c){return c[1];})), nk=cgKey(cs.map(function(c){ return [c[0]-mx,c[1]-my,c[2]]; }));
  ['B','M','S','Q','L'].forEach(function(k){ CGO[k].forEach(function(o,oi){ if(o.key===nk){ k0=k; o0=oi; } }); });
  return {k:k0,o:o0,x:mx+G.tx,y:my+G.ty}; }); }
function cgStart(){ Cg={gen:S.gen,who:0,ph:'wait',t:[0,0],hint:[0,0],done:[false,false],tip:0,sel:-1,
    pz:CG.PZ[Math.floor(Math.random()*CG.PZ.length)]};
  var T=BOSS.chil?BOSS.chil.t[Cg.pz.lv]:[[45,85],[75,135]][Cg.pz.lv]; Cg.cpuT=(T[0]+Math.random()*(T[1]-T[0]))*(1+((BOSS.cur||1.5)-1.5)*-.12);
  S.u='초'; S.sc=[0,0];
  var bd=$('board'); bd.classList.add('chil');
  bd.innerHTML='<div class="cgclk" id="cgclk">0:00</div><div class="cgname" id="cgname"></div><svg id="cgsvg" class="cgsvg"></svg>';
  cgBind(bd); vs(null); cgTurn(0);
  try{ var lw=bd.clientWidth, lh=bd.clientHeight; new ResizeObserver(function(){ if(S.over||!Cg.pc||(bd.clientWidth===lw&&bd.clientHeight===lh)) return; lw=bd.clientWidth; lh=bd.clientHeight; Cg.tg=cgTarget(); Cg.sol=cgSol(); cgFit(); cgDraw(); }).observe(bd); }catch(e){} }
function cgFit(){ var G=cgGeo(), rows=Math.floor((G.h-G.top)/G.u); Cg.pc.forEach(function(p){ var o=CGO[p.k][p.o], w=0, h=0; o.pl.forEach(function(q){ w=Math.max(w,q[0]); h=Math.max(h,q[1]); }); p.x=Math.max(0,Math.min(G.BW-w,p.x)); p.y=Math.max(0,Math.min(rows-h,p.y)); }); }
function cgLay0(){ var G=cgGeo(), row=G.tray, x=0, pcs=[], put=function(k,oi,c){ var o=CGO[k][oi], w=0, h=0; o.pl.forEach(function(p){ w=Math.max(w,p[0]); h=Math.max(h,p[1]); }); return {k:k,o:oi,c:c,w:w,h:h}; };
  var L=[put('B',0,CG.COL[0]),put('B',2,CG.COL[1]),put('M',1,CG.COL[2]),put('S',0,CG.COL[3]),put('S',2,CG.COL[4]),put('Q',0,CG.COL[5]),put('L',0,CG.COL[6])];
  /* 두 줄로 늘어놓기 · 칸 너비 넘으면 다음 줄 */
  var cx=0, cy=row, rh=0; L.forEach(function(p){ if(cx+p.w>G.BW){ cx=0; cy+=rh+1; rh=0; } p.x=cx; p.y=cy; cx+=p.w+ (G.BW>=14?1:0); rh=Math.max(rh,p.h); pcs.push(p); });
  /* 섞기: 같은 줄 안에서 차례만 */
  return pcs; }
function cgTurn(p){ var g=S.gen; Cg.who=p; Cg.ph='wait'; Cg.t[p]=0; Cg.hint[p]=0; Cg.sel=-1; vs(p);
  cgClock(); $('cgname').textContent=Cg.pz.n+(Cg.pz.lv?' · 어려움':' · 쉬움'); col(p===0?'l':'r',{pw:0,on:true});
  var mine=p===0||two();
  $('act').innerHTML='<div class="cgbtns'+(p===1?' b':'')+'"><button type="button" id="cgRot">↻ 돌리기</button><button type="button" id="cgFlip">⇋ 뒤집기</button><button type="button" id="cgHint">도움 +15초</button></div>';
  $('cgRot').addEventListener('click',function(){ if(Cg.sel>=0) cgRotate(Cg.sel); else $('say').innerHTML='<b>조각을 먼저 톡</b> 골라 주세요'; });
  $('cgFlip').addEventListener('click',function(){ if(Cg.sel>=0) cgFlip(Cg.sel); else $('say').innerHTML='<b>조각을 먼저 톡</b> 골라 주세요'; });
  $('cgHint').addEventListener('click',function(){ cgHint(); });
  [].forEach.call($('act').querySelectorAll('button'),function(b){ b.disabled=!mine; });
  Cg.pc=cgLay0(); Cg.tg=cgTarget(); Cg.sol=cgSol(); cgDraw();
  if(p===1&&two()){ $('say').innerHTML='<b>친구 차례</b> · 폰을 친구에게 넘겨 주세요 · 같은 모양';
    $('act').innerHTML='<div class="sbrow"><button type="button" class="big" id="cgRdy">친구 · 준비됐어요</button></div>';
    $('cgRdy').addEventListener('click',function(){ cgTurnBtns(); cgGo(); }); return; }
  $('say').innerHTML= p===0 ? '<b>내 차례</b> · 조각을 끌어 「'+esc(Cg.pz.n)+'」 모양을 채워요' : '<em>'+esc(nm(1))+' 차례</em> · 지켜보세요 (빨리 보기)';
  setTimeout(function(){ if(g===S.gen) cgGo(); },p===0?500:900); }
function cgTurnBtns(){ $('act').innerHTML='<div class="cgbtns b"><button type="button" id="cgRot">↻ 돌리기</button><button type="button" id="cgFlip">⇋ 뒤집기</button><button type="button" id="cgHint">도움 +15초</button></div>';
  $('cgRot').addEventListener('click',function(){ if(Cg.sel>=0) cgRotate(Cg.sel); }); $('cgFlip').addEventListener('click',function(){ if(Cg.sel>=0) cgFlip(Cg.sel); }); $('cgHint').addEventListener('click',function(){ cgHint(); }); }
function cgGo(){ var g=S.gen, cpu=Cg.who===1&&!two(); Cg.ph='go'; Cg.last=performance.now();
  if(Cg.who===0&&Cg.tip<1){ Cg.tip++; var e=document.querySelector('#cgsvg .cgp'); if(e) NA.point(e,'끌어서 모양 위로 · 톡 = 돌리기',.5,.5); }
  if(cpu){ Cg.cpuPlan=[]; var n=7, order=[0,1,2,3,4,5,6].sort(function(){ return Math.random()-.5; }); order.forEach(function(si,i){ Cg.cpuPlan.push({at:Cg.cpuT*(i+1)/n*(.85+Math.random()*.15),si:si}); }); Cg.cpuPlan[n-1].at=Cg.cpuT; }
  cancelAnimationFrame(cgraf); (function lp(){ if(g!==S.gen||Cg.ph!=='go') return; var now=performance.now(), k=cpu?CG.FAST:1, dt=Math.min(.05,(now-Cg.last)/1000)*k; Cg.last=now;
    Cg.t[Cg.who]+=dt; cgClock(); if(Cg.t[Cg.who]+Cg.hint[Cg.who]>=CG.TIME){ cgEnd(false); return; }
    if(cpu) while(Cg.cpuPlan.length&&Cg.t[1]>=Cg.cpuPlan[0].at){ cgCpuPut(Cg.cpuPlan.shift().si); if(Cg.ph!=='go') return; }
    cgraf=requestAnimationFrame(lp); })(); }
function cgClock(){ var s=Math.floor(Cg.t[Cg.who]+Cg.hint[Cg.who]); $('cgclk').textContent=Math.floor(s/60)+':'+('0'+(s%60)).slice(-2)+(Cg.hint[Cg.who]?' (+'+Cg.hint[Cg.who]+')':''); }
function cgDraw(){ var G=cgGeo(), u=G.u, sv=$('cgsvg'), h='';
  sv.setAttribute('width',G.w); sv.setAttribute('height',G.h); sv.setAttribute('viewBox','0 0 '+G.w+' '+G.h);
  var X=function(v){ return (G.ox+v*u).toFixed(1); }, Y=function(v){ return (G.top+v*u).toFixed(1); };
  h+='<g class="cgsh">'+Cg.pz.p.map(function(pl){ return '<polygon points="'+pl.map(function(p){ return X(p[0]+G.tx)+','+Y(p[1]+G.ty); }).join(' ')+'"/>'; }).join('')+'</g>';
  Cg.pc.forEach(function(p,i){ var o=CGO[p.k][p.o]; h+='<polygon class="cgp'+(Cg.sel===i?' sel':'')+'" data-i="'+i+'" fill="'+p.c+'" points="'+o.pl.map(function(q){ return X(q[0]+p.x)+','+Y(q[1]+p.y); }).join(' ')+'"/>'; });
  sv.innerHTML=h; }
function cgMine(){ return Cg.ph==='go'&&(Cg.who===0||two()); }
function cgBind(bd){ var drag=null;
  function pt(e){ var r=bd.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }
  bd.addEventListener('pointerdown',function(e){ if(!cgMine()) return; var t=e.target.closest&&e.target.closest('.cgp'); if(!t) return; e.preventDefault(); NA.unpoint();
    var i=+t.getAttribute('data-i'), P=pt(e), p=Cg.pc[i]; drag={i:i,x0:P.x,y0:P.y,px:p.x,py:p.y,mv:false}; Cg.pc.push(Cg.pc.splice(i,1)[0]); drag.i=Cg.pc.length-1; Cg.sel=drag.i; cgDraw();
    try{ bd.setPointerCapture(e.pointerId); }catch(x){} });
  bd.addEventListener('pointermove',function(e){ if(!drag) return; var P=pt(e), G=cgGeo(), dx=(P.x-drag.x0)/G.u, dy=(P.y-drag.y0)/G.u; if(Math.abs(P.x-drag.x0)+Math.abs(P.y-drag.y0)>6) drag.mv=true; if(!drag.mv) return;
    var p=Cg.pc[drag.i], el=document.querySelector('#cgsvg .cgp[data-i="'+drag.i+'"]'); if(el) el.setAttribute('transform','translate('+((dx+drag.px-p.x)*G.u).toFixed(1)+' '+((dy+drag.py-p.y)*G.u).toFixed(1)+')'); drag.dx=dx; drag.dy=dy; });
  function up(){ if(!drag) return; var d=drag; drag=null; if(!cgMine()) return; var p=Cg.pc[d.i];
    if(!d.mv){ cgRotate(d.i); return; }
    var G=cgGeo(), o=CGO[p.k][p.o], w=0, h=0; o.pl.forEach(function(q){ w=Math.max(w,q[0]); h=Math.max(h,q[1]); });
    p.x=Math.max(0,Math.min(G.BW-w,Math.round(d.px+d.dx))); p.y=Math.max(0,Math.min(Math.floor((G.h-G.top)/G.u)-h,Math.round(d.py+d.dy)));
    snd('stone',.25); cgDraw(); cgCheck(); }
  bd.addEventListener('pointerup',up); bd.addEventListener('pointercancel',up); bd.style.touchAction='none'; }
function cgMove(i,ni){ var p=Cg.pc[i], a=CGO[p.k][p.o], b=CGO[p.k][ni], cA=[0,0], cB=[0,0];
  a.pl.forEach(function(q){ cA[0]+=q[0]/a.pl.length; cA[1]+=q[1]/a.pl.length; }); b.pl.forEach(function(q){ cB[0]+=q[0]/b.pl.length; cB[1]+=q[1]/b.pl.length; });
  p.x=Math.max(0,p.x+Math.round(cA[0]-cB[0])); p.y=Math.max(0,p.y+Math.round(cA[1]-cB[1])); p.o=ni; Cg.sel=i; snd('flip',.25); cgDraw(); cgCheck(); }
function cgRotate(i){ if(!cgMine()&&!(Cg.who===1&&!two())) return; cgMove(i,CGO[Cg.pc[i].k][Cg.pc[i].o].rot); }
function cgFlip(i){ if(!cgMine()) return; cgMove(i,CGO[Cg.pc[i].k][Cg.pc[i].o].flip); }
function cgCheck(){ if(Cg.ph!=='go') return; var have={}, n=0, ov=false;
  for(var i=0;i<Cg.pc.length;i++) cgPcs(i).forEach(function(c){ var k=c.join(','); if(have[k]) ov=true; have[k]=1; });
  var tk=Object.keys(Cg.tg), inT=0; tk.forEach(function(k){ if(have[k]) inT++; });
  col(Cg.who===0?'l':'r',{pw:inT/tk.length,on:true});
  if(!ov&&inT===tk.length&&Object.keys(have).length===tk.length) cgEnd(true); }
/* 도움: 아직 제자리에 없는 조각 하나를 정해 둔 풀이 자리로 */
function cgHint(){ if(!cgMine()) return; var placed=cgPlaced(); for(var s=0;s<Cg.sol.length;s++){ if(placed.sol[s]) continue; var so=Cg.sol[s];
    for(var i=0;i<Cg.pc.length;i++){ if(placed.pc[i]||Cg.pc[i].k!==so.k) continue; var p=Cg.pc[i]; p.o=so.o; p.x=so.x; p.y=so.y; Cg.hint[Cg.who]+=CG.HINT; Cg.sel=i; snd('putt',.4); cgDraw(); cgClock(); $('say').innerHTML='<b>도움</b> · 조각 하나 제자리 · 15초 더해요'; cgCheck(); return; } } }
function cgPlaced(){ var ps={}, ss={};
  Cg.sol.forEach(function(so,s){ var key=cgKey(CGO[so.k][so.o].cs.map(function(c){ return [c[0]+so.x,c[1]+so.y,c[2]]; }));
    for(var i=0;i<Cg.pc.length;i++){ if(ps[i]||Cg.pc[i].k!==so.k) continue; if(cgKey(cgPcs(i))===key){ ps[i]=1; ss[s]=1; break; } } });
  return {pc:ps,sol:ss}; }
function cgCpuPut(si){ var so=Cg.sol[si], placed=cgPlaced(); if(placed.sol[si]) return; for(var i=0;i<Cg.pc.length;i++){ if(placed.pc[i]||Cg.pc[i].k!==so.k) continue; var p=Cg.pc[i]; p.o=so.o; p.x=so.x; p.y=so.y; snd('stone',.15); cgDraw(); cgCheck(); return; } }
function cgEnd(ok){ var g=S.gen, p=Cg.who; Cg.ph='end'; cancelAnimationFrame(cgraf); NA.unpoint(); Cg.done[p]=ok; Cg.sel=-1; cgDraw();
  var tt=Math.round((Cg.t[p]+Cg.hint[p])*10)/10; if(!ok) tt=CG.TIME; Cg.t[p]=tt; Cg.hint[p]=0;
  S.sc=[Math.round(Cg.t[0]),Math.round(Cg.t[1])]; vs(p);
  if(ok){ fx('다 맞췄다!',42); snd('win'); } else { fx('3분 끝!',44); snd('thud',.4); }
  $('say').innerHTML='<b>'+(p===0?'내':esc(p===1&&two()?'친구':nm(1)))+' 차례 끝</b> · '+(ok?'<b>'+cgFmt(tt)+'</b> 만에 맞춤':'못 맞췄어요');
  [].forEach.call($('act').querySelectorAll('button'),function(b){ b.disabled=true; });
  setTimeout(function(){ if(g!==S.gen) return; if(p===0){ cgTurn(1); return; } cgResult(); },1700); }
function cgFmt(t){ t=Math.round(t); return (t>=60?Math.floor(t/60)+'분 ':'')+(t%60)+'초'; }
function cgResult(){ var g=S.gen, a=Cg.done[0]?Cg.t[0]:1e9, b=Cg.done[1]?Cg.t[1]:1e9;
  if(Math.round(a)===Math.round(b)){ fx('비겼다!',44); $('say').innerHTML='<b>똑같아요</b> · 한 번 더!'; setTimeout(function(){ if(g===S.gen){ Cg.pz=CG.PZ[Math.floor(Math.random()*CG.PZ.length)]; cgTurn(0); } },1600); return; }
  var meWin=a<b, o=two()?'친구':nm(1), f=function(q){ return Cg.done[q]?cgFmt(Cg.t[q]):'못 맞춤'; }, det='「'+Cg.pz.n+'」 나 '+f(0)+' · '+o+' '+f(1);
  $('say').innerHTML=(meWin?'<b>내가 더 빨리!</b>':'<em>'+esc(o)+' 더 빨리</em>')+' · '+det; finish(meWin,Math.round(Cg.t[0]),Math.round(Cg.t[1]),det); }
window.addEventListener('resize',function(){ if($('cgsvg')&&!S.over&&Cg.pc) cgDraw(); });
