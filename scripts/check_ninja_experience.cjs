// Local acceptance for the real learning path, codex, dressing room and career sheet.
// This script never targets a public service or edits an account/profile through a test setter.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(base).hostname))throw Error('Experience checks require an isolated local instance.');
const out=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-experience');
const version=JSON.parse(fs.readFileSync(path.join(root,'notification-ninja/dist/build.json'))).version;
const debriefOnly=process.env.NINJA_TEST_DEBRIEF_ONLY==='1';
const widths=debriefOnly?[360]:process.env.NINJA_TEST_EXTRAS_ONLY==='1'?[]:process.env.NINJA_TEST_WIDTHS?process.env.NINJA_TEST_WIDTHS.split(',').map(Number):[360,768,941,1280];
if(widths.some(x=>!Number.isInteger(x)||x<320||x>2560))throw Error('Invalid viewport widths.');
const load=name=>import(pathToFileURL(path.join(root,'notification-ninja/src',name)).href);
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
const profile=s=>Object.fromEntries(['coins','totalRuns','stats','unlockedSkills','unlockedWorlds','unlockedSkins','selectedSkin','achievements','claimedAchievements','highScores'].map(key=>[key,s.profile[key]]));
async function ack(p){for(let i=0;i<24&&(await snap(p)).mentor.open;i++)await p.locator('#mentor-next').click();}
async function ready(p){await p.waitForFunction(v=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===v,version);await ack(p);await p.evaluate(()=>document.fonts.ready);}
async function state(p,key){return (await snap(p)).experience?.[key];}
async function click(p,target,touch=false){
 await target.scrollIntoViewIfNeeded();
 const geometry=await target.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {width:r.width,height:r.height,pointer:el===hit||el.contains(hit),text:(el.getAttribute('aria-label')||el.textContent).trim().replace(/\s+/g,' ').slice(0,85)};});
 assert(geometry.width>=43.8&&geometry.height>=43.8,'Real target must be at least44px: '+JSON.stringify(geometry));
 assert(geometry.pointer,'Real target is obscured: '+JSON.stringify(geometry));
 if(touch)await target.tap();else await target.click();
}
async function geometry(p,label){
 await p.evaluate(()=>document.fonts.ready);
 const result=await p.evaluate(()=>{
  const modal=[...document.querySelectorAll('dialog[open],[role=dialog][aria-modal=true]')].filter(el=>el.checkVisibility({checkVisibilityCSS:true})).at(-1);
  const shown=el=>el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&!el.closest('[inert]')&&(!modal||modal.contains(el));
  const small=[...document.querySelectorAll('button,a,select,summary,input:not([type=hidden])')].filter(shown).map(el=>{let r=el.getBoundingClientRect();if(el.matches('input[type=checkbox],input[type=radio]'))for(const label of el.labels||[]){const l=label.getBoundingClientRect();if(l.width>r.width&&l.height>r.height)r=l;}return {id:el.id,text:(el.getAttribute('aria-label')||el.textContent||el.name).trim().replace(/\s+/g,' ').slice(0,70),w:r.width,h:r.height};}).filter(x=>x.w<43.8||x.h<43.8);
  return {width:innerWidth,document:document.documentElement.scrollWidth,small};
 });
 assert(result.document<=result.width+1,label+': horizontal overflow '+JSON.stringify(result));
 assert.deepEqual(result.small,[],label+': undersized controls');
 assert.deepEqual((await snap(p)).translation.missing,[],label+': missing global translation');
 return result;
}
async function closeSheet(p,touch){const sheet=p.locator('dialog.career-mission-sheet[open]');if(await sheet.count()){await click(p,sheet.locator('[data-career-sheet-close]'),touch);await p.waitForFunction(()=>!document.querySelector('dialog.career-mission-sheet[open]'));}}
async function home(p,touch=false){
 await ack(p);await closeSheet(p,touch);
 const accountClose=p.locator('#account-root [data-account=close]').first();if(await accountClose.isVisible())await click(p,accountClose,touch);
 if((await snap(p)).ui==='home')return;
 if((await snap(p)).ui==='practice'){await click(p,p.locator('[data-practice=exit]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui!=='practice');}
 if((await snap(p)).ui!=='home')await click(p,p.locator('.indie-bottom-nav [data-game-route=home]'),touch);
 await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');await ack(p);
}
async function hubRoute(p,route,touch){await home(p,touch);await click(p,p.locator(`[data-game-route="${route}"]:visible`).first(),touch);await p.waitForFunction(route=>window.__NOTIFICATION_NINJA__.getSnapshot().ui===route,route);await ack(p);}
async function selectLanguage(p,language,touch){await home(p,touch);await click(p,p.locator(`[data-language=${language}]:visible`).first(),touch);assert.equal((await snap(p)).language,language);}
async function screenshot(p,name){await p.screenshot({path:path.join(out,name+'.png'),fullPage:true});}

async function learning(p,entry,language,scenarios){
 const touch=entry.width<768;await hubRoute(p,'sensei',touch);await geometry(p,`${entry.width}/${language}/sensei`);
 assert.equal(await p.locator('.sensei-path').getAttribute('lang'),language);
 let before=await state(p,'sensei');assert(before&&before.total===12&&before.ranked===false&&before.rewards===false,'Real twelve-case unranked model');
 await click(p,p.locator('[data-sensei-context=study]'),touch);await click(p,p.locator('[data-sensei-scenario=study-streak]'),touch);
 const first=scenarios.find(x=>x.id==='study-streak'),wrong=(first.correct+1)%3;
 const count=(await state(p,'sensei')).completeCount;
 await click(p,p.locator(`[data-sensei-choice="${wrong}"]`),touch);
 assert.equal((await state(p,'sensei')).completeCount,count,'An unsuitable decision cannot advance the journal');
 assert.equal(await p.locator('.sensei-feedback[data-outcome=retry]').count(),1);
 await click(p,p.locator('[data-sensei-action=retry]'),touch);await click(p,p.locator(`[data-sensei-choice="${first.correct}"]`),touch);
 let after=await state(p,'sensei');assert(after.completed.includes(first.id));assert.equal(after.completeCount,count+(before.completed.includes(first.id)?0:1));
 assert.equal(await p.locator('.sensei-feedback[data-outcome=correct]').count(),1);
 assert.equal(await p.locator('.sensei-scenario>h3').innerText(),first[language].title,'Scenario uses the selected language');
 await screenshot(p,`sensei-feedback-${language}-${entry.width}`);
 const completed=[...after.completed];await p.reload();await ready(p);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='sensei');
 assert.deepEqual((await state(p,'sensei')).completed,completed,'Journal survives a real reload');
 // Complete every authored situation once, rather than claiming a cosmetic checklist.
 if(entry.width===360&&language==='de'){
  for(const scenario of scenarios){
   await click(p,p.locator(`[data-sensei-context="${scenario.context}"]`),touch);await click(p,p.locator(`[data-sensei-scenario="${scenario.id}"]`),touch);
   await click(p,p.locator(`[data-sensei-choice="${scenario.correct}"]`),touch);assert.equal((await state(p,'sensei')).feedback.correct,true);
   assert.equal(await p.locator('.sensei-scenario>h3').innerText(),scenario.de.title);
  }
  assert.equal((await state(p,'sensei')).completeCount,12);await click(p,p.locator('[data-sensei-action=next]'),touch);assert.equal((await state(p,'sensei')).finished,true);
  assert.equal(await p.locator('.sensei-completion-total').innerText(),'12 / 12');await screenshot(p,'sensei-complete-360');
 }
 entry.learning.push({language,completed:(await state(p,'sensei')).completeCount,reloaded:true,wrongRetry:true});
 await home(p,touch);
}
async function codex(p,entry,language){
 const touch=entry.width<768;await hubRoute(p,'codex',touch);await geometry(p,`${entry.width}/${language}/codex`);
 const search=p.locator('[data-codex-search]');await search.fill('STREAK');await p.waitForFunction(()=>document.querySelectorAll('[data-codex-id]').length>0);
 assert.equal(await p.locator('[data-codex-id=streak]').count(),1);
 await search.fill('missing-ninja-encyclopedia-entry');await p.waitForFunction(()=>document.querySelectorAll('[data-codex-id]').length===0);
 await click(p,p.locator('[data-codex-action=clear]'),touch);assert(await p.locator('[data-codex-id]').count()>1,'Clear restores canonical entries');
 await search.fill('<img src=x onerror="window.__NINJA_QA_XSS__=true">');await p.waitForFunction(()=>document.querySelectorAll('[data-codex-id]').length===0);assert.equal(await p.evaluate(()=>window.__NINJA_QA_XSS__===true),false,'Search stays text');
 await click(p,p.locator('[data-codex-action=clear]'),touch);
 for(const [context,expected]of [['study','distraction'],['gaming','useful'],['sleep','distraction']]){
  await click(p,p.locator(`[data-codex-context="${context}"]`),touch);assert.equal(await p.locator('[data-codex-id=gaming-invite]').getAttribute('data-codex-kind'),expected,'Canonical context changes the same message meaning');
 }
 await click(p,p.locator('[data-codex-context=gaming]'),touch);await screenshot(p,`codex-${language}-${entry.width}`);
 await click(p,p.locator('[data-codex-action=practice]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='practice');assert.equal(await p.locator('#practice-context').inputValue(),'gaming');
 await click(p,p.locator('[data-practice=exit]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='codex');assert.equal((await state(p,'codex')).context,'gaming','Practice returns to the originating codex context');await home(p,touch);
 entry.codex.push({language,search:true,contextChanges:true,practice:'gaming',returnedToCodex:true,safeText:true});
}
async function dressing(p,entry,language){
 const touch=entry.width<768;await home(p,touch);await click(p,p.locator('.indie-bottom-nav [data-game-route=bazaar]'),touch);await click(p,p.locator('[data-shop-tab=skins]'),touch);
 const before=profile(await snap(p));await click(p,p.locator('[data-skin-preview=solar]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='dressing');
 await geometry(p,`${entry.width}/${language}/dressing`);assert.equal(await p.locator('[data-dressing-skin]').count(),12);
 assert.equal((await p.locator('[data-dressing-action=offer]').innerText()).replace(/\s+/g,' ').trim(),language==='en'?'View offer →':'Zum Angebot →');
 let s=await state(p,'dressing');assert.equal(s.skinId,'solar');assert.equal(s.owned,false);assert.equal(s.equipped,false);
 const frames=s.renderedFrames;await p.waitForFunction(frames=>window.__NOTIFICATION_NINJA__.getSnapshot().experience.dressing.renderedFrames>=frames+2,frames,{timeout:5000});
 if(entry.width===360){for(const id of await p.locator('[data-dressing-skin]').evaluateAll(buttons=>buttons.map(button=>button.dataset.dressingSkin))){await click(p,p.locator(`[data-dressing-skin="${id}"]`),touch);assert.equal((await state(p,'dressing')).skinId,id,'Every canonical outfit has a real selectable preview');assert.deepEqual(profile(await snap(p)),before,'Previewing '+id+' preserves the profile');}await geometry(p,`${entry.width}/${language}/all-outfits`);}
 await click(p,p.locator('[data-dressing-skin=night-guardian]'),touch);assert.equal((await state(p,'dressing')).skinId,'night-guardian');assert.deepEqual(profile(await snap(p)),before,'Unowned preview cannot change ownership or equipped outfit');
 await p.locator('[data-dressing-context]').selectOption('sleep');assert.equal((await state(p,'dressing')).context,'sleep');await screenshot(p,`dressing-${language}-${entry.width}`);
 await click(p,p.locator('.indie-page-tools [data-account-view=profile]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().experience.dressing.suspended===true);
 const suspended=await state(p,'dressing');assert.equal(suspended.animationRunning,false);assert.equal(suspended.rafPending,false);await p.waitForTimeout(120);assert.equal((await state(p,'dressing')).renderedFrames,suspended.renderedFrames,'An account overlay suspends the covered preview');
 await click(p,p.locator('#account-root [data-account=close]').first(),touch);await p.waitForFunction(frames=>window.__NOTIFICATION_NINJA__.getSnapshot().experience.dressing.renderedFrames>=frames+2,suspended.renderedFrames,{timeout:5000});
 await click(p,p.locator('[data-dressing-action=offer]'),touch);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='shop');
 const last=(await snap(p)).experience.lastDressing;assert(last&&last.disposed&&last.active===false&&last.animationRunning===false&&last.rafPending===false,'Leaving disposes the animation');
 await p.waitForTimeout(220);assert.equal((await snap(p)).experience.lastDressing.renderedFrames,last.renderedFrames,'No old preview keeps rendering');
 assert.deepEqual(profile(await snap(p)),before,'Offer navigation cannot perform a purchase');
 entry.dressing.push({language,animated:true,accountOverlaySuspends:true,disposed:true,profilePreserved:true,frames:last.renderedFrames});await home(p,touch);
}
async function career(p,entry,language){
 const touch=entry.width<768;await home(p,touch);await click(p,p.locator('.indie-bottom-nav [data-game-route=campaign]'),touch);await ack(p);
 assert.equal(await p.locator('.nn-career-chapter-trail .nn-career-node').count(),18);
 const before=profile(await snap(p));await click(p,p.locator('[data-mission-inspect=study-02]'),touch);
 const mobile=entry.width<=899;await p.waitForFunction(open=>Boolean(document.querySelector('dialog.career-mission-sheet[open]'))===open,mobile);
 assert.equal(await p.locator('.nn-career-detail').count(),1,'The modal moves the genuine detail instead of duplicating it');
 assert.equal(await p.locator('.nn-career-detail [data-mission-start=study-02]').isDisabled(),true,'The sheet cannot unlock a locked mission');await geometry(p,`${entry.width}/${language}/career-detail`);
 await screenshot(p,`career-detail-${language}-${entry.width}`);
 if(mobile){await closeSheet(p,touch);assert.equal(await p.evaluate(()=>document.activeElement?.dataset.missionInspect),'study-02','Close restores focus to the actual mission');}
 await click(p,p.locator('[data-mission-inspect=study-01]'),touch);assert.equal(await p.locator('.nn-career-detail [data-mission-start=study-01]').isDisabled(),false);
 if(mobile){await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('dialog.career-mission-sheet[open]'));assert.equal((await snap(p)).ui,'career','Escape closes the sheet before leaving the career page');}
 assert.deepEqual(profile(await snap(p)),before,'Mission inspection does not grant progress or coins');entry.career.push({language,mobileSheet:mobile,lockedGate:true,focusRestored:mobile});await home(p,touch);
}
async function comfortUI(p,entry,language){
 const touch=entry.width<768;await home(p,touch);const before=profile(await snap(p));await click(p,p.locator('[data-open-settings]:visible').first(),touch);await geometry(p,`${entry.width}/${language}/comfort`);
 for(const hand of ['left','right']){await click(p,p.locator(`button[data-comfort-hand=${hand}]`),touch);assert.equal((await snap(p)).experience.comfort.hand,hand);assert.equal(await p.evaluate(()=>document.body.dataset.comfortHand),hand);}
 assert.equal(await p.locator('#comfort-haptics').isChecked(),false,'Haptics are opt-in');assert.deepEqual(profile(await snap(p)),before,'Device comfort does not change the game profile');entry.comfort.push({language,localHandChoice:true,hapticsDefaultOff:true});await home(p,touch);
}
async function nativeSwipe(p,item){const r=await p.locator('#world').boundingBox();const session=await p.context().newCDPSession(p);await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+item.x-16,y:r.y+item.y}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+item.x+16,y:r.y+item.y}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();}
async function debrief(p,entry){
 await home(p,true);await click(p,p.locator('[data-language=de]:visible').first(),true);await click(p,p.locator('.indie-bottom-nav [data-game-route=play]'),true);await click(p,p.locator('[data-world-inspect=study]'),true);await click(p,p.locator('[data-quick-context=study]:visible'),true);await ack(p);await click(p,p.locator('[data-action=next]'),true);await ack(p);
 const started=(await snap(p)).state.metrics.cuts;const until=Date.now()+45000;let nextTrace=0,attempts=0;
 while((await snap(p)).state.metrics.cuts===started&&Date.now()<until){await ack(p);const s=await snap(p);assert.equal(s.state.ended,false,'The round must still be live before the native cut');const r=await p.locator('#world').boundingBox();const item=s.state.objects.find(o=>o.kind==='distraction'&&(!o.launch||o.age>=o.launch.windup+o.launch.arc)&&o.x>o.radius&&o.x<r.width-o.radius&&o.y>o.radius+10&&o.y<r.height-o.radius-5&&!s.state.objects.some(v=>v.id!==o.id&&v.kind!=='distraction'&&Math.hypot(v.x-o.x,v.y-o.y)<v.radius+o.radius+24));if(process.env.NINJA_DEBUG_EXPERIENCE==='1'&&Date.now()>=nextTrace){nextTrace=Date.now()+3000;console.log('DEBRIEF_PROBE',JSON.stringify({ui:s.ui,paused:s.state.paused,scene:s.state.scene,mentor:s.mentor.open,viewport:r,game:s.state.viewport,attempts,objects:s.state.objects.map(({id,kind,x,y,radius,age,launch})=>({id,kind,x,y,radius,age,launch})),eligible:item?.id}));}if(item){attempts++;await nativeSwipe(p,item);}await p.waitForTimeout(30);await ack(p);}
 assert((await snap(p)).state.metrics.cuts>started,'Debrief follows a real native cut');for(let attempt=0;attempt<8;attempt++){await ack(p);const current=await snap(p);if(current.ui==='paused'&&!current.mentor.open)break;if(current.ui==='playing')await click(p,p.locator('#pause-button'),true);await p.waitForTimeout(60);}await ack(p);assert.equal((await snap(p)).ui,'paused','The real pause menu must be reached');await click(p,p.locator('[data-action=finish-round]'),true);await ack(p);assert.equal((await snap(p)).ui,'results');
 const s=(await snap(p)).state;for(const [key,value]of [['correct',s.metrics.correctDecisions],['usefulMistakes',s.metrics.usefulMistakes],['missedDistractions',s.metrics.missedDistractions]])assert.equal(Number((await p.locator(`[data-insight-metric=${key}] dd`).innerText()).replace(/[^0-9]/g,'')),value||0,'Debrief uses actual '+key);
 await geometry(p,'360/debrief');await screenshot(p,'round-insights-360');await click(p,p.locator('[data-experience-practice=study]'),true);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='practice');assert.equal(await p.locator('#practice-context').inputValue(),'study');await p.goBack();await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='results');await click(p,p.locator('[data-experience-codex=study]'),true);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='codex');entry.debrief={realCut:true,countsVerified:true,practice:'study',codex:'study'};await home(p,true);
}
async function fixture(charged=false){
 const {NinjaGame,STORAGE_KEY}=await load('game.js'),{GUIDE_IDS}=await load('player.js'),{isThrowReady}=await load('throwers.js');
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v))};let time=Date.now();const game=new NinjaGame({storage,width:336,height:650,seed:51217,now:()=>time});game.enterGuest();game.profile.tutorialCompleted=true;game.profile.player.guideSeen=[...GUIDE_IDS];
 if(charged){game.profile.unlockedSkills=['focus-root','slow-super'];game.profile.selectedSuper='slow-super';assert(game.start({mode:'study',difficulty:'easy',tutorial:false}).ok);assert(game.nextLevel().ok);for(let i=0;i<1800&&game.state.superCharge<100&&!game.state.ended;i++){for(const o of [...game.state.objects])if(o.kind==='distraction'&&isThrowReady(o))game.swipe([{x:o.x-20,y:o.y},{x:o.x+20,y:o.y}]);time+=50;game.update(.05);}assert.equal(game.state.superCharge,100,'Canonical decisions earn the local test charge');game.pause();}
 game.save();return {key:STORAGE_KEY,value:map.get(STORAGE_KEY)};
}
async function seed(context,save){await context.addInitScript(({key,value})=>{if(!localStorage.getItem(key)){localStorage.setItem(key,value);localStorage.setItem('notification-ninja:session:v1','signed-in');}},save);}
async function handGame(browser,report,chargedSave){
 const c=await browser.newContext({serviceWorkers:'block',viewport:{width:360,height:844},hasTouch:true,reducedMotion:'reduce'});await seed(c,chargedSave);const p=await c.newPage();
 try{await p.goto(base);await ready(p);await click(p,p.locator('[data-open-settings]:visible').first(),true);await click(p,p.locator('button[data-comfort-hand=right]'),true);await click(p,p.locator('[data-settings-command=back]'),true);await click(p,p.locator('#continue'),true);await ack(p);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='playing');
 const right=await p.locator('#super-button').boundingBox(),rightRibbon=await p.locator('.hud-sidebar').boundingBox();assert(right&&rightRibbon);await click(p,p.locator('#pause-button'),true);const atPause=(await snap(p)).state.elapsed;await p.waitForTimeout(120);assert.equal((await snap(p)).state.elapsed,atPause);await click(p,p.locator('[data-action=settings]'),true);await click(p,p.locator('button[data-comfort-hand=left]'),true);await click(p,p.locator('[data-settings-command=back]'),true);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='paused');await click(p,p.locator('[data-action=resume]'),true);await ack(p);
 const left=await p.locator('#super-button').boundingBox(),leftRibbon=await p.locator('.hud-sidebar').boundingBox();assert(left&&Math.abs(left.x-right.x)>100,'Hand choice moves the actual Super control');assert(Math.abs(leftRibbon.x-rightRibbon.x)>50,'The ribbon moves to the other side too');
 const before=(await snap(p)).state;assert.equal(before.superCharge,100);await click(p,p.locator('#super-button'),true);const after=(await snap(p)).state;assert.equal(after.metrics.superUses,before.metrics.superUses+1);assert.equal(after.superCharge,0);assert(after.effects.slow>0);await screenshot(p,'left-hand-super-360');report.handGame={right,left,rightRibbon,leftRibbon,canonicalCharge:true,superUses:after.metrics.superUses,pausedClock:true,reducedMotion:(await snap(p)).renderer.reducedMotion};
 }finally{await c.close();}
}
async function calmDressing(browser,report,save){
 const c=await browser.newContext({serviceWorkers:'block',viewport:{width:360,height:844},hasTouch:true,reducedMotion:'reduce'});await seed(c,save);const p=await c.newPage();
 try{await p.goto(base);await ready(p);await click(p,p.locator('.indie-bottom-nav [data-game-route=bazaar]'),true);await click(p,p.locator('[data-shop-tab=skins]'),true);await click(p,p.locator('[data-skin-preview=solar]'),true);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='dressing');await p.waitForLoadState('networkidle');const before=await state(p,'dressing');await p.waitForTimeout(220);const after=await state(p,'dressing');assert.equal(after.reducedMotion,true);assert.equal(after.animationRunning,false);assert.equal(after.rafPending,false);assert.equal(after.renderedFrames,before.renderedFrames,'Calm preview does not render continuously');await click(p,p.locator('[data-dressing-action=next]'),true);assert((await state(p,'dressing')).renderedFrames>after.renderedFrames,'Calm previews still update after a deliberate selection');report.calmPreview={static:true,interactive:true};}finally{await c.close();}
}
async function isolatedLearning(browser,report,save,scenarios){
 const a=await browser.newContext({serviceWorkers:'block',viewport:{width:360,height:844},hasTouch:true});
 const b=await browser.newContext({serviceWorkers:'block',viewport:{width:360,height:844},hasTouch:true});
 const blocked=await browser.newContext({serviceWorkers:'block',viewport:{width:360,height:844},hasTouch:true});
 try{
  for(const c of [a,b,blocked])await seed(c,save);
  await blocked.addInitScript(()=>{const write=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(String(key).startsWith('notification-ninja:sensei-path:'))throw new DOMException('Storage disabled for this learning journal','SecurityError');return write.call(this,key,value);};});
  const pa=await a.newPage(),pb=await b.newPage(),pc=await blocked.newPage();
  for(const p of [pa,pb,pc]){await p.goto(base+'#sensei');await ready(p);assert.equal((await state(p,'sensei')).completeCount,0,'A fresh isolated journal starts empty');}
  const scenario=scenarios.find(item=>item.id==='study-streak');
  await click(pa,pa.locator(`[data-sensei-choice="${scenario.correct}"]`),true);assert.equal((await state(pa,'sensei')).completeCount,1);
  assert.equal((await state(pb,'sensei')).completeCount,0,'A decision in one context cannot leak into a second isolated context');
  const before=profile(await snap(pc));await click(pc,pc.locator(`[data-sensei-choice="${scenario.correct}"]`),true);
  assert.equal((await state(pc,'sensei')).completeCount,1,'Blocked storage still permits a real decision during the open session');assert.equal((await state(pc,'sensei')).available,false);
  assert.equal(await pc.locator('.sensei-storage-warning').count(),1,'A blocked write is explained visibly');assert.deepEqual(profile(await snap(pc)),before,'Blocked journal storage cannot alter game progress');
  await pc.reload();await ready(pc);assert.equal((await state(pc,'sensei')).completeCount,0,'A blocked save never claims persistence after reload');
  report.learningIsolation={independentContexts:true,blockedWriteHonest:true,sessionCompletion:true,noFalsePersistence:true};
 }finally{await Promise.all([a.close(),b.close(),blocked.close()]);}
}
async function offlineExperience(browser,report,save,scenarios){
 const c=await browser.newContext({serviceWorkers:'allow',viewport:{width:360,height:844},hasTouch:true,reducedMotion:'reduce'});await seed(c,save);const p=await c.newPage();
 try{
  await p.goto(base+'#sensei');await ready(p);await p.waitForFunction(()=>Boolean(navigator.serviceWorker?.controller),{},{timeout:20000});
  const cached=await p.evaluate(async version=>({version:(await caches.keys()).some(key=>key.endsWith(':'+version)),art:Boolean(await caches.match(new URL('./assets/indie-journeys.png',document.baseURI).href))}),version);
  assert.equal(cached.version,true,'The current release owns the active offline cache');assert.equal(cached.art,true,'The new journey artwork is actually cached');
  await c.setOffline(true);await p.reload();await ready(p);assert.equal((await snap(p)).ui,'sensei');
  const scenario=scenarios.find(item=>item.id==='study-streak');await click(p,p.locator(`[data-sensei-choice="${scenario.correct}"]`),true);assert.equal((await state(p,'sensei')).completeCount,1,'A cached learning path remains usable offline');
  await p.reload();await ready(p);assert.equal((await state(p,'sensei')).completeCount,1,'Offline reload restores the actual local learning decision');
  await home(p,true);await click(p,p.locator('[data-game-route=codex]:visible').first(),true);assert.equal((await snap(p)).ui,'codex');assert(await p.locator('[data-codex-id]').count()>1,'The canonical codex needs no account service');
  await home(p,true);await click(p,p.locator('.indie-bottom-nav [data-game-route=bazaar]'),true);await click(p,p.locator('[data-shop-tab=skins]'),true);const before=profile(await snap(p));await click(p,p.locator('[data-skin-preview=solar]'),true);assert.equal((await state(p,'dressing')).skinId,'solar');assert.deepEqual(profile(await snap(p)),before,'Offline outfit previews stay read-only');
  await geometry(p,'360/offline-dressing');report.offline={currentCache:true,journeyArt:true,learningReload:true,codex:true,readonlyPreview:true};
 }finally{await c.close();}
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});const scenarios=(await load('sensei-trials.js')).SENSEI_SCENARIOS;const save=await fixture(),chargedSave=await fixture(true);
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});const report={version,viewports:[],issues:[]};
 try{for(const width of widths){const c=await browser.newContext({serviceWorkers:'block',viewport:{width,height:width<768?844:960},hasTouch:width<768,reducedMotion:'no-preference'});await seed(c,save);const p=await c.newPage();const entry={width,learning:[],codex:[],dressing:[],career:[],comfort:[],errors:[]};p.on('pageerror',e=>entry.errors.push(e.message));
  try{await p.goto(base);await ready(p);assert.equal((await snap(p)).ui,'home');const initial=profile(await snap(p));for(const language of (debriefOnly?[]:['de','en'])){await selectLanguage(p,language,width<768);await learning(p,entry,language,scenarios);await codex(p,entry,language);await dressing(p,entry,language);await career(p,entry,language);await comfortUI(p,entry,language);assert.deepEqual(profile(await snap(p)),initial,'Experience menus cannot alter wallet, inventory or saved gameplay');}if(width===360)await debrief(p,entry);assert.deepEqual(entry.errors,[]);entry.ok=true;
  }catch(e){entry.ok=false;entry.failure=e.stack;report.issues.push({width,error:e.message});await p.screenshot({path:path.join(out,`FAIL-${width}.png`),fullPage:true}).catch(()=>{});}finally{report.viewports.push(entry);console.log('EXPERIENCE',width,entry.ok,entry.failure||'');await c.close();}}
  if(!report.issues.length){try{await handGame(browser,report,chargedSave);await calmDressing(browser,report,save);await isolatedLearning(browser,report,save,scenarios);await offlineExperience(browser,report,save,scenarios);}catch(e){report.issues.push({probe:'comfort-calm-isolation-or-offline',error:e.message});console.error('EXPERIENCE EXTRA',e.stack);}}
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({viewports:report.viewports.map(x=>({width:x.width,ok:x.ok})),issues:report.issues},null,2));if(report.issues.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
