import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':375,'height':705},device_scale_factor=2)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.route('**/*',lambda r: r.abort() if 'googleapis' in r.request.url or 'gstatic' in r.request.url else r.continue_())
    await pg.goto('file:///home/claude/proto/index.html'); await pg.wait_for_timeout(500)
    await pg.screenshot(path='s_home.png')
    await pg.click('.tile[data-g=rps]'); await pg.wait_for_timeout(400); await pg.screenshot(path='s_pre.png')
    await pg.click('#preGo'); await pg.wait_for_timeout(500); await pg.screenshot(path='s_rps.png')
    await pg.click('#sndBtn'); await pg.wait_for_timeout(400); await pg.click('[data-o=mute]'); await pg.wait_for_timeout(200); await pg.screenshot(path='s_set.png'); await pg.click('#setOk'); await pg.wait_for_timeout(300)
    for i in range(10):
      if await pg.locator('#cardv.on').count(): break
      if await pg.locator('#rpsBtns').is_visible(): await pg.click('#rpsBtns [data-h="%d"]'%(i%3)); await pg.wait_for_timeout(1600)
      else:
        st=await pg.locator('#rpsStage').bounding_box(); cx,cy=st['x']+st['width']/2,st['y']+st['height']/2
        if await pg.locator('#rpsStage .face').count() and 'cpu' in 'cpu':
          await pg.mouse.move(cx,cy); await pg.mouse.down(); await pg.wait_for_timeout(700); await pg.mouse.up(); await pg.wait_for_timeout(900)
        else: await pg.wait_for_timeout(1500)
      if i==3: await pg.screenshot(path='s_pen.png')
    await pg.wait_for_timeout(4000); await pg.screenshot(path='s_card.png')
    await pg.click('#bHome'); await pg.click('.tile[data-g=arm]'); await pg.click('#preGo'); await pg.wait_for_timeout(600); await pg.screenshot(path='s_arm.png')
    await pg.click('#bHome'); await pg.click('.tile[data-g=yeot]'); await pg.click('#preGo'); await pg.wait_for_timeout(600); await pg.screenshot(path='s_yeot.png')
    print('errors',errs); await b.close()
asyncio.run(main())
