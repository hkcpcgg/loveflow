const {chromium}=require('playwright');const {execSync}=require('child_process');
const S=[['1_기다리는물결',1200,400,12],['2_흐르는길',720,720,10],['3_한송이가차오르다',720,720,20],['4_사랑이흘러사랑을부르다',720,720,13],['5_어디서시작해도',720,720,8.5],['6_닿지못한말',720,720,11],['7_마을에불이켜지다',720,720,12]];
(async()=>{const b=await chromium.launch();
for(let i=0;i<S.length;i++){const [n,w,h,len]=S[i];
 const ctx=await b.newContext({viewport:{width:w,height:h},recordVideo:{dir:__dirname+'/vid/tmp',size:{width:w,height:h}}});
 const p=await ctx.newPage();const t0=Date.now();
 await p.goto('file://'+__dirname+'/사랑흐름_흐름그림.html');await p.waitForTimeout(1200);
 await p.addStyleTag({content:`body{overflow:hidden} .wrap>*:not(.grid){display:none!important} .card{display:none!important} .card:nth-child(${i+1}){display:block!important;position:fixed;inset:0;border:0;border-radius:0;z-index:9} .card:nth-child(${i+1}) .cap{display:none} .card:nth-child(${i+1}) .stage{width:100vw;height:100vh;aspect-ratio:auto!important}`});
 await p.waitForTimeout(300);
 await p.evaluate(k=>document.querySelectorAll('.re')[k].click(),i);const start=(Date.now()-t0)/1000;
 await p.waitForTimeout(len*1000+300);const v=p.video();await ctx.close();const src=await v.path();
 const mp4=`${__dirname}/vid/${n}.mp4`,gif=`${__dirname}/vid/${n}.gif`;
 execSync(`ffmpeg -y -loglevel error -ss ${start.toFixed(2)} -i "${src}" -t ${len} -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart "${mp4}"`);
 const gw=w>h?720:480;
 execSync(`ffmpeg -y -loglevel error -i "${mp4}" -vf "fps=15,scale=${gw}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" "${gif}"`);
 console.log(n,'ok');}
await b.close();})();
