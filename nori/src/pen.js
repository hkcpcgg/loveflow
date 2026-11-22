/* 그때 그 놀이 · 벌칙 모듈 (261122 v1 · 시안 v5.1 에서 떼어 냄) — 어느 놀이 끝에든 끼워 씀
   PEN.run(무대, 종류, {me:내가 때리나, victim:'맞는 사람 이름', side:'l'|'r'(때리는 쪽 기둥)}, 끝나면)
   종류: ttak 딱밤 3대 · kkul 꿀밤 3대 · indian 인디언밥 · (none 은 부르지 않음)
   딱밤 손은 보는 사람 왼쪽에서 이마로 · 꿀밤은 위에서 정수리로 · 인디언밥은 「인·디·언」 따다닥 → 「밥!」 두 손
   그림은 300×330 장면 하나에 그리고 무대 크기에 맞춰 줄임(작은 폰에서도 한 화면) · 테두리 · 음영 없음 */
window.PEN=(function(){
  var KIND={ttak:{n:3,name:'딱밤 3대'},kkul:{n:3,name:'꿀밤 3대'},indian:{n:3,name:'인디언밥'}}, live=0, lastSt=null;
  var css=document.createElement('style');
  css.textContent=':root{--pskin:#F6C99B;--pskin2:#E9AE7C;--phair:#2E2A26}'
   +'.pn-sc{position:absolute;left:0;top:0;width:300px;height:330px;transform-origin:0 0;pointer-events:none}'
   +'.pn-st{touch-action:none;user-select:none;-webkit-user-select:none}'
   +'.pn-hint{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);background:#FFF1C7;color:#6A4D00;border-radius:999px;padding:6px 12px;font:800 12.5px "Noto Sans KR",sans-serif;white-space:nowrap;pointer-events:none;z-index:6;max-width:94%;overflow:hidden;text-overflow:ellipsis}'
   +'.pn-hint.pulse{animation:pnPl 1s ease-in-out infinite}@keyframes pnPl{50%{transform:translateX(-50%) scale(1.06)}}'
   +'.pn-cnt{position:absolute;right:10px;top:10px;font:900 13px "Noto Sans KR",sans-serif;background:#F2EBDB;color:#7A6E55;border-radius:999px;padding:4px 10px;z-index:6}'
   +'.pn-bet{position:absolute;left:10px;top:10px;font:800 12px "Noto Sans KR",sans-serif;color:#7A6E55;z-index:6}'
   +'.pn-st.shake{animation:pnShake .36s ease}@keyframes pnShake{0%,100%{transform:translate(0,0)}15%{transform:translate(-9px,4px)}30%{transform:translate(8px,-5px)}45%{transform:translate(-6px,3px)}60%{transform:translate(5px,-2px)}80%{transform:translate(-2px,1px)}}'
   +'.pn-pow{position:absolute;left:50%;top:30%;font-family:"Black Han Sans",sans-serif;color:#1C1D21;opacity:0;pointer-events:none;white-space:nowrap;z-index:5}.pn-pow.go{animation:pnPow .75s ease forwards}'
   +'@keyframes pnPow{0%{opacity:0;transform:translate(-50%,-50%) scale(.4) rotate(-8deg)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.15) rotate(-4deg)}65%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-4deg)}100%{opacity:0;transform:translate(-50%,-62%) scale(1) rotate(-4deg)}}'
   +'.pn-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:4}.pn-flash.go{animation:pnFl .22s ease}@keyframes pnFl{0%{opacity:.85}100%{opacity:0}}'
   +'.pn-sc .face{position:absolute;left:65px;top:100px;width:170px;height:200px}'
   +'.pn-sc .face .hd{position:absolute;inset:16px 8px 0;background:var(--pskin);border-radius:46% 46% 44% 44%}'
   +'.pn-sc .face .hair{position:absolute;left:12px;right:12px;top:4px;height:56px;background:var(--phair);border-radius:64px 64px 20px 20px}'
   +'.pn-sc .face .eye{position:absolute;top:94px;width:16px;height:9px;border-radius:0 0 11px 11px;background:var(--phair)}.pn-sc .face .eye.l{left:47px}.pn-sc .face .eye.r{right:47px}'
   +'.pn-sc .face .mo{position:absolute;left:50%;top:136px;width:40px;height:11px;margin-left:-20px;border-radius:0 0 20px 20px;background:#8C3B2E}'
   +'.pn-sc .face .ck{position:absolute;top:114px;width:24px;height:11px;border-radius:12px;background:#F2A98A;opacity:.55}.pn-sc .face .ck.l{left:26px}.pn-sc .face .ck.r{right:26px}'
   +'.pn-sc .face .bump{position:absolute;z-index:2;width:30px;height:20px;border-radius:18px 18px 8px 8px;background:#F3B27F;transform:scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1)}.pn-sc .face .bump.on{transform:scale(1)}'
   +'.pn-sc .face.hurt .eye{height:4px;border-radius:4px;top:98px}.pn-sc .face.hurt .mo{height:7px;width:28px;margin-left:-14px;border-radius:8px;top:140px}'
   +'.pn-sc .face.ko .eye{background:none;height:16px;width:16px}.pn-sc .face.ko .eye::before,.pn-sc .face.ko .eye::after{content:"";position:absolute;left:7px;top:-2px;width:3px;height:19px;background:var(--phair);transform:rotate(45deg)}.pn-sc .face.ko .eye::after{transform:rotate(-45deg)}'
   +'.pn-sc .face .tag{position:absolute;left:-40px;right:-40px;bottom:-24px;text-align:center;font:800 13px "Noto Sans KR",sans-serif;color:#7A6E55}'
   +'.pn-sc .flick{position:absolute;width:110px;height:90px;z-index:3}'
   +'.pn-sc .flick .cuff{position:absolute;left:-34px;top:30px;width:38px;height:40px;border-radius:8px;background:#4E97A8}'
   +'.pn-sc .flick .fist{position:absolute;left:0;top:22px;width:62px;height:56px;border-radius:24px 20px 26px 24px;background:var(--pskin2)}'
   +'.pn-sc .flick .mid{position:absolute;left:50px;top:30px;width:50px;height:16px;border-radius:10px;background:var(--pskin2);transform-origin:5px 8px}'
   +'.pn-sc .flick .thumb{position:absolute;left:42px;top:44px;width:28px;height:16px;border-radius:10px;background:#DFA06D}'
   +'.pn-sc .knuck{position:absolute;width:80px;height:110px;z-index:3}'
   +'.pn-sc .knuck .arm{position:absolute;left:24px;top:-60px;width:32px;height:86px;border-radius:8px;background:#4E97A8}'
   +'.pn-sc .knuck .fist{position:absolute;left:6px;top:20px;width:68px;height:58px;border-radius:22px 22px 26px 26px;background:var(--pskin2)}'
   +'.pn-sc .knuck .kn{position:absolute;left:29px;top:68px;width:22px;height:24px;border-radius:9px 9px 12px 12px;background:#DFA06D}'
   +'.pn-sc .knuck .ln{position:absolute;top:56px;width:3px;height:14px;border-radius:2px;background:#C88A5A}.pn-sc .knuck .ln.a{left:23px}.pn-sc .knuck .ln.b{left:55px}'
   +'.pn-sc .backp{position:absolute;left:35px;top:75px;width:230px;height:250px}'
   +'.pn-sc .backp .head{position:absolute;left:76px;top:0;width:78px;height:82px;border-radius:46% 46% 44% 44%;background:var(--phair)}'
   +'.pn-sc .backp .ear{position:absolute;top:34px;width:14px;height:22px;border-radius:8px;background:var(--pskin)}.pn-sc .backp .ear.l{left:68px}.pn-sc .backp .ear.r{right:68px}'
   +'.pn-sc .backp .neck{position:absolute;left:96px;top:72px;width:38px;height:26px;background:var(--pskin)}'
   +'.pn-sc .backp .sh{position:absolute;left:18px;right:18px;top:90px;height:160px;border-radius:70px 70px 20px 20px;background:var(--pskin)}'
   +'.pn-sc .backp .shirt{position:absolute;left:46px;right:46px;top:96px;height:154px;border-radius:30px 30px 16px 16px;background:#4E97A8}'
   +'.pn-sc .backp .arm{position:absolute;top:112px;width:34px;height:136px;border-radius:18px;background:var(--pskin)}.pn-sc .backp .arm.l{left:2px;transform:rotate(8deg)}.pn-sc .backp .arm.r{right:2px;transform:rotate(-8deg)}'
   +'.pn-sc .backp .tag{position:absolute;left:0;right:0;bottom:-22px;text-align:center;font:800 13px "Noto Sans KR",sans-serif;color:#7A6E55}'
   +'.pn-sc .slap{position:absolute;width:44px;height:52px;z-index:3;transition:opacity 1s}'
   +'.pn-sc .slap::before{content:"";position:absolute;left:8px;top:16px;width:28px;height:34px;border-radius:12px;background:#F2A98A;opacity:.8}'
   +'.pn-sc .slap::after{content:"";position:absolute;left:9px;top:0;width:26px;height:20px;border-radius:6px;background:repeating-linear-gradient(90deg,#F2A98A 0 4px,transparent 4px 6px);opacity:.8}'
   +'.pn-sc .chant{position:absolute;left:0;right:0;top:22px;text-align:center;font-family:"Black Han Sans",sans-serif;font-size:30px;letter-spacing:.06em;color:#1C1D21;z-index:5}'
   +'.pn-sc .chant span{opacity:.15;transition:opacity .1s}.pn-sc .chant span.on{opacity:1}';
  document.head.appendChild(css);
  function snd(k,v){ try{ if(window.SND&&SND[k]) SND[k](v); }catch(e){} }
  var SFX={ttak:function(){ snd('stone',1); snd('slap',.5); NA.vib(50); }, kong:function(){ snd('thud',1); snd('clack',.5); NA.vib(70); }, pat:function(){ snd('flick',.55); NA.vib(10); }, bap:function(){ snd('slap',1); snd('thud',.6); NA.vib([40,30,80]); }, tick:function(){ snd('clack',.3); }};
  function col(s,o){ if(window.noriCol) noriCol(s,o); }
  function fx(st,word,size){ st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
    var fl=st.querySelector('.pn-flash'); if(!fl){ fl=document.createElement('div'); fl.className='pn-flash'; st.appendChild(fl); } fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
    var pw=st.querySelector('.pn-pow'); if(!pw){ pw=document.createElement('div'); pw.className='pn-pow'; st.appendChild(pw); } pw.textContent=word; pw.style.fontSize=(size||(word.length>3?42:66))+'px'; pw.classList.remove('go'); void pw.offsetWidth; pw.classList.add('go'); }
  function clear(st){ if(!st) return; st.onpointerdown=st.onpointerup=st.onpointercancel=st.onpointerleave=null; st.classList.remove('pn-st','shake'); }
  function faceHTML(tag){ return '<div class="face"><div class="hd"></div><div class="hair"></div><div class="eye l"></div><div class="eye r"></div><div class="ck l"></div><div class="ck r"></div><div class="mo"></div><div class="tag">'+tag+'</div></div>'; }
  function backHTML(tag){ return '<div class="backp"><div class="sh"></div><div class="arm l"></div><div class="arm r"></div><div class="shirt"></div><div class="neck"></div><div class="ear l"></div><div class="ear r"></div><div class="head"></div><div class="tag">'+tag+'</div></div>'; }
  function esc(t){ return String(t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function run(st,kind,o,done){
    stop(); var my=++live, K=KIND[kind]; if(!K){ if(done) done(); return; }
    o=o||{}; var me=!!o.me, vic=o.victim||'다복 사장님', side=o.side||'l', vside=side==='l'?'r':'l', n=0;
    function alive(){ return my===live; }
    lastSt=st; clear(st); st.classList.add('pn-st'); if(getComputedStyle(st).position==='static'){ st.style.position='relative'; }
    st.innerHTML='<div class="pn-sc">'+(kind==='indian'?backHTML(esc(vic)):faceHTML(esc(vic)))+'</div><div class="pn-hint"></div><div class="pn-cnt">0 / '+K.n+'</div>';
    var sc=st.querySelector('.pn-sc'), hint=st.querySelector('.pn-hint'), cnt=st.querySelector('.pn-cnt'), face=st.querySelector('.face');
    function fit(){ if(!alive()) return; var W=st.clientWidth, Hh=st.clientHeight, s=Math.min(1.15,(Hh-34)/330,(W-8)/300); s=Math.max(.45,s); sc.style.transform='scale('+s+')'; sc.style.left=((W-300*s)/2)+'px'; sc.style.top=Math.max(0,(Hh-34-330*s)/2+4)+'px'; }
    fit(); window.addEventListener('resize',fit);
    function H(t,p){ hint.textContent=t; hint.classList.toggle('pulse',!!p); }
    function count(){ n++; cnt.textContent=n+' / '+K.n; }
    var who=me?'':(vic==='나'?'사장님':'');
    function finish(){ col('l',{on:false,pw:0}); col('r',{on:false,pw:0}); NA.unpoint(); window.removeEventListener('resize',fit);
      H(vic==='나'?'나 「아야야… 다음엔 이긴다!」':(/사장님/.test(vic)?'사장님 「아이고! 다음엔 안 진다」':vic+' 「아야야… 한 판 더!」'));
      if(done) setTimeout(function(){ if(alive()){ clear(st); done(); } },1600); }
    col(side,{on:true}); col(vside,{on:false});
    if(kind!=='indian'){
      var hand=document.createElement('div'), mid=null;
      if(kind==='ttak'){ hand.className='flick'; hand.innerHTML='<div class="cuff"></div><div class="fist"></div><div class="mid"></div><div class="thumb"></div>'; }
      else { hand.className='knuck'; hand.innerHTML='<div class="arm"></div><div class="fist"></div><div class="ln a"></div><div class="ln b"></div><div class="kn"></div>'; }
      sc.appendChild(hand); mid=hand.querySelector('.mid');
      if(kind==='ttak'){ face.style.left='110px'; }
      var home= kind==='ttak' ? {x:26, y:130} : {x:110, y:-22};
      function put(dx,dy){ hand.style.left=(home.x+dx)+'px'; hand.style.top=(home.y+dy)+'px'; }
      function pose(p){ if(kind==='ttak'){ mid.style.transform='rotate('+(-160*p)+'deg)'; put(-16*p,0); } else put(0,-34*p); }
      hand.style.transition='left .25s ease, top .25s ease'; put(0,0); pose(0);
      function strike(p,after){ hand.style.transition='left .06s ease-in, top .06s ease-in'; if(mid){ mid.style.transition='transform .05s ease-out'; mid.style.transform='rotate(0deg)'; }
        if(kind==='ttak') put(14,0); else put(0,44);
        setTimeout(function(){ if(!alive()) return;
          if(p<.25){ H('너무 약해요! 더 꾹 눌렀다 놓으세요',true); SFX.tick(); }
          else { count(); kind==='ttak'?SFX.ttak():SFX.kong(); fx(st,kind==='ttak'?'딱!':'콩!');
            face.classList.add('hurt'); setTimeout(function(){ if(n<K.n) face.classList.remove('hurt'); },420);
            var b=document.createElement('div'); b.className='bump'; if(kind==='ttak'){ b.style.left=(14+n*6)+'px'; b.style.top=(52+n*7)+'px'; } else { b.style.left=(48+(n-1)*24)+'px'; b.style.top=(-6+(n%2)*6)+'px'; } face.appendChild(b); setTimeout(function(){ b.classList.add('on'); },10);
            if(n>=K.n) face.classList.add('ko'); }
          setTimeout(function(){ hand.style.transition='left .25s ease, top .25s ease'; if(mid) mid.style.transition='transform .25s'; pose(0); put(0,0); after&&after(); },130); },70); }
      if(me){
        H(kind==='ttak'?'꾹 누르면 손가락에 힘 → 놓으면 「딱!」':'꾹 누르면 주먹 들기 → 놓으면 「콩!」',true);
        var aim=function(){ if(alive()&&n<K.n) NA.point(face,kind==='ttak'?'여기 이마를 꾹 누르세요':'여기 머리를 꾹 누르세요',kind==='ttak'?.38:.5,kind==='ttak'?.3:.2); }; setTimeout(aim,60);
        var hold=false,p=0,t0=0,raf=0;
        st.onpointerdown=function(e){ if(!alive()||n>=K.n) return; e.preventDefault(); NA.unpoint(); hold=true; t0=performance.now(); H('힘 모으는 중… 이제 놓으세요!'); hand.style.transition='none'; if(mid) mid.style.transition='none';
          (function lp(){ if(!hold||!alive()) return; p=Math.min(1,(performance.now()-t0)/900); col(side,{pw:p}); pose(p); raf=requestAnimationFrame(lp); })(); };
        st.onpointerup=st.onpointercancel=st.onpointerleave=function(){ if(!hold||!alive()) return; hold=false; cancelAnimationFrame(raf); var q=p; col(side,{pw:0});
          strike(q,function(){ if(n>=K.n){ st.onpointerdown=null; finish(); } else { H('한 번 더! 꾹 → 놓기',true); aim(); } }); };
      } else {
        H((who||'상대')+'이 힘을 모으는 중…');
        (function next(){ if(!alive()) return; if(n>=K.n){ finish(); return; } var t0=performance.now(), goal=.55+Math.random()*.45;
          (function lp(){ if(!alive()) return; var q=Math.min(goal,(performance.now()-t0)/900); col(side,{pw:q}); hand.style.transition='none'; if(mid) mid.style.transition='none'; pose(q); if(q<goal) requestAnimationFrame(lp); else { col(side,{pw:0}); strike(q,function(){ setTimeout(next,650); }); } })(); })();
      }
      return;
    }
    /* 인디언밥 */
    var ch=document.createElement('div'); ch.className='chant'; ch.innerHTML='<span>인</span> <span>디</span> <span>언</span> <span>밥!</span>'; sc.appendChild(ch);
    var sp=ch.querySelectorAll('span'), bp=sc.querySelector('.backp');
    function mark(x,y,big){ var m=document.createElement('div'); m.className='slap'; m.style.left=(x-22)+'px'; m.style.top=(y-26)+'px'; m.style.transform='rotate('+(Math.random()*40-20)+'deg) scale('+(big?1.4:1)+')'; sc.appendChild(m); setTimeout(function(){ m.style.opacity='0'; },380); setTimeout(function(){ m.remove(); },1400); }
    function spot(){ return {x:35+62+Math.random()*106, y:75+115+Math.random()*95, cx:150, cy:75+160}; }
    var iv=0, waitBap=null;
    function roll(manual,after){ var k=0, syl=0; [].forEach.call(sp,function(s){ s.classList.remove('on'); });
      iv=setInterval(function(){ if(!alive()){ clearInterval(iv); return; } var s=spot(); mark(s.x,s.y); SFX.pat(); col(side,{pw:.25+(k%4)/5}); k++;
        if(k%5===0&&syl<3){ sp[syl].classList.add('on'); NA.beat(); NA.speak(['인','디','언'][syl]); syl++; }
        if(k>=15){ clearInterval(iv); iv=0; if(manual){ H('지금 손을 떼세요 → 「밥!」',true); waitBap=after; } else setTimeout(function(){ bap(after); },240); } },70); }
    function bap(after){ if(!alive()) return; var s=spot(); sp[3].classList.add('on'); NA.speak('밥'); mark(s.cx-36,s.cy,true); mark(s.cx+36,s.cy,true); SFX.bap(); fx(st,'밥!'); count(); col(side,{pw:0}); setTimeout(after,750); }
    var aimB=function(){ if(alive()&&n<K.n) NA.point(bp,'여기 등을 꾹 누르고 있다가 떼세요',.5,.62); };
    if(me){ H('꾹 누르고 있으면 「인·디·언」 따다닥 → 떼면 「밥!」',true); setTimeout(aimB,60);
      st.onpointerdown=function(e){ if(!alive()||n>=K.n||iv||waitBap) return; e.preventDefault(); NA.unpoint(); H('따다다다다닥! 계속 누르고 있으세요'); roll(true,function(){ if(n>=K.n){ st.onpointerdown=null; finish(); } else { H('한 번 더! 꾹 누르세요',true); aimB(); } }); };
      st.onpointerup=st.onpointercancel=function(){ if(waitBap){ var a=waitBap; waitBap=null; bap(a); } };
    } else { H((who||'상대')+'이 '+(vic==='나'?'내':vic)+' 등짝을! 「인디언 밥!」'); (function next(){ if(!alive()) return; if(n>=K.n){ finish(); return; } roll(false,function(){ setTimeout(next,450); }); })(); }
  }
  function stop(){ live++; try{ NA.unpoint(); }catch(e){} clear(lastSt); col('l',{on:null,pw:0}); col('r',{on:null,pw:0}); }
  return {run:run, stop:stop, name:function(k){ return KIND[k]?KIND[k].name:''; }, has:function(k){ return !!KIND[k]; }};
})();
