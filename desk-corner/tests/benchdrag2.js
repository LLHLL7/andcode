const { chromium } = require('playwright');
(async () => {
  const [,, f] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+f); await p.waitForTimeout(3000);
  await p.evaluate(()=>window.__zoom(2));await p.waitForTimeout(1500);await p.mouse.move(5,5);await p.mouse.move(40,40);
  const r=await p.evaluate(()=>{const e=[...document.querySelectorAll('.it')].find(e=>((e.querySelector('.lb')||{}).textContent)=='蓝晒印象');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  await p.mouse.move(r[0],r[1],{steps:3});await p.mouse.click(r[0],r[1]);await p.waitForTimeout(900);await p.click('#rd [data-a="3"]');await p.waitForTimeout(1500);
  if(await p.evaluate(()=>document.querySelector('#rd').classList.contains('on'))){await p.click('#cls');await p.waitForTimeout(1100)}
  await p.evaluate(()=>window.__openCy());await p.waitForTimeout(800);
  const s=await p.evaluate(()=>{const e=document.querySelector('#inv [data-g="B"]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  await p.mouse.move(s[0],s[1]);await p.mouse.down();await p.mouse.move(700,450,{steps:10});await p.screenshot({path:'shots/c3_dragbench.png'});await p.mouse.up();await p.waitForTimeout(600);
  console.log('has',await p.evaluate(()=>Object.keys(__cy.has)),'msg',await p.evaluate(()=>document.querySelector('#cym').textContent),'inv',await p.evaluate(()=>[...document.querySelectorAll('#inv [data-g]')].map(e=>e.dataset.g)));
  // click on an inventory item (no drag) still opens view
  const s2=await p.evaluate(()=>{const e=document.querySelector('#inv [data-g="sheet"]');if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  console.log(errs);await b.close();
})();
