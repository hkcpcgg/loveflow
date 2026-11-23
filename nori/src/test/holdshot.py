import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for k,sel in [('th','#cv'),('tk','#cv'),('pt','#pB'),('om','#oB'),('rd','.board')]:
      pg=await br.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
      await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
      errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
      await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(600)
      await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1300)
      fr=pg.frames[-1]; await fr.click('#naGo'); await pg.wait_for_timeout(900)
      b=await fr.locator(sel).first.bounding_box()
      if k in ('th','tk','pt'):
        x,y=b['x']+b['width']*.5,b['y']+b['height']*(.8 if k!='tk' else .55)
        if k=='pt': x,y=b['x']+b['width']*.48,b['y']+b['height']*.91
        await pg.mouse.move(x,y); await pg.mouse.down(); await pg.mouse.move(x,y+60,steps=8); await pg.wait_for_timeout(700)
        h=await fr.evaluate("()=>{var i=document.querySelector('.nside.l .bat i'),g=document.querySelector('.nside.l .bat .gz');return [i.style.height,g.style.display,g.style.height]}")
        await pg.screenshot(path=f'shots/h_{k}.png'); await pg.mouse.up()
        print(k,'왼기둥 힘',h,errs[:1])
      else:
        await pg.screenshot(path=f'shots/h_{k}.png'); print(k,'ok',errs[:1])
      await pg.close()
    await br.close()
asyncio.run(main())
