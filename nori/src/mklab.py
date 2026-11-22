# 그때 그 놀이 · 시험판(lab) 만들기 (261122) — 손님 화면 빌드(loveflow/nori/index.html)를 그대로 쓰되
#  ① 기록 서버(Apps Script)로 보내지 않음(시험 기록이 손님기록 시트에 섞이지 않게)  ② 검색에 안 잡히게
#  ③ 시안 v5.1 은 nori/lab/v5/ 로 옮겨 둠(팔씨름 · 엿치기 · 마이크 시험은 거기서)
import os, re, shutil
SRC='loveflow/nori/index.html'; OUT='loveflow/nori/lab'
h=open(SRC,encoding='utf-8').read()
n=len(re.findall(r'window\.NORI_API="[^"]*"',h)); assert n==1,n
h=re.sub(r'window\.NORI_API="[^"]*"','window.NORI_API=""',h)
h=h.replace('<!-- ★ 현재 버전 ▶ nori/index.html','<!-- ★ 시험판 ▶ nori/lab/index.html · 디자인 A 1차(첫 화면 + 손놀이 넷) · 기록 서버로 보내지 않음 · 원본 = nori/src (mkall → mknori → mklab) ◀ 손님 화면 nori/index.html',1)
h=h.replace('<head>','<head>\n<meta name="robots" content="noindex">',1)
os.makedirs(OUT+'/v5',exist_ok=True)
open(OUT+'/index.html','w',encoding='utf-8').write(h)
shutil.copy('proto/v5.1.html',OUT+'/v5/index.html')
print('lab ok',len(h))
