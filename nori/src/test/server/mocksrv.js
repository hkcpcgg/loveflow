const fs=require('fs'),vm=require('vm'),http=require('http');
const props={ADMIN_PIN:'999999',STAFF_PIN:'9999'},cache={},sheets={};
const sheet=()=>{const rows=[];return {rows,appendRow:r=>rows.push(r.slice()),setFrozenRows(){},getLastRow:()=>rows.length,
  getRange:(r,c,nr=1,nc=1)=>({setFontWeight(){return this},setBackground(){return this},setValue(v){rows[r-1]=rows[r-1]||[];rows[r-1][c-1]=v;return this},
   getValue:()=> (rows[r-1]||[])[c-1],getValues:()=>{const o=[];for(let i=0;i<nr;i++){o.push((rows[r-1+i]||[]).slice(c-1,c-1+nc))}return o},
   setValues(v){v.forEach((row,i)=>{rows[r-1+i]=rows[r-1+i]||[];row.forEach((x,j)=>rows[r-1+i][c-1+j]=x)});return this}})}};
const ctx={JSON,Date,Math,String,Number,Object,Array,RegExp,Logger:{log:m=>console.log(m)},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]??null,setProperty:(k,v)=>{props[k]=String(v)}})},
  CacheService:{getScriptCache:()=>({get:k=>cache[k]??null,put:(k,v)=>{cache[k]=v}})},
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  SpreadsheetApp:{openById:()=>({getSheetByName:n=>sheets[n]||null,insertSheet:n=>(sheets[n]=sheet())})},
  ScriptApp:{getProjectTriggers:()=>[],newTrigger:()=>({timeBased:()=>({everyDays:()=>({atHour:()=>({create(){}})})})}),getService:()=>({getUrl:()=>'https://www.loveflow.ai.kr/nori/'})},
  ContentService:{createTextOutput:t=>({setMimeType(){return t}}),MimeType:{JSON:1}},HtmlService:{}};
vm.createContext(ctx); vm.runInContext(fs.readFileSync((process.env.CODE||__dirname+'/Code_v5.gs'),'utf8'),ctx); ctx.setup(); ctx.addShop(); ctx.addShop();
props.SETTINGS_101=JSON.stringify({prizes:{p1:'음료 한 잔',p0:'사탕 하나',sp:''},cond:'a',shop:{s:'다복',h:'사장님'}});
http.createServer((q,s)=>{let b='';q.on('data',d=>b+=d);q.on('end',()=>{s.setHeader('Access-Control-Allow-Origin','*');
 if(q.method!=='POST'){s.end('{}');return} s.setHeader('Content-Type','application/json'); s.end(ctx.doPost({postData:{contents:b}}));});}).listen(8766);
