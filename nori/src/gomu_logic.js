/* ───────── 고무줄놀이 (261125 시안 · 학교 놀이 순서 3번) ─────────
   줄 잡은 두 아이 사이에서 장단에 맞춰 뛰기. 위 박자 줄에서 네모가 흘러와 세로선에 닿을 때 「뛰기!」.
   한 단 = 여덟 박 · 다 맞히면 줄이 올라감(발목 → 무릎 → 허벅지 → 허리 → 가슴 → 머리) · 단이 오를수록 빨라지고 맞는 틈이 좁아짐.
   박을 놓치거나 엉뚱할 때 누르면 「걸렸다!」 → 차례 끝. 나 먼저 · 다음 사장님(친구) · 더 높이(같으면 더 많은 박) 넘은 쪽이 이김.
   노랫말은 넣지 않음(저작권) · 「하나 · 둘」 세기 표시와 「톡」 소리만. 사장님: BOSS.gomu 단마다 한 박 맞히는 비율(판마다 컨디션). */
var GM={NAMES:['발목','무릎','허벅지','허리','가슴','머리'], H:[.07,.20,.33,.47,.63,.84], BPM:[84,96,108,120,132,144], WIN:[150,140,128,116,104,94], BEATS:8, LEAD:2}, Gm={}, graf=0;
function gmGeo(){ var bd=$('board'), w=bd.clientWidth, h=bd.clientHeight, top=44, ly=top+18, gy=h-30, fh=Math.min(150,(gy-ly-30)); return {w:w,h:h,ly:ly,gy:gy,fh:fh,tx:Math.max(40,w*.16),x0:w*.14,x1:w*.86,xm:w*.5}; }
function gmFig(c,shirt){ return '<svg viewBox="-20 -6 40 92" aria-hidden="true"><path d="M-4 52L-6 84M4 52L6 84" stroke="#F0C79A" stroke-width="5" stroke-linecap="round"/><path d="M-6 84h-6M6 84h6" stroke="#3B3229" stroke-width="5" stroke-linecap="round"/><path d="M-11 50L0 22L11 50Z" fill="'+c+'"/><rect x="-7" y="14" width="14" height="16" rx="5" fill="'+shirt+'"/><path d="M-6 18l-8 12M6 18l8 12" stroke="#F0C79A" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="4" r="8" fill="#F6C99B"/><path d="M-8 0q8-10 16 0" fill="#3B3229"/></svg>'; }
function gmStart(){ Gm={gen:S.gen,who:0,ph:'wait',lv:[0,0],beat:[0,0],done:[false,false],notes:[],t0:0,cur:0,tip:0,
    cond:BOSS.cur||1.5};
  S.u='단'; S.sc=[0,0];
  var bd=$('board'); bd.classList.add('gomu');
  bd.innerHTML='<div class="gmlane" id="gmlane"><i class="gmt" id="gmt"></i></div><div class="gmcnt" id="gmcnt"></div><div id="gmtr"></div>'
    +'<div class="gmh l" id="gmL">'+gmFig('#8C7B5C','#FBF8F1')+'</div><div class="gmh r" id="gmR">'+gmFig('#8C7B5C','#FBF8F1')+'</div>'
    +'<div class="gmj" id="gmJ">'+gmFig('#2F64E0','#FBF8F1')+'</div><svg class="gmrope" id="gmrope"><path id="gmrp" fill="none" stroke="#E7B23B" stroke-width="3.5" stroke-linecap="round"/></svg>';
  $('act').innerHTML='<button type="button" class="big gmgo" id="gmGo" disabled>뛰기!</button>';
  $('gmGo').addEventListener('pointerdown',function(e){ e.preventDefault(); gmTap(); });
  gmLay(); vs(0); gmTurn(0); }
function gmLay(){ var G=gmGeo(), tr=$('gmtr'); if(!tr) return; var h='';
  tr.innerHTML=h+'<div class="gmgr" style="top:'+G.gy+'px"></div>';
  $('gmt').style.left=G.tx+'px';
  ['gmL','gmR','gmJ'].forEach(function(k,i){ var e=$(k); e.style.height=G.fh+'px'; e.style.width=(G.fh*40/92)+'px'; e.style.top=(G.gy-G.fh)+'px'; e.style.left=([G.x0,G.x1,G.xm][i]-G.fh*20/92)+'px'; });
  var r=$('gmrope'); r.setAttribute('width',G.w); r.setAttribute('height',G.h); gmRope(); }
