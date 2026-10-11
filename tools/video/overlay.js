// 녹화용 자막 · 누르는 곳 표시
(function(){
  function boot(){ if(document.getElementById('__cap')||!document.body){ return; }
    var st=document.createElement('style'); st.textContent='#__cap{position:fixed;left:50%;bottom:96px;min-width:72%;box-sizing:border-box;transform:translateX(-50%);z-index:2147483646;max-width:86%;background:rgba(22,58,92,.92);color:#fff;font:700 17px/1.45 "Noto Sans KR",system-ui,sans-serif;padding:11px 18px;border-radius:16px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.25);opacity:0;transition:opacity .35s, transform .35s;pointer-events:none;word-break:keep-all}#__cap.on{opacity:1}#__cap.top{bottom:auto;top:66px}#__cap small{display:block;font-weight:500;font-size:13.5px;opacity:.85;margin-top:2px}.__tap{position:fixed;z-index:2147483647;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:3px solid #E8771E;background:rgba(232,119,30,.25);pointer-events:none;animation:__t .7s ease-out forwards}@keyframes __t{from{transform:scale(.4);opacity:1}to{transform:scale(1.5);opacity:0}}';
    document.head.appendChild(st); var d=document.createElement('div'); d.id='__cap'; document.body.appendChild(d); }
  window.__cap=function(t,s,top){ boot(); var d=document.getElementById('__cap'); d.classList.toggle('top',!!top); if(!t){ d.classList.remove('on'); return; } d.innerHTML=t+(s?'<small>'+s+'</small>':''); d.classList.add('on'); };
  window.__tap=function(x,y){ boot(); var e=document.createElement('div'); e.className='__tap'; e.style.left=x+'px'; e.style.top=y+'px'; document.body.appendChild(e); setTimeout(function(){ e.remove(); },800); };
  if(document.readyState!=='loading'){ boot(); } else { document.addEventListener('DOMContentLoaded',boot); }
})();
