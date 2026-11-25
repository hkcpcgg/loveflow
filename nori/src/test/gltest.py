# 공 굴리기 한 판 끝까지 (261125): python3 test/gltest.py [크기] [cpu|two] [초당 누름] [맞는 쪽 비율] [경로] [fs]
# 공이 갈 자리(지금 + 쏠림)를 보고 반대쪽을 누름 · 비율만큼만 맞게 · fs 를 주면 「탕!」 전에 한 번 눌러 부정 출발부터 · 사진 shots/gl_<단계>.png
import asyncio,sys,random
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x')); WHO=sys.argv[2] if len(sys.argv)>2 else 'cpu'
RATE=float(sys.argv[3]) if len(sys.argv)>3 else 5; OK=float(sys.argv[4]) if len(sys.argv)>4 else .95
PATH=sys.argv[5] if len(sys.argv)>5 else '/nori/lab/'; FS=len(sys.argv)>6 and sys.argv[6]=='fs'
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
    await pg.evaluate("document.querySelector('.g[data-go=gl]').click()"); await pg.wait_for_timeout(1400)
    fr=pg.frames[-1]; await pg.screenshot(path='shots/gl_0pre.png')
    await fr.click('#naBets [data-b=none]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo')
    await pg.wait_for_timeout(400); await pg.screenshot(path='shots/gl_1set.png')
    fsd=False
    if FS:
      await fr.locator('.feet button').first.dispatch_event('pointerdown'); await pg.wait_for_timeout(300); await pg.screenshot(path='shots/gl_1fs.png')
      fsd=await fr.evaluate("()=>Bl.ph")
    shot=False; outs=[0,0]; prev=[0,0]; taps=0
    for _ in range(4000):
      st=await fr.evaluate("()=>({ph:Bl.ph,x:Bl.x,vx:Bl.vx,pos:Bl.pos,stun:Bl.stun.map(t=>t>performance.now()),card:!!document.querySelector('.ncard.on')})")
      if st['ph']=='end' or st['card']: break
      if st['ph']!='go': await pg.wait_for_timeout(40); continue
      for q in range(2):
        if st['stun'][q] and not prev[q]: outs[q]+=1
        prev[q]=st['stun'][q]
      players=[0,1] if WHO=='two' else [0]
      for q in players:
        if st['stun'][q]: continue
        xp=st['x'][q]+st['vx'][q]*.25; s=-1 if xp>0 else 1
        if random.random()>OK: s=-s
        btns=fr.locator('.feet button'); idx=(q*2)+(0 if s<0 else 1)
        await btns.nth(idx).dispatch_event('pointerdown'); taps+=1
      if not shot and st['pos'][0]>12: shot=True; await pg.screenshot(path='shots/gl_2mid.png')
      await pg.wait_for_timeout(int(1000/RATE))
    await pg.wait_for_timeout(300); await pg.screenshot(path='shots/gl_3end.png')
    for i in range(30):
      if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
      await pg.wait_for_timeout(300)
    await pg.wait_for_timeout(400); await pg.screenshot(path='shots/gl_4card.png')
    sc=await pg.evaluate("()=>({sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight})")
    print(W,H,WHO,'rate',RATE,'ok',OK,'fs',fsd,'pos',await fr.evaluate("()=>Bl.pos"),'outs',outs,'taps',taps,'card',await fr.evaluate("()=>!!document.querySelector('.ncard.on')"),await fr.evaluate("()=>window.__noriLast?__noriLast.detail:''"),'scroll',sc,errs[:2])
    await br.close()
asyncio.run(main())
