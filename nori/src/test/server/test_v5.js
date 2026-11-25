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
const {ctx,props,sheets,logs}=mk();
ctx.setup(); const M=props.ADMIN_PIN;
ok(sheets['가게고침'],'가게고침 탭');
ctx.addShop(); ctx.addShop();  // 101 102
props['SETTINGS_101']=JSON.stringify({prizes:{p1:'음료 한 잔',p0:'',sp:''},cond:'a',shop:{s:'다복',h:'사장님'}});
props['SETTINGS_102']=JSON.stringify({prizes:{p1:'',p0:'',sp:''},cond:'a',shop:{s:'꽃집',h:'사장님'}});
// 권한
ok(!post(ctx,{fn:'shopsDl',args:['0000']}).res.ok,'남 번호 내려받기 막음');
ok(!post(ctx,{fn:'shopFile',args:[JSON.parse(props.SHOP_101).admin,[['상호'],['x']],true]}).res.ok,'가게 관리자 번호로 올리기 막음');
let d=post(ctx,{fn:'shopsDl',args:[M]}).res; ok(d.ok&&d.rows.length===2&&d.head[0]==='가게 번호','내려받기 2곳');
ok(!JSON.stringify(d).includes(JSON.parse(props.SHOP_101).admin),'내려받기에 관리자 번호 없음');
// 파일: 제목줄 위에 군더더기 · 다른 머리 이름 · 민감 칸
const rows=[['그때 그 놀이 가게 명단'],[],['매장명','이기면','참가','조건','전화번호','주민번호','비고','번호'],
 ['다복','막걸리','사탕','나','010-1234-5678','900101-1','단골','101'],   // 101: p1 다름 · p0 채움 · cond 다름 · tel4 채움 · memo 채움
 ['꽃집','꽃 한 송이','','','','','',''],                                // 이름으로 102 · p1 채움
 ['새가게','음료','','가','010-9999-0001','','',''],                     // 새
 ['새가게','','껌','','','','',''],                                      // 앞줄 새 가게에 맞음 · p0 채움
 ['','','','','','','','999'],                                           // 없는 번호
 ['','막걸리','','','','','',''],                                        // 이름 없음
 ['이상한','','','몰라','','','','']];                                   // 새 · 조건 노트
let r=post(ctx,{fn:'shopFile',args:[M,rows,true,false,'',"가게.xlsx"]}).res;
ok(r.ok,'미리보기 ok'); ok(r.refused.includes('주민번호'),'민감 칸 거절 '+r.refused);
ok(r.add===2,'새로 더함 2 → '+r.add); ok(r.miss===2,'못 맞춤 2 → '+r.miss);
ok(r.diff===2,'다른 값 2 → '+r.diff+JSON.stringify(r.diffs)); ok(r.fill===4,'빈칸 채움 4 → '+r.fill);
ok(r.misses.some(x=>x.why.includes('없는 가게 번호'))&&r.misses.some(x=>x.why==='이름 없음'),'까닭 말');
ok(r.notes.length===1,'조건 노트');
ok(!sheets['가게고침'].rows[1],'미리보기는 안 씀');
// 넣기 (다른 값 안 바꿈)
r=post(ctx,{fn:'shopFile',args:[M,rows,false,false,'req123abc','가게.xlsx']}).res;
ok(r.done&&r.news.length===2,'새 가게 2 '+JSON.stringify(r.news));
ok(r.news[0].c==='103'&&/^\d{6}$/.test(r.news[0].admin),'103 번호');
let s101=JSON.parse(props.SETTINGS_101); ok(s101.prizes.p1==='음료 한 잔'&&s101.prizes.p0==='사탕'&&s101.cond==='a','101 빈칸만 '+props.SETTINGS_101);
ok(JSON.parse(props.SHOP_101).tel4==='5678'&&JSON.parse(props.SHOP_101).memo==='단골','101 연락처 끝 넷 · 메모');
ok(JSON.parse(props.SHOP_101).admin,'101 관리자 번호 지켜짐');
ok(JSON.parse(props.SETTINGS_102).prizes.p1==='꽃 한 송이','102 채움');
let s103=JSON.parse(props.SETTINGS_103); ok(s103.shop.s==='새가게'&&s103.prizes.p0==='껌'&&s103.prizes.p1==='음료','103 새 가게 '+props.SETTINGS_103);
ok(!JSON.stringify(props).includes('900101'),'주민번호 저장 안 함');
// 두 번 눌림
const before=Object.keys(props).length;
let r2=post(ctx,{fn:'shopFile',args:[M,rows,false,false,'req123abc','가게.xlsx']}).res; ok(r2.again&&Object.keys(props).length===before,'요청 키 한 번만');
// 다른 값은 파일대로
r=post(ctx,{fn:'shopFile',args:[M,rows,false,true,'req456def','가게.xlsx']}).res;
s101=JSON.parse(props.SETTINGS_101); ok(s101.prizes.p1==='막걸리'&&s101.cond==='b','다른 값 파일대로');
// 같은 이름이 여럿
props['SETTINGS_104']; ctx.addShop(); // 가게 하나 더
const last=JSON.parse(props.SHOPS).slice(-1)[0]; props['SETTINGS_'+last]=JSON.stringify({prizes:{},cond:'a',shop:{s:'다복',h:'사장님'}});
r=post(ctx,{fn:'shopFile',args:[M,[['상호','메모'],['다복','x']],true]}).res; ok(r.misses[0]&&r.misses[0].why==='같은 이름이 여럿','같은 이름 여럿');
r=post(ctx,{fn:'shopFile',args:[M,[['상호','연락처'],['다복','5678']],true]}).res; ok(r.miss===0,'연락처 끝 넷으로 가림');
// 머리 줄 없음
r=post(ctx,{fn:'shopFile',args:[M,[['a','b'],['1','2']],true]}).res; ok(!r.ok&&/내려받은 양식/.test(r.msg),'머리 줄 못 찾음');
// v4 그대로: info · put
ok(post(ctx,{fn:'info',args:[],c:'103'}).res.set.shop.s==='새가게','info 103');
ok(post(ctx,{fn:'info',args:[],c:'999'}).res.unknown,'info 모르는 번호');
ok(sheets['가게고침'].rows.length>3,'고친 기록 '+sheets['가게고침'].rows.length);
console.log(`${n-f}/${n} 통과`);
