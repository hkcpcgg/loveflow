/* ───────── 네 놀이 공통 틀: 차례 · 점수 · 끝내기 ───────── */
var $=function(id){return document.getElementById(id);};
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function shopName(){ try{ var v=JSON.parse(localStorage.getItem('nori-shop')||'null'); if(v&&v.s) return v.s; }catch(e){} return '다복'; }
function hoName(){ return '사장님'; }
var LVNAME={}, LVTAG={}, LVN={cpu0:0,cpu1:1,cpu2:2};
function opp(m){ return m==='two'?'친구':shopName()+' '+(LVNAME[m]||hoName()); }
var W=300, H=400, cv=$('cv'), ctx=cv.getContext('2d');
function fit(){ window.__nfx=0; fit0(); var ov=document.documentElement.scrollHeight-(window.innerHeight||700); if(ov>2){ window.__nfx=ov+16; fit0(); } }
/* 한 화면에 맞춤: 넘치면 넘친 만큼 판을 줄여 다시 (261122) */
function fit0(){ var cs=getComputedStyle(cv.parentNode), pw=(cv.parentNode.clientWidth||300)-parseFloat(cs.paddingLeft||0)-parseFloat(cs.paddingRight||0), top=cv.getBoundingClientRect().top+(window.scrollY||0), act=$('act'), ah=act?act.offsetHeight+10:0, avail=(window.innerHeight||700)-top-84-10-ah-(window.__nfx||0), ww=Math.max(220,Math.min(pw,avail*W/H)), d=Math.max(1,Math.min(3,window.devicePixelRatio||1));
  cv.style.width=ww+'px'; cv.style.height=(ww*H/W)+'px'; cv.width=Math.round(ww*d); cv.height=Math.round(ww*H/W*d); ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0); }
var S={g:null,mode:'cpu2',who:0,sc:[0,0],n:[0,0],max:5,over:true,busy:false,sud:false};
var COL=['#2457D6','#E1262D'];
function nm(p){ return p===0?'나':opp(S.mode); }
function tl(p){ return (p===0&&S.mode!=='two')?'내 차례':nm(p)+' 차례'; }
function cpuTurn(){ return S.who===1&&S.mode!=='two'; }
function vs(){ var h='';
  for(var p=0;p<2;p++){ h+='<div class="'+(p?'b':'a')+(p===S.who&&!S.over?' on':'')+'"><i></i><span>'+esc(nm(p))+'</span>'+(p===1&&LVTAG[S.mode]?'<span class="lv"><b>'+LVTAG[S.mode]+'</b></span>':'')+'<em>'+S.sc[p]+S.g.unit+' · '+Math.min(S.n[p],S.max)+'/'+S.max+'</em></div>'; }
  $('vs').innerHTML=h; if(window.noriSide){ noriSide(S.over?null:S.who, tl(S.who)); } }
function say(h){ $('say').innerHTML=h; }
function start(){ S.who=0; S.sc=[0,0]; S.n=[0,0]; S.over=false; S.busy=false; S.sud=false; S.max=S.g.max; $('done').classList.remove('on'); S.g.start(); vs(); turn(); }
function turn(){ vs(); S.g.ready&&S.g.ready();
  if(cpuTurn()){ say('<b style="color:#E1262D">'+esc(nm(1))+'</b> 차례 · '+(S.n[1]+1)+'번째'); S.busy=true; setTimeout(function(){ S.g.cpu(LVN[S.mode]||0); },900); }
  else { say('<b style="color:'+COL[S.who]+'">'+esc(tl(S.who))+'</b> · '+(S.n[S.who]+1)+'번째 · '+S.g.how); S.busy=false; } fire(); }
/* 한 번 끝났을 때: 점수 더하고 다음 사람 */
function report(pts,msg){ S.sc[S.who]+=pts; S.n[S.who]++; vs(); S.pop={t:performance.now(),pts:pts,p:S.who}; if(pts>0){ var em=document.querySelectorAll('#vs em')[S.who]; if(em){ em.classList.remove('up'); void em.offsetWidth; em.classList.add('up'); } } if(msg){ say(msg); } S.busy=true;
  setTimeout(function(){
    var need=S.max;
    if(S.g.seq){ if(S.who===0&&S.n[0]<need){ turn(); return; } if(S.who===0){ S.who=1; say('<b>'+esc(nm(1))+' 차례로 넘어가요</b>'); setTimeout(turn,900); return; } if(S.n[1]<need){ turn(); return; }
      if(S.sc[0]===S.sc[1]){ S.max++; S.who=0; say('<b>비겼으니 한 번씩 더!</b>'); setTimeout(turn,900); return; } finish(); return; }
    if(S.who===0){ S.who=1; turn(); return; }
    if(S.n[1]<need){ S.who=0; turn(); return; }
    if(S.sc[0]===S.sc[1]){ S.max++; S.who=0; say('<b>비겼으니 한 번씩 더!</b>'); setTimeout(turn,900); return; }
    finish(); },1100); }
function finish(){ S.over=true; vs(); var two=S.mode==='two', a=S.sc[0], b=S.sc[1], h, u=S.g.unit;
  noriResult({game:S.g.key,gname:S.g.name,opp:two?'친구':nm(1),lv:two?'':S.mode,win:!two&&a>b,detail:a+u+' 대 '+b+u,sc:[a,b],u:u,out:a===b?'draw':(a>b?'win':'lose')});
  if(two){ h=esc(a>b?nm(0):nm(1))+' <em>이겼어요!</em>'; SND.win(); }
  else if(a>b){ h='<em>'+a+u+'</em>로 이겼어요!'; SND.win(); } else { h='아이고, <em>'+a+u+'</em> 대 '+b+u; SND.lose(); }
  $('big').innerHTML=h; say(esc(nm(0))+' '+a+u+' · '+esc(nm(1))+' '+b+u); $('done').classList.add('on'); }
