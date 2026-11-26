# 벽돌깨기 틀 t093.html 만들기 — t071(운동회 달리기) 틀에서 놀이 줄기만 brick_logic.js 로 바꿈 (261126 · mk081 과 같은 꼴)
s=open('t071.html',encoding='utf-8').read()
a=s.index('/* 운동회 달리기 — 흙 운동장'); b=s.index('.feet{')
css=r'''/* 벽돌깨기 — 밝은 바탕 · 다섯 줄 벽돌(파랑 · 노랑 · 초록 · 하늘 · 흙색) · 빨간 원 · 빛살 · 테두리 · 음영 없음 */
.board.brick{background:#EEF2F8;overflow:hidden}
.bcclk{position:absolute;left:8px;top:6px;z-index:3;padding:2px 10px;border-radius:999px;background:rgba(255,255,255,.85);font-weight:900;font-size:13px;font-variant-numeric:tabular-nums;color:var(--ink)}
.bclife{position:absolute;right:10px;top:10px;z-index:3;display:flex;gap:5px}.bclife i{width:11px;height:11px;border-radius:50%;background:rgba(28,29,33,.14)}.bclife i.on{background:#1C1D21}
.bcb{position:absolute;border-radius:5px;z-index:1;transition:opacity .18s,transform .18s}.bcb.hit{opacity:0;transform:scale(.6)}
.bcpad{position:absolute;left:0;top:0;border-radius:999px;background:var(--blu);z-index:2;will-change:transform}.bcpad.b{background:#8C7B5C}
.bcpad.bump{animation:bcbump .14s ease-out}@keyframes bcbump{50%{filter:brightness(1.15)}}
.bcball{position:absolute;left:0;top:0;border-radius:50%;background:#1C1D21;z-index:3;will-change:transform}
.bcmsg{position:absolute;left:50%;bottom:44px;transform:translateX(-50%);z-index:4;font-weight:900;font-size:14px;color:#7A6E55;white-space:nowrap;opacity:0;transition:opacity .2s}.bcmsg.on{opacity:1}
.bcstrip{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:64px;padding:0 18px;border-radius:16px;background:var(--blu);color:#fff;font-weight:900;font-size:16px;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab}
.bcstrip b{display:flex;flex-direction:column;align-items:center;line-height:1.15}.bcstrip b small{font-size:11px;font-weight:800;opacity:.9}.bcstrip span{font-size:18px;opacity:.85}
.bcstrip.b{background:#8C7B5C}.bcstrip.off{background:var(--chip);color:var(--sub)}
'''
s=s[:a]+css+s[b:]
s=s.replace('그때그놀이-071 · 운동회 달리기 청군 백군 (261125 시안) · t060 틀 그대로','그때그놀이-093 · 벽돌깨기 (261126 시안) · t071 틀 그대로')
s=s.replace('<title>운동회 달리기 · 그때 그 놀이</title>','<title>벽돌깨기 · 그때 그 놀이</title>').replace('id="ttl">운동회 달리기<','id="ttl">벽돌깨기<')
a=s.index("var S={k:'run'"); b=s.index("function vs(on)")
s=s[:a]+r'''var S={k:'brick',mode:'cpu1',bet:NA.bet(),gen:0,sc:[0,0],over:true,u:'개'};
function two(){ return S.mode==='two'; }
function nm(p){ return p===0?'나':(two()?'친구':shopName()+' 사장님'); }
function snd(k,v){ try{ SND[k](v); }catch(e){} }
var GN={brick:'벽돌깨기'}, MID={brick:'공 세 개 · 1분 · 더 많이 깬 쪽이 이김'}, CODE={brick:'bc'};
var RULE={brick:['아래 <b>파란 띠</b>(또는 놀이판)를 손가락으로 <b>좌우로 끌면</b> 받침대가 따라와요.','톡 누르면 공이 나가요. 공이 벽에 튕기며 위 <b>벽돌</b>을 깨요.','받침대 <b>가장자리</b>에 맞으면 공이 비스듬히 · <b>가운데</b>에 맞으면 곧게 올라가요.','공을 놓치면 하나 줄어요. <b>공 세 개</b>를 다 놓치거나 <b>1분</b>이 되면 차례 끝.','나 먼저 · 다음 상대. 벽돌을 <b>더 많이</b> 깬 쪽이 이겨요(다 깨면 남은 초가 덤).','친구와 할 때는 내 차례가 끝나면 폰을 친구에게 넘겨요.']};
function rules(k){ return '<ol>'+RULE[k].map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; }
'''+s[b:]
a=s.index('/* ───────── 운동회 달리기'); b=s.index('/* ───────── 고르기 · 시작')
s=s[:a]+open('brick_logic.js',encoding='utf-8').read()+s[b:]
s=s.replace("$('board').classList.remove('run');","$('board').classList.remove('brick');").replace('runStart();','bcStart();').replace("setGame('run');","setGame('brick');")
assert 'runStart' not in s and 'Rn.' not in s and 'rnr' not in s.split('</style>')[1], 'run 줄기 남음'
open('t093.html','w',encoding='utf-8').write(s)
print('t093.html', len(s))
