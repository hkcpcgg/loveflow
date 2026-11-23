import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':375,'height':667},device_scale_factor=2)
    await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(700)
    await pg.evaluate("()=>document.querySelector('.g[data-go=rp]').click()"); await pg.wait_for_timeout(1300)
    fr=pg.frames[-1]; await fr.click('#naWho [data-w=two]'); await fr.click('#naBets [data-b=none]'); await fr.click('#naGo'); await pg.wait_for_timeout(600)
    await pg.screenshot(path='shots/t2_me.png')
    # 같은 자리 두 번 빠르게 누르기 → 건네주기 단추가 막아야 함
    b=await fr.locator('#act button.h').nth(1).bounding_box(); x,y=b['x']+b['width']/2,b['y']+b['height']/2
    await pg.mouse.click(x,y); await pg.mouse.click(x,y); await pg.wait_for_timeout(300)
    await pg.screenshot(path='shots/t2_hand.png')
    print('건네주기 화면:', await fr.evaluate("()=>!!document.getElementById('hand')"))
    await pg.wait_for_timeout(400); await fr.click('#hand'); await pg.wait_for_timeout(300)
    await fr.locator('#act button.h').nth(2).click(); await pg.wait_for_timeout(2600)
    print('결과:', await fr.evaluate("()=>document.getElementById('word').textContent+' | '+S.sc"))
    # 사진 단추
    await fr.locator('.na-cam input').set_input_files('test_photo.jpg'); await pg.wait_for_timeout(600)
    await pg.screenshot(path='shots/t2_cam.png')
    await fr.evaluate("()=>{ noriResult({game:'rp',gname:'가위바위보',opp:'친구',win:false,detail:'x',sc:[3,1],u:'승',out:'win'}); document.getElementById('done').classList.add('on'); }"); await pg.wait_for_timeout(1200)
    await pg.screenshot(path='shots/t2_card.png')
    print('카드 사진 들어감:', await fr.evaluate("()=>document.querySelector('.ncard .ph').classList.contains('has')"), errs)
    await br.close()
asyncio.run(main())
