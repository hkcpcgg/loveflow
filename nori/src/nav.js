/* 그때 그 놀이 · 아래 막대(모든 놀이 공통) — 「놀이 방법」 「그때 그 놀이(홈, 가운데)」 「새 판」 (261122 v5)
   손님 입구 안에서 열렸으면 입구에게 알리고, 따로 열렸으면 그 놀이 주소로 옮김 */
/* ★ 사장님 세기 설정표 (049 원칙 · 261123) — 놀이마다 사장님 세기는 여기 한 곳에서만 고침.
   lv: 0 하수 · 1 중수 · 2 고수 — 손님 화면 사장님 = 「중상급」 1.5(중수와 고수 사이) · 판마다 컨디션 ±sway 로 조금씩 들쭉날쭉(손님은 모름).
   손님 승률 목표 약 45% · 운 놀이(가위바위보 · 홀짝 · 엿치기)는 50% 그대로. 승률 기록이 쌓이면 아래 숫자만 조금씩 맞춤. */
window.BOSS=window.BOSS||{lv:1.5, sway:.2,
  arm:[6,7],        /* 팔씨름: 사장님이 1초에 두드리는 횟수(최소 · 최대) */
  sab:.72,          /* 사방치기: 사장님이 던져 칸에 넣는 비율 */
  sugLap:1.8,       /* 수건돌리기: 술래 한 바퀴 초 */
  jegi:[9,16],      /* 제기차기: 사장님 연속 차기(최소 · 최대) */
  gong:.75,         /* 공기놀이: 사장님이 한 번 줍고 받기에 성공하는 비율(단계마다 조금씩 내려감) */
  mugung:{say:[1.0,3.0],cyc:5,need:30},  /* 무궁화꽃: 술래가 한 번 외는 초(최소 · 최대) · 외는 횟수 · 술래까지 걸음 */
  yut:{in:.9,smart:.85}  /* 윷놀이: 사장님이 초록 안에서 떼는 비율(나머지는 낙) · 말 고를 때 좋은 수를 두는 비율 */
  };
(function(){ function pick(){ BOSS.cur=Math.max(1,Math.min(2,BOSS.lv+(Math.random()*2-1)*BOSS.sway)); } pick(); BOSS.pick=pick;
  document.addEventListener('click',function(e){ var b=e.target&&e.target.closest&&e.target.closest('button[data-a=new]'); if(b) pick(); },true); })();
