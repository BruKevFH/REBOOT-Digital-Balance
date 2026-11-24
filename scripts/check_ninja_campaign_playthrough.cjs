// Complete, real-time campaign playthrough through native browser input.
// No game/profile setters, seed saves, virtual clocks, or direct model mutations.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const base=process.env.NINJA_BASE_URL||'http://127.0.0.1:8083/notification-ninja/';
if(!['127.0.0.1','localhost','[::1]'].includes(new URL(base).hostname))throw Error('Use an isolated local service for a full playthrough.');
const out=path.resolve(process.env.NINJA_TEST_OUTPUT||'test-results/ninja-campaign-playthrough');
const storageFile=process.env.NINJA_CAMPAIGN_STORAGE||'';
const checkpoint=path.resolve(process.env.NINJA_CAMPAIGN_CHECKPOINT||path.join(out,'earned-storage.json'));
const width=Number(process.env.NINJA_CAMPAIGN_WIDTH||1280),height=Number(process.env.NINJA_CAMPAIGN_HEIGHT||900),touch=width<768;
const snap=p=>p.evaluate(()=>window.__NOTIFICATION_NINJA__.getSnapshot());
const report={freshGuest:!storageFile,realTime:true,nativeInput:touch?'touch':'mouse',viewport:{width,height},tutorial:null,missions:[],errors:[],issues:[],complete:false};
let context,page;
function flush(){fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));}
async function ack(p){for(let n=0;n<60&&(await snap(p)).mentor.open;n++){await p.locator('#mentor-next').click();await p.waitForTimeout(20);}}
async function click(p,selector){const target=typeof selector==='string'?p.locator(selector):selector;await target.scrollIntoViewIfNeeded();if(touch)await target.tap();else await target.click();await p.waitForTimeout(35);}
async function ready(p){const version=JSON.parse(fs.readFileSync(path.join(root,'notification-ninja/dist/build.json'))).version;await p.waitForFunction(version=>window.__NOTIFICATION_NINJA__?.getSnapshot().version===version,version);report.version=version;await ack(p);}
async function saveCheckpoint(label){await context.storageState({path:checkpoint});if(label)await context.storageState({path:path.join(out,`earned-${label}.json`)});}
async function home(p){await ack(p);if((await snap(p)).ui==='home')return;const sheet=p.locator('dialog.career-mission-sheet[open]');if(await sheet.count())await click(p,sheet.locator('[data-career-sheet-close]'));const homeButton=p.locator('[data-action=home]:visible,.indie-bottom-nav [data-game-route=home]:visible').first();await click(p,homeButton);await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='home');await ack(p);}
async function swipe(p,item){const rect=await p.locator('#world').boundingBox(),x=rect.x+item.x,y=rect.y+item.y;if(touch){const session=await context.newCDPSession(p);await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-18,y}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+18,y}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();}else{await p.mouse.move(x-18,y);await p.mouse.down();await p.mouse.move(x+18,y,{steps:2});await p.mouse.up();}}
function target(state,rect){return state.objects.find(item=>(item.kind==='distraction'||item.kind==='powerup')&&(!item.launch||item.age>=item.launch.windup+item.launch.arc)&&item.x>item.radius&&item.x<rect.width-item.radius&&item.y>item.radius+12&&item.y<rect.height-item.radius-6&&!state.objects.some(other=>other.id!==item.id&&other.kind==='useful'&&Math.hypot(other.x-item.x,other.y-item.y)<other.radius+item.radius+24));}
async function play(p,{tutorial=false,mission=null}={}){
 const until=Date.now()+(tutorial?180000:240000);let lastProgress=0,attempts=0;
 while(Date.now()<until){
  let s=await snap(p);await ack(p);s=await snap(p);
  if(tutorial&&s.profile.tutorialCompleted&&!s.state.isTutorial)return {tutorialResults:s.state.tutorialResults,attempts};
  if(s.state.ended){await ack(p);return {state:(await snap(p)).state,attempts};}
  if(s.ui==='briefing'){await click(p,'[data-action=next]');continue;}
  if(s.ui==='limit-choice'){await click(p,'[data-action=stop]');continue;}
  if(s.ui==='sleep-choice'){await click(p,'[data-action=stop]');continue;}
  if(s.ui==='paused'){await click(p,'[data-action=resume]');continue;}
  if(s.ui!=='playing'){throw Error('Unexpected game view '+s.ui+' while playing '+(mission?.id||'tutorial'));}
  if(mission?.objective?.metric==='healthy-stop'&&s.state.elapsed>=mission.objective.minElapsed&&s.state.stopAvailable&&(s.state.metrics.correctDecisions||0)>=mission.objective.target){await click(p,'#stop-button');continue;}
  const rect=await p.locator('#world').boundingBox(),item=target(s.state,rect);
  if(item){attempts++;await swipe(p,item);}
  if(Date.now()-lastProgress>10000){lastProgress=Date.now();console.log(JSON.stringify({progress:mission?.id||'tutorial',elapsed:s.state.elapsed,cuts:s.state.metrics.cuts,correct:s.state.metrics.correctDecisions,lives:s.state.lives,paused:s.state.paused}));}
  await p.waitForTimeout(20);
 }
 throw Error('Native real-time round timed out: '+(mission?.id||'tutorial'));
}
async function tutorial(p){
 await click(p,p.locator('[data-open-settings]:visible').first());await click(p,'[data-settings-command=training]');await ack(p);assert.equal((await snap(p)).state.isTutorial,true);
 await p.screenshot({path:path.join(out,'tutorial-briefing.png'),fullPage:true});const result=await play(p,{tutorial:true});assert.equal(result.tutorialResults.reason,'learned');assert(result.tutorialResults.cuts>=2&&result.tutorialResults.passed>=2&&result.tutorialResults.decisions>=6);report.tutorial=result;flush();await home(p);await saveCheckpoint('tutorial');
}
async function mission(p,definition){
 const before=(await snap(p)).profile;await home(p);await click(p,'.indie-bottom-nav [data-game-route=campaign]');await ack(p);
 await click(p,p.locator(`[data-mission-inspect="${definition.id}"]`));await ack(p);const start=p.locator(`[data-mission-start="${definition.id}"]:visible`).first();assert(await start.isEnabled(),'Actual mission must be available: '+definition.id);await click(p,start);await ack(p);
 assert.equal((await snap(p)).state.missionId,definition.id);const actual=await play(p,{mission:definition});await p.waitForFunction(()=>window.__NOTIFICATION_NINJA__.getSnapshot().ui==='results');await ack(p);const after=await snap(p);
 const entry={id:definition.id,title:definition.title,duration:definition.duration,result:after.state.result,elapsed:after.state.elapsed,attempts:actual.attempts,correct:after.state.metrics.correctDecisions,useful:after.state.metrics.usefulPassed,errors:after.state.metrics.usefulMistakes+after.state.metrics.missedDistractions+(after.state.metrics.shieldedMistakes||0),bestStreak:after.state.bestDecisionStreak,coinsBefore:before.coins,coinsAfterRun:after.profile.coins,earnedRunCoins:after.state.awardedCoins,completed:after.profile.adventure.completed.includes(definition.id),claimed:false,worlds:[...after.profile.unlockedWorlds]};report.missions.push(entry);flush();await p.screenshot({path:path.join(out,`${definition.id}-result.png`),fullPage:true});
 if(!entry.completed)throw Error('Mission target not completed through native input: '+JSON.stringify(entry));
 const claim=p.locator(`[data-career-claim="${definition.id}"]:visible`);assert.equal(await claim.count(),1,'Explicit first reward is shown');await click(p,claim);await ack(p);const claimed=await snap(p);entry.claimed=claimed.profile.adventure.claimed.includes(definition.id);entry.coinsAfterClaim=claimed.profile.coins;assert.equal(entry.coinsAfterClaim,entry.coinsAfterRun+definition.reward,'Exactly the authored mission reward is credited once');assert(entry.claimed);
 await saveCheckpoint(definition.id);flush();console.log('MISSION PASSED '+JSON.stringify(entry));
 if(definition.order===6){const earned=await snap(p);await p.reload();await ready(p);const restored=await snap(p);assert.deepEqual(restored.profile.adventure.completed,earned.profile.adventure.completed);assert.deepEqual(restored.profile.adventure.claimed,earned.profile.adventure.claimed);assert.equal(restored.profile.coins,earned.profile.coins);entry.reloadPersistence=true;await saveCheckpoint(`chapter-${definition.chapter}`);flush();}
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});fs.mkdirSync(path.dirname(checkpoint),{recursive:true});
 const {MAIN_MISSIONS}=await import(pathToFileURL(path.join(root,'notification-ninja/src/adventure.js')).href);
 const wanted=process.env.NINJA_CAMPAIGN_MISSIONS?process.env.NINJA_CAMPAIGN_MISSIONS.split(','):null,missions=wanted?MAIN_MISSIONS.filter(m=>wanted.includes(m.id)):MAIN_MISSIONS;
 assert(!wanted||missions.length===wanted.length,'Only known authored mission IDs are accepted');
 const browser=await chromium.launch({executablePath:process.env.NINJA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
 try{
  context=await browser.newContext({serviceWorkers:'block',viewport:{width,height},hasTouch:touch,...(storageFile?{storageState:storageFile}:{})});page=await context.newPage();page.on('pageerror',e=>{report.errors.push(e.message);flush();});
  await page.goto(base+(storageFile?'':'index.html#guest'));await ready(page);assert.equal((await snap(page)).session.kind,'guest');
  if(!storageFile){const fresh=await snap(page);assert.equal(fresh.profile.totalRuns,0);assert.deepEqual(fresh.profile.adventure.completed,[]);await tutorial(page);}
  for(const definition of missions)await mission(page,definition);
  const final=await snap(page);assert.deepEqual(report.errors,[]);report.final={completed:final.profile.adventure.completed,claimed:final.profile.adventure.claimed,coins:final.profile.coins,unlockedWorlds:final.profile.unlockedWorlds,totalRuns:final.profile.totalRuns};report.complete=true;await saveCheckpoint('final');flush();console.log('CAMPAIGN COMPLETE '+JSON.stringify(report.final));
 }catch(error){report.issues.push(error.stack);if(page){await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{});report.failureSnapshot=await snap(page).catch(()=>null);await saveCheckpoint('failure').catch(()=>{});}flush();console.error(error.stack);process.exitCode=1;}
 finally{await context?.close();await browser.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
