# 서버 v7 손님 화면 흐름 (흉내 서버 :8766 · nori/t7/) — 들어온 길 · 처음/다시 · 공유 누름 · 공유 주소 첫 화면 · 멈춤
import asyncio,json,urllib.request
from playwright.async_api import async_playwright
def dump(): return json.loads(urllib.request.urlopen('http://localhost:8766/dump').read())
def setp(q): urllib.request.urlopen('http://localhost:8766/set?'+q).read()
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); cx=await br.new_context(viewport={'width':375,'height':667})
    pg=await cx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url) else r.continue_())
    n0=len(dump())
    await pg.goto('http://localhost:8765/nori/t7/?c=101&from=share'); await pg.wait_for_timeout(2500)
    r=dump()[n0:]; print('공유 첫 화면:', [(x[14],x[11],x[10]) for x in r])
    await pg.evaluate("window.postMessage({nori:'result',r:{game:'rp',gname:'가위바위보',out:'win',win:true,lv:'cpu',sc:[3,1],opp:'다복 사장님'}},'*')"); await pg.wait_for_timeout(1200)
    await pg.evaluate("noriEv('share')"); await pg.wait_for_timeout(800)
    r=dump()[n0:]; print('판 · 공유:', [(x[14],x[1],x[11],x[12],x[13]) for x in r])
    # 새로고침 · 다른 날 흉내: 첫 판 날을 사흘 전으로
    await pg.evaluate("localStorage.setItem('nori-visit',JSON.stringify({f:'2026-11-20',l:'2026-11-23',p:''}))")
    await pg.goto('http://localhost:8765/nori/t7/?c=101'); await pg.wait_for_timeout(1500)
    n1=len(dump())
    await pg.evaluate("window.postMessage({nori:'result',r:{game:'rp',gname:'가위바위보',out:'lose',win:false,lv:'cpu',sc:[1,3],opp:'다복 사장님'}},'*')"); await pg.wait_for_timeout(1200)
    r=dump()[n1:]; print('다시:', [(x[14],x[11],x[12],x[13]) for x in r])
    # 멈춤
    setp('NORI_STOP=all'); pg2=await cx.new_page(); await pg2.goto('http://localhost:8765/nori/t7/?c=101&from=uri'); await pg2.wait_for_timeout(1800)
    n2=len(dump())
    await pg2.evaluate("window.postMessage({nori:'result',r:{game:'rp',gname:'가위바위보',out:'win',win:true,lv:'cpu',sc:[3,0],opp:'다복 사장님'}},'*')"); await pg2.wait_for_timeout(900)
    await pg2.evaluate("window.postMessage({nori:'gift'},'*')"); await pg2.wait_for_timeout(700)
    t=await pg2.evaluate("(document.querySelector('.gs.on h3')||{}).textContent")
    print('멈춤: 새 줄', len(dump())-n2, '· 선물 창 =', t); setp('NORI_STOP=')
    await pg2.screenshot(path='/home/claude/w/shots/v7_stop.png')
    print('오류', errs[:3]); await br.close()
asyncio.run(main())