/* 세기 표(하수 · 중수 · 고수 세 값)에서 지금 사장님 값 고르기 — 중수(1) 자리는 그 판 컨디션(1~2)으로 사이 값을 씀 */
window.bossV=function(arr,L){ if(L!==1||!BOSS.cur) return arr[L]; var x=BOSS.cur, i=Math.min(arr.length-2,Math.floor(x)), f=x-i; return arr[i]+(arr[i+1]-arr[i])*f; };
/* 좌우 점수 기둥 (261122 v5) — 나·내 편 = 왼쪽 파랑, 사장님·친구 = 오른쪽 빨강. 위 점수줄(.vs)의 이름·점수를 옮겨 보이고 그 줄은 숨김. 차례인 쪽이 진하게 */
(function(){
  var d=document, st=null, W=null, LAB='', RN='';
  function opp(){ if(RN) return RN; if(window.__naTwo) return '친구'; var s=d.querySelector('.shopN'); return (s&&s.textContent.trim()?s.textContent.trim():'다복')+' 사장님'; }
  function init(){ if(st) return st;
    var css=d.createElement('style');
    css.textContent='.nside{position:fixed;top:10px;bottom:calc(66px + env(safe-area-inset-bottom,0px));width:32px;z-index:20;border-radius:12px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 0;pointer-events:none;font-family:"Noto Sans KR",system-ui,sans-serif;transition:background .2s,color .2s}'
     +'.nside.l{left:2px;background:#E4EBFB;color:#2457D6}.nside.r{right:2px;background:#FBE4E5;color:#E1262D}'
     +'.nside.l.on{background:#2457D6;color:#fff}.nside.r.on{background:#E1262D;color:#fff}'
     +'.nside .nm{writing-mode:vertical-rl;font-weight:800;font-size:11px;letter-spacing:.06em;max-height:34%;overflow:hidden;white-space:nowrap}'
     +'.nside .sc{font-weight:900;font-size:19px;line-height:1;font-variant-numeric:tabular-nums}.nside .sc:empty{display:none}'
     +'.nside .un{font-weight:800;font-size:11px;line-height:1;margin-top:-3px}.nside .ex{font-weight:800;font-size:11px;line-height:1;opacity:.85}'
     +'.nside .tn{margin-top:auto;writing-mode:vertical-rl;font-weight:900;font-size:12px;letter-spacing:.1em;opacity:0}.nside.on .tn{opacity:1}'
     +'body.nside-on{padding-left:38px!important;padding-right:38px!important}body.ncard-on .nside{display:none}'
     +'.act .spd>span{display:none!important}.act .spd button{white-space:nowrap}'
     +'.nside-hide{display:none!important}.vs.nside-mid{grid-template-columns:1fr!important}.vs.nside-mid .p{display:none!important}';
    if(window.NORI_A){ css.textContent+='.nside{bottom:auto;width:26px;border-radius:13px;padding:7px 0;gap:4px;overflow:hidden}'
      +'.nside.l{left:7px;background:#E6EDFC;color:#2F64E0}.nside.r{right:7px;background:#FCE8E8;color:#E04848}.nside.l.on{background:#2F64E0;color:#fff}.nside.r.on{background:#E04848;color:#fff}'
      +'.nside .nm{font-size:10.5px}.nside .sc{font-size:16px}.nside .un{font-size:10px;margin-top:-2px}.nside .ex{font-size:10px}'
      +'.nside .tn{margin-top:4px;font-size:10px;letter-spacing:.06em}.nside .bat{position:relative;margin-top:auto;width:10px;flex:0 0 40%;border-radius:6px;background:rgba(255,255,255,.8);overflow:hidden}'
      +'.nside .bat i{position:absolute;left:0;right:0;bottom:0;height:0;border-radius:4px;transition:height .06s linear}.nside.l .bat i{background:#2F64E0}.nside.r .bat i{background:#E04848}.nside.on .bat i{background:#FFC21A}'
      +'.nside.na-gone{visibility:hidden}.nside .bat .gz{position:absolute;left:0;right:0;background:rgba(46,158,79,.55);display:none;z-index:1;border-radius:3px}.nside .bat i{z-index:0}'; }
    d.head.appendChild(css);
    function col(c){ var e=d.createElement('div'); e.className='nside '+c; e.innerHTML='<span class="nm"></span><b class="sc"></b><span class="un"></span><span class="ex"></span><span class="tn"></span>'+(window.NORI_A?'<div class="bat"><b class="gz"></b><i></i></div>':''); d.body.appendChild(e); return e; }
    st={l:col('l'),r:col('r')}; d.body.classList.add('nside-on');
    if(window.NORI_A){ setInterval(align,400); }
    var mo=new MutationObserver(function(){ paint(); });
    [].slice.call(d.querySelectorAll('.vs,#aC1,#aC2,#cnt')).forEach(function(v){ mo.observe(v,{childList:true,subtree:true,characterData:true}); });
    window.addEventListener('resize',paint); window.addEventListener('resize',align);
    return st; }
  /* A: 기둥은 놀이판 높이만큼만 · 놀이판 양옆에 붙임 (모든 놀이 같은 너비) */
  function board(){ var L=[].slice.call(d.querySelectorAll('.na-penl .na-pens')).concat([].slice.call(d.querySelectorAll(window.NORI_BOARD||'.board'))); for(var i=0;i<L.length;i++){ var rr=L[i].getBoundingClientRect(); if(rr.height>20&&rr.width>20) return L[i]; } return null; }
  function align(){ if(!st||!window.NORI_A) return; var b=board(), r=b&&b.getBoundingClientRect();
    if(!r||!r.height){ st.l.classList.add('na-gone'); st.r.classList.add('na-gone'); return; } st.l.classList.remove('na-gone'); st.r.classList.remove('na-gone');
    [st.l,st.r].forEach(function(c){ c.style.top=r.top+'px'; c.style.height=r.height+'px'; });
    st.l.style.left=Math.max(2,r.left-26-6)+'px'; st.r.style.right='auto'; st.r.style.left=Math.min(innerWidth-28,r.right+6)+'px'; }
  var OVR={l:null,r:null};
  function q(el,s){ return el?el.querySelector(s):null; }
  function part(c,side,def){
    var nm=q(side,'span'), em=q(side,'em'), t=em?em.textContent:'', main=t.split('·')[0].trim(), ex=(t.split('·')[1]||'').trim(), m=main.match(/(-?\d+)\s*([^\d\s]*)\s*$/);
    c.querySelector('.nm').textContent=nm?nm.textContent:def;
    var U={rp:'승',mj:'승',br:'승',hj:'알'}, hk=window.__nhere?window.__nhere():'';
    setSc(c, m?m[1]:'', m?(m[2]||U[hk]||''):'');
    c.querySelector('.ex').textContent=ex; }
  function setSc(c,v,u){ var e=c.querySelector('.sc'); e.textContent=v; e.style.fontSize=(String(v).length>=3?'14px':(String(v).length===2?'17px':'19px')); c.querySelector('.un').textContent=v===''?'':u; }
  function txt(id){ var e=d.getElementById(id); return e&&e.offsetParent!==null?e.textContent:null; }
  function paint(){ if(!st) return;
    var v=[].slice.call(d.querySelectorAll('.vs')).filter(function(x){ return x.offsetParent!==null||x.classList.contains('nside-hide'); });
    var vis=null; v.forEach(function(x){ var p=x.closest('.pane,.panel,[role=tabpanel]'); if(!p||p.offsetParent!==null){ vis=vis||x; } });
    if(vis){ var mid=q(vis,'.mid'); if(mid){ vis.classList.add('nside-mid'); } else { vis.classList.add('nside-hide'); }
      part(st.l,q(vis,'.a'),'나'); part(st.r,q(vis,'.b'),opp()); }
    else if(txt('aC1')!==null){ st.l.querySelector('.nm').textContent='나'; st.r.querySelector('.nm').textContent=opp(); setSc(st.l,txt('aC1'),'알'); setSc(st.r,txt('aC2')||'','알'); st.l.querySelector('.ex').textContent=''; st.r.querySelector('.ex').textContent=''; }
    else if(txt('cnt')!==null){ var mm=(txt('cnt')||'').match(/(\d+)/); st.l.querySelector('.nm').textContent='나'; st.r.querySelector('.nm').textContent=opp(); setSc(st.l,mm?mm[1]:'','장'); setSc(st.r,'',''); st.l.querySelector('.ex').textContent=''; st.r.querySelector('.ex').textContent=''; }
    else { st.l.querySelector('.nm').textContent='나'; st.r.querySelector('.nm').textContent=opp(); ['sc','un','ex'].forEach(function(k){ st.l.querySelector('.'+k).textContent=''; st.r.querySelector('.'+k).textContent=''; }); }
    st.l.classList.toggle('on',OVR.l!=null?OVR.l:W===0); st.r.classList.toggle('on',OVR.r!=null?OVR.r:W===1); align();
    st.l.querySelector('.tn').textContent=W===0?(LAB||'내 차례'):''; st.r.querySelector('.tn').textContent=W===1?(LAB||'상대 차례'):''; }
  window.noriSide=function(w,lab){ init(); W=(w===0||w===1)?w:null; LAB=lab||''; if(W===1&&LAB&&!/^내 /.test(LAB)){ RN=LAB.replace(/\s*차례$/,''); } paint(); };
  window.noriSideInit=function(){ init(); paint(); };
  /* 벌칙 · 힘: 기둥 불 · 배터리 (on:null 이면 차례 표시로 되돌림) */
  window.noriCol=function(s,o){ init(); var c=st[s]; if(!c) return; if('on' in o){ OVR[s]=o.on; paint(); } if('pw' in o){ var i=c.querySelector('.bat i'); if(i) i.style.height=Math.max(0,Math.min(1,o.pw||0))*100+'%'; }
    if('good' in o){ var gz=c.querySelector('.bat .gz'); if(gz){ if(o.good){ gz.style.display='block'; gz.style.bottom=(o.good[0]*100)+'%'; gz.style.height=((o.good[1]-o.good[0])*100)+'%'; } else { gz.style.display='none'; } } } };
})();
window.noriNav=function(o){
  /* 261122 v5 — 아래 막대 「놀이 방법 · 그때 그 놀이(홈, 가운데) · 새 판」, 「다른 놀이」 창 없앰. 끝 화면: 선물 받기 · 이야기방에 남기기 · 다시 하기 · 그때 그 놀이(홈) */
  var HOME='https://www.loveflow.ai.kr/nori/', STORY='https://uriyagi.kr/?g=e92887ad781a49f7a3e74194e912216e';
  var RULE={om:'가로·세로·대각선 어느 쪽이든 내 돌 다섯 개를 먼저 한 줄로 이으면 이겨요. 한 수 무르기는 세 번까지 돼요.',
    ak:'내 알을 손가락으로 끌었다 놓아 튕겨요. 상대 알을 판 밖으로 쳐내고, 상대 알을 먼저 다 떨어뜨리면 이겨요.',
    rd:'서로 딱지를 한 장씩 내요. 정한 기준(글자 많기 · 숫자 높기)으로 센 쪽이 딱지를 가져가고, 다섯 판 뒤 많이 딴 사람이 이겨요.'};
  var framed=false; try{ framed=window.parent!==window; }catch(e){ framed=true; }
  function goHome(){ if(framed){ try{ window.parent.postMessage('nori-close','*'); return; }catch(e2){} } try{ window.open(HOME,'_top'); }catch(e3){ location.href=HOME; } }
  /* 나가기 확인 창 (v0.2 6장 4 · 3장 4 · 대표 승인 261124) — 판이 진행 중일 때만 · 「취소 / 나가기」 */
  window.noriAskExit=function(){ if(document.getElementById('nExit')) return; var o=document.createElement('div'); o.id='nExit';
    o.style.cssText='position:fixed;inset:0;z-index:95;background:rgba(46,58,70,.35);display:flex;align-items:center;justify-content:center;font-family:"Noto Sans KR",system-ui,sans-serif';
    o.innerHTML='<div style="background:#fff;border-radius:20px;padding:20px 16px 14px;width:min(300px,86vw);text-align:center"><b style="font-size:17px;color:#2E3A46">놀이에서 나갈까요?</b><p style="margin:8px 0 14px;font-size:14px;line-height:1.6;color:#4A525C">나가면 진행 중인 판은 처음부터 다시 시작해요.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button type="button" data-x="no" style="min-height:48px;border:0;border-radius:14px;background:#F4EEE4;font:800 15px \'Noto Sans KR\',sans-serif;color:#2E3A46;cursor:pointer">취소</button><button type="button" data-x="go" style="min-height:48px;border:0;border-radius:14px;background:#1E4A76;font:800 15px \'Noto Sans KR\',sans-serif;color:#fff;cursor:pointer">나가기</button></div></div>';
    document.body.appendChild(o); o.addEventListener('click',function(e){ var b=e.target.closest('[data-x]'); if(!b&&e.target!==o) return; var go=b&&b.getAttribute('data-x')==='go'; o.remove(); if(go){ window.__noriPlaying=false; goHome(); } }); };
  function goStory(){ if(framed){ try{ window.parent.postMessage({nori:'story'},'*'); return; }catch(e){} } try{ window.open(STORY,'_blank'); }catch(e2){ location.href=STORY; } }
  window.noriHome=goHome;
  var css=document.createElement('style');
  css.textContent='.nbar{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;background:rgba(22,24,29,.96);padding:6px 10px calc(6px + env(safe-area-inset-bottom,0px))}'
   +'.nbar>div{width:100%;max-width:480px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}'
   +'.nbar button{font:inherit;font-family:"Noto Sans KR",system-ui,sans-serif;font-size:14px;font-weight:800;color:#fff;background:rgba(255,255,255,.1);border:0;border-radius:12px;min-height:44px;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer}'
   +'.nbar button svg{width:18px;height:18px;fill:none;stroke:#FFC21A;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}'
   +'.nbar button.home{background:#FFC21A;color:#16181D;font-family:"Song Myung",serif;font-weight:400;font-size:15px;letter-spacing:-.03em;white-space:nowrap;gap:4px;padding:0 4px}'
   +'.nbar button.home svg{stroke:#16181D}'
   +'.nrule{position:fixed;inset:0;z-index:45;background:rgba(22,24,29,.55);display:none;align-items:flex-end;justify-content:center}.nrule.on{display:flex}'
   +'.nrule>div{width:100%;max-width:480px;background:#FFF8E6;border-radius:22px 22px 0 0;padding:20px 18px calc(84px + env(safe-area-inset-bottom,0px));font-family:"Noto Sans KR",system-ui,sans-serif}'
   +'.nrule h3{margin:0 0 10px;text-align:center;font-family:"Song Myung",serif;font-weight:400;font-size:24px;color:#1B1A1F}.nrule p{margin:0 0 16px;font-size:16px;line-height:1.6;color:#1B1A1F;word-break:keep-all}'
   +'.nrule button{width:100%;min-height:48px;border:0;border-radius:14px;background:#16181D;color:#fff;font:800 16px "Noto Sans KR",sans-serif}'
   +'body{padding-bottom:calc(60px + env(safe-area-inset-bottom,0px));padding-left:16px!important;padding-right:16px!important}body.nside-on{padding-left:38px!important;padding-right:38px!important}';
  if(window.NORI_A){ css.textContent+='.nbar{background:#fff;padding:6px 8px calc(8px + env(safe-area-inset-bottom,0px))}.nbar>div{grid-template-columns:1fr 1.15fr 1fr}'
     +'.nbar button{background:transparent;color:#7A6E55;font-size:11.5px;flex-direction:column;gap:2px;min-height:48px}.nbar button svg{width:21px;height:21px;stroke:currentColor;stroke-width:2}'
     +'.nbar button.home{background:#FFC21A;color:#1C1D21}.nbar button.home svg{width:26px;height:26px;stroke:#1C1D21}'
     +'body{padding-bottom:calc(62px + env(safe-area-inset-bottom,0px))}'
     +'.nrule{background:rgba(28,29,33,.3);z-index:72}.nrule>div{background:#fff;border-radius:24px 24px 0 0;padding:18px 16px calc(16px + env(safe-area-inset-bottom,0px))}.nrule h3{font-family:"Noto Sans KR",sans-serif;font-weight:900;font-size:17px}.nrule p{font-size:15px}.nrule button{background:#F6F1E6;color:#1C1D21}'; }
  document.head.appendChild(css);
  var IH='<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7M6 9.5V20h12V9.5M10 20v-6h4v6"/></svg>';
  var bar=document.createElement('div'); bar.className='nbar';
  if(window.NORI_A){ bar.innerHTML='<div><button type="button" data-a="help"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6M12 17h.01"/></svg><span>놀이 방법</span></button>'
    +'<button type="button" data-a="list" class="home" aria-label="그때 그 놀이 처음 화면">'+IH+'</button>'
    +'<button type="button" data-a="new"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5"/></svg><span>다시 하기</span></button></div>'; } else
  bar.innerHTML='<div><button type="button" data-a="help"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6M12 17h.01"/></svg>놀이 방법</button>'
    +'<button type="button" data-a="list" class="home">'+IH+'그때 그 놀이</button>'
    +'<button type="button" data-a="new"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5"/></svg>새 판</button></div>';
  document.body.appendChild(bar);
  var rs=document.createElement('div'); rs.className='nrule'; rs.setAttribute('role','dialog'); document.body.appendChild(rs);
  function vis(el){ return el&&el.offsetParent!==null; }
  function help(){
    if(o.onHelp){ o.onHelp(); return; }
    var c=[document.getElementById('helpBtn')].concat([].slice.call(document.querySelectorAll('.hb'))).filter(Boolean);
    for(var i=0;i<c.length;i++){ var p=c[i].closest('.pane,[role=tabpanel]'); if(!p||p.offsetParent!==null){ c[i].click(); return; } }
    var t=RULE[o.here&&o.here()]||'사장님 또는 친구와 번갈아 한 판씩 겨뤄요. 이기면 선물, 져도 참가 선물이 있어요.';
    rs.innerHTML='<div><h3>놀이 방법</h3><p>'+t+'</p><button type="button">알겠어요</button></div>'; rs.classList.add('on'); }
  rs.addEventListener('click',function(e){ if(e.target===rs||e.target.tagName==='BUTTON'){ rs.classList.remove('on'); } });
  bar.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; var a=b.getAttribute('data-a');
    if(a==='list'){ if(window.__noriPlaying&&!cd.classList.contains('on')) noriAskExit(); else goHome(); } else if(a==='help'){ help(); } else if(a==='new'){ if(cd.classList.contains('on')) return; if(o.onNew) o.onNew(); } });
  if(window.noriSideInit){ noriSideInit(); }
  window.__nhere=o.here;
  [300,1200].forEach(function(ms){ setTimeout(function(){ try{ window.dispatchEvent(new Event('resize')); }catch(e){} },ms); });
  /* ── 단추 한 벌 (261122 v6): 놀이 안 「? · 놀이 방법 · 새 판」과 옛 끝 화면은 숨기고 아래 막대 · 결과 카드만 ── */
  var hide=document.createElement('style');
  hide.textContent='#helpBtn,.hb,#pNew,#bNew,#oNew,#aNew,#pCard,#bCard,.done{display:none!important}#oRow{grid-template-columns:1fr!important}.act{grid-template-columns:1fr!important}'
   +'.ncard{position:fixed;left:0;right:0;top:0;bottom:calc(56px + env(safe-area-inset-bottom,0px));z-index:30;background:#FFF8E6;overflow:auto;padding:12px 14px 14px;display:none;font-family:"Noto Sans KR",system-ui,sans-serif;color:#1B1A1F}.ncard.on{display:block}'
   +'.ncard .cd{max-width:440px;margin:0 auto;background:#fff;border-radius:18px;padding:12px}'
   +'.ncard .hd{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px;color:#6B5A30;font-weight:700}.ncard .hd b{color:#16181D;font-size:15px}'
   +'.ncard .gn{margin:2px 0 0;font-size:13px;font-weight:800;color:#6B5A30}'
   +'.ncard .ph{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;margin:10px 0;height:clamp(130px,24vh,220px);border-radius:14px;background:#EFEAE0;color:#8A7A50;font-weight:800;font-size:15px;overflow:hidden;cursor:pointer}'
   +'.ncard .ph i{font-style:normal;font-size:36px;line-height:1}.ncard .ph small{font-size:11.5px;font-weight:700}'
   +'.ncard .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none}.ncard .ph.has img{display:block}.ncard .ph input{position:absolute;opacity:0;width:1px;height:1px}'
   +'.ncard .ph .re{position:absolute;right:8px;bottom:8px;background:rgba(22,24,29,.75);color:#fff;font-size:12px;padding:5px 9px;border-radius:10px;display:none}.ncard .ph.has .re{display:block}'
   +'.ncard .sc{display:grid;grid-template-columns:1fr auto 1fr;align-items:end;text-align:center}.ncard .sc .a{color:#2457D6}.ncard .sc .b{color:#E1262D}'
   +'.ncard .sc em{display:block;font-style:normal;font-size:34px;font-weight:900;line-height:1.05;font-variant-numeric:tabular-nums}.ncard .sc em u{text-decoration:none;font-size:15px;margin-left:2px}'
   +'.ncard .sc small{font-size:12.5px;font-weight:800}.ncard .sc .c{font-size:26px;color:#B9A67A;font-weight:900;padding-bottom:22px}'
   +'.ncard .big{text-align:center;font-size:30px;font-weight:900;margin:6px 0}'
   +'.ncard .res{text-align:center;font-size:20px;font-weight:900;margin:4px 0 8px}.ncard .res.win{color:#E1262D}.ncard .res.lose{color:#4B4F58}.ncard .res.draw{color:#6B5A30}'
   +'.ncard .memo{width:100%;border:0;border-radius:10px;background:#F6F2E8;padding:10px;font:600 14.5px "Noto Sans KR",sans-serif;color:#1B1A1F}.ncard .memo::placeholder{color:#A8996F}.ncard .memo:focus{outline:none;background:#EFE6D2}'
   +'.ncard .ft{display:flex;justify-content:space-between;font-size:11.5px;color:#8A7A50;margin-top:8px}.ncard .ft b{color:#16181D;letter-spacing:.08em}'
   +'.ncard .lure{max-width:440px;margin:8px auto 0;text-align:center;font-size:13.5px;color:#4B4F58}.ncard .lure b{color:#E1262D}'
   +'.ncard .bt2{max-width:440px;margin:0 auto}.ncard .bt2 button{display:flex;align-items:center;justify-content:center;width:100%;border:0;border-radius:14px;min-height:48px;font:800 16px "Noto Sans KR",sans-serif;margin-top:8px;cursor:pointer}'
   +'.ncard .bt2 .gift{background:#E1262D;color:#fff;font-size:17px}.ncard .bt2 .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ncard .bt2 .row button{background:#EFEAE0;color:#1B1A1F;font-size:14.5px}'
   +'.ncard .tip{max-width:440px;margin:8px auto 0;font-size:11.5px;color:#8A7A50;text-align:center;line-height:1.5}';
  if(window.NORI_A){ hide.textContent+='.ncard{top:calc(48px + env(safe-area-inset-top,0px));bottom:calc(62px + env(safe-area-inset-bottom,0px));color:#1C1D21}'
     +'.ncard{padding-top:10px}.ncard .ph{height:clamp(96px,19vh,200px)!important;margin:8px 0}.ncard .sc em{font-size:30px}.ncard .res{font-size:18px;margin:2px 0 6px}.ncard .lure{margin-top:6px;font-size:12.5px}.ncard .bt2 button{min-height:46px;margin-top:6px}.ncard .hd{color:#7A6E55}.ncard .gn{color:#7A6E55}.ncard .ph{background:#F6F1E6;color:#7A6E55}.ncard .sc .a{color:#2F64E0}.ncard .sc .b{color:#E04848}.ncard .sc .c{color:#C9BFA8}'
     +'.ncard .res.win{color:#E04848}.ncard .res.lose{color:#7A6E55}.ncard .memo{background:#F6F1E6}.ncard .ft{color:#7A6E55}'
     +'.ncard .mq{font-size:13.5px;font-weight:800;color:#7A3520;margin:4px 2px 6px;text-align:center;word-break:keep-all}.ncard .row.nmemo[hidden],.ncard .tip.nmemo[hidden]{display:none!important}'
     +'.ncard .lure{color:#7A6E55}.ncard .lure b{color:#E04848}.ncard .bt2 .gift{background:#FFC21A;color:#1C1D21;font-weight:900}.ncard .bt2 .row button{background:#F6F1E6;color:#1C1D21}.ncard .tip{color:#9A8E70}'; }
  document.head.appendChild(hide);
  /* 결과에 카드 번호(확인 번호)를 붙여 선물 기록과 맞춰 볼 수 있게 */
  var _nr=window.noriResult;
  if(_nr&&!_nr.__w){ window.noriResult=function(r){ window.__noriPlaying=false; try{ if(r&&!r.card){ r.card='K'+(Date.now()%60466176).toString(36).toUpperCase().padStart(5,'0'); r.t=Date.now(); r.detail=String(r.detail||'')+' · 카드 '+r.card; } }catch(e){} return _nr.apply(this,arguments); }; window.noriResult.__w=1; }
  function esc2(t){ return String(t==null?'':t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function shop(){ var e=document.querySelector('.shopN'); return e&&e.textContent.trim()?e.textContent.trim():'다복'; }
  function when(t){ var d=new Date(t||Date.now()), W='일월화수목금토'; function p(n){ return (n<10?'0':'')+n; } return d.getFullYear()+'.'+p(d.getMonth()+1)+'.'+p(d.getDate())+' ('+W[d.getDay()]+') '+p(d.getHours())+':'+p(d.getMinutes()); }
  var OUT={win:'이겼어요!',lose:'아쉽게 졌어요',draw:'비겼어요'};
  var cd=document.createElement('div'); cd.className='ncard'; cd.setAttribute('role','dialog'); cd.setAttribute('aria-label','결과 카드'); document.body.appendChild(cd);
  var R=null, photo=null, againBtn=null;
  function outOf(r){ if(r.out) return r.out; return r.win?'win':'lose'; }
  function resText(r){ var o2=outOf(r); if(r.opp==='친구'){ return o2==='draw'?'비겼어요':(o2==='win'?'내가 이겼어요!':'친구 이겼어요!'); } return OUT[o2]; }
  function scoreHTML(r){ var u=r.u?'<u>'+esc2(r.u)+'</u>':'';
    if(r.sc&&r.sc[1]!=null){ return '<div class="sc"><div class="a"><em>'+esc2(r.sc[0])+u+'</em><small>나</small></div><div class="c">:</div><div class="b"><em>'+esc2(r.sc[1])+u+'</em><small>'+esc2(r.opp||'상대')+'</small></div></div>'; }
    if(r.sc){ return '<div class="big">'+esc2(r.detail.split(' · 카드')[0])+'</div>'; }
    return '<div class="big">'+esc2(String(r.detail||'').split(' · 카드')[0])+'</div>'; }
  function openCard(){ var r=window.__noriLast; if(!r){ return; } R=r; photo=null;
    cd.innerHTML='<div class="cd"><div class="hd"><span class="pl" data-plan="paid" hidden></span><b>그때 그 놀이 · '+esc2(shop())+'</b><span>'+when(r.t)+'</span></div><div class="gn">'+esc2((r.gname||'')+(window.__noriBetName?' · '+window.__noriBetName:''))+'</div>'
      +'<div class="ph"><img alt="현장 사진"><i>📷</i>현장 사진 넣기<div class="pb"><label>📷 지금 찍기<input type="file" accept="image/*" capture="environment"></label><label>🖼 앨범에서<input type="file" accept="image/*"></label></div><small>사진은 이 폰 안에서만 카드에 합쳐요 · 서버로 보내지 않아요</small><label class="re">사진 바꾸기<input type="file" accept="image/*"></label></div>'
      +scoreHTML(r)+'<div class="res '+outOf(r)+'">'+esc2(resText(r))+'</div>'
      +(function(){ var T=!(window.noriStoryOff&&noriStoryOff())&&window.NORI_STORY&&window.NORI_STORY[r.game]; return T?'<div class="mq">✏ '+esc2(T.q)+'</div><input class="memo" maxlength="40" placeholder="떠오르는 대로 한 줄 (이름 · 전화번호는 빼고 적어 주세요)">':'<input class="memo" maxlength="40" placeholder="✏ 추억 한 줄 (이름 · 전화번호는 빼고 적어 주세요)">'; })()
      +'<div class="ft"><span>확인 번호</span><b>'+esc2(r.card||'')+'</b></div></div>'
      +'<p class="lure">'+esc2(shop())+'에서 준비한 <b>푸짐한 선물</b> 받아가세요</p>'
      +'<div class="bt2"><button type="button" class="gift">선물 받기</button><div class="row"><button type="button" data-c="save">카드 저장</button><button type="button" data-c="share">공유하기</button></div><div class="row one"><button type="button" data-c="story">이야기방에 올리기</button></div><div class="row one nmemo" hidden><button type="button" data-c="memoir">자서전 둘러보기</button></div></div><p class="tip nmemo" hidden>적어 주신 한 줄은 이 폰에만 남아요. 「자서전 둘러보기」를 누르면 사랑흐름 자서전 소개 화면이 새 창으로 열려요. 다 보신 뒤 그 창을 닫으시면 돼요.'+(/KAKAOTALK/i.test(navigator.userAgent)?' 카카오톡 안에서는 휴대폰 기본 앱으로 넘겨 열어요. 기본 앱에서 적으신 기억만 자서전에서 불러올 수 있어요.':'')+'</p>'
      +'<p class="tip">「이야기방에 올리기」를 누르면 카드가 폰에 저장되고 다복 이야기방 올리기 창이 열려요. 방금 저장된 카드 사진을 골라 올려 주세요.</p>';
    var ph=cd.querySelector('.ph'), im=ph.querySelector('img');
    im.onload=function(){ photo=im; ph.classList.add('has'); };
    [].forEach.call(ph.querySelectorAll('input[type=file]'),function(inp){ inp.addEventListener('change',function(){ var f=inp.files&&inp.files[0]; if(!f) return; im.src=URL.createObjectURL(f); }); });
    if(window.__noriPhoto){ im.src=window.__noriPhoto; }
    MEMO_AT=-1; var mi=cd.querySelector('.memo'); if(mi){ mi.addEventListener('input',function(){ var on=!!mi.value.trim()&&!(window.noriStoryOff&&noriStoryOff()); [].forEach.call(cd.querySelectorAll('.nmemo'),function(x){ x.hidden=!on; }); }); mi.addEventListener('change',memoKeep); }
    cd.classList.add('on'); document.body.classList.add('ncard-on'); cd.scrollTop=0; setNew(true);
    try{ if(window.SND&&SND.tap){} }catch(e){} }
  /* 「그때 이야기」 한 줄을 이 폰에 적어 둠 (사랑흐름-놀이-003 · 자서전이 나중에 불러옴 · 서버로 보내지 않음) */
  var MEMO_AT=-1;
  function memoKeep(){ try{ var inp=cd.querySelector('.memo'), a=inp?inp.value.trim():'', T=!(window.noriStoryOff&&noriStoryOff())&&window.NORI_STORY&&R&&window.NORI_STORY[R.game]; if(!T) return;
      var L=JSON.parse(localStorage.getItem('lfNoriMemo')||'[]'); if(!Array.isArray(L)) L=[];
      var d=new Date(), at=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2), it={g:T.g,q:T.q,a:a,s:T.n,at:at};
      if(MEMO_AT>=0&&L[MEMO_AT]&&L[MEMO_AT].g===it.g&&L[MEMO_AT].q===it.q){ if(a) L[MEMO_AT]=it; else { L.splice(MEMO_AT,1); MEMO_AT=-1; } }
      else if(a){ L.push(it); while(L.length>50) L.shift(); MEMO_AT=L.length-1; }
      localStorage.setItem('lfNoriMemo',JSON.stringify(L)); }catch(e){} }
  function closeCard(){ cd.classList.remove('on'); document.body.classList.remove('ncard-on'); setNew(false); }
  function setNew(on){ if(window.NORI_A) return; var b=bar.querySelector('[data-a=new]'); b.lastChild.textContent= on?'다시 하기':'새 판'; }
  /* 카드 그림 만들기 (1080×1440) — 폰 안에서만 */
  function rr(x,c,X,Y,W,H,R2){ x.beginPath(); x.moveTo(X+R2,Y); x.arcTo(X+W,Y,X+W,Y+H,R2); x.arcTo(X+W,Y+H,X,Y+H,R2); x.arcTo(X,Y+H,X,Y,R2); x.arcTo(X,Y,X+W,Y,R2); x.closePath(); x.fillStyle=c; x.fill(); }
  function draw(cb){ var r=R, W=1080, H=1440, c=document.createElement('canvas'); c.width=W; c.height=H; var x=c.getContext('2d'), F='"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    var CB=window.NORI_A?'#2F64E0':'#2457D6', CR=window.NORI_A?'#E04848':'#E1262D', CS=window.NORI_A?'#7A6E55':'#6B5A30', CP=window.NORI_A?'#F6F1E6':'#EFEAE0';
    x.fillStyle='#FFF8E6'; x.fillRect(0,0,W,H); rr(x,'#fff',40,40,W-80,H-80,40);
    x.fillStyle='#16181D'; x.font='900 46px '+F; x.textBaseline='alphabetic'; x.textAlign='left'; x.fillText('그때 그 놀이 · '+shop(),84,118);
    x.fillStyle=CS; x.font='700 30px '+F; x.textAlign='right'; x.fillText(when(r.t),W-84,116); x.textAlign='left'; x.font='800 32px '+F; x.fillText(r.gname||'',84,166);
    var PX=84,PY=196,PW=W-168,PH=720; x.save(); rr(x,CP,PX,PY,PW,PH,28); x.clip();
    if(photo){ var iw=photo.naturalWidth, ih=photo.naturalHeight, s2=Math.max(PW/iw,PH/ih), dw=iw*s2, dh=ih*s2; x.drawImage(photo,PX+(PW-dw)/2,PY+(PH-dh)/2,dw,dh); }
    else { x.fillStyle='#A8996F'; x.font='800 40px '+F; x.textAlign='center'; x.fillText('그때 그 놀이 한 판',W/2,PY+PH/2); }
    x.restore(); x.textAlign='center';
    var y=PY+PH+130;
    if(r.sc&&r.sc[1]!=null){ x.font='900 128px '+F; x.fillStyle=CB; x.fillText(String(r.sc[0]),W*0.27,y); x.fillStyle=CR; x.fillText(String(r.sc[1]),W*0.73,y); x.fillStyle='#B9A67A'; x.font='900 80px '+F; x.fillText(':',W/2,y-14);
      x.font='800 34px '+F; x.fillStyle=CB; x.fillText('나'+(r.u?' · '+r.u:''),W*0.27,y+52); x.fillStyle=CR; x.fillText((r.opp||'상대')+(r.u?' · '+r.u:''),W*0.73,y+52); y+=128; }
    else { x.font='900 76px '+F; x.fillStyle='#16181D'; x.fillText(String(r.detail||'').split(' · 카드')[0],W/2,y-30); y+=60; }
    var o2=outOf(r); x.font='900 58px '+F; x.fillStyle=o2==='win'?CR:(o2==='lose'?CS:CS); x.fillText(resText(r),W/2,y); y+=70;
    var m=(cd.querySelector('.memo')||{}).value||''; if(m){ x.font='700 36px '+F; x.fillStyle='#1B1A1F'; x.fillText('“'+m+'”',W/2,y); }
    x.font='700 28px '+F; x.fillStyle='#8A7A50'; x.textAlign='left'; x.fillText('확인 번호 '+(r.card||''),84,H-76); x.textAlign='right'; x.fillText('loveflow.ai.kr/nori',W-84,H-76);
    c.toBlob(function(b){ cb(b,m); },'image/png'); }
  function fname(){ return 'geuttae-nori-'+(R&&R.card||Date.now())+'.png'; }
  function dl(b){ var u=URL.createObjectURL(b), a=document.createElement('a'); a.href=u; a.download=fname(); document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); },4000); }
  function toast2(m){ try{ (window.NA&&NA.toast)?NA.toast(m):alert(m); }catch(e2){} }
  function stxt(){ return shop()+'에서 그때 그 놀이 한 판! '+(R&&R.gname?R.gname+' ':'')+(R?resText(R):'')+' · 나도 해 보기 '+HOME; }
  /* 카드 저장: 카드 그림을 이 폰에 저장만 함 */
  function save(){ draw(function(b){ dl(b); toast2('카드를 폰에 저장했어요'); }); }
  /* 공유하기: 휴대폰 공유 창(그림을 함께 보낼 수 있으면 그림까지) · 공유 창이 없으면 링크 복사 */
  function share(){ var txt=stxt();
    draw(function(b){ var f=null; try{ f=new File([b],fname(),{type:'image/png'}); }catch(e){}
      if(f&&navigator.canShare&&navigator.canShare({files:[f],text:txt})){ navigator.share({files:[f],title:'그때 그 놀이 결과 카드',text:txt}).catch(function(){}); return; }
      if(navigator.share){ navigator.share({title:'그때 그 놀이',text:txt,url:HOME}).catch(function(){}); return; }
      if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(function(){ toast2('링크를 복사했어요<br>카톡에 붙여 넣어 보내 주세요'); },function(){ toast2('링크를 복사하지 못했어요'); }); }
      else { toast2('링크를 복사하지 못했어요'); } }); }
  function story(){ var r=R, ttl=('그때 그 놀이 · '+(r.gname||'')+(r.sc&&r.sc[1]!=null?' '+r.sc[0]+':'+r.sc[1]:'')+' '+resText(r)).slice(0,60);
    var w=null; try{ w=window.open('about:blank','_blank'); }catch(e){}
    draw(function(b,m){ dl(b); var t=((m?m+' — ':'')+shop()+' · '+when(r.t)+' · 확인 번호 '+(r.card||'')).slice(0,3000);
      var u=STORY+'&w='+encodeURIComponent('사진')+'&tt='+encodeURIComponent(ttl)+'&t='+encodeURIComponent(t);
      if(w){ try{ w.location.href=u; }catch(e){ w=window.open(u,'_blank'); } } else { w=window.open(u,'_blank'); }
      /* 우리 이야기가 받을 준비가 되면 카드 그림을 바로 넘김 (우리 이야기 쪽 받는 입구가 생기면 작동 · 없으면 아무 일 없음) */
      try{ var fr=new FileReader(); fr.onload=function(){ var n=0, iv=setInterval(function(){ n++; try{ w&&w.postMessage({uriyagi:'card-image',name:fname(),type:'image/png',data:fr.result,title:ttl,text:t},'https://uriyagi.kr'); }catch(e){} if(n>24) clearInterval(iv); },500); }; fr.readAsDataURL(b); }catch(e){} }); }
  cd.addEventListener('click',function(e){ var b=e.target.closest('button[data-c]'); if(!b) return; var c=b.getAttribute('data-c'); memoKeep(); if(c==='save') save(); else if(c==='share') share(); else if(c==='story') story(); else if(c==='memoir'){ var mu='https://www.loveflow.ai.kr/memoir/'; try{ var kk=/KAKAOTALK/i.test(navigator.userAgent), top2=window.parent||window; if(kk&&top2.LFKakaoOut){ top2.LFKakaoOut(mu); } else { window.open(mu,'_blank'); } }catch(x){ try{ window.open(mu,'_blank'); }catch(y){} } } });
  function againOf(){ var ds=[].slice.call(document.querySelectorAll('.done.on')); for(var i=0;i<ds.length;i++){ var bs=ds[i].querySelectorAll('button'); for(var j=0;j<bs.length;j++){ if(/다시/.test(bs[j].textContent)) return bs[j]; } } return null; }
  /* 옛 끝 화면이 열리면(.done.on) 결과 카드를 엶 */
  var penning=false;
  var dmo=new MutationObserver(function(){ var on=!!document.querySelector('.done.on'); if(on&&!cd.classList.contains('on')){ if(penning) return; againBtn=againOf();
      if(window.__naPen){ penning=true; window.__naPen(function(){ penning=false; if(document.querySelector('.done.on')) openCard(); }); } else { openCard(); } }
    else if(!on){ penning=false; if(cd.classList.contains('on')) closeCard(); } });
  [].slice.call(document.querySelectorAll('.done')).forEach(function(d){ dmo.observe(d,{attributes:true,attributeFilter:['class']}); });
  bar.addEventListener('click',function(e){ var b=e.target.closest('button[data-a=new]'); if(!b||!cd.classList.contains('on')) return; var a=againOf()||againBtn; closeCard(); if(a){ a.click(); } else if(o.onNew){ o.onNew(); } },true);
  /* ══ 디자인 A 공통 (261122 2차) ══ */
  if(!window.NORI_A||!window.NA) return;
  var tp=document.querySelector('.top'), tr=null;
  if(tp&&!tp.querySelector('.na-tr')){ tr=document.createElement('span'); tr.className='na-tr'; tp.appendChild(tr);
    /* 대표 261123: 놀이 중에도 바로 찍어서 남기기 · 앨범에서만 고르는 게 아니라 */
    var cam=document.createElement('label'); cam.className='na-cam'; cam.setAttribute('aria-label','현장 사진 찍기');
    cam.innerHTML='<input type="file" accept="image/*" capture="environment"><svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
    cam.querySelector('input').addEventListener('change',function(){ var f=this.files&&this.files[0]; if(!f) return; try{ if(window.__noriPhoto) URL.revokeObjectURL(window.__noriPhoto); }catch(x){} window.__noriPhoto=URL.createObjectURL(f); cam.classList.add('has'); NA.toast('📷 사진을 담았어요<br>결과 카드에 들어가요'); this.value=''; });
    tr.appendChild(cam); NA.sndBtn(tr);
    var cc=document.createElement('style'); cc.textContent='.top .na-tr{position:absolute;right:8px;top:calc(7px + env(safe-area-inset-top,0px));display:flex;gap:6px;z-index:3}.top .na-tr .na-snd{position:static!important}'
      +'.na-cam{height:34px;width:34px;border-radius:50%;background:rgba(255,255,255,.5);color:#1C1D21;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:"Noto Sans KR",sans-serif}.na-cam input{position:absolute;opacity:0;width:1px;height:1px}'
      +'.na-cam svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linejoin:round}.na-cam small{font:700 11.5px "Noto Sans KR",sans-serif;opacity:.6}.na-cam.has{background:#fff}.na-cam.has small{opacity:1}'
      +'.ncard .ph .pb{display:flex;gap:8px;margin-top:6px}.ncard .ph .pb label{position:relative;display:flex;align-items:center;gap:4px;background:#fff;color:#1C1D21;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:800;cursor:pointer}.ncard .ph .pb input{position:absolute;opacity:0;width:1px;height:1px}.ncard .ph.has .pb{display:none}';
    document.head.appendChild(cc); }
  window.addEventListener('message',function(e){ if(e.data==='nori-open'){ if(o.onOpen){ o.onOpen(); } else if(window.__naOpen){ window.__naOpen(); } } });
  if(window.NORI_PEN_SELF) return;
  var ac=document.createElement('style');
  ac.textContent='html,body{background:#FFFCF7!important}.app{background:transparent!important}body *{box-shadow:none!important;text-shadow:none!important}'
   +'body.nside-on .app>.top{margin-left:-38px;margin-right:-38px}'
   +'@media (max-height:700px){.say{font-size:13px!important;line-height:1.45!important;padding:6px 10px!important}}'
   +'.top{background:#1E4A76!important;color:#fff!important;height:48px!important}.top .ttl,.top>span{color:#fff!important}.top::after,.top::before{display:none!important}.top .ttl{font-family:"Song Myung",serif;font-size:20px;letter-spacing:0;color:#fff}'
   +'.top .snd{display:none!important}.top .na-snd{position:absolute;right:8px;top:calc(7px + env(safe-area-inset-top,0px));z-index:3}'
   +'#pick{display:none!important}'
   +'.who span.now{background:#FFC21A!important;color:#1C1D21!important}.rules button[aria-pressed=true]{background:#FFC21A!important;color:#1C1D21!important}'
   +'.na-strip{display:flex;justify-content:center;gap:6px;padding:6px 0 0;flex:none}.na-strip span{font:800 11.5px "Noto Sans KR",sans-serif;padding:4px 10px;border-radius:999px;background:#F2EBDB;color:#7A6E55;white-space:nowrap}'
   +'.top .na-strip.in{position:absolute;left:8px;top:calc(11px + env(safe-area-inset-top,0px));padding:0}.top .na-strip.in span{background:rgba(255,255,255,.5);color:#1C1D21;padding:5px 9px;font-size:11px}'
   +'.na-penl{position:fixed;z-index:19;left:40px;right:40px;display:flex;flex-direction:column;gap:6px;font-family:"Noto Sans KR",sans-serif}'
   +'.na-penl .na-penh{flex:none;text-align:center;font-size:14px;font-weight:800;color:#7A6E55}.na-penl .na-penh b{color:#2F64E0}.na-penl .na-penh em{font-style:normal;color:#E04848}'
   +'.na-penl .na-pens{flex:1;min-height:0;position:relative;background:#fff;border-radius:18px;overflow:hidden}'
   +'.na-pdim{position:fixed;left:0;right:0;bottom:0;z-index:18;background:#FFF8E6}'
   +'.ncard .bt2 .row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;flex-direction:row!important}.ncard .bt2 .row.one{grid-template-columns:1fr!important}.ncard .bt2 .row button{margin-top:6px}';
  document.head.appendChild(ac);
  var strip=null; if(tp&&tp.parentNode){ strip=document.createElement('div'); strip.className='na-strip'; tp.parentNode.insertBefore(strip,tp.nextSibling); }
  /* 화면이 한 장을 넘으면(골프 · 활쏘기 작은 폰) 「걸린 것」을 머리 막대 왼쪽으로 올림 */
  function hidden2(){ var bt=bar.getBoundingClientRect().top; return [].slice.call(document.querySelectorAll('.btn,#go,#fire,#act button,.act button')).some(function(e){ var r=e.getBoundingClientRect(); return r.height>0&&r.bottom>bt+1; }); }
  function fitStrip(){ if(!strip||!tp||strip.classList.contains('in')) return; if(document.documentElement.scrollHeight-innerHeight>0||hidden2()){ strip.classList.add('in'); tp.appendChild(strip); try{ window.dispatchEvent(new Event('resize')); }catch(e2){} } }
  [400,1200,2500].forEach(function(ms){ setTimeout(fitStrip,ms); }); window.addEventListener('resize',function(){ setTimeout(fitStrip,50); });
  function setBet(b){ window.__noriBet=b; window.__noriBetName=b==='none'?'':NA.betName(b); if(strip){ strip.innerHTML='<span>걸린 것 · '+NA.betName(b)+'</span>'; } }
  setBet(NA.bet());
  var pk=document.getElementById('pick'), asked=false;
  function oppName(){ var e=pk&&pk.querySelector('[data-v=cpu1] b'); return e&&e.textContent.trim()?e.textContent.trim():shop()+' 사장님'; }
  function ask(){ NA.pre({who:!!pk, opp:oppName(), onGo:function(b,w){ asked=true; window.__naTwo=(w==='two'); setBet(b); if(pk){ var x=pk.querySelector('[data-v='+(w==='two'?'two':'cpu1')+']'); if(x) x.click(); } try{ window.dispatchEvent(new Event('resize')); }catch(e2){} },
    onCancel:function(){ asked=false; goHome(); }}); }
  if(pk){ new MutationObserver(function(){ if(pk.classList.contains('on')&&!cd.classList.contains('on')){ asked=false; ask(); } }).observe(pk,{attributes:true,attributeFilter:['class']}); if(pk.classList.contains('on')){ ask(); } }
  else { setTimeout(function(){ if(!asked) ask(); },250); }
  window.__naOpen=function(){ if(cd.classList.contains('on')||PL) return; if(pk?pk.classList.contains('on'):!asked){ ask(); } };
  /* 벌칙: 옛 끝 화면(.done.on)이 열리면 결과 카드 전에 — 놀이판은 그대로 두고 그 위에 벌칙 무대를 띄움 */
  var PL=null, PD=null;
  function penOff(){ if(PL){ try{ PEN.stop(); }catch(e2){} PL.remove(); PL=null; } if(PD){ PD.remove(); PD=null; } }
  window.__naPen=function(next){ var r=window.__noriLast, b=window.__noriBet;
    if(!r||!b||b==='none'||!window.PEN||!PEN.has(b)||r.out==='draw'){ next(); return; }
    var two=r.opp==='친구', won=r.out==='win', who=r.opp||(shop()+' 사장님');
    var o2= two ? {me:true,victim:won?'친구':'나',side:won?'l':'r'} : (won?{me:true,victim:who,side:'l'}:{me:false,victim:'나',side:'r'});
    var t0=(tp?tp.getBoundingClientRect().bottom:0)+10;
    PD=document.createElement('div'); PD.className='na-pdim'; PD.style.top=(tp?tp.getBoundingClientRect().bottom:0)+'px'; document.body.appendChild(PD);
    PL=document.createElement('div'); PL.className='na-penl'; PL.style.top=t0+'px'; PL.style.bottom='calc(70px + env(safe-area-inset-bottom,0px))';
    PL.innerHTML='<div class="na-penh">'+(two?(won?'<b>내가 이겼다!</b> 친구에게 ':'<em>친구 이겼다!</em> 나에게 '):(won?'<b>이겼다!</b> 이제 '+esc2(who)+'께 ':'<em>졌다…</em> '+esc2(who)+'한테 '))+PEN.name(b)+(won||two?'!':' 😣')+'</div><div class="na-pens"></div>';
    document.body.appendChild(PL); try{ window.dispatchEvent(new Event('resize')); }catch(e2){}
    PEN.run(PL.querySelector('.na-pens'),b,o2,function(){ penOff(); next(); }); };
  bar.addEventListener('click',function(){ penOff(); },true);
  /* 「누구랑」 창이 없는 놀이(동그란 딱지): 다시 → 시작 전 창 */
  if(!pk){ bar.addEventListener('click',function(e){ var b=e.target.closest('button[data-a=new]'); if(b){ setTimeout(function(){ asked=false; ask(); },250); } }); }
};