function banner(c,txt,col){ if(!S.over||!(S.n[0]+S.n[1])) return; txt='끝!'; col='#16181D'; c.fillStyle=col; c.beginPath(); if(c.roundRect){ c.roundRect(75,8,150,26,13); } else { c.rect(75,8,150,26); } c.fill(); c.fillStyle='#fff'; c.font='800 12.5px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(txt,150,21); c.textBaseline='alphabetic'; }
function meter(c,x,y,w,h,v,good){ c.fillStyle='rgba(22,24,29,.85)'; c.fillRect(x-2,y-2,w+4,h+4); if(good){ c.fillStyle='rgba(111,211,106,.45)'; c.fillRect(x+w*good[0],y,w*(good[1]-good[0]),h); }
  var g=c.createLinearGradient(x,0,x+w,0); g.addColorStop(0,'#6FD36A'); g.addColorStop(.6,'#FFC21A'); g.addColorStop(1,'#FF6A3D'); c.fillStyle=g; c.fillRect(x,y,w*v,h); c.fillStyle='#fff'; c.fillRect(x+w*v-1.5,y-4,3,h+8); }
/* 오른쪽 세로 배터리 — 아래에서 위로 참 · 알맞은 칸 초록 테두리 */
function vbat(c,v,good,lab){ if(window.NORI_A&&window.noriCol){ var sd=S.who?'r':'l'; noriCol(sd,{pw:v,good:good}); noriCol(sd==='r'?'l':'r',{pw:0,good:null}); return; } var x=W-30, y=78, w=20, h=H-130, n=12, gap=2, ch=(h-gap*(n-1))/n;
  c.fillStyle='rgba(22,24,29,.82)'; rr(c,x-4,y-22,w+8,h+30,8); c.fill(); c.fillStyle='#16181D'; c.fillRect(x+6,y-27,w-12,6);
  c.fillStyle='#fff'; c.font='800 10px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.fillText(lab||'힘',x+w/2,y-8);
  for(var i=0;i<n;i++){ var lo=i/n, cy=y+h-(i+1)*ch-i*gap, on=v>lo+.001, g=good&&lo+1/n>good[0]&&lo<good[1];
    c.fillStyle=on?(g?'#6FD36A':(lo<.5?'#FFC21A':'#FF6A3D')):'rgba(255,255,255,.12)'; c.fillRect(x,cy,w,ch);
    if(g){ c.strokeStyle='#6FD36A'; c.lineWidth=1.5; c.strokeRect(x-2,cy-1,w+4,ch+2); } } }
function rr(c,x,y,w,h,r){ c.beginPath(); if(c.roundRect){ c.roundRect(x,y,w,h,r); } else { c.rect(x,y,w,h); } }

/* ───────── 1. 딱지치기 — 힘 눈금이 초록 칸일 때 내리치면 뒤집힘 ───────── */
var RULE={
 ttak:['바닥에 놓인 <b>상대 딱지</b>를 내 딱지로 내리쳐 <b>뒤집으면</b> 그 딱지를 한 장 땁니다.','칠 자리를 <b>누른 채 아래로 당기면</b> 내 딱지가 들리고 오른쪽 <b>힘 배터리</b>가 찹니다. 놓으면 그 자리를 내리칩니다.','<b>모서리</b>(초록 점선 사이)를 치면 잘 넘어가고, 한가운데는 잘 안 넘어갑니다.','상대 딱지가 <b>얇은 · 보통 · 두꺼운</b> 딱지로 바뀝니다. 배터리의 <b>초록 칸</b>만큼 당기세요. 너무 세면 바람만 입니다.','다섯 번씩 쳐서 <b>많이 딴 사람</b>이 이깁니다.'],
 tuho:['멀리 있는 <b>항아리 입구</b>에 화살을 던져 넣습니다.','화면을 <b>누르고 있으면</b> 오른쪽 <b>힘 배터리</b>가 오르내립니다. 누른 채 <b>좌우로 밀면</b> 겨누는 곳이 움직입니다.','배터리가 <b>초록 칸</b>(알맞은 거리)에 올 때 손을 떼세요.','다섯 번씩 던져 <b>많이 넣은 사람</b>이 이깁니다. 같으면 한 번씩 더 던집니다.'],
 marble:['<b>내 구슬</b>(내 색 테두리)을 던져 <b>맞힐 구슬</b>에 닿으면 그 구슬을 땁니다. 한 알 = 1점.','화면을 <b>누르고 있으면</b> 오른쪽 <b>힘 배터리</b>가 오르내립니다. 누른 채 <b>좌우로 밀면</b> 던지는 방향이 바뀝니다.','오른쪽 <b>힘 배터리</b>가 <b>초록 칸</b>일 때 놓으면 알맞게 날아가 <b>통통 튀다</b> 멈춥니다. 약하면 짧고, 세면 넘어갑니다.','다섯 번씩 쳐서 <b>많이 딴 사람</b>이 이깁니다.'],
 dart:['빙글빙글 도는 판에 다트를 던져 <b>▼ 화살표 아래 칸</b>의 점수를 얻습니다.','아래에서 <b>판 빠르기</b>(느리게 · 보통 · 빠르게)를 고르세요.','원하는 칸이 ▼ 아래로 올 때 <b>던지기</b>를 누르세요. 화면을 톡 해도 됩니다.','<b>한 사람이 다섯 개를 다 던진 뒤</b> 상대가 던집니다. 점수 합이 높은 사람이 이깁니다.']
};
var TTAK={key:'tk',name:'딱지치기',unit:'장',max:5,how:'상대 딱지 <b>모서리를 누른 채 아래로 당겼다 놓기</b>',
  KIND:[['얇은 딱지',[.30,.52]],['보통 딱지',[.48,.70]],['두꺼운 딱지',[.64,.86]]],
  start:function(){ this.ph='idle'; this.anim=null; },
  ready:function(){ this.ph='idle'; this.anim=null; this.drag=null; this.kind=Math.floor(Math.random()*3); this.good=this.KIND[this.kind][1]; },
  /* 칠 자리 점수: 모서리 1 · 중간 .5 · 한가운데 .15 · 딱지 밖 0 */
  spotQ:function(x,y){ var ux=Math.abs(x-150)/54, uy=Math.abs(y-250)/48, u=Math.max(ux,uy); if(u>1.15) return 0; if(u>.62) return 1; if(u>.32) return .5; return .15; },
  hit:function(x,y,v,p){ var self=this, g=this.good, q=this.spotQ(x,y), inG=v>=g[0]&&v<=g[1], over=v>g[1]+.1, prob;
    /* 049 원칙 3: 운으로 갈리지 않게 — 모서리 + 초록 칸이면 반드시 넘어감 · 중간 자리는 초록 칸 한가운데 힘일 때만 · 한가운데 · 밖 · 초록 칸 밖은 안 넘어감 */
    var mid=(g[0]+g[1])/2, core=Math.abs(v-mid)<=(g[1]-g[0])/4, ok= inG && (q===1 || (q===.5 && core)); prob=ok?1:0; this.ph='anim'; this.anim={t:performance.now(),ok:ok,v:v,x:x,y:y}; SND.flip(.6);
    setTimeout(function(){ SND.slap(.4+v*.6); },330);
    var why=q===0?'딱지 밖을 쳤어요':(ok?'':(inG?(q<.5?'한가운데는 잘 안 넘어가요 · 모서리를 노려요':'아깝다! 조금 더 모서리로 · 또는 초록 칸 한가운데 힘으로'):(v<g[0]?'힘이 모자라요':'너무 세서 바람만 일었어요')));
    setTimeout(function(){ if(ok){ SND.glass(.6); } report(ok?1:0, ok?'<b>탁! 뒤집었다!</b> '+esc(nm(p))+' 한 장 땄어요':esc(nm(p))+' · '+why); },1050); },
  cpu:function(L){ var g=this.good, good=Math.random()<bossV([.4,.55,.72],L), v=good?g[0]+Math.random()*(g[1]-g[0]):(Math.random()<.5?g[0]-.08-Math.random()*.2:g[1]+.05+Math.random()*.15),
      edge=Math.random()<bossV([.4,.6,.8],L), sx=Math.random()<.5?-1:1, sy=Math.random()<.5?-1:1, x=150+(edge?sx*(38+Math.random()*16):(Math.random()*2-1)*18), y=250+(edge?sy*(32+Math.random()*14):(Math.random()*2-1)*14);
    var self=this; this.cpuAim={x:x,y:y,t:performance.now(),v:Math.max(0,Math.min(1,v))}; setTimeout(function(){ self.cpuAim=null; self.hit(x,y,Math.max(0,Math.min(1,v)),1); },900); },
  pull:function(){ return this.drag?Math.max(0,Math.min(1,(this.drag.cy-this.drag.y)/170)):0; },
  down:function(p){ if(this.ph!=='idle') return; this.drag={x:p.x,y:p.y,cy:p.y}; },
  move:function(p){ if(this.drag){ this.drag.cy=p.y; } },
  up:function(){ if(!this.drag) return; var d=this.drag, v=this.pull(); this.drag=null; if(v<.06){ say('상대 딱지 <b>모서리를 누른 채 아래로 당겼다</b> 놓으세요'); return; } this.hit(d.x,d.y,v,S.who); },
  draw:function(c){ var t=performance.now();
    c.fillStyle='#CDB48A'; c.fillRect(0,0,W,H); c.fillStyle='rgba(0,0,0,.06)'; for(var i=0;i<40;i++){ c.fillRect((i*73)%W,(i*131)%H,3,2); }
    banner(c,'','');
    var a=this.anim, k=a?Math.min(1,(t-a.t)/1000):0, flip=a&&a.ok&&k>.33?Math.min(1,(k-.33)/.4):0, jump=a&&k>.33&&k<.75?Math.sin((k-.33)/.42*Math.PI)*40:0;
    var thick=[2,4,7][this.kind||0];
    var bx=150, by=250-jump, sy=Math.cos(flip*Math.PI); c.save(); c.translate(bx,by); c.scale(1,Math.abs(sy)<.05?.05:Math.abs(sy));
    var under=S.who===0?1:0, face=sy>=0;
    c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(-52,-44+thick,108,96);
    c.fillStyle='#8A7350'; c.fillRect(-54,-48+thick,108,96);
    c.fillStyle=face?(under?'#F6C7C7':'#C9D8F6'):'#F1E6CC'; c.fillRect(-54,-48,108,96); c.strokeStyle=face?(under?'#E1262D':'#2457D6'):'#B9A57A'; c.lineWidth=2; c.strokeRect(-54,-48,108,96);
    c.lineWidth=1.4; c.beginPath(); c.moveTo(-54,-48); c.lineTo(0,-10); c.moveTo(54,-48); c.lineTo(10,0); c.moveTo(54,48); c.lineTo(0,10); c.moveTo(-54,48); c.lineTo(-10,0); c.stroke(); c.restore();
    if(this.ph==='idle'&&!S.over){ c.fillStyle='rgba(22,24,29,.78)'; rr(c,96,170,108,22,11); c.fill(); c.fillStyle='#fff'; c.font='800 12px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('상대: '+this.KIND[this.kind||0][0],150,181); c.textBaseline='alphabetic';
      /* 모서리가 잘 넘어가는 자리 */
      c.strokeStyle='rgba(111,211,106,.9)'; c.lineWidth=2; c.setLineDash([5,4]); c.strokeRect(150-54*1.05,250-48*1.05,108*1.05,96*1.05); c.strokeRect(150-54*.62,250-48*.62,108*.62,96*.62); c.setLineDash([]); }
    /* 겨누는 중(나 · 상대) */
    var D=this.drag||(this.cpuAim?{x:this.cpuAim.x,y:this.cpuAim.y,cy:this.cpuAim.y+this.cpuAim.v*170*Math.min(1,(t-this.cpuAim.t)/700)}:null);
    if(D&&this.ph==='idle'){ var v=Math.max(0,Math.min(1,(D.cy-D.y)/170)), lift=30+v*120;
      c.strokeStyle=COL[S.who]; c.lineWidth=2; c.beginPath(); c.arc(D.x,D.y,10,0,6.3); c.moveTo(D.x-15,D.y); c.lineTo(D.x+15,D.y); c.moveTo(D.x,D.y-15); c.lineTo(D.x,D.y+15); c.stroke();
      c.save(); c.translate(D.x,D.y-lift); c.rotate(-.15); c.fillStyle='rgba(0,0,0,.18)'; c.fillRect(-36,lift-30,72,62); c.fillStyle=S.who?'#F6C7C7':'#C9D8F6'; c.fillRect(-40,-36,80,72); c.strokeStyle=COL[S.who]; c.lineWidth=2; c.strokeRect(-40,-36,80,72); c.restore();
      vbat(c,v,this.good,'힘'); }
    /* 내리치는 딱지 */
    if(a&&k<.5){ var tx=a.x, ty=a.y, y=ty-260+(k/.33)*260; if(k>.33){ y=ty-20+(k-.33)*60; } c.save(); c.translate(tx+(k>.33?(k-.33)*-200:0), Math.min(y,ty-20)); c.rotate(-.2);
      c.fillStyle=S.who?'#F6C7C7':'#C9D8F6'; c.fillRect(-40,-36,80,72); c.strokeStyle=COL[S.who]; c.lineWidth=2; c.strokeRect(-40,-36,80,72); c.restore(); }
    if(a&&k>.3&&k<.5){ c.strokeStyle='#16181D'; c.lineWidth=2; c.lineCap='round'; [[-80,0],[80,0],[-70,-30],[70,-30]].forEach(function(d){ c.beginPath(); c.moveTo(a.x+d[0]*.8,a.y+d[1]*.8); c.lineTo(a.x+d[0],a.y+d[1]); c.stroke(); }); c.lineCap='butt'; }
    if(this.ph==='idle'&&!S.over&&!cpuTurn()&&!this.drag){ vbat(c,0,this.good,'힘'); c.fillStyle='#16181D'; c.font='800 12px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.fillText('초록 점선 사이(모서리)를 누른 채 아래로 당겼다 놓기',140,H-14); }
  }};

/* ───────── 2. 투호 — 누르고 있으면 힘이 오르내림, 손가락으로 좌우 겨누고 놓으면 던짐 ───────── */
var TUHO={key:'th',name:'투호',unit:'개',max:5,how:'<b>누르고 있으면</b> 힘이 오르내려요 · 좌우로 밀어 겨누고 · 알맞을 때 <b>놓기</b>',
  start:function(){ this.ph='idle'; this.fly=null; },
  ready:function(){ this.ph='idle'; this.aim=0; this.dist=.45+Math.random()*.35; this.hold=false; },
  jar:function(){ return {x:150, y:150-this.dist*60, s:1.15-this.dist*.5}; },
  pw:function(){ var k=((performance.now()-this.h0)/1100)%2; return k<1?k:2-k; },
  throwIt:function(aim,pw,p){ var j=this.jar(), self=this; SND.flick(.6); this.ph='fly'; this.fly={t:performance.now(),aim:aim,pw:pw,p:p};
    setTimeout(function(){ var dErr=Math.abs(pw-self.dist), xErr=Math.abs(aim); var ok=dErr<.08&&xErr<9; if(ok){ SND.pong(); } else { SND.thud(.4); }
      self.fly.res=ok; report(ok?1:0, ok?'<b>퐁! 들어갔어요</b> · '+esc(nm(p)):esc(nm(p))+' · '+(pw<self.dist-.08?'짧아요':(pw>self.dist+.08?'길어요':(aim<0?'왼쪽으로 빗나감':'오른쪽으로 빗나감')))); },900); },
  cpu:function(L){ var good=Math.random()<bossV([.22,.38,.55],L), ax, pw;
    if(good){ ax=(Math.random()*2-1)*6; pw=this.dist+(Math.random()*2-1)*.05; }
    else if(Math.random()<.5){ ax=(Math.random()<.5?-1:1)*(10+Math.random()*12); pw=this.dist+(Math.random()*2-1)*.06; }
    else { ax=(Math.random()*2-1)*6; pw=this.dist+(Math.random()<.5?-1:1)*(.1+Math.random()*.12); }
    this.throwIt(ax, pw, 1); },
  down:function(p){ if(this.ph!=='idle') return; this.hold=true; this.h0=performance.now(); this.bx=p.x; this.ba=this.aim; },
  move:function(p){ if(!this.hold) return; this.aim=Math.max(-40,Math.min(40,this.ba+(p.x-this.bx)*.3)); },
  up:function(){ if(!this.hold) return; this.hold=false; this.throwIt(this.aim,this.pw(),S.who); },
  draw:function(c){ var t=performance.now(), j=this.jar();
    var g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#F4E7C7'); g.addColorStop(.45,'#E8D4A6'); g.addColorStop(1,'#C9A86A'); c.fillStyle=g; c.fillRect(0,0,W,H);
    c.fillStyle='rgba(122,84,40,.15)'; for(var i=0;i<8;i++){ c.fillRect(0,110+i*36,W,2); }
    banner(c, S.over?'끝!':(nm(S.who)+(cpuTurn()?' 던집니다':' 차례')), S.who?'#E1262D':'#2457D6');
    /* 항아리 */
    c.save(); c.translate(j.x,j.y); c.scale(j.s,j.s);
    c.fillStyle='rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(0,40,26,6,0,0,6.3); c.fill();
    var bg=c.createLinearGradient(-24,0,24,0); bg.addColorStop(0,'#7A4E14'); bg.addColorStop(.35,'#E2B04A'); bg.addColorStop(.6,'#C08A2C'); bg.addColorStop(1,'#6B430F');
    c.fillStyle=bg; c.beginPath(); c.moveTo(-8,-34); c.lineTo(8,-34); c.lineTo(8,-14); c.bezierCurveTo(26,-8,30,18,22,32); c.quadraticCurveTo(0,44,-22,32); c.bezierCurveTo(-30,18,-26,-8,-8,-14); c.closePath(); c.fill(); c.strokeStyle='#3B2410'; c.lineWidth=1.4; c.stroke();
    c.fillStyle='#3B2410'; c.beginPath(); c.ellipse(0,-34,9,3,0,0,6.3); c.fill(); c.fillStyle=bg; c.fillRect(-18,-22,5,12); c.fillRect(13,-22,5,12); c.restore();
    /* 꽂힌 · 날아가는 화살 */
    var f=this.fly; if(f){ var k=Math.min(1,(t-f.t)/900), sx=150, sy=H-30, ex=j.x+f.aim*j.s, ey=j.y-34*j.s+(f.pw-this.dist)*-260;
      var x=sx+(ex-sx)*k, y=sy+(ey-sy)*k - Math.sin(k*Math.PI)*120, sc=1-.55*k; if(k>=1&&f.res){ y=j.y-40*j.s; x=j.x+f.aim*.3*j.s; }
      c.save(); c.translate(x,y); c.rotate(k<1?(-.9+k*1.6):.15); c.strokeStyle='#5A3A14'; c.lineWidth=2*sc+.4; c.beginPath(); c.moveTo(0,0); c.lineTo(0,46*sc); c.stroke(); c.fillStyle=COL[f.p]; c.fillRect(-3*sc,36*sc,6*sc,10*sc); c.restore(); }
    if(this.ph==='idle'&&!S.over&&!cpuTurn()){
      var ax=j.x+this.aim*j.s; c.strokeStyle='rgba(22,24,29,.5)'; c.setLineDash([4,4]); c.lineWidth=1.5; c.beginPath(); c.moveTo(150,H-40); c.quadraticCurveTo((150+ax)/2,j.y-80,ax,j.y-36*j.s); c.stroke(); c.setLineDash([]);
      c.fillStyle='#16181D'; c.font='800 12px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.fillText(this.hold?'배터리가 초록 칸일 때 놓으세요':'누르고 있으면 힘 · 좌우로 밀어 겨누기',140,H-60);
      vbat(c,this.hold?this.pw():0,[this.dist-.08,this.dist+.08],'힘');
      c.fillStyle='#5A3A14'; c.fillRect(148,H-40,4,30); }
  }};

/* ───────── 3. 구슬치기 — 힘을 모아 던지면 날아가 통통 튀고 멈춤 · 맞힐 구슬에 닿으면 땀 ───────── */
var MARB={key:'mb',name:'구슬치기',unit:'알',max:5,how:'<b>누르고 있으면 힘</b> · 좌우로 밀어 겨누고 <b>놓으면 던져요</b>',
  O:{x:150,y:H-34},
  start:function(){ this.ph='idle'; },
  ready:function(){ this.ph='idle'; this.hold=false; this.aim=0; this.fly=null; this.knock=null;
    this.tg={x:70+Math.random()*160,y:95+Math.random()*95}; var d=Math.hypot(this.tg.x-this.O.x,this.tg.y-this.O.y); this.need=Math.max(.05,Math.min(.95,(d-40)/300)); this.base=Math.atan2(this.tg.y-this.O.y,this.tg.x-this.O.x); },
  pw:function(){ var k=((performance.now()-this.h0)/1000)%2; return k<1?k:2-k; },
  /* 던진 길: 첫 착지 70% · 두 번 튀고(20% · 7%) · 조금 구름(3%) */
  path:function(ang,v){ var L=40+v*300, pts=[], seg=[[0,.70,60],[.70,.90,18],[.90,.97,6],[.97,1,0]], T=0;
    seg.forEach(function(g,i){ var n=i===3?10:22; for(var j=0;j<=n;j++){ var u=j/n, s=(g[0]+(g[1]-g[0])*(i===3?1-(1-u)*(1-u):u))*L, h=Math.sin(u*Math.PI)*g[2]; pts.push({s:s,h:h}); } });
    var O=this.O; return pts.map(function(p){ return {x:O.x+Math.cos(ang)*p.s, y:O.y+Math.sin(ang)*p.s, h:p.h}; }); },
  throwIt:function(ang,v,p){ var self=this, path=this.path(ang,v), hit=-1; this.ph='fly'; SND.flick(.6);
    for(var i=0;i<path.length;i++){ if(path[i].h<9&&Math.hypot(path[i].x-this.tg.x,path[i].y-this.tg.y)<20){ hit=i; break; } }
    if(hit>=0){ path=path.slice(0,hit+1); }
    this.fly={path:path,t:performance.now(),p:p,hit:hit>=0,dur:path.length*22};
    var bounces=[22,45,68].filter(function(k){ return k<path.length; });
    bounces.forEach(function(k,i){ setTimeout(function(){ SND.stone(.5-i*.15); },k*22); });
    setTimeout(function(){ var ok=hit>=0; if(ok){ SND.glass(); var e=path[path.length-1]; self.knock={t:performance.now(),dx:(self.tg.x-e.x)||1,dy:(self.tg.y-e.y)||-1}; }
      var end=path[path.length-1], dd=Math.hypot(end.x-self.O.x,end.y-self.O.y), td=Math.hypot(self.tg.x-self.O.x,self.tg.y-self.O.y);
      self.ph='done'; report(ok?1:0, ok?'<b>딱! 맞혔다</b> · '+esc(nm(p))+' 한 알 땄어요':esc(nm(p))+' · '+(dd<td-22?'짧았어요':(dd>td+22?'멀리 갔어요':'옆으로 빗나갔어요'))); },path.length*22+120); },
  cpu:function(L){ var good=Math.random()<bossV([.25,.4,.58],L), da=good?(Math.random()*2-1)*.025:(Math.random()<.5?-1:1)*(.07+Math.random()*.1), v=this.need+(good?(Math.random()*2-1)*.03:(Math.random()*2-1)*.18);
    var self=this; this.aimC=this.base+da; setTimeout(function(){ self.aimC=null; self.throwIt(self.base+da,Math.max(0,Math.min(1,v)),1); },700); },
  down:function(p){ if(this.ph!=='idle') return; this.hold=true; this.h0=performance.now(); this.bx=p.x; this.ba=this.aim; },
  move:function(p){ if(!this.hold) return; this.aim=Math.max(-.6,Math.min(.6,this.ba+(p.x-this.bx)*.006)); },
  up:function(){ if(!this.hold) return; this.hold=false; this.throwIt(this.base+this.aim,this.pw(),S.who); },
  tag:function(c,x,y,t,col){ c.font='800 11px "Noto Sans KR",sans-serif'; var w=c.measureText(t).width+12; x=Math.max(w/2+2,Math.min(W-w/2-2,x)); c.fillStyle=col; rr(c,x-w/2,y-9,w,18,9); c.fill(); c.fillStyle='#fff'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(t,x,y); c.textBaseline='alphabetic'; },
  ball:function(c,x,y,h,col,col2){ var r=11*(1+h/90); c.fillStyle='rgba(0,0,0,'+(.25-h/400)+')'; c.beginPath(); c.ellipse(x+2,y+3,11,8,0,0,6.3); c.fill(); y-=h;
    c.save(); c.beginPath(); c.arc(x,y,r,0,6.3); c.clip(); c.fillStyle='rgba(220,240,245,.75)'; c.fillRect(x-r,y-r,2*r,2*r);
    c.fillStyle=col; c.beginPath(); c.moveTo(x,y); c.bezierCurveTo(x-r*.55,y-r*.8,x-r*.9,y-r*.55,x-r*.8,y-r*.2); c.closePath(); c.fill(); c.fillStyle=col2; c.beginPath(); c.moveTo(x,y); c.bezierCurveTo(x+r*.6,y+r*.55,x+r*.35,y+r*.9,x,y+r*.8); c.closePath(); c.fill(); c.restore();
    c.strokeStyle='rgba(78,151,168,.9)'; c.lineWidth=1; c.beginPath(); c.arc(x,y,r,0,6.3); c.stroke(); c.fillStyle='rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(x-r*.35,y-r*.45,r*.3,r*.18,-.6,0,6.3); c.fill(); },
  draw:function(c){ var t=performance.now(); c.fillStyle='#D8C29A'; c.fillRect(0,0,W,H); c.fillStyle='rgba(0,0,0,.05)'; for(var i=0;i<60;i++){ c.beginPath(); c.arc((i*53)%W,(i*97)%H+40,1.5,0,6.3); c.fill(); }
    banner(c,'',''); if(!this.tg) return;
    var me=S.who, O=this.O, mc=COL[me], tc=me?'#2457D6':'#E1262D';
    /* 던지는 금 */
    c.strokeStyle='rgba(90,58,20,.55)'; c.lineWidth=2; c.setLineDash([6,5]); c.beginPath(); c.moveTo(20,O.y+16); c.lineTo(W-20,O.y+16); c.stroke(); c.setLineDash([]);
    /* 맞힐 구슬 */
    var tx=this.tg.x, ty=this.tg.y; if(this.knock){ var k=Math.min(1,(t-this.knock.t)/600), L=Math.hypot(this.knock.dx,this.knock.dy); tx+=this.knock.dx/L*40*k; ty+=this.knock.dy/L*40*k; }
    c.setLineDash([3,3]); c.strokeStyle='rgba(22,24,29,.5)'; c.lineWidth=1.5; c.beginPath(); c.arc(this.tg.x,this.tg.y,20,0,6.3); c.stroke(); c.setLineDash([]);
    this.ball(c,tx,ty,0,tc,'#FFC21A'); if(this.ph==='idle') this.tag(c,this.tg.x,this.tg.y-30,'맞히면 1알!','#16181D');
    /* 겨누는 선 */
    var showAim=this.ph==='idle'&&!S.over&&(this.hold||cpuTurn()||true), ang=this.aimC!=null?this.aimC:this.base+this.aim;
    if(this.ph==='idle'&&!S.over){ var v=this.hold?this.pw():(cpuTurn()?this.need:0), Ls=40+v*300; c.strokeStyle='rgba(22,24,29,.45)'; c.setLineDash([4,5]); c.lineWidth=2; c.beginPath(); c.moveTo(O.x,O.y); c.lineTo(O.x+Math.cos(ang)*Math.max(70,Ls),O.y+Math.sin(ang)*Math.max(70,Ls)); c.stroke(); c.setLineDash([]);
      if(this.hold){ var ex=O.x+Math.cos(ang)*Ls*.7, ey=O.y+Math.sin(ang)*Ls*.7; c.strokeStyle=mc; c.lineWidth=2; c.beginPath(); c.arc(ex,ey,7,0,6.3); c.stroke(); } }
    /* 내 구슬 */
    var f=this.fly; if(f){ var i2=Math.min(f.path.length-1,Math.floor((t-f.t)/22)), q=f.path[i2]; this.ball(c,q.x,q.y,q.h,mc,'#6FD36A'); }
    else if(this.ph==='idle'){ this.ball(c,O.x,O.y,0,mc,'#6FD36A'); c.strokeStyle=mc; c.lineWidth=3; c.beginPath(); c.arc(O.x,O.y,15,0,6.3); c.stroke();
      this.tag(c,O.x+48,O.y,(me===0&&S.mode!=='two')?'내 구슬':nm(me)+' 구슬',mc); }
    if(this.ph==='idle'&&!S.over&&!cpuTurn()){ vbat(c,this.hold?this.pw():0,[this.need-.05,this.need+.05],'힘');
      c.fillStyle='#16181D'; c.font='800 12px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.fillText(this.hold?'배터리가 초록 칸일 때 놓으세요 · 좌우로 밀면 방향':'화면을 누르고 있으면 오른쪽 배터리가 차요',140,H-6); } }};

/* ───────── 4. 원판 다트 — 돌아가는 판, 화살표 아래 칸 점수 ───────── */
var DART={key:'dt',name:'원판 다트',unit:'점',max:5,seq:true,how:'원하는 칸이 <b>▼ 아래</b>로 올 때 <b>던지기</b>',
  SPD:[1.3,2.4,3.7], lv:1,
  SEC:[100,10,30,10,50,10,20,10],
  start:function(){ this.ang=0; this.darts=[]; this.log=[[],[]]; this.lw=-1; },
  ready:function(){ this.ph='idle'; this.speed=this.SPD[this.lv]; if(this.lw!==S.who){ this.darts=[]; this.lw=S.who; } this.fly=null; },
  sectorAt:function(a){ var n=this.SEC.length, st=Math.PI*2/n, r=((-Math.PI/2-a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2); return Math.floor(r/st)%n; },
  throwIt:function(p){ var self=this; this.ph='fly'; SND.flick(.6); this.fly={t:performance.now(),p:p};
    setTimeout(function(){ var a=self.ang, i=self.sectorAt(a), pts=self.SEC[i]; SND.dart(); self.darts.push({rel:-Math.PI/2-a+(Math.random()*2-1)*.12,p:p}); self.log[p].push(pts); self.fly=null; self.ph='stuck';
      report(pts,'<b>'+pts+'점!</b> '+esc(nm(p))+(pts===100?' · 한가운데 대박!':'')); },350); },
  cpu:function(L){ var self=this, n=this.SEC.length, st=Math.PI*2/n, tries=0;
    (function wait(){ var a=self.ang+self.speed*.35*(1/1)*0, ahead=self.ang+self.speed*0.35; var i=self.sectorAt(ahead), want=Math.random()<bossV([.2,.35,.55],L); tries++;
      if((want&&self.SEC[i]>=50)||(!want&&Math.random()<.04)||tries>140){ self.throwIt(1); } else { setTimeout(wait,30); } })(); },
  down:function(){ if(this.ph!=='idle') return; this.throwIt(S.who); },
  draw:function(c){ var t=performance.now(); if(this.lt){ var dt=(t-this.lt)/1000; this.ang+=this.speed*dt*(this.ph==='stuck'?.3:1); } this.lt=t;
    var g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#F7EFD8'); g.addColorStop(1,'#E9DDBA'); c.fillStyle=g; c.fillRect(0,0,W,H);
    banner(c, S.over?'끝!':(nm(S.who)+(cpuTurn()?' 던집니다':' 차례')), S.who?'#E1262D':'#2457D6');
    var cx=150, cy=200, R=110, n=this.SEC.length, st=Math.PI*2/n, cols=['#E1262D','#FFF3D2','#2457D6','#FFF3D2','#FFC21A','#FFF3D2','#FF7A1A','#FFF3D2'];
    c.strokeStyle='#7A4E25'; c.lineWidth=8; c.beginPath(); c.moveTo(cx-40,cy+R); c.lineTo(cx-60,H-20); c.moveTo(cx+40,cy+R); c.lineTo(cx+60,H-20); c.stroke();
    c.fillStyle='#8B5A2B'; c.beginPath(); c.arc(cx,cy,R+10,0,6.3); c.fill();
    c.save(); c.translate(cx,cy); c.rotate(this.ang);
    for(var i=0;i<n;i++){ c.fillStyle=cols[i]; c.beginPath(); c.moveTo(0,0); c.arc(0,0,R,i*st,(i+1)*st); c.closePath(); c.fill(); c.strokeStyle='#2A1A0C'; c.lineWidth=1.2; c.stroke();
      c.save(); c.rotate(i*st+st/2); c.fillStyle=(i%2)?'#16181D':'#fff'; c.font='900 15px "Black Han Sans",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(String(this.SEC[i]),R*.68,0); c.restore(); }
    this.darts.forEach(function(d){ var a=d.rel, x=Math.cos(a)*R*.86, y=Math.sin(a)*R*.86; c.fillStyle=COL[d.p]; c.beginPath(); c.arc(x,y,4,0,6.3); c.fill(); c.strokeStyle='#fff'; c.lineWidth=1.5; c.stroke(); });
    c.restore();
    c.fillStyle='#16181D'; c.beginPath(); c.arc(cx,cy,10,0,6.3); c.fill();
    c.fillStyle='#fff'; c.strokeStyle='#16181D'; c.lineWidth=2; c.beginPath(); c.moveTo(cx-11,cy-R-18); c.lineTo(cx+11,cy-R-18); c.lineTo(cx,cy-R+2); c.closePath(); c.fill(); c.stroke();
    if(this.fly){ var k=Math.min(1,(t-this.fly.t)/350), x=150, y=H-30+(cy-R*.86-(H-30))*k; c.strokeStyle='#16181D'; c.lineWidth=2.5; c.beginPath(); c.moveTo(x,y); c.lineTo(x,y+26); c.stroke(); c.fillStyle=COL[this.fly.p]; c.beginPath(); c.moveTo(x,y+18); c.lineTo(x-6,y+30); c.lineTo(x+6,y+30); c.fill(); }
    /* 이번 사람 던진 기록 */
    var lg=(this.log&&this.log[S.who])||[], bx0=150-(S.max*44)/2; c.font='800 11px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.textBaseline='middle';
    for(var q=0;q<S.max;q++){ var on=q<lg.length; c.fillStyle=on?COL[S.who]:'rgba(22,24,29,.1)'; rr(c,bx0+q*44+2,10,40,22,11); c.fill(); c.fillStyle=on?'#fff':'#8A7A50'; c.fillText(on?(q+1)+'투 '+lg[q]:(q+1)+'투',bx0+q*44+22,21); }
    c.textBaseline='alphabetic';
    if(this.ph==='idle'&&!S.over&&!cpuTurn()){ c.fillStyle='#16181D'; c.font='800 12px "Noto Sans KR",sans-serif'; c.textAlign='center'; c.fillText('원하는 칸이 ▼ 아래로 올 때 「던지기」',150,H-8); } }};

/* ───────── 놀이 고르기 · 그리기 · 손가락 ───────── */
var GAMES={ttak:TTAK,tuho:TUHO,marble:MARB,dart:DART}, KEY2={tk:'ttak',th:'tuho',mb:'marble',dt:'dart'}, CUR='ttak', picked={};
function setGame(k){ CUR=k; S.g=GAMES[k]; document.querySelector('.top .ttl').textContent=S.g.name; document.title=S.g.name; S.over=true; S.g.start(); S.g.ready&&S.g.ready(); vs(); say(S.g.how); $('done').classList.remove('on'); actBar(); fit(); if(!picked[k]){ $('pickRule').innerHTML='<ol>'+(RULE[k]||[]).map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; $('pick').classList.add('on'); } }
function pt(e){ var r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*W, y:(e.clientY-r.top)/r.height*H}; }
cv.addEventListener('pointerdown',function(e){ if(S.over||S.busy||cpuTurn()) return; e.preventDefault(); try{ cv.setPointerCapture(e.pointerId); }catch(x){} S.g.down&&S.g.down(pt(e)); });
cv.addEventListener('pointermove',function(e){ S.g&&S.g.move&&S.g.move(pt(e)); });
cv.addEventListener('pointerup',function(e){ if(S.g&&S.g.up){ var was=S.busy; S.g.up(pt(e)); } });
function popup(c){ var p=S.pop; if(!p) return; var k=(performance.now()-p.t)/1300; if(k>1){ S.pop=null; return; }
  var y=200-k*70, a=k<.7?1:1-(k-.7)/.3, txt=p.pts>0?'+'+p.pts+S.g.unit:'놓쳤어요', col=p.pts>0?COL[p.p]:'#6B6B6B';
  c.save(); c.globalAlpha=a; c.font=(p.pts>0?'900 44px':'800 26px')+' "Black Han Sans","Noto Sans KR",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.lineWidth=7; c.strokeStyle='#fff'; c.strokeText(txt,150,y); c.fillStyle=col; c.fillText(txt,150,y);
  if(p.pts>0){ c.font='800 13px "Noto Sans KR",sans-serif'; c.lineWidth=4; var s2=(p.p===0&&S.mode!=='two'?'내':nm(p.p))+' 점수에 더했어요 ↑'; c.strokeText(s2,150,y+34); c.fillStyle='#16181D'; c.fillText(s2,150,y+34); }
  c.restore(); }
(function loop(){ if(S.g){ ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0); S.g.draw(ctx); popup(ctx); } requestAnimationFrame(loop); })();
/* 아래 줄: 놀이 방법 · (다트) 판 빠르기 · 던지기 */
function fire(){ var f=$('fire'); if(!f) return; f.disabled=!(CUR==='dart'&&!S.over&&!S.busy&&!cpuTurn()&&DART.ph==='idle'); }
function help(){ var r=RULE[CUR]||[]; $('helpT').textContent=S.g.name+' · 놀이 방법'; $('helpB').innerHTML='<ol>'+r.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; $('help').classList.add('on'); }
function actBar(){ var d=CUR==='dart'; $('spd').style.display=d?'':'none'; $('fire').style.display=d?'':'none'; fire();
  var b=document.querySelectorAll('#spd button'); for(var i=0;i<b.length;i++){ b[i].setAttribute('aria-pressed',String(+b[i].getAttribute('data-s')===DART.lv)); } }
(function(){
  var bs=document.querySelectorAll('#pick button');
  for(var i=0;i<bs.length;i++){ bs[i].addEventListener('click',function(){ S.mode=this.getAttribute('data-v'); picked[CUR]=true; $('pick').classList.remove('on'); SND.stone(.6); fit(); start(); }); }
  var pn=document.querySelectorAll('.pn'); for(var q=0;q<pn.length;q++){ pn[q].textContent=opp(pn[q].getAttribute('data-k')); }
  $('again').addEventListener('click',function(){ start(); });
  $('fire').addEventListener('click',function(){ if(S.over||S.busy||cpuTurn()) return; DART.down(); fire(); });
  $('helpBtn').addEventListener('click',help); $('help').addEventListener('click',function(e){ if(e.target.id==='help'||e.target.closest('[data-x]')){ $('help').classList.remove('on'); } });
  var sb=document.querySelectorAll('#spd button'); for(var j=0;j<sb.length;j++){ sb[j].addEventListener('click',function(){ DART.lv=+this.getAttribute('data-s'); if(DART.ph!=='fly'){ DART.speed=DART.SPD[DART.lv]; } SND.stone(.4); actBar(); }); }
  setInterval(fire,250);
  noriNav({here:function(){ return S.g.key; }, local:{tk:function(){ setGame('ttak'); }, th:function(){ setGame('tuho'); }, mb:function(){ setGame('marble'); }, dt:function(){ setGame('dart'); }},
    onNew:function(){ $('done').classList.remove('on'); picked[CUR]=false; $('pickRule').innerHTML='<ol>'+(RULE[CUR]||[]).map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; $('pick').classList.add('on'); }});
  window.addEventListener('resize',fit);
})();
function solo(k){ if(GAMES[k]){ setGame(k); } }
setGame(GAMES[(location.hash||'').slice(1)]?(location.hash||'').slice(1):'ttak');
SND.button(document.querySelector('.top'));
