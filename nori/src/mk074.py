# 박 터뜨리기(오재미) 틀 t074.html 만들기 — t071(운동회 달리기) 틀에서 놀이 줄기만 bak_logic.js 로 바꿈 (261125)
s=open('t071.html',encoding='utf-8').read()
a=s.index('/* 운동회 달리기 — 흙 운동장'); b=s.index('.hsheet{')
css=r'''/* 박 터뜨리기 — 하늘 · 흙 운동장 · 장대 끝 박 · 오재미 · 만국기는 옅은 색 · 빨간 빛살 · 빨간 원 금지 · 테두리 · 음영 없음 */
.board.bak{background:linear-gradient(#EEF3F8 0 74%,#E4CFA6 74% 100%)}
.rnflag{position:absolute;left:0;right:0;top:0;height:22px;z-index:1;pointer-events:none}
.rnflag svg{width:100%;height:100%;display:block}
.bkp{position:absolute;width:6px;margin-left:-3px;background:#9C7A4E;border-radius:3px;z-index:1}
.bkb{position:absolute;z-index:3;width:68px;height:68px;margin:-34px 0 0 -34px}
.bkb svg{display:block;overflow:visible;transform-origin:50% 50%}
.bkb .cr{opacity:0;transition:opacity .15s}
.bkb.hit>div{animation:bkwob .35s ease}
.bkb>div{width:100%;height:100%}
@keyframes bkwob{0%,100%{transform:none}30%{transform:rotate(-9deg)}65%{transform:rotate(6deg)}}
.bkb .hl,.bkb .hr{transition:transform .7s cubic-bezier(.3,1.4,.5,1)}
.bkb.open .cr{opacity:0!important}
.bkb.open .hl{transform:translate(-12px,8px) rotate(-38deg)}.bkb.open .hr{transform:translate(12px,8px) rotate(38deg)}
.bkban{position:absolute;z-index:6;transform:translateX(-50%) scaleY(0);transform-origin:top;transition:transform .6s ease .15s;background:#fff;color:#1C1D21;font-weight:900;font-size:15px;padding:10px 6px;border-radius:4px;writing-mode:vertical-rl;letter-spacing:.12em;white-space:nowrap}
.bkban.on{transform:translateX(-50%) scaleY(1)}
.bkban.a{color:#2F64E0}.bkban.b{color:#6B5A42}
.bkcf{position:absolute;z-index:4;width:7px;height:10px;border-radius:2px;pointer-events:none;animation:bkcf 1.6s ease-in forwards}
@keyframes bkcf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(540deg)}}
.bkbag{position:absolute;left:0;top:0;z-index:5;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:4px;pointer-events:none;will-change:transform}
.bkbag.a{background:#2F64E0}.bkbag.b{background:#8C7B5C}
.bkpile{position:absolute;z-index:2;display:flex;gap:3px;transform:translateX(-50%)}
.bkpile i{display:block;width:11px;height:11px;border-radius:3px}
.bkpile.a i{background:#2F64E0}.bkpile.b i{background:#8C7B5C}
.bklab{position:absolute;z-index:2;font-size:11.5px;font-weight:900;padding:2px 8px;border-radius:999px;color:#fff;white-space:nowrap;transform:translateX(-50%)}
.bklab.a{background:var(--blu)}.bklab.b{background:#8C7B5C}
.bkhits{position:absolute;z-index:3;display:flex;gap:4px;transform:translateX(-50%)}
.bkhits i{display:block;width:9px;height:9px;border-radius:2px;background:rgba(28,29,33,.14)}
.bkhits.gone{visibility:hidden}.bkhits.a i.on{background:var(--blu)}.bkhits.b i.on{background:#8C7B5C}
.bkpop{position:absolute;z-index:6;font-weight:900;font-size:14px;transform:translate(-50%,-50%);pointer-events:none;animation:bkpop .7s ease forwards;white-space:nowrap}
@keyframes bkpop{0%{opacity:0;transform:translate(-50%,-30%)}25%{opacity:1}100%{opacity:0;transform:translate(-50%,-140%)}}
.throw{display:grid;grid-template-columns:1fr;gap:8px}
.throw.two{grid-template-columns:1fr 1fr}
.throw button{font:inherit;border:0;border-radius:16px;min-height:64px;font-weight:900;font-size:17px;color:#fff;background:var(--blu);cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;line-height:1.15}
.throw button small{font-size:11.5px;font-weight:800;opacity:.9}
.throw button.b{background:#8C7B5C}
.throw button.hold{filter:brightness(.85)}
.throw button:disabled{background:var(--chip);color:var(--sub)}
'''
s=s[:a]+css+s[b:]
s=s.replace('그때그놀이-071 · 운동회 달리기 청군 백군 (261125 시안) · t060 틀 그대로','그때그놀이-074 · 박 터뜨리기(오재미) 청군 백군 (261125 시안) · t071 틀 그대로')
s=s.replace('<title>운동회 달리기 · 그때 그 놀이</title>','<title>박 터뜨리기 · 그때 그 놀이</title>').replace('id="ttl">운동회 달리기<','id="ttl">박 터뜨리기<')
a=s.index("var S={k:'run'"); b=s.index("function vs(on)")
s=s[:a]+r'''var S={k:'bak',mode:'cpu1',bet:NA.bet(),gen:0,sc:[0,0],over:true,u:'번'};
function two(){ return S.mode==='two'; }
function nm(p){ return p===0?'나':(two()?'친구':shopName()+' 사장님'); }
function snd(k,v){ try{ SND[k](v); }catch(e){} }
var GN={bak:'박 터뜨리기'}, MID={bak:'박을 여섯 번 맞혀 먼저 터뜨리는 쪽이 이김'}, CODE={bak:'bk'};
var RULE={bak:['아래 <b>던지기</b> 단추를 <b>누르고 있으면</b> 옆 기둥의 힘이 오르내려요.','힘이 <b>초록 칸</b>에 왔을 때 손을 <b>떼면</b> 오재미가 박에 맞아요.','모자라면 박 아래로, 넘치면 박 위로 지나가요.','박을 <b>여섯 번</b> 맞히면 쩍! <b>먼저 터뜨리는 쪽</b>이 이겨요. 둘이 한꺼번에 던지는 겨루기예요.','나는 <b>청군</b> · 상대는 <b>백군</b>. 친구와 할 때는 왼쪽 단추가 나 · 오른쪽 단추가 친구예요.']};
function rules(k){ return '<ol>'+RULE[k].map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol>'; }
'''+s[b:]
a=s.index('/* ───────── 운동회 달리기'); b=s.index('/* ───────── 고르기 · 시작')
s=s[:a]+open('bak_logic.js',encoding='utf-8').read()+s[b:]
s=s.replace("$('board').classList.remove('run');","$('board').classList.remove('bak');").replace('runStart();','bkStart();').replace("setGame('run');","setGame('bak');")
assert 'runStart' not in s and 'Rn.' not in s, 'run 줄기 남음'
open('t074.html','w',encoding='utf-8').write(s)
print('t074.html', len(s))
