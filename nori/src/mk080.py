# 굴렁쇠 틀 t080.html 만들기 — t071(운동회 달리기) 틀에서 놀이 줄기만 gul_logic.js 로 바꿈 (261125 · mk076 과 같은 꼴)
s=open('t071.html',encoding='utf-8').read()
a=s.index('/* 운동회 달리기 — 흙 운동장'); b=s.index('.hsheet{')
css=r'''/* 굴렁쇠 — 흙 골목 · 쇠 테 · 나무 채 · 위 속도 띠(초록 칸 · 바늘) · 10m 말뚝 · 빨간 원 · 빛살 · 테두리 · 음영 없음 */
.board.gul{background:linear-gradient(#F4EFE4 0 80%,#E4CFA6 80% 100%);overflow:hidden}
.grlane{position:absolute;left:8px;right:8px;top:8px;height:22px;border-radius:11px;background:rgba(28,29,33,.08);overflow:hidden;z-index:3}
.grok{position:absolute;top:0;bottom:0;background:rgba(46,158,79,.38)}
.grv{position:absolute;top:2px;bottom:2px;width:4px;margin-left:-2px;border-radius:2px;background:#1C1D21}.grv.out{background:#C8371F}
.grtag{position:absolute;right:12px;top:36px;z-index:3;font-weight:900;font-size:14px;color:#7A6E55;font-variant-numeric:tabular-nums}
.grcnt{position:absolute;left:50%;top:40px;transform:translateX(-50%);z-index:4;font-weight:900;font-size:22px;color:#7A6E55;opacity:0}
.grcnt.on{animation:grc .5s ease}@keyframes grc{0%{opacity:0;transform:translate(-50%,6px)}30%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
.grgr{position:absolute;left:0;right:0;height:2px;background:rgba(140,123,92,.35);z-index:1}
.grp{position:absolute;width:4px;height:38px;margin-left:-2px;border-radius:2px;background:#B9A57E;z-index:1}.grp.end{background:#1C1D21;height:46px;margin-top:-8px}
.grpn{position:absolute;transform:translateX(-50%);font-size:10.5px;font-weight:800;color:#A8996F;z-index:1;white-space:nowrap}
.grk{position:absolute;z-index:2}.grk svg{width:100%;height:100%;display:block;overflow:visible}
.grk.push svg{animation:grpush .22s ease-out}@keyframes grpush{0%,100%{transform:none}40%{transform:translateX(6%) rotate(4deg)}}
.grsv{position:absolute;left:0;top:0;z-index:3;pointer-events:none;overflow:visible}
.grgo{min-height:64px!important;font-size:20px!important;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1}.grgo small{font-size:11.5px;font-weight:800;opacity:.9}.grgo.b{background:#8C7B5C}.grgo.b:disabled{background:var(--chip)}
'''
s=s[:a]+css+s[b:]
s=s.replace('그때그놀이-071 · 운동회 달리기 청군 백군 (261125 시안) · t060 틀 그대로','그때그놀이-080 · 굴렁쇠 (261125 시안) · t071 틀 그대로')
s=s.replace('<title>운동회 달리기 · 그때 그 놀이</title>','<title>굴렁쇠 · 그때 그 놀이</title>').replace('id="ttl">운동회 달리기<','id="ttl">굴렁쇠<')
a=s.index("var S={k:'run'"); b=s.index("function vs(on)")
s=s[:a]+r'''var S={k:'gul',mode:'cpu1',bet:NA.bet(),gen:0,sc:[0,0],over:true,u:'m'};
function two(){ return S.mode==='two'; }
function nm(p){ return p===0?'나':(two()?'친구':shopName()+' 사장님'); }
function snd(k,v){ try{ SND[k](v); }catch(e){} }
var GN={gul:'굴렁쇠'}, MID={gul:'번갈아 한 번씩 · 더 멀리 굴린 쪽이 이김'}, CODE={gul:'gr'};
var RULE={gul:['「밀기!」를 누를 때마다 채로 굴렁쇠를 밀어요. 가만두면 점점 느려져요.','위 띠의 <b>바늘이 초록 칸 안</b>에 있게 밀어 주세요.','너무 느리면 <b>쓰러지고</b>, 너무 세게 밀면 <b>달아나요</b> · 차례가 끝나요.','골목 안으로 갈수록 초록 칸이 좁아져요. <b>60m 골목 끝</b>까지 가 보세요.','나 먼저 · 다음 상대. <b>더 멀리</b> 굴린 쪽이 이겨요(둘 다 끝까지 가면 더 빨리 간 쪽).','친구와 할 때는 내 차례가 끝나면 폰을 친구에게 넘겨요.']};
function rules(k){ return '<ol>'+RULE[k].map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; }
'''+s[b:]
a=s.index('/* ───────── 운동회 달리기'); b=s.index('/* ───────── 고르기 · 시작')
s=s[:a]+open('gul_logic.js',encoding='utf-8').read()+s[b:]
s=s.replace("$('board').classList.remove('run');","$('board').classList.remove('gul');").replace('runStart();','grStart();').replace("setGame('run');","setGame('gul');")
assert 'runStart' not in s and 'Rn.' not in s, 'run 줄기 남음'
open('t080.html','w',encoding='utf-8').write(s)
print('t080.html', len(s))
