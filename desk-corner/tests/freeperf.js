const { chromium } = require('playwright');
(async () => {
  const [,, ...files] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
  for (const f of files) for (const z of [1,2,0]) {
    const p = await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});
    await p.goto('file://'+f); await p.waitForTimeout(3000);
    if(z) {await p.evaluate(z=>window.__zoom(z),z); await p.waitForTimeout(1500);}
    await p.keyboard.press('Space'); await p.waitForTimeout(200);
    await p.evaluate(()=>{window.__fr=[];const g=n=>{__fr.push(n);if(__fr.length<2000)requestAnimationFrame(g)};requestAnimationFrame(g)});
    for (let i=0;i<40;i++){ await p.mouse.move(200+ (i%2?1000:0)+i*5, 200+(i%3)*200,{steps:4}); }
    const fr=await p.evaluate(()=>{const a=__fr.slice();__fr.length=1e9;return a});
    const d=fr.slice(1).map((v,i)=>v-fr[i]).filter(x=>x<1000);const t=d.reduce((a,b)=>a+b,0);d.sort((a,b)=>a-b);
    console.log(f.split('/').pop(),'zone'+z, (d.length/t*1000).toFixed(0)+'fps','p90',d[Math.floor(d.length*.9)].toFixed(0)+'ms');
    await p.close();
  }
  await b.close();
})();
