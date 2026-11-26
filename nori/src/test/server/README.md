# 서버 시험 (261125)
서버 원본(Code_v5.gs)은 시트 번호가 있어 저장소에 두지 않음 — 소통 폴더 「놀이-서버소스_nori_Code.gs_v5_가게파일올리기_261125.txt」를 받아 이 폴더에 Code_v5.gs 로 두거나 CODE=경로 로 줌.
- node test_v5.js — 흉내 환경 30가지
- node mocksrv.js — :8766 흉내 서버(대표 번호 999999) · nori/index.html 의 NORI_API 를 http://localhost:8766/ 로 바꾼 쪽을 nori/t5/ 에 두고 python3 test/shopfile.py
- 261125 v6(usage_count · 사랑흐름-총괄-040): 소통 폴더 「놀이-서버소스_nori_Code.gs_v6_이용지표usage_count_261125.txt」 → CODE=Code_v6.gs node test_v6_usage.js (14가지) · node test_v5.js 도 v6 로 30가지
- 261126 v7(들어온 길 · 퍼짐 · 가게 지역 · 잘라내기 · usage v7 · 사랑흐름-총괄-042): 소통 폴더 「놀이-서버소스_nori_Code.gs_v7_들어온길·퍼짐·가게지역·잘라내기·usage_v7_261126.txt」 → CODE=Code_v7.gs node test_v7.js (45가지) · test_v5.js 30가지 · test_v6_usage.js 는 v7 에서 「칸 꼴」 하나가 달라짐(sent · opened · reopened 가 null → 숫자 · 일부러)
- node mocksrv7.js — v7 흉내 서버 :8766 + GET /dump(판기록 줄) · /set?NORI_STOP=all(속성 바꾸기) · 손님 화면 흐름 시험 python3 test/v7flow.py (nori/t7/ = index.html 의 NORI_API 를 localhost:8766 으로)
- 261126 v8(사랑흐름-놀이-009 · usage_count 끝에 region 칸 · 「경기 파주시」 꼴 · 비면 모름 · 기본 가게 BASE_REGION): 소통 폴더 「놀이-서버소스_nori_Code.gs_v8_이용지표지역칸region_261126.txt」 → CODE=Code_v8.gs node test_v8.js (50가지) · test_v5.js 30가지 · test_v7.js 는 「칸 차례」 하나만 달라짐(region 더함 · 일부러)
