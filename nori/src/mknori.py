# 그때 그 놀이 손님 화면 → www.loveflow.ai.kr/nori/ (사랑흐름-총괄-002 결정 ②) · 261122
import os, json
from PIL import Image, ImageDraw
API='https://script.google.com/macros/s/AKfycbzufDLToOhtkx8_i_bfgyIi-v8QSr0MCnTaPFaeUTVo7x0_VL-Qmohq-ED6VlFDb9p8/exec'
OUT='loveflow/nori'
os.makedirs(OUT,exist_ok=True)
h=open('그때그놀이-017_다복손님용놀이입구_261121.html',encoding='utf-8').read()
head='''<!-- ★ 현재 버전 ▶ nori/index.html · v3.9 · 261126 — 대표 승인 20:03(「올려보세요」): 서버 v7 짝(들어온 길 from · 처음/다시 · 며칠 만 · 공유 · 사진 저장 · 이야기방 누름 셈 · ?from=share 열림 · 멈춤 stop/한도 full 이면 다시 안 보냄 · 「선물은 잠시 쉬어요」 · plan) · 사랑흐름-총괄-050 고침(결과 카드 「사랑흐름 둘러보기」 걷음 · 쿠폰 「이야기방에 남겼어요」 · 관리자 0000 안내 시험판만) · v6 서버와도 맞음 · (이전 v3.8.1 · 261126 — 사랑흐름 총괄 47번(대표 지시 16:59 「링크 걸고」): 서비스 이용 입구 한 줄 둘 — 첫 화면 「함께하는 곳」 아래 /use/#p · 관리자 창 「매장」 칸 맨 아래 /use/#b · 교육용 감춤 · (이전 v3.8 · 261125 — 대표 승인 21:42(「작업 진행 오케이」): 굴렁쇠 · 공 굴리기(혼자서 바로 맨 끝 둘 · 학교 놀이) · 흙 운동장 그림 칸 넷 섞기 묶음 · (이전 v3.7 · 261125 — 대표 승인 19:55: 관리자 창 「가게들」(대표 번호 · 기본 주소에서만 · 가게 내려받기 · 가게 파일 올리기 · 서버 v5 · 사랑흐름-총괄-035 꼴) · 서버 빈 선물 칸은 기본값 · (이전 v3.6 · 261125 — 대표 승인 19:29(「다음 단계 진행」): 고무줄놀이(혼자서 바로 · 박자 줄 · 여섯 단 · BOSS.gomu) · 가게 번호 주소 /nori/?c=번호(서버 v3 · v4 모두 맞음) · 관리자 창 「매장」 우리 가게 QR(포스터 사진 저장 · 주소 복사) · 빌드 탈 고침 · (이전 v3.5 · 261125 — 대표 승인 17:44: 운동회 달리기 · 박 터뜨리기(오재미) · 「그때 이야기」 켬(사랑흐름-놀이-005 바꿈) · 결과 사진 저장(006) · 한 화면 점검 24가지(작은 폰 375×553) · 함께하는 곳 사랑흐름 먼저 · (이전 v3.4 · 261125 — 교육용 주소 /nori/?edu=1 (선물 띠 · 선물 문구 · 내 선물함 · 선물 받기 감춤 · 판 기록 안 남김 · 사랑흐름-총괄-019) · (이전 v3.3 · 261125 대표 승인 15:43 — 「진짜 때리기」 텅텅(두 번 튀며 옆으로 번짐) · (이전 v3.2 · 261125 — 「푸짐한 선물」 띠 색 v0.2(대표 결정 14:47) · 번데기 돌림판 천천히 멈춤 · 외침 말(4단 성공! · 시간 다 됐어요 · 판 완료) · 「그때 이야기」는 손님 화면에서 끔(NORI_STORY_OFF · GPT 검토 · 대표 결정 뒤 켬) · (이전 v3.1 · 261124 대표 승인 21:48 — 통합 표준 v0.2 말 · 화면 틀 색(가 안 · 놀이판 안 색 그대로) · 결과 카드 「카드 저장」「공유하기」 · 진행 중 나가기 확인 창 · 누르는 곳 48 · 윷놀이(말 둘 · 넷 · 빽도 고르기) · 번데기 돌림판 · 놀이 22종(준비 중 다방구) · (이전 v3.0 · 261123 대표 승인 21:40(전부) — 첫 화면 칸 섞기 · 사장님 세기 설정표(중상급) · 수건돌리기 · 사방치기 · 팔씨름 고침 · 새 혼자 놀이 셋(제기차기 · 공기놀이 · 무궁화꽃) · 판 기록 · 놀이 18종 · (이전 v2.1: 팔씨름 · 엿치기 더함 · 디자인 A · 벌칙 · 결과 카드) (v1 261122) · [놀이] 그때 그 놀이 손님 화면 — 사랑흐름-총괄-002 결정 ② www.loveflow.ai.kr/nori/ · Apps Script 는 뒤(기록 · 번호 확인)만 · 카톡 바깥 브라우저 · 홈 화면에 추가 = /lf/frame.js(틀은 그리지 않음) · 푸터 = /lf-foot.js · 테두리 · 음영 없음 -->
<link rel="manifest" href="/nori/manifest.webmanifest">
<link rel="apple-touch-icon" href="/nori/icon-192.png">
<meta name="apple-mobile-web-app-title" content="그때 그 놀이">
<meta name="theme-color" content="#FFC93C">
<meta property="og:title" content="그때 그 놀이">
<meta property="og:description" content="옛날 놀이 한 판! 다복에서 준비한 푸짐한 선물 받아가세요">
<meta property="og:image" content="https://www.loveflow.ai.kr/nori/icon-512.png">
<script>/* 「그때 이야기」 손님 화면 켬 — v3.5 대표 승인 261125 17:44 · v3.6 261125 19:29 · v3.7 19:55 · v3.8 21:42 */window.NORI_API="'''+API+'''";window.NORI_URL="https://www.loveflow.ai.kr/nori/";window.LFFrame=1;try{localStorage.setItem('lf_home_x','1');}catch(e){}</script>
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
