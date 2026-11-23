# 사방치기 v2 한 판 끝까지(lab): ① 줄이 과녁을 가리킬 때 누르고 ② 돌이 과녁 칸에 오면 뗌. 실수율만큼 일부러 빗나감.
# 사용: sabtest.py 크기 cpu|two 벌칙 실수율
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,sys.argv[1].split('x')); WHO=sys.argv[2]; BET=sys.argv[3]; MISS=float(sys.argv[4])
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=sb]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo')
    await pg.wait_for_timeout(5600); await pg.screenshot(path=f'shots/sab_{W}_{WHO}_demo.png')
    throws=0; shot=0
    for i in range(500):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
      st=await fr.evaluate("()=>({busy:B.busy,ph:B.ph,turn:B.turn,dis:$('sbGo')?$('sbGo').disabled:true})")
      if st['dis'] or st['busy'] or st['ph']!='dir': await pg.wait_for_timeout(200); continue
      miss=random.random()<MISS
      bb=await fr.locator('#sbGo').bounding_box(); bx,by=bb['x']+bb['width']/2,bb['y']+bb['height']/2; await pg.mouse.move(bx,by)
      want=await fr.evaluate("()=>{var G=sabGeo(),o=S0(G),c=cellPt(tgtN());return Math.atan2(c.x-o.x,o.y-c.y)}")
      if miss: want+=0.35*random.choice([-1,1])
      for j in range(300):
        a=await fr.evaluate("()=>B.ang")
        if abs(a-want)<0.03 or (miss and j>100): break
        await pg.wait_for_timeout(10)
      await pg.mouse.down(); await pg.mouse.up(); await pg.wait_for_timeout(150)
      if shot==0: await pg.screenshot(path=f'shots/sab_{W}_{WHO}_aim.png')
      await pg.mouse.down()
      for j in range(400):
        h=await fr.evaluate("()=>{var p=ptAt(sabGeo(),B.ang,B.q||0);return String(hitN(p))===String(tgtN())}")
        if h and j>3: break
        await pg.wait_for_timeout(10)
      if shot==0: await pg.screenshot(path=f'shots/sab_{W}_{WHO}_pow.png'); shot=1
      await pg.mouse.up(); throws+=1; await pg.wait_for_timeout(300)
    await pg.wait_for_timeout(600); await pg.screenshot(path=f'shots/sab_{W}_{WHO}_end.png')
    r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
    sc=await pg.evaluate("()=>({sw:document.documentElement.scrollWidth>innerWidth})")
    print(W,WHO,BET,'던짐',throws,'→',r,sc,errs[:2])
asyncio.run(main())
