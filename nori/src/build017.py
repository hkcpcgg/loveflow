import re, base64
m=open('그때그놀이-016_메인화면7차_오목·알까기·소리_261121.html',encoding='utf-8').read()
css=m[m.index('<style>')+7:m.index('</style>')]
# body: from top bar to end of .body
a=m.index('<div class="top">'); b=m.index('<p class="cap">메인 7차')
scr=m[a:b]
scr=scr[:scr.rstrip().rfind('</div>')]  # drop .scr close
scr=scr[:scr.rstrip().rfind('</div>')]  # drop .phone close
go={'rd':'rd','stone':'om','clack':'ak','putt':'pt','bow':'bw','dart':'dt','glass':'mb','slap':'tk','pong':'th'}
def tobtn(mm):
    s_=mm.group(1); return '<button class="g" type="button" data-s="%s" data-go="%s">%s</button>'%(s_,go[s_],mm.group(2))
scr=re.sub(r'<a class="g" href="[^"]*" target="_blank" rel="noopener" data-s="(\w+)">(.*?)</a>',tobtn,scr,flags=re.S)
scr=scr.replace('<div class="g more"><b>놀이 더 보기</b></div>','<button class="g more" type="button" data-soon="1"><b>놀이 더 보기</b></button>')
import re as _re
scr=_re.sub(r'<div class="g" data-s="(dart|glass|slap|pong)" role="button" tabindex="0">(.*?)</b></div>', lambda m_: '<button class="g" type="button" data-s="%s" data-go="%s">%s</b></button>'%(m_.group(1),go[m_.group(1)],m_.group(2)), scr, flags=_re.S)
scr=scr.replace('<div class="btn start">','<button class="btn start" type="button" id="bStart">').replace('게임 시작</div>','게임 시작</button>')
scr=scr.replace('<div class="btn gift">','<button class="btn gift" type="button" id="bGift">').replace('선물 받기</div>','선물 받기</button>',1)
scr=scr.replace('<div class="btn half"><svg class="i" viewBox="0 0 24 24"><circle cx="18"','<button class="btn half" type="button" id="bShare"><svg class="i" viewBox="0 0 24 24"><circle cx="18"').replace('공유하기</div>','공유하기</button>')
scr=scr.replace('<div class="btn half"><svg class="i" viewBox="0 0 24 24"><circle cx="9"','<button class="btn half" type="button" id="bInvite"><svg class="i" viewBox="0 0 24 24"><circle cx="9"').replace('친구 초대</div>','친구 초대</button>')
scr=scr.replace('<div class="room">','<a class="room" href="https://uriyagi.kr/?g=e92887ad781a49f7a3e74194e912216e" target="_blank" rel="noopener">').replace('다복 이야기방<span class="chev"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></span></div>','다복 이야기방<span class="chev"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></span></a>')
exec(open('home_layout.py',encoding='utf-8').read())
scr=restructure(scr)
css=css.replace('.scr{','.scr-unused{')
css+='''
html,body{margin:0;background:#E9E6DE}
.app{max-width:480px;margin:0 auto;min-height:100vh;background:#fff;position:relative}
.app .top{padding-top:env(safe-area-inset-top,0px);box-sizing:content-box}
.app .body{padding-bottom:calc(env(safe-area-inset-bottom,0px))}
button.g{font:inherit;color:inherit;border:0;width:100%;-webkit-tap-highlight-color:transparent}
button.btn{cursor:pointer;width:100%}
a.room{color:inherit;text-decoration:none}
.fam a{white-space:nowrap}
.g .soon{position:absolute;top:8px;right:9px;font-size:10px;font-weight:800;color:#9A8E70}
.g.ready{animation:nudge .5s ease-in-out 2}
@keyframes nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%) translateY(20px);background:#16181D;color:#fff;font-size:14.5px;font-weight:700;padding:11px 16px;border-radius:14px;max-width:88vw;text-align:center;opacity:0;transition:.25s;z-index:30;pointer-events:none}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
.ov{position:fixed;inset:0;z-index:20;background:#F7EFD8;display:none}
.ov.on{display:block}
.ov iframe{border:0;width:100%;height:100%;display:block}
.ov .back{display:none!important;position:absolute;top:calc(8px + env(safe-area-inset-top,0px));left:max(8px,calc(50% - 232px));width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.16);border:0;color:#fff;display:grid;place-items:center;cursor:pointer;z-index:2}
.ov .back svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
'''
css+=HOME_CSS
# 디자인 A 2차 (261122): 손놀이(024, 이미 A) 말고 모든 놀이에 A 공통(pre.js · pen.js)을 아래 막대 스크립트 앞에 넣음 → nav.js 가 A 틀 · 시작 전 창 · 벌칙을 덧씌움
A_HEAD=('<script>window.NORI_A=1;window.NORI_BOARD=".brd,#oB,.board";</script>\n<script>\n'+open('pre.js',encoding='utf-8').read()+'\n</script>\n<script>\n'+open('pen.js',encoding='utf-8').read()+'\n</script>\n')
def askin(h):
    if 'window.NORI_A=1' in h: return h
    i=h.index('/* 그때 그 놀이 · 아래 막대'); j=h.rfind('<script>',0,i); assert j>0
    return h[:j]+A_HEAD+h[j:]
