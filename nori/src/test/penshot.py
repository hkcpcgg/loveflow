import asyncio,sys
from playwright.async_api import async_playwright
K=sys.argv[1]; BET=sys.argv[2]
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(700)
    await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",K); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]; await fr.click(f'#naBets [data-b={BET}]'); await fr.click('#naGo'); await pg.wait_for_timeout(500)
    # 놀이를 바로 끝냄: 결과를 지어 넣고 옛 끝 화면을 켬
    await fr.evaluate("""()=>{ noriResult({game:'x',gname:document.title.split(' · ')[0],opp:'다복 사장님',win:true,detail:'시험',sc:[3,1],u:'점',out:'win'}); document.querySelector('.done').classList.add('on'); }""")
    await pg.wait_for_timeout(1500); await pg.screenshot(path=f'shots/pen_{K}_{BET}.png')
    for i in range(3):
      b=await fr.locator('.na-pens').bounding_box(); await pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(1200 if BET=='indian' else 800); await pg.mouse.up(); await pg.wait_for_timeout(1300)
    await pg.wait_for_timeout(2000)
    print(K,BET,'card',await fr.evaluate("()=>!!document.querySelector('.ncard.on')"),'layer gone',await fr.evaluate("()=>!document.querySelector('.na-penl')"),errs)
    await pg.screenshot(path=f'shots/pen_{K}_{BET}_card.png')
    await br.close()
asyncio.run(main())
