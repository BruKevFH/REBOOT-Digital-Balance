// Native navigation and modal regressions. Only isolated local services are allowed.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(base).hostname))throw Error('Crossflow checks require an isolated local instance.');
const out=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-crossflows');
const version=JSON.parse(fs.readFileSync(path.join(root,'notification-ninja/dist/build.json'))).version;
const widths=process.env.NINJA_TEST_WIDTHS?process.env.NINJA_TEST_WIDTHS.split(',').map(Number):[360,1280];
if(widths.some(x=>!Number.isInteger(x)||x<320||x>2560))throw Error('Invalid viewport widths.');
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
const themeKey='notification-ninja:ui-theme:v1';
async function ack(p){
 // The automatic intro opens on the next rendered frame after entering the hub.
 for(let i=0;i<32;i++){
  await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const current=await snap(p);
  if(current.experience?.intro?.active){await p.locator('[data-intro-action=skip]').click();continue;}
  if(current.mentor.open){await p.locator('#mentor-next').click();continue;}
  return;
 }
 throw Error('Intro or mentor did not close through its native controls');
}
async function ready(p){await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version);await ack(p);await p.evaluate(()=>document.fonts.ready);}
async function click(p,target,touch){
 await target.scrollIntoViewIfNeeded();
 const hit=await target.evaluate(el=>{const r=el.getBoundingClientRect(),top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {width:r.width,height:r.height,reachable:top===el||el.contains(top),text:(el.getAttribute('aria-label')||el.textContent).trim().replace(/\s+/g,' ').slice(0,90)};});
 assert(hit.width>=43.8&&hit.height>=43.8,'Control must offer a real44px target: '+JSON.stringify(hit));
 assert(hit.reachable,'Control must not be obscured: '+JSON.stringify(hit));
 if(touch)await target.tap();else await target.click();
}
const economy=s=>Object.fromEntries(['coins','totalRuns','stats','unlockedSkills','unlockedWorlds','unlockedSkins','selectedSkin','achievements','claimedAchievements','highScores'].map(key=>[key,s.profile[key]]));
const themeWrites=p=>p.evaluate(key=>(window.__NINJA_THEME_WRITES__||[]).filter(item=>item.key===key),themeKey);
async function practiceDOM(p){return {context:await p.locator('#practice-context').inputValue(),item:await p.locator('#practice-item').innerText(),feedback:await p.locator('.practice-feedback').innerText(),sliceDisabled:await p.locator('[data-practice=slice]').isDisabled(),keepDisabled:await p.locator('[data-practice=keep]').isDisabled()};}
async function historyView(p){return p.evaluate(()=>({depth:history.state?.depth,length:history.length,hash:location.hash}));}
async function guest(browser,width){
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width,height:width<768?844:960},hasTouch:width<768});
 // Observe preference writes without changing their behavior or the game state.
 await context.addInitScript(()=>{window.__NINJA_THEME_WRITES__=[];const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(String(key)==='notification-ninja:ui-theme:v1')window.__NINJA_THEME_WRITES__.push({key:String(key),value:String(value)});return original.call(this,key,value);};});
 const p=await context.newPage();await p.goto(base+'index.html#guest');await ready(p);return {context,p};
}
async function themes(p,width,entry){
 const touch=width<768;
 assert.equal(await p.evaluate(()=>document.documentElement.hasAttribute('aria-pressed')),false,'The document is not a toggle control');
 await click(p,p.locator('.indie-bottom-nav [data-game-route=play]'),touch);await click(p,p.locator('.indie-bottom-nav [data-game-route=home]'),touch);await ack(p);
 assert.deepEqual(await themeWrites(p),[],'Unrelated navigation must not write a theme preference');
 const before=economy(await snap(p));
 await click(p,p.locator('[data-open-settings]:visible').first(),touch);
 assert.deepEqual(await themeWrites(p),[],'Opening settings does not choose a theme');
 for(const choice of ['dark','noir','relaxed']){
  const count=(await themeWrites(p)).length;
  await click(p,p.locator(`button[data-ninja-theme="${choice}"]`),touch);
  assert.equal(await p.evaluate(()=>document.documentElement.dataset.ninjaTheme),choice);
  assert.equal(await p.evaluate(key=>localStorage.getItem(key),themeKey),choice);
  assert.equal((await themeWrites(p)).length,count+1,'Only the chosen button writes the preference once');
  assert.equal(await p.locator(`button[data-ninja-theme="${choice}"]`).getAttribute('aria-pressed'),'true');
  assert.equal(await p.locator('button[data-ninja-theme][aria-pressed=true]').count(),1);
  assert.equal(await p.evaluate(()=>document.documentElement.hasAttribute('aria-pressed')),false);
 }
 await click(p,p.locator('[data-settings-command=back]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');await ack(p);
 assert.deepEqual(economy(await snap(p)),before,'Themes do not alter the economy or saved gameplay');
 entry.themes={choices:['dark','noir','relaxed'],unrelatedWrites:0,documentIsNotToggle:true};
}
async function accountModalHistory(p,width,entry){
 const touch=width<768,before=economy(await snap(p)),cases=[];
 for(const close of ['escape','close','browser-back']){
  // A real direct menu URL has the hub as its recorded underlying view.
  await p.goto(base+'index.html?modal-history='+close+'#weekly');await ready(p);
  const original=await historyView(p);
  await click(p,p.locator('.indie-account-tool'),touch);await p.locator('[data-account-form=login]').waitFor();
  const opened=await historyView(p);assert.equal(opened.length,original.length+1,'An account modal creates exactly one history entry');
  await click(p,p.locator('[data-account=register]'),touch);await p.locator('[data-account-form=register]').waitFor();
  await click(p,p.locator('[data-account=login]'),touch);await p.locator('[data-account-form=login]').waitFor();
  await click(p,p.locator('[data-account=recovery]'),touch);await p.locator('[data-account-form=recovery]').waitFor();
  assert.equal((await historyView(p)).length,opened.length,'Auth subpages replace the same modal entry');
  if(close==='escape')await p.keyboard.press('Escape');else if(close==='close')await click(p,p.locator('[data-account=close]').first(),touch);else await p.goBack();
  await p.waitForFunction(()=>!document.querySelector('#account-root [role=dialog]')&&location.hash==='#weekly');
  assert.equal((await snap(p)).ui,'weekly');assert.equal((await historyView(p)).depth,original.depth);
  assert.equal(await p.evaluate(()=>document.activeElement?.matches('.indie-account-tool')),true,'Closing the modal restores focus to the same toolbar control');
  if(close==='browser-back'){
   await p.goForward();await p.locator('[data-account-form=recovery]').waitFor();
   assert.equal((await historyView(p)).length,opened.length,'Forward reopens the original modal entry');
   await p.goBack();await p.waitForFunction(()=>!document.querySelector('#account-root [role=dialog]')&&location.hash==='#weekly');
  }
  await click(p,p.locator('.indie-page>.panel-header .panel-back'),touch);
  await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');
  assert.equal(new URL(p.url()).hash,'#overview','One Back reaches the hub after closing the modal');
  cases.push({close,authSubpagesStable:true,focusRestored:true,singleBackToHub:true});
 }
 for(const route of ['login','register','recovery','account']){
  await p.goto(base+'index.html?direct-auth='+route+'#'+route);await ready(p);
  const form=route==='account'?'login':route;await p.locator('[data-account-form='+form+']').waitFor();
  await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#account-root [role=dialog]')&&location.hash==='#overview');
  assert.equal((await snap(p)).ui,'home');
  const freshContext=await p.context().browser().newContext({serviceWorkers:'block',viewport:p.viewportSize(),hasTouch:touch}),fresh=await freshContext.newPage();
  fresh.on('pageerror',error=>entry.errors.push(error.message));
  try{
   await fresh.goto(base+'index.html#'+route);await ready(fresh);await fresh.locator('[data-account-form='+form+']').waitFor();
   assert.equal((await snap(fresh)).session.signedIn,false,'A direct auth URL does not create a guest or sign in');
   await fresh.keyboard.press('Escape');await fresh.waitForFunction(()=>!document.querySelector('#account-root [role=dialog]')&&location.hash==='#start');
   assert.equal((await snap(fresh)).ui,'landing','Closing a fresh direct auth URL returns to its real landing page');
  }finally{await freshContext.close();}
 }
 assert.deepEqual(economy(await snap(p)),before,'Account modal navigation cannot alter the guest economy');
 entry.accountHistory={cases,directRoutes:['login','register','recovery','account'],freshAuthRoutes:true,forwardReopens:true};
}
async function practiceHistory(p,width,entry,content){
 const touch=width<768,before=economy(await snap(p));
 await click(p,p.locator('[data-game-route=codex]:visible'),touch);await click(p,p.locator('[data-codex-context=gaming]'),touch);await click(p,p.locator('[data-codex-action=practice]'),touch);
 const items=['gaming-invite','autoplay','gameclip','streak','loot','break','homework','safety','ad'];
 const action=id=>content.find(item=>item.id===id).kindByContext.gaming==='distraction'?'slice':'keep';
 await click(p,p.locator(`[data-practice=${action(items[0])}]`),touch);await click(p,p.locator('[data-practice=next]'),touch);await click(p,p.locator(`[data-practice=${action(items[1])}]`),touch);
 const actual=await practiceDOM(p),historyBefore=await historyView(p);assert.equal(actual.context,'gaming');assert(actual.sliceDisabled&&actual.keepDisabled,'Two real answers reached the second answered example');
 await p.goBack();await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='codex');assert.equal((await snap(p)).experience.codex.context,'gaming');
 await p.goForward();await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='practice');
 assert.deepEqual(await practiceDOM(p),actual,'Forward restores the actual context, question and answer feedback');
 assert.deepEqual(await historyView(p),historyBefore,'Restoring an existing entry must not create another history entry');
 // Complete the remaining canonical examples, proving the first two answers survived.
 for(let index=2;index<items.length;index++){await click(p,p.locator('[data-practice=next]'),touch);await click(p,p.locator(`[data-practice=${action(items[index])}]`),touch);}
 await click(p,p.locator('[data-practice=next]'),touch);assert.match(await p.locator('.practice-result').innerText(),/9\s*\/\s*9/u,'All nine real answers are retained');
 await click(p,p.locator('[data-practice=exit]').first(),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='codex');assert.equal((await snap(p)).experience.codex.context,'gaming','Exit after Forward returns to the originating codex context');
 assert.deepEqual(economy(await snap(p)),before,'Practice navigation cannot grant coins or change saved gameplay');
 await p.screenshot({path:path.join(out,`practice-return-${width}.png`),fullPage:true});
 await click(p,p.locator('.indie-bottom-nav [data-game-route=home]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');await ack(p);
 entry.practice={context:'gaming',backForward:true,answerReplay:true,correct:9,total:9,historyStable:true,returnedToCodex:true};
}
async function exitDialog(p,width,entry){
 const touch=width<768;
 await click(p,p.locator('.indie-bottom-nav [data-game-route=play]'),touch);await click(p,p.locator('[data-world-inspect=study]'),touch);await click(p,p.locator('[data-quick-context=study]:visible'),touch);await ack(p);await click(p,p.locator('[data-action=next]'),touch);await ack(p);
 // A guide can briefly resume its original scene when acknowledged; reach a real pause.
 for(let attempt=0;attempt<8;attempt++){await ack(p);if((await snap(p)).ui==='paused')break;if((await snap(p)).ui==='playing')await click(p,p.locator('#pause-button'),touch);await p.waitForTimeout(60);}
 assert.equal((await snap(p)).ui,'paused');await click(p,p.locator('[data-action=exit-game]'),touch);assert.equal(await p.locator('#exit-confirm').count(),1);
 await p.screenshot({path:path.join(out,`exit-confirm-${width}.png`),fullPage:true});
 const atPause=(await snap(p)).state.elapsed;await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#exit-confirm'));
 assert.equal((await snap(p)).ui,'paused');assert.equal((await snap(p)).state.paused,true);await p.waitForTimeout(260);assert.equal((await snap(p)).state.elapsed,atPause,'Escape cannot restart the clock behind a confirmation');
 assert.equal(await p.evaluate(()=>Boolean(document.activeElement?.closest('.adventure-pause-panel'))),true,'Focus returns to the pause menu');
 // Clicking Stay has the same safe state and restores focus too.
 await click(p,p.locator('[data-action=exit-game]'),touch);await click(p,p.locator('[data-exit-choice=stay]'),touch);assert.equal(await p.locator('#exit-confirm').count(),0);assert.equal((await snap(p)).ui,'paused');assert.equal((await snap(p)).state.paused,true);await p.waitForTimeout(160);assert.equal((await snap(p)).state.elapsed,atPause);
 await p.screenshot({path:path.join(out,`exit-stays-paused-${width}.png`),fullPage:true});
 // The same live run remains protected when its exit action is reached through Settings.
 await click(p,p.locator('[data-action=settings]'),touch);assert.equal((await snap(p)).ui,'settings');
 await click(p,p.locator('[data-settings-command=exit]'),touch);assert.equal(await p.locator('#exit-confirm').count(),1,'Settings cannot bypass confirmation for a live run');
 await p.screenshot({path:path.join(out,`settings-exit-confirm-${width}.png`),fullPage:true});
 await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#exit-confirm'));
 assert.equal((await snap(p)).ui,'settings');assert.equal((await snap(p)).state.paused,true);await p.waitForTimeout(180);assert.equal((await snap(p)).state.elapsed,atPause);
 assert.equal(await p.evaluate(()=>document.activeElement?.matches('[data-settings-command=exit]')),true,'Focus returns to the Settings exit action');
 entry.exit={escapeCloses:true,stayKeepsPaused:true,elapsedUnchanged:true,focusRestored:true,settingsRequiresConfirmation:true};
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});const {CONTENT}=await import(pathToFileURL(path.join(root,'notification-ninja/src/game.js')).href);
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});const report={version,viewports:[],issues:[]};
 try{for(const width of widths){let context,p;const entry={width,errors:[]};try{({context,p}=await guest(browser,width));p.on('pageerror',error=>entry.errors.push(error.message));if(process.env.NINJA_CROSSFLOW_ACCOUNT_ONLY!=='1')await themes(p,width,entry);await accountModalHistory(p,width,entry);if(process.env.NINJA_CROSSFLOW_ACCOUNT_ONLY!=='1'){await practiceHistory(p,width,entry,CONTENT);await exitDialog(p,width,entry);}assert.deepEqual(entry.errors,[]);entry.ok=true;}catch(error){entry.ok=false;entry.failure=error.stack;report.issues.push({width,error:error.message});if(p)await p.screenshot({path:path.join(out,`FAIL-${width}.png`),fullPage:true}).catch(()=>{});}finally{await context?.close();report.viewports.push(entry);console.log('CROSSFLOWS',width,entry.ok,entry.failure||'');}}
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({viewports:report.viewports.map(x=>({width:x.width,ok:x.ok})),issues:report.issues},null,2));if(report.issues.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
