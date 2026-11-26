# 블록 맞추기 틀 t094.html 만들기 — t071(운동회 달리기) 틀에서 놀이 줄기만 block_logic.js 로 바꿈 (261126 · mk093 과 같은 꼴)
s=open('t071.html',encoding='utf-8').read()
a=s.index('/* 운동회 달리기 — 흙 운동장'); b=s.index('.feet{')
css=r'''/* 블록 맞추기 — 밝은 바탕 · 8×8 칸 · 조각 다섯 색 · 빨간 원 · 빛살 · 테두리 · 음영 없음 */
.board.blk{background:#EEF2F8;overflow:hidden}
.bmclk{position:absolute;left:8px;top:6px;z-index:3;padding:2px 10px;border-radius:999px;background:rgba(255,255,255,.85);font-weight:900;font-size:13px;font-variant-numeric:tabular-nums;color:var(--ink)}
.bmc{position:absolute;border-radius:4px;background:#fff;z-index:1;transition:background .12s}
.bmc.pv{background:#CFE0FF}.bmc.bad{background:#EFE6D6}
.bmc.pop{animation:bmpop .35s ease}@keyframes bmpop{0%{background:#FFE08A;transform:scale(1.08)}100%{background:#fff;transform:none}}
.bmp,.bmghost{position:absolute;z-index:2;touch-action:none;cursor:grab}.bmp i,.bmghost i{position:absolute;border-radius:4px}
.bmp.sel{outline:0;filter:brightness(1.12);transform:translateY(-4px)}
.bmghost{left:0;top:0;z-index:5;pointer-events:none;opacity:0}.bmghost.on{opacity:.92}
.bmnote{display:flex;align-items:center;justify-content:center;text-align:center;min-height:52px;padding:0 14px;border-radius:16px;background:#F6F1E6;color:#7A6E55;font-weight:800;font-size:14px}.bmnote.b{background:#EFE8DA}
'''
s=s[:a]+css+s[b:]
s=s.replace('그때그놀이-071 · 운동회 달리기 청군 백군 (261125 시안) · t060 틀 그대로','그때그놀이-094 · 블록 맞추기 (261126 시안) · t071 틀 그대로')
s=s.replace('<title>운동회 달리기 · 그때 그 놀이</title>','<title>블록 맞추기 · 그때 그 놀이</title>').replace('id="ttl">운동회 달리기<','id="ttl">블록 맞추기<')
a=s.index("var S={k:'run'"); b=s.index("function vs(on)")
s=s[:a]+r'''var S={k:'blk',mode:'cpu1',bet:NA.bet(),gen:0,sc:[0,0],over:true,u:'점'};
function two(){ return S.mode==='two'; }
function nm(p){ return p===0?'나':(two()?'친구':shopName()+' 사장님'); }
function snd(k,v){ try{ SND[k](v); }catch(e){} }
var GN={blk:'블록 맞추기'}, MID={blk:'1분 · 점수 높은 쪽이 이김'}, CODE={blk:'bm'};
var RULE={blk:['아래 <b>조각 셋</b> 가운데 하나를 손가락으로 <b>끌어</b> 판에 놓아요. (조각을 톡 → 놓을 자리를 톡 해도 돼요)','가로든 세로든 <b>한 줄이 꽉 차면</b> 지워져요. 한 줄에 10점 · 한 번에 두 줄 넘게 지우면 두 배.','놓은 칸 하나에 1점. 조각 셋을 다 놓으면 새 조각 셋이 나와요.','<b>1분</b>이 되거나 <b>놓을 자리가 없으면</b> 차례 끝.','나 먼저 · 다음 상대. <b>점수가 높은</b> 쪽이 이겨요.','친구와 할 때는 내 차례가 끝나면 폰을 친구에게 넘겨요.']};
function rules(k){ return '<ol>'+RULE[k].map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; }
'''+s[b:]
a=s.index('/* ───────── 운동회 달리기'); b=s.index('/* ───────── 고르기 · 시작')
s=s[:a]+open('block_logic.js',encoding='utf-8').read()+s[b:]
s=s.replace("$('board').classList.remove('run');","$('board').classList.remove('blk');").replace('runStart();','bmStart();').replace("setGame('run');","setGame('blk');")
assert 'runStart' not in s and 'Rn.' not in s and 'rnr' not in s.split('</style>')[1], 'run 줄기 남음'
open('t094.html','w',encoding='utf-8').write(s)
print('t094.html', len(s))
