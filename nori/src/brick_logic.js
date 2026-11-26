/* ───────── 벽돌깨기 (261126 시안 · 대표 20:46 「탁구공 · 받침대 · 벽에 부딪혀 벽돌 깨는 거」) ─────────
   오락실 · 전자오락 시절 놀이. 아래 받침대를 손가락으로 좌우로 끌어 공을 받아 올림 · 공이 벽에 튕기며 위 벽돌을 깸.
   한 차례 = 공 세 개 · 1분. 공을 놓치면 하나 줄고 · 다 놓치거나 1분이 되거나 벽돌을 다 깨면 차례 끝.
   나 먼저 · 다음 사장님(친구) · 더 많이 깬 쪽이 이김(같으면 한 번 더). 다 깨면 남은 시간만큼 덤(1초 = 0.1개 아님 · 덤은 10개 · 같을 때 가름용).
   이름은 「벽돌깨기」만 씀 · 상표 놀이 이름 · 그림은 쓰지 않음. 빨간 원 · 빛살 · 테두리 · 음영 없음.
   사장님: BOSS.brick.miss 공을 받으러 갈 때 놓치는 비율(판마다 그 안에서 하나) · 사장님 차례는 1.6배 빨리 보여 줌(놀이 시간은 같음). */
var BC={COLS:6, ROWS:5, BALLS:3, TIME:60, FAST:1.6, COLORS:['#2F64E0','#F2B32C','#3BA370','#7FA7F0','#8C7B5C'], BONUS:10}, Bc={}, bcraf=0;
function bcGeo(){ var bd=$('board'), w=bd.clientWidth, h=bd.clientHeight, side=8, top=34, gap=4, bw=(w-side*2-gap*(BC.COLS-1))/BC.COLS, bh=Math.max(14,Math.min(22,h*.045));
  var pw=Math.max(64,w*.24), ph=12, py=h-ph-14, r=Math.max(6,Math.min(9,w*.022));
  return {w:w,h:h,side:side,top:top,gap:gap,bw:bw,bh:bh,pw:pw,ph:ph,py:py,r:r}; }
function bcStart(){ Bc={gen:S.gen,who:0,ph:'wait',sc:[0,0],left:[BC.BALLS,BC.BALLS],tleft:[BC.TIME,BC.TIME],clr:[false,false],tip:0,
    miss:BOSS.brick?BOSS.brick.miss[0]+Math.random()*(BOSS.brick.miss[1]-BOSS.brick.miss[0]):.17};
  Bc.miss*=1-((BOSS.cur||1.5)-1.5)*.15; S.u='개'; S.sc=[0,0];
  var bd=$('board'); bd.classList.add('brick');
  bd.innerHTML='<div class="bcclk" id="bcclk">1:00</div><div class="bclife" id="bclife"></div><div id="bcwall"></div><div class="bcpad" id="bcpad"></div><div class="bcball" id="bcball"></div><div class="bcmsg" id="bcmsg"></div>';
  bcBind(bd); vs(null); bcTurn(0); }
function bcBind(bd){ var mv=function(e){ if(Bc.ph!=='go'&&Bc.ph!=='ready') return; if(Bc.who===1&&!two()) return; var r=bd.getBoundingClientRect(); Bc.tx=e.clientX-r.left; NA.unpoint(); };
  bd.addEventListener('pointerdown',function(e){ e.preventDefault(); mv(e); if(Bc.ph==='ready') bcServe(); });
  bd.addEventListener('pointermove',function(e){ if(e.pointerType==='mouse'||e.buttons||e.pressure>0) mv(e); }); bd.style.touchAction='none'; }
function bcPad(){ var p=Bc.who; $('act').innerHTML='<div class="bcstrip'+(p===1?' b':'')+'" id="bcstrip"><span>◀</span><b>여기를 좌우로 끌어요'+(two()?'<small>'+(p===0?'나':'친구')+'</small>':'')+'</b><span>▶</span></div>';
  var st=$('bcstrip'), mv=function(e){ if(Bc.ph!=='go'&&Bc.ph!=='ready') return; if(p===1&&!two()) return; var r=st.getBoundingClientRect(), G=bcGeo(); Bc.tx=G.pw/2+Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*(G.w-G.pw); NA.unpoint(); };
  st.addEventListener('pointerdown',function(e){ e.preventDefault(); try{ st.setPointerCapture(e.pointerId); }catch(x){} mv(e); if(Bc.ph==='ready') bcServe(); });
  st.addEventListener('pointermove',function(e){ if(e.buttons||e.pressure>0||e.pointerType==='mouse') mv(e); });
  if(p===1&&!two()) st.classList.add('off'); }
