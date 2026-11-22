/* 놀이 결과를 손님 입구에 알리고, 「선물 받기」를 입구의 선물 창으로 넘김 */
window.noriResult=function(r){ window.__noriLast=r; try{ if(window.parent!==window){ window.parent.postMessage({nori:'result',r:r},'*'); } }catch(e){} };
document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('.gift'); if(!b) return;
  var framed=false; try{ framed=window.parent!==window; }catch(x){ framed=true; }
  if(framed){ try{ window.parent.postMessage({nori:'gift'},'*'); }catch(x){} return; }
  var t=document.getElementById('noriToast'); if(!t){ t=document.createElement('div'); t.id='noriToast'; t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#16181D;color:#fff;font:700 14px "Noto Sans KR",sans-serif;padding:11px 16px;border-radius:14px;z-index:99;max-width:88vw;text-align:center'; document.body.appendChild(t); }
  t.textContent='선물은 손님 입구(다복 · 그때 그 놀이)에서 받아요'; t.style.display='block'; clearTimeout(t._t); t._t=setTimeout(function(){ t.style.display='none'; },2400); });
