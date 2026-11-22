import sys
U=sys.argv[1] if len(sys.argv)>1 else 'https://claude.ai/artifact/PENDING'
import os
U24=open('u24.txt').read().strip() if os.path.exists('u24.txt') else 'https://claude.ai/artifact/PENDING'
nav=open('nav.js',encoding='utf-8').read().replace('__U22__',U).replace('__U24__',U24)
emit=open('emit.js',encoding='utf-8').read(); snd=open('sound.js',encoding='utf-8').read().strip()
t=open('t022.html',encoding='utf-8').read().replace('__SND__',snd).replace('__NAV__',nav).replace('__EMIT__',emit).replace('__G4__',open('g4.js',encoding='utf-8').read())
open('그때그놀이-022_딱지치기·투호·구슬치기·원판다트_261121.html','w',encoding='utf-8').write(t)
