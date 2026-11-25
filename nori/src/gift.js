/* 그때 그 놀이 · 선물 받기 · 내 선물함 · 관리자 창 v2 (261121)
   claude.ai 시험판: 이 폰 안에만 저장.  Apps Script 웹 앱으로 열리면(google.script.run 있음) 구글 시트에 함께 저장 · 번호 확인은 서버가 함. */
window.GIFT=(function(){
  var $=function(id){return document.getElementById(id);};
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function load(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||'null'); return v==null?d:v; }catch(e){ return d; } }
  function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} if(k==='nori-recs'||k==='nori-mine'){ push(); } }
  /* ── 구글 시트 연결 (웹 앱일 때만) ── */
  var GSR=!!(window.google&&google.script&&google.script.run), API=window.NORI_API||'', CL=GSR||!!API, sent={}, apin='';
  function run(fn,args,ok,bad){ if(!CL) return; bad=bad||function(){ toast('서버 연결이 잠깐 안 돼요. 다시 눌러 주세요'); };
    if(GSR){ var r=google.script.run.withSuccessHandler(ok||function(){}).withFailureHandler(bad); r[fn].apply(r,args||[]); return; }
    /* /nori/ 손님 화면 → Apps Script(뒤) — 사랑흐름-총괄-002 결정 ② */
    fetch(API,{method:'POST',body:JSON.stringify({fn:fn,args:args||[]})}).then(function(x){ return x.json(); }).then(function(j){ if(!j||!j.ok) throw 0; ok&&ok(j.res); }).catch(function(){ bad(); }); }
  function push(){ if(!CL) return; REC.forEach(function(r){ if(!apin && mine.indexOf(r.id)<0) return; var j=JSON.stringify(r); if(sent[r.id]!==j){ sent[r.id]=j; run('put',[r]); } }); }
  /* plan: 무료 · 유료를 가를 칸 (총괄-009 지시 5, 261123) — 지금은 모두 'free'. 결제하면 'paid' 로 켜짐 */
  var DEF={prizes:{p1:'음료 한 잔',p0:'사탕 하나',sp:''}, cond:'a', staffPin:'1234', adminPin:'0000', plan:'free'};
  var PRESET=['음료 한 잔','식혜 한 잔','반찬 하나 더','떡볶이 한 접시','뻥튀기 한 봉','사탕 하나','10% 할인','다음 방문 쿠폰'];
  var SET=load('nori-gift-set',DEF); SET.prizes=SET.prizes||DEF.prizes; if(SET.prizes.p2!=null&&SET.prizes.sp==null){ SET.prizes={p1:SET.prizes.p1||DEF.prizes.p1,p0:SET.prizes.p0||DEF.prizes.p0,sp:''}; }
  window.noriPlan=function(){ return (SET&&SET.plan)||'free'; };
  var REC=load('nori-recs',[]), last=null, mine=load('nori-mine',[]);
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
   +'.tabs2{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}'
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
      if(CL){ run('list',[p],function(r){ if(r&&r.ok){ apin=p; REC=r.recs; REC.forEach(function(x){ sent[x.id]=JSON.stringify(x); }); try{ localStorage.setItem('nori-recs',JSON.stringify(REC)); }catch(e){} admin('rec'); } else { $('aP').value=''; $('aP').placeholder='번호가 달라요'; $('aP').style.borderColor='#E1262D'; } }); return; }
      if(p===String(SET.adminPin)){ admin('rec'); } else { $('aP').value=''; $('aP').placeholder='번호가 달라요'; $('aP').style.borderColor='#E1262D'; } });
  }
  function admin(tab){
    var tabs='<div class="tabs2" role="tablist"><button type="button" data-t="rec" aria-selected="'+(tab==='rec')+'">손님 기록</button><button type="button" data-t="gift" aria-selected="'+(tab==='gift')+'">선물 설정</button><button type="button" data-t="shop" aria-selected="'+(tab==='shop')+'">매장</button></div>', body='';
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
        +'<button class="go dark" type="button" data-c="svs">저장</button>';
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
  }

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
  run('info',[],function(x){ if(!x) return; if(!window.NORI_URL){ window.NORI_URL=x.url||''; } if(x.set){ if(x.set.prizes){ SET.prizes=x.set.prizes; } if(x.set.cond){ SET.cond=x.set.cond; } if(x.set.shop){ save('nori-shop',x.set.shop); } marquee(); shopText(); } },function(){});
  return {claim:claim, myBox:myBox, result:result};
})();
