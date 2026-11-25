# 손놀이 한 판 끝까지: 시작 → 놀이 → 벌칙(누르기) → 결과 카드. 사진: flow_<k>_<단계>.png
import asyncio,sys,random
from playwright.async_api import async_playwright
K=sys.argv[1]; BET=sys.argv[2] if len(sys.argv)>2 else 'ttak'; W,H=map(int,(sys.argv[3] if len(sys.argv)>3 else '375x667').split('x')); WHO=sys.argv[4] if len(sys.argv)>4 else 'cpu'
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m: errs.append('c:'+m.text[:150]) if m.type=='error' else None)
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",K); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo'); await pg.wait_for_timeout(600)
    shot=0; pen=False; t=0
    for i in range(120):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        if not pen:
          pen=True; await pg.wait_for_timeout(1400); await pg.screenshot(path=f'shots/flowlab_{K}_{BET}_pen0.png')
        b=await fr.locator('#board').bounding_box(); x,y=b['x']+b['width']/2,b['y']+b['height']*.5
        await pg.mouse.move(x,y); await pg.mouse.down(); await pg.wait_for_timeout(1300 if BET=='indian' else 800); await pg.mouse.up(); await pg.wait_for_timeout(1300)
        if t==0: await pg.screenshot(path=f'shots/flowlab_{K}_{BET}_pen1.png')
        t+=1; continue
      el=fr.locator('#act button:visible:not([disabled])'); n=await el.count()
      if n:
        try: await el.nth(random.randrange(n)).click(timeout=800)
        except Exception: pass
      if i==2: await pg.screenshot(path=f'shots/flowlab_{K}_{BET}_play.png')
      await pg.wait_for_timeout(700)
    await pg.wait_for_timeout(500); await pg.screenshot(path=f'shots/flowlab_{K}_{BET}_card.png')
    card=await fr.evaluate("()=>!!document.querySelector('.ncard.on')")
    gn=await fr.evaluate("()=>{var e=document.querySelector('.ncard .gn');return e?e.textContent:''}")
    print(K,BET,WHO,'card',card,'pen',pen,'gn',gn,errs[:3])
    await br.close()
asyncio.run(main())
