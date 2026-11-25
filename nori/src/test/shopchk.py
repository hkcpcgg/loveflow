# 가게 번호 주소 (261125): ?c=101 → 번호 기억 · 공유 주소에 붙음 · 서버로 보내는 몸에 c · 번호 없는 주소는 기억한 번호
import asyncio,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); ctx=await br.new_context(viewport={'width':375,'height':667}); pg=await ctx.new_page(); sent=[]
    async def rt(r):
      if 'script.google' in r.request.url:
        try: sent.append(json.loads(r.request.post_data or '{}'))
        except Exception: pass
        await r.fulfill(status=200,content_type='application/json',body=json.dumps({'ok':True,'res':{'set':{'shop':{'s':'꽃집','h':'사장님'},'prizes':{'p1':'떡볶이','p0':'뻥튀기','sp':''},'cond':'a'}}}))
      elif 'googleapis' in r.request.url or 'gstatic' in r.request.url: await r.abort()
      else: await r.continue_()
    await pg.route('**/*',rt)
    await pg.goto('http://localhost:8765/nori/?c=101'); await pg.wait_for_timeout(1200)
    a=await pg.evaluate("()=>({c:window.NORI_C,url:window.NORI_URL,shop:(document.querySelector('.shopN')||{}).textContent})")
    print('?c=101 →',a,'| 보낸 몸:',[ (s.get('fn'),s.get('c')) for s in sent])
    sent.clear(); await pg.goto('http://localhost:8765/nori/'); await pg.wait_for_timeout(1200)
    b=await pg.evaluate("()=>({c:window.NORI_C,url:window.NORI_URL})"); print('번호 없이 다시 →',b,'| 보낸 몸:',[(s.get('fn'),s.get('c')) for s in sent])
    await br.close()
asyncio.run(main())
