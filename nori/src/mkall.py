# 그때 그 놀이 · 모두 다시 만들기 (261121 v7) — 아래 막대(nav) 새로 · 020 · 022 · 013 · 015 · 017
import re, subprocess
U22='https://claude.ai/artifact/HCVK1K1mHpDLRRD7H1qiPv'
U24=open('u24.txt').read().strip() if __import__('os').path.exists('u24.txt') else 'https://claude.ai/artifact/PENDING'
nav=open('nav.js',encoding='utf-8').read().replace('__U22__',U22).replace('__U24__',U24)
snd=open('sound.js',encoding='utf-8').read().strip(); emit=open('emit.js',encoding='utf-8').read()
t=open('t020.html',encoding='utf-8').read().replace('__SND__',snd).replace('__NAV__',nav).replace('__EMIT__',emit)
open('그때그놀이-020_골프·활쏘기시안v6_261121.html','w',encoding='utf-8').write(t)
subprocess.run(['python3','mk022.py',U22],check=True)
pre=open('pre.js',encoding='utf-8').read(); pen=open('pen.js',encoding='utf-8').read()
t=open('t024.html',encoding='utf-8').read().replace('__PRE__',pre).replace('__PEN__',pen).replace('__SND__',snd).replace('__NAV__',nav).replace('__EMIT__',emit)
open('그때그놀이-024_손놀이_가위바위보·구슬홀짝·묵찌빠·보리쌀_261122.html','w',encoding='utf-8').write(t)
# 3차 (261123): 팔씨름 · 엿치기
t=open('t030.html',encoding='utf-8').read().replace('__PRE__',pre).replace('__PEN__',pen).replace('__SND__',snd).replace('__NAV__',nav).replace('__EMIT__',emit)
open('그때그놀이-030_팔씨름·엿치기_261123.html','w',encoding='utf-8').write(t)
# 새 혼자 놀이 셋 (261123): 제기차기 · 공기놀이 · 무궁화 꽃이 피었습니다
t=open('t052.html',encoding='utf-8').read().replace('__PRE__',pre).replace('__PEN__',pen).replace('__SND__',snd).replace('__NAV__',nav).replace('__EMIT__',emit)
open('그때그놀이-052_제기차기·공기놀이·무궁화꽃_261123.html','w',encoding='utf-8').write(t)
# 윷놀이 (261123 시안 · 둘이서 겨루기)
t=open('t057.html',encoding='utf-8').read().replace('__PRE__',pre).replace('__PEN__',pen).replace('__SND__',snd).replace('__NAV__',nav).replace('__EMIT__',emit)
open('그때그놀이-057_윷놀이_261123.html','w',encoding='utf-8').write(t)
# 번데기 돌림판 (261124 시안 · 혼자서 바로)
t=open('t060.html',encoding='utf-8').read().replace('__PRE__',pre).replace('__PEN__',pen).replace('__SND__',snd).replace('__NAV__',nav).replace('__EMIT__',emit)
open('그때그놀이-060_번데기돌림판_261124.html','w',encoding='utf-8').write(t)
pat=re.compile(r"/\* 그때 그 놀이 · 아래 막대.*?\n\};\n",re.S)
for f in ['그때그놀이-013_동그란딱지시험판_261121.html','그때그놀이-015_오목·알까기시험판_261121.html']:
    s=open(f,encoding='utf-8').read(); n=len(pat.findall(s)); assert n==1,(f,n)
    s=pat.sub(lambda m:nav if nav.endswith('\n') else nav+'\n',s); open(f,'w',encoding='utf-8').write(s)
subprocess.run(['python3','build017.py'],check=True)
print('ok')
