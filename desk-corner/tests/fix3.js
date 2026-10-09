const { chromium } = require('playwright');
(async () => {
  const [,, f] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+f); await p.waitForTimeout(3000);
  const W=ms=>p.waitForTimeout(ms);
  // saline bounce
  await p.evaluate(()=>window.__zoom(2));await W(1500);await p.mouse.move(5,5);await p.mouse.move(40,40);
  const r=await p.evaluate(()=>{const e=[...document.querySelectorAll('.it')].find(e=>((e.querySelector('.lb')||{}).textContent)=='生理盐水瓶');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height*.6]});
  await p.mouse.move(r[0],r[1],{steps:3});await p.mouse.click(r[0],r[1]);await W(1200);
  await p.click('#cls');
  const Ls=[];for(let i=0;i<14;i++){await W(60);Ls.push(await p.evaluate(()=>window.O3.bottle.L.toFixed(2)))}
  console.log('bottle L after close',Ls.join(' '));
  // place items and hover desk
  for(const k of ['A','B','bowl','paper','saline'])await p.evaluate(k=>window.__cyPlace(k,'desk'),k);
  await p.evaluate(()=>window.__zoom(0));await W(1500);await p.evaluate(()=>window.__zoom(6));await W(1500);await p.mouse.move(5,5);await p.mouse.move(40,40);await W(300);
  const d=await p.evaluate(()=>{const e=document.querySelector('.cydk');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width|0,r.height|0,e.className]});console.log('desk hit',d);
  await p.mouse.move(d[0]-10,d[1]);await p.mouse.move(d[0],d[1],{steps:3});await W(700);
  console.log('labels visible',await p.evaluate(()=>[...document.querySelectorAll('.lb')].filter(e=>{const c=getComputedStyle(e);return c.display!='none'&&+c.opacity>0&&e.getBoundingClientRect().width>0}).map(e=>e.textContent)),'flb',await p.evaluate(()=>document.querySelector('#flb').textContent+' '+getComputedStyle(document.querySelector('#flb')).opacity));
  await p.screenshot({path:'shots/f3_deskhover.png'});
  const l=await p.evaluate(()=>{const e=document.querySelector('.lmph');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height*.2]});
  await p.mouse.move(l[0],l[1],{steps:4});await W(600);await p.screenshot({path:'shots/f3_lamphover.png'});
  console.log('labels visible2',await p.evaluate(()=>[...document.querySelectorAll('.lb')].filter(e=>{const c=getComputedStyle(e);return c.display!='none'&&+c.opacity>0&&e.getBoundingClientRect().width>0}).map(e=>e.textContent)));
  console.log(errs);await b.close();
})();
