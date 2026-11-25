# 고무줄놀이 틀 t076.html 만들기 — t071(운동회 달리기) 틀에서 놀이 줄기만 gomu_logic.js 로 바꿈 (261125)
s=open('t071.html',encoding='utf-8').read()
a=s.index('/* 운동회 달리기 — 흙 운동장'); b=s.index('.hsheet{')
css=r'''/* 고무줄놀이 — 흙 운동장 · 줄 잡은 두 아이 · 노란 고무줄 · 위 박자 줄(리듬 게임 꼴) · 빨간 원 · 빛살 · 테두리 · 음영 없음 */
.board.gomu{background:linear-gradient(#F4EFE4 0 80%,#E4CFA6 80% 100%)}
.gmlane{position:absolute;left:8px;right:8px;top:8px;height:28px;border-radius:14px;background:rgba(28,29,33,.07);overflow:hidden;z-index:3}
.gmt{position:absolute;top:3px;bottom:3px;width:4px;margin-left:-2px;border-radius:2px;background:#1C1D21}
.gmn{position:absolute;left:0;top:6px;width:16px;height:16px;border-radius:5px;background:#2F64E0;will-change:transform}
.gmn.b{background:#8C7B5C}.gmn.hit{opacity:0;transition:opacity .2s}.gmn.off{opacity:.25}
.gmcnt{position:absolute;left:50%;top:44px;transform:translateX(-50%);z-index:4;font-weight:900;font-size:22px;color:#7A6E55;opacity:0}
.gmcnt.on{animation:gmc .5s ease}@keyframes gmc{0%{opacity:0;transform:translate(-50%,6px)}30%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
.gmmk{position:absolute;right:8px;z-index:2;font-size:10.5px;font-weight:800;color:#A8996F}
.gmgr{position:absolute;left:0;right:0;height:2px;background:rgba(140,123,92,.35);z-index:1}
.gmh,.gmj{position:absolute;z-index:2}.gmj{z-index:3}
.gmh svg,.gmj svg{width:100%;height:100%;display:block;overflow:visible}
.gmj.hop svg{animation:gmhop .32s ease-out}@keyframes gmhop{0%,100%{transform:none}45%{transform:translateY(-34%)}}
.gmj.trip svg{animation:gmtrip .6s ease forwards}@keyframes gmtrip{0%{transform:none}40%{transform:rotate(-18deg) translateY(4%)}100%{transform:rotate(-8deg) translateY(3%)}}
.gmrope{position:absolute;left:0;top:0;z-index:4;pointer-events:none;overflow:visible}
.gmgo{min-height:64px!important;font-size:20px!important;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1}.gmgo small{font-size:11.5px;font-weight:800;opacity:.9}.gmgo.b{background:#8C7B5C}.gmgo.b:disabled{background:var(--chip)}
'''
s=s[:a]+css+s[b:]
s=s.replace('그때그놀이-071 · 운동회 달리기 청군 백군 (261125 시안) · t060 틀 그대로','그때그놀이-076 · 고무줄놀이 (261125 시안) · t071 틀 그대로')
s=s.replace('<title>운동회 달리기 · 그때 그 놀이</title>','<title>고무줄놀이 · 그때 그 놀이</title>').replace('id="ttl">운동회 달리기<','id="ttl">고무줄놀이<')
a=s.index("var S={k:'run'"); b=s.index("function vs(on)")
s=s[:a]+r'''var S={k:'gomu',mode:'cpu1',bet:NA.bet(),gen:0,sc:[0,0],over:true,u:'단'};
function two(){ return S.mode==='two'; }
function nm(p){ return p===0?'나':(two()?'친구':shopName()+' 사장님'); }
function snd(k,v){ try{ SND[k](v); }catch(e){} }
var GN={gomu:'고무줄놀이'}, MID={gomu:'번갈아 한 번씩 · 더 높이 넘는 쪽이 이김'}, CODE={gomu:'gm'};
var RULE={gomu:['위 박자 줄에서 네모가 흘러와 <b>세로선에 닿을 때</b> 「뛰기!」를 눌러요.','한 단에 <b>여덟 박</b>을 다 맞히면 줄이 올라가요 · 발목 → 무릎 → 허벅지 → 허리 → 가슴 → 머리.','단이 오를수록 <b>빨라져요</b>. 박을 놓치거나 먼저 누르면 「걸렸다!」 · 차례가 끝나요.','나 먼저 · 다음 상대. <b>더 높이</b> 넘은 쪽이 이겨요(같은 단이면 더 많은 박).','친구와 할 때는 내 차례가 끝나면 폰을 친구에게 넘겨요.']};
function rules(k){ return '<ol>'+RULE[k].map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; }
'''+s[b:]
a=s.index('/* ───────── 운동회 달리기'); b=s.index('/* ───────── 고르기 · 시작')
s=s[:a]+open('gomu_logic.js',encoding='utf-8').read()+s[b:]
s=s.replace("$('board').classList.remove('run');","$('board').classList.remove('gomu');").replace('runStart();','gmStart();').replace("setGame('run');","setGame('gomu');")
assert 'runStart' not in s and 'Rn.' not in s, 'run 줄기 남음'
open('t076.html','w',encoding='utf-8').write(s)
print('t076.html', len(s))
