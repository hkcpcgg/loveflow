// 손글씨 획 — 칸 안 비율(0~1) 좌표 · 조금씩 흔들림
function jit(a,j){return a+(Math.random()-0.5)*j;}
function line(x1,y1,x2,y2,n=8){const o=[];for(let i=0;i<=n;i++){const t=i/n;o.push([jit(x1+(x2-x1)*t,0.004),jit(y1+(y2-y1)*t,0.006)]);}return o;}
function circ(cx,cy,r,n=22){const o=[];for(let i=0;i<=n;i++){const a=-Math.PI/2+i/n*Math.PI*2.05;o.push([jit(cx+r*Math.cos(a),0.004),jit(cy+r*Math.sin(a)*1.6,0.006)]);}return o;}
function heart(cx,cy,s){const o=[];for(let i=0;i<=40;i++){const t=i/40*Math.PI*2;const x=16*Math.pow(Math.sin(t),3), y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));o.push([cx+x*s/16,cy+y*s/16*1.5]);}return o;}
// 글자 한 칸 너비 w, 왼쪽 x0, 위 y0, 높이 h
function go(x0,y0,w,h){return [ line(x0,y0+.1*h,x0+.75*w,y0+.1*h).concat(line(x0+.75*w,y0+.1*h,x0+.7*w,y0+.45*h)), line(x0+.4*w,y0+.55*h,x0+.4*w,y0+.75*h), line(x0+.05*w,y0+.8*h,x0+.85*w,y0+.8*h)];}
function ma(x0,y0,w,h){return [ line(x0,y0+.15*h,x0,y0+.75*h), line(x0,y0+.15*h,x0+.5*w,y0+.15*h).concat(line(x0+.5*w,y0+.15*h,x0+.5*w,y0+.75*h)), line(x0,y0+.75*h,x0+.5*w,y0+.75*h), line(x0+.72*w,y0+.05*h,x0+.72*w,y0+.95*h), line(x0+.72*w,y0+.48*h,x0+.9*w,y0+.48*h)];}
function wo(x0,y0,w,h){return [ circ(x0+.28*w,y0+.2*h,.13*w), line(x0+.02*w,y0+.5*h,x0+.55*w,y0+.5*h), line(x0+.3*w,y0+.5*h,x0+.3*w,y0+.68*h), line(x0+.55*w,y0+.4*h,x0+.7*w,y0+.4*h), line(x0+.75*w,y0+.05*h,x0+.75*w,y0+.95*h)];}
function yo(x0,y0,w,h){return [ circ(x0+.42*w,y0+.25*h,.18*w), line(x0+.3*w,y0+.6*h,x0+.3*w,y0+.75*h), line(x0+.55*w,y0+.6*h,x0+.55*w,y0+.75*h), line(x0+.05*w,y0+.8*h,x0+.85*w,y0+.8*h)];}
function ji(x0,y0,w,h){return [ line(x0+.05*w,y0+.12*h,x0+.52*w,y0+.12*h,10), line(x0+.32*w,y0+.15*h,x0+.08*w,y0+.75*h), line(x0+.3*w,y0+.4*h,x0+.55*w,y0+.75*h), line(x0+.75*w,y0+.05*h,x0+.75*w,y0+.95*h)];}
function su(x0,y0,w,h){return [ line(x0+.45*w,y0+.05*h,x0+.15*w,y0+.45*h), line(x0+.45*w,y0+.2*h,x0+.75*w,y0+.45*h), line(x0+.02*w,y0+.6*h,x0+.9*w,y0+.6*h), line(x0+.46*w,y0+.6*h,x0+.46*w,y0+.95*h)];}
module.exports={
  thanks(){const w=.17,h=.42,y=.22;return [].concat(go(.08,y,w,h),ma(.28,y,w,h),wo(.5,y,w,h),yo(.72,y,w,h),[heart(.9,.82,.05)]);},
  name(){const w=.2,h=.6,y=.18;return [].concat(ji(.3,y,w,h),su(.53,y,w,h));}
};
