import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':375,'height':667})
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(700)
    for k in ['dt','rp','rd','om']:
      await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1300)
      fr=pg.frames[-1]
      a=await fr.evaluate("()=>!!document.querySelector('.na-sh.on #naGo')")
      await fr.evaluate("()=>document.querySelector('.na-dim').click()"); await pg.wait_for_timeout(500)
      home=await pg.evaluate("()=>!document.getElementById('ov').classList.contains('on')")
      await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(900)
      b=await fr.evaluate("()=>!!document.querySelector('.na-sh.on #naGo')")
      # 시작 → 다시(아래 막대) → 다시 시작 창
      await fr.click('#naGo'); await pg.wait_for_timeout(600)
      await fr.click('.nbar [data-a=new]'); await pg.wait_for_timeout(700)
      c=await fr.evaluate("()=>!!document.querySelector('.na-sh.on #naGo')")
      await fr.click('#naGo'); await pg.wait_for_timeout(400)
      await fr.click('.nbar [data-a=list]'); await pg.wait_for_timeout(500)
      print(k,'pre first',a,'cancel→home',home,'reopen pre',b,'다시→pre',c)
    print(errs)
    await br.close()
asyncio.run(main())
