const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:8034/');await page.waitForTimeout(1900);
 assert.equal(await page.locator('.studio-explore').getAttribute('href'),'about.html');
 await page.locator('.studio-explore').click();await page.waitForFunction(()=>document.querySelector('.cinema-door')?.dataset.phase==='camera');assert(await page.locator('.studio-art').evaluate(e=>getComputedStyle(e).transform!=='none'));
 await page.waitForFunction(()=>document.querySelector('.cinema-door')?.dataset.phase==='doorway');assert(await page.locator('.cinema-panel-left').evaluate(e=>getComputedStyle(e).transform!=='none'));
 await page.waitForFunction(()=>document.querySelector('.cinema-door')?.dataset.phase==='access');assert.equal(await page.locator('.cinema-title').innerText(),'NEW LEVEL UNLOCKED');await page.screenshot({path:`/tmp/dee-cinema-${viewport.width}.png`});
 await page.waitForFunction(()=>document.querySelector('.cinema-door')?.dataset.phase==='level');await page.waitForURL('**/about.html');assert.match(await page.locator('main').innerText(),/Deniqua/);
 await page.goBack();assert.equal(await page.locator('.cinema-door').count(),0);assert.equal(await page.locator('main').evaluate(e=>e.inert),false);
 await page.locator('.studio-explore').click();await page.keyboard.press('Escape');assert.equal(await page.locator('.cinema-door').count(),0);assert.equal(await page.locator('.studio-explore').evaluate(e=>e===document.activeElement),true);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.studio-explore').click();await page.waitForURL('**/about.html');assert.deepEqual(errors,[]);await page.close();
}
const fallback=await browser.newPage();await fallback.goto('http://localhost:8034/');await fallback.waitForTimeout(1900);await fallback.locator('.studio-explore').click();await fallback.evaluate(()=>{document.querySelector('.studio-explore').click();gsap.globalTimeline.pause();});assert.equal(await fallback.locator('.cinema-door').count(),1);await fallback.waitForURL('**/about.html',{timeout:7000});await fallback.close();
const missing=await browser.newPage();await missing.route('**/vendor/gsap.min.js',route=>route.abort());await missing.goto('http://localhost:8034/');await missing.locator('.studio-explore').click();await missing.waitForURL('**/about.html');await missing.close();
const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://localhost:8034/');await page.locator('.studio-explore').click();await page.waitForURL('**/about.html');await context.close();await browser.close();console.log('Desktop and mobile camera, doorway, title, original About content, Back, Escape, reduced motion, no JavaScript, and console checks passed.');})();