function bcWall(){ var G=bcGeo(), h=''; Bc.bricks=[];
  for(var r=0;r<BC.ROWS;r++) for(var c=0;c<BC.COLS;c++){ var x=G.side+c*(G.bw+G.gap), y=G.top+r*(G.bh+G.gap); Bc.bricks.push({x:x,y:y,w:G.bw,h:G.bh,on:true});
    h+='<i class="bcb" id="bcb'+(r*BC.COLS+c)+'" style="left:'+x.toFixed(1)+'px;top:'+y.toFixed(1)+'px;width:'+G.bw.toFixed(1)+'px;height:'+G.bh+'px;background:'+BC.COLORS[r]+'"></i>'; }
  $('bcwall').innerHTML=h; }
function bcLife(){ var n=Bc.left[Bc.who], h=''; for(var i=0;i<BC.BALLS;i++) h+='<i class="'+(i<n?'on':'')+'"></i>'; $('bclife').innerHTML=h; }
function bcClock(){ var t=Math.max(0,Bc.tleft[Bc.who]), s=Math.ceil(t); $('bcclk').textContent=Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }
function bcWho(){ return Bc.who===0?'나':(two()?'친구':nm(1)); }
function bcTurn(p){ var g=S.gen; Bc.who=p; Bc.ph='wait'; Bc.sc[p]=0; Bc.left[p]=BC.BALLS; Bc.tleft[p]=BC.TIME; Bc.spd=1; vs(p);
  var G=bcGeo(); Bc.px=G.w/2; Bc.tx=G.w/2; bcWall(); bcLife(); bcClock(); bcPad(); $('bcpad').classList.toggle('b',p===1); $('bcball').classList.toggle('b',p===1);
  col(p===0?'l':'r',{pw:0,on:true});
  bcDrawPad(); bcPark();
  if(p===1&&two()){ $('say').innerHTML='<b>친구 차례</b> · 폰을 친구에게 넘겨 주세요';
    $('act').innerHTML='<div class="sbrow"><button type="button" class="big" id="bcRdy">친구 · 준비됐어요</button></div>';
    $('bcRdy').addEventListener('click',function(){ bcPad(); bcReady(); }); return; }
  $('say').innerHTML= p===0 ? '<b>내 차례</b> · 받침대를 끌어 공을 받아요' : '<em>'+esc(nm(1))+' 차례</em> · 지켜보세요 (빨리 보기)';
  setTimeout(function(){ if(g===S.gen) bcReady(); },p===0?600:1100); }
function bcPark(){ var G=bcGeo(); Bc.bx=Bc.px; Bc.by=G.py-G.r-1; Bc.vx=0; Bc.vy=0; bcDrawBall(); }
function bcReady(){ var g=S.gen, p=Bc.who; Bc.ph='ready'; bcPark(); bcLoop();
  if(p===0||two()){ $('bcmsg').textContent='톡 누르면 공이 나가요'; $('bcmsg').classList.add('on');
    if(p===0&&Bc.tip<1){ Bc.tip++; NA.point($('bcstrip'),'좌우로 끌어요',.5,.5); }
    Bc.auto=setTimeout(function(){ if(g===S.gen&&Bc.ph==='ready'&&Bc.who===p) bcServe(); },2600); }
  else Bc.auto=setTimeout(function(){ if(g===S.gen&&Bc.ph==='ready') bcServe(); },500); }
function bcServe(){ if(Bc.ph!=='ready') return; clearTimeout(Bc.auto); $('bcmsg').classList.remove('on'); var G=bcGeo(), v=bcV0(G), a=(Math.random()*.5+.25)*(Math.random()<.5?-1:1);
  Bc.vx=v*Math.sin(a); Bc.vy=-v*Math.cos(a); Bc.ph='go'; snd('putt',.35); bcPlan(); }
