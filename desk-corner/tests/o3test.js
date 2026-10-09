const { chromium } = require('playwright');
(async () => {
  const [,, file, out] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://'+file); await p.waitForTimeout(2500);
  await p.screenshot({path:out+'_z0.png',clip:{x:700,y:60,width:560,height:320}});
  await p.evaluate(()=>window.__zoom(2)); await p.waitForTimeout(1500);
  const clip={x:760,y:430,width:680,height:470};
  for (const [n,dx,dy] of [['L',-500,-250],['R',500,-250]]) {
    await p.mouse.move(720,450); await p.mouse.down(); await p.mouse.move(720+dx,450+dy,{steps:12}); await p.mouse.up(); await p.waitForTimeout(1200);
    await p.screenshot({path:`${out}_${n}.png`,clip});
    await p.mouse.move(720+dx,450+dy); await p.mouse.down(); await p.mouse.move(720,450,{steps:12}); await p.mouse.up(); await p.waitForTimeout(800);
  }
  for (const nm of ['生理盐水瓶','夹式小风扇']) {
    const r=await p.evaluate(nm=>{const e=[...document.querySelectorAll('.it')].find(e=>e.querySelector('.lb')?.textContent==nm);const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}},nm);
    await p.mouse.move(r.x+r.w/2,r.y+r.h*.5); await p.waitForTimeout(700);
    await p.screenshot({path:`${out}_h_${nm}.png`,clip});
    await p.mouse.click(r.x+r.w/2,r.y+r.h*.5); await p.waitForTimeout(1000);
    console.log(nm, await p.evaluate(()=>document.querySelector('#rd').className+' | '+document.querySelector('#ic').textContent));
    await p.click('#cls'); await p.waitForTimeout(1300); await p.mouse.move(5,5); await p.waitForTimeout(600);
  }
  await p.screenshot({path:out+'_after.png',clip});
  console.log(errs); await b.close();
})();
