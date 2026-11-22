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

## 파일
- 공통: `nav.js`(아래 막대 · 옆 기둥 · 결과 카드) · `emit.js` · `gift.js` · `sound.js` · `flat.css`
- 첫 화면: `home_layout.py` · `build017.py`(016을 바탕으로 017 손님 입구를 만듦) · `mknori.py`(/nori/ 머리 · 아이콘)
- 놀이 틀: `t024.html`(손놀이 넷) · `t022.html`+`g4.js`+`mk022.py`(딱지 · 투호 · 구슬 · 다트) · `t020.html`(골프 · 활쏘기) · `그때그놀이-015*`(오목 · 알까기) · `그때그놀이-013*`(동그란 딱지)
- 시안: `proto/v5.1.html`(= nori/lab, 디자인 A 확정) · `proto/v4.html` · `design/abc.html`
- 시험: `test/play_all.py`(13종 끝까지) · `test/fitchk.py`(한 화면) · `test/cardchk.py`(결과 카드) · `test/protochk5.py`(시안) — 로컬 서버 `python3 -m http.server 8765` (loveflow 폴더에서)

다음 할 일은 프로젝트 문서 그때그놀이-029 를 보세요.
