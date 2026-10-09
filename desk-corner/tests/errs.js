const { chromium } = require('playwright');
(async () => {
  const [,, f] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n').slice(0,3).join(' | ')));p.on('console',m=>{if(m.type()=='error')errs.push('console:'+m.text())});
  await p.goto('file://'+f); await p.waitForTimeout(3000);
  console.log(errs, await p.evaluate(()=>typeof window.__openCy));
  await b.close();
})();
