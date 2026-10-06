const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/사랑흐름_흐름그림.html');await p.waitForTimeout(1500);
const names=['1_기다리는물결','2_흐르는길','3_한송이가차오르다','4_사랑이흘러사랑을부르다','5_어디서시작해도','6_닿지못한말','7_마을에불이켜지다'];
const st=await p.$$('.stage');for(let i=0;i<st.length;i++){await st[i].screenshot({path:__dirname+'/out/정지_'+names[i]+'.png'});}
console.log(errs.join('\n')||'ok');await b.close();})();
