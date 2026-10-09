const { chromium } = require('playwright');
(async () => {
  const [,, f] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push('console:'+m.text())});
  await p.goto('file://'+f); await p.waitForTimeout(3000);
  const W=ms=>p.waitForTimeout(ms);
  const zoom=async z=>{await p.evaluate(z=>window.__zoom(z),z);await W(1500);await p.mouse.move(5,5);await p.mouse.move(30,30);await W(200)};
  const clickItem=async (name,fy=.5)=>{const r=await p.evaluate(([n,fy])=>{const e=[...document.querySelectorAll('.it')].find(e=>((e.querySelector('.lb')||{}).textContent||'')==n&&getComputedStyle(e).display!='none');if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height*fy]},[name,fy]);if(!r){console.log('NO ITEM',name);return false}await p.mouse.move(r[0]-20,r[1]);await p.mouse.move(r[0],r[1],{steps:3});await p.mouse.click(r[0],r[1]);await W(900);return true};
  const act=async i=>{await p.click(`#rd [data-a="${i}"]`);await W(400);return p.evaluate(()=>document.querySelector('#ic').textContent)};
  const close=async()=>{if(await p.evaluate(()=>document.querySelector('#rd').classList.contains('on'))){await p.click('#cls');await W(1100)}};
  const inv=()=>p.evaluate(()=>[...document.querySelectorAll('#inv [data-g]')].map(e=>e.dataset.g));
  await zoom(2);
  await clickItem('卷起来的海报',.15); console.log('tube',await act(1)); await W(1300); await close();
  for(const i of [1,2]){await clickItem('蓝晒印象'); console.log('box'+i,await act(i)); await W(1300); await close();}
  await clickItem('一张白纸'); console.log('paper',await act(2)); await W(1300); await close();
  await clickItem('镜头遮光罩'); console.log('hood',await act(0)); await W(1300); await close();
  await clickItem('生理盐水瓶'); console.log('saline',await act(2)); await W(1300); await close();
  await zoom(0); await zoom(3); for(const i of [2,3]){await clickItem('两瓶深色的瓶子',.6); console.log('btl'+i,await act(i)); await W(1300); await close();}
  console.log('inv',await inv(), 'slots', await p.evaluate(()=>document.querySelectorAll('#inv i.g').length));
  await p.screenshot({path:'shots/c2_after_collect.png'});
  await zoom(0); await zoom(6);
  const lh=await p.evaluate(()=>{const e=document.querySelector('.lmph');const r=e.getBoundingClientRect();return [r.x+r.width*.5,r.y+r.height*.2,e.className]});console.log('lamp',lh);
  await p.mouse.move(lh[0]-30,lh[1]);await p.mouse.move(lh[0],lh[1],{steps:3});await W(500);await p.screenshot({path:'shots/c2_lamp_hover.png'});
  for(let i=0;i<3;i++){await p.mouse.click(lh[0],lh[1]);await W(700);console.log('lamp mode',await p.evaluate(()=>window.LMODE));await p.screenshot({path:'shots/c2_lamp_'+i+'.png'})}
  // drag all items to desk
  const dz=await p.evaluate(()=>{const e=document.querySelector('.cydk');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,e.className,r.width|0,r.height|0]});console.log('desk zone',dz);
  for(const k of ['A','B','brush','bowl','paper','ct','saline']){const s=await p.evaluate(k=>{const e=document.querySelector(`#inv [data-g="${k}"]`);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]},k);if(!s){console.log('no inv',k);continue}
    await p.mouse.move(s[0],s[1]);await p.mouse.down();await p.mouse.move(s[0]+30,s[1]+30,{steps:3});
    const dz2=await p.evaluate(()=>{const e=document.querySelector('.cydk');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,e.className]});
    await p.mouse.move(dz2[0],dz2[1],{steps:8});if(k=='A')await p.screenshot({path:'shots/c2_drag.png'});await p.mouse.up();await W(500);}
  console.log('inv after',await inv(),'has',await p.evaluate(()=>Object.keys(__cy.has)));
  await p.mouse.move(10,10);await W(400);await p.screenshot({path:'shots/c2_desk.png'});
  const dz3=await p.evaluate(()=>{const e=document.querySelector('.cydk');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,e.className]});console.log('desk',dz3);
  await p.mouse.move(dz3[0]-20,dz3[1]);await p.mouse.move(dz3[0],dz3[1],{steps:3});await p.mouse.click(dz3[0],dz3[1]);await W(1200);
  console.log('bench',await p.evaluate(()=>document.querySelector('#cy').className),await p.evaluate(()=>document.querySelector('#cym').textContent));
  await p.screenshot({path:'shots/c2_bench0.png'});
  const svgPt=async(x,y)=>p.evaluate(([x,y])=>{const s=document.querySelector('#cys');const m=s.getScreenCTM();return [m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f]},[x,y]);
  const tap=async(x,y,w=900)=>{const q=await svgPt(x,y);await p.mouse.click(q[0],q[1]);await W(w);return p.evaluate(()=>document.querySelector('#cym').textContent)};
  console.log('A',await tap(89,180)); console.log('B',await tap(169,180)); console.log('stir',await tap(300,490,1500));
  for(let row=0;row<9;row++){const y=150+row*38+10;const a=await svgPt(372,y),c=await svgPt(628,y);await p.mouse.move(a[0],a[1]);await p.mouse.down();await p.mouse.move(c[0],c[1],{steps:12});await p.mouse.up();}
  await W(500);console.log('painted',await p.evaluate(()=>[__cy.cells.size,__cy.coat]));
  console.log('dry',await tap(755,500,4800));
  console.log('film',await tap(730,265,1200));
  await p.screenshot({path:'shots/c2_bench_film.png'});
  const lm=await p.evaluate(()=>window.LMODE);console.log('mode now',lm);
  while(await p.evaluate(()=>window.LMODE)!='U'){await tap(930,400,300)}
  await W(4800);console.log('exp',await p.evaluate(()=>[__cy.exp,__cy.expd]));await p.screenshot({path:'shots/c2_bench_exp.png'});
  console.log('lift',await tap(500,300,1000));
  console.log('rinse',await tap(859,280,5000));
  await W(4500); await p.screenshot({path:'shots/c2_result.png'});
  await p.click('#cyok'); await W(4500);
  console.log('inv final',await inv());await p.screenshot({path:'shots/c2_final.png'});
  console.log(errs); await b.close();
})();
