import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=mj]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]; await fr.click('#naGo'); await pg.wait_for_timeout(500)
    words=[]
    for i in range(14):
      if await fr.evaluate("()=>MJ.att!=null"):
        b=fr.locator('#act button.h:not([disabled])'); await b.nth(i%3).click()
        for t in range(30):
          w=await fr.evaluate("()=>document.getElementById('word')&&document.getElementById('word').textContent"); 
          if w and w not in words[-1:]: words.append(w)
          if w and w.endswith('!') and w[:-1] in '묵찌빠': await pg.screenshot(path='shots/g_mj_shout.png'); break
          await pg.wait_for_timeout(60)
        print('2단계 소리 순서:',words[-3:]); break
      b=fr.locator('#act button.h:not([disabled])')
      if await b.count(): await b.nth(i%3).click()
      await pg.wait_for_timeout(2600)
    await br.close()
asyncio.run(main())
