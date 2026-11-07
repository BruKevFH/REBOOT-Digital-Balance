// Local acceptance for the registration portal, privacy guard, guest save and hub.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(base).hostname))throw Error('Use a local test instance.');
const output=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-portal');
const version=JSON.parse(fs.readFileSync(path.join(__dirname,'../notification-ninja/dist/build.json'))).version;
const read=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
async function ready(p){await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version);}
async function checkNewModes(p,practice,width){
 await p.locator('.dojo-tabs [data-game-route="modes"]').click();
 await p.locator('[data-mode-start="daily"]').click();
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='daily');await acknowledge(p);
 let snapshot=await read(p);assert.equal(snapshot.state.maxLives,3);assert.equal(snapshot.state.dailyChallenge.practice,practice);assert.match(snapshot.state.dailyChallenge.day,/^\d{4}-\d{2}-\d{2}$/);
 assert.equal(snapshot.ui,'briefing');
 await p.locator('[data-action="home"]').first().click();
 await p.locator('.dojo-tabs [data-game-route="modes"]').click();await p.locator('[data-mode-start="boss-rush"]').click();
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='boss-rush');await acknowledge(p);
 snapshot=await read(p);assert.equal(snapshot.state.boss.id,'scout');assert.equal(snapshot.state.bossRush.index,0);assert.equal(snapshot.state.maxLives,3);
 assert.match(await p.locator('.boss-briefing-panel').innerText(),/Fokus-Symbole/);
 await p.screenshot({path:path.join(output,'boss-rush-'+width+'.png')});
 await p.locator('[data-action="home"]').first().click();
}
async function acknowledge(p){for(let n=0;n<20&&(await read(p)).mentor.open;n++)await p.locator('#mentor-next').click();}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
 try{
  for(const width of [360,768,1280]){
   const context=await browser.newContext({viewport:{width,height:width===360?844:960}}),page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let created=null;
   try{
    await page.goto(base+'#register');await ready(page);
    assert.equal(await page.locator('[data-account-form="register"]').count(),1);
    await page.locator('[name="username"]').fill('qa'+Date.now().toString(36)+width);
    await page.locator('[name="email"]').fill('qa-'+crypto.randomUUID()+'@example.invalid');
    const password='Test-'+crypto.randomUUID();
    await page.locator('[name="password"]').fill(password);
    await page.locator('[name="passwordConfirmation"]').fill('Different-password');
    await page.locator('[name="privacyAccepted"]').check();await page.locator('[name="understood"]').check();
    let registrations=0;page.on('request',request=>{if(request.url().endsWith('/auth/register'))registrations++;});
    await page.locator('.account-submit').click();
    assert.match(await page.locator('#account-error').innerText(),/stimmen nicht überein/);
    assert.equal(registrations,0,'password mismatch must not submit a signup');
    await page.locator('[name="passwordConfirmation"]').fill(password);
    await page.locator('[name="privacyAccepted"]').uncheck();await page.locator('.account-submit').click();
    assert.equal(registrations,0,'privacy consent is required');
    assert.equal(await page.locator('[name="privacyAccepted"]').evaluate(el=>el.validity.valueMissing),true);
    await page.screenshot({path:path.join(output,'registration-'+width+'.png')});
    if(width===360){
     await page.locator('[name="privacyAccepted"]').check();await page.locator('.account-submit').click();
     await page.locator('[data-account-form="acknowledge-key"]').waitFor();
     created=await page.evaluate(()=>{const data=JSON.parse(sessionStorage.getItem('notification-ninja:account-session:v3'));return {token:data.token};});
     created.password=password;
     await page.locator('[name="saved"]').check();await page.locator('.account-submit').click();await acknowledge(page);
     assert.equal((await read(page)).ui,'home');
     assert.equal(await page.locator('#ninja-hub .hub-play').count(),1);
     assert.equal(await page.locator('#ninja-hub h1').isVisible(),true,'hub shows the player name');
     assert.equal(await page.locator('#dojo-rooms').evaluate(el=>el.open),false);
     await page.locator('.dojo-tabs [data-game-route="modes"]').click();
     assert.equal((await read(page)).ui,'modes');
     await page.locator('[data-action="home"]').last().click();
     assert.equal(await page.locator('.dojo-tabs [data-game-route]').count(),6,'Six clear navigation choices');
     assert.equal(await page.locator('#hub-paths .hub-path-card').count(),3,'Three direct activity choices');
     assert.equal(await page.locator('#hub-paths').isVisible(),true,'Quick choices are visible without expanding options');
     assert.equal(await page.locator('#adventure-details').evaluate(el=>el.open),false,'Advanced controls start closed');
     assert.equal(await page.locator('#dojo-rooms').evaluate(el=>el.open),false,'Optional dojo selector starts closed');
     await page.screenshot({path:path.join(output,'hub-'+width+'.png')});
    }else{
     await page.locator('[data-account="guest"]').click();await acknowledge(page);
     assert.equal((await read(page)).ui,'home');
     assert.equal(await page.locator('#ninja-hub h1').isVisible(),true,'hub shows the player name');
     assert.equal(await page.locator('.dojo-tabs [data-game-route]').count(),6,'Six clear navigation choices');
     assert.equal(await page.locator('#hub-paths .hub-path-card').count(),3,'Three direct activity choices');
     assert.equal(await page.locator('#hub-paths').isVisible(),true,'Quick choices are visible without expanding options');
     assert.equal(await page.locator('#adventure-details').evaluate(el=>el.open),false,'Advanced controls start closed');
     assert.equal(await page.locator('#dojo-rooms').evaluate(el=>el.open),false,'Optional dojo selector starts closed');
     await page.screenshot({path:path.join(output,'hub-'+width+'.png')});
     if(width===768){
      await page.locator('[data-hub-shortcut="open"]').click();
      await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='open');
      await acknowledge(page);
      assert.notEqual((await read(page)).ui,'home','Open Run shortcut really starts game');
      await page.locator('[data-action="home"]').first().click();
     }
     if(width===768){
      await page.locator('.dojo-tabs [data-game-route="dojos"]').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'dojos','Dojo navigation opens illustrated worlds');
      assert.equal(await page.locator('.legend-dojo').count(),3,'Three real themed worlds');
      assert.equal(await page.locator('.legend-dojo [data-quick-context]').count(),3);
      await page.locator('.legend-dojo [data-game-route="campaign"]').first().click();await acknowledge(page);
      assert.equal((await read(page)).ui,'career','Dojo route opens campaign');
      assert.equal(await page.locator('.legend-map-node').count(),18);
      assert.equal(await page.locator('.legend-boss-node').count(),3);
      await page.locator('[data-mission-inspect="study-02"]').click();await acknowledge(page);
      assert.equal(await page.locator('.legend-mission-inspector h3').innerText(),'Genau statt hektisch');
      await page.locator('.panel-home').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'home');
     }
     await page.locator('.home-access-tools [data-game-route="bazaar"]').click();await acknowledge(page);
     await page.locator('[data-shop-filter="owned"]').click();
     assert.equal(await page.locator('.shop-card.is-locked:visible').count(),0);
     await page.locator('[data-shop-filter="new"]').click();
     assert.equal(await page.locator('.shop-card.is-owned:visible').count(),0);
     await page.locator('[data-action="home"]').first().click();
     const before=(await read(page)).profile;
     await page.locator('.dojo-tabs [data-game-route="modes"]').click();
     assert.equal((await read(page)).ui,'modes');
     await page.locator('.legend-mode-small[data-game-route="practice"]').click();assert.equal((await read(page)).ui,'practice');
     assert.deepEqual((await read(page)).profile,before,'practice does not alter guest progression');
     await page.keyboard.press('Escape');await acknowledge(page);
    }
    await checkNewModes(page,!created,width);
    const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert(geometry.scroll<=geometry.width+1,'no horizontal page overflow');
    await page.locator('[data-language="en"]').filter({visible:true}).first().click();
    assert.equal((await read(page)).language,'en');
    if(!created){await page.locator('.home-access-tools [data-account-view="profile"]').click();await page.locator('[data-account="register"]').click();assert.match(await page.locator('[data-account-form="register"]').innerText(),/Email address/);assert.deepEqual((await read(page)).translation.missing,[]);await page.screenshot({path:path.join(output,'registration-en-'+width+'.png')});}
    assert.deepEqual(errors,[]);
    console.log('PORTAL PASS',width);
   }finally{
    if(created){const result=await context.request.delete(new URL('/api/v3/account',base).href,{headers:{Authorization:'Bearer '+created.token},data:{password:created.password}});assert.equal(result.status(),200,'test account cleanup');}
    await context.close();
   }
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
