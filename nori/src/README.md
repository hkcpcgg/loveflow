# 그때 그 놀이 · 손님 화면 원본 (nori/src)

새 창(새 작업 공간)에서 /nori/ 를 다시 만들 때 쓰는 원본입니다. 서버 코드(Apps Script)는 여기 두지 않습니다(소통 폴더 → loveflow-server/nori/).

## 다시 만들기
```
mkdir w && cp -r nori/src/* w/ && cd w
mkdir loveflow && cp -r ../nori loveflow/      # mknori.py 가 loveflow/nori/ 에 씁니다
python3 mkall.py && python3 mknori.py          # → loveflow/nori/index.html
cp loveflow/nori/index.html ../nori/index.html
```
261122 확인: 이 폴더만으로 다시 만든 결과가 운영 중인 nori/index.html 과 바이트까지 같음.
**261125 19:29 손님 화면 v3.6 대표 승인(고무줄놀이 · 가게 번호 주소 ?c= · 우리 가게 QR · qr.js) · 261125 17:44 손님 화면 v3.5 대표 승인 (운동회 달리기 · 박 터뜨리기 · 그때 이야기 켬 · 결과 사진 저장 · 한 화면 점검 · 함께하는 곳 사랑흐름 먼저) · 박 터뜨리기 원본: bak_logic.js + mk074.py(t071 틀에서 t074.html · mkall 이 부름) · 시험 test/bktest.py · test/fit23.py(24가지 · 세 크기) · test/educhk.py.** **261125 손님 화면 v3.2 (「그때 이야기」는 손님 화면만 꺼 둠 · mknori 의 NORI_STORY_OFF · mklab 은 지움) · 261124 21:48 대표 승인 → 손님 화면 nori/index.html v3.1 = 원본 그대로(lab 과 같은 내용 · 서버 주소 · 판 기록만 다름).** (이전: 261123 v3.0) 이전 메모: 원본은 디자인 A 1차(첫 화면 + 손놀이 넷) + 2차(나머지 아홉 놀이 틀 · 벌칙 — build017.py 의 askin 이 pre.js · pen.js 를 넣고 nav.js 가 덧씌움)까지 들어가 있어 운영 /nori/(v1.3.1)보다 앞섭니다.** 대표 승인 전에는 `nori/index.html` 을 덮지 말고 시험판만 만듭니다:
```
python3 mkall.py && python3 mknori.py && python3 mklab.py   # → loveflow/nori/lab/index.html (기록 서버로 안 보냄) · lab/v5/ = 시안 v5.1
cp loveflow/nori/lab/index.html ../nori/lab/index.html
```

## 파일
- 공통: `nav.js`(아래 막대 · 옆 기둥 · 결과 카드 — `window.NORI_A=1` 이면 디자인 A) · `pre.js`(디자인 A: 🔈소리 창 · 시작 전 「무엇을 걸까요?」 · 반투명 손가락 · 구령 · 말로 내기) · `pen.js`(벌칙: 딱밤 · 꿀밤 · 인디언밥) · `emit.js` · `gift.js` · `sound.js` · `flat.css`
- 첫 화면: `home_layout.py` · `build017.py`(016을 바탕으로 017 손님 입구를 만듦) · `mknori.py`(/nori/ 머리 · 아이콘)
- **사장님 세기 설정표**: `nav.js` 맨 위 `window.BOSS` (049 원칙 · 261123) — 놀이마다 사장님 세기는 여기 한 곳만 고침 · `bossV(표,L)` 이 중수 자리를 그 판 컨디션(중상급 1.5 ± 0.2)으로 바꿈
- 판 기록: `gift.js` `playLog` — 모든 판을 이 폰(`nori-plays`)에 쌓음 · 서버 「판 기록」 칸 승인 뒤 `window.NORI_PLAYLOG=1` 이면 서버 'play' 로 보냄
- 놀이 틀: `t060.html`(번데기 돌림판 — 261124 시안 · 혼자서 바로 · 사장님 / 친구) · `t057.html`(윷놀이 — 261123 시안 · 둘이서 겨루기 · 사장님 / 친구) · `t052.html`(새 혼자 놀이 셋: 제기차기 · 공기놀이 · 무궁화꽃 — 261123 시안) · `t024.html`(손놀이 넷) · `t022.html`+`g4.js`+`mk022.py`(딱지 · 투호 · 구슬 · 다트) · `t020.html`(골프 · 활쏘기) · `그때그놀이-015*`(오목 · 알까기) · `그때그놀이-013*`(동그란 딱지)
- 「그때 이야기」: `proto/story.html`(= lab/story/ 화면 시안) · `proto/plan.html`(= lab/story/plan/ 설계 · 자서전 연결 계획서, 060)
- 시안: `proto/v5.1.html`(= nori/lab, 디자인 A 확정) · `proto/v4.html` · `design/abc.html`
- 시험: `test/flow.py 놀이 벌칙 [크기] [cpu|two]`(한 판 끝까지 · 사진) · `test/shot.py` · `test/penshot.py 놀이 벌칙`(벌칙 → 카드) · `test/reopen.py`(취소 → 다시 열기 · 다시 → 시작 전 창) · `test/play_all.py 375x667 60`(13종 끝까지 · 골프 · 알까기는 막 누르기로는 60번 안에 안 끝남) · `test/newtest.py jg|gg|mg 375x667 벌칙 실수율`(새 놀이 셋) · `test/yntest.py 375x667 벌칙 cpu|two 실수율`(윷놀이) · `test/bntest.py 375x667 벌칙 cpu|two`(번데기 돌림판) · `test/sabtest.py` · `test/sugtest.py` · `test/fitchk.py`(한 화면) · `test/cardchk.py`(결과 카드) · `test/protochk5.py`(시안) — 로컬 서버 `python3 -m http.server 8765` (loveflow 폴더에서)

다음 할 일은 프로젝트 문서 그때그놀이 최신 번호(052 이후)를 보세요.
