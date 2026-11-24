# 그때 그 놀이 손님 화면 → www.loveflow.ai.kr/nori/ (사랑흐름-총괄-002 결정 ②) · 261122
import os, json
from PIL import Image, ImageDraw
API='https://script.google.com/macros/s/AKfycbzufDLToOhtkx8_i_bfgyIi-v8QSr0MCnTaPFaeUTVo7x0_VL-Qmohq-ED6VlFDb9p8/exec'
OUT='loveflow/nori'
os.makedirs(OUT,exist_ok=True)
h=open('그때그놀이-017_다복손님용놀이입구_261121.html',encoding='utf-8').read()
head='''<!-- ★ 현재 버전 ▶ nori/index.html · v3.1 · 261124 대표 승인 21:48 — 통합 표준 v0.2 말 · 화면 틀 색(가 안 · 놀이판 안 색 그대로) · 결과 카드 「카드 저장」「공유하기」 · 진행 중 나가기 확인 창 · 누르는 곳 48 · 윷놀이(말 둘 · 넷 · 빽도 고르기) · 번데기 돌림판 · 놀이 22종(준비 중 다방구) · (이전 v3.0 · 261123 대표 승인 21:40(전부) — 첫 화면 칸 섞기 · 사장님 세기 설정표(중상급) · 수건돌리기 · 사방치기 · 팔씨름 고침 · 새 혼자 놀이 셋(제기차기 · 공기놀이 · 무궁화꽃) · 판 기록 · 놀이 18종 · (이전 v2.1: 팔씨름 · 엿치기 더함 · 디자인 A · 벌칙 · 결과 카드) (v1 261122) · [놀이] 그때 그 놀이 손님 화면 — 사랑흐름-총괄-002 결정 ② www.loveflow.ai.kr/nori/ · Apps Script 는 뒤(기록 · 번호 확인)만 · 카톡 바깥 브라우저 · 홈 화면에 추가 = /lf/frame.js(틀은 그리지 않음) · 푸터 = /lf-foot.js · 테두리 · 음영 없음 -->
<link rel="manifest" href="/nori/manifest.webmanifest">
<link rel="apple-touch-icon" href="/nori/icon-192.png">
<meta name="apple-mobile-web-app-title" content="그때 그 놀이">
<meta name="theme-color" content="#FFC93C">
<meta property="og:title" content="그때 그 놀이">
<meta property="og:description" content="옛날 놀이 한 판! 다복에서 준비한 푸짐한 선물 받아가세요">
<meta property="og:image" content="https://www.loveflow.ai.kr/nori/icon-512.png">
<script>window.NORI_API="'''+API+'''";window.NORI_URL="https://www.loveflow.ai.kr/nori/";window.LFFrame=1;try{localStorage.setItem('lf_home_x','1');}catch(e){}</script>
<script src="/lf/frame.js"></script>
'''
assert h.count('<head>')==1
h=h.replace('<head>','<head>\n'+head,1)
h=h.replace('<script src="https://www.loveflow.ai.kr/lf-foot.js" defer></script>','<script src="/lf-foot.js" defer></script>')
open(OUT+'/index.html','w',encoding='utf-8').write(h)
man={"name":"그때 그 놀이","short_name":"그때 그 놀이","start_url":"/nori/","scope":"/nori/","display":"standalone","background_color":"#FFF8E6","theme_color":"#FFC93C","lang":"ko",
     "icons":[{"src":"/nori/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"/nori/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]}
open(OUT+'/manifest.webmanifest','w',encoding='utf-8').write(json.dumps(man,ensure_ascii=False,indent=1))
for n in (192,512):
    im=Image.new('RGB',(n,n),'#16181D'); d=ImageDraw.Draw(im); m=n*0.14; box=[m,m,n-m,n-m]
    for i,c in enumerate(['#E1262D','#FFC21A','#2457D6','#2E9E4F']): d.pieslice(box,i*90-90,i*90,fill=c)
    r=n*0.07; d.ellipse([n/2-r,n/2-r,n/2+r,n/2+r],fill='#FFFFFF')
    im.save(OUT+'/icon-%d.png'%n)
open(OUT+'/README.md','w',encoding='utf-8').write('''# nori/ — 그때 그 놀이 손님 화면

- 주인: 「그때 그 놀이」 클로드 기술 이사 (사랑흐름-총괄-002 결정 ②). 이 폴더만 놀이 쪽이 고침 · 커밋 머리표 `[놀이]`.
- 주소: https://www.loveflow.ai.kr/nori/
- 뒤(기록 · 번호 확인): Apps Script 웹 앱(사랑흐름 계정) — `fetch` POST `{fn,args}` (put · give · list · setSettings · info). 관리자 · 직원 번호는 스크립트 속성에만.
- 쓰는 사랑흐름 공용 부품(고치지 않고 부르기만): `/lf/frame.js`(window.LFFrame=1 로 틀은 그리지 않음 · 카톡 바깥 브라우저 · LFHomeAdd) · `/lf-foot.js`(data-refund="0").
- 화면 목록 자동 갱신(screens.yml v2)에서 빠져 있음.
- 소스 원본: 「그때 그 놀이」 작업 공간(build017.py · home_layout.py · gift.js · nav.js · 놀이 틀 t0NN.html) — 여기 index.html 은 지어 낸 결과물.
''')
print('nori ok', len(h))