function bcV0(G){ return G.h*.62*Bc.spd; }
function bcLoop(){ var g=S.gen; cancelAnimationFrame(bcraf); Bc.last=performance.now();
  (function lp(){ if(g!==S.gen||(Bc.ph!=='go'&&Bc.ph!=='ready')) return; var now=performance.now(), rdt=Math.min(.05,(now-Bc.last)/1000), k=(Bc.who===1&&!two())?BC.FAST:1, dt=rdt*k; Bc.last=now;
    var G=bcGeo();
    if(Bc.who===1&&!two()) bcCpuMove(G,dt);
    var maxv=G.w*2.2*k; Bc.px+=Math.max(-maxv*rdt,Math.min(maxv*rdt,Bc.tx-Bc.px)); Bc.px=Math.max(G.pw/2,Math.min(G.w-G.pw/2,Bc.px)); bcDrawPad();
    if(Bc.ph==='ready'){ bcPark(); }
    else { Bc.tleft[Bc.who]-=dt; bcClock(); if(Bc.tleft[Bc.who]<=0){ bcEndTurn('time'); return; }
      var n=Math.ceil(Math.hypot(Bc.vx,Bc.vy)*dt/(G.r*.8)); for(var i=0;i<n&&Bc.ph==='go';i++) bcStep(G,dt/n);
      bcDrawBall(); }
    if(Bc.ph==='go'||Bc.ph==='ready') bcraf=requestAnimationFrame(lp); })(); }
function bcStep(G,dt){ Bc.bx+=Bc.vx*dt; Bc.by+=Bc.vy*dt; var r=G.r;
  if(Bc.bx<r){ Bc.bx=r; Bc.vx=Math.abs(Bc.vx); bcTick(); } else if(Bc.bx>G.w-r){ Bc.bx=G.w-r; Bc.vx=-Math.abs(Bc.vx); bcTick(); }
  if(Bc.by<r){ Bc.by=r; Bc.vy=Math.abs(Bc.vy); bcTick(); }
  /* 벽돌 */
  for(var i=0;i<Bc.bricks.length;i++){ var b=Bc.bricks[i]; if(!b.on) continue;
    var nx=Math.max(b.x,Math.min(b.x+b.w,Bc.bx)), ny=Math.max(b.y,Math.min(b.y+b.h,Bc.by)), dx=Bc.bx-nx, dy=Bc.by-ny; if(dx*dx+dy*dy>r*r) continue;
    b.on=false; var el=$('bcb'+i); if(el) el.classList.add('hit');
    var ox=Math.min(Bc.bx+r-b.x,b.x+b.w-(Bc.bx-r)), oy=Math.min(Bc.by+r-b.y,b.y+b.h-(Bc.by-r));
    if(ox<oy){ Bc.vx=Bc.bx<b.x+b.w/2?-Math.abs(Bc.vx):Math.abs(Bc.vx); } else { Bc.vy=Bc.by<b.y+b.h/2?-Math.abs(Bc.vy):Math.abs(Bc.vy); }
    bcScore(); if(Bc.ph!=='go') return; break; }
  /* 받침대 */
  if(Bc.vy>0&&Bc.by+r>=G.py&&Bc.by-r<=G.py+G.ph&&Math.abs(Bc.bx-Bc.px)<=G.pw/2+r*.6){
    var o=Math.max(-1,Math.min(1,(Bc.bx-Bc.px)/(G.pw/2))), a=o*1.05, v=Math.min(G.h*.62*1.55,Math.hypot(Bc.vx,Bc.vy)*1.02);
    Bc.vx=v*Math.sin(a); Bc.vy=-v*Math.cos(a); if(Math.abs(Bc.vy)<v*.35){ Bc.vy=-v*.35; } Bc.by=G.py-r-.5;
    snd('putt',Bc.who===0||two()?.3:.16); var pd=$('bcpad'); pd.classList.remove('bump'); void pd.offsetWidth; pd.classList.add('bump'); bcPlan(); return; }
  if(Bc.by-r>G.h) bcLose(); }
function bcTick(){ snd('stone',Bc.who===0||two()?.12:.06); }
function bcScore(){ var p=Bc.who; Bc.sc[p]++; S.sc=[Bc.sc[0],Bc.sc[1]]; vs(p); snd('flip',Bc.who===0||two()?.35:.18);
  col(p===0?'l':'r',{pw:Bc.sc[p]/(BC.COLS*BC.ROWS),on:true});
  if(Bc.sc[p]>=BC.COLS*BC.ROWS){ Bc.clr[p]=true; bcEndTurn('clear'); } }
function bcLose(){ var g=S.gen, p=Bc.who; Bc.left[p]--; bcLife(); snd('thud',.45); Bc.ph='lost'; cancelAnimationFrame(bcraf);
  if(Bc.left[p]<=0){ bcEndTurn('out'); return; }
  fx('놓쳤다!',40); if(p===0||two()) $('say').innerHTML='<em>'+(two()?bcWho()+' ':'')+'놓쳤어요</em> · 공 '+Bc.left[p]+'개 남음';
  setTimeout(function(){ if(g===S.gen) bcReady(); },900); }
