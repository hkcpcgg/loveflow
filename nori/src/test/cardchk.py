import asyncio
from playwright.async_api import async_playwright
CHK="()=>!!document.querySelector('.ncard.on')"
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for k in ['rp','br']:
      ctx=await br.new_context(viewport={'width':375,'height':667},device_scale_factor=2,accept_downloads=True)
      pg=await ctx.new_page()
      await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
      errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
      await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(700)
      await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1200)
      fr=pg.frames[-1]
      try: await fr.locator('[data-v=cpu1]:visible').first.click(timeout=1200)
      except Exception: pass
      for i in range(60):
        if await fr.evaluate(CHK): break
        try:
          if k=='om':
            b=await fr.locator('#oB').bounding_box(); import random
            await pg.mouse.click(b['x']+b['width']*(0.2+0.6*random.random()), b['y']+b['height']*(0.2+0.6*random.random()))
          elif k=='dt': await fr.locator('#fire:visible:not([disabled])').click(timeout=800)
          elif k=='tk':
            cv=fr.locator('canvas:visible'); b=await cv.first.bounding_box(); sx,sy=b['x']+b['width']*0.5,b['y']+b['height']*0.5
            await pg.mouse.move(sx,sy); await pg.mouse.down(); await pg.mouse.move(sx+3,sy+40,steps=6); await pg.wait_for_timeout(600); await pg.mouse.up(); await pg.wait_for_timeout(2500)
          else:
            el=fr.locator('#act button:visible:not([disabled]), #go:visible:not([disabled])'); n=await el.count()
            if n: await el.nth(i%n).click(timeout=800)
        except Exception as e: pass
        await pg.wait_for_timeout(900)
      ok=await fr.evaluate(CHK)
      await pg.wait_for_timeout(400); await pg.screenshot(path=f'card_{k}.png')
      if ok:
        await fr.locator('.ncard input[type=file]').set_input_files('test_photo.jpg'); await pg.wait_for_timeout(500)
        await fr.locator('.ncard .memo').fill('사장님을 처음 이겼다!')
        await pg.screenshot(path=f'card_{k}_photo.png')
        async with pg.expect_download(timeout=8000) as dl:
          await fr.locator('.ncard [data-c=save]').click()
        d=await dl.value; await d.save_as(f'card_{k}_out.png')
        # 다시 하기 via bar
        await fr.locator('.nbar [data-a=new]').click(); await pg.wait_for_timeout(800)
        reopened=await fr.evaluate(CHK); homes=await fr.evaluate("()=>document.querySelectorAll('.nhome').length")
        print(k,'card',ok,'after again card open?',reopened,'nhome',homes,errs[:2],flush=True)
      else: print(k,'NO CARD',errs[:2],flush=True)
      await ctx.close()
    await br.close()
asyncio.run(main())
