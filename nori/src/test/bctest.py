# 벽돌깨기 한 판 끝까지 (261126): python3 test/bctest.py [크기] [cpu|two] [내 실수율] [경로] [빠르게 배수]
# 내 차례: 공이 떨어질 자리로 받침대 띠를 끔(실수율만큼 엉뚱한 자리) · 사진 shots/bc_<단계>.png · 빠르게 배수를 주면 사장님 차례를 그만큼 빨리(시험만)
import asyncio,sys
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x')); WHO=sys.argv[2] if len(sys.argv)>2 else 'cpu'
MISS=float(sys.argv[3]) if len(sys.argv)>3 else .15; PATH=sys.argv[4] if len(sys.argv)>4 else '/nori/lab/'; FAST=float(sys.argv[5]) if len(sys.argv)>5 else 0
BOT="""(miss)=>{ if(window.__bcBot) return; window.__bcBot=setInterval(function(){ if(!window.Bc||Bc.ph===undefined) return;
  var me=Bc.who===0||two(); if(!me) return; var G=bcGeo();
  if(Bc.ph==='ready'){ var st=document.getElementById('bcstrip'); if(st){ var r=st.getBoundingClientRect(); st.dispatchEvent(new PointerEvent('pointerdown',{clientX:r.left+r.width/2,clientY:r.top+r.height/2,bubbles:true})); } return; }
  if(Bc.ph!=='go') return;
  if(Bc.vy>0&&!Bc._bp){ Bc._bp=1; var L=bcLand(G); if(L==null)L=Bc.bx; Bc._aim=Math.random()<miss? L+(Math.random()<.5?-1:1)*(G.pw*.9) : L+(Math.random()*2-1)*G.pw*.3; }
  if(Bc.vy<0) Bc._bp=0;
  var x=Bc._aim==null?Bc.bx:Bc._aim, st=document.getElementById('bcstrip'); if(!st) return; var r=st.getBoundingClientRect(), f=Math.max(0,Math.min(1,(x-G.pw/2)/(G.w-G.pw)));
  st.dispatchEvent(new PointerEvent('pointermove',{clientX:r.left+f*r.width,clientY:r.top+r.height/2,buttons:1,pressure:.5,bubbles:true})); },30); }"""
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
    await pg.evaluate("document.querySelector('.g[data-go=bc]').click()"); await pg.wait_for_timeout(1400)
    fr=pg.frames[-1]; await pg.screenshot(path='shots/bc_0pre.png')
    await fr.click('#naBets [data-b=none]'); await fr.click(f'#naWho [data-w={WHO}]'); await fr.click('#naGo')
    if FAST: await fr.evaluate(f"()=>{{BC.FAST={FAST};}}")
    await pg.wait_for_timeout(900); await pg.screenshot(path='shots/bc_1ready.png')
    await fr.evaluate(BOT,MISS)
    shot=[False,False]; seen=[]
    for _ in range(3000):
      st=await fr.evaluate("()=>({ph:Bc.ph,who:Bc.who,sc:Bc.sc,left:Bc.left,t:Bc.tleft,card:!!document.querySelector('.ncard.on'),rdy:!!document.getElementById('bcRdy')})")
      if st['card']: break
      if st['rdy']: await fr.click('#bcRdy')
      if st['ph']=='go' and not shot[st['who']] and st['sc'][st['who']]>=6: shot[st['who']]=True; await pg.screenshot(path=f"shots/bc_2mid{st['who']}.png")
      await pg.wait_for_timeout(100)
    await pg.wait_for_timeout(500); await pg.screenshot(path='shots/bc_4card.png')
    sc=await pg.evaluate("()=>({sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight})")
    print(W,H,WHO,'miss',MISS,'sc',await fr.evaluate("()=>Bc.sc"),'left',await fr.evaluate("()=>Bc.left"),'t',await fr.evaluate("()=>Bc.tleft.map(x=>Math.round(x))"),'card',await fr.evaluate("()=>!!document.querySelector('.ncard.on')"),await fr.evaluate("()=>window.__noriLast?__noriLast.detail:''"),'scroll',sc,errs[:3])
    await br.close()
asyncio.run(main())