def guest(path, extra_css, extra_js=''):
    h=askin(open(path,encoding='utf-8').read())
    h=h.replace('</style>',extra_css+'\n</style>',1)
    h=h.replace('</body>','<script>'+extra_js+'</script>\n</body>',1)
    return base64.b64encode(h.encode('utf-8')).decode()
T13=guest('그때그놀이-013_동그란딱지시험판_261121.html','.shop{display:none!important}.note{display:none}.top .ttl{padding:0 46px}')
T18=guest('그때그놀이-020_골프·활쏘기시안v6_261121.html','.shopset{display:none!important}.note{display:none}')
T22=guest('그때그놀이-022_딱지치기·투호·구슬치기·원판다트_261121.html','.note{display:none}')
T24=guest('그때그놀이-024_손놀이_가위바위보·구슬홀짝·묵찌빠·보리쌀_261122.html','')
T15=guest('그때그놀이-015_오목·알까기시험판_261121.html','.shopset{display:none!important}.note{display:none}')
html='''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>그때 그 놀이</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Song+Myung&family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap">
<style>'''+css.replace('/* 그때그놀이-016 · 메인 화면 7차','/* 그때그놀이-017 · 다복 손님용 놀이 입구(링크 하나로 바로 놂) — 016 메인 7차 바탕')+'''</style>
</head>
<body>
<div class="app">
'''+scr+'''
</div>
<div class="ov" id="ov" role="dialog" aria-label="놀이">
  <button class="back" type="button" id="ovBack" aria-label="놀이 고르기로"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
  <iframe id="ovF" title="놀이"></iframe>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>
'''+m[m.index('<script>')+8:m.index('</script>')]+'''
(function(){
  var T={rd:"'''+T13+'''", om:"'''+T15+'''", pt:"'''+T18+'''", g4:"'''+T22+'''", hd:"'''+T24+'''"};
  function dec(b){ var s=atob(b), u=new Uint8Array(s.length); for(var i=0;i<s.length;i++){ u[i]=s.charCodeAt(i); } return new TextDecoder().decode(u); }
  var ov=document.getElementById('ov'), fr=document.getElementById('ovF'), cur='';
  function open(k){
    var key= k==='rd'?'rd':(k==='pt'||k==='bw'?'pt':((k==='tk'||k==='th'||k==='mb'||k==='dt')?'g4':((k==='rp'||k==='hj'||k==='mj'||k==='br')?'hd':'om'))), doc=dec(T[key]);
    var solo={om:'omok',ak:'alkkagi',pt:'putt',bw:'bow',tk:'ttak',th:'tuho',mb:'marble',dt:'dart',rp:'rps',hj:'holjjak',mj:'mjb',br:'bori'}[k]; if(solo){ doc=doc.replace('</body>','<script>solo("'+solo+'");<\\/script></body>'); }
    
    if(cur!==k){ fr.srcdoc=doc; cur=k; } else { try{ fr.contentWindow.postMessage('nori-open','*'); }catch(e){} }
    ov.classList.add('on'); document.body.style.overflow='hidden';
    try{ history.pushState({nori:k},''); }catch(e){}
  }
  function close(){ ov.classList.remove('on'); document.body.style.overflow=''; }
  /* 홈: 놀이 창을 바로 닫고 첫 화면 맨 위로. 놀이 안 주소 바뀜(#)이 뒤로가기 기록을 먹어 history.back 이 안 먹던 문제 고침 (261122) */
  function home(){ close(); try{ if(history.state&&history.state.nori){ history.replaceState(null,''); } }catch(x){} window.scrollTo(0,0); }
  document.getElementById('ovBack').addEventListener('click',home);
  window.addEventListener('popstate',close);
  /* 놀이 안 아래 막대가 보내는 말: 놀이 목록 / 다른 놀이로 */
  window.addEventListener('message',function(e){ var d=e.data; if(d==='nori-close'){ home(); } else if(d&&d.nori==='story'){ try{ window.open('https://uriyagi.kr/?g=e92887ad781a49f7a3e74194e912216e','_blank'); }catch(x){} } else if(d&&d.nori==='go'&&d.k){ cur=''; open(d.k); } });
  var tt=0, toast=document.getElementById('toast');
  function say(t){ toast.textContent=t; toast.classList.add('on'); clearTimeout(tt); tt=setTimeout(function(){ toast.classList.remove('on'); },2200); }
  var gs=document.querySelectorAll('.g');
  for(var i=0;i<gs.length;i++){ gs[i].addEventListener('click',function(){
    var k=this.getAttribute('data-go');
    if(k){ var me=this; setTimeout(function(){ open(k); },140); }
    else { say('곧 열려요! 곧 열려요!'); }
  }); }
  document.getElementById('fGift').addEventListener('click',function(){ GIFT.myBox(); });
  document.getElementById('fHome').addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  function share(){
    var d={title:'그때 그 놀이',text:'옛날 놀이 한 판! 다복에서 준비한 푸짐한 선물 받아가세요',url:(window.NORI_URL||location.href)};
    if(navigator.share){ navigator.share(d).catch(function(){}); }
    else if(navigator.clipboard){ navigator.clipboard.writeText(window.NORI_URL||location.href).then(function(){ say('주소를 복사했어요'); },function(){ say('주소 복사가 안 돼요'); }); }
  }
  document.getElementById('fShare').addEventListener('click',share);
})();
</script>
<script>
'''+open('gift.js',encoding='utf-8').read()+'''
</script>
<script>
'''+open('pre.js',encoding='utf-8').read()+'''
/* 디자인 A: 오른쪽 위 「🔈 소리」 · 맨 아래 사장님 줄(관리자 창 · 홈 화면에 추가 — ☰ 대신) */
(function(){ var r=document.querySelector('.top .topr'); if(r){ NA.sndBtn(r); }
  [].forEach.call(document.querySelectorAll('.own [data-own]'),function(b){ b.addEventListener('click',function(e){ e.stopPropagation(); var k=b.getAttribute('data-own');
    if(k==='home'){ if(window.LFHomeAdd){ LFHomeAdd(); } else { NA.toast('브라우저 메뉴에서 「홈 화면에 추가」를 눌러 주세요'); } return; }
    var m=document.querySelector('.menu [data-m='+k+']'); if(m){ m.click(); } }); }); })();
</script>
<script src="https://www.loveflow.ai.kr/lf-foot.js" defer></script>
</body>
</html>
'''
open('그때그놀이-017_다복손님용놀이입구_261121.html','w',encoding='utf-8').write(html)
print(len(html))
