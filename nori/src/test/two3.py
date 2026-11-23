# 다른 놀이 친구 모드: 시작 전 창에서 「친구와」 → 옛 누구랑 창의 two 단추가 눌리는지 · 벌칙은 이긴 쪽이 직접
import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    for k in ['om','dt','pt','tk']:
      pg=await br.new_page(viewport={'width':375,'height':667})
      await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
      errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
      await pg.goto('http://localhost:8765/nori/lab/'); await pg.wait_for_timeout(600)
      await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1300)
      fr=pg.frames[-1]; await fr.click('#naWho [data-w=two]'); await fr.click('#naGo'); await pg.wait_for_timeout(800)
      side=await fr.evaluate("()=>{var r=document.querySelector('.nside.r .nm');return r?r.textContent:''}")
      await fr.evaluate("()=>{ noriResult({game:'x',gname:'x',opp:'친구',win:false,detail:'x',sc:[1,3],u:'점',out:'lose'}); document.querySelector('.done').classList.add('on'); }")
      await pg.wait_for_timeout(1500)
      hint=await fr.evaluate("()=>{var h=document.querySelector('.pn-hint'),t=document.querySelector('.na-penh');return (t?t.textContent:'')+' / '+(h?h.textContent:'')}")
      print(k,'오른쪽 이름:',side,'| 벌칙:',hint,errs[:1])
      await pg.close()
    await br.close()
asyncio.run(main())
