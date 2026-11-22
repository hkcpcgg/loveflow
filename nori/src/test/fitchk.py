import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for w,h in [(375,667),(360,740)]:
      for k in ['rp','hj','dt','th','tk','mb','pt','bw','om','ak','rd']:
        pg=await br.new_page(viewport={'width':w,'height':h},device_scale_factor=2)
        await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
        await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(700)
        await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1200)
        fr=pg.frames[-1]
        try: await fr.locator('[data-v=cpu1]:visible').first.click(timeout=1200)
        except Exception: pass
        await pg.wait_for_timeout(700)
        sh=await fr.evaluate("()=>document.documentElement.scrollHeight-innerHeight")
        if w==375: await pg.screenshot(path=f'fit_{k}.png')
        print(w,k,'scrollH',sh,errs[:1],flush=True)
        await pg.close()
    await br.close()
asyncio.run(main())
