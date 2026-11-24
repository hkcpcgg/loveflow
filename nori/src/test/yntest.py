# 윷놀이 한 판 끝까지(lab). 사용: yntest.py 크기 벌칙 cpu|two 실수율 [말수 2|4] [빽도 0|1]
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,sys.argv[1].split('x')); BET=sys.argv[2]; MODE=sys.argv[3]; MISS=float(sys.argv[4]); YNN=sys.argv[5] if len(sys.argv)>5 else '2'; YBD=sys.argv[6] if len(sys.argv)>6 else '0'
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=yn]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    fr.on('pageerror',lambda e:errs.append(str(e)[:200]))
    if MODE=='two': await fr.click('#naWho [data-w=two]')
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click('#naGo'); await pg.wait_for_timeout(500)
    await fr.click(f'#ynSet [data-k=n] [data-v="{YNN}"]'); await fr.click(f'#ynSet [data-k=bd] [data-v="{YBD}"]'); await pg.screenshot(path=f'shots/yn_{W}_{MODE}_set.png'); await fr.click('#ynSet .go'); await pg.wait_for_timeout(900)
    await pg.screenshot(path=f'shots/yn_{W}_{MODE}_start.png')
    shot=0; th=0; nak=0; picks=0; res={}
    for i in range(3000):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
      st=await fr.evaluate("()=>({ph:Y.ph,t:Y.turn,h:(Y.turn===0||S.mode==='two'),over:S.over})")
      if st['over']: await pg.wait_for_timeout(200); continue
      if st['ph']=='throw' and st['h']:
        b=await fr.locator('#ynGo').bounding_box()
        hold = 1700 if random.random()<MISS else random.randint(560,1150)
        await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(hold//2)
        if shot==0: await pg.screenshot(path=f'shots/yn_{W}_{MODE}_hold.png'); shot=1
        await pg.wait_for_timeout(hold-hold//2); await pg.mouse.up(); th+=1
        await pg.wait_for_timeout(1300)
        r=await fr.evaluate("()=>document.getElementById('ynres').textContent"); res[r[:2]]=res.get(r[:2],0)+1
      elif st['ph']=='pick' and st['h'] and await fr.evaluate("()=>!!document.querySelector('.ynopt button')"):
        if shot==1: await pg.screenshot(path=f'shots/yn_{W}_{MODE}_pick.png'); shot=2
        bs=await fr.locator('.ynopt button').count()
        await fr.locator('.ynopt button').nth(random.randrange(bs)).click(); picks+=1
        if shot==2: await pg.wait_for_timeout(1500); await pg.screenshot(path=f'shots/yn_{W}_{MODE}_mid.png'); shot=3
      await pg.wait_for_timeout(60)
    await pg.wait_for_timeout(700); await pg.screenshot(path=f'shots/yn_{W}_{MODE}_end.png')
    r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
    sc=await fr.evaluate("()=>({sw:document.documentElement.scrollWidth>innerWidth,sh:document.documentElement.scrollHeight-innerHeight})")
    print(W,MODE,BET,'던짐',th,'고름',picks,res,'→',r,sc,errs[:3])
asyncio.run(main())
