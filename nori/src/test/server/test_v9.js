/* 서버 v9 흉내 시험 (261127 · 그때그놀이 100번 2장) — CODE=./Code_v9.gs node test_v9.js
   남기는 방 · 시트 번호 속성 · 무료 하루 한 건(선물 · 이야기방) · 한국 밤 12시 · 유료 가게 · NORI_FREE_DAY 0 · 매일 점검 한 줄 칸 수와 색 · 소스에 시트 번호 없음 */
const fs=require('fs'),vm=require('vm');
const SRC=fs.readFileSync(process.env.CODE||__dirname+'/Code_v9.gs','utf8');
function mk(init){
 const props=Object.assign({},init||{}),cache={},books={},logs=[];let shift=0;
 class D extends Date{ constructor(...a){ if(a.length===0) super(Date.now()+shift); else super(...a); } static now(){ return Date.now()+shift; } }
 const sheet=()=>{const rows=[],bg={};return {rows,bg,appendRow:r=>rows.push(r.slice()),setFrozenRows(){},getLastRow:()=>rows.length,
  deleteRows:(at,n)=>rows.splice(at-1,n),insertRowsBefore:(at,n)=>rows.splice(at-1,0,...Array.from({length:n},()=>[])),
  getRange:(r,c,nr=1,nc=1)=>({setFontWeight(){return this},setBackground(v){bg[r+':'+c]=v;return this},setValue(v){rows[r-1]=rows[r-1]||[];rows[r-1][c-1]=v;return this},
   getValue:()=> (rows[r-1]||[])[c-1],getValues:()=>{const o=[];for(let i=0;i<nr;i++){const x=(rows[r-1+i]||[]).slice(c-1,c-1+nc);while(x.length<nc)x.push('');o.push(x)}return o},
   setValues(v){v.forEach((row,i)=>{rows[r-1+i]=rows[r-1+i]||[];row.forEach((x,j)=>rows[r-1+i][c-1+j]=x)});return this}})}};
 const book=id=>books[id]||(books[id]={tabs:{},getSheetByName(n){return this.tabs[n]||null},insertSheet(n){return (this.tabs[n]=sheet())}});
 const trig=[];
 const ctx={JSON,Date:D,Math,String,Number,Object,Array,RegExp,isNaN,Error,
  Logger:{log:m=>logs.push(String(m))},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]??null,setProperty:(k,v)=>{props[k]=String(v)},deleteProperty:k=>{delete props[k]},getProperties:()=>Object.assign({},props)})},
  CacheService:{getScriptCache:()=>({get:k=>cache[k]??null,put:(k,v)=>{cache[k]=v}})},
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  SpreadsheetApp:{openById:id=>{ if(!id) throw new Error('no id'); return book(id); }},
  ScriptApp:{getProjectTriggers:()=>trig,newTrigger:h=>({timeBased:()=>({everyDays:()=>({atHour:a=>({create(){trig.push({getHandlerFunction:()=>h,h:a})}})})})}),getService:()=>({getUrl:()=>'U'})},
  ContentService:{createTextOutput:t=>({setMimeType(){return t}}),MimeType:{JSON:1}},
  HtmlService:{}};
 vm.createContext(ctx); vm.runInContext(SRC,ctx);
 return {ctx,props,books,logs,cache,trig,tab:(id,n)=>book(id).tabs[n],go:ms=>{shift+=ms},clearCache:()=>{for(const k in cache) delete cache[k]}};
}
let n=0,f=0; const ok=(c,m)=>{n++; if(!c){f++;console.log('✗',m)} };
const post=(ctx,o)=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(o)}}));
const ROOM='https://uriyagi.kr/?g=aaaa1111bbbb2222cccc3333dddd4444', ROOM2='https://uriyagi.kr/?g=eeee5555ffff6666';
const BASE={NORI_SHEET_ID:'S1',ADMIN_PIN:'999999'};

