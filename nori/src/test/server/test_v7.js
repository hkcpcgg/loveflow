/* 서버 v7 흉내 시험 (261126) — CODE=./Code_v7.gs node test_v7.js */
const fs=require('fs'),vm=require('vm');
function mk(){
 const props={},cache={},sheets={},logs=[];
 const sheet=(name)=>{const rows=[];return {rows,appendRow:r=>rows.push(r.slice()),setFrozenRows(){},getLastRow:()=>rows.length,
  deleteRows:(at,n)=>rows.splice(at-1,n),insertRowsBefore:(at,n)=>rows.splice(at-1,0,...Array.from({length:n},()=>[])),
  getRange:(r,c,nr=1,nc=1)=>({setFontWeight(){return this},setBackground(){return this},setValue(v){rows[r-1]=rows[r-1]||[];rows[r-1][c-1]=v;return this},
   getValue:()=> (rows[r-1]||[])[c-1],getValues:()=>{const o=[];for(let i=0;i<nr;i++){const x=(rows[r-1+i]||[]).slice(c-1,c-1+nc);while(x.length<nc)x.push('');o.push(x)}return o},
   setValues(v){v.forEach((row,i)=>{rows[r-1+i]=rows[r-1+i]||[];row.forEach((x,j)=>rows[r-1+i][c-1+j]=x)});return this}})}};
 const ctx={JSON,Date,Math,String,Number,Object,Array,RegExp,isNaN,
  Logger:{log:m=>logs.push(m)},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]??null,setProperty:(k,v)=>{props[k]=String(v)}})},
  CacheService:{getScriptCache:()=>({get:k=>cache[k]??null,put:(k,v)=>{cache[k]=v}})},
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  SpreadsheetApp:{openById:()=>({getSheetByName:n=>sheets[n]||null,insertSheet:n=>(sheets[n]=sheet(n))})},
  ScriptApp:{getProjectTriggers:()=>[],newTrigger:()=>({timeBased:()=>({everyDays:()=>({atHour:()=>({create(){}})})})}),getService:()=>({getUrl:()=>'U'})},
  ContentService:{createTextOutput:t=>({setMimeType(){return t}}),MimeType:{JSON:1}},
  HtmlService:{}};
 vm.createContext(ctx); vm.runInContext(fs.readFileSync(process.env.CODE||__dirname+'/Code_v7.gs','utf8'),ctx);
 return {ctx,props,sheets,logs,cache};
}
let n=0,f=0; const ok=(c,m)=>{n++; if(!c){f++;console.log('✗',m)} };
const post=(ctx,o)=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(o)}}));
const NOW=Date.now(), today=new Date(NOW+9*3600e3).toISOString().slice(0,10);
let {ctx,props,sheets,cache}=mk(); ctx.setup();
const P=sheets['판기록'];
ok(P.rows[0].length===17&&P.rows[0][11]==='들어온길'&&P.rows[0][16]==='합계줄수','머리 17칸');
// 옛 머리(11칸) 시트에 setup → 덧붙임
{ const m=mk(); m.ctx.setup(); m.sheets['판기록'].rows[0]=m.sheets['판기록'].rows[0].slice(0,11); m.ctx.setup(); ok(m.sheets['판기록'].rows[0].length===17&&m.sheets['판기록'].rows[0][14]==='종류','옛 시트 머리 덧붙임'); }
const pl=(o,c)=>post(ctx,{fn:'play',args:[Object.assign({v:'nori3.9',t:NOW,g:'gl',o:'win',vs:'cpu',sc:'1:0',dev:'dabc1234'},o)],c});
// 1 판 기록 새 칸
ok(pl({from:'uri',nw:'first'}).ok,'판 + 들어온길');
let r=P.rows[1]; ok(r[11]==='uri'&&r[12]==='first'&&r[13]===''&&r[14]==='판','칸: uri · first · 판 '+JSON.stringify(r.slice(11)));
pl({from:'qr',nw:'again',gap:3.7,dev:'dzzz9999'}); r=P.rows[2]; ok(r[11]==='qr'&&r[12]==='again'&&r[13]===3,'again · 3일');
pl({from:'evil',nw:'x'}); r=P.rows[3]; ok(r[11]===''&&r[12]==='','모르는 값은 빈칸');
// 2 퍼짐 ev
ok(pl({ev:'share',g:'',o:'',from:'qr'}).ok,'공유 누름');
r=P.rows[4]; ok(r[14]==='공유'&&r[1]===''&&r[2]===''&&r[4]==='','ev 줄: 놀이 · 결과 비움');
pl({ev:'save',g:'',o:''}); pl({ev:'story',g:'',o:''}); pl({ev:'open',g:'',o:'',from:'share',dev:'dnew00001'});
ok(P.rows[5][14]==='사진'&&P.rows[6][14]==='이야기방'&&P.rows[7][14]==='공유열림','사진 · 이야기방 · 공유열림');
ok(pl({ev:'hack',g:'',o:''}).res.ok===false,'모르는 ev 거절');
ok(post(ctx,{fn:'stats',args:['x']}).ok,'stats 그대로');
// 3 가게 칸
ctx.addShop(); const c1=JSON.parse(props.SHOPS)[0];
let info=post(ctx,{fn:'info',args:[],c:c1}).res; ok(info.plan==='free'&&info.stop===false,'info plan free · stop false');
props.ADMIN_PIN='999999';
let sf=post(ctx,{fn:'shopFile',args:['999999',[['가게 번호','상호','지역','무료/유료'],[c1,'다복','창원시','유료'],['','새집','김해시','무료'],['','틀림','','반값']],false,false,'req00001','t.csv']}).res;
ok(sf.ok&&sf.done&&sf.add===2,'파일: 기존 + 새 둘 '+JSON.stringify({add:sf.add,fill:sf.fill,notes:sf.notes}));
ok(sf.notes.some(x=>/무료\/유료/.test(x.msg)),'반값 → 알림');
ok(JSON.parse(props['SHOP_'+c1]).region==='창원시'&&JSON.parse(props['SHOP_'+c1]).plan==='paid','지역 · 유료 저장');
info=post(ctx,{fn:'info',args:[],c:c1}).res; ok(info.plan==='paid','info 유료');
const dl=post(ctx,{fn:'shopsDl',args:['999999']}).res; ok(dl.head.slice(-3).join()==='지역(시·군·구),무료/유료,손님 주소'&&dl.rows[0][8]==='창원시'&&dl.rows[0][9]==='유료','내려받기 두 칸');
ok(dl.rows[0][7]!==undefined&&dl.head[7]==='메모','메모 자리 그대로(손님 화면 r[7])');
// 4 잘라내기
props.NORI_STOP='all'; ok(pl({}).err==='stop','멈춤 all → stop');
ok(post(ctx,{fn:'put',args:[{id:'r1234567890',t:NOW,name:'김',win:true,code:'AB12'}]}).err==='stop','선물도 stop');
ok(post(ctx,{fn:'info',args:[]}).res.stop===true,'info stop');
ok(post(ctx,{fn:'stats',args:['999999']}).ok,'관리자는 그대로');
props.NORI_STOP=c1+', 999'; ok(pl({},c1).err==='stop'&&pl({}).ok,'가게 번호만 멈춤');
props.NORI_STOP='base'; ok(pl({}).err==='stop'&&pl({},c1).ok,'기본 가게 base');
props.NORI_STOP='';
props.PUT_DAY_MAX='2';
const put=(i,c)=>post(ctx,{fn:'put',args:[{id:'r99999999'+i+'0',t:NOW,name:'김',win:true,code:'AB12'}],c});
ok(put(1,c1).ok&&put(2,c1).ok&&put(3,c1).err==='full'&&put(4).ok,'가게마다 하루 선물 2');
props.PUT_DAY_MAX='';
const before=P.rows.length; props.PLAY_DAY_MAX=String(Number(cache['pday_'+today]||0)+1);
ok(pl({dev:'dmax00001'}).ok&&pl({dev:'dmax00002'}).err==='full','하루 판 기록 한도'); props.PLAY_DAY_MAX='';
props.PLAY_RATE='0.5'; let w=0; for(let i=0;i<200;i++){ if(pl({dev:'drate'+String(i).padStart(4,'0')}).res.skip) w++; }
ok(w>60&&w<140,'솎기 반쯤 건너뜀 '+w);
ok(P.rows.slice(1).filter(x=>x[15]===0.5).length===200-w,'남긴 줄에 비율 0.5');
props.PLAY_RATE='';
// 5 usage v7
props.LF_REPORT_KEY='K9';
let u=post(ctx,{fn:'usage_count',day:today,key:'K9'});
const R=u.rows; const by=(s,fr)=>R.filter(x=>x.service===s&&(!fr||x.came_from===fr));
ok(u.ok&&Object.keys(R[0]).join()==='service,plan,made,sent,opened,reopened,joined,paid_count,paid_amount,came_from','칸 차례 그대로');
ok(by('놀이 한 판','우리 이야기').length===1&&by('놀이 한 판','우리 이야기')[0].made===1,'우리 이야기 1판');
ok(by('놀이 한 판','가게 QR')[0].made===1&&by('놀이 한 판','가게 QR')[0].reopened===1&&by('놀이 한 판','가게 QR')[0].sent===1,'QR: 판1 · 다시1 · 공유1');
ok(by('놀이 한 판','공유')[0].opened===1,'공유 주소 첫 화면 1');
const tot=by('놀이 한 판').reduce((a,x)=>a+x.made,0), real=P.rows.slice(1).filter(x=>x[14]==='판').reduce((a,x)=>a+(x[15]?1/x[15]:1),0);
ok(tot===Math.round(real)||Math.abs(tot-real)<=by('놀이 한 판').length,'솎기 되돌려 셈 '+tot+' ≈ '+real);
ok(R.some(x=>x.plan==='유료'),'유료 가게 줄 따로');
ok(by('선물 받기').reduce((a,x)=>a+x.made,0)===3,'선물 3');
ok(R.every(x=>x.joined===null&&x.paid_count===0),'joined null');
ok(!/dabc|dzzz|김|AB12|K9/.test(JSON.stringify(u)),'기기 · 이름 · 쿠폰 · 열쇠 안 나감');
ok(post(ctx,{fn:'usage_count',day:today,key:'x'}).code==='key','틀린 열쇠');
// 6 시트 크기 지킴이 (접기)
{ const m=mk(); m.ctx.setup(); const S=m.sheets['판기록'], old=Date.now()-60*864e5;
  for(let i=0;i<50;i++) S.appendRow([new Date(old+i*1000),'gl','이김','1:0','사장님','다복','dd'+(i%5)+'00000',1.5,'v3.9',new Date(old),'', i<30?'qr':'uri', i%2?'again':'first', '', '판', '', '']);
  for(let i=0;i<5;i++) S.appendRow([new Date(old+5000+i),'','','','','','dx000001','','v3.9',new Date(old),'','qr','','','공유','','']);
  for(let i=0;i<10;i++) S.appendRow([new Date(Date.now()-i*1000),'gl','짐','0:1','사장님','','dnow0000'+i,1.5,'v3.9',new Date(),'','direct','first','','판','','']);
  m.props.PLAY_ROWS_MAX='20'; m.ctx.cleanPlays();
  const sums=S.rows.slice(1).filter(x=>x[14]==='합계');
  ok(S.rows.length-1===13&&sums.length===3,'65줄 → 합계 3 + 최근 10 '+(S.rows.length-1));
  ok(sums.find(x=>x[11]==='qr'&&JSON.parse(x[3]).k==='판')[16]===30&&sums.find(x=>x[11]==='uri')[16]===20,'qr 30 · uri 20');
  ok(JSON.parse(sums.find(x=>x[11]==='qr'&&JSON.parse(x[3]).k==='판')[3]).re===5,'다시 온 기기 수 남김');
  m.props.LF_REPORT_KEY='K'; const d0=new Date(old+9*3600e3).toISOString().slice(0,10);
  const uu=post(m.ctx,{fn:'usage_count',day:d0,key:'K'}).rows;
  ok(uu.find(x=>x.came_from==='가게 QR').made===30&&uu.find(x=>x.came_from==='가게 QR').sent===5&&uu.find(x=>x.came_from==='우리 이야기').made===20,'접은 날도 같은 숫자');
  m.ctx.cleanPlays(); ok(S.rows.length-1===13,'두 번 접어도 그대로'); }
// 옛 줄(v6) 은 모름
{ const m=mk(); m.ctx.setup(); m.props.LF_REPORT_KEY='K'; m.sheets['판기록'].appendRow([new Date(NOW),'gl','이김','1:0','사장님','다복','dold0001',1.5,'v3.8',new Date(NOW),'']);
  const uu=post(m.ctx,{fn:'usage_count',day:today,key:'K'}).rows; ok(uu[0].came_from==='모름'&&uu[0].made===1&&uu[0].reopened===0,'옛 줄 → 모름');
  ok(uu.length===2&&uu[1].service==='선물 받기'&&uu[1].made===0,'빈 서비스도 한 줄'); }
console.log(n-f+'/'+n+' 통과');
