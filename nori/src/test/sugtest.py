# 수건돌리기 한 판 끝까지(lab). 사용: sugtest.py 크기 cpu|two 벌칙 놓침율
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,sys.argv[1].split('x')); WHO=sys.argv[2]; BET=sys.argv[3]; MISS=float(sys.argv[4])
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=sg]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo'); await pg.wait_for_timeout(800)
    seen=set(); shot=False
    for i in range(1200):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
      st=await fr.evaluate("()=>({drop:G2.drop,done:G2.done,me:G2.me,op:G2.op,t0:G2.t0})")
      if not st['done'] and st['drop']>=0 and st['t0'] not in seen:
        seen.add(st['t0'])
        if not shot: await pg.screenshot(path=f'shots/sug_{W}_{WHO}_drop.png'); shot=True
        tgt='#sgA' if st['drop']==st['me'] else ('#sgB' if st['drop']==st['op'] else None)
        if tgt and random.random()>MISS: await pg.wait_for_timeout(random.randint(300,1500)); await fr.locator(tgt).dispatch_event('pointerdown')
      await pg.wait_for_timeout(80)
    await pg.wait_for_timeout(600); await pg.screenshot(path=f'shots/sug_{W}_{WHO}_end.png')
    r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
    print(W,WHO,BET,'판',len(seen),'→',r,errs[:2])
asyncio.run(main())
