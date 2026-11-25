# 운동회 달리기 한 판 끝까지(lab). 사용: rutest.py 크기 벌칙 cpu|two 초당걸음 [부정출발0|1] [같은발비율]
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,sys.argv[1].split('x')); BET=sys.argv[2]; MODE=sys.argv[3]; RATE=float(sys.argv[4]); FS=int(sys.argv[5]) if len(sys.argv)>5 else 0; SAME=float(sys.argv[6]) if len(sys.argv)>6 else 0
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=ru]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    await pg.screenshot(path=f'shots/ru_{W}_{MODE}_pre.png')
    if MODE=='two': await fr.click('#naWho [data-w=two]')
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click('#naGo'); await pg.wait_for_timeout(500)
    await pg.screenshot(path=f'shots/ru_{W}_{MODE}_set.png')
    bs=await fr.locator('.feet button').all(); boxes=[await b.bounding_box() for b in bs]
    async def tap(i):
      b=boxes[i]; await pg.mouse.click(b['x']+b['width']/2,b['y']+b['height']/2)
    if FS:
      await pg.wait_for_timeout(1200); await tap(0); await pg.wait_for_timeout(400); await pg.screenshot(path=f'shots/ru_{W}_{MODE}_fs.png'); await pg.wait_for_timeout(1300)
    for i in range(200):
      if await fr.evaluate("()=>Rn.ph==='go'"): break
      await pg.wait_for_timeout(50)
    foot=[0,0]; n=0; shot=0
    while await fr.evaluate("()=>Rn.ph==='go'"):
      for p_ in ([0,1] if MODE=='two' else [0]):
        if random.random()>=SAME: foot[p_]^=1
        await tap(p_*2+foot[p_])
      n+=1
      if n==18 and not shot: await pg.screenshot(path=f'shots/ru_{W}_{MODE}_run.png'); shot=1
      await pg.wait_for_timeout(max(5,1000/RATE-25))
    await pg.wait_for_timeout(600); await pg.screenshot(path=f'shots/ru_{W}_{MODE}_fin.png')
    for i in range(80):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
      await pg.wait_for_timeout(150)
    await pg.wait_for_timeout(700); await pg.screenshot(path=f'shots/ru_{W}_{MODE}_end.png')
    r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
    rate=await fr.evaluate("()=>Rn.cpuRate.toFixed(2)")
    sc=await fr.evaluate("()=>({sw:document.documentElement.scrollWidth>innerWidth,sh:document.documentElement.scrollHeight-innerHeight})")
    print(W,MODE,BET,'걸음',n,'사장님',rate,'→',r,sc,errs[:3])
asyncio.run(main())
