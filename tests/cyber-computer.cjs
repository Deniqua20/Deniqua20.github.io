const {chromium}=require('playwright');const assert=require('node:assert/strict');
const BASE=process.env.DEE_TEST_BASE_URL||'http://localhost:8034';
const intro='Cyber Corner, where authenticity meets faith. Here, I share my experiences, lessons learned, and the highs and lows of my journey in tech.';
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const doc=await browser.newPage();await doc.goto(BASE+'/blog.html');const original=await doc.locator('.story-library').innerText();await doc.close();
 for(const viewport of [{width:1440,height:900},{width:768,height:1024},{width:390,height:844}]){
  const p=await browser.newPage({viewport});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(BASE+'/');await p.waitForTimeout(1900);
  assert.equal(await p.locator('#navigation a').count(),6);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await p.locator('.studio-art').getAttribute('src'),'assets/images/cyber-studio-titled-books.webp');
  const stream=p.locator('.hq-log-stream');const before=await stream.evaluate(e=>getComputedStyle(e).transform);await p.waitForTimeout(1500);assert.notEqual(await stream.evaluate(e=>getComputedStyle(e).transform),before);
  await p.getByRole('button',{name:'Pause monitor activity',exact:true}).click();assert.equal(await stream.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');await p.getByRole('button',{name:'Resume monitor activity',exact:true}).click();
  // Verify the overlay maps image pixels using the real responsive crop.
  assert(await p.locator('.hq-screens').evaluate(e=>e.getBoundingClientRect().width>0));
  const launch=viewport.width>1000?p.locator('.hq-computer'):p.locator('.studio-stories');await launch.focus();await p.keyboard.press('Enter');await p.locator('.hq-console').waitFor();
  await p.evaluate(()=>document.querySelector('.studio-stories').click());assert.equal(await p.locator('.hq-console').count(),1);
  await p.waitForTimeout(1500);assert.equal(await p.locator('.hq-boot').count(),3);await p.screenshot({path:`/tmp/hq-load-${viewport.width}.png`});
  await p.waitForURL('**/blog.html');await p.locator('.hq-blog-shell').waitFor();await p.waitForFunction(()=>getComputedStyle(document.querySelector('.hq-blog-shell')).opacity==='1');
  assert.equal((await p.locator('.cyber-corner-intro > p:last-child').innerText()).replace(/\s+/g,' ').trim(),intro);
  assert.equal(await p.locator('.hq-blog-shell .story-library').innerText(),original);
  assert.equal(await p.locator('.hq-blog-shell form').count(),0);await p.screenshot({path:`/tmp/hq-blog-${viewport.width}.png`});
  await p.locator('.hq-return').click();await p.waitForURL(BASE+'/');await p.waitForFunction(()=>!document.body.classList.contains('hq-computer-playing'));assert.equal(await p.locator('main').evaluate(e=>e.inert),false);
  await p.goForward();await p.locator('.hq-blog-shell').waitFor();await p.goBack();await p.waitForFunction(()=>!document.body.classList.contains('hq-computer-playing'));
  await p.locator('.studio-stories').click();await p.keyboard.press('Escape');assert.equal(await p.locator('.hq-console').count(),0);assert.equal(await p.locator('main').evaluate(e=>e.inert),false);
  await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await stream.evaluate(e=>getComputedStyle(e).animationName),'none');await p.locator('.studio-stories').click();await p.waitForURL('**/blog.html');assert.equal(await p.locator('.hq-console').count(),0);assert.deepEqual(errors,[]);await p.close();
 }
 // A failed fetch must open the existing standalone blog instead of stranding the visitor.
 const fail=await browser.newPage();await fail.route('**/blog.html',route=>route.request().resourceType()==='fetch'?route.abort():route.continue());await fail.goto(BASE+'/');await fail.locator('.studio-stories').click();await fail.waitForURL('**/blog.html');assert.equal(await fail.locator('.story-card').count()>0,true);await fail.close();
 const nojs=await browser.newContext({javaScriptEnabled:false});const n=await nojs.newPage();await n.goto(BASE+'/');await n.locator('.studio-stories').click();await n.waitForURL('**/blog.html');assert.equal(await n.locator('.hq-return').getAttribute('href'),'index.html');await nojs.close();
 await browser.close();console.log('Desktop, tablet, mobile, simulated monitor motion, pause, keyboard activation, repeated clicks, blog copy/post preservation, Return, Back/Forward, Escape, reduced motion, fetch failure and no JavaScript passed.');
})();
