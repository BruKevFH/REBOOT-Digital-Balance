// Exhaustive local UI audit. Gameplay completion is covered by the separate native playthrough.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(base).hostname))throw Error('All-pages audit requires an isolated local service.');
const output=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-all-pages');
const widths=(process.env.NINJA_TEST_WIDTHS||'360,1280').split(',').map(Number);
const languages=(process.env.NINJA_TEST_LANGUAGES||'de,en').split(',');
const sections=new Set((process.env.NINJA_ALL_PAGES_SECTIONS||'homepage,primary,worlds,career,collections,shop,learning,settings,authentication,accounts').split(','));
if(widths.some(w=>!Number.isInteger(w)||w<320||w>2560)||languages.some(l=>!['de','en'].includes(l)))throw Error('Invalid audit settings.');
const version=JSON.parse(fs.readFileSync(path.join(root,'notification-ninja/dist/build.json'))).version;
const earnedStatePath=process.env.NINJA_EARNED_STATE;
const load=file=>import(pathToFileURL(path.join(root,'notification-ninja/src',file)).href);
const read=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
const slug=value=>String(value).replace(/[^a-z0-9_-]/gi,'-').slice(0,150);
let visit=0;
async function acknowledge(p){if((await read(p)).experience?.intro?.active)await p.locator('[data-intro-action=skip]').click();for(let i=0;i<30&&(await read(p)).mentor.open;i++)await p.locator('#mentor-next').click();}
async function ready(p){await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version);await acknowledge(p);await p.evaluate(()=>document.fonts.ready);}
async function click(p,selector){const el=typeof selector==='string'?p.locator(selector):selector;await el.scrollIntoViewIfNeeded();if(p.viewportSize().width<768)await el.tap();else await el.click();if(await p.evaluate(()=>Boolean(window.__NOTIFICATION_NINJA__)))await acknowledge(p);}
async function route(p,id){await p.goto(base+'index.html?all-pages='+ ++visit+'#'+id);await ready(p);}
async function settle(p){await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function geometry(p){
 await settle(p);
 return p.evaluate(()=>{
  const modal=[...document.querySelectorAll('dialog[open],[role=dialog][aria-modal=true]')].filter(el=>el.checkVisibility({checkVisibilityCSS:true})).at(-1);
  const shown=el=>el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&!el.closest('[inert]')&&(!modal||modal.contains(el));
  const name=el=>el.id||el.getAttribute('aria-label')||el.getAttribute('name')||(el.matches('input,textarea')?el.tagName:el.textContent.trim().replace(/\s+/g,' ').slice(0,90));
  const controls=[...document.querySelectorAll('button,a,summary,select,input:not([type=hidden]),textarea')].filter(shown);
  const small=controls.map(el=>{let r=el.getBoundingClientRect();if(el.matches('input[type=checkbox],input[type=radio]'))for(const l of el.labels||[]){const candidate=l.getBoundingClientRect();if(candidate.width>r.width&&candidate.height>r.height)r=candidate;}return {name:name(el),w:r.width,h:r.height};}).filter(x=>x.w<43.8||x.h<43.8);
  const failedImages=[...document.images].filter(el=>shown(el)&&(!el.complete||el.naturalWidth===0)).map(el=>el.getAttribute('src'));
  const duplicateIds=[...document.querySelectorAll('[id]')].map(el=>el.id).filter((id,index,all)=>all.indexOf(id)!==index);
  return {viewport:innerWidth,document:document.documentElement.scrollWidth,small,failedImages,duplicateIds,controls:controls.length,title:modal?.querySelector('h2,h3')?.textContent||document.querySelector('#overlay-root h2')?.textContent||document.title};
 });
}
async function homepageSnapshot(p,language){
 const {setLanguage,tr,getMissingTranslations}=await load('i18n.js');setLanguage(language);
 const text=await p.evaluate(source=>{
  const authored=new DOMParser().parseFromString(source,'text/html');
  const values=[],walker=authored.createTreeWalker(authored.body,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode()))if(node.parentElement&&!node.parentElement.closest('script,style,[translate="no"]'))values.push(node.textContent);
  for(const element of authored.querySelectorAll('[aria-label],[title],[alt],[placeholder]'))for(const name of ['aria-label','title','alt','placeholder'])if(element.hasAttribute(name))values.push(element.getAttribute(name));
  return values;
 },fs.readFileSync(path.join(root,'notification-ninja/home.html'),'utf8'));for(const value of text)tr(value);
 return {ui:'homepage',translation:{missing:getMissingTranslations()}};
}
async function record(p,entry,id,{screenshot=true,homepage=false}={}){
 const item={id};
 try{const g=await geometry(p),s=homepage?await homepageSnapshot(p,entry.language):await read(p);Object.assign(item,{ui:s.ui,geometry:g,missing:s.translation.missing});assert(g.document<=g.viewport+1,'Horizontal page overflow');assert.deepEqual(g.small,[],'Controls smaller than44px');assert.deepEqual(g.failedImages,[],'Artwork failed to load');assert.deepEqual(g.duplicateIds,[],'Duplicate element IDs');assert.deepEqual(s.translation.missing,[],'Missing English translations');item.ok=true;}
 catch(error){item.ok=false;item.error=error.message;console.error('ALL_PAGES_FINDING',entry.width,entry.language,id,JSON.stringify({error:item.error,geometry:item.geometry,missing:item.missing}));}
 if(screenshot||!item.ok)await p.screenshot({path:path.join(output,slug(entry.width+'-'+entry.language+'-'+id)+'.png'),fullPage:true,mask:[p.locator('#account-key'),p.locator('#mfa-setup-secret'),p.locator('.mfa-qr-wrap'),p.locator('#mfa-recovery-codes')]}).catch(()=>{});
 entry.pages.push(item);if(entry.pages.length%25===0)console.log('ALL_PAGES_PROGRESS',entry.width,entry.language,entry.pages.length,id);return item;
}
async function safely(p,entry,id,task){try{await task();}catch(error){entry.pages.push({id,ok:false,error:error.message});console.error('ALL_PAGES_FLOW',entry.width,entry.language,id,error.message);await p.screenshot({path:path.join(output,slug(entry.width+'-'+entry.language+'-FAIL-'+id)+'.png'),fullPage:true}).catch(()=>{});}}
async function closeCareer(p){const close=p.locator('dialog.career-mission-sheet[open] [data-career-sheet-close]');if(await close.count())await click(p,close);}
async function homepage(p,entry){
 await p.goto(base+'home.html');await p.locator('[data-language='+entry.language+']').click();await p.evaluate(()=>document.fonts.ready);
 await record(p,entry,'homepage',{homepage:true});
 await click(p,'#privacy-details summary');assert.equal(await p.locator('#privacy-details').getAttribute('open'),'');await record(p,entry,'homepage/privacy',{homepage:true});
 for(const theme of ['dark','noir','relaxed']){await click(p,'[data-theme-cycle]');assert.equal(await p.locator('html').getAttribute('data-ninja-theme'),theme);await record(p,entry,'homepage/theme/'+theme,{homepage:true});}
 await p.goto(base+'home.html#projekt');assert.equal(await p.locator('#privacy-details').getAttribute('open'),'');await record(p,entry,'homepage/privacy-direct-link',{homepage:true});
 assert.equal(await p.evaluate(()=>Boolean(window.__NOTIFICATION_NINJA__)),false,'Information page never starts the game engine');
}
async function primary(p,entry){
 for(const id of ['overview','play','campaign','weekly','profile','abilities','achievements','notifications','bazaar','skins','highscores','leaderboard','settings','help','sensei','codex','practice','delete-profile'])await safely(p,entry,id,async()=>{await route(p,id);await record(p,entry,id);if(id==='weekly'){const tasks=p.locator('.daily-task-card');assert.equal(await tasks.count(),3,'All three daily goals must be reachable');for(let i=0;i<3;i++)await record(p,entry,'daily/fresh/'+await tasks.nth(i).getAttribute('data-daily-task'),{screenshot:false});}});
}
async function worlds(p,entry){for(const id of ['study','gaming','sleep','master'])await safely(p,entry,'world/'+id,async()=>{await route(p,'play');await click(p,'[data-world-inspect='+id+']');await record(p,entry,'world/'+id);for(const difficulty of ['easy','normal','hard']){await p.locator('#indie-world-difficulty').selectOption(difficulty);assert.equal(await p.locator('#indie-world-difficulty').inputValue(),difficulty);}});}
async function career(p,entry,missions){
 await route(p,'campaign');const extra=p.locator('.nn-career-extra summary');if(await extra.count())await click(p,extra);
 for(const mission of missions)await safely(p,entry,'mission/'+mission.id,async()=>{
  await closeCareer(p);const more=p.locator('details').filter({has:p.locator('[data-mission-inspect="'+mission.id+'"]')});if(await more.count()&&!(await more.first().getAttribute('open')))await more.first().locator('summary').click();
  await click(p,'[data-mission-inspect="'+mission.id+'"]');await record(p,entry,'mission/'+mission.id,{screenshot:entry.width===360||mission.id.endsWith('01')||Boolean(mission.bossId)});
  const detail=p.locator('.nn-career-detail');assert.equal(await detail.locator('[data-mission-start]').getAttribute('data-mission-start'),mission.id);const close=p.locator('[data-career-sheet-close]');if(entry.width<900){assert(await close.isVisible());await p.keyboard.press('Escape');assert.equal(await close.count(),0);}
 });
}
async function collections(p,entry,skills,achievements){
 await route(p,'abilities');for(const skill of skills)await safely(p,entry,'ability/'+skill.id,async()=>{await click(p,'[data-skill-inspect="'+skill.id+'"]');await record(p,entry,'ability/'+skill.id);});
 assert.equal(await p.locator('[data-shop-skill]').count(),skills.length,'Every canonical ability is listed in the shop');assert.equal(await p.locator('[data-tree-branch]').count(),0,'The retired radial tree is absent');
 await route(p,'achievements');assert.equal(await p.locator('[data-achievement]').count(),achievements.length);for(const achievement of achievements){await p.locator('[data-achievement="'+achievement.id+'"]').scrollIntoViewIfNeeded();await record(p,entry,'achievement/'+achievement.id,{screenshot:false});}
 await route(p,'profile');await click(p,'.nn-profile-manage summary');await record(p,entry,'profile/actions');await p.locator('#username-input').fill('<bad>');await click(p,'#username-form button[type=submit]');assert(await p.locator('#username-error').innerText());await record(p,entry,'profile/rename-invalid');
 await route(p,'delete-profile');await p.locator('#delete-profile-name').fill('does-not-match');await click(p,'#delete-profile-confirm');assert(await p.locator('#delete-profile-error').innerText());await record(p,entry,'profile/delete-invalid');
}
async function shop(p,entry,skins){
 for(const tab of ['worlds','skins','abilities']){await route(p,'bazaar');await click(p,'[data-shop-tab='+tab+']');for(const filter of ['all','owned','new']){await click(p,'[data-shop-filter='+filter+']');await record(p,entry,'shop/'+tab+'/'+filter);}}
 await click(p,'[data-shop-filter=all]');await route(p,'skins');for(const [rarity,count]of Object.entries({common:1,uncommon:2,rare:3,epic:3,legendary:3})){await p.locator('#shop-rarity-filter').selectOption(rarity);assert.equal(await p.locator('[data-shop-skin]:visible').count(),count);await record(p,entry,'shop/rarity/'+rarity,{screenshot:rarity==='legendary'});}await p.locator('#shop-rarity-filter').selectOption('all');
 for(const skin of skins)await safely(p,entry,'dressing/'+skin.id,async()=>{await route(p,'skins');await click(p,'[data-shop-filter=all]');await click(p,'[data-skin-preview="'+skin.id+'"]');for(const context of ['study','gaming','sleep']){await p.locator('[data-dressing-context]').selectOption(context);await record(p,entry,'dressing/'+skin.id+'/'+context,{screenshot:context==='study'});}await click(p,'[data-dressing-action=offer]');assert.equal((await read(p)).ui,'shop');});
}
async function learning(p,entry,scenarios){
 await route(p,'sensei');for(const scenario of scenarios)await safely(p,entry,'sensei/'+scenario.id,async()=>{await click(p,'[data-sensei-context='+scenario.context+']');await click(p,'[data-sensei-scenario="'+scenario.id+'"]');await record(p,entry,'sensei/'+scenario.id);await click(p,'[data-sensei-choice="'+((scenario.correct+1)%3)+'"]');await record(p,entry,'sensei/'+scenario.id+'/retry',{screenshot:false});await click(p,'[data-sensei-action=retry]');await click(p,'[data-sensei-choice="'+scenario.correct+'"]');await record(p,entry,'sensei/'+scenario.id+'/correct',{screenshot:false});});
 await click(p,'[data-sensei-action=next]');await record(p,entry,'sensei/complete');await click(p,'[data-sensei-action=revisit]');await click(p,'[data-sensei-action=reset]');await record(p,entry,'sensei/reset-confirm');await click(p,'[data-sensei-action=reset-cancel]');
 await route(p,'codex');for(const context of ['study','gaming','sleep']){await click(p,'[data-codex-context='+context+']');for(const kind of ['all','useful','distraction','powerup']){await click(p,'[data-codex-kind-filter='+kind+']');await record(p,entry,'codex/'+context+'/'+kind,{screenshot:kind==='all'});}}
 await p.locator('[data-codex-search]').fill('no-such-signal-qa');await record(p,entry,'codex/empty-search');
 for(const context of ['study','gaming','sleep']){await route(p,'practice');await p.locator('#practice-context').selectOption(context);for(let i=0;i<9;i++){await record(p,entry,'practice/'+context+'/'+(i+1),{screenshot:i===0});await click(p,'[data-practice=slice]');await record(p,entry,'practice/'+context+'/'+(i+1)+'/feedback',{screenshot:false});await click(p,'[data-practice=next]');}await record(p,entry,'practice/'+context+'/result');await click(p,'[data-practice=restart]');assert.equal(await p.locator('#practice-context').inputValue(),context);}
}
async function settings(p,entry){
 await route(p,'settings');for(const theme of ['relaxed','dark','noir']){await click(p,'button[data-ninja-theme='+theme+']');await record(p,entry,'settings/theme/'+theme);}
 for(const hand of ['left','right']){await click(p,'button[data-comfort-hand='+hand+']');await record(p,entry,'settings/hand/'+hand,{screenshot:false});}
 for(const field of ['calmEffects','muted','screenShake'])for(const checked of [true,false]){await p.locator('[data-setting-toggle='+field+']').setChecked(checked);await record(p,entry,'settings/'+field+'/'+checked,{screenshot:false});}
 for(const field of ['musicVolume','effectsVolume']){await p.locator('[data-setting-range='+field+']').fill('23');await record(p,entry,'settings/'+field,{screenshot:false});}
 await click(p,'button[data-ninja-theme=relaxed]');await route(p,'leaderboard');for(const filter of ['all','today','week','local']){await click(p,'[data-leaderboard-filter='+filter+']');await record(p,entry,'leaderboard/'+filter);}
}
async function authentication(p,entry){
 for(const id of ['login','register','recovery']){await route(p,id);await record(p,entry,'auth/'+id);if(id==='login'){await click(p,'[data-account=reveal]');assert.equal(await p.locator('#account-password').getAttribute('type'),'text');await record(p,entry,'auth/login-password-visible',{screenshot:false});}}
}
async function accountScreens(p,entry){
 const username='ui'+Date.now().toString(36)+entry.width+entry.language,password='Audit-'+crypto.randomUUID();let currentToken=null;
 try{
  await route(p,'register');const form=p.locator('[data-account-form=register]');await form.locator('[name=username]').fill(username);await form.locator('[name=email]').fill(username+'@example.invalid');await form.locator('[name=password]').fill(password);await form.locator('[name=passwordConfirmation]').fill(password);await form.locator('[name=privacyAccepted]').check();await form.locator('[name=understood]').check();await click(p,form.locator('button[type=submit]'));await p.locator('[data-account-form=acknowledge-key]').waitFor();currentToken=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('notification-ninja:account-session:v3')).token);await record(p,entry,'account/recovery-key');await p.locator('[name=saved]').check();await click(p,'[data-account-form=acknowledge-key] button[type=submit]');
  await route(p,'weekly');assert.equal(await p.locator('.daily-task-card').count(),3);assert.match(await p.locator('.weekly-daily-board').innerText(),/UTC/);await record(p,entry,'account/daily-tasks');for(let i=0;i<3;i++)await record(p,entry,'account/daily/'+await p.locator('.daily-task-card').nth(i).getAttribute('data-daily-task'),{screenshot:false});
  await route(p,'account');await p.locator('[data-account=mfa-setup]').waitFor();await record(p,entry,'account/profile');await click(p,'.account-details:not(.account-danger) summary');await record(p,entry,'account/rename-expanded');await click(p,'.account-danger summary');await record(p,entry,'account/delete-expanded');
  await click(p,'[data-account=mfa-setup]');await record(p,entry,'account/mfa-setup');await p.locator('[name=password]').fill(password);await click(p,'[data-account-form=mfa-setup] button[type=submit]');await p.locator('#mfa-setup-secret').waitFor();await record(p,entry,'account/mfa-scan');
  const secret=await p.locator('#mfa-setup-secret').inputValue();const {testMfaCode}=await import(pathToFileURL(path.join(root,'server/ninja-mfa.mjs')).href);const response=await p.context().request.get(new URL('/api/v3/me',base).href,{headers:{Authorization:'Bearer '+currentToken}});const serverNow=(await response.json()).serverNow;await p.locator('[name=code]').fill(testMfaCode(secret,Math.floor(serverNow/30000)));await click(p,'[data-account-form=mfa-confirm] button[type=submit]');await p.locator('#mfa-recovery-codes').waitFor();const codes=(await p.locator('#mfa-recovery-codes').inputValue()).trim().split(/\s+/);await record(p,entry,'account/mfa-backups');await p.locator('[name=saved]').check();await click(p,'[data-account-form=mfa-ack] button[type=submit]');await p.locator('[data-account=mfa-disable]').waitFor();await record(p,entry,'account/mfa-enabled');
  await click(p,'[data-account=logout]');currentToken=null;await route(p,'login');await p.locator('[name=username]').fill(username);await p.locator('[name=password]').fill(password);await click(p,'[data-account-form=login] button[type=submit]');await p.locator('[data-account-form=mfa-login]').waitFor();await record(p,entry,'account/mfa-login');await p.locator('[name=code]').fill(codes[0]);await click(p,'[data-account-form=mfa-login] button[type=submit]');await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().session.kind==='account');currentToken=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('notification-ninja:account-session:v3')).token);
  await route(p,'account');await p.locator('[data-account=mfa-disable]').waitFor();await click(p,'[data-account=mfa-disable]');await record(p,entry,'account/mfa-disable');await p.locator('[name=password]').fill(password);await p.locator('[name=code]').fill(codes[1]);await click(p,'[data-account-form=mfa-disable] button[type=submit]');await p.locator('[data-account=mfa-setup]').waitFor();
  await p.context().setOffline(true);await click(p,'[data-account=refresh]');await p.locator('[data-account-offline]').waitFor();await record(p,entry,'account/offline');await p.context().setOffline(false);await click(p,'[data-account=refresh]');await p.locator('[data-account=mfa-setup]').waitFor();
 }finally{
  await p.context().setOffline(false);if(currentToken){const deleted=await p.context().request.delete(new URL('/api/v3/account',base).href,{headers:{Authorization:'Bearer '+currentToken},data:{password}});assert(deleted.ok(),'Audit account cleanup must succeed');entry.cleanedAccounts=(entry.cleanedAccounts||0)+1;}
 }
}
async function compatibilityFixture(){
 if(!earnedStatePath)return null;
 const earned=JSON.parse(fs.readFileSync(path.resolve(earnedStatePath),'utf8')),legacy=structuredClone(earned);
 const origin=legacy.origins?.find(item=>item.origin===new URL(base).origin);assert(origin,'Earned checkpoint must belong to this isolated service');
 assert(!origin.localStorage.some(item=>item.name.includes('account-session')),'Compatibility fixture must not contain account credentials');
 const values=new Map(origin.localStorage.map(item=>[item.name,item.value])),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))};
 const {NinjaGame}=await load('game.js'),game=new NinjaGame({storage});assert.equal(game.profile.player.guest,true,'Only a genuinely earned guest checkpoint is accepted');
 const coinsBefore=game.profile.coins;assert(game.buyBackground('paper-garden').ok,'Canonical archived purchase must be affordable from earned funds');
 assert.equal(game.profile.coins,coinsBefore-160);game.save();origin.localStorage=[...values].map(([name,value])=>({name,value}));
 return {earned,legacy,provenance:{kind:'Legacy compatibility fixture, canonical model purchase in a copy of the native-earned guest checkpoint',purchase:'paper-garden',coinsBefore,coinsAfter:game.profile.coins,originalCheckpointUnchanged:true}};
}
async function earnedViews(browser,entry,fixture){
 const options={serviceWorkers:'block',viewport:{width:entry.width,height:entry.width<768?844:960},hasTouch:entry.width<768};
 const c=await browser.newContext({...options,storageState:fixture.earned}),p=await c.newPage();p.on('pageerror',error=>entry.errors.push(error.message));
 try{
  await route(p,'overview');await p.locator('[data-language='+entry.language+']:visible').first().click();await record(p,entry,'earned/overview');
  const before=await read(p);assert.equal(before.profile.adventure.completed.filter(id=>/^(study|gaming|sleep)-\d\d$/.test(id)).length,18,'The checkpoint contains the actual completed main campaign');
  await route(p,'campaign');for(const id of before.profile.adventure.completed.filter(id=>/^(study|gaming|sleep)-\d\d$/.test(id))){await closeCareer(p);await click(p,'[data-mission-inspect="'+id+'"]');await record(p,entry,'earned/mission/'+id,{screenshot:id.endsWith('06')});}await closeCareer(p);
  await route(p,'profile');await record(p,entry,'earned/profile');await route(p,'achievements');await record(p,entry,'earned/achievements');
  await route(p,'notifications');await record(p,entry,'earned/notifications');const view=p.locator('[data-unlock-view]').first();
  if(await view.count()){const old=await read(p),id=await view.getAttribute('data-notification-id');await click(p,view);const next=await read(p);assert.equal(next.profile.coins,old.profile.coins,'Reading a notification cannot claim or spend coins');assert(next.profile.player.notifications.find(item=>item.id===id)?.read);await record(p,entry,'earned/notification-destination');}
  await route(p,'weekly');await record(p,entry,'earned/weekly');assert.equal(await p.locator('.daily-task-card').count(),3);
  for(let i=0;i<3;i++)await record(p,entry,'earned/daily/'+await p.locator('.daily-task-card').nth(i).getAttribute('data-daily-task'),{screenshot:false});
  const claim=p.locator('.daily-task-card [data-daily-claim]:enabled').first();assert(await claim.count(),'The genuinely completed campaign earns a real daily reward');
  const taskId=await claim.getAttribute('data-daily-claim'),reward=Number((await claim.locator('..').locator('.weekly-task-meta strong').innerText()).replace(/[^0-9]/g,'')),beforeClaim=(await read(p)).profile.coins;
  assert(reward>0&&reward<=4);await click(p,claim);assert.equal((await read(p)).profile.coins,beforeClaim+reward);assert.equal(await p.locator('.daily-task-card [data-daily-claim="'+taskId+'"]').isDisabled(),true);await record(p,entry,'earned/daily/claimed');
  await p.reload();await ready(p);assert.equal((await read(p)).profile.coins,beforeClaim+reward);assert.equal(await p.locator('.daily-task-card [data-daily-claim="'+taskId+'"]').isDisabled(),true);await record(p,entry,'earned/daily/claim-reload');
  await route(p,'bazaar');await record(p,entry,'earned/shop-worlds');await click(p,'[data-shop-tab=skins]');const coins=(await read(p)).profile.coins;assert(coins>=80);
  await click(p,'[data-skin=solar]');await record(p,entry,'earned/purchase-confirm');const confirm=p.locator('[data-account=purchase]');await confirm.waitFor();await click(p,confirm);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().profile.unlockedSkins.includes('solar'));
  assert.equal((await read(p)).profile.coins,coins-80);await record(p,entry,'earned/purchase-complete');await click(p,'[data-skin=solar]');assert.equal((await read(p)).profile.selectedSkin,'solar');await record(p,entry,'earned/skin-equipped');
  await p.reload();await ready(p);assert.equal((await read(p)).profile.selectedSkin,'solar');assert.equal((await read(p)).profile.coins,coins-80,'Actual purchase and selection persist after reload');
 }finally{await c.close();}
 const legacyContext=await browser.newContext({...options,storageState:fixture.legacy}),legacyPage=await legacyContext.newPage();legacyPage.on('pageerror',error=>entry.errors.push(error.message));
 try{
  await route(legacyPage,'bazaar');await legacyPage.locator('[data-language='+entry.language+']:visible').first().click();assert.equal(await legacyPage.locator('.shop-legacy-archive,[data-background-equip],[data-shop-tab=backgrounds]').count(),0,'Retired background archive has no UI controls');const before=(await read(legacyPage)).profile;assert(before.unlockedBackgrounds.includes('paper-garden'),'Legacy ownership remains in the save');await record(legacyPage,entry,'legacy/inventory-preserved');
  await legacyPage.reload();await ready(legacyPage);const after=(await read(legacyPage)).profile;assert.deepEqual(after.unlockedBackgrounds,before.unlockedBackgrounds);assert.deepEqual(after.selectedBackgrounds,before.selectedBackgrounds);assert.equal(after.coins,before.coins);await record(legacyPage,entry,'legacy/inventory-reload');
 }finally{await legacyContext.close();}
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});const {CAREER_MISSIONS}=await load('adventure.js'),{SKINS}=await load('game.js'),{SKILLS,ACHIEVEMENTS}=await load('progression.js'),{SENSEI_SCENARIOS}=await load('sensei-trials.js'),fixture=await compatibilityFixture();const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});const report={version,kind:'Exhaustive UI inspection; native gameplay progression is separate',compatibility:fixture?.provenance||{requested:false},viewports:[],issues:[]};
 try{for(const width of widths)for(const language of languages){const c=await browser.newContext({serviceWorkers:'block',viewport:{width,height:width<768?844:960},hasTouch:width<768});const p=await c.newPage();p.setDefaultTimeout(12000);const entry={width,language,pages:[],errors:[],cleanedAccounts:0};p.on('pageerror',e=>entry.errors.push(e.message));
  try{if(sections.has('homepage'))await homepage(p,entry);await route(p,'guest');await p.locator('[data-language='+language+']:visible').first().click();if(sections.has('primary'))await primary(p,entry);if(sections.has('worlds'))await worlds(p,entry);if(sections.has('career'))await career(p,entry,CAREER_MISSIONS);if(sections.has('collections'))await collections(p,entry,SKILLS,ACHIEVEMENTS);if(sections.has('shop'))await shop(p,entry,SKINS);if(sections.has('learning'))await learning(p,entry,SENSEI_SCENARIOS);if(sections.has('settings'))await settings(p,entry);if(sections.has('authentication'))await authentication(p,entry);if(sections.has('accounts')&&process.env.NINJA_ALL_PAGES_SKIP_ACCOUNT!=='1')await safely(p,entry,'account-flow',()=>accountScreens(p,entry));if(fixture)await earnedViews(browser,entry,fixture);}
  catch(error){entry.flowError=error.stack;console.error('ALL_PAGES_ABORT',width,language,error.stack);}
  finally{entry.ok=!entry.flowError&&!entry.errors.length&&entry.pages.every(x=>x.ok);report.viewports.push(entry);for(const item of entry.pages.filter(x=>!x.ok))report.issues.push({width,language,id:item.id,error:item.error});if(entry.flowError)report.issues.push({width,language,id:'flow',error:entry.flowError});if(entry.errors.length)report.issues.push({width,language,id:'javascript',errors:entry.errors});fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log('ALL_PAGES',width,language,entry.ok,'states',entry.pages.length);await c.close();}}
 }finally{await browser.close();}if(report.issues.length)process.exitCode=1;console.log(JSON.stringify({version,viewports:report.viewports.map(x=>({width:x.width,language:x.language,ok:x.ok,states:x.pages.length})),issues:report.issues},null,2));
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
