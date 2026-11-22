/* 그때 그 놀이 · 소리 묶음 v1 (261121) — 녹음 파일 없이 폰에서 바로 만들어 내는 소리(저작권 걱정 없음).
   stone 바둑돌 「탁」 · clack 알끼리 「딱」 · flick 손가락 튕김 · fall 판 밖으로 · slap 딱지 「팍」 · flip 딱지 뒤집힘
   glass 유리구슬 「팅」 · pong 투호 「퐁」 · dart 다트 「툭」 · putt 퍼팅 「톡」 · cup 컵 「딸그락」 · ding 컵 「땡그랑」 · thud 턱 「퉁」 · bow 활시위 · target 과녁 「딱」 · miss 빗나감 · win 이김 · lose 짐. 첫 손대기 뒤에 소리가 납니다(폰 규칙). */
var SND=(function(){
  var ctx=null, master=null, nb=null, on=true, lastT=0;
  try{ on=localStorage.getItem('nori-snd')!=='0'; }catch(e){}
  function ac(){
    if(!on){ return null; }
    if(!ctx){ var A=window.AudioContext||window.webkitAudioContext; if(!A){ return null; }
      ctx=new A(); master=ctx.createGain(); master.gain.value=.85; master.connect(ctx.destination);
      nb=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate); var d=nb.getChannelData(0); for(var i=0;i<d.length;i++){ d[i]=Math.random()*2-1; } }
    if(ctx.state==='suspended'){ ctx.resume(); }
    return ctx;
  }
  function env(g,t,peak,dur,att){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),t+(att||.002)); g.gain.exponentialRampToValueAtTime(.0001,t+dur); }
  function burst(t,dur,f,q,peak,type,f2){
    var s=ctx.createBufferSource(), b=ctx.createBiquadFilter(), g=ctx.createGain();
    s.buffer=nb; b.type=type||'bandpass'; b.frequency.setValueAtTime(f,t); if(f2){ b.frequency.exponentialRampToValueAtTime(f2,t+dur); } b.Q.value=q;
    env(g,t,peak,dur); s.connect(b); b.connect(g); g.connect(master); s.start(t,Math.random()*.5); s.stop(t+dur+.02);
  }
  function tone(t,f,dur,peak,type,f2,att){
    var o=ctx.createOscillator(), g=ctx.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f,t);
    if(f2){ o.frequency.exponentialRampToValueAtTime(f2,t+dur); }
    env(g,t,peak,dur,att); o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+.02);
  }
  function go(fn){ return function(v){ if(!ac()){ return; } var t=ctx.currentTime+.005; fn(t, v===undefined?1:Math.max(.15,Math.min(1,v))); }; }
  var S={
    /* 좋은 비자나무 판에 바둑돌 — 높고 맑은 「탁」 + 판 울림 */
    stone:go(function(t,v){ burst(t,.045,3400,1.4,.9*v); tone(t,1180,.11,.32*v,'sine'); tone(t,2360,.05,.12*v,'triangle'); burst(t,.07,380,.7,.28*v,'lowpass'); }),
    /* 알끼리 부딪힘 — 짧고 단단한 「딱」 */
    clack:go(function(t,v){ tone(t,3700,.035,.38*v,'triangle'); tone(t,5300,.022,.18*v,'sine'); burst(t,.025,4600,3,.35*v); }),
    /* 손가락으로 알 튕기기 */
    flick:go(function(t,v){ burst(t,.03,2200,2,.45*v); tone(t,1700,.025,.12*v,'triangle'); }),
    /* 판 밖으로 떨어짐 — 툭 */
    fall:go(function(t,v){ tone(t,240,.2,.35*v,'sine',110); burst(t,.12,320,.6,.25*v,'lowpass'); }),
    /* 딱지 내리치기 — 종이 「팍」 */
    slap:go(function(t,v){ burst(t,.13,1700,.6,.95*v,'lowpass'); burst(t,.05,950,1.5,.5*v); tone(t,150,.09,.4*v,'sine',90); }),
    /* 딱지 뒤집힘 — 휙 */
    flip:go(function(t,v){ burst(t,.16,600,1.2,.22*v,'bandpass',2400); }),
    /* 유리구슬 — 맑은 「팅」 */
    glass:go(function(t,v){ tone(t,2900,.45,.18*v,'sine'); tone(t,4370,.28,.1*v,'sine'); tone(t,6650,.16,.06*v,'sine'); burst(t,.02,7000,2,.2*v); }),
    /* 투호 화살이 놋쇠 병에 쏙 — 퐁 */
    pong:go(function(t,v){ tone(t,640,.28,.3*v,'sine',430); tone(t,1290,.14,.1*v,'sine'); tone(t,1870,.6,.045*v,'sine'); burst(t,.03,1500,2,.22*v); }),
    /* 다트가 나무 원판에 꽂힘 — 툭 */
    dart:go(function(t,v){ burst(t,.04,1300,1,.6*v); tone(t,230,.11,.38*v,'sine',140); }),
    /* 퍼터로 공 치기 — 톡 */
    putt:go(function(t,v){ tone(t,1450,.05,.3*v,'triangle'); burst(t,.03,2600,2,.3*v); tone(t,420,.06,.15*v,'sine'); }),
    /* 공이 컵에 쏙 — 딸그락 */
    cup:go(function(t,v){ [0,.07,.12,.16].forEach(function(d,i){ tone(t+d,950-i*60,.06,.22*v*(1-i*.18),'triangle'); burst(t+d,.03,2200,2,.18*v*(1-i*.2)); }); }),
    /* 나무 턱에 부딪힘 — 퉁 */
    thud:go(function(t,v){ tone(t,180,.12,.35*v,'sine',110); burst(t,.05,700,1,.3*v); }),
    /* 활시위 — 팅 (줄 떨림) */
    bow:go(function(t,v){ tone(t,150,.35,.35*v,'triangle',110); tone(t,300,.18,.12*v,'sawtooth',220); burst(t,.08,1800,1.5,.25*v,'bandpass',600); }),
    /* 화살이 과녁에 — 딱 */
    target:go(function(t,v){ burst(t,.05,1100,1.2,.7*v); tone(t,320,.14,.35*v,'sine',220); tone(t,880,.06,.12*v,'triangle'); }),
    /* 화살 빗나감 — 쉭 */
    miss:go(function(t,v){ burst(t,.28,3000,.8,.18*v,'bandpass',900); }),
    /* 골프 컵에 쏙 — 쇠 컵 「땡그랑」 (맑게 울리고 작게 튕김) */
    ding:go(function(t,v){ tone(t,2093,.55,.26*v,'sine'); tone(t,3140,.38,.14*v,'sine'); tone(t,4710,.22,.08*v,'sine'); tone(t,1046,.3,.08*v,'triangle'); burst(t,.015,6000,2,.25*v); }),
    win:go(function(t,v){ [784,880,1047,1175,1568].forEach(function(f,i){ tone(t+i*.09,f,.22,.2*v,'triangle'); }); }),
    lose:go(function(t,v){ tone(t,392,.22,.2*v,'triangle'); tone(t+.2,330,.35,.2*v,'triangle',300); })
  };
  /* 부딪힘처럼 한꺼번에 많이 나는 소리는 잠깐 사이를 둠 */
  S.clackT=function(v){ var n=Date.now(); if(n-lastT<35){ return; } lastT=n; S.clack(v); };
  S.isOn=function(){ return on; };
  S.set=function(v){ on=!!v; try{ localStorage.setItem('nori-snd',on?'1':'0'); }catch(e){} if(on){ ac(); } };
  /* 위 막대 오른쪽 소리 단추 */
  S.button=function(parent){
    var b=document.createElement('button'); b.type='button'; b.className='snd';
    function paint(){ b.setAttribute('aria-label',on?'소리 끄기':'소리 켜기'); b.setAttribute('aria-pressed',on?'true':'false');
      b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>'
        +(on?'<path d="M16 8.5c1.3 1 2 2.2 2 3.5s-.7 2.5-2 3.5M18.5 6c2 1.6 3 3.6 3 6s-1 4.4-3 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'
            :'<path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')+'</svg>'; }
    b.addEventListener('click',function(){ S.set(!on); paint(); if(on){ S.stone(.8); } });
    paint(); parent.appendChild(b);
    document.addEventListener('pointerdown',function(){ if(on){ ac(); } },{once:true});
    return b;
  };
  return S;
})();
