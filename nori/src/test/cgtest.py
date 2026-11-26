# 칠교놀이 한 판 끝까지 (261126): python3 test/cgtest.py [크기] [cpu|two] [경로] [모양 번호]
# 진짜 끌기 하나 · 톡(돌리기) 하나 · 뒤집기 하나 → 나머지는 정해 둔 풀이 자리로 흉내(도움 없이 놓음) · 사진 shots/cg_<단계>.png
import asyncio,sys
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x')); WHO=sys.argv[2] if len(sys.argv)>2 else 'cpu'
PATH=sys.argv[3] if len(sys.argv)>3 else '/nori/lab/'; PZ=int(sys.argv[4]) if len(sys.argv)>4 else -1
SOLVE="""()=>{ var pl=cgPlaced(); for(var s=0;s<Cg.sol.length;s++){ if(pl.sol[s]) continue; var so=Cg.sol[s]; for(var i=0;i<Cg.pc.length;i++){ if(pl.pc[i]||Cg.pc[i].k!==so.k) continue; var p=Cg.pc[i]; p.o=so.o; p.x=so.x; p.y=so.y; cgDraw(); cgCheck(); return s; } } return -1; }"""
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
    await pg.evaluate("document.querySelector('.g[data-go=cg]').click()"); await pg.wait_for_timeout(1400)
    fr=pg.frames[-1]; await pg.screenshot(path='shots/cg_0pre.png')
    await fr.click('#naBets [data-b=none]'); await fr.click(f'#naWho [data-w={WHO}]')
    if PZ>=0: await fr.evaluate(f"()=>{{CG.PZ=[CG.PZ[{PZ}]];}}")
    await fr.click('#naGo'); await pg.wait_for_timeout(1000); await pg.screenshot(path='shots/cg_1start.png')
    fb=await (await fr.frame_element()).bounding_box()
    over=await fr.evaluate("()=>{var G=cgGeo(),b=document.getElementById('board'),r=b.getBoundingClientRect(),mx=0;Cg.pc.forEach(function(p){var o=CGO[p.k][p.o];o.pl.forEach(function(q){mx=Math.max(mx,G.top+(q[1]+p.y)*G.u)})});return {bottom:mx,h:G.h,u:G.u,BW:G.BW}}")
    # 진짜 끌기: 첫 조각(큰 세모)을 풀이 자리 가까이로
    tgt=await fr.evaluate("()=>{var G=cgGeo(),r=document.getElementById('board').getBoundingClientRect(),so=Cg.sol.filter(function(s){return s.k==='B'})[0],i=0;for(;i<Cg.pc.length;i++)if(Cg.pc[i].k==='B')break;var p=Cg.pc[i],el=document.querySelector('#cgsvg .cgp[data-i=\"'+i+'\"]').getBoundingClientRect();return {sx:el.left+el.width/2,sy:el.top+el.height/2,dx:(so.x-p.x)*G.u,dy:(so.y-p.y)*G.u,i:i,o:p.o,so:so.o}}")
    await pg.mouse.move(fb['x']+tgt['sx'],fb['y']+tgt['sy']); await pg.mouse.down()
    for k in range(1,11): await pg.mouse.move(fb['x']+tgt['sx']+tgt['dx']*k/10,fb['y']+tgt['sy']+tgt['dy']*k/10); await pg.wait_for_timeout(20)
    await pg.mouse.up(); await pg.wait_for_timeout(300)
    moved=await fr.evaluate("()=>{var p=Cg.pc[Cg.pc.length-1];return [p.k,p.x,p.y]}")
    # 톡 = 돌리기
    o0=await fr.evaluate("()=>Cg.pc[Cg.pc.length-1].o"); el=await fr.query_selector(f'#cgsvg .cgp[data-i="{6}"]'); bb=await el.bounding_box()
    await pg.mouse.click(fb['x']+bb['x']+bb['width']/2,fb['y']+bb['y']+bb['height']/2); await pg.wait_for_timeout(200); o1=await fr.evaluate("()=>Cg.pc[Cg.pc.length-1].o")
    # 뒤집기: 기운 네모 고르고 단추
    li=await fr.evaluate("()=>{for(var i=0;i<Cg.pc.length;i++)if(Cg.pc[i].k==='L'){Cg.sel=i;return [i,Cg.pc[i].o]}}"); await fr.click('#cgFlip'); await pg.wait_for_timeout(150); lf=await fr.evaluate(f"()=>Cg.pc[{li[0]}].o")
    await pg.screenshot(path='shots/cg_2play.png')
    for _ in range(8):
      if await fr.evaluate(SOLVE)<0: break
      await pg.wait_for_timeout(400)
    await pg.screenshot(path='shots/cg_3done0.png')
    shot=False
    for _ in range(600):
      st=await fr.evaluate("()=>({ph:Cg.ph,who:Cg.who,card:!!document.querySelector('.ncard.on'),rdy:!!document.getElementById('cgRdy')})")
      if st['card']: break
      if st['rdy']: await fr.click('#cgRdy')
      if WHO=='two' and st['who']==1 and st['ph']=='go': await pg.wait_for_timeout(2500); await fr.evaluate(SOLVE)
      if st['who']==1 and st['ph']=='go' and not shot: shot=True; await pg.wait_for_timeout(1500); await pg.screenshot(path='shots/cg_4cpu.png')
      await pg.wait_for_timeout(200)
    await pg.wait_for_timeout(500); await pg.screenshot(path='shots/cg_5card.png')
    print(W,H,WHO,'모양',await fr.evaluate("()=>Cg.pz.n"),'조각아래끝',round(over['bottom']),'판높이',over['h'],'u',over['u'],'BW',over['BW'],'끌기',moved,'돌리기',o0,'→',o1,'뒤집기',li,'→',lf,'시간',await fr.evaluate("()=>Cg.t"),'card',await fr.evaluate("()=>!!document.querySelector('.ncard.on')"),await fr.evaluate("()=>window.__noriLast?__noriLast.detail:''"),errs[:3])
    await br.close()
asyncio.run(main())
