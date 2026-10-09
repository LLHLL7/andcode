const { chromium } = require('playwright');
(async () => {
  const [,, f] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+f); await p.waitForTimeout(3000);
  // find an item in zone1 close-up, then its position in overview is under hz1; click hz1 at a point that ends on an item
  await p.evaluate(()=>window.__zoom(1)); await p.waitForTimeout(1500);
  const names=await p.evaluate(()=>[...document.querySelectorAll('#stage>.it')].map(e=>(e.querySelector('.lb')||{}).textContent).filter(Boolean));
  console.log('zone1 items',names.join(','));
  await p.evaluate(()=>window.__zoom(0)); await p.waitForTimeout(1500);
  // click at overview position of 泡面 (or first item)
  const nm=names.find(n=>/泡面|面/.test(n))||names[0];
  const pos=await p.evaluate(nm=>{const e=[...document.querySelectorAll('.it')].find(e=>(e.querySelector('.lb')||{}).textContent==nm);const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]},nm);
  await p.mouse.move(pos[0],pos[1]); await p.waitForTimeout(300); await p.mouse.click(pos[0],pos[1]); await p.waitForTimeout(1600);
  const st=()=>p.evaluate(()=>{const h=[...document.querySelectorAll('.it:hover')].map(e=>(e.querySelector('.lb')||{}).textContent);return {hover:h,flb:getComputedStyle(document.querySelector('#flb')).opacity,body:document.body.className}});
  console.log('item',nm,'after zoom (no move):',JSON.stringify(await st()));
  await p.mouse.move(pos[0]+2,pos[1]+1); await p.waitForTimeout(400); console.log('tiny move:',JSON.stringify(await st()));
  await p.mouse.move(pos[0]+3,pos[1]+12,{steps:3}); await p.waitForTimeout(500); console.log('real move:',JSON.stringify(await st()));
  console.log(errs); await b.close();
})();
