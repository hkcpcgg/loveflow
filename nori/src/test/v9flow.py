# 서버 v9 손님 화면 흐름 (261127 · 흉내 서버 :8766 node test/server/mocksrv9.js · nori/t9/ = index.html 의 NORI_API · nori/t9lab/ = lab 의 NORI_INFO_API 를 localhost:8766 으로)
# 남기는 방 단추(서버 room) · 방 없으면 감춤 · 결과 카드 「이야기방에 올리기」 · 선물 받기 하루 한 건 · 이야기방 하루 한 건 · 한도 안내 · lab 은 info 만 읽음
import asyncio,json,urllib.request
from playwright.async_api import async_playwright
def dump(t='판기록'): return json.loads(urllib.request.urlopen('http://localhost:8766/dump?t='+urllib.parse.quote(t)).read())
def setp(q): urllib.request.urlopen('http://localhost:8766/set?'+q).read()
import urllib.parse
R=[]
def ok(c,m): R.append((bool(c),m)); print(('✓ ' if c else '✗ ')+m)
async def room(pg): return await pg.evaluate("()=>{var r=document.querySelector('.room');return r?{href:r.getAttribute('href'),shown:getComputedStyle(r).display!=='none'}:null}")
async def card(pg):
  await pg.evaluate("document.querySelector('.g[data-go=bc]').click()"); await pg.wait_for_timeout(1400)
  fr=pg.frames[-1]; await fr.click('#naBets [data-b=none]'); await fr.click('#naWho [data-w=cpu]'); await fr.click('#naGo'); await pg.wait_for_timeout(500)
  await fr.evaluate("()=>{S.gen++; finish(true,3,1,'시험');}"); await pg.wait_for_timeout(1800); return fr
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch()
    async def page(cx):
      pg=await cx.new_page(); pg.errs=[]; pg.on('pageerror',lambda e:pg.errs.append(str(e)[:150]))
      await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
      return pg
    cx=await br.new_context(viewport={'width':375,'height':667}); opened=[]; cx.on('request',lambda rq: opened.append(rq.url) if 'uriyagi' in rq.url else None)
    # 1 기본 가게 · 방 보임
    pg=await page(cx); await pg.goto('http://localhost:8765/nori/t9/'); await pg.wait_for_timeout(1500)
    r=await room(pg); ok(r and r['shown'] and r['href']=='https://uriyagi.kr/?g=test0000base','첫 화면 이야기방 칸 = 서버 기본 방 '+str(r))
    # 2 결과 카드 이야기방 첫 건 → 열림
    fr=await card(pg); btn=await fr.evaluate("()=>!!document.querySelector('.ncard.on [data-c=story]')"); ok(btn,'결과 카드 「이야기방에 올리기」 있음')
    n0=len(opened); await fr.click('.ncard.on [data-c=story]'); await pg.wait_for_timeout(1500)
    ok(len(opened)>n0 and 'test0000base' in opened[-1],'첫 건 → 기본 방으로 열림')
    ok(len([x for x in dump('무료한도') if x[2]=='이야기방'])==1,'무료한도 탭 이야기방 1줄')
    # 3 둘째 건 → 안내 · 안 열림
    n1=len(opened); await fr.click('.ncard.on [data-c=story]'); await pg.wait_for_timeout(1500)
    t=await pg.evaluate("(document.querySelector('.gs.on .sum')||{}).textContent||''"); a=await pg.evaluate("(document.querySelector('.gs.on a.go')||{}).href||''")
    ok('한 장을 다 쓰셨어요' in t and '내일 다시' in t,'둘째 건 → 한도 안내 글')
    ok(a=='https://www.loveflow.ai.kr/ask' and await pg.evaluate("(document.querySelector('.gs.on a.go')||{}).textContent")=='상담하기 ›','「상담하기 ›」 → 서버 NORI_ASK_URL')
    ok(len([u for u in opened[n1:] if 'test0000base' in u])==0,'둘째 건은 이야기방이 열리지 않음')
    await pg.screenshot(path='/home/claude/w/shots/v9_limit_story.png')
    await pg.evaluate("document.querySelector('.gs').classList.remove('on')")
    # 4 선물 받기 하루 한 건
    async def gift(pg):
      await pg.evaluate("window.postMessage({nori:'result',r:{game:'rp',gname:'가위바위보',out:'win',win:true,lv:'cpu',sc:[3,1],opp:'다복 사장님'}},'*')"); await pg.wait_for_timeout(700)
      await pg.evaluate("window.postMessage({nori:'gift'},'*')"); await pg.wait_for_timeout(600)
      form=await pg.evaluate("()=>!!document.querySelector('.gs.on #gN')")
      if form: await pg.fill('#gN','김다복'); await pg.click('.gs.on [data-c=ok]'); await pg.wait_for_timeout(1200)
      return await pg.evaluate("()=>({cp:!!document.querySelector('.gs.on .cp'),sum:(document.querySelector('.gs.on .sum')||{}).textContent||''})")|{'form':form}
    g1=await gift(pg); ok(g1['cp'],'선물 첫 건 → 쿠폰')
    G=dump('손님기록'); ok(len(G)==2 and G[1][15:]==[] or len(G)==2,'손님기록 1줄 '+str(len(G)-1))
    await pg.evaluate("document.querySelector('.gs').classList.remove('on')")
    g2=await gift(pg); ok((not g2['cp']) and '한 장을 다 쓰셨어요' in g2['sum'],'선물 둘째 건 → 한도 안내 · 쿠폰 없음')
    ok(not g2['form'],'둘째 건은 이름 적기 전에 안내(이름 칸 안 뜸)')
    # 폰 기억을 지워도 서버가 막음
    await pg.evaluate("localStorage.removeItem('nori-gday');document.querySelector('.gs').classList.remove('on')"); g3=await gift(pg)
    ok(g3['form'] and (not g3['cp']) and '한 장을 다 쓰셨어요' in g3['sum'],'폰 기억을 지워도 서버가 막음')
    ok(len(dump('손님기록'))==2,'둘째 건은 손님기록에 안 들어감')
    mine=await pg.evaluate("JSON.parse(localStorage.getItem('nori-recs')||'[]').length"); ok(mine==1,'폰 안 선물함도 1건 '+str(mine))
    await pg.screenshot(path='/home/claude/w/shots/v9_limit_gift.png')
    # 5 유료 가게 102 → 세지 않음
    setp('SHOP_102='+urllib.parse.quote(json.dumps({'admin':'1','staff':'2','plan':'paid'})))
    pg2=await page(cx); await pg2.goto('http://localhost:8765/nori/t9/?c=102'); await pg2.wait_for_timeout(1500)
    a1=await gift(pg2); await pg2.evaluate("document.querySelector('.gs').classList.remove('on')"); a2=await gift(pg2)
    ok(a1['cp'] and a2['cp'],'유료 가게 손님은 두 번째도 쿠폰')
    # 6 방 없음 → 감춤
    setp('NORI_ROOM_DEFAULT=')
    cx2=await br.new_context(viewport={'width':375,'height':667}); pg3=await page(cx2); await pg3.goto('http://localhost:8765/nori/t9/'); await pg3.wait_for_timeout(1500)
    r=await room(pg3); ok(r and not r['shown'],'서버에 방 없음 → 첫 화면 이야기방 칸 감춤')
    fr3=await card(pg3); ok(not await fr3.evaluate("()=>!!document.querySelector('.ncard.on [data-c=story]')"),'→ 결과 카드 「이야기방에 올리기」 감춤')
    # 선물 조건 「다」(이야기방에 남기면 열림)인데 방이 없으면 직원 확인 안내
    await pg3.evaluate("localStorage.setItem('nori-gift-set',JSON.stringify({prizes:{p1:'음료',p0:'사탕',sp:''},cond:'c',plan:'free'}))")
    await pg3.goto('http://localhost:8765/nori/t9/'); await pg3.wait_for_timeout(1500)
    await pg3.evaluate("window.postMessage({nori:'result',r:{game:'rp',gname:'가위바위보',out:'win',win:true,lv:'cpu',sc:[3,1],opp:'다복 사장님'}},'*')"); await pg3.wait_for_timeout(700)
    await pg3.evaluate("window.postMessage({nori:'gift'},'*')"); await pg3.wait_for_timeout(600); await pg3.fill('#gN','이'); await pg3.click('.gs.on [data-c=ok]'); await pg3.wait_for_timeout(1200)
    t3=await pg3.evaluate("(document.querySelector('.gs.on')||{}).textContent||''")
    ok('직원에게 이 화면을 보여' in t3 and '남기러 가기' not in t3,'조건 다 · 방 없음 → 직원 확인 안내')
    # 7 가게 방
    setp('NORI_ROOM_DEFAULT='+urllib.parse.quote('https://uriyagi.kr/?g=test0000base'))
    setp('SHOP_101='+urllib.parse.quote(json.dumps({'admin':'1','staff':'2','room':'https://uriyagi.kr/?g=test0101shop'})))
    pg4=await page(cx2); await pg4.goto('http://localhost:8765/nori/t9/?c=101'); await pg4.wait_for_timeout(1500)
    r=await room(pg4); ok(r and r['shown'] and r['href'].endswith('test0101shop'),'가게 101 → 가게 방')
    # 8 시험판: info 만 · 기록 0
    nP,nG,nF=len(dump()),len(dump('손님기록')),len(dump('무료한도'))
    cx3=await br.new_context(viewport={'width':375,'height':667}); reqs=[]
    pg5=await page(cx3); pg5.on('request',lambda rq: reqs.append(rq.post_data or '') if '8766' in rq.url else None)
    await pg5.goto('http://localhost:8765/nori/t9lab/'); await pg5.wait_for_timeout(1500)
    r=await room(pg5); ok(r and r['shown'] and r['href'].endswith('test0000base'),'시험판도 서버 방을 읽음')
    fr5=await card(pg5); await fr5.click('.ncard.on [data-c=story]'); await pg5.wait_for_timeout(1000)
    await pg5.evaluate("window.postMessage({nori:'gift'},'*')"); await pg5.wait_for_timeout(500); await pg5.fill('#gN','시험'); await pg5.click('.gs.on [data-c=ok]'); await pg5.wait_for_timeout(800)
    ok(all('"fn":"info"' in x for x in reqs) and len(reqs)>=1,'시험판은 info 만 부름 '+str([x[:20] for x in reqs]))
    ok((len(dump()),len(dump('손님기록')),len(dump('무료한도')))==(nP,nG,nF),'시험판 기록 0줄')
    errs=pg.errs+pg2.errs+pg3.errs+pg4.errs+pg5.errs; ok(not errs,'화면 오류 0 '+str(errs[:2]))
    await br.close()
  print(sum(1 for c,_ in R if c),'/',len(R),'통과')
asyncio.run(main())
