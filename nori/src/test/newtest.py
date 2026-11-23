# 새 혼자 놀이 셋 한 판 끝까지(lab): 제기차기 · 공기놀이 · 무궁화꽃. 사용: newtest.py 놀이(jg|gg|mg) 크기 벌칙 실수율
import asyncio,sys,random
from playwright.async_api import async_playwright
K=sys.argv[1]; W,H=map(int,sys.argv[2].split('x')); BET=sys.argv[3]; MISS=float(sys.argv[4])
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate(f"()=>document.querySelector('.g[data-go={K}]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]; fr.on=None
    fe=[];
    await fr.click(f'#naBets [data-b={BET}]'); await fr.click('#naGo'); await pg.wait_for_timeout(600)
    shot=0; acts=0
    for i in range(6000):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
        b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
      if K=='jg':
        st=await fr.evaluate("()=>{var G=jgGeo();return {ph:J.ph,turn:J.turn,y:J.y,zt:G.zt,zb:G.zb,n:J.n}}")
        if st['turn']==0 and st['ph']=='fall' and st['y'] and st['y']>=st['zt']+6:
          if random.random()<MISS*0.15: await pg.wait_for_timeout(400)
          await fr.locator('#jgGo').dispatch_event('pointerdown'); acts+=1
          if shot==0 and st['n']>=3: await pg.screenshot(path=f'shots/new_{K}_{W}_play.png'); shot=1
          await pg.wait_for_timeout(120)
      elif K=='gg':
        st=await fr.evaluate("()=>{var G=kgGeo();return {ph:K.ph,turn:K.turn,y:K.y,u:K.u,ht:G.ht,hb:G.hb,need:K.need,picked:(K.picked||[]).length}}")
        if st['turn']==0:
          if st['ph']=='ready': await fr.locator('#kgGo').dispatch_event('pointerdown'); acts+=1; await pg.wait_for_timeout(60)
          elif st['ph']=='air':
            if st['picked']<st['need']:
              if random.random()<MISS*0.05: await pg.wait_for_timeout(700)
              await fr.locator('#kgs .kgs:not(.got)').first.dispatch_event('pointerdown'); await pg.wait_for_timeout(110)
              if shot==0: await pg.screenshot(path=f'shots/new_{K}_{W}_play.png'); shot=1
            elif st['u'] and st['u']>.5 and st['y']>=st['ht']+8:
              await fr.locator('#kgGo').dispatch_event('pointerdown')
      else:
        st=await fr.evaluate("()=>({ph:M.ph,lit:[...document.querySelectorAll('#mgw span.on')].length})")
        if st['ph']=='say' and st['lit']<(7 if random.random()>MISS else 10):
          await fr.locator('#mgGo').dispatch_event('pointerdown'); acts+=1
          if shot==0 and st['lit']>=4: await pg.screenshot(path=f'shots/new_{K}_{W}_play.png'); shot=1
          await pg.wait_for_timeout(130)
      await pg.wait_for_timeout(15)
    await pg.wait_for_timeout(700); await pg.screenshot(path=f'shots/new_{K}_{W}_end.png')
    r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
    sc=await fr.evaluate("()=>({sw:document.documentElement.scrollWidth>innerWidth,sh:document.documentElement.scrollHeight-innerHeight})")
    print(K,W,BET,'누름',acts,'→',r,sc,errs[:3])
asyncio.run(main())
