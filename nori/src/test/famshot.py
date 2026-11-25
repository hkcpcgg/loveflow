# 함께하는 곳 전후 사진 (261125): labb = 바꾸기 전 · lab = 바꾼 뒤
import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for nm,u in [('before','/nori/labb/'),('after','/nori/lab/')]:
      pg=await br.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
      await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
      await pg.goto('http://localhost:8765'+u); await pg.wait_for_timeout(900)
      el=pg.locator('.fam').first; await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(300)
      b=await el.bounding_box()
      await pg.screenshot(path=f'shots/fam_{nm}.png',clip={'x':0,'y':max(0,b['y']-50),'width':375,'height':b['height']+80})
      print(nm, await pg.evaluate("[...document.querySelectorAll('.fam a')].map(a=>a.textContent.trim())"))
    await br.close()
asyncio.run(main())
