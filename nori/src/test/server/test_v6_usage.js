const fs=require('fs'),vm=require('vm');
function mk(){
 const props={},cache={},sheets={},logs=[];
 const sheet=(name)=>{const rows=[];return {rows,appendRow:r=>rows.push(r.slice()),setFrozenRows(){},getLastRow:()=>rows.length,
  getRange:(r,c,nr=1,nc=1)=>({setFontWeight(){return this},setBackground(){return this},setValue(v){rows[r-1]=rows[r-1]||[];rows[r-1][c-1]=v;return this},
   getValue:()=> (rows[r-1]||[])[c-1],getValues:()=>{const o=[];for(let i=0;i<nr;i++){o.push((rows[r-1+i]||[]).slice(c-1,c-1+nc))}return o},
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
 vm.createContext(ctx); vm.runInContext(fs.readFileSync((process.env.CODE||__dirname+'/Code_v5.gs'),'utf8'),ctx);
 return {ctx,props,sheets,logs};
}
let n=0,f=0; const ok=(c,m)=>{n++; if(!c){f++;console.log('✗',m)} };
const post=(ctx,o)=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(o)}}));
const {ctx,props,sheets}=mk(); ctx.setup();
const U=o=>post(ctx,Object.assign({fn:'usage_count'},o));
ok(U({day:'2026-11-24',key:'x'}).code==='not_ready','열쇠 없으면 not_ready');
props.LF_REPORT_KEY='K9test';
ok(U({day:'2026-11-24',key:'x'}).code==='key','틀린 열쇠');
ok(U({day:'2026-11-24'}).code==='key','열쇠 없이');
ok(U({day:'24-11-2026',key:'K9test'}).code==='day','날 꼴');
ok(!post(ctx,{fn:'play',args:[]}).res||true,'');
// 판 기록: 한국 시각 11-24 00:00 = UTC 11-23 15:00
const P=sheets['판기록'], G=sheets['손님기록'], D=s=>new Date(s);
[['2026-11-23T14:59:59Z'],['2026-11-23T15:00:00Z'],['2026-11-24T03:00:00Z'],['2026-11-24T14:59:59Z'],['2026-11-24T15:00:00Z']].forEach(x=>P.appendRow([D(x[0]),'gl','이김','30:28','사장님','다복','dabc123456',1.5,'v3.8',D(x[0]),'101']));
G.appendRow(['r1234567890',D('2026-11-24T05:00:00Z'),'홍길동','','공 굴리기','사장님','','이김','','p1','음료','AB12CD','ready','','101']);
G.appendRow(['r1234567891',D('2026-11-25T05:00:00Z'),'김','','윷놀이','사장님','','짐','','p0','','EF34GH','ready','','']);
let r=U({day:'2026-11-24',key:'K9test'});
ok(r.ok&&r.day==='2026-11-24'&&r.rows.length===2,'두 줄 '+JSON.stringify(r));
ok(r.rows[0].service==='놀이 한 판'&&r.rows[0].made===3,'판 3 (경계) → '+r.rows[0].made);
ok(r.rows[1].service==='선물 받기'&&r.rows[1].made===1,'선물 1 → '+r.rows[1].made);
ok(r.rows.every(x=>x.plan==='무료'&&x.sent===null&&x.opened===null&&x.reopened===null&&x.joined===null&&x.paid_count===0&&x.paid_amount===0&&x.came_from==='모름'),'칸 꼴');
const js=JSON.stringify(r); ok(!/dabc|홍길동|AB12|101|K9test/.test(js),'기기 · 이름 · 쿠폰 · 가게 · 열쇠 안 나감');
ok(Object.keys(r.rows[0]).join()==='service,plan,made,sent,opened,reopened,joined,paid_count,paid_amount,came_from','칸 차례');
r=U({day:'2026-11-26',key:'K9test'}); ok(r.ok&&r.rows[0].made===0&&r.rows[1].made===0,'빈 날 0');
ok(post(ctx,{fn:'usageCount_',args:[{key:'K9test',day:'2026-11-24'}]}).err==='fn','손님 화면 길로는 못 부름');
ok(post(ctx,{fn:'info',args:[]}).ok,'다른 함수 그대로');
console.log(n-f+'/'+n+' 통과');
{ const L=[]; ctx.Logger.log=m=>L.push(m); ctx.usageTest(); const o=JSON.parse(L[0]); console.log(o.ok&&o.rows.length===2&&!L[0].includes('K9test')?'usageTest ok':'usageTest ✗', L[0].slice(0,80)); }
