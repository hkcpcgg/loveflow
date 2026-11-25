# 공 굴리기 틀 t081.html 만들기 — t071(운동회 달리기) 틀에서 놀이 줄기만 ball_logic.js 로 바꿈 (261125 · mk080 과 같은 꼴)
s=open('t071.html',encoding='utf-8').read()
a=s.index('/* 운동회 달리기 — 흙 운동장'); b=s.index('.feet{')
css=r'''/* 공 굴리기 — 흙 운동장 · 흰 줄 · 청군 파란 공 · 백군 흰 공 · 뒤에서 미는 아이 · 빨간 원 · 빛살 · 테두리 · 음영 없음 */
.board.ball{background:#E4CFA6;overflow:hidden}
.blclk{position:absolute;left:50%;top:4px;transform:translateX(-50%);z-index:3;padding:2px 12px;border-radius:999px;background:rgba(255,255,255,.75);font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;color:var(--ink)}
.blv{position:absolute;width:3px;background:rgba(255,255,255,.9);z-index:1}
.blfin{position:absolute;height:6px;z-index:1;background:repeating-linear-gradient(90deg,#fff 0 10px,#3B3229 10px 20px)}
.blt{position:absolute;height:2px;background:rgba(255,255,255,.45);z-index:1}.blt.st{height:3px;background:rgba(255,255,255,.9)}
.blm{position:absolute;z-index:1;font-size:11px;font-weight:900;color:#fff;transform:translateX(-50%);white-space:nowrap}.blm.s{transform:none;font-size:10.5px;color:rgba(255,255,255,.95)}
.bllab{position:absolute;z-index:2;transform:translateX(-50%);font-size:11.5px;font-weight:900;padding:2px 8px;border-radius:999px;color:#fff;white-space:nowrap}
.bllab.a{background:var(--blu)}.bllab.b{background:#8C7B5C}
.blb,.blk{position:absolute;left:0;top:0;will-change:transform}.blb{z-index:4}.blk{z-index:3}
.blb svg,.blk svg{width:100%;height:100%;display:block;overflow:visible}
.blb.out svg{animation:blout .9s ease}@keyframes blout{0%,100%{opacity:1}25%,75%{opacity:.35}50%{opacity:.8}}
.blk.push svg{animation:blpush .18s ease-out}@keyframes blpush{0%,100%{transform:none}45%{transform:translateY(-12%)}}
.blb.won svg{animation:blhop .5s ease 2}@keyframes blhop{0%,100%{transform:none}50%{transform:translateY(-8px)}}
'''
s=s[:a]+css+s[b:]
s=s.replace('그때그놀이-071 · 운동회 달리기 청군 백군 (261125 시안) · t060 틀 그대로','그때그놀이-081 · 공 굴리기 운동회 큰 공 (261125 시안) · t071 틀 그대로')
s=s.replace('<title>운동회 달리기 · 그때 그 놀이</title>','<title>공 굴리기 · 그때 그 놀이</title>').replace('id="ttl">운동회 달리기<','id="ttl">공 굴리기<')
a=s.index("var S={k:'run'"); b=s.index("function vs(on)")
s=s[:a]+r'''var S={k:'ball',mode:'cpu1',bet:NA.bet(),gen:0,sc:[0,0],over:true,u:'m'};
function two(){ return S.mode==='two'; }
function nm(p){ return p===0?'나':(two()?'친구':shopName()+' 사장님'); }
function snd(k,v){ try{ SND[k](v); }catch(e){} }
var GN={ball:'공 굴리기'}, MID={ball:'30m 한 번 · 먼저 결승선에 닿는 쪽이 이김'}, CODE={ball:'gl'};
var RULE={ball:['「탕!」 소리가 나면 아래 <b>◀</b> · <b>▶</b> 단추로 큰 공을 밀어요. 가운데서 밀면 한 번에 1m 앞으로.','운동장이 울퉁불퉁해 공이 저절로 옆으로 쏠려요. <b>◀ 는 왼쪽 · ▶ 는 오른쪽</b>으로 밀며 나가요.','공이 쏠린 <b>반대쪽</b>을 눌러 가운데로 붙잡아 두세요. 공이 한쪽으로 쏠릴수록 덜 나가고, 줄 밖으로 나가면 잠깐 멈춰요.','「탕!」 전에 누르면 <b>부정 출발</b> · 처음부터 다시 서요.','나는 <b>청군</b>(파란 공) · 상대는 <b>백군</b>(흰 공). <b>먼저 결승선</b>에 닿는 쪽이 이겨요.','친구와 할 때는 폰을 가운데 두고, 나는 왼쪽 두 단추 · 친구는 오른쪽 두 단추를 함께 눌러요.']};
function rules(k){ return '<ol>'+RULE[k].map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; }
'''+s[b:]
a=s.index('/* ───────── 운동회 달리기'); b=s.index('/* ───────── 고르기 · 시작')
s=s[:a]+open('ball_logic.js',encoding='utf-8').read()+s[b:]
s=s.replace("$('board').classList.remove('run');","$('board').classList.remove('ball');").replace('runStart();','blStart();').replace("setGame('run');","setGame('ball');")
assert 'runStart' not in s and 'Rn.' not in s and 'rnr' not in s.split('</style>')[1], 'run 줄기 남음'
open('t081.html','w',encoding='utf-8').write(s)
print('t081.html', len(s))
