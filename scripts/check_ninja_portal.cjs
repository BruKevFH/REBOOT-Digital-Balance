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
async function ready(p){try{await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version,{timeout:15000});}catch(error){const diagnosis=await p.evaluate(()=>({url:location.href,loading:document.readyState,error:document.querySelector('#loading-status')?.textContent,snapshot:Boolean(window.__NOTIFICATION_NINJA__),scripts:[...document.scripts].map(script=>script.src)}));console.error('NINJA_BOOT_DIAGNOSTIC',JSON.stringify(diagnosis));throw error;}}
async function goHome(p){
 await acknowledge(p);
 const close=p.locator('#account-root [data-account="close"]').first();if(await close.isVisible())await close.click();
 const tab=p.locator('.indie-bottom-nav [data-game-route="home"]');
 if(await tab.isVisible())await tab.click();else await p.locator('[data-action="home"]:visible').first().click();
 await acknowledge(p);assert.equal((await read(p)).ui,'home');
}
async function checkNewModes(p,practice,width){
 await p.locator('.indie-bottom-nav [data-game-route="play"]').click();
 await p.locator('[data-mode-start="daily"]').click();
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='daily');await acknowledge(p);
 let snapshot=await read(p);assert.equal(snapshot.state.maxLives,3);assert.equal(snapshot.state.dailyChallenge.practice,practice);assert.match(snapshot.state.dailyChallenge.day,/^\d{4}-\d{2}-\d{2}$/);
 assert.equal(snapshot.ui,'briefing');
 await goHome(p);
 await p.locator('.indie-bottom-nav [data-game-route="play"]').click();await p.locator('[data-mode-start="boss-rush"]').click();
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().state.mode==='boss-rush');await acknowledge(p);
 snapshot=await read(p);assert.equal(snapshot.state.boss.id,'scout');assert.equal(snapshot.state.bossRush.index,0);assert.equal(snapshot.state.maxLives,3);
 assert.match(await p.locator('.boss-briefing-panel').innerText(),/Fokus-Symbole/);
 await p.screenshot({path:path.join(output,'boss-rush-'+width+'.png')});
 await goHome(p);
}
async function checkCareer(p){
 await goHome(p);await p.locator('.indie-bottom-nav [data-game-route="campaign"]').click();await acknowledge(p);
 assert.equal((await read(p)).ui,'career');
 assert.equal(await p.locator('.nn-career-chapter-trail .nn-career-node').count(),18,'All real main missions remain available through the career map');
 assert.equal(await p.locator('.nn-career-boss').count(),3,'Three authored bosses are preserved');
 await p.locator('[data-mission-inspect="study-02"]').click();await acknowledge(p);
 assert.equal(await p.locator('.nn-career-detail h4').innerText(),'Genau statt hektisch');
 assert.equal(await p.locator('.nn-career-detail [data-mission-start="study-02"]').isDisabled(),true,'Inspecting a locked mission cannot bypass its prerequisite');
 assert.equal(await p.locator('.nn-career-chapter-study .nn-career-direct-start').count(),1,'Only the first unlocked stone can launch');
 assert.equal(await p.locator('.nn-career-chapter-sleep .nn-career-direct-start').count(),0,'A locked chapter has no launch shortcut');
 await p.locator('.nn-career-chapter-study .nn-career-direct-start').first().click();
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__?.getSnapshot().ui==='briefing');
 assert.equal((await read(p)).state.missionId,'study-01','The map launches the actual mission');
 await goHome(p);
}
async function checkMfa(p,created){
 let stage='open security settings';
 try{
  const {testMfaCode}=await import('../server/ninja-mfa.mjs');
  await goHome(p);await p.locator('.indie-bottom-nav [data-game-route="play"]').click();
  await p.locator('[data-account-view="profile"]:visible').click();
  await p.locator('[data-account="mfa-setup"]').click();
  stage='confirm enrollment password';
  await p.locator('[data-account-form="mfa-setup"] [name="password"]').fill(created.password);
  await p.locator('[data-account-form="mfa-setup"] button[type="submit"]').click();
  stage='enroll authenticator';
  const secret=await p.locator('#mfa-setup-secret').inputValue();
  if(!/^[A-Z2-7]{32}$/.test(secret))throw Error('Invalid setup response');
  const timeResponse=await p.context().request.get(new URL('/api/v3/me',base).href,{headers:{Authorization:'Bearer '+created.token}});
  const serverNow=(await timeResponse.json()).serverNow;
  await p.locator('[data-account-form="mfa-confirm"] [name="code"]').fill(testMfaCode(secret,Math.floor(serverNow/30000)));
  await p.locator('[data-account-form="mfa-confirm"] button[type="submit"]').click();
  stage='retain private recovery codes';
  const codes=(await p.locator('#mfa-recovery-codes').inputValue()).trim().split(/\s+/);
  if(codes.length!==10||!codes.every(code=>/^NNM-[A-Za-z0-9_-]{27}$/.test(code)))throw Error('Invalid recovery-code response');
  created.backupCodes=[...codes];
  await p.locator('[data-account-form="mfa-ack"] [name="saved"]').check();
  await p.locator('[data-account-form="mfa-ack"] button[type="submit"]').click();
  await p.locator('[data-account="mfa-disable"]').waitFor();
  stage='require second factor on fresh login';
  await p.locator('[data-account="logout"]').click();
  await p.locator('[data-account-view="login"]:visible').first().click();
  await p.locator('[data-account-form="login"] [name="username"]').fill(created.username);
  await p.locator('[data-account-form="login"] [name="password"]').fill(created.password);
  await p.locator('[data-account-form="login"] button[type="submit"]').click();
  await p.locator('[data-account-form="mfa-login"]').waitFor();
  assert.equal(await p.evaluate(()=>Boolean(sessionStorage.getItem('notification-ninja:account-session:v3'))),false,'Password alone does not create a session');
  stage='complete second factor';
  await p.locator('[data-account-form="mfa-login"] [name="code"]').fill(created.backupCodes[0]);
  await p.locator('[data-account-form="mfa-login"] button[type="submit"]').click();
  await p.waitForFunction(()=>{const state=window.__NOTIFICATION_NINJA__?.getSnapshot();return state?.session.kind==='account'&&state.ui==='home';});
  created.backupCodes.shift();
  created.token=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('notification-ninja:account-session:v3')).token);
  stage='verify one-time recovery consumption';
  const status=await p.context().request.get(new URL('/api/v3/mfa/status',base).href,{headers:{Authorization:'Bearer '+created.token}});
  const state=await status.json();assert.equal(state.enabled,true);assert.equal(state.recoveryCodesRemaining,9);
  stage='open security after MFA login';
  await goHome(p);await p.locator('.indie-bottom-nav [data-game-route="play"]').click();
  await p.locator('[data-account-view="profile"]:visible').click();
  stage='open disable form';await p.locator('[data-account="mfa-disable"]').click();
  stage='fill disable credentials';
  await p.locator('[data-account-form="mfa-disable"] [name="password"]').fill(created.password);
  await p.locator('[data-account-form="mfa-disable"] [name="code"]').fill(created.backupCodes[0]);
  stage='submit disable form';await p.locator('[data-account-form="mfa-disable"] button[type="submit"]').click();
  stage='wait for disabled status';
  await p.locator('[data-account="mfa-setup"]').waitFor({timeout:5000});created.backupCodes=[];
  const disabled=await p.context().request.get(new URL('/api/v3/mfa/status',base).href,{headers:{Authorization:'Bearer '+created.token}});
  assert.equal(disabled.status(),200);assert.equal((await disabled.json()).enabled,false);
  stage='return home after disabling';await goHome(p);console.log('MFA UI PASS: enrollment, challenged login, one-time recovery and disabling');
 }catch(error){
  const safe=await p.evaluate(()=>({ui:window.__NOTIFICATION_NINJA__?.getSnapshot().ui,title:document.querySelector('#account-title')?.textContent,forms:[...document.querySelectorAll('[data-account-form]')].map(form=>form.dataset.accountForm),message:document.querySelector('#account-error')?.textContent,mfaStatus:document.querySelector('#account-mfa-status')?.textContent})).catch(()=>({closed:true}));
  if(stage==='wait for disabled status'){
   const response=await p.context().request.get(new URL('/api/v3/mfa/status',base).href,{headers:{Authorization:'Bearer '+created.token}}).catch(()=>null);
   const state=await response?.json().catch(()=>null);safe.serverMfa={http:response?.status(),enabled:state?.enabled,available:state?.available,code:state?.code};
  }
  console.error('MFA_UI_DIAGNOSTIC',JSON.stringify({stage,...safe,reason:String(error?.message||'').split('Call log:')[0]}));
  throw Error('MFA browser acceptance failed at: '+stage+' (private setup data omitted)');
 }
}
async function deleteTestAccount(context,created){
 const route=path=>new URL('/api/v3'+path,base).href;
 let result=await context.request.delete(route('/account'),{headers:{Authorization:'Bearer '+created.token},data:{password:created.password}});
 if(result.status()===401){
  let login=await (await context.request.post(route('/auth/login'),{data:{username:created.username,password:created.password}})).json();
  if(login.mfaRequired&&created.backupCodes?.length)login=await (await context.request.post(route('/auth/mfa/verify'),{data:{challenge:login.challenge,code:created.backupCodes[0]}})).json();
  if(login.token)result=await context.request.delete(route('/account'),{headers:{Authorization:'Bearer '+login.token},data:{password:created.password}});
 }
 assert.equal(result.status(),200,'Synthetic account cleanup');
}
async function acknowledge(p){for(let n=0;n<20&&(await read(p)).mentor.open;n++)await p.locator('#mentor-next').click();}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
 try{
  for(const width of (process.env.NINJA_TEST_WIDTHS?process.env.NINJA_TEST_WIDTHS.split(',').map(Number):[360,768,941,1280])){
   const context=await browser.newContext({serviceWorkers:'block',viewport:{width,height:width===360?844:960}}),page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let created=null;
   try{
    if(width===768){
     const introPage=await context.newPage();
     try{
      await introPage.goto(base+'home.html');
      assert.equal(await introPage.locator('article.situation-card').count(),3,'World previews remain informational');
      assert.equal(await introPage.locator('a[href*="?quick="]').count(),0,'Homepage does not start a run');
      assert.equal(await introPage.locator('.access-choices a').count(),3,'Login, registration and guest are explicit choices');
      await introPage.locator('.access-choices a[href$="#guest"]').click();await ready(introPage);await acknowledge(introPage);
      const guest=await read(introPage);assert.equal(guest.ui,'home');assert.equal(guest.state.started,false);assert.equal(guest.session.kind,'guest');
     }finally{await introPage.close();}
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
     created=await page.evaluate(()=>{const data=JSON.parse(sessionStorage.getItem('notification-ninja:account-session:v3'));return {token:data.token,username:data.user.username};});
     created.password=password;
     await page.locator('[name="saved"]').check();await page.locator('.account-submit').click();await acknowledge(page);
     assert.equal((await read(page)).ui,'home');
     assert.equal(await page.locator('#ninja-hub .hub-play').count(),1);
     assert.equal(await page.locator('#ninja-hub h1').isVisible(),true,'hub shows the player name');
     assert.equal(await page.locator('.indie-bottom-nav [data-game-route]').count(),5);
     assert.equal(await page.locator('.indie-bottom-nav [data-game-route="bazaar"]').isVisible(),true,'Bazaar remains reachable on the phone');
     await page.locator('.indie-bottom-nav [data-game-route="play"]').click();
     assert.equal((await read(page)).ui,'modes');
     assert.equal(await page.locator('.indie-mode-card').count(),4,'Four distinct challenge cards');
     assert.equal(await page.locator('.indie-world-card').count(),4,'Four illustrated world posters');
     const fit=await page.locator('.indie-mode-card,.indie-world-card').evaluateAll(cards=>cards.every(card=>{const box=card.getBoundingClientRect();return box.left>=-1&&box.right<=innerWidth+1;}));
     assert(fit,'Unified Play cards fit the phone');
     await goHome(page);
     await page.screenshot({path:path.join(output,'hub-'+width+'.png')});
     await checkMfa(page,created);
    }else{
     await page.locator('[data-account="guest"]').click();await acknowledge(page);
     assert.equal((await read(page)).ui,'home');
     assert.equal(await page.locator('#ninja-hub h1').isVisible(),true,'hub shows the player name');
     await page.screenshot({path:path.join(output,'hub-'+width+'.png')});
     await page.locator('.indie-bottom-nav [data-game-route="bazaar"]').click();await acknowledge(page);
     assert.equal(await page.locator('[data-shop-tab]').count(),2,'Only playable worlds and skins are sold');
     assert.equal(await page.locator('[data-shop-tab="backgrounds"]').count(),0,'Legacy cosmetics are preserved outside the regular sale');
     await page.locator('[data-shop-filter="owned"]').click();
     assert.equal(await page.locator('.shop-card.is-locked:visible').count(),0);
     await page.locator('[data-shop-filter="new"]').click();
     assert.equal(await page.locator('.shop-card.is-owned:visible').count(),0);
     await goHome(page);
     const before=(await read(page)).profile;
     await page.locator('.indie-bottom-nav [data-game-route="play"]').click();
     assert.equal((await read(page)).ui,'modes');
     await page.locator('[data-game-route="practice"]').click();assert.equal((await read(page)).ui,'practice');
     assert.deepEqual((await read(page)).profile,before,'practice does not alter guest progression');
     await page.keyboard.press('Escape');await acknowledge(page);
    }
    if(width===768)await checkCareer(page);
    await checkNewModes(page,!created,width);
    const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert(geometry.scroll<=geometry.width+1,'no horizontal page overflow');
    await page.locator('[data-language="en"]').filter({visible:true}).first().click();
    assert.equal((await read(page)).language,'en');
    if(!created){await page.locator('.indie-bottom-nav [data-game-route="play"]').click();await page.locator('[data-account-view="profile"]:visible').click();await page.locator('[data-account="register"]').click();assert.match(await page.locator('[data-account-form="register"]').innerText(),/Email address/);assert.deepEqual((await read(page)).translation.missing,[]);await page.screenshot({path:path.join(output,'registration-en-'+width+'.png')});}
    assert.deepEqual(errors,[]);
    console.log('PORTAL PASS',width);
   }finally{
    if(created)await deleteTestAccount(context,created);
    await context.close();
   }
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
