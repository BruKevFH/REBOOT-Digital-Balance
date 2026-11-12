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
async function ready(p){try{await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version,{timeout:15000});}catch(error){const diagnosis=await p.evaluate(()=>({url:location.href,loading:document.readyState,error:document.querySelector('#loading-status')?.textContent,snapshot:Boolean(window.__NOTIFICATION_NINJA__),scripts:[...document.scripts].map(s=>s.src)}));console.error('NINJA_BOOT_DIAGNOSTIC',JSON.stringify(diagnosis));throw error;}}
async function checkNewModes(p,practice,width){
 await p.locator('a[data-game-route="modes"]:visible').click();
 await p.locator('[data-mode-start="daily"]').click();
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='daily');await acknowledge(p);
 let snapshot=await read(p);assert.equal(snapshot.state.maxLives,3);assert.equal(snapshot.state.dailyChallenge.practice,practice);assert.match(snapshot.state.dailyChallenge.day,/^\d{4}-\d{2}-\d{2}$/);
 assert.equal(snapshot.ui,'briefing');
 await goHome(p);
 await p.locator('a[data-game-route="modes"]:visible').click();await p.locator('[data-mode-start="boss-rush"]').click();
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='boss-rush');await acknowledge(p);
 snapshot=await read(p);assert.equal(snapshot.state.boss.id,'scout');assert.equal(snapshot.state.bossRush.index,0);assert.equal(snapshot.state.maxLives,3);
 assert.match(await p.locator('.boss-briefing-panel').innerText(),/Fokus-Symbole/);
 await p.screenshot({path:path.join(output,'boss-rush-'+width+'.png')});
 await goHome(p);
}
async function goHome(p){await p.evaluate(()=>{location.hash='#worlds';});await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__?.getSnapshot().ui==='home');}
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
    if(width===768){
       const introPage=await context.newPage();
       await introPage.goto(base+'home.html');
       assert.equal(await introPage.locator('article.situation-card').count(),3,'info-only world previews');
       assert.equal(await introPage.locator('a[href*="?quick="]').count(),0,'no direct quick launch');
       assert.equal(await introPage.locator('.access-choices a').count(),3,'three explicit access routes');
       await introPage.locator('.access-choices a[href$="#guest"]').click();
       await ready(introPage);await acknowledge(introPage);
       const guestSnapshot=await read(introPage);
       assert.equal(guestSnapshot.ui,'home','guest enters dojo first');
       assert.equal(guestSnapshot.state.started,false,'guest link does not auto-start a run');
       assert.equal(guestSnapshot.session.kind,'guest');
       await introPage.close();
      }
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
     assert.equal(await page.locator('#ninja-hub .hub-play').count(),0,'No duplicate mission shortcut on hub');
     assert.equal(await page.locator('#ninja-hub h1').isVisible(),true,'hub shows the player name');
     assert.equal(await page.locator('#dojo-rooms').evaluate(el=>el.open),false);
     await page.locator('a[data-game-route="modes"]:visible').click();
     assert.equal((await read(page)).ui,'modes');
     assert.equal(await page.locator('.arcade-mode-quest .nn-quest-scene img').count(),4,'Each mode has distinct illustrated artwork');
     const modesFit=await page.locator('.arcade-mode-quest').evaluateAll(nodes=>nodes.every(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;}));
     assert(modesFit,'Mode posters must fit within phone width');
     await page.screenshot({path:path.join(output,'mint-modes-'+width+'.png')});
     await page.locator('.nn-mobile-nav [data-game-route="dojos"]').click();await acknowledge(page);
     assert.equal((await read(page)).ui,'dojos');
     assert.equal(await page.locator('.nn-mint-world-grid .nn-world-poster').count(),4,'Four illustrated world posters');
     assert.equal(await page.locator('.nn-mint-world-grid [data-world-enter]').count(),3,'Three familiar short-round Dojos');
     assert.equal(await page.locator('.nn-mint-world-grid [data-mode-start="master"]').count(),1,'Mixed Balance Master portal');
     const worldsFit=await page.locator('.nn-mint-world-grid .nn-world-poster').evaluateAll(nodes=>nodes.every(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&r.width>100;}));
     assert(worldsFit,'Dojo posters must fit within phone width');
     await page.screenshot({path:path.join(output,'mint-worlds-'+width+'.png')});
     await goHome(page);
     assert.equal(await page.locator('.dojo-tabs [data-game-route]').count(),6,'Six clear navigation choices');
      assert.equal(await page.locator('.nn-mobile-nav [data-game-route]').count(),6,'Mobile navigation contains every destination');
      assert.equal(await page.locator('.nn-mobile-nav [data-game-route="bazaar"]').isVisible(),true,'Bazaar is visible on phones');
      const bazaarRect=await page.locator('.nn-mobile-nav [data-game-route="bazaar"]').boundingBox();
      assert(bazaarRect&&bazaarRect.x>=0&&bazaarRect.x+bazaarRect.width<=width+1,'Bazaar tab fits the phone screen');
      await page.locator('.nn-mobile-nav [data-game-route="bazaar"]').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'shop','Phone Bazaar button opens the real shop');
      assert.equal(await page.locator('.nn-mobile-nav [data-game-route="campaign"]').isVisible(),true,'Dock stays accessible in shop');
      await page.locator('.nn-mobile-nav [data-game-route="campaign"]').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'career','Switch between screens without finding a back button');
      await goHome(page);
     assert.equal(await page.locator('#hub-paths .hub-path-card').count(),0,'Navigation is in the main tabs');
     assert.equal(await page.locator('.nn-home-guide').isVisible(),width>760,'Mobile skips duplicate navigation explanation');
     assert.equal(await page.locator('#adventure-details').isVisible(),false,'The duplicated discovery block is hidden');
     assert.equal(await page.locator('#dojo-rooms').isVisible(),false,'The duplicated dojo selector is hidden');
     await page.screenshot({path:path.join(output,'hub-'+width+'.png')});
    }else{
     await page.locator('[data-account="guest"]').click();await acknowledge(page);
     assert.equal((await read(page)).ui,'home');
     assert.equal(await page.locator('#ninja-hub h1').isVisible(),true,'hub shows the player name');
     assert.equal(await page.locator('.dojo-tabs [data-game-route]').count(),6,'Six clear navigation choices');
      assert.equal(await page.locator('.nn-mobile-nav [data-game-route]').count(),6,'Phone and desktop navigation share six destinations');
      assert.equal(await page.locator('.nn-mobile-nav').isVisible(),false,'Dock hidden on tablet/desktop');
     assert.equal(await page.locator('#hub-paths .hub-path-card').count(),0,'Navigation is in the main tabs');
     assert.equal(await page.locator('.nn-home-guide').isVisible(),width>760,'Mobile skips duplicate navigation explanation');
     assert.equal(await page.locator('#adventure-details').isVisible(),false,'The duplicated discovery block is hidden');
     assert.equal(await page.locator('#dojo-rooms').isVisible(),false,'The duplicated dojo selector is hidden');
     await page.screenshot({path:path.join(output,'hub-'+width+'.png')});
     if(width===768){
      await page.locator('a[data-game-route="modes"]:visible').click();await acknowledge(page);await page.locator('[data-mode-start="open"]').click();
      await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='open');
      await acknowledge(page);
      assert.notEqual((await read(page)).ui,'home','Open Run shortcut really starts game');
      await goHome(page);
     }
     if(width===768){
      await page.locator('a[data-game-route="modes"]:visible').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'modes');
      assert.equal(await page.locator('.arcade-mode-portal').count(),2,'two illustrated portals');
      assert.equal(await page.locator('.arcade-mode-quest').count(),4,'four secondary adventures');
      assert.equal(await page.locator('.arcade-theme-strip [data-ninja-theme]').count(),0,'Appearance is only changed in Settings');
      const before=await page.locator('.arcade-sticky-header').evaluate(el=>el.getBoundingClientRect().top);
      await page.locator('.legend-modes-panel').evaluate(el=>el.scrollTop=340);
      const after=await page.locator('.arcade-sticky-header').evaluate(el=>el.getBoundingClientRect().top);
      assert(Math.abs(before-after)<5,'Back and Overview remain at top when scrolling');
      await goHome(page);await page.locator('a[data-game-route="dojos"]:visible').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'dojos','Worlds portal opens real illustrated worlds');
      await goHome(page);await page.locator('a[data-game-route="modes"]:visible').click();await acknowledge(page);assert.equal((await read(page)).ui,'modes','Modes remain available from their unique navigation tab');
      await goHome(page);await acknowledge(page);
      assert.equal((await read(page)).ui,'home','Overview returns to home hub');
     }
     if(width===768){
      await page.locator('a[data-game-route="dojos"]:visible').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'dojos','Dojo navigation opens illustrated worlds');
      assert.equal(await page.locator('.legend-dojo').count(),4,'Three themed Dojos plus Balance Master');
       assert.equal(await page.locator('.nn-village-stage [data-mode-start="master"]').count(),1,'Balance Master is a real mixed context mode');
      assert.equal(await page.locator('.legend-dojo [data-world-enter]').count(),3);
       assert.equal(await page.locator('.nn-village-stage').isVisible(),true,'Illustrated world stage is visible');
       assert.equal(await page.locator('.nn-village-gates').evaluate(el=>getComputedStyle(el).display),'grid','Responsive village uses the four-poster 2×2 world grid');
       assert.equal(await page.locator('.nn-village-gate-study').evaluate(el=>getComputedStyle(el).position),'relative','Tablet village uses themed dojo houses, not old image cards');
       assert.equal(await page.locator('.nn-village-landscape').count(),1,'One shared illustrated landscape');
      assert.equal(await page.locator('.legend-dojo [data-game-route="campaign"]').count(),0,'Dojo worlds must not navigate into campaign');
      await page.locator('.legend-dojo [data-world-enter="sleep"]').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'world','World detail is not a campaign mission');
      assert.equal(await page.locator('.world-inside-sleep [data-quick-context="sleep"]').count(),1);
      await page.locator('.panel-back').click();
      await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='dojos');await acknowledge(page);
      await goHome(page);await acknowledge(page);
      assert.equal((await read(page)).ui,'home');
      await page.locator('a[data-game-route="campaign"]:visible').click();await acknowledge(page);
      assert.equal((await read(page)).ui,'career','Campaign is a separate primary hub route');
      assert.equal(await page.locator('.nn-career-chapter-trail .nn-career-node').count(),18);
       assert.equal(await page.locator('.nn-career-chapter-trail').first().evaluate(el=>getComputedStyle(el).display),'block','The adventure trail should be a map, not the previous grid');
       assert.equal(await page.locator('.nn-career-chapter-trail .nn-career-node').first().evaluate(el=>getComputedStyle(el).position),'absolute','Mission stones follow positions along the map');
      assert.equal(await page.locator('.nn-career-boss').count(),3);
      await page.locator('[data-mission-inspect="study-02"]').click();await acknowledge(page);
      assert.equal(await page.locator('.nn-career-detail h4').innerText(),'Genau statt hektisch');
      assert.equal(await page.locator('.nn-career-chapter-study .nn-career-direct-start').count(),1,'Only the unlocked starting stone can launch');
      assert.equal(await page.locator('.nn-career-chapter-sleep .nn-career-direct-start').count(),0,'Locked chapter has no direct launch');
      await page.locator('.nn-career-chapter-study .nn-career-direct-start').first().click();
      await page.waitForFunction(()=>window.__NOTIFICATION_NINJA__?.getSnapshot().ui==='briefing');
      assert.equal((await read(page)).state.missionId,'study-01','Level 01 itself launches the actual mission');
      await goHome(page);await acknowledge(page);
      assert.equal((await read(page)).ui,'home');
     }
     if(width===1280){
      await page.locator('a[data-game-route="dojos"]:visible').click();await acknowledge(page);
      assert.equal(await page.locator('.nn-village-gates').evaluate(el=>getComputedStyle(el).display),'block','Desktop must use the illustrated landscape, not the old 3-card grid');
      assert.equal(await page.locator('.nn-village-gate-study').evaluate(el=>getComputedStyle(el).position),'absolute','Desktop dojo buildings are positioned on the interactive map');
      assert((await page.locator('.nn-village-stage').boundingBox()).height>=650,'World village should have a full illustrated scene');
      await page.screenshot({path:path.join(output,'illustrated-village-desktop.png')});
      await goHome(page);await acknowledge(page);
      await page.locator('a[data-game-route="campaign"]:visible').click();await acknowledge(page);
      assert.equal(await page.locator('.nn-career-chapter-trail .nn-career-node').first().evaluate(el=>getComputedStyle(el).position),'absolute','Desktop career must use a winding illustrated map, not the old mission-card grid');
      await page.screenshot({path:path.join(output,'illustrated-career-desktop.png')});
      await goHome(page);await acknowledge(page);
     }
     await page.locator('a[data-game-route="bazaar"]:visible').click();await acknowledge(page);
     assert.equal(await page.locator('[data-shop-tab]').count(),2,'only worlds and skins in shop');
      assert.equal(await page.locator('[data-shop-tab="backgrounds"]').count(),0,'no mismatched scenes offered');
      await page.locator('[data-shop-filter="owned"]').click();
     assert.equal(await page.locator('.shop-card.is-locked:visible').count(),0);
     await page.locator('[data-shop-filter="new"]').click();
     assert.equal(await page.locator('.shop-card.is-owned:visible').count(),0);
     await goHome(page);
     const before=(await read(page)).profile;
     await page.locator('a[data-game-route="modes"]:visible').click();
     assert.equal((await read(page)).ui,'modes');
     await page.locator('.legend-mode-small[data-game-route="practice"]').click();assert.equal((await read(page)).ui,'practice');
     assert.deepEqual((await read(page)).profile,before,'practice does not alter guest progression');
     await page.keyboard.press('Escape');await acknowledge(page);
    }
    await checkNewModes(page,!created,width);
    const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert(geometry.scroll<=geometry.width+1,'no horizontal page overflow');
    await goHome(page);await page.locator('#profile-button').click();await acknowledge(page);await page.locator('.nn-profile-control [data-action="settings"]').click();await page.locator('[data-settings-language="en"]').click();await goHome(page);
    assert.equal((await read(page)).language,'en');
    if(!created){await page.locator('#profile-button').click();await acknowledge(page);await page.locator('.nn-profile-control [data-account-view="login"]').click();await page.locator('[data-account="register"]').click();assert.match(await page.locator('[data-account-form="register"]').innerText(),/Email address/);assert.deepEqual((await read(page)).translation.missing,[]);await page.screenshot({path:path.join(output,'registration-en-'+width+'.png')});}
    assert.deepEqual(errors,[]);
    console.log('PORTAL PASS',width);
   }finally{
    if(created){const result=await context.request.delete(new URL('/api/v3/account',base).href,{headers:{Authorization:'Bearer '+created.token},data:{password:created.password}});assert.equal(result.status(),200,'test account cleanup');}
    await context.close();
   }
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
