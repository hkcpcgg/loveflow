# 가게 파일 올리기 (261125 · 서버 v5 흉내 server/mocksrv.js :8766) — 대표 번호로 「가게들」 칸 · 내려받기 · 파일 올리기 · 결과 · 올리기 · 새 가게 번호
import asyncio,sys
from playwright.async_api import async_playwright
W,H=map(int,(sys.argv[1] if len(sys.argv)>1 else '375x667').split('x'))
CSV='﻿우리 동네 가게\n\n매장명,이기면,참가,조건,전화번호,주민번호,비고,번호\n다복,막걸리,,나,010-1234-5678,900101,단골,101\n,,,,,,,102\n새가게,음료,껌,가,010-9999-0001,,,\n,막걸리,,,,,,\n'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':W,'height':H},accept_downloads=True); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8765/nori/t5/'); await pg.wait_for_timeout(1200)
    async def admin(pin):
      await pg.evaluate("""()=>{ var b=[...document.querySelectorAll('button')].find(x=>/관리자/.test(x.textContent)); b.click(); }""")
      await pg.wait_for_timeout(200); await pg.fill('#aP',pin); await pg.click('[data-c=in]'); await pg.wait_for_timeout(900)
      return await pg.evaluate("()=>[...document.querySelectorAll('.tabs2 button')].map(x=>x.textContent)")
    tabs=await admin('414040'); print('대표 탭',tabs)
    await pg.click('[data-t=shops]'); await pg.wait_for_timeout(300)
    await pg.screenshot(path='test/shots/sf_1_tab.png')
    async with pg.expect_download() as dl: await pg.click('[data-c=fDl]')
    d=await dl.value; print('내려받기',d.suggested_filename)
    open('/tmp/shops.csv','w',encoding='utf-8').write(CSV)
    await pg.set_input_files('#fF','/tmp/shops.csv'); await pg.wait_for_timeout(900)
    t=await pg.inner_text('#fR'); print('결과:',t.replace('\n',' | ')[:400])
    await pg.screenshot(path='test/shots/sf_2_res.png')
    vis=await pg.evaluate("()=>{var b=document.querySelector('[data-c=fGo]').getBoundingClientRect(); return [Math.round(b.top),Math.round(b.bottom),innerHeight]}"); print('올리기 단추 자리',vis)
    await pg.click('[data-c=fGo]'); await pg.wait_for_timeout(900)
    t=await pg.inner_text('#fR'); print('넣음:',t.replace('\n',' | ')[:400])
    await pg.screenshot(path='test/shots/sf_3_done.png')
    async with pg.expect_download() as dl: await pg.click('[data-c=fNew]')
    d=await dl.value; pth=await d.path(); print('새 가게 번호 파일',d.suggested_filename, open(pth,encoding='utf-8-sig').read().strip().split('\n')[1])
    # 붙여 넣기 · 머리 줄 없음
    await pg.click('[data-c=fPa]'); await pg.fill('#fPT','아무거나\t둘\n1\t2'); await pg.click('[data-c=fPG]'); await pg.wait_for_timeout(700)
    print('머리 없음:',(await pg.inner_text('#fR'))[:80])
    # 가게 관리자 번호로는 탭 없음
    await pg.click('[data-c=x]'); 
    import json
    tabs2=await admin('000000'); print('틀린 번호 탭',tabs2)
    print('오류',errs)
    await b.close()
asyncio.run(main())
