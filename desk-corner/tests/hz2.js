const { chromium } = require('playwright');
(async () => {
  const [,, file] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  await p.goto('file://'+file); await p.waitForTimeout(3000);
  await p.keyboard.press('Space'); await p.waitForTimeout(200);
  const g=await p.evaluate(()=>{const r=document.querySelector('#hzs .hz[data-z="1"]').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  for(let i=0;i<6;i++){await p.mouse.move(g[0]+i*8,g[1]+i*4,{steps:3});}
  console.log('during move:',JSON.stringify(await p.evaluate(()=>({sc:document.querySelector('#sc').className,hzs:getComputedStyle(document.querySelector('#hzs')).visibility}))));
  await p.mouse.click(g[0]+50,g[1]+25); await p.waitForTimeout(1500);
  console.log('after click body:',JSON.stringify(await p.evaluate(()=>document.body.className)));
  await b.close();
})();
