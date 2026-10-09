const { chromium } = require('playwright');
(async () => {
  const [,, file, out] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://'+file); await p.waitForTimeout(2500);
  await p.evaluate(()=>window.__zoom(2)); await p.waitForTimeout(1500);
  for (const [name,act] of [['手机',3],['一张白纸',2],['蓝晒印象',1]]) {
    await p.evaluate(n=>[...document.querySelectorAll('.it')].find(e=>e.querySelector('.lb')?.textContent==n).click(), name);
    await p.waitForTimeout(900);
    await p.click(`#ins .ab button[data-a="${act}"]`);
    await p.waitForTimeout(450); await p.screenshot({path:`${out}_${name}_mid.png`});
    await p.waitForTimeout(900); await p.screenshot({path:`${out}_${name}_end.png`});
    console.log(name, await p.evaluate(()=>({rd:document.querySelector('#rd').className, inv:[...document.querySelectorAll('#inv i.g.f')].map(i=>i.title), fly:document.querySelectorAll('.flyi').length})));
  }
  // re-open the box and close normally still works
  await p.evaluate(()=>[...document.querySelectorAll('.it')].find(e=>e.querySelector('.lb')?.textContent=='蓝晒印象').click()); await p.waitForTimeout(900);
  await p.click('#cls'); await p.waitForTimeout(1200); console.log('reopen/close', await p.evaluate(()=>document.querySelector('#rd').className));
  console.log(errs); await b.close();
})();
