# 칠교놀이 틀 t095.html 만들기 — t071(운동회 달리기) 틀에서 놀이 줄기만 chil_logic.js 로 바꿈 (261126 · mk094 와 같은 꼴)
s=open('t071.html',encoding='utf-8').read()
a=s.index('/* 운동회 달리기 — 흙 운동장'); b=s.index('.feet{')
css=r'''/* 칠교놀이 — 밝은 바탕 · 그림자 모양은 옅은 흙색 · 조각 일곱 색 · 빨간 원 · 빛살 · 테두리 · 음영 없음 */
.board.chil{background:#EEF2F8;overflow:hidden}
.cgclk{position:absolute;left:8px;top:6px;z-index:3;padding:2px 10px;border-radius:999px;background:rgba(255,255,255,.85);font-weight:900;font-size:13px;font-variant-numeric:tabular-nums;color:var(--ink)}
.cgname{position:absolute;right:10px;top:8px;z-index:3;font-weight:900;font-size:13px;color:#7A6E55}
.cgsvg{position:absolute;left:0;top:0;z-index:1;touch-action:none}
.cgsh polygon{fill:#D9CFBB;stroke:#D9CFBB;stroke-width:1;stroke-linejoin:round}
.cgp{cursor:grab;stroke:rgba(255,255,255,.9);stroke-width:1.2;stroke-linejoin:round}.cgp.sel{stroke:#1C1D21;stroke-width:2}
.cgbtns{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.cgbtns button{font:inherit;border:0;border-radius:16px;min-height:52px;font-weight:900;font-size:15px;color:#fff;background:var(--blu);cursor:pointer;touch-action:manipulation}
.cgbtns button#cgHint{background:#F6F1E6;color:#7A6E55;font-size:13.5px}.cgbtns.b button{background:#8C7B5C}.cgbtns.b button#cgHint{background:#EFE8DA}.cgbtns button:disabled{background:var(--chip)!important;color:var(--sub)!important}
'''
s=s[:a]+css+s[b:]
s=s.replace('그때그놀이-071 · 운동회 달리기 청군 백군 (261125 시안) · t060 틀 그대로','그때그놀이-095 · 칠교놀이 (261126 시안) · t071 틀 그대로')
s=s.replace('<title>운동회 달리기 · 그때 그 놀이</title>','<title>칠교놀이 · 그때 그 놀이</title>').replace('id="ttl">운동회 달리기<','id="ttl">칠교놀이<')
a=s.index("var S={k:'run'"); b=s.index("function vs(on)")
s=s[:a]+r'''var S={k:'chil',mode:'cpu1',bet:NA.bet(),gen:0,sc:[0,0],over:true,u:'초'};
function two(){ return S.mode==='two'; }
function nm(p){ return p===0?'나':(two()?'친구':shopName()+' 사장님'); }
function snd(k,v){ try{ SND[k](v); }catch(e){} }
var GN={chil:'칠교놀이'}, MID={chil:'같은 모양 · 빨리 맞춘 쪽이 이김'}, CODE={chil:'cg'};
var RULE={chil:['위 <b>그림자 모양</b>을 일곱 조각으로 빈틈없이 채워요. 큰 세모 둘 · 가운데 세모 · 작은 세모 둘 · 네모 · 기운 네모.','조각을 <b>끌면</b> 칸에 착 붙어요. 조각을 <b>톡</b> 누르면 90도 돌아가요.','기운 네모는 「<b>뒤집기</b>」로 좌우를 바꿔요(먼저 조각을 톡 골라요).','막히면 「<b>도움</b>」 · 조각 하나를 제자리에 놓아 주고 15초를 더해요.','나 먼저 · 다음 상대가 <b>같은 모양</b>을 맞춰요. <b>더 빨리</b> 맞춘 쪽이 이겨요(3분 안에).','친구와 할 때는 내 차례가 끝나면 폰을 친구에게 넘겨요.']};
function rules(k){ return '<ol>'+RULE[k].map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; }
'''+s[b:]
a=s.index('/* ───────── 운동회 달리기'); b=s.index('/* ───────── 고르기 · 시작')
s=s[:a]+open('chil_logic.js',encoding='utf-8').read()+s[b:]
s=s.replace("$('board').classList.remove('run');","$('board').classList.remove('chil');").replace('runStart();','cgStart();').replace("setGame('run');","setGame('chil');")
assert 'runStart' not in s and 'Rn.' not in s and 'rnr' not in s.split('</style>')[1], 'run 줄기 남음'
open('t095.html','w',encoding='utf-8').write(s)
print('t095.html', len(s))
