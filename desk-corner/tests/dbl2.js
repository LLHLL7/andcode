const { chromium } = require('playwright');
(async () => {
  const [,, f] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+f); await p.waitForTimeout(3000);
  const rd=()=>p.evaluate(()=>document.querySelector('#rd').className);
  await p.evaluate(()=>window.__zoom(2)); await p.waitForTimeout(1500);
  const tgt=await p.evaluate(()=>{const e=[...document.querySelectorAll('.it')].find(e=>/积木仙人掌/.test((e.querySelector('.lb')||{}).textContent||''));const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  await p.evaluate(()=>window.__zoom(0)); await p.waitForTimeout(1500);
  const hz=await p.evaluate(()=>{const g=document.querySelector('#hzs [data-z="2"] polygon');const r=g.getBoundingClientRect();return [r.x+r.width*.5,r.y+r.height*.5]});
  for (const [lbl,delay] of [['2nd click 150ms',150],['2nd click 600ms',600],['2nd click 1100ms (just after end)',1100],['2nd click 1700ms',1700]]){
    await p.mouse.click(hz[0],hz[1]); await p.waitForTimeout(delay); await p.mouse.click(tgt[0],tgt[1]); await p.waitForTimeout(900);
    console.log(lbl,'dialog:',JSON.stringify(await rd()));
    if((await rd()).includes('on')){await p.click('#cls').catch(()=>{});await p.waitForTimeout(1200);}
    await p.evaluate(()=>window.__zoom(0)); await p.waitForTimeout(1600);
  }
  console.log(errs); await b.close();
})();
