const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:3});
for(const f of fs.readdirSync(__dirname).filter(x=>x.endsWith('.html'))){
 await p.goto('file://'+__dirname+'/'+f);await p.waitForTimeout(700);
 const n=f.replace('.html','');
 if(n==='all'){await p.setViewportSize({width:1560,height:1400});await p.screenshot({path:__dirname+'/out/0_모아보기.png',fullPage:true});}
 else await (await p.$('.p')).screenshot({path:__dirname+'/out/'+n+'.png',omitBackground:true});}
await b.close();})();
