# 한 화면 점검 23가지 (261125): 시작 전 창 · 판 · 결과 카드 를 360x640 · 375x667 에서
# 넘침 = 문서가 세로/가로로 밀림, 또는 보이는 단추·판이 화면 밖 / 아래 막대(.nbar)에 가림
# 쓰기: python3 test/fit23.py [주소경로=/nori/lab/] [놀이들(쉼표)] [크기들(쉼표)]  → shots/fit_<크기>_<놀이>_<단계>.png
import asyncio,sys,json,os
PFX=os.environ.get('PFX','fit')
from playwright.async_api import async_playwright
PATH=sys.argv[1] if len(sys.argv)>1 else '/nori/lab/'
ALL='rp hj mj br dt th tk mb pt bw om ak rd sb sg aw yt jg gg mg yn bn ru bk gm'.split()
KS=sys.argv[2].split(',') if len(sys.argv)>2 and sys.argv[2] else ALL
SZ=[tuple(map(int,s.split('x'))) for s in (sys.argv[3] if len(sys.argv)>3 else '360x640,375x667').split(',')]
MEAS="""()=>{var H=innerHeight,W=innerWidth,d=document.documentElement,b=document.body;
 var nb=document.querySelector('.nbar'),nbt=nb&&nb.offsetParent!==null?nb.getBoundingClientRect().top:H;
 var card=document.querySelector('.ncard.on');
 var out=[];
 var root=card||document;
 root.querySelectorAll('button,canvas,#board,input,select,.pk,.act').forEach(function(e){
   if(e.closest('.nbar')||e.closest('#nExit')) return;
   if(!card&&e.closest('.ncard')) return;
   var cs=getComputedStyle(e); if(cs.visibility=='hidden'||cs.display=='none'||e.offsetParent===null&&cs.position!='fixed') return;
   if(e.type=='file') return;
   var r=e.getBoundingClientRect(); if(r.width<4||r.height<4) return;
   var lim=card?card.getBoundingClientRect().bottom:nbt;
   if(r.bottom>lim+1||r.right>W+1||r.left<-1||r.top<-1) out.push((e.id||e.className||e.tagName).toString().slice(0,18)+'@'+Math.round(r.bottom)+'/'+Math.round(lim));
 });
 return {sh:Math.max(d.scrollHeight,b.scrollHeight)-H, sw:Math.max(d.scrollWidth,b.scrollWidth)-W,
   card:card?card.scrollHeight-card.clientHeight:null, out:out.slice(0,5)};}"""
async def one(br,k,w,h):
  pg=await br.new_page(viewport={'width':w,'height':h},device_scale_factor=2)
  await pg.route('**/*',lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url) else r.continue_())
  errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
  await pg.goto('http://localhost:8765'+PATH); await pg.wait_for_timeout(700)
  await pg.evaluate("k=>document.querySelector('.g[data-go='+k+']').click()",k); await pg.wait_for_timeout(1400)
  fr=pg.frames[-1]; res={}
  tag=f'{w}x{h}_{k}'
  res['pre']=await fr.evaluate(MEAS); await pg.screenshot(path=f'shots/{PFX}_{tag}_1pre.png')
  try:
    for sel in ('#naBets [data-b=none]','#naWho [data-w=cpu]'):
      try:
        if await fr.locator(sel+':visible').count(): await fr.click(sel,timeout=800)
      except Exception: pass
    await fr.locator('#naGo:visible, [data-v=cpu1]:visible').first.click(timeout=1500)
  except Exception as e: res['startErr']=str(e)[:60]
  await pg.wait_for_timeout(1500)
  res['play']=await fr.evaluate(MEAS); await pg.screenshot(path=f'shots/{PFX}_{tag}_2play.png')
  # 결과 카드: 놀이 끝 신호를 흉내 (카드는 공통 틀 · 점수 꼴만 놀이마다)
  await fr.evaluate("k=>{try{noriResult({game:k,gname:document.title,win:true,me:3,cpu:1,detail:'3 대 1'});}catch(e){} var d=document.querySelector('.done'); if(d) d.classList.add('on');}",k)
  for i in range(10):
    await pg.wait_for_timeout(500)
    if await fr.evaluate("()=>!!document.querySelector('.ncard.on')"): break
  res['card']=await fr.evaluate(MEAS); await pg.screenshot(path=f'shots/{PFX}_{tag}_3card.png')
  res['err']=errs[:2]
  await pg.close(); return res
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch(); allr={}
    for w,h in SZ:
      for k in KS:
        r=await one(br,k,w,h); allr[f'{w}x{h}_{k}']=r
        bad=[s for s in ('pre','play','card') if r[s]['sh']>1 or r[s]['sw']>1 or r[s]['out'] or (r[s]['card'] or 0)>1]
        print(w,h,k,'OK' if not bad else 'NG '+','.join(bad), json.dumps({s:r[s] for s in bad},ensure_ascii=False) if bad else '', r.get('startErr',''), r['err'],flush=True)
    json.dump(allr,open(f'shots/{PFX}23.json','w'),ensure_ascii=False,indent=1)
    await br.close()
asyncio.run(main())
