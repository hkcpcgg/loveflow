import asyncio,sys
from playwright.async_api import async_playwright
# usage: shot.py url out [w h] [js...]
async def main():
  url,out=sys.argv[1],sys.argv[2]; w,h=int(sys.argv[3]),int(sys.argv[4]); js=sys.argv[5:]
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':w,'height':h},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto(url); await pg.wait_for_timeout(800)
    for j in js:
      if j.startswith('wait:'): await pg.wait_for_timeout(int(j[5:])); continue
      if j.startswith('F:'):
        await pg.frames[-1].evaluate(j[2:]); await pg.wait_for_timeout(700); continue
      await pg.evaluate(j); await pg.wait_for_timeout(700)
    await pg.screenshot(path=out); print(out,errs)
    await br.close()
asyncio.run(main())
