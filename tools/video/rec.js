const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const fs=require('fs'),path=require('path');const ROOT=require('path').resolve(__dirname,'../..'), OUT=process.env.LF_VID_OUT||require('path').resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});const STROKES=require('./strokes.js');
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.gif':'image/gif','.webp':'image/webp'};
module.exports=async function(name,scenario,opt){
  opt=opt||{}; const VW=412,VH=732;
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:2,locale:'ko-KR',hasTouch:false});
  await ctx.addInitScript({path:__dirname+'/overlay.js'});
  const p=await ctx.newPage(); const errs=[];
  const FD=OUT+'/fr_'+name; require('child_process').execSync('rm -rf "'+FD+'" && mkdir -p "'+FD+'"'); const frames=[]; let fn=0;
  const cdp=await ctx.newCDPSession(p);
  cdp.on('Page.screencastFrame',async f=>{ const n=String(++fn).padStart(6,'0'); fs.writeFileSync(FD+'/'+n+'.jpg',Buffer.from(f.data,'base64')); frames.push([n,f.metadata.timestamp]); try{ await cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}); }catch(e){} });
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:VW*2,maxHeight:VH*2,everyNthFrame:1}); p.on('pageerror',e=>errs.push(String(e)));
  await p.route('**/*',async r=>{const u=new URL(r.request().url());
    if(u.hostname.endsWith('loveflow.ai.kr')){ let q=decodeURIComponent(u.pathname); if(q==='/__card.html'){ return r.fulfill({status:200,body:fs.readFileSync(''+__dirname+'/card.html'),headers:{'content-type':'text/html; charset=utf-8'}}); }
      if(q.endsWith('/'))q+='index.html'; const f=path.join(ROOT,q); return fs.existsSync(f)?r.fulfill({status:200,body:fs.readFileSync(f),headers:{'content-type':MIME[path.extname(f)]||'application/octet-stream'}}):r.fulfill({status:404,body:''}); }
    if(u.hostname==='script.google.com'&&opt.gas){ return opt.gas(r,u); }
    if(u.hostname==='kauth.kakao.com'&&opt.kakao){ return opt.kakao(r,u); }
    if(u.hostname.includes('fonts.g')){ return r.continue().catch(()=>r.abort()); }
    return r.abort(); });
  const CAPS=[]; const now=()=>Date.now()/1000; let T0=null; const capAt=(t,sub)=>{ const n=now(); if(CAPS.length&&CAPS[CAPS.length-1].e==null){ CAPS[CAPS.length-1].e=n; } if(t){ CAPS.push({s:n,e:null,t:t.replace(/\|/g,' '),sub:(sub||'').replace(/\|/g,' ')}); } };
  const T={
    p, wait:(ms)=>p.waitForTimeout(ms),
    card:async(k,t,s,u,ms)=>{ capAt(''); await p.goto('https://www.loveflow.ai.kr/__card.html?k='+encodeURIComponent(k)+'&t='+encodeURIComponent(t)+'&s='+encodeURIComponent(s||'')+(u?'&u=1':'')); capAt(t,s); await p.waitForTimeout(ms||3200); capAt(''); },
    go:async(url,ms)=>{ await p.goto(url); await p.waitForTimeout(ms||1500); },
    cap:async(t,s,ms,top)=>{ capAt(t,s); await p.evaluate(([a,c,tp])=>window.__cap&&window.__cap(a,c,tp),[t,s||'',!!top]); await p.waitForTimeout(ms||1800); },
    tap:async(sel,ms)=>{ const el=p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(350); const bb=await el.boundingBox(); if(bb){ await p.evaluate(([x,y])=>window.__tap&&window.__tap(x,y),[bb.x+bb.width/2,bb.y+bb.height/2]); } await p.waitForTimeout(250); await el.click(); await p.waitForTimeout(ms||1200); },
    type:async(sel,text,ms)=>{ const el=p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.click(); await el.fill(''); await p.keyboard.type(text,{delay:110}); await p.waitForTimeout(ms||600); },
    scroll:async(y,ms)=>{ await p.evaluate((yy)=>window.scrollBy({top:yy,behavior:'smooth'}),y); await p.waitForTimeout(ms||900); },
    toSel:async(sel,ms)=>{ await p.locator(sel).first().evaluate(e=>e.scrollIntoView({behavior:'smooth',block:'center'})); await p.waitForTimeout(ms||900); },
    draw:async(sel,kind)=>{ const el=p.locator(sel).first(); await el.evaluate(e=>e.scrollIntoView({block:'center',behavior:'smooth'})); await p.waitForTimeout(700); const bb=await el.boundingBox();
      // 첫 획이 빠지는 것을 막는 점 하나(구석)
      await p.mouse.move(bb.x+bb.width*.985,bb.y+bb.height*.97); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(200);
      for(const k of STROKES[kind]()){ await p.mouse.move(bb.x+k[0][0]*bb.width,bb.y+k[0][1]*bb.height); await p.mouse.down(); for(const q of k.slice(1)){ await p.mouse.move(bb.x+q[0]*bb.width,bb.y+q[1]*bb.height,{steps:3}); await p.waitForTimeout(12); } await p.mouse.up(); await p.waitForTimeout(90); } await p.waitForTimeout(500); },
    files:async(sel,fl)=>{ await p.setInputFiles(sel,fl); },
  };
  try{ await scenario(T); }catch(e){ console.log('SCENARIO FAIL',name,e.message.split('\n')[0]); }
  await p.waitForTimeout(400); try{ await cdp.send('Page.stopScreencast'); }catch(e){} await ctx.close(); await b.close();
  const out=OUT+'/'+name+'.mp4'; let lst='';
  { const base=frames.length?frames[0][1]:0; const end=frames.length?frames[frames.length-1][1]:0; const f=(x)=>{ x=Math.max(0,x); const h=Math.floor(x/3600),m=Math.floor(x%3600/60),sec=Math.floor(x%60),ms=Math.round((x-Math.floor(x))*1000); return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')+','+String(ms).padStart(3,'0'); };
    let srt='', txt='# '+name+' — 내레이션 대본(자막과 같은 시간)\n\n'; CAPS.forEach((c,i)=>{ const a=c.s-base, b=(c.e||end)-base; srt+=(i+1)+'\n'+f(a)+' --> '+f(b)+'\n'+c.t+(c.sub?'\n'+c.sub:'')+'\n\n'; txt+='['+f(a).slice(3,8)+'~'+f(b).slice(3,8)+'] '+c.t+(c.sub?' — '+c.sub:'')+'\n'; });
    fs.writeFileSync(OUT+'/'+name+'.srt',srt); fs.writeFileSync(OUT+'/'+name+'_대본.txt',txt); }
  for(let i=0;i<frames.length;i++){ const d=i+1<frames.length?Math.max(0.001,frames[i+1][1]-frames[i][1]):0.5; lst+="file '"+FD+'/'+frames[i][0]+".jpg'\nduration "+d.toFixed(4)+"\n"; }
  lst+="file '"+FD+'/'+frames[frames.length-1][0]+".jpg'\n"; fs.writeFileSync(FD+'/list.txt',lst);
  require('child_process').execSync(`ffmpeg -y -loglevel error -f concat -safe 0 -i "${FD}/list.txt" -vf "scale=720:1280:flags=lanczos,fps=30,format=yuv420p" -c:v libx264 -preset medium -crf 21 -movflags +faststart "${out}"`);
  console.log('VIDEO',name,'errors',errs.length,errs.slice(0,3));
  return out;
};
