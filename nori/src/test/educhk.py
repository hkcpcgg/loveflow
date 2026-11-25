# 사랑흐름-놀이-007: ?edu=1 이 가게 번호 없이 바로 놀이 고르기로 열리는지
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for u in sys.argv[1:]:
      pg=await br.new_page(viewport={'width':375,'height':667})
      await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
      errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:100]))
      await pg.goto('http://localhost:8765'+u); await pg.wait_for_timeout(900)
      r=await pg.evaluate("()=>({games:[...document.querySelectorAll('.g[data-go]')].filter(e=>e.offsetParent).length, edu:document.documentElement.classList.contains('edu')||document.body.classList.contains('edu'), eduLine:(document.body.innerText.match(/교육 시간[^\\n]*/)||[''])[0], giftBand:!!([...document.querySelectorAll('*')].find(e=>e.offsetParent&&/푸짐한 선물/.test(e.textContent)&&e.children.length==0)), firstY:Math.round((document.querySelector('.g[data-go]')||{getBoundingClientRect:()=>({top:-1})}).getBoundingClientRect().top)})")
      await pg.evaluate("document.querySelector('.g[data-go=rp]').click()"); await pg.wait_for_timeout(1300)
      opened=len(pg.frames)>1
      print(u,r,'game opens',opened,errs[:1]); await pg.close()
    await br.close()
asyncio.run(main())
