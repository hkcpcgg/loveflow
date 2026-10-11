// 가짜 Apps Script — 서버 파일을 그대로 돌림 (mock.js 와 같은 환경을 모듈로)
const fs=require('fs'),crypto=require('crypto');
module.exports=function(file){
  const sheets={};
  function mkSheet(name){const d={rows:[]};const sh={getName:()=>name,getLastRow:()=>d.rows.length,getLastColumn:()=>d.rows.reduce((m,r)=>Math.max(m,r.length),0),getMaxColumns:()=>Math.max(26,sh.getLastColumn()),insertColumnsAfter:()=>{},setFrozenRows:()=>{},appendRow:(l)=>{d.rows.push(l.slice())},getDataRange:()=>rng(1,1,d.rows.length,sh.getLastColumn()),getRange:(r,c,nr,nc)=>rng(r,c,nr||1,nc||1)};
    function rng(r,c,nr,nc){return{getValues:()=>{const o=[];for(let i=0;i<nr;i++){const row=d.rows[r-1+i]||[];const x=[];for(let j=0;j<nc;j++){x.push(row[c-1+j]===undefined?'':row[c-1+j])}o.push(x)}return o},setValues:(v)=>{for(let i=0;i<v.length;i++){const row=d.rows[r-1+i]=d.rows[r-1+i]||[];for(let j=0;j<v[i].length;j++){row[c-1+j]=v[i][j]}}},setValue:(v)=>{const row=d.rows[r-1]=d.rows[r-1]||[];row[c-1]=v},getValue:()=>((d.rows[r-1]||[])[c-1]??'')}}
    return sh}
  const ss={getSheetByName:(n)=>sheets[n]||null,insertSheet:(n)=>(sheets[n]=mkSheet(n))};
  const props={LF_SHEET_ID:'TEST'},cache={};let fid=0;const files={};
  function mkFile(b){const id='F'+(++fid);const f={id,name:b.name,bytes:b.bytes,type:b.type,getId:()=>id,getName:()=>f.name,setName:(n)=>{f.name=n},setTrashed:()=>{},moveTo:()=>{},getBlob:()=>({getBytes:()=>f.bytes,getContentType:()=>f.type,getDataAsString:()=>''}),getMimeType:()=>f.type};files[id]=f;return f}
  function mkFolder(n){const subs={};return{getId:()=>'D'+n,getName:()=>n,createFile:(b)=>mkFile(b),createFolder:(x)=>(subs[x]=mkFolder(x)),getFoldersByName:(x)=>{let u=false;return{hasNext:()=>!u&&!!subs[x],next:()=>{u=true;return subs[x]}}}}}
  const top=mkFolder('top');
  const G={
    SpreadsheetApp:{openById:()=>ss},
    PropertiesService:{getScriptProperties:()=>({getProperty:(k)=>(k in props?props[k]:null),setProperty:(k,v)=>{props[k]=String(v)},deleteProperty:(k)=>{delete props[k]}})},
    CacheService:{getScriptCache:()=>({get:(k)=>cache[k]??null,put:(k,v)=>{cache[k]=String(v)},remove:(k)=>{delete cache[k]},removeAll:(ks)=>ks.forEach((k)=>delete cache[k]),getAll:(ks)=>{const o={};ks.forEach((k)=>{if(k in cache)o[k]=cache[k]});return o},putAll:(o)=>Object.assign(cache,o)})},
    Session:{getActiveUser:()=>({getEmail:()=>'t'}),getEffectiveUser:()=>({getEmail:()=>'t'}),getScriptTimeZone:()=>'Asia/Seoul'},
    LockService:{getScriptLock:()=>({waitLock:()=>{},releaseLock:()=>{}})},
    DriveApp:{createFolder:()=>top,getFolderById:()=>top,getFileById:(id)=>{if(!files[id])throw new Error('no file');return files[id]}},
    Utilities:{getUuid:()=>crypto.randomUUID(),formatDate:(d,tz,f)=>{d=new Date(d);const p=(n)=>String(n).padStart(2,'0');return f.replace('yyyy',d.getFullYear()).replace('MM',p(d.getMonth()+1)).replace('dd',p(d.getDate())).replace('HH',p(d.getHours())).replace('mm',p(d.getMinutes())).replace(/M월/,(d.getMonth()+1)+'월').replace(/d일/,d.getDate()+'일')},
      base64Decode:(s)=>Array.from(Buffer.from(s,'base64')).map((b)=>(b>127?b-256:b)),base64Encode:(a)=>Buffer.from(a.map(b=>(b+256)%256)).toString('base64'),newBlob:(bytes,type,name)=>({name,type,bytes}),computeDigest:()=>[],DigestAlgorithm:{}},
    UrlFetchApp:{fetch:()=>({getResponseCode:()=>400,getContentText:()=>'{}'})},
    ContentService:{createTextOutput:(t)=>({setMimeType:()=>t,getContent:()=>t}),MimeType:{JSON:1}},
    HtmlService:{},Logger:{log:(s)=>console.log('[GAS]',String(s).slice(0,4000))}
  };
  let src=fs.readFileSync(file,'utf8');
  const names=Object.keys(G);
  const fn=new Function(...names,src+'\n;return {route_:route_,fake:function(o){REC_KAKAO_FAKE=o;},call:function(n,a){return eval(n).apply(null,a||[]);}};');
  const api=fn(...names.map(n=>G[n]));
  api.props=props;api.cache=cache;
  return api;
};
