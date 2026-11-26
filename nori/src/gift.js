/* 그때 그 놀이 · 선물 받기 · 내 선물함 · 관리자 창 v2 (261121)
   claude.ai 시험판: 이 폰 안에만 저장.  Apps Script 웹 앱으로 열리면(google.script.run 있음) 구글 시트에 함께 저장 · 번호 확인은 서버가 함. */
window.GIFT=(function(){
  var $=function(id){return document.getElementById(id);};
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function load(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||'null'); return v==null?d:v; }catch(e){ return d; } }
  function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} if(k==='nori-recs'||k==='nori-mine'){ push(); } }
  /* ── 구글 시트 연결 (웹 앱일 때만) ── */
  var GSR=!!(window.google&&google.script&&google.script.run), API=window.NORI_API||'', CL=GSR||!!API, sent={}, apin='';
  /* 가게 번호 (261125 · 서버 v4): /nori/?c=101 로 들어오면 그 가게 설정 · 기록 · 번호로 놂. 한 번 들어온 폰은 번호를 기억 · 공유 주소에도 붙음 */
  var C=(function(){ var m=/[?&]c=(\d{3,4})(?:&|$)/.exec(location.search), v=m?m[1]:''; try{ if(v){ localStorage.setItem('nori-c',v); } else { v=localStorage.getItem('nori-c')||''; } }catch(e){} return v; })();
  window.NORI_C=C; if(C&&window.NORI_URL){ window.NORI_URL=String(window.NORI_URL).replace(/[?#].*$/,'')+'?c='+C; }
  function run(fn,args,ok,bad){ if(!CL) return; bad=bad||function(){ toast('서버 연결이 잠깐 안 돼요. 다시 눌러 주세요'); };
    if(GSR){ var r=google.script.run.withSuccessHandler(ok||function(){}).withFailureHandler(bad); r[fn].apply(r,args||[]); return; }
    /* /nori/ 손님 화면 → Apps Script(뒤) — 사랑흐름-총괄-002 결정 ② */
    fetch(API,{method:'POST',body:JSON.stringify({fn:fn,args:args||[],c:C})}).then(function(x){ return x.json(); }).then(function(j){ if(!j||!j.ok) throw 0; ok&&ok(j.res); }).catch(function(){ bad(); }); }
  function push(){ if(!CL) return; REC.forEach(function(r){ if(!apin && mine.indexOf(r.id)<0) return; var j=JSON.stringify(r); if(sent[r.id]!==j){ sent[r.id]=j; run('put',[r]); } }); }
  /* plan: 무료 · 유료를 가를 칸 (총괄-009 지시 5, 261123) — 지금은 모두 'free'. 결제하면 'paid' 로 켜짐 */
  var DEF={prizes:{p1:'음료 한 잔',p0:'사탕 하나',sp:''}, cond:'a', staffPin:'1234', adminPin:'0000', plan:'free'};
  var PRESET=['음료 한 잔','식혜 한 잔','반찬 하나 더','떡볶이 한 접시','뻥튀기 한 봉','사탕 하나','10% 할인','다음 방문 쿠폰'];
  var SET=load('nori-gift-set',DEF); SET.prizes=SET.prizes||DEF.prizes; if(SET.prizes.p2!=null&&SET.prizes.sp==null){ SET.prizes={p1:SET.prizes.p1||DEF.prizes.p1,p0:SET.prizes.p0||DEF.prizes.p0,sp:''}; }
  window.noriPlan=function(){ return (SET&&SET.plan)||'free'; };
  var REC=load('nori-recs',[]), last=null, mine=load('nori-mine',[]), MASTER=null;
  function shop(){ var v=load('nori-shop',null); return (v&&v.s)||'다복'; }
  var TIER={p1:'이긴 선물',p0:'참가 선물'};
  var LVTAG={};
  function tierOf(r){ return r.win?'p1':'p0'; }
  function code(){ var a='ACDEFGHJKMNPQRTWXY347', s=''; for(var i=0;i<4;i++){ s+=a[Math.floor(Math.random()*a.length)]; } return s; }
  function hm(t){ var d=new Date(t); return (d.getMonth()+1)+'.'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2); }
  var ST={ready:['받을 수 있어요','#2E7D46'], wait:['직원 확인 기다림','#E09A1A'], story:['이야기방 남기면 열림','#7A3E9D'], given:['전달 완료','#8A8A8A']};

  /* ── 화면 틀 ── */
  var css=document.createElement('style');
  css.textContent='.gs{position:fixed;inset:0;z-index:60;background:rgba(22,24,29,.6);display:none;align-items:flex-end;justify-content:center}'
   +'.gs.on{display:flex}'
   +'.gs>.sh{width:100%;max-width:480px;max-height:92vh;overflow:auto;background:#FFF8E6;border-radius:22px 22px 0 0;padding:18px 16px calc(20px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:11px;font-family:"Noto Sans KR",system-ui,sans-serif;color:#1B1A1F}'
   +'.gs h3{margin:0;text-align:center;font-family:"Song Myung",serif;font-weight:400;font-size:25px}'
   +'.gs h3 b{font-weight:400;color:#E1262D}'
   +'.gs .x{align-self:flex-end;border:0;background:none;font:inherit;font-size:14px;font-weight:800;color:#6B5A30;cursor:pointer;padding:4px}'
   +'.gs label{display:flex;flex-direction:column;gap:4px;font-size:12.5px;font-weight:800;color:#6B5A30}'
   +'.gs input,.gs select{font:inherit;font-size:16px;font-weight:700;padding:10px 12px;border-radius:12px;border:0;background:#F1ECE2;color:#1B1A1F;width:100%;min-width:0}'
   +'.gs .row2{display:grid;grid-template-columns:1.4fr 1fr;gap:8px}'
   +'.gs .go{font:inherit;min-height:54px;border:0;border-radius:16px;background:#E1262D;color:#fff;font-size:17px;font-weight:900;cursor:pointer;}'
   +'.gs .go.dark{background:#16181D;color:#FFC21A;box-shadow:none}'
   +'.gs .go.light{background:#EFEAE0;color:#1B1A1F;border:0}'
   +'.gs .sum{background:#fff;border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.55}'
   +'.gs .sum b{color:#E1262D}'
   +'.gs .note{font-size:12px;color:#8A7A50;margin:0;line-height:1.5}'
   +'.cp{position:relative;background:#fff;border-radius:18px;padding:16px 16px 14px;text-align:center;overflow:hidden}'
   +'.cp:before,.cp:after{content:"";position:absolute;top:50%;width:22px;height:22px;border-radius:50%;background:#FFF8E6;transform:translateY(-50%)}'
   +'.cp:before{left:-11px}.cp:after{right:-11px}'
   +'.cp .shop{font-family:"Song Myung",serif;font-size:20px}'
   +'.cp .tier{display:inline-block;margin-top:4px;font-size:13px;font-weight:900;color:#fff;background:#E1262D;border-radius:999px;padding:2px 10px}'
   +'.cp .pz{font-family:"Black Han Sans",sans-serif;font-size:26px;margin:6px 0 2px}'
   +'.cp .cd{font-family:"Black Han Sans",sans-serif;font-size:34px;letter-spacing:.12em;margin:4px 0;border-top:1.5px dashed #CDBF9B;padding-top:8px}'
   +'.cp .meta{font-size:12.5px;color:#6B5A30}'
   +'.chip{display:inline-block;font-size:12px;font-weight:900;color:#fff;border-radius:999px;padding:3px 10px}'
   +'.mlist{display:flex;flex-direction:column;gap:8px}'
   +'.mi{display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:center;background:#fff;border-radius:14px;padding:10px 12px;font-size:13.5px}'
   +'.mi b{font-size:15px}.mi small{color:#6B5A30;grid-column:1}'
   +'.mi button{grid-row:1/3;grid-column:2;font:inherit;font-size:13px;font-weight:900;border:0;border-radius:10px;padding:9px 11px;background:#16181D;color:#FFC21A;cursor:pointer}'
   +'.mi button[disabled]{background:#E3DDCF;color:#8A8A8A;cursor:default}'
   +'.tabs2{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.tabs2.t4{grid-template-columns:1.15fr 1.15fr .85fr .85fr;gap:5px}.tabs2.t4 button{font-size:13px;padding:9px 2px;letter-spacing:-.03em;white-space:nowrap}'
   +'.tabs2 button{font:inherit;font-size:14px;font-weight:900;border:0;background:#EFEAE0;border-radius:12px;padding:9px 4px;cursor:pointer;color:#1B1A1F}'
   +'.tabs2 button[aria-selected="true"]{background:#16181D;color:#FFC21A}'
   +'.stat{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center}'
   +'.stat div{background:#fff;border-radius:12px;padding:8px 4px;font-size:11.5px;font-weight:800;color:#6B5A30}'
   +'.stat b{display:block;font-size:20px;color:#1B1A1F;font-family:"Black Han Sans",sans-serif;font-weight:400}'
   +'.rad{display:flex;flex-direction:column;gap:6px}'
   +'.rad label{flex-direction:row;align-items:flex-start;gap:8px;background:#fff;border-radius:12px;padding:10px;font-size:14px;color:#1B1A1F;font-weight:700}'
   +'.rad input{width:auto;margin-top:3px}'
   +'.rad small{display:block;font-weight:600;color:#6B5A30;font-size:12px}'
   +'.menu{position:fixed;z-index:55;top:calc(60px + env(safe-area-inset-top,0px));right:max(10px,calc(50% - 230px));background:#fff;border-radius:14px;display:none;flex-direction:column;overflow:hidden;min-width:170px}'
   +'.menu.on{display:flex}'
   +'.menu button{font:inherit;font-family:"Noto Sans KR",sans-serif;text-align:left;border:0;background:#fff;padding:13px 16px;font-size:15px;font-weight:800;cursor:pointer;color:#1B1A1F;}';
  document.head.appendChild(css);
  var gs=document.createElement('div'); gs.className='gs'; gs.setAttribute('role','dialog'); document.body.appendChild(gs);
  var menu=document.createElement('div'); menu.className='menu';
  menu.innerHTML='<button type="button" data-m="mine">내 선물함</button>'+(window.NORI_API?'<button type="button" data-m="home">홈 화면에 추가</button><button type="button" data-m="share">공유하기</button>':'')+'<button type="button" data-m="admin">관리자 창 (사장님)</button>';
  document.body.appendChild(menu);
  function open(h){ gs.innerHTML='<div class="sh">'+h+'</div>'; gs.classList.add('on'); }
  function close(){ gs.classList.remove('on'); }
  gs.addEventListener('click',function(e){ if(e.target===gs){ close(); } });
  function prizeName(t){ return SET.prizes[t]||''; }

  /* ── 놀이가 끝났을 때 받는 결과 ── */
  function result(r){ r.id='r'+Date.now(); r.claimed=false; last=r; playLog(r); }
  /* 판 기록 (049 · 승률 보기용): 이기든 지든 모든 판을 짧게 남김 — 놀이 · 이김/짐 · 상대 · 매장 · 기기 · 시각 (이름 · 사진 없음).
     선물 장부와 따로(025 원칙). 대표 승인 261123 21:40 → 손님 화면에서는 서버 'play' 로도 보냄(서버에 play 가 없으면 조용히 넘어감 · 끄려면 window.NORI_PLAYLOG=0). 시험판(lab)은 서버 주소가 비어 안 보냄 */
  function playLog(r){ if(window.NORI_EDU) return; /* 교육용 주소: 판 기록 안 남김 */ try{ var dev=load('nori-dev',''); if(!dev){ dev='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); save('nori-dev',dev); }
    var p={v:'nori3.0',t:Date.now(),g:r.game||'',o:r.out||'',vs:r.lv||'two',sc:(r.sc||[]).join(':'),shop:(load('nori-shop',{}).s||''),dev:dev,lv:(window.BOSS&&BOSS.cur)?Math.round(BOSS.cur*100)/100:''};
    var L=load('nori-plays',[]); L.push(p); if(L.length>300) L=L.slice(-300); save('nori-plays',L);
    if(window.NORI_PLAYLOG!==0&&CL){ run('play',[p],function(){},function(){}); } }catch(e){} }

  /* ── 선물 받기: 이름 · 자리 적고 쿠폰 받기 ── */
  function claim(){
    if(!last){ myBox(); return; }
    if(last.claimed){ coupon(last.rec); return; }
    var t=tierOf(last), nm=load('nori-name','');
    open('<button class="x" type="button" data-c="x">닫기 ✕</button>'
      +'<h3><b>푸짐한</b> 선물을 드려요</h3>'
      +'<div class="sum">'+esc(last.gname)+' · '+esc(last.opp||'')+(LVTAG[last.lv]?' ('+LVTAG[last.lv]+')':'')+'<br>'+(last.win?'<b>이겼어요!</b> ':'수고하셨어요 · ')+esc(last.detail||'')+'<br>받을 선물: <b>'+TIER[t]+' · '+esc(prizeName(t))+'</b></div>'
      +'<div class="row2"><label>이름이나 별명<input id="gN" maxlength="10" value="'+esc(nm)+'" placeholder="예: 김다복"></label><label>자리(선택)<input id="gS" maxlength="6" placeholder="예: 3번"></label></div>'
      +'<p class="note">사장님이 누구에게 드릴지 알 수 있게 이름(별명)만 적어요. 전화번호는 받지 않아요.</p>'
      +'<button class="go" type="button" data-c="ok">선물 받기</button>');
    gs.querySelector('[data-c=ok]').addEventListener('click',function(){
      var n=$('gN').value.trim(); if(!n){ $('gN').focus(); $('gN').style.borderColor='#E1262D'; return; }
      save('nori-name',n);
      var rec={id:last.id,t:Date.now(),name:n,seat:$('gS').value.trim(),game:last.game,gname:last.gname,opp:last.opp,lv:last.lv,win:!!last.win,detail:last.detail,tier:t,prize:prizeName(t),code:code(),
        status: SET.cond==='a'?'ready':(SET.cond==='b'?'wait':'story')};
      REC.unshift(rec); save('nori-recs',REC); mine.unshift(rec.id); save('nori-mine',mine);
      last.claimed=true; last.rec=rec;
      if(window.SND){ SND.win(.8); }
      coupon(rec);
    });
    gs.querySelector('[data-c=x]').addEventListener('click',close);
  }

  /* ── 쿠폰 화면 ── */
  function find(id){ for(var i=0;i<REC.length;i++){ if(REC[i].id===id) return REC[i]; } return null; }
  function coupon(rec){
    rec=find(rec.id)||rec; var st=ST[rec.status], how='';
    if(rec.status==='ready'){ how='<p class="note" style="text-align:center">계산대 직원에게 이 화면을 보여 주세요. 받으시면 직원이 아래에 번호를 넣어 「전달 완료」를 눌러요.</p>'; }
    if(rec.status==='wait'){ how='<p class="note" style="text-align:center">직원이 확인하면 선물을 드려요. 이 화면을 직원에게 보여 주세요.</p>'; }
    if(rec.status==='story'){ how='<p class="note" style="text-align:center">'+esc(shop())+' 이야기방에 한 줄 남기시면 선물이 열려요.</p>'
      +'<a class="go dark" style="display:flex;align-items:center;justify-content:center;text-decoration:none" href="https://uriyagi.kr/?g=e92887ad781a49f7a3e74194e912216e" target="_blank" rel="noopener">이야기방에 남기러 가기</a>'
      +'<button class="go light" type="button" data-c="left">남겼어요 (시험: 자동 확인 대신)</button>'; }
    var staff = rec.status!=='given' ? '<div class="row2"><label>직원 번호<input id="gP" inputmode="numeric" maxlength="6" placeholder="직원만"></label><label>&nbsp;<button class="go dark" type="button" data-c="staff" style="min-height:46px">'+(rec.status==='ready'?'전달 완료':'확인하고 전달')+'</button></label></div>' : '';
    open('<button class="x" type="button" data-c="x">닫기 ✕</button>'
      +'<div class="cp"><div class="shop">'+esc(shop())+'</div><span class="tier">'+TIER[rec.tier]+'</span><div class="pz">'+esc(rec.prize)+'</div>'
      +'<div class="meta">'+esc(rec.name)+(rec.seat?' · '+esc(rec.seat):'')+' · '+esc(rec.gname)+' · '+hm(rec.t)+'</div>'
      +'<div class="cd">'+esc(rec.code)+'</div><span class="chip" style="background:'+st[1]+'">'+st[0]+'</span></div>'
      +how+staff);
    gs.querySelector('[data-c=x]').addEventListener('click',close);
    var l=gs.querySelector('[data-c=left]'); if(l){ l.addEventListener('click',function(){ rec.status='ready'; save('nori-recs',REC); coupon(rec); }); }
    var s=gs.querySelector('[data-c=staff]'); if(s){ s.addEventListener('click',function(){
      var pin=$('gP').value.trim();
      function bad(){ $('gP').style.borderColor='#E1262D'; $('gP').value=''; $('gP').placeholder='번호가 달라요'; }
      function ok(){ rec.status='given'; rec.givenAt=Date.now(); sent[rec.id]=JSON.stringify(rec); save('nori-recs',REC); if(window.SND){ SND.ding?SND.ding():SND.win(); } coupon(rec); }
      if(CL){ s.disabled=true; run('give',[rec.id,pin],function(r){ s.disabled=false; if(r&&r.ok){ ok(); } else { bad(); } },function(){ s.disabled=false; toast('서버 연결이 잠깐 안 돼요'); }); return; }
      if(pin!==String(SET.staffPin)){ bad(); return; }
      ok(); }); }
  }

  /* ── 내 선물함 (이 폰에서 받은 쿠폰) ── */
  function myBox(){
    var list=REC.filter(function(r){ return mine.indexOf(r.id)>=0; }), h='';
    list.forEach(function(r){ var st=ST[r.status]; h+='<div class="mi"><b>'+TIER[r.tier]+' · '+esc(r.prize)+'</b><small>'+esc(r.gname)+' · '+hm(r.t)+' · <span style="color:'+st[1]+';font-weight:900">'+st[0]+'</span></small><button type="button" data-id="'+r.id+'">쿠폰 보기</button></div>'; });
    open('<button class="x" type="button" data-c="x">닫기 ✕</button><h3>내 선물함</h3>'+(h?'<div class="mlist">'+h+'</div>':'<div class="sum">아직 받은 선물이 없어요. 놀이를 마치면 <b>푸짐한 선물</b>을 드려요!</div>'));
    gs.querySelector('[data-c=x]').addEventListener('click',close);
    gs.querySelectorAll('.mi button').forEach(function(b){ b.addEventListener('click',function(){ coupon(find(b.getAttribute('data-id'))); }); });
  }

  /* ── 관리자 창 ── */
  function adminLogin(){
    open('<button class="x" type="button" data-c="x">닫기 ✕</button><h3>관리자 창</h3><label>관리자 번호<input id="aP" inputmode="numeric" maxlength="8" placeholder="처음 번호 0000"></label><button class="go dark" type="button" data-c="in">들어가기</button><p class="note">시험판 처음 번호는 0000이에요. 들어가서 바꾸세요.</p>');
    gs.querySelector('[data-c=x]').addEventListener('click',close);
    gs.querySelector('[data-c=in]').addEventListener('click',function(){ var p=$('aP').value.trim();
      if(CL){ run('list',[p],function(r){ if(r&&r.ok){ apin=p; MASTER=null; if(!C){ run('shopsDl',[p],function(d){ if(d&&d.ok){ MASTER=d; var t=gs.querySelector('.tabs2'); if(t&&!t.querySelector('[data-t=shops]')){ admin(gs.querySelector('.tabs2 [aria-selected=true]').getAttribute('data-t')); } } },function(){}); } REC=r.recs; REC.forEach(function(x){ sent[x.id]=JSON.stringify(x); }); try{ localStorage.setItem('nori-recs',JSON.stringify(REC)); }catch(e){} admin('rec'); } else { $('aP').value=''; $('aP').placeholder='번호가 달라요'; $('aP').style.borderColor='#E1262D'; } }); return; }
      if(p===String(SET.adminPin)){ admin('rec'); } else { $('aP').value=''; $('aP').placeholder='번호가 달라요'; $('aP').style.borderColor='#E1262D'; } });
  }
  function admin(tab){
    var tabs='<div class="tabs2'+(MASTER?' t4':'')+'" role="tablist"><button type="button" data-t="rec" aria-selected="'+(tab==='rec')+'">손님 기록</button><button type="button" data-t="gift" aria-selected="'+(tab==='gift')+'">선물 설정</button><button type="button" data-t="shop" aria-selected="'+(tab==='shop')+'">매장</button>'+(MASTER?'<button type="button" data-t="shops" aria-selected="'+(tab==='shops')+'">가게들</button>':'')+'</div>', body='';
    if(tab==='rec'){
      var today=new Date(); today.setHours(0,0,0,0);
      var td=REC.filter(function(r){ return r.t>=today.getTime(); }), wait=td.filter(function(r){ return r.status!=='given'; }).length;
      body='<div class="stat"><div><b>'+td.length+'</b>오늘 손님</div><div><b>'+td.filter(function(r){return r.win;}).length+'</b>이긴 손님</div><div><b>'+wait+'</b>줄 선물</div><div><b>'+td.filter(function(r){return r.status==='given';}).length+'</b>전달 완료</div></div><div class="mlist">';
      if(!REC.length){ body+='<div class="sum">아직 기록이 없어요. 손님이 놀이를 마치고 「선물 받기」를 누르면 여기에 쌓여요.</div>'; }
      REC.forEach(function(r){ var st=ST[r.status]; body+='<div class="mi"><b>'+esc(r.name)+(r.seat?' · '+esc(r.seat):'')+' — '+TIER[r.tier]+' '+esc(r.prize)+'</b><small>'+hm(r.t)+' · '+esc(r.gname)+' · '+esc(r.opp||'')+(LVTAG[r.lv]?'('+LVTAG[r.lv]+')':'')+' · '+(r.win?'이김':'짐')+' · '+esc(r.detail||'')+' · 번호 '+esc(r.code)+' · <span style="color:'+st[1]+';font-weight:900">'+st[0]+'</span></small><button type="button" data-g="'+r.id+'"'+(r.status==='given'?' disabled':'')+'>'+(r.status==='given'?'전달함':'전달하기')+'</button></div>'; });
      body+='</div>'+(REC.length?'<button class="go light" type="button" data-c="clr">이 폰 기록 삭제</button>':'');
    }
    if(tab==='gift'){
      function sel(id,v){ var inList=PRESET.indexOf(v)>=0; return '<select id="'+id+'">'+PRESET.map(function(x){ return '<option'+(x===v?' selected':'')+'>'+esc(x)+'</option>'; }).join('')+'<option value="__own"'+(inList?'':' selected')+'>직접 쓰기</option></select><input id="'+id+'o" placeholder="선물 이름 쓰기" value="'+(inList?'':esc(v))+'" style="'+(inList?'display:none':'')+'">'; }
      body='<label>이기면 받는 선물'+sel('s1',SET.prizes.p1)+'</label><label>참가 선물 (진 손님 · 친구끼리)'+sel('s0',SET.prizes.p0)+'</label><label>오늘의 특별 선물 (비우면 안 보임)<input id="sS" maxlength="30" placeholder="예: 첫 손님 막걸리 한 병" value="'+esc(SET.prizes.sp||'')+'"></label>'
        +'<div class="rad"><b style="font-size:13px;color:#6B5A30">선물 주는 조건</b>'
        +'<label><input type="radio" name="cd" value="a"'+(SET.cond==='a'?' checked':'')+'><span>(가) 놀이만 마치면<small>쿠폰이 바로 열림 · 직원은 전달만 확인</small></span></label>'
        +'<label><input type="radio" name="cd" value="b"'+(SET.cond==='b'?' checked':'')+'><span>(나) 직원이 확인하고<small>직원 번호를 넣어야 전달</small></span></label>'
        +'<label><input type="radio" name="cd" value="c"'+(SET.cond==='c'?' checked':'')+'><span>(다) 이야기방에 남기면<small>자동 확인은 우리 이야기 연결 뒤 · 지금은 「남겼어요」로 시험</small></span></label></div>'
        +'<div class="row2"><label>직원 번호'+(CL?' (바꿀 때만)':'')+'<input id="sP" inputmode="numeric" maxlength="6" value="'+(CL?'':esc(SET.staffPin))+'"></label><label>관리자 번호'+(CL?' (바꿀 때만)':'')+'<input id="sA" inputmode="numeric" maxlength="8" value="'+(CL?'':esc(SET.adminPin))+'"></label></div>'
        +'<button class="go dark" type="button" data-c="sv">저장</button>';
    }
    if(tab==='shop'){
      var sp=load('nori-shop',{s:'다복'});
      body='<label>상호<input id="hS" maxlength="8" value="'+esc(sp.s||'다복')+'"></label>'
        +'<div class="sum">놀이 상대 이름: <b>'+esc((sp.s||'다복')+' 사장님')+'</b></div>'
        +'<button class="go dark" type="button" data-c="svs">저장</button>'
        /* 261125 우리 가게 QR — 포스터 · 현수막 · 탁자 위에 붙일 QR. 주소에 가게 번호(?c=)가 들어감 */
        +'<h3 style="margin:14px 0 0;font-size:16px">우리 가게 QR</h3>'
        +'<div class="sum">손님이 이 QR 로 들어오면 <b>'+esc(sp.s||'다복')+'</b> 놀이 · 선물 · 기록으로 이어져요.<br><span style="font-size:12.5px;word-break:break-all;color:#6B5A30">'+esc(qrURL())+'</span></div>'
        +'<img id="qrP" alt="우리 가게 QR 포스터" style="display:block;width:100%;max-width:300px;margin:0 auto;border-radius:12px">'
        +'<div class="row2"><button class="go dark" type="button" data-c="qrs">QR 사진 저장</button><button class="go light" type="button" data-c="qru">주소 복사</button></div>'
        +'<p class="note" style="margin:0">저장이 안 되면 그림을 길게 눌러 저장하세요. 인쇄는 A4 한 장에 크게 뽑으면 돼요.</p>'
        /* 261126 사랑흐름 서비스 이용 입구 (총괄 47번 · 놀이 22번 v1.1) — 「매장」 칸 맨 아래 한 줄 · 개인 사업자 칸 */
        +'<p class="fuse" style="margin:14px 0 0;text-align:center"><a href="https://www.loveflow.ai.kr/use/#b" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;min-height:48px;padding:0 10px;font-size:14px;font-weight:800;color:#1E4A76;text-decoration:none">우리 가게를 더 알리려면 · 사랑흐름 서비스 이용 ›</a></p>';
    }
    if(tab==='shops'&&MASTER){
      body='<div class="sum">가게 <b>'+MASTER.rows.length+'곳</b> · 가게 명단은 파일 하나로 올려요. 먼저 내려받아 빈칸을 채우고 새 줄을 더해 다시 올리세요.</div>'
        +'<button class="go dark" type="button" data-c="fUp">가게 파일 올리기</button>'
        +'<div class="row2" style="grid-template-columns:1fr 1fr"><button class="go light" type="button" data-c="fDl">가게 내려받기</button><button class="go light" type="button" data-c="fPa">가게 붙여 넣기</button></div>'
        +'<input type="file" id="fF" accept=".xlsx,.csv,.txt,.xls,.hwp,.hwpx,.doc,.docx" hidden>'
        +'<div id="fPB" hidden><textarea id="fPT" rows="5" placeholder="엑셀 · 한글 · 카톡 표를 복사해 여기에 붙여 넣으세요" style="width:100%;font:inherit;font-size:14px;border:0;border-radius:12px;background:#F1ECE2;padding:10px"></textarea><button class="go dark" type="button" data-c="fPG" style="width:100%">가게 붙여 넣기</button></div>'
        +'<div id="fR"></div>'
        +'<div class="mlist" id="fL">'+shopsList()+'</div>';
    }
    open('<button class="x" type="button" data-c="x">닫기 ✕</button><h3>관리자 창</h3>'+tabs+body+'<p class="note">'+(CL?'기록은 구글 시트 「손님기록」에 함께 모여요. 「이 폰 기록 삭제」는 이 폰 화면만 비워요(시트는 그대로).':'시험판: 기록은 이 폰에만 남아요. 본 서비스에서는 손님 폰 기록이 구글 시트로 모여 주인장 폰에서 함께 봐요.')+'</p>');
    gs.querySelector('[data-c=x]').addEventListener('click',close);
    gs.querySelectorAll('.tabs2 button').forEach(function(b){ b.addEventListener('click',function(){ admin(b.getAttribute('data-t')); }); });
    gs.querySelectorAll('[data-g]').forEach(function(b){ b.addEventListener('click',function(){ var r=find(b.getAttribute('data-g'));
      if(CL){ run('give',[r.id,apin],function(x){ if(x&&x.ok){ r.status='given'; r.givenAt=Date.now(); sent[r.id]=JSON.stringify(r); save('nori-recs',REC); admin('rec'); } }); return; }
      r.status='given'; r.givenAt=Date.now(); save('nori-recs',REC); admin('rec'); }); });
    var c=gs.querySelector('[data-c=clr]'); if(c){ c.addEventListener('click',function(){ if(c.getAttribute('data-sure')){ REC=[]; mine=[]; save('nori-recs',REC); save('nori-mine',mine); admin('rec'); } else { c.setAttribute('data-sure','1'); c.textContent='한 번 더 누르면 지워져요'; } }); }
    ['s1','s0'].forEach(function(id){ var e=$(id); if(e){ e.addEventListener('change',function(){ $(id+'o').style.display=e.value==='__own'?'':'none'; }); } });
    function pv(id){ var e=$(id); return e.value==='__own'?$(id+'o').value.trim():e.value; }
    var v=gs.querySelector('[data-c=sv]'); if(v){ v.addEventListener('click',function(){ SET.prizes={p1:pv('s1')||DEF.prizes.p1,p0:pv('s0')||DEF.prizes.p0,sp:$('sS').value.trim()}; var r=gs.querySelector('input[name=cd]:checked'); SET.cond=r?r.value:'a'; var sp=$('sP').value.trim(), sa=$('sA').value.trim();
      if(CL){ run('setSettings',[apin,{prizes:SET.prizes,cond:SET.cond,shop:load('nori-shop',{s:'다복',h:'사장님'})},sp,sa],function(x){ if(x&&x.ok){ if(sa){ apin=sa; } save('nori-gift-set',{prizes:SET.prizes,cond:SET.cond}); marquee(); v.textContent='저장했어요 ✓ (모든 손님 폰에 적용)'; } }); return; }
      SET.staffPin=sp||'1234'; SET.adminPin=sa||'0000'; save('nori-gift-set',SET); marquee(); v.textContent='저장했어요 ✓'; }); }
    var vs=gs.querySelector('[data-c=svs]'); if(vs){ vs.addEventListener('click',function(){ var shp={s:$('hS').value.trim()||'다복',h:'사장님'}; save('nori-shop',shp); shopText();
      if(CL){ run('setSettings',[apin,{prizes:SET.prizes,cond:SET.cond,shop:shp},'',''],function(){ admin('shop'); }); return; } admin('shop'); }); }
    var qp=$('qrP'); if(qp){ var png=qrPoster(); if(png){ qp.src=png; }
      gs.querySelector('[data-c=qrs]').addEventListener('click',function(){ var a=document.createElement('a'); a.href=qp.src; a.download='우리가게QR_'+(C||'기본')+'.png'; document.body.appendChild(a); a.click(); a.remove(); });
      gs.querySelector('[data-c=qru]').addEventListener('click',function(){ var u=qrURL(), b=this; function ok(){ b.textContent='복사했어요 ✓'; }
        if(navigator.clipboard){ navigator.clipboard.writeText(u).then(ok,function(){ prompt('주소',u); }); } else { prompt('주소',u); } }); }    if(tab==='shops'){ shopsWire(); }
  }
  function shopsList(){ return MASTER.rows.slice(0,5).map(function(r){ return '<div class="mi"><b>'+esc(r[0])+' · '+esc(r[1]||'(상호 아직)')+'</b><small>'+esc(r[2]?'이기면 '+r[2]:'')+(r[7]?' · '+esc(r[7]):'')+'</small></div>'; }).join('')+(MASTER.rows.length>5?'<div class="sum" style="font-size:12.5px">그 밖 '+(MASTER.rows.length-5)+'곳은 「가게 내려받기」로 보세요</div>':''); }
  /* ── 가게 파일 올리기 (261125 · 사랑흐름-총괄-035 파일 올리기 공통 꼴 · 서버 v5) — 대표 번호 · 기본 주소에서만 ── */
  function shopsWire(){ var R=$('fR'), FR=null, FN='', FQ=''; if(!R) return;
    function loadXlsx(cb){ if(window.XLSX) return cb(); var sc=document.createElement('script'); sc.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; sc.onload=function(){ cb(); }; sc.onerror=function(){ cb(new Error('x')); }; document.head.appendChild(sc); }
    function splitText(t){ t=String(t||'').replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'); var L=t.split('\n'); while(L.length&&!L[L.length-1].trim()){ L.pop(); } if(!L.some(function(x){ return x.trim(); })) return [];
      var hd=L.slice(0,10), d=hd.some(function(x){ return x.indexOf('\t')>=0; })?'\t':(hd.some(function(x){ return x.indexOf(',')>=0; })?',':(hd.some(function(x){ return x.indexOf('|')>=0; })?'|':null));
      return L.map(function(x){ if(!x.trim()) return []; if(!d) return x.trim().split(/\s{2,}/); if(d!==',') return x.split(d).map(function(c){ return c.trim(); });
        var o=[],c='',q=false; for(var i=0;i<x.length;i++){ var ch=x[i]; if(q){ if(ch==='"'&&x[i+1]==='"'){ c+='"'; i++; } else if(ch==='"'){ q=false; } else { c+=ch; } } else if(ch==='"'){ q=true; } else if(ch===','){ o.push(c.trim()); c=''; } else { c+=ch; } } o.push(c.trim()); return o; }); }
    function few(list,n,f){ return list.slice(0,n).map(f).join('')+(list.length>n?'<p class="note">그 밖 '+(list.length-n)+'줄</p>':''); }
    function show(d){ if(!d||!d.ok){ R.innerHTML='<div class="sum" style="color:#E1262D">'+esc((d&&d.msg)||'읽지 못했어요')+'</div>'; return; }
      var h='<div class="sum"><b style="color:#1B1A1F">'+esc(FN)+'</b> · '+d.rows+'줄 · 읽은 칸: '+esc(d.head.join(' · '))+(d.refused&&d.refused.length?'<br><span style="color:#E1262D">이 칸은 올리지 않아요: '+esc(d.refused.join(' · '))+'</span>':'')
        +'<br><b style="font-size:15px;color:#1B1A1F">빈칸 채움 '+d.fill+' · 새로 더함 '+d.add+' · 다른 값 '+d.diff+'곳 · 못 맞춘 줄 '+d.miss+'개</b></div>';
      if(d.done){
        h+='<div class="sum">'+(d.again?'이미 넣은 파일이에요(한 번만 넣었어요).':'넣었어요.')+'</div>';
        if(d.news&&d.news.length){ h+='<div class="sum"><b>새 가게 '+d.news.length+'곳</b> — 번호는 지금 한 번만 보여요. 꼭 내려받아 두세요.'+few(d.news,5,function(x){ return '<p class="note" style="color:#1B1A1F">'+esc(x.c)+' · '+esc(x.s||'(상호 아직)')+' · 관리자 '+esc(x.admin)+' · 직원 '+esc(x.staff)+'</p>'; })+'</div><button class="go dark" type="button" data-c="fNew" style="width:100%">새 가게 번호 내려받기</button>'; }
        R.innerHTML=h; try{ R.scrollIntoView({block:'start'}); }catch(e){} var nb=R.querySelector('[data-c=fNew]'); if(nb){ nb.addEventListener('click',function(){ csv('그때그놀이_새가게번호',[['가게 번호','상호','관리자 번호','직원 번호','손님 주소']].concat(d.news.map(function(x){ return [x.c,x.s,x.admin,x.staff,x.url]; }))); }); }
        run('shopsDl',[apin],function(z){ if(z&&z.ok){ MASTER=z; var L=$('fL'); if(L){ L.innerHTML=shopsList(); } var n=gs.querySelector('.sum b'); if(n&&/곳$/.test(n.textContent)){ n.textContent=MASTER.rows.length+'곳'; } } },function(){}); return; }
      if(d.diff){ h+='<label style="flex-direction:row;align-items:center;gap:8px;font-size:14px"><input type="checkbox" id="fOv" style="width:auto"> 다른 값 '+d.diff+'곳은 파일대로</label>'; }
      h+='<div class="row2" style="grid-template-columns:1.4fr 1fr"><button class="go dark" type="button" data-c="fGo"'+((d.fill+d.add+d.diff)?'':' disabled')+'>가게 올리기</button><button class="go light" type="button" data-c="fNo">그만두기</button></div>';
      if(d.diffs.length){ h+='<p class="note"><b>다른 값</b></p>'+few(d.diffs,3,function(x){ return '<p class="note">'+x.line+'째 줄 · '+esc(x.name)+' · '+esc(x.col)+': 지금 「'+esc(x.old)+'」 › 파일 「'+esc(x.now)+'」</p>'; }); }
      if(d.misses.length){ h+='<p class="note"><b>못 맞춘 줄</b></p>'+few(d.misses,3,function(x){ return '<p class="note" style="color:#E1262D">'+x.line+'째 줄 · '+(x.name?esc(x.name)+' · ':'')+esc(x.why)+'</p>'; }); }
      if(d.notes.length){ h+='<p class="note"><b>넣지 않은 칸</b></p>'+few(d.notes,3,function(x){ return '<p class="note">'+x.line+'째 줄 · '+esc(x.msg)+'</p>'; }); }
      R.innerHTML=h; try{ R.scrollIntoView({block:'start'}); }catch(e){}
      R.querySelector('[data-c=fNo]').addEventListener('click',function(){ FR=null; R.innerHTML=''; });
      R.querySelector('[data-c=fGo]').addEventListener('click',function(){ var b=this; b.disabled=true; b.textContent='넣는 중이에요…'; var ov=$('fOv');
        run('shopFile',[apin,FR,false,!!(ov&&ov.checked),FQ,FN],function(r){ if(!r||!r.ok){ b.disabled=false; b.textContent='가게 올리기'; toast((r&&r.msg)||'넣지 못했어요'); return; } show(r); },function(){ b.disabled=false; b.textContent='가게 올리기'; toast('서버 연결이 잠깐 안 돼요. 다시 눌러 주세요'); }); }); }
    function preview(rows,name){ FR=rows; FN=name; FQ='S'+Date.now().toString(36)+Math.random().toString(36).slice(2,8); R.innerHTML='<div class="sum">맞춰 보는 중이에요…</div>';
      run('shopFile',[apin,rows,true,false,'',name],show,function(){ R.innerHTML=''; toast('서버 연결이 잠깐 안 돼요. 다시 눌러 주세요'); }); }
    function csv(nm,rows){ var t='\uFEFF'+rows.map(function(r){ return r.map(function(c){ c=String(c==null?'':c); return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c; }).join(','); }).join('\n');
      var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'})); a.download=nm+'.csv'; document.body.appendChild(a); a.click(); a.remove(); }
    gs.querySelector('[data-c=fUp]').addEventListener('click',function(){ $('fF').click(); });
    gs.querySelector('[data-c=fPa]').addEventListener('click',function(){ var b=$('fPB'); b.hidden=!b.hidden; if(!b.hidden){ $('fPT').focus(); } });
    gs.querySelector('[data-c=fPG]').addEventListener('click',function(){ var r=splitText($('fPT').value); if(!r.length){ toast('붙여 넣은 표가 없어요'); return; } preview(r,'붙여 넣은 표'); });
    $('fF').addEventListener('change',function(){ var f=this.files&&this.files[0]; if(!f) return; var nm=f.name, lo=nm.toLowerCase(); this.value='';
      if(/\.xls$/.test(lo)){ toast('옛 엑셀(.xls)은 읽지 못해요. 표를 복사해 「가게 붙여 넣기」로 넣어 주세요'); return; }
      if(/\.(hwp|hwpx|doc|docx)$/.test(lo)){ toast('한글 · 워드 파일은 읽지 못해요. 표를 복사해 「가게 붙여 넣기」로 넣어 주세요'); return; }
      if(/\.xlsx$/.test(lo)){ loadXlsx(function(err){ if(err){ toast('엑셀을 여는 도구를 불러오지 못했어요. CSV로 저장해 올려 주세요'); return; }
        var rd=new FileReader(); rd.onload=function(){ try{ var wb=XLSX.read(rd.result,{type:'array'}), ws=wb.Sheets[wb.SheetNames[0]]; preview(XLSX.utils.sheet_to_json(ws,{header:1,raw:false,defval:''}),nm); }catch(e){ toast('이 파일은 열 수 없어요. CSV로 저장해 올려 주세요'); } }; rd.readAsArrayBuffer(f); }); return; }
      var rd=new FileReader(); rd.onload=function(){ var t=String(rd.result||''); if(/\uFFFD/.test(t.slice(0,2000))){ var r2=new FileReader(); r2.onload=function(){ preview(splitText(r2.result),nm); }; r2.readAsText(f,'euc-kr'); return; } preview(splitText(t),nm); }; rd.readAsText(f,'utf-8'); });
    gs.querySelector('[data-c=fDl]').addEventListener('click',function(){ var rows=[MASTER.head].concat(MASTER.rows), d=new Date(), nm='그때그놀이_가게_'+String(d.getFullYear()).slice(2)+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
      loadXlsx(function(err){ try{ if(err) throw err; var ws=XLSX.utils.aoa_to_sheet(rows), wb=XLSX.utils.book_new(); ws['!cols']=MASTER.head.map(function(h){ return {wch:/주소|메모/.test(h)?34:14}; }); XLSX.utils.book_append_sheet(wb,ws,'가게'); var buf=XLSX.write(wb,{bookType:'xlsx',type:'array'});
        var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})); a.download=nm+'.xlsx'; document.body.appendChild(a); a.click(); a.remove(); toast('가게 명단을 엑셀로 내려받았어요'); }
        catch(e){ csv(nm,rows); toast('엑셀 도구가 없어 CSV로 내려받았어요'); } }); });
  }
  /* ── 우리 가게 QR (261125) ── 가게 번호가 있으면 ?c=번호 · 없으면 기본 주소 */
  function qrURL(){ var b=String(window.NORI_URL||'https://www.loveflow.ai.kr/nori/').replace(/[?#].*$/,''); return C?b+'?c='+C:b; }
  function qrPoster(){ if(typeof qrcode!=='function') return '';
    var q=qrcode(0,'M'); q.addData(qrURL()); q.make(); var n=q.getModuleCount();
    var W=1080,H=1440, cv=document.createElement('canvas'); cv.width=W; cv.height=H; var g=cv.getContext('2d'); if(!g) return '';
    var F='"Pretendard","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    g.fillStyle='#FFFFFF'; g.fillRect(0,0,W,H);
    g.fillStyle='#16181D'; g.fillRect(0,0,W,190);
    g.textAlign='center'; g.textBaseline='middle';
    g.fillStyle='#FFC21A'; g.font='900 92px '+F; g.fillText('그때 그 놀이',W/2,98);
    g.fillStyle='#16181D'; g.font='900 64px '+F; g.fillText(shop()+'에서 옛날 놀이 한 판!',W/2,292);
    var sz=720, cell=Math.floor(sz/(n+8)), qs=cell*(n+8), x0=Math.round((W-qs)/2), y0=370;
    g.fillStyle='#FFFFFF'; g.fillRect(x0,y0,qs,qs); g.fillStyle='#000000';
    for(var r=0;r<n;r++){ for(var c=0;c<n;c++){ if(q.isDark(r,c)){ g.fillRect(x0+(c+4)*cell,y0+(r+4)*cell,cell,cell); } } }
    var yb=y0+qs+40;
    g.fillStyle='#16181D'; g.font='800 48px '+F; g.fillText('휴대폰 카메라로 비춰 보세요',W/2,yb+20);
    g.fillStyle='#E1262D'; g.font='900 54px '+F; g.fillText('이기면 '+(SET.prizes.p1||'선물'),W/2,yb+110);
    g.fillStyle='#6B5A30'; g.font='700 40px '+F; g.fillText('가입 · 앱 설치 없이 바로 놀아요',W/2,yb+190);
    g.fillStyle='#9A8B66'; g.font='600 28px '+F; g.fillText(qrURL().replace(/^https?:\/\//,''),W/2,H-50);
    try{ return cv.toDataURL('image/png'); }catch(e){ return ''; } }

  /* ── 메인 화면에 선물 · 상호 반영 ── */
  function marquee(){ var m=document.querySelector('.mq-in'); if(!m) return;
    m.innerHTML='<span class="tag">푸짐한 선물</span><span><b>이기면</b>'+esc(SET.prizes.p1)+'</span><span><b>참가 선물</b>'+esc(SET.prizes.p0)+'</span>'+(SET.prizes.sp?'<span><b>오늘의 특별 선물</b>'+esc(SET.prizes.sp)+'</span>':'')+'<span><b>받는 법</b>놀이를 마치면 「선물 받기」</span>'; }
  function shopText(){ var s=shop(); document.querySelectorAll('.shopN').forEach(function(e){ e.textContent=s; }); var r=document.querySelector('.room'); if(r&&r.childNodes[1]){ r.childNodes[1].nodeValue=s+' 이야기방'; } }
  function toast(t){ var el=document.getElementById('toast'); if(!el) return; el.textContent=t; el.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(function(){ el.classList.remove('on'); },2400); }

  /* ── 연결 ── */
  window.addEventListener('message',function(e){ var d=e.data; if(!d||typeof d!=='object') return; if(d.nori==='result'&&d.r){ result(d.r); } if(d.nori==='gift'){ claim(); } });
  var bur=document.querySelector('.burger'); if(bur){ bur.style.cursor='pointer'; bur.setAttribute('role','button'); bur.setAttribute('aria-label','메뉴'); bur.setAttribute('tabindex','0');
    bur.addEventListener('click',function(e){ e.stopPropagation(); menu.classList.toggle('on'); }); }
  document.addEventListener('click',function(){ menu.classList.remove('on'); });
  menu.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; menu.classList.remove('on'); var mm=b.getAttribute('data-m'); if(mm==='mine'){ myBox(); } else if(mm==='home'){ if(window.LFHomeAdd){ LFHomeAdd(); } else { toast('브라우저 메뉴에서 「홈 화면에 추가」를 눌러 주세요'); } } else if(mm==='share'){ var f=document.getElementById('fShare'); if(f){ f.click(); } } else { adminLogin(); } });
  marquee(); shopText();
  run('info',[],function(x){ if(!x) return; if(x.unknown&&C){ C=''; window.NORI_C=''; try{ localStorage.removeItem('nori-c'); }catch(e){} window.NORI_URL=String(window.NORI_URL||'').replace(/[?#].*$/,''); return; } if(!window.NORI_URL){ window.NORI_URL=x.url||''; } if(x.set){ if(x.set.prizes){ var xp=x.set.prizes; SET.prizes={p1:xp.p1||DEF.prizes.p1,p0:xp.p0||DEF.prizes.p0,sp:xp.sp||''}; } if(x.set.cond){ SET.cond=x.set.cond; } if(x.set.shop){ save('nori-shop',x.set.shop); } marquee(); shopText(); } },function(){});
  return {claim:claim, myBox:myBox, result:result};
})();
