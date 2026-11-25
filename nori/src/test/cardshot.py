# 결과 카드 전후 사진(lab). 사용: cardshot.py 이름 [놀이키 jg]
import asyncio,sys
from playwright.async_api import async_playwright
NAME=sys.argv[1]; K=sys.argv[2] if len(sys.argv)>2 else 'jg'
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(700)
    await pg.evaluate(f"()=>document.querySelector('.g[data-go={K}]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]
    await fr.click('#naBets [data-b=none]'); await fr.click('#naGo'); await pg.wait_for_timeout(600)
    await fr.evaluate("()=>finish(true,12,9)"); await pg.wait_for_timeout(2200)
    await pg.screenshot(path=f'shots/card_{NAME}_1.png')
    await fr.fill('.ncard .memo','외할머니 댁 마루'); await fr.dispatch_event('.ncard .memo','input'); await pg.wait_for_timeout(300)
    await fr.evaluate("()=>{var c=document.querySelector('.ncard');c.scrollTop=c.scrollHeight}"); await pg.wait_for_timeout(300)
    await pg.screenshot(path=f'shots/card_{NAME}_2.png'); print(NAME,errs)
asyncio.run(main())
