# 사용법 그림 찍기 (261128) — 흉내 서버 :8766 · nori/t9 · 우리 이야기 /guide/ 꼴 그대로(화면 그림 + 노란 말풍선)
# 쓰는 법: (w 폴더에서) python3 test/guideshot.py  → shots/guide/*.png · 그다음 python3 mkguide.py
import asyncio, json, urllib.request, urllib.parse
from playwright.async_api import async_playwright
OUT = 'shots/guide/'
def setp(k, v): urllib.request.urlopen('http://localhost:8766/set?' + k + '=' + urllib.parse.quote(v)).read()
# 노란 말풍선: 가리킬 요소 위나 아래에 · 화면 밖으로 안 나가게
BUB = """([sel,txt,root])=>{ var d=root?document.querySelector(root).contentDocument:document; var e=typeof sel==='string'?d.querySelector(sel):null;
 var fr=root?document.querySelector(root).getBoundingClientRect():{left:0,top:0};
 document.querySelectorAll('.gbub').forEach(x=>x.remove());
 var r=e?e.getBoundingClientRect():{left:innerWidth/2-60,top:innerHeight/2,width:120,height:0,bottom:innerHeight/2};
 var L=r.left+fr.left, T=r.top+fr.top, B=(r.bottom||r.top+r.height)+fr.top, cx=L+r.width/2;
 if(e){ var ring=document.createElement('div'); ring.className='gbub'; ring.style.cssText='position:fixed;z-index:99999;pointer-events:none;border:3px solid #FFC21A;border-radius:14px;left:'+(L-5)+'px;top:'+(T-5)+'px;width:'+(r.width+10)+'px;height:'+((B-T)+10)+'px'; document.body.appendChild(ring); }
 var b=document.createElement('div'); b.className='gbub'; b.textContent=txt;
 b.style.cssText='position:fixed;z-index:99999;pointer-events:none;background:#FFC21A;color:#1B1A1F;font:900 17px/1.35 "Noto Sans KR",sans-serif;padding:10px 14px;border-radius:14px;max-width:300px;text-align:center;white-space:pre-line';
 document.body.appendChild(b); var bw=b.offsetWidth, bh=b.offsetHeight, up=B+14+bh>innerHeight-8;
 var x=Math.max(8,Math.min(innerWidth-bw-8,cx-bw/2)), y=up?Math.max(8,T-14-bh):B+14; b.style.left=x+'px'; b.style.top=y+'px';
 var t=document.createElement('div'); t.className='gbub'; t.style.cssText='position:fixed;z-index:99999;width:0;height:0;border:10px solid transparent;left:'+(Math.max(x+12,Math.min(x+bw-32,cx-10)))+'px;'+(up?'top:'+(y+bh)+'px;border-top-color:#FFC21A':'top:'+(y-20)+'px;border-bottom-color:#FFC21A');
 document.body.appendChild(t); }"""
async def shot(pg, name, sel=None, txt='', root=None):
    if txt: await pg.evaluate(BUB, [sel, txt, root]); await pg.wait_for_timeout(150)
    await pg.screenshot(path=OUT + name + '.png')
    await pg.evaluate("document.querySelectorAll('.gbub').forEach(x=>x.remove())")
