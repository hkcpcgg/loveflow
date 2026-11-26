# 서비스 이용 입구 한 줄 (261126 · 총괄 47번): 첫 화면 함께하는 곳 아래 · ?edu=1 감춤 · 관리자 창 「매장」 칸 맨 아래
import asyncio,sys
from playwright.async_api import async_playwright
P=sys.argv[1] if len(sys.argv)>1 else '/nori/lab/'
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for nm,q in [('home',''),('edu','?edu=1')]:
      pg=await br.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
      await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
      await pg.goto('http://localhost:8765'+P+q); await pg.wait_for_timeout(900)
      el=pg.locator('.fam').first; await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(300); b=await el.bounding_box()
      await pg.screenshot(path=f'shots/use_{nm}.png',clip={'x':0,'y':max(0,b['y']-40),'width':375,'height':b['height']+150})
      print(nm, await pg.evaluate("(()=>{var a=document.querySelector('.fuse a');return a?{vis:!!a.offsetParent,href:a.getAttribute('href'),t:a.target,h:Math.round(a.getBoundingClientRect().height)}:null})()"))
      if nm=='home':
        await pg.click('[data-own=admin]'); await pg.wait_for_timeout(500)
        txt=await pg.evaluate("[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>i.id||i.type)"); print('inputs',txt)
        inp=pg.locator('input:visible').first; await inp.fill('0000'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(700)
        if await pg.locator('[data-t=shop]').count()==0:
          await pg.locator('[data-c=in]:visible, [data-c=ok]:visible, [data-c=go]:visible').first.click(); await pg.wait_for_timeout(700)
        await pg.click('[data-t=shop]'); await pg.wait_for_timeout(600)
        a=pg.locator('.fuse a',has_text='우리 가게'); await a.scroll_into_view_if_needed(); await pg.wait_for_timeout(300)
        await pg.screenshot(path='shots/use_admin.png')
        print('admin', await a.evaluate("a=>({href:a.getAttribute('href'),t:a.target,vis:!!a.offsetParent})"))
      await pg.close()
    await br.close()
asyncio.run(main())
