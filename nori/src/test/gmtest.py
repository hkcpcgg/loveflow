# 고무줄놀이 한 판 끝까지 (261125): python3 test/gmtest.py [크기] [cpu|two] [놓칠 단(0~6 · 6이면 끝까지)] [경로]
# 박마다 Gm.notes[i].t 에 맞춰 누름(±40ms) · 놓칠 단에서는 한 박 늦게 → 걸림 · 사진 shots/gm_<단계>.png
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x')); WHO=sys.argv[2] if len(sys.argv)>2 else 'cpu'
MISS=int(sys.argv[3]) if len(sys.argv)>3 else 3; PATH=sys.argv[4] if len(sys.argv)>4 else '/nori/lab/'
async def play_turn(pg,fr,tag):
  shot=False
  for _ in range(400):
    st=await fr.evaluate("()=>({ph:Gm.ph,who:Gm.who,lv:Gm.lv[Gm.who],n:Gm.notes.map(n=>n.ok||n.gone?null:n.t-performance.now())})")
    if st['ph'] in ('fail',) : return
    if st['ph']!='go': await pg.wait_for_timeout(60);
    if st['ph']=='wait' and await fr.locator('#gmRdy').count(): await fr.click('#gmRdy'); continue
    if st['ph']!='go': continue
    nxt=[x for x in st['n'] if x is not None]
    if not nxt: await pg.wait_for_timeout(40); continue
    d=nxt[0]
    if st['lv']==MISS and len(nxt)<=5:   # 이 단 중간에서 일부러 늦게
      await pg.wait_for_timeout(int(d+260)); await fr.locator('#gmGo').dispatch_event('pointerdown'); return
    if d>60: await pg.wait_for_timeout(int(d-45)); continue
    await pg.wait_for_timeout(max(0,int(d)+random.randint(-30,30)))
    await fr.locator('#gmGo').dispatch_event('pointerdown')
    if not shot and st['lv']==1: shot=True; await pg.wait_for_timeout(80); await pg.screenshot(path=f'shots/gm_{tag}.png')
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
    await pg.evaluate("document.querySelector('.g[data-go=gm]').click()"); await pg.wait_for_timeout(1400)
    fr=pg.frames[-1]; await pg.screenshot(path='shots/gm_0pre.png')
    await fr.click('#naBets [data-b=none]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo')
    await pg.wait_for_timeout(300)
    await play_turn(pg,fr,'1me')
    await pg.wait_for_timeout(500); await pg.screenshot(path='shots/gm_2fail.png')
    if WHO=='two':
      for _ in range(40):
        await pg.wait_for_timeout(150)
        if await fr.locator('#gmRdy').count(): break
      await pg.screenshot(path='shots/gm_3pass.png'); await play_turn(pg,fr,'4friend')
    else:
      await pg.wait_for_timeout(2500); await pg.screenshot(path='shots/gm_3cpu.png')
    for i in range(160):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      await pg.wait_for_timeout(500)
    await pg.wait_for_timeout(400); await pg.screenshot(path='shots/gm_5card.png')
    print(W,H,WHO,'miss@',MISS,'lv',await fr.evaluate("()=>Gm.lv"),'card',await fr.evaluate("()=>!!document.querySelector('.ncard.on')"),await fr.evaluate("()=>window.__noriLast?__noriLast.detail:''"),errs[:2])
    await br.close()
asyncio.run(main())
