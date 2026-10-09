const { chromium } = require('playwright');
(async () => {
  const [,, ...fs] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  for (const f of fs){
  const p = await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});
  await p.goto('file://'+f); await p.waitForTimeout(3000);
  await p.mouse.move(700,500);await p.waitForTimeout(300);
  for (const z of [3,0]){
    await p.evaluate(()=>{window.__fr=[];const g=n=>{__fr.push(n);if(__fr.length<200)requestAnimationFrame(g)};requestAnimationFrame(g)});
    await p.evaluate(z=>window.__zoom(z),z); await p.waitForTimeout(1300);
    const fr=await p.evaluate(()=>{const a=__fr.slice();__fr.length=1e9;return a});
    const d=fr.slice(1).map((v,i)=>Math.round(v-fr[i]));
    console.log(f.split('/').pop(),'z'+z,d.slice(0,60).join(' '));
  }
  await p.close();}
  await b.close();
})();