async def main():
    setp('SETTINGS_101', json.dumps({'prizes': {'p1': '음료 한 잔', 'p0': '사탕 하나', 'sp': '식혜 한 잔'}, 'cond': 'a', 'shop': {'s': '다복', 'h': '사장님'}}))
    async with async_playwright() as p:
        br = await p.chromium.launch()
        cx = await br.new_context(viewport={'width': 375, 'height': 667}, device_scale_factor=2)
        pg = await cx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:120]))
        await pg.route('**/*', lambda r: r.abort() if ('googleapis' in r.request.url or 'gstatic' in r.request.url or 'script.google' in r.request.url or 'cdnjs' in r.request.url and 'xlsx' in r.request.url) else r.continue_())
        await pg.goto('http://localhost:8765/nori/t9/?c=101'); await pg.wait_for_timeout(1800)
        await pg.evaluate("document.querySelector('.g[data-go=bc]').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(300)
        await shot(pg, 'c1_home', '.g[data-go=bc]', '놀이를 하나 골라 눌러요')
        await pg.evaluate("document.querySelector('.room').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(300)
        await shot(pg, 'c1b_room', '.room', '오늘 놀이 추억을\n가게 이야기방에 남겨요')
        await pg.evaluate("scrollTo(0,0)")
        await pg.evaluate("document.querySelector('.g[data-go=bc]').click()"); await pg.wait_for_timeout(1500)
        fr = pg.frames[-1]
        await shot(pg, 'c2_ready', '#naWho [data-w=cpu]', '「다복 사장님과 한 판」이나\n「친구와 같이 하기」를 골라요', 'iframe')
        await fr.click('#naBets [data-b=none]'); await fr.click('#naWho [data-w=cpu]')
        await shot(pg, 'c2b_go', '#naGo', '시작을 눌러요', 'iframe')
        await fr.click('#naGo'); await pg.wait_for_timeout(1600)
        await shot(pg, 'c3_play', None, '반투명 손가락이 가리키는 곳을\n따라 하면 돼요')
        await fr.evaluate("()=>{S.gen++; finish(true,3,1,'');}"); await pg.wait_for_timeout(1800)
        await shot(pg, 'c4_card', '.ncard.on [data-c=save]', '결과 사진은 내 휴대폰에\n저장하거나 공유해요', 'iframe')
        gb = await fr.evaluate("()=>{var b=[...document.querySelectorAll('.ncard.on button')].find(x=>/선물/.test(x.textContent)); if(!b) return ''; b.id='gGift'; return b.textContent}")
        await shot(pg, 'c5_gift', '#gGift', '「선물 받기」를 눌러요', 'iframe')
        await pg.evaluate("window.postMessage({nori:'gift'},'*')"); await pg.wait_for_timeout(700)
        await pg.fill('#gN', '김다복')
        await shot(pg, 'c6_name', '.gs.on [data-c=ok]', '이름이나 별명만 적어요\n전화번호는 받지 않아요')
        await pg.click('.gs.on [data-c=ok]'); await pg.wait_for_timeout(1200)
        await shot(pg, 'c7_coupon', '.gs.on .cp', '이 쿠폰을 직원에게\n보여 주면 선물을 받아요')
        await pg.evaluate("document.querySelector('.gs').classList.remove('on')")
        # 사장님
        await pg.goto('http://localhost:8765/use/#b-nori'); await pg.wait_for_timeout(1500)
        ask = await pg.evaluate("()=>{var a=[...document.querySelectorAll('a')].filter(x=>/문의하기/.test(x.textContent)&&x.offsetParent); var t=a[a.length-1]; if(!t) return ''; t.id='gAsk'; t.scrollIntoView({block:'center'}); return t.textContent}")
        await pg.wait_for_timeout(400)
        await shot(pg, 'o1_use', '#gAsk' if ask else None, '사랑흐름 서비스 이용에서\n「그때 그 놀이」 문의하기')
        await pg.goto('http://localhost:8765/nori/t9/?c=101'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('.menu').classList.add('on')"); await pg.wait_for_timeout(300)
        await shot(pg, 'o2_menu', '.menu [data-m=admin]', '☰ 메뉴에서\n「관리자 창」을 열어요')
        await pg.evaluate("document.querySelector('.menu [data-m=admin]').click()"); await pg.wait_for_timeout(400)
        await pg.fill('#aP', '123456'); await pg.click('[data-c=in]'); await pg.wait_for_timeout(1000)
        await pg.click('[data-t=gift]'); await pg.wait_for_timeout(400)
        await shot(pg, 'o3_gift', '.gs.on select, .gs.on input', '이기면 · 참가 선물을\n목록에서 고르거나 직접 써요')
        await pg.click('[data-t=shop]'); await pg.wait_for_timeout(600)
        qr = await pg.evaluate("()=>{var q=document.getElementById('qrP'); if(!q) return false; q.scrollIntoView({block:'center'}); return true}")
        await pg.wait_for_timeout(400)
        await shot(pg, 'o4_qr', '#qrP' if qr else None, '우리 가게 QR 포스터를\n내려받아 탁자에 붙여요')
        await pg.click('[data-t=rec]'); await pg.wait_for_timeout(500)
        await shot(pg, 'o5_rec', '.gs.on .stat', '오늘 몇 판 · 몇 분이 이겼는지\n선물을 몇 개 드렸는지 봐요')
        print('찍음 · 오류', errs[:3])
        await br.close()
asyncio.run(main())
