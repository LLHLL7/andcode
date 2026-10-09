const { chromium } = require('playwright');
(async () => {
  const [,, file] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://'+file); await p.waitForTimeout(3000);
  const info=await p.evaluate(()=>{const h=document.querySelector('#hzs');const g=[...h.querySelectorAll('.hz')].map(x=>{const r=x.getBoundingClientRect();return [x.dataset.z,r.x|0,r.y|0,r.width|0,r.height|0]});return {vis:getComputedStyle(h).visibility,disp:getComputedStyle(h).display,mv:document.querySelector('#sc').className,body:document.body.className,g}});
  console.log(JSON.stringify(info));
  const z1=info.g.find(x=>x[0]=='1');const cx=z1[1]+z1[3]/2,cy=z1[2]+z1[4]/2;
  console.log('at point:',await p.evaluate(([x,y])=>document.elementsFromPoint(x,y).slice(0,4).map(e=>e.tagName+'#'+e.id+'.'+(e.className.baseVal??e.className)),[cx,cy]));
  await p.mouse.move(cx,cy,{steps:5}); await p.waitForTimeout(600);
  console.log('after move:',JSON.stringify(await p.evaluate(()=>({sc:document.querySelector('#sc').className,hzs:getComputedStyle(document.querySelector('#hzs')).visibility}))));
  await p.mouse.click(cx,cy); await p.waitForTimeout(1500);
  console.log('after click body:',await p.evaluate(()=>document.body.className));
  console.log(errs); await b.close();
})();
