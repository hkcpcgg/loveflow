import asyncio, json, random, sys
from playwright.async_api import async_playwright
GAMES=['rp','hj','mj','br','dt','th','pt','bw','tk','mb','om','ak','rd']
VP=[tuple(map(int,sys.argv[1].split('x')))]
CHECK="""()=>{const W=innerWidth,H=innerHeight,d=document.documentElement;
 const done=[...document.querySelectorAll('.done')].find(x=>x.classList.contains('on')&&x.getBoundingClientRect().height>0&&getComputedStyle(x).display!=='none');
 const homes=[...document.querySelectorAll('.nhome,.nbar .home')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<H}).length;
 const over=[...document.querySelectorAll('body *')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&(r.right>W+1||r.left<-1)&&getComputedStyle(x).position!=='fixed'}).slice(0,5).map(x=>(x.id||x.className||x.tagName).toString().slice(0,30));
 return {done:!!done, homes, scrollW:d.scrollWidth>W+1, scrollH:d.scrollHeight-H, over};}"""
async def step(fr,pg,k,i):
    # 우선 고르기 창
    for s in ['[data-v=cpu1]','.pick.on [data-v=cpu1]']:
        el=fr.locator(s+':visible')
        if await el.count(): await el.first.click(timeout=1500); return 'pick'
    for s in ['.help.on .ok:visible','.nrule.on button']:
        el=fr.locator(s)
        if await el.count(): await el.first.click(timeout=1500); return 'okhelp'
    if k=='om':
        b=await fr.locator('#oB').bounding_box()
        if b: await pg.mouse.click(b['x']+b['width']*(0.3+0.4*random.random()), b['y']+b['height']*(0.3+0.4*random.random())); return 'omok'
    for s in ['#act button:visible:not([disabled])','#fire:visible:not([disabled])','#go:visible:not([disabled])','#grab:visible:not([disabled])','.bt:visible:not([disabled])']:
        el=fr.locator(s)
        n=await el.count()
        if n: await el.nth(random.randrange(n)).click(timeout=1500); return s
    cv=fr.locator('canvas:visible')
    if await cv.count():
        b=await cv.first.bounding_box()
        if b:
            # 내 알/공은 아래쪽 가운데 근처 — 아래에서 더 아래로 당겼다 놓기
            sx,sy=b['x']+b['width']*(0.35+0.3*random.random()), b['y']+b['height']*0.78
            await pg.mouse.move(sx,sy); await pg.mouse.down()
            await pg.mouse.move(sx+random.uniform(-15,15), sy+min(70,b['height']*0.15), steps=8)
            await pg.wait_for_timeout(300+int(random.random()*700))
            await pg.mouse.up(); return 'drag'
    return 'none'
async def main():
    out={}
    async with async_playwright() as p:
        br=await p.chromium.launch()
        for (w,h) in VP:
            for k in GAMES:
                pg=await br.new_page(viewport={'width':w,'height':h},device_scale_factor=2,has_touch=False)
                await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
                errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
                await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(900)
                await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1400)
                fr=pg.frames[-1]; log=[]; first=None
                for i in range(int(sys.argv[2]) if len(sys.argv)>2 else 60):
                    try: a=await step(fr,pg,k,i)
                    except Exception as e: a='err:'+str(e)[:40]
                    log.append(a); await pg.wait_for_timeout(900 if a!='drag' else 2400)
                    c=await fr.evaluate(CHECK)
                    if i==3: first=c; await pg.screenshot(path=f'pa_{k}_{w}_play.png')
                    if c['done']: break
                c=await fr.evaluate(CHECK)
                await pg.screenshot(path=f'pa_{k}_{w}_end.png')
                out[f'{k}@{w}']={'steps':len(log),'done':c['done'],'homes_end':c['homes'],'play':first,'end':c,'errs':errs,'acts':sorted(set(log))}
                print(k,w,out[f'{k}@{w}']['done'],len(log),c, errs[:2], flush=True)
                await pg.close()
        await br.close()
    json.dump(out,open('play_all_'+sys.argv[1]+'.json','w'),ensure_ascii=False,indent=1)
asyncio.run(main())
