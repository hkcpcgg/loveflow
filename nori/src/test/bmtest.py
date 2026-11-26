# 블록 맞추기 한 판 끝까지 (261126): python3 test/bmtest.py [크기] [cpu|two] [내 엉뚱 비율] [경로] [사장님 빠르게]
# 첫 수는 진짜 손가락 끌기(마우스)로 놓고 · 첫 수 뒤 톡 → 톡 한 번 · 나머지는 1.2초마다 흉내(좋은 자리 · 비율만큼 아무 자리) · 사진 shots/bm_<단계>.png
import asyncio,sys
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x')); WHO=sys.argv[2] if len(sys.argv)>2 else 'cpu'
ERR=float(sys.argv[3]) if len(sys.argv)>3 else .4; PATH=sys.argv[4] if len(sys.argv)>4 else '/nori/lab/'; FAST=float(sys.argv[5]) if len(sys.argv)>5 else 0
BOT="""(err)=>{ if(Bm.ph!=='go'||!(Bm.who===0||two())) return 'skip'; var keep=Bm.err; Bm.err=err; var w=Bm.who; Bm.who=1; var two0=S.mode; S.mode='cpu1'; try{ Bm.who=w; S.mode=two0; }catch(e){}
  Bm.err=keep; var best=null, all=[]; for(var t=0;t<3;t++){ var p=Bm.tray[t]; if(p.used) continue; for(var y=0;y<8;y++) for(var x=0;x<8;x++) if(bmFits(p.s,x,y)) all.push({t:t,x:x,y:y}); }
  if(!all.length) return 'none'; var m=all[Math.floor(Math.random()*all.length)];
  if(Math.random()>err){ /* 줄을 지우는 수가 있으면 */ for(var i=0;i<all.length;i++){ var a=all[i], c=BM.SH[Bm.tray[a.t].s], set={}; c.forEach(function(q){ set[(a.x+q[0])+'_'+(a.y+q[1])]=1; });
      for(var yy=0;yy<8;yy++){ var f=true; for(var xx=0;xx<8;xx++) if(!Bm.b[yy][xx]&&!set[xx+'_'+yy]){ f=false; break; } if(f){ m=a; break; } } } }
  bmPlace(m.t,m.x,m.y); return 'ok'; }"""
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
    await pg.evaluate("document.querySelector('.g[data-go=bm]').click()"); await pg.wait_for_timeout(1400)
    fr=pg.frames[-1]; await pg.screenshot(path='shots/bm_0pre.png')
    await fr.click('#naBets [data-b=none]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo')
    if FAST: await fr.evaluate(f"()=>{{BM.FAST={FAST};}}")
    await pg.wait_for_timeout(1000); await pg.screenshot(path='shots/bm_1start.png')
    # 진짜 끌기: 첫 조각을 판 가운데로
    el=await fr.query_selector('#bmtray .bmp'); bb=await el.bounding_box(); grid=await fr.evaluate("()=>{var G=bmGeo(),r=document.getElementById('board').getBoundingClientRect();return {x:r.left+G.gx+G.g*4,y:r.top+G.gy+G.g*4,g:G.g}}")
    fb=await (await fr.frame_element()).bounding_box()
    sx,sy=fb['x']+bb['x']+bb['width']/2, fb['y']+bb['y']+bb['height']/2; tx,ty=fb['x']+grid['x'], fb['y']+grid['y']+grid['g']*1.6
    await pg.mouse.move(sx,sy); await pg.mouse.down();
    for i in range(1,11): await pg.mouse.move(sx+(tx-sx)*i/10, sy+(ty-sy)*i/10); await pg.wait_for_timeout(20)
    await pg.screenshot(path='shots/bm_2drag.png'); await pg.mouse.up(); await pg.wait_for_timeout(300)
    drag=await fr.evaluate("()=>Bm.sc[0]")
    # 톡 → 톡
    el=await fr.query_selector('#bmtray .bmp'); bb=await el.bounding_box(); await pg.mouse.click(fb['x']+bb['x']+bb['width']/2, fb['y']+bb['y']+bb['height']/2); await pg.wait_for_timeout(150)
    sel=await fr.evaluate("()=>Bm.sel"); cand=await fr.evaluate("()=>{var p=Bm.tray[Bm.sel];if(!p)return null;for(var y=0;y<8;y++)for(var x=0;x<8;x++)if(bmFits(p.s,x,y)){var c=BM.SH[p.s],mw=0,mh=0;c.forEach(function(q){mw=Math.max(mw,q[0]+1);mh=Math.max(mh,q[1]+1)});var G=bmGeo(),r=document.getElementById('board').getBoundingClientRect();return {x:r.left+G.gx+(x+mw/2)*G.g,y:r.top+G.gy+(y+mh/2)*G.g}}return null}")
    if cand: await pg.mouse.click(fb['x']+cand['x'], fb['y']+cand['y']); await pg.wait_for_timeout(200)
    tap=await fr.evaluate("()=>Bm.sc[0]")
    shot=[False,False]
    for _ in range(900):
      st=await fr.evaluate("()=>({ph:Bm.ph,who:Bm.who,sc:Bm.sc,card:!!document.querySelector('.ncard.on'),rdy:!!document.getElementById('bmRdy')})")
      if st['card']: break
      if st['rdy']: await fr.click('#bmRdy')
      if st['ph']=='go' and (st['who']==0 or WHO=='two'): await fr.evaluate(BOT,ERR)
      if st['ph']=='go' and not shot[st['who']] and st['sc'][st['who']]>=40: shot[st['who']]=True; await pg.screenshot(path=f"shots/bm_3mid{st['who']}.png")
      await pg.wait_for_timeout(1200 if (st['who']==0 or WHO=='two') else 200)
    await pg.wait_for_timeout(500); await pg.screenshot(path='shots/bm_4card.png')
    print(W,H,WHO,'err',ERR,'끌기점수',drag,'톡톡',sel,tap,'sc',await fr.evaluate("()=>Bm.sc"),'card',await fr.evaluate("()=>!!document.querySelector('.ncard.on')"),await fr.evaluate("()=>window.__noriLast?__noriLast.detail:''"),errs[:3])
    await br.close()
asyncio.run(main())