function gmRope(sag){ var G=gmGeo(), lv=Math.min(5,Gm.lv[Gm.who]), y=G.gy-G.fh*GM.H[lv], s=sag||0;
  $('gmrp').setAttribute('d','M'+(G.x0+G.fh*.12)+' '+y+'Q'+G.xm+' '+(y+s)+' '+(G.x1-G.fh*.12)+' '+y); }
function gmWho(){ return Gm.who===0?'나':(two()?'친구':nm(1)); }
function gmTurn(p){ var g=S.gen; Gm.who=p; Gm.ph='wait'; $('gmGo').disabled=true; gmRope(); vs(p); $('gmJ').className='gmj'; [].forEach.call($('gmlane').querySelectorAll('.gmn'),function(n){ n.remove(); }); $('gmGo').classList.toggle('b',p===1);
  $('gmJ').innerHTML=gmFig(p===0?'#2F64E0':'#8C7B5C','#FBF8F1'); col(p===0?'l':'r',{pw:Gm.lv[p]/6});
  if(p===1&&two()){ $('say').innerHTML='<b>친구 차례</b> · 폰을 친구에게 넘겨 주세요';
    $('act').innerHTML='<div class="sbrow"><button type="button" class="big" id="gmRdy">친구 · 준비됐어요</button></div>';
    $('gmRdy').addEventListener('click',function(){ $('act').innerHTML='<button type="button" class="big gmgo b" id="gmGo" disabled>뛰기!<small>친구</small></button>'; $('gmGo').addEventListener('pointerdown',function(e){ e.preventDefault(); gmTap(); }); gmLevel(); }); return; }
  $('say').innerHTML= p===0 ? '<b>내 차례</b> · 네모가 세로선에 닿을 때 「뛰기!」' : '<em>'+esc(nm(1))+' 차례</em> · 지켜보세요';
  setTimeout(function(){ if(g===S.gen) gmLevel(); },p===0?700:1200); }
function gmLevel(){ var g=S.gen, p=Gm.who, lv=Gm.lv[p], beat=60000/GM.BPM[lv]; Gm.beat[p]=0; Gm.ph='go';
  var now=performance.now(), lane=$('gmlane'); [].forEach.call(lane.querySelectorAll('.gmn'),function(n){ n.remove(); });
  Gm.t0=now; Gm.notes=[]; for(var i=0;i<GM.BEATS;i++){ var el=document.createElement('i'); el.className='gmn'+(p===0?'':' b'); lane.appendChild(el); Gm.notes.push({t:now+(GM.LEAD+1+i)*beat,el:el,ok:false,gone:false}); }
  Gm.bt=beat; gmRope();
  $('say').innerHTML='<b>'+GM.NAMES[lv]+'</b> · '+(lv+1)+'단 · '+(p===0||two()?'네모가 세로선에 닿을 때 「뛰기!」':esc(nm(1))+' 뛰는 중');
  if(p===0||two()) $('gmGo').disabled=false;
  if(p===0&&Gm.tip<1){ Gm.tip++; NA.point($('gmGo'),'세로선에 닿을 때',.5,.4); }
  var cs=['하나','둘'];
  for(var c=0;c<GM.LEAD;c++)(function(c){ setTimeout(function(){ if(g!==S.gen||Gm.ph!=='go') return; var e=$('gmcnt'); e.textContent=cs[c]; e.classList.remove('on'); void e.offsetWidth; e.classList.add('on'); snd('stone',.25); },(c+1)*beat-60); })(c);
  if(p===1&&!two()) gmCpuPlan(g);
  cancelAnimationFrame(graf); (function lp(){ if(g!==S.gen||Gm.ph!=='go') return; var t=performance.now(), G=gmGeo(), sp=(G.w-G.tx)/(GM.LEAD+1)/beat;
    for(var i=0;i<Gm.notes.length;i++){ var n=Gm.notes[i]; if(n.gone) continue; var x=G.tx+(n.t-t)*sp; n.el.style.transform='translateX('+(x-8)+'px)';
      if(!n.ok&&t>n.t+GM.WIN[lv]){ gmFail(i); return; } }
    graf=requestAnimationFrame(lp); })(); }
/* 사장님: 박마다 BOSS.gomu[단] 비율로 맞힘 · 틀리면 그 박에서 걸림 */
function gmCpuPlan(g){ var lv=Gm.lv[1], P=(BOSS.gomu||[.99,.98,.96,.93,.89,.84])[lv]*(1+(Gm.cond-1.5)*.04);
  Gm.notes.forEach(function(n,i){ var ok=Math.random()<P; var dt=ok ? (Math.random()*2-1)*GM.WIN[lv]*.55 : GM.WIN[lv]*1.3;
    if(ok) setTimeout(function(){ if(g===S.gen&&Gm.ph==='go'&&Gm.who===1) gmHit(i); },Math.max(0,n.t+dt-performance.now())); }); }