// 0 소스에 시트 번호 없음
ok(!/['"][A-Za-z0-9_-]{40,}['"]/.test(SRC)&&!/19UasNXz/.test(SRC),'소스에 시트 번호 0');
ok(!/e92887ad/.test(SRC),'소스에 C 0300 초대 링크 0');

// 1 시트 번호 속성
{ const m=mk({}); m.ctx.setup(); ok(/NORI_SHEET_ID/.test(m.logs.join())&&!m.books.S1&&m.trig.length===0,'속성 없으면 setup 이 알리고 아무것도 안 함');
  const r=post(m.ctx,{fn:'put',args:[{id:'r1234567890',t:Date.now(),name:'김',win:true,code:'AB12',dev:'dabc1234'}]}); ok(r.ok===false&&r.err==='bad','속성 없으면 put 거절(bad)');
  ok(Number(m.props['ERRN_'+m.ctx.day_()])===1,'오류 셈 1'); }
const m=mk(BASE), C=m.ctx; C.setup();
ok(m.tab('S1','무료한도')&&m.tab('S1','무료한도').rows[0].join()==='날짜,기기,종류,가게,시각','무료한도 탭');
ok(m.trig.some(t=>t.getHandlerFunction()==='dailyLine'&&t.h===5)&&m.trig.some(t=>t.getHandlerFunction()==='cleanPlays'&&t.h===4),'예약: 정리 4시 · 한 줄 5시');
C.setup(); ok(m.trig.length===2,'setup 두 번 해도 예약 둘');
ok(/아직 없는 속성: NORI_ROOM_DEFAULT, OPS_SHEET_ID/.test(m.logs.slice(-1)[0]),'없는 속성 알림');

// 2 남기는 방
let inf=post(C,{fn:'info',args:[]}).res; ok(inf.room===''&&inf.ask==='https://www.loveflow.ai.kr/'&&inf.free===1,'기본 방 없음 → 빈칸 · 상담 사랑흐름 홈 · 하루 1');
m.props.NORI_ROOM_DEFAULT=ROOM; inf=post(C,{fn:'info',args:[]}).res; ok(inf.room===ROOM,'기본 방');
m.props.NORI_ROOM_DEFAULT='https://evil.kr/?g=1'; ok(post(C,{fn:'info',args:[]}).res.room==='','uriyagi.kr 아니면 빈칸');
m.props.NORI_ROOM_DEFAULT=ROOM; m.props.NORI_ASK_URL='https://www.loveflow.ai.kr/ask'; ok(post(C,{fn:'info',args:[]}).res.ask==='https://www.loveflow.ai.kr/ask','상담 주소 속성');
C.addShop(); C.addShop(); const [c1,c2]=JSON.parse(m.props.SHOPS);
ok(post(C,{fn:'info',args:[],c:c1}).res.room===ROOM,'가게 방 비면 기본 방');
let sf=post(C,{fn:'shopFile',args:['999999',[['가게 번호','상호','남기는 방'],[c1,'다복',ROOM2],[c2,'둘째','https://bad.com/x'],['','새집',ROOM2]],false,false,'req00001','t.csv']}).res;
ok(sf.ok&&sf.done&&sf.add===1&&sf.head.includes('남기는 방'),'파일 「남기는 방」 칸 읽음');
ok(sf.notes.some(x=>/uriyagi/.test(x.msg)),'틀린 방 주소 알림');
ok(post(C,{fn:'info',args:[],c:c1}).res.room===ROOM2&&post(C,{fn:'info',args:[],c:c2}).res.room===ROOM,'가게 방 · 틀린 건 기본 방');
const c3=JSON.parse(m.props.SHOPS)[2]; ok(post(C,{fn:'info',args:[],c:c3}).res.room===ROOM2,'새 가게도 방');
const dl=post(C,{fn:'shopsDl',args:['999999']}).res; ok(dl.head.slice(-3).join()==='무료/유료,남기는 방,손님 주소'&&dl.rows[0][10]===ROOM2&&dl.rows[0][7]!==undefined,'내려받기 「남기는 방」 · 메모 자리 그대로');
sf=post(C,{fn:'shopFile',args:['999999',[['가게 번호','남기는 방'],[c1,ROOM]],true,false]}).res; ok(sf.diff===1&&sf.diffs[0].col==='남기는 방','다른 방은 켤 때만(미리 보기 다름 1)');

// 3 무료 하루 한 건 · 선물
const put=(id,dev,c)=>post(C,{fn:'put',args:[Object.assign({id:'r'+id,t:Date.now(),name:'김',win:true,code:'AB12'},dev?{dev}:{})],c});
ok(put('1000000001','dfree0001').ok,'선물 첫 건');
let x=put('1000000002','dfree0001'); ok(x.ok===false&&x.err==='limit','같은 날 둘째 → limit');
ok(put('1000000001','dfree0001').ok,'있는 기록 고치기(상태)는 세지 않음');
ok(put('1000000003','dfree0002').ok,'다른 기기는 됨');
ok(put('1000000004','dfree0003',c1).ok&&put('1000000005','dfree0003',c2).err==='limit','가게가 달라도 기기마다 하루 한 건');
ok(put('1000000006').ok&&put('1000000007').ok,'기기 번호 없는 옛 화면은 세지 않음');
// 캐시가 비어도 탭으로 셈
m.clearCache(); ok(put('1000000008','dfree0001').err==='limit','캐시 비어도 탭에서 셈');
// 유료 가게
m.props['SHOP_'+c2]=JSON.stringify(Object.assign(JSON.parse(m.props['SHOP_'+c2]),{plan:'paid'}));
ok(put('1000000009','dpaid0001',c2).ok&&put('1000000010','dpaid0001',c2).ok&&put('1000000011','dpaid0001',c2).ok,'유료 가게 손님은 세지 않음');
ok(!m.tab('S1','무료한도').rows.some(r=>r[1]==='dpaid0001'),'유료 손님은 탭에도 없음');
// 이야기방
const so=(dev,c)=>post(C,{fn:'storyOk',args:[dev],c});
ok(so('dfree0001').ok===true,'이야기방 첫 건(선물과 따로)');
x=so('dfree0001'); ok(x.ok===false&&x.err==='limit','이야기방 둘째 → limit');
ok(so('dpaid0001',c2).ok&&so('dpaid0001',c2).ok,'유료 가게 이야기방 세지 않음');
ok(post(C,{fn:'storyOk',args:['dx'],c:'888'}).ok===true&&post(C,{fn:'storyOk',args:['dfree0009'],c:'888'}).res.ok===false,'모르는 가게 → 거절');
m.props.NORI_STOP='all'; ok(so('dfree0001').ok===true,'멈춤이면 세지 않고 열어 줌'); m.props.NORI_STOP='';
// 밤 12시
const kNow=new Date(Date.now()+9*3600e3), toMid=(24-kNow.getUTCHours())*3600e3-kNow.getUTCMinutes()*60e3-kNow.getUTCSeconds()*1e3-kNow.getUTCMilliseconds();
m.go(toMid-60e3); ok(put('1000000012','dfree0001').err==='limit','밤 11시 59분 → 아직 limit');
m.go(120e3); ok(put('1000000013','dfree0001').ok&&so('dfree0001').ok,'밤 12시 1분 → 새로 한 건씩');
// NORI_FREE_DAY
m.props.NORI_FREE_DAY='0'; ok(put('1000000014','dfree0001').ok&&put('1000000015','dfree0001').ok&&so('dfree0001').ok,'NORI_FREE_DAY 0 → 끔');
ok(post(C,{fn:'info',args:[]}).res.free===0,'info free 0');
m.props.NORI_FREE_DAY='2'; ok(put('1000000016','dfree0077').ok&&put('1000000017','dfree0077').ok&&put('1000000018','dfree0077').err==='limit','NORI_FREE_DAY 2');
m.props.NORI_FREE_DAY='';
// 한도와 하루 선물 수 PUT_DAY_MAX 가 서로 갉아먹지 않음
{ const q=mk(BASE); q.ctx.setup(); q.props.PUT_DAY_MAX='2'; const p2=(i,d)=>post(q.ctx,{fn:'put',args:[{id:'r20000000'+i,t:Date.now(),name:'김',win:true,code:'AB12',dev:d}]});
  ok(p2('01','dq000001').ok&&p2('02','dq000001').err==='limit'&&p2('03','dq000002').ok&&p2('04','dq000003').err==='full','limit 은 가게 하루 수를 쓰지 않음 · full 은 한도를 쓰지 않음');
  ok(!q.tab('S1','무료한도').rows.some(r=>r[1]==='dq000003'),'full 이면 무료한도 줄 없음'); }

// 4 정리 · 14일
{ const q=mk(BASE); q.ctx.setup(); const T=q.tab('S1','무료한도'), d=q.ctx.kday_;
  T.appendRow([d(Date.now()-20*864e5),'dold00001','선물','',new Date()]); T.appendRow([d(Date.now()-3*864e5),'dnew00001','선물','',new Date()]);
  q.props['ERRN_'+d(Date.now()-30*864e5)]='4'; q.props['ERRN_'+d(Date.now()-864e5)]='2';
  q.ctx.cleanPlays(); ok(T.rows.length===2&&T.rows[1][1]==='dnew00001','무료한도 14일 지난 줄 지움');
  ok(!q.props['ERRN_'+d(Date.now()-30*864e5)]&&q.props['ERRN_'+d(Date.now()-864e5)]==='2','오류 셈 14일 지난 것 지움'); }

// 5 매일 점검 한 줄
{ const q=mk(Object.assign({},BASE,{OPS_SHEET_ID:'OPS'})), Q=q.ctx; Q.setup(); const d=Q.kday_;
  Q.dailyLine(); ok(/탭이 없어/.test(q.logs.slice(-1)[0]),'탭 없으면 만들지 않고 알림');
  q.books.OPS.insertSheet('매일 점검'); const L=q.tab('OPS','매일 점검');
  // 어제 판 3 · 공유 1 · 선물 2
  const P=q.tab('S1','판기록'), G=q.tab('S1','손님기록'), Y=Date.now()-864e5;
  for(let i=0;i<3;i++) P.appendRow([new Date(Y),'gl','이김','1:0','사장님','','dy00000'+i,1.5,'v',new Date(Y),'','qr','first','','판','','']);
  P.appendRow([new Date(Y),'','','','','','dy000009','','v',new Date(Y),'','qr','','','공유','','']);
  P.appendRow([new Date(),'gl','이김','1:0','사장님','','dt000001',1.5,'v',new Date(),'','qr','first','','판','','']);
  G.appendRow(['r1',new Date(Y),'김','','','','','이김','','p1','','AB','ready','','']); G.appendRow(['r2',new Date(Y),'이','','','','','짐','','p0','','CD','ready','','101']);
  Q.dailyLineTest(); ok(L.rows.length===0&&/미리 보기/.test(q.logs.slice(-1)[0]),'dailyLineTest 는 적지 않음');
  Q.dailyLine(); const r=L.rows[0];
  ok(L.rows.length===1&&r.length===12,'한 줄 · 12칸 ('+(r&&r.length)+')');
  const kd=new Date(Date.now()+9*3600e3); ok(r[0]===(kd.getUTCMonth()+1)+'월 '+kd.getUTCDate()+'일'&&r[1]==='그때 그 놀이','날짜 · 서비스');
  ok(r[2]==='해당 없음(운영 갑)'&&r[3]==='해당 없음'&&r[4]==='꺼짐'&&r[5]==='한도 없음'&&r[6]===0&&r[7]==='해당 없음'&&r[8]==='없음','백업 · 결제 · 멈춤 · 하루 선 · 오류 · 신고 · 의심');
  ok(r[9]==='초록'&&L.bg['1:10']==='#D9EAD3'&&r[10]==='그때그놀이_손님입구 v9','초록 · 칸 색 · 적은 곳');
  ok(/판 3 · 누름 1 · 선물 2/.test(r[11]),'비고 '+r[11]);
  Q.dailyLine(); ok(L.rows.length===1,'하루 한 번만');
  // 노랑: 하루 선 80% · 의심 · 오류
  const again=()=>{ delete q.props.DAILY_DONE; Q.dailyLine(); return L.rows[L.rows.length-1]; };
  q.props.PLAY_DAY_MAX='5'; let z=again(); ok(z[5]==='80%'&&z[9]==='노랑'&&L.bg[L.rows.length+':10']==='#FFF2CC','하루 선 80% → 노랑');
  q.props.PUT_DAY_MAX='1'; z=again(); ok(z[5]==='100%'&&z[9]==='빨강'&&L.bg[L.rows.length+':10']==='#F4CCCC','선물 하루 수 100% → 빨강 (높은 쪽)');
  q.props.PLAY_DAY_MAX=''; q.props.PUT_DAY_MAX='';
  q.props['ERRN_'+d(Date.now()-864e5)]='5'; z=again(); ok(z[6]===5&&z[9]==='노랑','오류가 평소 두 배 넘음 → 노랑');
  q.props['ERRN_'+d(Date.now()-864e5)]='0';
  const T=q.tab('S1','무료한도'); for(let i=1;i<=4;i++) T.appendRow([d(Date.now()-i*864e5),'dsus00001','선물','',new Date()]);
  z=again(); ok(z[8]==='있음'&&z[9]==='노랑','나흘 내리 한도 끝 → 의심 있음 · 노랑');
  T.rows.splice(2,1); z=again(); ok(z[8]==='없음','하루 빠지면 의심 없음');
  // 멈춤
  q.props.NORI_STOP='101, base'; z=again(); ok(z[4]==='켜짐(가게 101, base)'&&z[9]==='초록','멈춤 켜짐(종류) · 첫날은 초록');
  q.go(25*3600e3); z=again(); ok(z[9]==='빨강','하루 넘게 켜짐 → 빨강');
  q.props.NORI_STOP='all'; z=again(); ok(z[4]==='켜짐(모두)','멈춤 모두');
  q.props.NORI_STOP=''; z=again(); ok(z[4]==='꺼짐'&&!q.props.NORI_STOP_SEEN,'끄면 처음 본 때 지움');
  ok(!L.rows.some(x=>/시험|test/i.test(x.join(' '))),'운영 시트에 시험 꼴 0');
  ok(!/dy0000|dt0000|김|AB/.test(JSON.stringify(L.rows)),'한 줄에 기기 · 이름 · 쿠폰 없음');
}
{ const q=mk(BASE); q.ctx.setup(); q.ctx.dailyLine(); ok(/OPS_SHEET_ID/.test(q.logs.slice(-1)[0]),'운영 대장 번호 없으면 알림'); }

// 6 v8 그대로 (판 기록 · 멈춤 · usage)
{ const q=mk(BASE); q.ctx.setup(); const pl=o=>post(q.ctx,{fn:'play',args:[Object.assign({v:'v',t:Date.now(),g:'gl',o:'win',vs:'cpu',sc:'1:0',dev:'dabc1234',from:'qr',nw:'first'},o)]});
  ok(pl({}).ok&&pl({ev:'story',g:'',o:''}).ok,'판 · 이야기방 누름 그대로');
  q.props.NORI_STOP='all'; ok(pl({}).err==='stop'&&q.props.NORI_STOP_SEEN,'멈춤 stop · 처음 본 때 적음'); q.props.NORI_STOP='';
  q.props.LF_REPORT_KEY='K'; const u=post(q.ctx,{fn:'usage_count',day:q.ctx.day_(),key:'K'}); ok(u.ok&&Object.keys(u.rows[0]).pop()==='region','usage_count 그대로'); }
console.log(n-f+'/'+n+' 통과');
process.exit(f?1:0);
