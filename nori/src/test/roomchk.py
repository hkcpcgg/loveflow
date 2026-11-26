# 이야기방 주소 점검 (261126 · 사랑흐름-총괄-052): python3 test/roomchk.py [경로=/nori/lab/]
# 사랑흐름-총괄-053: 남기기 방은 C-0300 초대 링크(?g=e92887…) 그대로 — 기본 · 가게 주소 모두 첫 화면 이야기방 칸 · 결과 카드 「이야기방에 올리기」가 이 링크로 감
import asyncio,sys
from playwright.async_api import async_playwright
PATH=sys.argv[1] if len(sys.argv)>1 else '/nori/lab/'
async def one(p,q):
  br=await p.chromium.launch(); ctx=await br.new_context(viewport={'width':375,'height':667}); pg=await ctx.new_page()
  await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
  opened=[]; ctx.on('request',lambda rq: opened.append(rq.url) if 'uriyagi' in rq.url else None)
  errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
  await pg.goto('http://localhost:8765'+PATH+q); await pg.wait_for_timeout(900)
  room=await pg.evaluate("()=>{var r=document.querySelector('.room');return r?{href:r.getAttribute('href'),shown:getComputedStyle(r).display!=='none'}:null}")
  html=await pg.content(); old='uriyagi.kr/?c=C-0031' in html
  await pg.evaluate("document.querySelector('.g[data-go=bc]').click()"); await pg.wait_for_timeout(1400)
  fr=pg.frames[-1]; await fr.click('#naBets [data-b=none]'); await fr.click('#naWho [data-w=cpu]'); await fr.click('#naGo'); await pg.wait_for_timeout(500)
  await fr.evaluate("()=>{S.gen++; finish(true,3,1,'시험');}"); await pg.wait_for_timeout(1800)
  btn=await fr.evaluate("()=>!!document.querySelector('.ncard.on [data-c=story]')")
  url=''
  if btn:
    await fr.click('.ncard.on [data-c=story]'); await pg.wait_for_timeout(900)
    if opened: url=opened[-1]
  await br.close(); return room,old,btn,url,errs
async def main():
  async with async_playwright() as p:
    for q in ['','?c=101']:
      room,old,btn,url,errs=await one(p,q)
      print(q or '기본', 'room',room,'C-0031남음',old,'카드단추',btn,'열린주소',url[:60],errs[:2])
asyncio.run(main())