function gmTap(){ if(S.over||Gm.ph!=='go') return; if(Gm.who===1&&!two()) return; NA.unpoint();
  var t=performance.now(), lv=Gm.lv[Gm.who], best=-1, bd=1e9;
  for(var i=0;i<Gm.notes.length;i++){ var n=Gm.notes[i]; if(n.ok||n.gone) continue; var d=Math.abs(t-n.t); if(d<bd){ bd=d; best=i; } break; }
  if(best<0) return;
  if(bd<=GM.WIN[lv]){ gmHit(best); return; }
  if(bd<Gm.bt*.5){ gmFail(best,true); } }
function gmHit(i){ var n=Gm.notes[i], p=Gm.who; n.ok=true; n.gone=true; n.el.classList.add('hit'); setTimeout(function(){ n.el.remove(); },200);
  Gm.beat[p]++; var j=$('gmJ'); j.classList.remove('hop'); void j.offsetWidth; j.classList.add('hop'); snd('putt',p===0||two()?.4:.22); gmRope(10); setTimeout(function(){ gmRope(); },160);
  S.sc=[Gm.lv[0],Gm.lv[1]]; vs(p); col(p===0?'l':'r',{pw:(Gm.lv[p]+Gm.beat[p]/GM.BEATS)/6});
  if(Gm.beat[p]>=GM.BEATS) gmClear(); }
function gmClear(){ var g=S.gen, p=Gm.who; Gm.ph='clr'; $('gmGo').disabled=true; cancelAnimationFrame(graf); Gm.lv[p]++; S.sc=[Gm.lv[0],Gm.lv[1]]; vs(p);
  if(Gm.lv[p]>=6){ fx('다 넘었다!',40); snd('win'); setTimeout(function(){ if(g===S.gen) gmEndTurn(); },1300); return; }
  fx(GM.NAMES[Gm.lv[p]]+'!',48); snd('flip',.5); setTimeout(function(){ if(g===S.gen){ gmRope(); gmLevel(); } },1100); }
function gmFail(i,early){ var g=S.gen, p=Gm.who; Gm.ph='fail'; cancelAnimationFrame(graf); $('gmGo').disabled=true;
  Gm.notes.forEach(function(n){ n.gone=true; n.el.classList.add('off'); });
  var j=$('gmJ'); j.classList.remove('trip'); void j.offsetWidth; j.classList.add('trip'); gmRope(-18); snd('thud',.5); fx('걸렸다!',48);
  if(p===0||two()) $('say').innerHTML='<em>'+(two()?gmWho()+' ':'')+'걸렸어요</em> · '+(early?'박보다 '+(i>=0?'먼저':'')+' 눌렀어요':'박을 놓쳤어요')+' · '+(Gm.lv[p]?GM.NAMES[Gm.lv[p]-1]+'까지 넘음':'아직 한 단도 못 넘음');
  else $('say').innerHTML='<b>'+esc(nm(1))+' 걸렸다!</b> · '+(Gm.lv[1]?GM.NAMES[Gm.lv[1]-1]+'까지':'한 단도 못 넘음');
  setTimeout(function(){ if(g===S.gen) gmEndTurn(); },1500); }
function gmEndTurn(){ var p=Gm.who; Gm.done[p]=true; var sc=function(q){ return Gm.lv[q]*GM.BEATS+(Gm.lv[q]<6?Gm.beat[q]:0); };
  if(p===0){ gmTurn(1); return; }
  var a=sc(0), b=sc(1), meWin=a>b||(a===b&&false);
  if(a===b){ fx('비겼다!',44); $('say').innerHTML='<b>똑같이</b> 넘었어요 · 한 번 더!'; var g=S.gen; Gm.lv=[0,0]; Gm.beat=[0,0]; setTimeout(function(){ if(g===S.gen) gmTurn(0); },1600); return; }
  var nmL=function(q){ return Gm.lv[q]?GM.NAMES[Gm.lv[q]-1]+'까지':'0단'; };
  $('say').innerHTML=(meWin?'<b>내가 더 높이!</b>':'<em>'+esc(two()?'친구':nm(1))+' 더 높이</em>')+' · 나 '+nmL(0)+' · '+esc(two()?'친구':nm(1))+' '+nmL(1);
  finish(meWin,Gm.lv[0],Gm.lv[1],'나 '+nmL(0)+'('+a+'박) · '+(two()?'친구':nm(1))+' '+nmL(1)+'('+b+'박)'); }
window.addEventListener('resize',function(){ if($('gmtr')&&!S.over) gmLay(); });
