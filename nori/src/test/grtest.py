# 굴렁쇠 한 판 끝까지 (261125): python3 test/grtest.py [크기] [cpu|two] [쓰러뜨릴 m(0~60 · 60이면 끝까지)] [경로]
# 바늘이 초록 칸 가운데 아래로 내려오면 밀기 · 정한 m 에서 손을 놓아 쓰러짐 · 사진 shots/gr_<단계>.png
import asyncio,sys
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x')); WHO=sys.argv[2] if len(sys.argv)>2 else 'cpu'
STOP=float(sys.argv[3]) if len(sys.argv)>3 else 35; PATH=sys.argv[4] if len(sys.argv)>4 else '/nori/lab/'
async def play_turn(pg,fr,tag,stop):
  shot=False
  for _ in range(3000):
    st=await fr.evaluate("()=>({ph:Gr.ph,who:Gr.who,v:Gr.v,d:Gr.d[Gr.who],lo:grLo(Gr.d[Gr.who]),hi:grHi(Gr.d[Gr.who])})")
    if st['ph'] in ('fall','end'): return st
    if st['ph']=='wait' and await fr.locator('#grRdy').count(): await fr.click('#grRdy'); continue
    if st['ph']!='go': await pg.wait_for_timeout(50); continue
    if st['d']>=stop: await pg.wait_for_timeout(40); continue
    mid=(st['lo']+st['hi'])/2
    if st['v']<mid-.2: await fr.locator('#grGo').dispatch_event('pointerdown'); await pg.wait_for_timeout(120)
    else: await pg.wait_for_timeout(30)
    if not shot and st['d']>12: shot=True; await pg.screenshot(path=f'shots/gr_{tag}.png')
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
    await pg.evaluate("document.querySelector('.g[data-go=gr]').click()"); await pg.wait_for_timeout(1400)
    fr=pg.frames[-1]; await pg.screenshot(path='shots/gr_0pre.png')
    await fr.click('#naBets [data-b=none]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo')
    await pg.wait_for_timeout(300)
    a=await play_turn(pg,fr,'1me',STOP)
    await pg.wait_for_timeout(300); await pg.screenshot(path='shots/gr_2fall.png')
    if WHO=='two':
      for _ in range(40):
        await pg.wait_for_timeout(150)
        if await fr.locator('#grRdy').count(): break
      await pg.screenshot(path='shots/gr_3pass.png'); await play_turn(pg,fr,'4friend',60)
    else:
      await pg.wait_for_timeout(9000); await pg.screenshot(path='shots/gr_3cpu.png')
    for i in range(200):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      await pg.wait_for_timeout(500)
    await pg.wait_for_timeout(400); await pg.screenshot(path='shots/gr_5card.png')
    print(W,H,WHO,'stop@',STOP,'me',a and round(a['d'],1),'d',await fr.evaluate("()=>Gr.d.map(x=>+x.toFixed(1))"),'card',await fr.evaluate("()=>!!document.querySelector('.ncard.on')"),await fr.evaluate("()=>window.__noriLast?__noriLast.detail:''"),errs[:2])
    await br.close()
asyncio.run(main())
