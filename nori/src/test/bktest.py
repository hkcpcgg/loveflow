# 박 터뜨리기 한 판 끝까지 (261125): python3 test/bktest.py [크기] [cpu|two] [맞히는 비율] [벌칙] [경로]
# 누르고 있다가 Bk.pw 가 초록 칸에 오면 뗌(맞히는 비율만큼 · 나머지는 일부러 이르거나 늦게) · 사진 shots/bk_<단계>.png
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x')); WHO=sys.argv[2] if len(sys.argv)>2 else 'cpu'
ACC=float(sys.argv[3]) if len(sys.argv)>3 else .7; BET=sys.argv[4] if len(sys.argv)>4 else 'none'; PATH=sys.argv[5] if len(sys.argv)>5 else '/nori/lab/'
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
    await pg.evaluate("document.querySelector('.g[data-go=bk]').click()"); await pg.wait_for_timeout(1400)
    fr=pg.frames[-1]
    await pg.screenshot(path='shots/bk_0pre.png')
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo')
    await fr.evaluate("()=>{window.__bc=[0,0]; var o=bkCpu; bkCpu=function(){ __bc[0]++; return o(); }; var t=bkThrow; bkThrow=function(p,pw){ if(p===1) __bc[1]++; return t(p,pw); }; }")
    for i in range(40):
      await pg.wait_for_timeout(150)
      if await fr.evaluate("()=>Bk.ph==='go'"): break
    await pg.wait_for_timeout(300); await pg.screenshot(path='shots/bk_1go.png')
    throws=0; shot=False; t0=await fr.evaluate("()=>performance.now()")
    for n in range(80):
      st=await fr.evaluate("()=>({ph:Bk.ph,fly:Bk.fly[0],hits:Bk.hits.slice()})")
      if st['ph']!='go': break
      if st['fly']: await pg.wait_for_timeout(80); continue
      want=random.random()<ACC; tgt=random.uniform(.67,.81) if want else random.choice([random.uniform(.2,.5),random.uniform(.9,.99)])
      b=await fr.locator('.throw button').first.bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down()
      up=False; prev=0
      for k in range(60):
        await pg.wait_for_timeout(12); pw=await fr.evaluate("()=>Bk.pw[0]")
        if pw>=tgt-.025 and pw>=prev: break
        prev=pw
      await pg.mouse.up(); throws+=1
      if throws==3 and not shot: shot=True; await pg.wait_for_timeout(250); await pg.screenshot(path='shots/bk_2play.png')
      await pg.wait_for_timeout(180+random.randint(250,500))
      if WHO=='two':  # 친구 단추도 한 번 (오른쪽) — 둘이 함께 누르는지
        b2=await fr.locator('.throw button.b').bounding_box(); await pg.mouse.move(b2['x']+b2['width']/2,b2['y']+b2['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(random.randint(500,900)); await pg.mouse.up()
    t1=await fr.evaluate("()=>performance.now()")
    await pg.wait_for_timeout(600); await pg.screenshot(path='shots/bk_3open.png')
    hits=await fr.evaluate("()=>Bk.hits.slice()")
    for i in range(30):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        bb=await fr.locator('#board').bounding_box(); await pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']*.5); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up()
      await pg.wait_for_timeout(500)
    await pg.wait_for_timeout(400); await pg.screenshot(path='shots/bk_4card.png')
    card=await fr.evaluate("()=>!!document.querySelector('.ncard.on')")
    det=await fr.evaluate("()=>window.__noriLast?__noriLast.detail:''")
    bc=await fr.evaluate('()=>window.__bc'); print('boss calls/throws',bc,'rate',await fr.evaluate('()=>Bk.hit'))
    print(W,H,WHO,'acc',ACC,'throws',throws,'hits',hits,'secs',round((t1-t0)/1000,1),'card',card,det,errs[:2])
    await br.close()
asyncio.run(main())