/* 사장님: 공이 받침대 쪽으로 내려오기 시작하면 떨어질 자리를 셈(옆 벽 튕김까지) · miss 비율로 엉뚱한 자리로 감 */
function bcPlan(){ if(Bc.who!==1||two()) return; Bc.aim=null; Bc.planned=false; }
function bcLand(G){ var x=Bc.bx, y=Bc.by, vx=Bc.vx, vy=Bc.vy; if(vy<=0) return null; var t=(G.py-G.r-y)/vy, X=x+vx*t, W=G.w-2*G.r, u=((X-G.r)%(2*W)+2*W)%(2*W); return G.r+(u<=W?u:2*W-u); }
function bcCpuMove(G,dt){ if(Bc.ph!=='go'){ Bc.tx=G.w/2; return; }
  if(Bc.vy>0&&!Bc.planned&&Bc.by>G.top+BC.ROWS*(G.bh+G.gap)){ Bc.planned=true; var L=bcLand(G); if(L==null) L=Bc.bx;
    if(Math.random()<Bc.miss) Bc.aim=L+(Math.random()<.5?-1:1)*(G.pw/2+G.r*2.5+Math.random()*G.pw*.4);
    else Bc.aim=L+(Math.random()*2-1)*G.pw*.32; }
  if(Bc.vy<0) Bc.planned=false;
  Bc.tx=Bc.aim==null?Bc.bx:Bc.aim; }
function bcDrawPad(){ var G=bcGeo(), e=$('bcpad'); if(!e) return; e.style.width=G.pw+'px'; e.style.height=G.ph+'px'; e.style.transform='translate('+(Bc.px-G.pw/2).toFixed(1)+'px,'+G.py.toFixed(1)+'px)'; }
function bcDrawBall(){ var G=bcGeo(), e=$('bcball'); if(!e) return; e.style.width=e.style.height=(G.r*2)+'px'; e.style.transform='translate('+(Bc.bx-G.r).toFixed(1)+'px,'+(Bc.by-G.r).toFixed(1)+'px)'; }
function bcEndTurn(why){ var g=S.gen, p=Bc.who; Bc.ph='end'; cancelAnimationFrame(bcraf); clearTimeout(Bc.auto); $('bcmsg').classList.remove('on'); NA.unpoint();
  if(why==='clear'){ fx('다 깼다!',44); snd('win'); } else if(why==='time'){ fx('1분 끝!',44); } else { fx('공이 없어요',34); }
  $('say').innerHTML='<b>'+(p===0?'내':esc(bcWho()))+' 차례 끝</b> · 벽돌 <b>'+Bc.sc[p]+'개</b>'+(why==='clear'?' · 다 깼어요!':'');
  setTimeout(function(){ if(g!==S.gen) return; if(p===0){ bcTurn(1); return; } bcResult(); },1500); }
function bcResult(){ var g=S.gen, a=Bc.sc[0]+(Bc.clr[0]?Math.round(Bc.tleft[0]):0), b=Bc.sc[1]+(Bc.clr[1]?Math.round(Bc.tleft[1]):0);
  if(a===b){ fx('비겼다!',44); $('say').innerHTML='<b>똑같이</b> 깼어요 · 한 번 더!'; setTimeout(function(){ if(g===S.gen) bcTurn(0); },1600); return; }
  var meWin=a>b, o=two()?'친구':nm(1), det='나 '+Bc.sc[0]+'개 · '+o+' '+Bc.sc[1]+'개'+(Bc.clr[0]||Bc.clr[1]?' (다 깨면 남은 초가 덤)':'');
  $('say').innerHTML=(meWin?'<b>내가 더 많이!</b>':'<em>'+esc(o)+' 더 많이</em>')+' · '+det;
  finish(meWin,Bc.sc[0],Bc.sc[1],det); }
window.addEventListener('resize',function(){ if($('bcwall')&&!S.over&&Bc.bricks){ var G=bcGeo(); Bc.bricks.forEach(function(b,i){ var r=Math.floor(i/BC.COLS), c=i%BC.COLS; b.x=G.side+c*(G.bw+G.gap); b.y=G.top+r*(G.bh+G.gap); b.w=G.bw; b.h=G.bh; var el=$('bcb'+i); if(el){ el.style.left=b.x+'px'; el.style.top=b.y+'px'; el.style.width=b.w+'px'; el.style.height=b.h+'px'; } }); bcDrawPad(); bcDrawBall(); } });
