# 번데기 돌림판 한 판 끝까지(lab). 사용: bntest.py 크기 벌칙 cpu|two
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,sys.argv[1].split('x')); BET=sys.argv[2]; MODE=sys.argv[3]
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=bn]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    if MODE=='two': await fr.click('#naWho [data-w=two]')
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click('#naGo'); await pg.wait_for_timeout(900)
    await pg.screenshot(path=f'shots/bn_{W}_{MODE}_start.png')
    shot=0; sp=0; res={}
    for i in range(2000):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
      st=await fr.evaluate("()=>({ph:N.ph,t:N.turn,h:(N.turn===0||S.mode==='two'),over:S.over})")
      if st['ph']=='spin' and st['h'] and not st['over']:
        b=await fr.locator('#bnGo').bounding_box(); hold=random.choice([150]+[random.randint(400,1500)]*6)
        await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(hold); await pg.mouse.up(); sp+=1
        if shot==0: await pg.wait_for_timeout(500); await pg.screenshot(path=f'shots/bn_{W}_{MODE}_spin.png'); shot=1
        await pg.wait_for_timeout(300)
      if shot==1 and await fr.evaluate("()=>N.ph==='turn'")==False and sp>=1:
        await pg.wait_for_timeout(100)
      await pg.wait_for_timeout(80)
    await pg.wait_for_timeout(700); await pg.screenshot(path=f'shots/bn_{W}_{MODE}_end.png')
    r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
    sc=await fr.evaluate("()=>({sw:document.documentElement.scrollWidth>innerWidth,sh:document.documentElement.scrollHeight-innerHeight})")
    print(W,MODE,BET,'돌림',sp,'→',r,sc,errs[:3])
asyncio.run(main())
