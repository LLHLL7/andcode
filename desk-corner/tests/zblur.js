const { chromium } = require('playwright');
(async () => {
  const [,, file, out, tm] = process.argv;
  const b = await chromium.launch({args:['--use-gl=swiftshader']});
  const p = await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});
  await p.goto('file://'+file); await p.waitForTimeout(3000);
  await p.evaluate(()=>window.__zoom(3)); await p.waitForTimeout(+(tm||600));
  const clip={x:420,y:250,width:600,height:400};
  await p.screenshot({path:out+'_mid.png',clip});
  await p.waitForTimeout(2000);
  await p.screenshot({path:out+'_end.png',clip});
  await p.close(); await b.close();
})();
