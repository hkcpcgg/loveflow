# 13종 × 휴대폰 크기 — 시작 직후 화면: 겹침 · 넘침 · 잘린 글씨 · 오류
import asyncio,sys,json
from playwright.async_api import async_playwright
G=['rp','hj','mj','br','aw','yt','dt','th','pt','bw','tk','mb','om','ak','rd']
SIZES=[(360,640),(375,667),(412,915)]
CHK="""()=>{const W=innerWidth,H=innerHeight,R=e=>e&&e.getBoundingClientRect(),vis=e=>{if(!e)return false;const r=R(e);return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
 const iss=[]; const ov=(a,b)=>a&&b&&!(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top);
 const t=document.querySelector('.top .ttl,#ttl'), tr=document.querySelector('.na-tr'), st=document.querySelector('.top .na-strip.in');
 if(vis(t)&&vis(tr)){ const range=document.createRange(); range.selectNodeContents(t); const tb=range.getBoundingClientRect(); if(ov(tb,R(tr))) iss.push('제목·오른쪽단추 겹침'); if(st&&ov(tb,R(st))) iss.push('제목·걸린것 겹침'); }
 const L=document.querySelector('.nside.l'), Rr=document.querySelector('.nside.r');
 const b=[...document.querySelectorAll('.board,.brd,#oB,.na-pens')].find(vis);
 if(b&&vis(L)&&!L.classList.contains('na-gone')){ if(R(L).right>R(b).left+1) iss.push('왼기둥이 판을 덮음'); if(R(Rr).left<R(b).right-1) iss.push('오른기둥이 판을 덮음'); if(R(L).left<0||R(Rr).right>W) iss.push('기둥 화면 밖'); }
 [...document.querySelectorAll('button,.bt,.pk,.na-strip span,.strip span,.bub,.lab')].filter(vis).forEach(e=>{ if(e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!=='visible') iss.push('잘림:'+(e.textContent||'').trim().slice(0,14)); const r=R(e); if(r.right>W+1||r.left<-1) iss.push('화면밖:'+(e.textContent||e.className).toString().trim().slice(0,14)); });
 const bar=document.querySelector('.nbar'); if(bar){ [...document.querySelectorAll('#act button,.act button,#fire,#go,#grab')].filter(vis).forEach(e=>{ if(R(e).bottom>R(bar).top+1) iss.push('단추가 아래막대에 가림:'+(e.textContent||'').trim().slice(0,10)); }); }
 const sh=document.documentElement.scrollHeight-H; if(sh>2) iss.push('세로넘침 '+sh+'px'); if(document.documentElement.scrollWidth>W+1) iss.push('가로넘침');
 return [...new Set(iss)];}"""
async def main():
  out={}
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for (w,h) in SIZES:
      for k in G:
        pg=await br.new_page(viewport={'width':w,'height':h},device_scale_factor=2)
        await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
        await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(600)
        await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1300)
        fr=pg.frames[-1]
        pre=await fr.evaluate("()=>!!document.querySelector('.na-sh.on #naGo')")
        if pre: await fr.click('#naGo')
        await pg.wait_for_timeout(1500)
        iss=await fr.evaluate(CHK)
        if not pre: iss.append('시작 전 창 안 뜸')
        if errs: iss.append('오류:'+errs[0])
        await pg.screenshot(path=f'rv/{k}_{w}.png')
        out[f'{k}@{w}x{h}']=iss
        if iss: print(k,w,h,iss,flush=True)
        await pg.close()
    await br.close()
  json.dump(out,open('rv/review.json','w'),ensure_ascii=False,indent=1); print('끝', sum(1 for v in out.values() if v),'건 / ',len(out))
asyncio.run(main())
