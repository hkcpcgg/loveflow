import asyncio
from playwright.async_api import async_playwright
async def run(br,k,mode,bet,play,W=375,H=667):
  pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
  await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
  errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
  await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(600)
  await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1300)
  fr=pg.frames[-1]
  if mode=='two': await fr.click('#naWho [data-w=two]')
  await fr.click(f'#naBets [data-b={bet}]'); await fr.click('#naGo'); await pg.wait_for_timeout(700)
  pen=False
  for i in range(80):
    if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
    if await fr.evaluate("()=>!!document.querySelector('.pn-sc')"):
      pen=True; b=await fr.locator('#board').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(1300); continue
    await play(pg,fr,i)
  await pg.wait_for_timeout(500); await pg.screenshot(path=f'shots/p3_{k}_{mode}_{bet}_end.png')
  r=await fr.evaluate("()=>{var c=document.querySelector('.ncard.on');return c?c.querySelector('.res').textContent+' | '+c.querySelector('.gn').textContent:'카드 없음'}")
  print(k,mode,bet,'→',r,'| 벌칙',pen,errs[:1]); await pg.close()
async def arm_win(pg,fr,i):
  b=await fr.locator('#armA').bounding_box()
  if not b: await pg.wait_for_timeout(500); return
  await pg.mouse.move(b['x']+20,b['y']+20)
  for j in range(6): await pg.mouse.down(); await pg.wait_for_timeout(60); await pg.mouse.up(); await pg.wait_for_timeout(40)
async def arm_idle(pg,fr,i):
  # 한 번만 누르고 쉼 — 한 번도 안 누르면 판이 시작되지 않음(261123 고침)
  if i==0:
    b=await fr.locator('#armA').bounding_box()
    if b: await pg.mouse.move(b['x']+20,b['y']+20); await pg.mouse.down(); await pg.wait_for_timeout(60); await pg.mouse.up()
  await pg.wait_for_timeout(600)
async def arm_two(pg,fr,i):
  b=await fr.locator('#armB').bounding_box()
  if not b: await pg.wait_for_timeout(500); return
  await pg.mouse.move(b['x']+20,b['y']+20)
  for j in range(6): await pg.mouse.down(); await pg.wait_for_timeout(60); await pg.mouse.up(); await pg.wait_for_timeout(40)
async def yeot(pg,fr,i):
  st=await fr.evaluate("()=>({pick:Y.pick,done:Y.done,next:Y.next,dis:$('yeotGo')?$('yeotGo').disabled:true})")
  if st['next']: await fr.click('#yeotGo'); await pg.wait_for_timeout(500); return
  if st['pick']<0 and not st['done']:
    await fr.locator('.yeot').nth(i%3).click(); await pg.wait_for_timeout(700); return
  if not st['dis'] and not st['done']:
    b=await fr.locator('#yeotGo').bounding_box(); await pg.mouse.move(b['x']+30,b['y']+20); await pg.mouse.down(); await pg.wait_for_timeout(1200); await pg.mouse.up(); await pg.wait_for_timeout(2200); return
  await pg.wait_for_timeout(600)
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    await run(br,'aw','cpu','ttak',arm_win)
    await run(br,'aw','cpu','kkul',arm_idle)
    await run(br,'aw','two','indian',arm_two)
    await run(br,'yt','cpu','ttak',yeot)
    await run(br,'yt','cpu','none',yeot,360,640)
    await br.close()
asyncio.run(main())
