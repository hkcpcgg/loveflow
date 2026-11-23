# 사방치기 한 판 끝까지(lab): 노란 칸에서 놓는 로봇 / 실수 섞기. 사용: sabtest.py 크기 cpu|two 벌칙 실수율
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,sys.argv[1].split('x')); WHO=sys.argv[2]; BET=sys.argv[3]; MISS=float(sys.argv[4])
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2,has_touch=False)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=sb]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo'); await pg.wait_for_timeout(800)
    await pg.wait_for_timeout(5200); await pg.screenshot(path=f'shots/sab_{W}_{WHO}_demo.png')
    throws=0
    for i in range(400):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
      st=await fr.evaluate("()=>({busy:B.busy,turn:B.turn,dis:$('sbGo')?$('sbGo').disabled:true,want:ROWOF[Math.min(7,B.st[B.turn])]})")
      if st['dis'] or st['busy']: await pg.wait_for_timeout(250); continue
      bb=await fr.locator('#sbGo').bounding_box(); await pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2); await pg.mouse.down()
      miss=random.random()<MISS; tgt=st['want']+(1 if miss else 0)
      for j in range(200):
        r=await fr.evaluate("()=>{var G=sabGeo();return rowFromY(G,aimY(G,B.q||0))}")
        if r==tgt and j>2: break
        await pg.wait_for_timeout(15)
      await pg.mouse.up(); throws+=1
      if throws==2: await pg.wait_for_timeout(300); await pg.screenshot(path=f'shots/sab_{W}_{WHO}_mid.png')
      await pg.wait_for_timeout(300)
    await pg.wait_for_timeout(600); await pg.screenshot(path=f'shots/sab_{W}_{WHO}_end.png')
    r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
    sc=await pg.evaluate("()=>({sw:document.documentElement.scrollWidth>innerWidth})")
    print(W,WHO,BET,'던짐',throws,'→',r,sc,errs[:2])
asyncio.run(main())
